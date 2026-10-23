# Forma

**Make your work the reason they get in touch.** Forma is an editorial portfolio theme for
[EmDash](https://emdashcms.com/) aimed at design studios, branding agencies, photographers and
independent creatives. Selected projects lead the site, each case study explains the brief, the
approach and the outcome, and every path ends at a focused new-project inquiry.

It is a standalone EmDash host that runs on any Node.js server with SQLite and local file storage.
It needs no cloud account, credentials or private platform access.

## Pages

| Page | Path | What it shows |
| --- | --- | --- |
| Home | `/` | Large serif headline, intro, "View selected work" call to action, hero image, a selected-work editorial grid, a services teaser and an inquiry band |
| Work | `/work` | All projects in an editorial grid; filter by discipline with `?discipline=<slug>`, with an empty state for disciplines that have no projects |
| Project detail | `/work/<slug>` | Title, summary, project facts (client, year, location, discipline, scope), a large cover, separate **The brief / Approach / Outcome** sections, an image gallery, a "Start a project" CTA linking to Contact, and the next project |
| Services | `/services` | Numbered services with deliverables, then the project process steps |
| Studio | `/studio` | Studio story, studio details and working principles |
| Contact | `/contact` | Studio contact details (always visible) next to the new-project inquiry form |
| Other pages | `/<slug>` | Any other entry in `pages` (for example a privacy page). `/home` redirects to `/` |
| Not found | any unknown URL | Styled 404 page (HTTP 404) |

## Scope implemented

- **Selected-work editorial grid:** a `projects` collection with a "Selected work" flag and an order
  field. The home page shows the selected projects, or the newest ones if none are flagged.
- **Disciplines:** a `discipline` taxonomy. Work filters by query parameter, shows an empty state for
  an unknown or empty discipline, and paginates past 12 projects.
- **Case studies:** `brief`, `approach` and `outcome` are separate Portable Text fields, rendered as
  numbered sections.
- **Image-led project detail:** a full-width cover and a gallery repeater (image, caption, full or half
  width).
- **Service and studio pages:** a `services` collection, plus structured `pages` fields (`eyebrow`,
  `lede`, `hero_image`, `content`, `points` and `facts`) for the Home, Services, Studio and Contact pages.
- **New-project inquiry:** `@emdash-cms/plugin-forms` renders the form on `/contact`. Every project ends
  with a CTA to `/contact?project=<slug>`, and Contact acknowledges the project the visitor came from.
- **Responsive and accessible:** a mobile menu at narrow widths, a skip link, visible focus, semantic
  landmarks and headings, alt text on all seeded images, AA-contrast accent buttons, and transitions
  disabled under `prefers-reduced-motion`.
- **Graceful fallbacks:** empty collections, missing optional images (a placeholder letter is shown),
  missing pages and a missing form all degrade without errors.

## Out of scope

- Awards, client logos, testimonials and measured business results. The seed contains none of these.
  Only add them when you have evidence and permission to publish them.
- Booking, payments, maps, chat or WhatsApp integrations, PWA support, multilingual content, dark mode
  and RTL layouts. None of these are implemented.
- Team or people profiles, a blog/journal, and site search UI.
- Creating the inquiry form automatically. Forms are created in the admin (see below).

## Requirements

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm
- The project pins **EmDash 1.2.0** and **Astro 7.3.5** exactly, and owns its own `package-lock.json`.

## Setup

```sh
npm ci
npx emdash secrets generate --write .env   # local secret; keep .env private
npm run dev
```

Open the URL Astro prints (normally `http://localhost:4321/`). Then load the sample content in one of
two ways:

- open `/_emdash/admin/` and complete the setup wizard, including the Forma sample content; or
- run `npx emdash seed seed/seed.json` before starting the server (it writes `./data.db`).

Public pages render before setup is completed. You need an administrator account to edit content.

### Create the inquiry form (admin)

The form plugin keeps forms in its own storage, so the seed cannot create one. Until a form with slug
`inquiry` exists, `<Form id="inquiry" />` renders nothing and Contact shows the email prompt instead.
To create the form:

1. Sign in at `/_emdash/admin/` and open **Plugins → Forms**.
2. Create a form named "New project inquiry" with the slug **`inquiry`**.
3. Add these fields:
   - Name (text, required, half width)
   - Email (email, required, half width)
   - Budget range (select, for example: Under €10k / €10k–€25k / €25k–€50k / Over €50k / Not sure yet)
   - Timeline (text, half width)
   - About the project (textarea, required)
4. Set the submit label (for example "Send inquiry") and a confirmation message. Optionally add
   notification emails.
5. Save and reload `/contact`. Submissions appear under **Plugins → Forms → Submissions**.

To change the slug, edit `INQUIRY_FORM_ID` in `src/pages/contact.astro`.

### Customise

- Contact details live in the `contact` page's **Details** repeater (label, value, optional link such
  as `mailto:`). Studio details use the same repeater.
