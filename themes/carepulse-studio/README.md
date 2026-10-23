# CarePulse Studio

A wellness practice theme for [EmDash](https://emdashcms.com/). It uses the [CarePulse](../carepulse/)
data model with a studio layout: a serif “CarePulse” wordmark with a leaf mark, an illustrated hero
with the site tagline and an Inquire button, “Our Services” cards, and a right rail with opening
hours and an appointment inquiry panel. The palette is warm ivory, sage green and muted peach.

Public pages include a small “Powered by ZeroHost CMS” credit linking to
[CarePulse Studio one-click deployment](https://zerohostcms.com/themes/carepulse-studio). The
[theme credit component](src/components/theme-credit.astro) owns this link. It uses no tracking.

## What is the same as CarePulse

- **Content model.** The `services`, `posts` (health notes) and `pages` collections and their fields
  are unchanged. The `category` taxonomy now also covers `posts` (see
  [Post categories](#post-categories-existing-sites)). A CarePulse installation's records work as-is.
- **Routes.** `/`, `/services`, `/posts`, `/posts/[slug]`, `/[slug]`, `/category/[slug]`,
  `/tag/[slug]` and `/404` are kept.
- **Inquiries, not bookings.** There is no booking engine or calendar. An inquiry is a message the
  practice answers by email; the form says so.

## What is new

- `/services/[slug]` — a service page for the collection's existing `/services/{slug}` URL pattern
  (description, duration, price and availability).
- Two optional widget areas: `home-intro` (the line under the home heading) and `opening-hours`
  (one paragraph per line, written as `Day: hours`). Empty areas render nothing.
- `/category/[slug]` lists the services in that category (by their `category` field) and the health
  notes assigned to the term. Post pages link to their categories.
- `/contact` — the CMS `contact` page plus a working **appointment inquiry form**; the home right
  rail shows a compact version. See [Appointment inquiry form](#appointment-inquiry-form).
- Artwork is CSS and inline SVG; the seed ships no media. Health notes show their featured image
  when one is set.

## Requirements

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`
- npm

The project pins **EmDash 1.2.0** and **Astro 7.3.5** exactly. It owns its own `package-lock.json`.

## Develop locally

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The env file is
private and ignored; never commit it. To keep the database and uploads outside the project folder,
set `CAREPULSE_DATA_DIR=/some/dir` (default: `./data.db` and `./uploads`, as in CarePulse). The path
is read by `astro.config.mjs`, so for a production build set it **when running `npm run build`**;
setting it only for `npm start` has no effect.

## Appointment inquiry form

The form uses the official [EmDash Forms plugin](https://www.npmjs.com/package/@emdash-cms/plugin-forms)
(`@emdash-cms/plugin-forms`), registered in `astro.config.mjs`.

**How it works.** `/contact` and the home panel render a plain server-side `<form method="post">`
(`src/components/InquiryForm.astro`). It posts to `/contact`, which checks the request comes from the
same host, rejects bodies over 16 KB, validates every field on the server and re-renders the page
with inline errors and an error summary. A valid inquiry is passed to the plugin's public `submit`
route through EmDash's SSR dispatcher (`getPublicPluginApiRouteHandler` from `emdash/plugin-utils`),
then the visitor is redirected (303) to `/contact?inquiry=received#inquiry`, which says "We received
your inquiry. This is not a confirmed appointment." No JavaScript is needed, and the form makes no
third-party requests.

Fields: name, email, service (optional; only the names of published, available services from the
`services` collection are accepted), preferred day or time (optional free text, full form only),
message (up to 2000 characters) and a required consent checkbox. A hidden honeypot field is sent to
the plugin as `_hp`; when it is filled the plugin reports success and stores nothing. The plugin has
no rate limiting; use your host's or CDN's rate limiting if you need it.

**What is stored.** The plugin stores each inquiry (the fields above plus the time it was sent) in
the site database (`_plugin_storage`). Because the theme forwards it server-side, the plugin's
IP, user-agent, referrer and country metadata are stored empty. Nothing is logged by the theme and
nothing is shown on public pages. Admins read inquiries under **Plugins → Forms → Submissions**
(and can export CSV/JSON or delete them).

### Create the form (once per site)

The EmDash seed format has no section for plugin data, so the form is not created by the seed. Until
it exists, the theme shows the previous behaviour (inquiry links to the `contact` page, no form).
Create it from the definition in `forms/appointment-inquiry.json` in one of two ways:

- **Script:** create an API token with the `admin` scope (admin → Settings → API Tokens), then run
  `EMDASH_TOKEN=<token> node scripts/create-inquiry-form.mjs --url https://your-site`. Running it again
  fails with 409 because the slug already exists.
- **Admin:** Plugins → Forms → new form, slug **`appointment-inquiry`**, spam protection *Honeypot*,
  with fields `name` (Text, required), `email` (Email, required), `service` (Text),
  `preferred_time` (Text), `message` (Textarea, required) and `consent` (Checkbox, required). The
  field names must match.

To stop accepting inquiries, pause the form in the plugin admin; the page falls back to the link.
Notification emails and webhooks are optional plugin settings and send nothing unless configured.

### Dependency and permissions

| Package | Version | License | Why |
| --- | --- | --- | --- |
| `@emdash-cms/plugin-forms` | 0.2.11 | MIT | Stores inquiries; admin Forms and Submissions pages |
| `@cloudflare/kumo` | 2.6.0 | MIT | Peer dependency of the Forms plugin admin UI |
| `@phosphor-icons/react` | 2.1.10 | MIT | Peer dependency of the Forms plugin admin UI |

The plugin declares `peerDependencies.emdash: ">=0.11.0"` and runs on the pinned EmDash 1.2.0. It
declares the capabilities `email:send`, `media:write` and `network:request` (`allowedHosts: ["*"]`),
adds public routes `/_emdash/api/plugins/emdash-forms/submit` and `/definition`, admin routes for
forms and submissions, an admin dashboard widget and a weekly cleanup cron. It needs **no external
service and no binding**: storage is the site database. Outbound requests happen only if an admin
configures notification email (needs an email provider), a webhook or Cloudflare Turnstile.

## Post categories (existing sites)

The seed's `category` taxonomy now covers `services` and `posts`, and the sample notes have
categories (Welcome and Small daily habits: Wellness; Preparing for your first visit: Therapy).
**A changed seed only affects new databases** (EmDash applies the seed once, at first setup; see
EmDash's "Evolve a deployed site's schema" guide). On a site that was installed earlier:

1. Enable the taxonomy for health notes. The EmDash 1.2.0 admin creates taxonomies but has no control
   to change an existing taxonomy's collections, so use the REST API with an admin token:
   `curl -X PUT https://your-site/_emdash/api/taxonomies/category -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -H "X-EmDash-Request: 1" -d '{"collections":["services","posts"]}'`.
   This changes no content and can be reverted by sending `["services"]`.
2. Assign categories to health notes in the admin post editor. A note that already carries a
   category (the CarePulse seed gave the welcome note *Wellness*) appears on its category page as soon
   as step 1 is done.
3. Optionally run `npx emdash export-seed` to keep your own seed in sync.

**If the theme is removed**, the taxonomy setting and post assignments stay in the database and keep
working with any theme that reads them; the base CarePulse category page simply did not list posts.
Inquiry submissions also stay in the database, but they are only visible in the admin while the
Forms plugin is registered, so export them (CSV/JSON) before removing the plugin, and delete them
when you no longer need them.

## Checks

```sh
npm run typecheck
npm run build
npm run seed:validate
```

## Provenance

Forked from the CarePulse community theme (`create-emdash@1.2.0`, starter template). Sample content
is synthetic: the services, opening hours, notes and contact address (`hello@example.com`) are
invented. Nothing on the demo site is medical advice. No private ZeroHostCMS code, credentials or
customer data is used.

## License

MIT. Preserve upstream EmDash/Astro notices and the licenses of any third-party assets you add.
