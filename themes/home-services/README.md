# Home Services (home-services)

A bright home-maintenance theme for [EmDash](https://emdashcms.com/), shown with the fictional
company "HearthFix". It pairs a light photo hero (a smiling technician in front of a modern white
house, faded to white on the left) with a very large heavy navy sans headline, solid green
rounded buttons, an off-white services section with rounded photo cards, and a navy line-icon house
wordmark. It ships services with detail pages, projects with before/after notes, an about page with
values and a team (initials), a request-a-quote contact page and CMS pages, all driven by
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on
any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 07 ("A better home starts here." /
"Request a quote"); below the fold it adds how-it-works steps, recent projects, a service area and
hours band and a quote band.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero with "Repair Maintain Improve" eyebrow, headline, paragraph, "Request a quote" button, three trust items and the "Safer / Cleaner / Brighter / Together" note; "Care for every corner." with three featured service cards; how-it-works steps; three recent projects; service area and hours band; quote band |
| `/services` | All services as photo cards, how-it-works steps, quote band |
| `/services/[slug]` | Service detail: icon, summary, intro, photo, Portable Text content, "What is included", typical visit, "Request a quote" (pre-selects the service on the contact form), other services |
| `/projects` | All projects as cards (service label, neighbourhood, short description) |
| `/projects/[slug]` | Project: facts (service, neighbourhood, time on site, completed), photo, Before / After notes, write-up, other projects |
| `/about` | About: CMS page `about`, a photo, "What we value", team monograms (initials only) |
| `/contact` | Request a quote: form with service pre-selection via `?service=`; phone, email, service area, hours and workshop address are always shown beside it |
| `/[slug]` | CMS pages (`privacy` is seeded) |
| `404` | Styled not-found page (unknown pages, services and projects render it with HTTP 404) |

The primary menu (`Services · About · Projects · Contact`) is an EmDash menu and can be edited in
the admin. CMS pages that are not in the menu are listed in the footer automatically. Below 960px
the navigation collapses into a button that opens a panel (a native `<details>` element, so it works
without JavaScript) with the menu, "Request a quote" and the phone number. Below 1280px the
decorative note on the hero photo is hidden; below 860px the hero copy sits above the photo.

## Collections

- **services**: name, one-line summary, "show on the homepage" flag (the homepage shows up to three),
  sort order, icon (`drop`, `bolt`, `roller`, `wrench`, `house`), intro, Portable Text content,
  included items (one per line), typical visit, `image` + `photo`.
- **projects**: name, short description, service label, neighbourhood, time on site, before, after,
  completed date, sort order, Portable Text write-up, `featured_image` + `photo`.
- **people** (Team): name, role, short bio, sort order. Shown as initials, not photographs.
- **principles** (Values): title, text, sort order.
- **steps** (How it works): title, text, sort order.
- **office** (Contact details): one entry: company name, street, city/state/ZIP, country, phone,
  enquiries email, hours, service area and the response note.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug
  `about` feeds `/about`.

Site settings: the title ("HearthFix") is the heavy wordmark and the tagline ("Home Services") the
small tracked caps line under it; an uploaded logo replaces the whole wordmark. Image-bearing entries
render the uploaded CMS image when present and otherwise the bundled `photo` path in
`public/images/`. Empty collections are handled in the templates.

## Quote requests

The contact form validates in the browser (name, email and message required, inline errors), then
opens the visitor's email app with a pre-filled request addressed to the office email. Nothing is sent
or stored by the site, and the status message says so; without JavaScript the email address is shown
instead. `/contact?service=Plumbing` (the "Request a quote" buttons on service pages do this)
pre-selects the service; unknown values are ignored. The hosted ZeroHostCMS native inquiry handler
is the intended production route; it is not wired into this standalone theme.

## Fonts, images and external requests

- **Font**: [Plus Jakarta Sans](https://github.com/tokotype/PlusJakartaSans) (variable, 200–800)
  self-hosted through `@fontsource-variable/plus-jakarta-sans` (no font CDN). SIL Open Font License
  1.1, © The Plus Jakarta Sans Project Authors. It stands in for the design's heavier geometric sans:
  letter shapes are close, and word spacing is tightened in the large headings to match.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept
  07 (`07-home-services-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×685): the design screen hero; the wordmark, navigation, buttons, eyebrow,
    headline, paragraph, trust items and painted wall note were removed by inpainting (the theme draws
    them as live text over the same spots). The "HearthFix" badge on the polo is part of the photo.
  - `svc-plumbing.webp`, `svc-electrical.webp`, `svc-painting.webp` (292×178): the three card photos
    from the design screen. They are small, so the service and project detail pages show them
    upscaled about 1.5–2×, noticeably soft.
  - `tech-house.webp` (1448×1086), `house-exterior.webp` (688×790), `tool-bag.webp` (600×346): the
    text-free product illustration (b).
  - `kitchen-repair.webp` (562×477): the right-hand, text-free part of the photo on the laptop in the
    contextual mockup (c).
  Several images repeat across services, projects and the quote band. No faces from these photos are
  used as team portraits.
- **Icons** (arrows, menu button, service and trust icons, wordmark house) are inline SVG, hand drawn
  to approximate the design. The workshop address links to Google Maps in a new tab. No other
  external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the
admin setup wizard, which can apply the same seed). The generated secrets file is private and
git-ignored; never commit it.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Routes were checked at 1440px and 375px widths
in Chrome (no horizontal overflow at 375px, mobile menu opens); the 1440×1086 homepage fold was
measured against the design screen (text rows within about 2px vertically).

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (company, people, address, phone, email, projects) is synthetic; the phone number
uses the 555-01xx range reserved for fiction and the email uses the `.example` domain. Fonts remain
under the SIL Open Font License 1.1.