- The design tokens are in `:root` in `src/styles/global.css`.
- The navigation comes from the `primary` menu.

## Checks

```sh
npm run typecheck
npm run build
npm run preview
```

## Dependencies and capabilities

| Package | Version | License | Why |
| --- | --- | --- | --- |
| `emdash`, `astro`, `@astrojs/node`, `@astrojs/react`, `react`, `react-dom` | 1.2.0 / 7.3.5 / ^11.1.5 / ^6.0.5 / 19.2.4 | MIT | Baseline EmDash host |
| `@emdash-cms/plugin-forms` | 0.2.11 | MIT | Inquiry form and submissions |
| `@cloudflare/kumo` | 2.6.0 | MIT | Peer dependency of the forms plugin (admin UI) |
| `@phosphor-icons/react` | 2.1.10 | MIT | Peer dependency of the forms plugin (admin UI) |
| `@fontsource-variable/newsreader` | 5.3.0 | Font: SIL OFL 1.1 | Display typeface, self-hosted |
| `@fontsource-variable/manrope` | 5.3.0 | Font: SIL OFL 1.1 | Body typeface, self-hosted |

**Forms plugin capabilities.** The plugin declares `email:send`, `media:write` and
`network:request`, with `allowedHosts: ["*"]`. In practice:

- it can send notification and autoresponder emails when those are configured;
- it can store file uploads if a form uses a file field;
- it can call any host, which is used for an optional webhook URL and optional Cloudflare Turnstile
  verification.

Submissions, including visitors' names, emails and messages, are stored in the site database. Set a
retention period in the form settings if you need one. Nothing runs until you create a form.

The theme's own code makes no external requests, stores nothing in the browser beyond the EmDash
defaults, and needs no bindings. Fonts are bundled at build time; there are no font CDN calls at runtime.

## Asset provenance and licenses

The sample images in `public/seed-media/` are crops of a single AI-generated concept image (the Forma
listing cover) owned by the theme author. They were cut with macOS `sips`, without third-party images
or downloads. All projects, clients ("AKA Skincare", "Halden Paper Works", "Casa Ombra Gallery",
"Ember Tea Co.", a private residence) and the studio itself are fictional. Text such as
"A QUIETER TOMORROW" on the boxes is part of that generated artwork.

Because EmDash 1.2.0 seed `$media` references only download remote URLs, the seed refers to these
bundled files as external media values (`{ provider: "external", src: "/seed-media/…" }`). They render
through `<Image>` like any other image. Uploads made in the admin go to the normal media library.

Images are released with the repository under MIT. The fonts keep their SIL Open Font License 1.1.

## Tested evidence

Tested locally on macOS with Node v24.21.0 and npm 11.19.0, using the Node adapter only. Resolved
versions: emdash 1.2.0, astro 7.3.5, @astrojs/node 11.1.7, @astrojs/react 6.0.6, react 19.2.4 and
@emdash-cms/plugin-forms 0.2.11.

- `npm run typecheck`: 0 errors, 0 warnings, 0 hints (19 files).
- `npm run build`: completed. Vite warned about a chunk over 500 kB from the admin bundle.
- Dev and `npm run preview` on the seeded DB:
  - every route returned HTTP 200, including `/`, `/work`, all five `?discipline=` filters, an unknown
    discipline, an injected discipline value, all five project pages, `/services`, `/studio`,
    `/contact` and `/contact?project=aka`;
  - `/home` returned 301 to `/`;
  - unknown pages and unknown projects returned 404.
- Schema-only DB (`npx emdash seed --no-content`): every public route returned 200 and showed its empty
  state; a removed project returned 404.
- Inquiry form: created with slug `inquiry` through the forms admin API (dev bypass). It rendered on
  `/contact`, a test submission was accepted, and the submission appeared in the plugin's submissions
  list.
- Screenshots were taken at 1440 px and 375 px wide (home, work, project detail, services, studio,
  contact, and the open mobile menu) and compared against the concept cover.

These checks were not run:

- Cloudflare adapter compatibility.
- An automated accessibility audit or a screen-reader pass. Accessibility was checked only by markup
  review and keyboard-visible focus styles.
- Email delivery.

## Known limitations

- The seed images are small crops (about 140–640 px wide), so large frames upscale them and they look
  soft. Replace them with high-resolution project photography.
- The bundled seed images are not entries in the EmDash media library. Editors swap them by picking a
  new image in the admin.
- `/contact` uses CSS `:has()` to restyle the email prompt when the form is present. Browsers without
  `:has()` show the full email prompt below the form.
- Light mode only. There is no dark mode.
- The Work count shows `12+` when there are more pages; the full total is not computed.

## License

MIT. Preserve the upstream EmDash and Astro notices and the licenses listed above.
