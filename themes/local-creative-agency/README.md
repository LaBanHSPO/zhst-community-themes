# Local Creative Agency (local-creative-agency)

A light, warm theme for [EmDash](https://emdashcms.com/) shown with the fictional small agency "LOCAL"
(Creative Agency). It pairs a studio photo hero with a very large heavy tight-tracked headline, a
terracotta call to action, a dark green-black pill, live handwritten notes over the photo, and an
off-white featured-work and team section split by a thin vertical rule. It ships a work collection
with a discipline filter and case study pages, services with detail pages, an about page with a team,
a "Let's talk" contact page and CMS pages, all driven by collections and seeded with synthetic sample
content. It is a standalone EmDash host that runs on any Node.js server with SQLite and local file
storage.

The homepage follows the Buildful design screen for concept 09 ("Small team. Big ideas." /
"See our work"); below the fold it adds a services overview, a four-step process band and a contact
band.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero with the eyebrow, headline, paragraph, "See our work" button and the "Good ideas belong here" and "People / Places / Brands" notes; "Real brands. Brighter stories." with three featured case studies; "Good people. Great work." with three portraits; services overview; process; contact band |
| `/work` | All case studies as photo cards with a discipline filter (`/work?discipline=website`) |
| `/work/[slug]` | Case study: disciplines, client, year, brief and approach, Portable Text write-up, studio photos, other work |
| `/about` | About: CMS page `about`, a photo, beliefs, team (portraits for three people, initials for the rest) |
| `/services` | All services as rows with photos, process band |
| `/services/[slug]` | Service: intro, Portable Text content, what is included, typical engagement, "Let's talk" (pre-selects the service) |
| `/contact` | Let's talk: form with service pre-selection via `?service=`; email, phone, hours and studio address are always shown beside it |
| `/[slug]` | CMS pages (`privacy` is seeded) |
| `404` | Styled not-found page (unknown pages, services and case studies render it with HTTP 404) |

The primary menu (`Work · About · Services · Contact`) is an EmDash menu and can be edited in the
admin. CMS pages that are not in the menu are listed in the footer automatically. Below 960px the
navigation collapses into a button that opens a panel (a native `<details>` element, so it works
without JavaScript). Between 960px and 1400px the hero photo narrows and crops from the left; below
960px the hero copy sits above the photo.

## Collections

- **projects** (Work) — name, short description, disciplines (comma separated, e.g. `Brand, Packaging`;
  used for the filter chips and the tracked caps label under each card), client, year, "show on the
  homepage" flag (the homepage shows up to three), sort order, brief, approach, Portable Text write-up,
  `featured_image` + `photo`, and two extra bundled photo paths (`photo_2`, `photo_3`).
- **services** — name, one-line summary, sort order, intro, Portable Text content, included items
  (one per line), typical engagement, `image` + `photo`.
- **people** (Team) — name, role, short bio, sort order, `image` + `photo`. A person without a photo is
  shown as initials.
- **principles** (Beliefs) — title, text, sort order.
- **steps** (How we work) — title, text, sort order.
- **office** (Contact details) — one entry: studio name, street, city, country, phone, enquiries email,
  hours and the response note.
- **pages** — title, optional small label and intro, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: the title ("LOCAL") is the wide tracked wordmark and the tagline ("Creative Agency")
the small tracked caps line under it; an uploaded logo replaces the whole wordmark. Image-bearing
entries render the uploaded CMS image when present and otherwise the bundled `photo` path in
`public/images/`. Empty collections are handled in the templates.

## Contact form

The form validates in the browser (name, email and message required, inline errors), then opens the
visitor's email app with a pre-filled message addressed to the office email. Nothing is sent or stored
by the site, and the status message says so; without JavaScript the email address is shown instead.
`/contact?service=Websites` (the "Let's talk" buttons on service pages do this) pre-selects the
service; unknown values are ignored. The hosted ZeroHostCMS native inquiry handler is the intended
production route; it is not wired into this standalone theme.

## Fonts, images and external requests

- **Inter Tight** (variable, 100–900) self-hosted through `@fontsource-variable/inter-tight`: the
  headline, interface and body font. SIL Open Font License 1.1, © The Inter Project Authors. It is a
  close, tighter cousin of the design's heavy grotesk; word spacing is opened slightly in the large
  headings.
- **Caveat Brush** (`@fontsource/caveat-brush`, SIL OFL 1.1, © Pablo Impallari, Igino Marini) for the
  big "Good ideas belong here" and "Let's make something brighter" notes, and **Caveat** (variable,
  `@fontsource-variable/caveat`, SIL OFL 1.1, © The Caveat Project Authors) for the small "A small team
  for brighter places" note. They are live text, rotated in CSS, so they are editable-by-code and
  searchable. No font CDN is used.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept
  09 (`09-local-creative-agency-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448×630) — the design screen hero. The wordmark, navigation, pill, eyebrow,
    headline, paragraph, button, the handwritten wall note, the poster text and the mug text were
    removed by inpainting (the theme draws them as live text over the same spots). Faint smoothing is
    visible on the blank poster and the mug.
  - `work-little-ground.webp`, `work-cove.webp`, `work-nook.webp` (about 270×217) — the three project
    photos from the design screen. The text inside them ("A kinder daily ritual", "Further together",
    "Homes for a brighter tomorrow") is part of the showcased artwork and was kept. They are small, so
    case study and service pages show them upscaled about 2×, noticeably soft.
  - `team-1/2/3.webp` (186×186) — the three circular portraits shown in the design screen, upscaled 2×
    from about 93px. They are the design's own avatars; the extra team members use initials.
  - `studio-wide.webp` (1448×1086), `studio-trio.webp`, `studio-table.webp`, `work-arch.webp`,
    `work-fern.webp`, `work-kiln.webp` — text-free crops of the product illustration (b), used for
    the about page, case study galleries and the three extra case studies (the "brands" in them are
    wall prints and desk objects in that illustration). Several images repeat across pages.
  - The contextual mockup (c) is not used: its screen shows another wordmark.
- **Icons**: the arrows and menu button are inline SVG; the brush underlines are SVG strokes. The studio
  address links to Google Maps in a new tab. No other external requests, no browser storage, no
  analytics.

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
in Chrome (no horizontal overflow at 375px); the 1440×1086 homepage fold was measured against the
design screen (text rows and cards within about 1–2px vertically; the design is 1448px wide, so
horizontal positions differ by up to 8px).

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (agency, people, case study brands, address, phone, email) is synthetic; the
phone number uses the 555-01xx range reserved for fiction and the email uses the `.example` domain.
Fonts remain under the SIL Open Font License 1.1.
