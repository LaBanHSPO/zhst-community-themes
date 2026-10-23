# Localcraft

A home-services website theme for [EmDash](https://emdashcms.com/), aimed at handyman teams, painters,
plumbers and independent home-service businesses. It explains what you do, where you work and how
customers can request a quote or a callback, in a direct layout with large call buttons.

Localcraft is a standalone EmDash site that runs on Node.js with SQLite and local file storage. No cloud
account, credentials or private platform access is needed. All sample content is synthetic.

## Pages

| Page           | Path               | What it shows                                                                                          |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------ |
| Home           | `/`                | Hero, service cards, "Get in touch" inquiry panel, service-area strip, recent work                     |
| Services       | `/services`        | Every service as a card                                                                                |
| Service detail | `/services/[slug]` | Description, **What's included / Not included**, typical job note, areas covered, inquiry form showing the service name |
| Service areas  | `/areas`           | Each area with notes and the services available there                                                  |
| About          | `/about`           | About text, team introductions, work gallery                                                           |
| Contact        | `/contact`         | Phone, email and base, "what happens next", inquiry form                                               |
| Other pages    | `/[slug]`          | Any extra entry in the `pages` collection                                                              |
| Not found      | any unknown path   | 404 page with links home and to services (HTTP 404)                                                    |

## Scope implemented

- **Service pages with a clear scope.** The `services` collection has `included` and `not_included` fields
  (one item per line), shown side by side on every service detail page.
- **Service-area information.** The `areas` collection describes each neighbourhood. Services link to areas
  via the `area` taxonomy, where each term slug matches an `areas` entry slug. Service detail pages list the
  areas they cover, and the areas page lists the services in each area. An `area` term without a matching
  `areas` entry is still listed.
- **Work gallery and team introduction.** The `gallery` and `team` collections appear on About; the home
  page shows up to four gallery items. Team members without a photo get an initials badge.
- **Phone and contact calls to action.** Phone, email and office hours come from the single `business`
  entry (slug `details`) and render as `tel:` / `mailto:` links. They appear in the header, in every inquiry
  panel, on the contact page and in the footer. Below 860px a sticky bar with **Call now** and **Request a
  quote** stays visible. Call and email links are hidden if the values are missing or malformed.
- **Quote or callback inquiry form.** This uses the official forms plugin and appears on Home, Contact and
  the bottom of every service detail. On a service page, the service name is shown above the form and
  pre-filled into a `service` field if the form has one.

## Out of scope

A quote or callback request is an **enquiry**. The theme does not offer, and its copy does not promise:
confirmed bookings, availability checks or calendars, automatic or fixed price estimates, or technician
dispatch. Each of these would need separate implementation work. There are no reviews, ratings or licence
claims, and no maps, WhatsApp, PWA or checkout.

## Requirements

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm
- Pinned baseline: **EmDash 1.2.0**, **Astro 7.3.5**, `@astrojs/node` adapter, React 19.2.4. The project
  owns its `package-lock.json`; there is no root install.

## Set up locally

```sh
npm ci
npx emdash secrets generate --write .env   # private, gitignored; never commit or share
npm run dev
```

Astro 7 starts the dev server in the background and prints its PID. Stop it with `npx astro dev stop`.

**Seed.** Open `/_emdash/admin/` and complete setup with sample content. You can also apply the seed from the
CLI against the local database:

```sh
npx emdash seed seed/seed.json            # schema + sample content
npx emdash seed seed/seed.json --no-content   # schema only (empty-state check)
```

Seed images are plain files in `public/media/`. Seed image fields point at them as external media
values (`{"provider": "external", "src": "/media/…", "alt": "…"}`). Nothing is downloaded during seeding.

**Create the inquiry form (required for the form to appear).** Forms live in the plugin's storage, not in
the seed. Until a form with slug `inquiry` exists, `<Form id="inquiry" />` renders nothing. The panel then
shows a short note plus the phone and email links, so the page still works.

1. Sign in to `/_emdash/admin/` and open **Plugins → Forms**.
2. Create a form named e.g. "Quote or callback request" with slug **`inquiry`**.
3. Add fields (suggested names keep the service pre-fill working):
   - `name`: Text, required, half width
   - `phone`: Phone, required, half width
   - `email`: Email, optional, half width
   - `area`: Text "Suburb or area", required, half width
   - `service`: Text, optional (pre-filled on service pages)
   - `request_type`: Radio "What would you like?" with options `quote` / `callback`, required
   - `description`: Textarea "Your project", required
4. Settings: submit label "Request a quote"; set a confirmation message that does not imply a booking (e.g.
   "Thanks. We have your request and will be in touch to talk it through. This is not a confirmed
   booking."). Keep honeypot spam protection. Optionally add notification emails.
5. Submissions appear under **Plugins → Forms → Submissions**.

## Checks

```sh
npm run typecheck
npm run build
npm run preview
```

## Dependencies and capabilities

| Package                                  | Version       | License | Why                                       |
| ---------------------------------------- | ------------- | ------- | ----------------------------------------- |
| `emdash`                                 | 1.2.0         | MIT     | CMS runtime                               |
| `astro`                                  | 7.3.5         | MIT     | Framework                                 |
| `@astrojs/node`, `@astrojs/react`        | ^11.1.5, ^6.0.5 | MIT   | Node adapter, React islands (admin)       |
| `react`, `react-dom`                     | 19.2.4        | MIT     | Required by EmDash admin                  |
| `@emdash-cms/plugin-forms`               | 0.2.11        | MIT     | Inquiry form + submissions                |
| `@cloudflare/kumo`                       | 2.6.0         | MIT     | Peer dependency of the forms plugin admin |
| `@phosphor-icons/react`                  | 2.1.10        | MIT     | Peer dependency of the forms plugin admin |
| `@fontsource-variable/plus-jakarta-sans` | 5.3.0         | OFL-1.1 | Self-hosted typeface                      |

**Forms plugin capabilities.** The plugin declares `email:send`, `media:write` and `network:request`, with
`allowedHosts: ["*"]`. These cover notification and autoresponder email, file-upload fields and an optional
webhook to any host. It also stores submissions (personal data such as names, phone numbers and emails) in
the site database. Set a retention period under the form settings if needed. In local use, no email is sent
unless an email provider is configured, and no webhook is called unless you set one.

**External requests at runtime:** none from the theme. Fonts are bundled locally; there is no Google Fonts
or other CDN. **Browser storage:** the forms plugin client may save in-progress form state in the browser;
the theme itself stores nothing. The menu toggle and the service pre-fill are small inline scripts.

## Asset provenance and licenses

- `public/media/*.jpg`: crops of `localcraft-cover.png`, the theme's AI-generated concept art, which belongs
  to the contributor. They were cropped with Pillow and saved as JPEG; no third-party images were downloaded.
  The people, signage and workshop shown are not real.
- Service icons and the house logo are original inline SVGs in `src/components/Icon.astro` and
  `src/layouts/Base.astro` (MIT, this repository).
- Plus Jakarta Sans is © The Plus Jakarta Sans Project Authors, SIL Open Font License 1.1, via Fontsource.
- All business details, people, suburbs, phone numbers (`+1 555 01xx` fictional range) and emails
  (`example.com`) are invented.

## Tested evidence

Tested on macOS with Node 24.21.0 and npm 11.19.0, against a fresh local `data.db`:

- `npm run typecheck`: 0 errors, 0 warnings, 0 hints (20 files).
- `npm run build`: passed (Node adapter, standalone).
- Before seeding content, the home page rendered its empty states ("Services will appear here…").
- After `npx emdash seed seed/seed.json` (24 entries, 5 area terms, 4 menu items), every route returned
  HTTP 200: `/`, `/services`, all six `/services/[slug]`, `/areas`, `/about` and `/contact`. Unknown paths
  and unknown service slugs returned 404.
- `tel:+15550142` and `mailto:hello@localcraft.example.com` were present in the header, inquiry panel and
  footer.
- After creating the `inquiry` form, the form rendered on `/`, `/contact` and service pages, with the service
  name pre-filled. A synthetic test submission was accepted and listed under the form's submissions.
- Screenshots were taken at 1440px and 375px. On mobile, the menu toggle sets `aria-expanded` correctly and
  Escape closes it. The sticky call bar was visible.
- Accessibility measures in place: skip link, landmarks (`header`, `nav`, `main`, `footer`), a single `h1`
  per page, visible `:focus-visible` outlines, alt text from image fields, and `prefers-reduced-motion`
  respected. No automated audit (axe/Lighthouse) or screen-reader pass was run.
- Not tested: Cloudflare adapter, dark mode (not supported, light only), RTL (not supported).

## Known limitations

- Seed images are small crops (about 220–930px wide) of a single concept image, so some look soft when
  enlarged. Replace them with real job photos.
- Area coverage relies on matching slugs between `areas` entries and `area` terms. If you rename one, rename
  the other.
- The inquiry form must be created by hand in the admin (see above). Without it, only phone and email
  contact is shown.
- English only; no i18n configuration.

## Migration and removal

This is a new theme; no existing installation is affected. Removing it leaves the collections
(`business`, `services`, `areas`, `team`, `gallery`, `pages`), the `area` taxonomy, the primary menu, the
forms-plugin data (forms and submissions) and the database. None of these are deleted automatically.

## License

MIT, with third-party notices as listed above.
