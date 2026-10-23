# Technology Company (technology-company)

A dark, architectural B2B technology theme for [EmDash](https://emdashcms.com/), shown with the
fictional company "Nexora". It pairs a full-bleed navy hero (a cantilevered glass building at dusk)
with very large Inter Tight headlines, Figtree body copy, widely tracked caps labels, light
blue-grey sections, soft cards with glassy blue illustrations, and royal-blue pill buttons. It ships
solutions with detail pages, an industries page, an about page with values and approach, a careers
section with role pages and apply-by-email, and a "Get in touch" contact page, all driven by CMS
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on
any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 05 ("Build what comes next." /
"Explore solutions").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: "Build what comes next." hero with "Explore solutions", the tracked side notes ("From possibility to progress", "Ideas / Infrastructure / People / Progress", "A more open tomorrow"), "Our solutions" with three illustrated cards, six industry tiles, "How we work" (photo and four numbered steps), the three newest openings, a blue "Get in touch" band |
| `/solutions` | All solutions with illustration, tagline, intro and the first capabilities; "How we work" steps |
| `/solutions/[slug]` | Solution detail: tagline, intro, photo, Portable Text content, "What we deliver" list, how engagements usually start, "Talk to an expert" (pre-selects the solution on the contact form), other solutions |
| `/industries` | Industry cards with icon, description and "where we help" list; homepage tiles link to each card's anchor |
| `/about` | About: intro and story from the CMS page `about`, building photo, values, approach steps |
| `/careers` | Open roles (newest first) with team, location and type; how to apply; speculative application by email; "Life at Nexora" values |
| `/careers/[slug]` | Role page: summary, posted date, Portable Text description, what you will do, what you will bring, "Apply by email", what happens next, other roles |
| `/contact` | Get in touch: enquiry form (name, organization, email, phone, topic, message); phone, email, address and hours are always shown beside it |
| `/[slug]` | CMS pages (`privacy` is seeded) |
| `404` | Styled not-found page (unknown slugs, solutions and roles render it with HTTP 404) |

The primary menu (`Solutions · Industries · About · Careers`) is an EmDash menu and can be edited in
the admin. The "Get in touch" pill in the header always links to `/contact`. CMS pages that are not
in the primary menu are listed automatically in the footer (by their small label when set).

On screens narrower than 900px the navigation collapses into a round button that opens a panel (a
native `<details>` element, so it works without JavaScript); below 560px the header pill moves into
that panel. Below 1100px the hero's right-hand side notes are hidden, and on narrow screens the hero
photo sits behind a darker shade so the copy stays readable.

## Collections

- **solutions** — name, card description (a line break is kept on the homepage card), card
  illustration (`layers`, `cubes`, `spheres`), "show on the homepage" flag, sort order, intro,
  Portable Text content, capabilities (one per line), how engagements usually start, `image` +
  `photo`. The homepage shows the first three solutions flagged for the homepage (or the first
  three overall if none are flagged).
- **industries** — name, description, icon (`finance`, `health`, `energy`, `public`, `retail`,
  `manufacturing`), focus areas (one per line), sort order.
- **principles** — title, text, placement (`approach` for the numbered steps, `values` for the about
  and careers pages), sort order.
- **openings** — role title, team, location, type (`Full-time`, `Part-time`, `Contract`,
  `Internship`), summary, date posted, Portable Text description, responsibilities and requirements
  (one per line). Lists are sorted by the posted date, newest first.
- **office** — one entry: company name, street, city and postcode, country, phone, enquiries email,
  applications email (falls back to the enquiries email), office hours and the response note.
- **pages** — title, optional small label and intro, Portable Text content. The page with slug
  `about` feeds `/about`.

Site settings: the title ("Nexora") is the wordmark beside the gradient "N" mark, and the tagline
("Technology for a brighter tomorrow") opens the footer text; an uploaded logo replaces the mark and
wordmark. Solutions render the uploaded CMS image when present and otherwise fall back to the
bundled `photo` path in `public/images/`. Empty collections are handled in the templates.

## Enquiries and applications

"Get in touch" validates in the browser (name, email and message required, with inline error
messages), then opens the visitor's email app with a pre-filled enquiry addressed to the office
email. Nothing is sent or stored by the site itself, and the status message says so; without
JavaScript the email address is shown instead. Phone, email, address and hours are always listed
beside the form.

Role pages have an "Apply by email" button: a `mailto:` link to the applications email with the role
in the subject and a short template in the body (the visitor attaches a CV in their own email app).
The address is also shown as plain text. No form plugin is used, so no enquiries or applications are
stored in the database. The hosted ZeroHostCMS native inquiry handler is the intended production
route; it is not wired into this standalone theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Inter Tight](https://github.com/rsms/inter) (variable) via
    `@fontsource-variable/inter-tight` — SIL Open Font License 1.1, © The Inter Project Authors.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via
    `@fontsource-variable/figtree` — SIL Open Font License 1.1, © The Figtree Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 05 (`05-technology-company-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×706) — the design screen hero; the overlaid logo, navigation, button,
    eyebrow, headline, paragraph and side notes were removed by inpainting (the theme draws them as
    live text over the same spots). `building-glass.webp` (748×706) is its right half.
  - `illus-layers.webp`, `illus-cubes.webp`, `illus-spheres.webp` (220×154) — the three card
    illustrations from the design screen, with the card background converted to transparency so
    they sit on any light surface.
  - `cloud-platform.webp` (1448×1086) — the text-free product illustration (b).
  - `skyline.webp` (554×380) — the hero photo on the monitor in the contextual mockup (c), with its
    navigation and side labels removed.
  The source comps are small (1448×1086), so the card illustrations are 220px wide and shown at
  native size; the solution list shows them up to 1.5× on wide screens, where they are slightly soft.
- **Icons** (logo mark, industry icons, arrows, check marks, menu button) are inline SVG or CSS. The
  office address links to Google Maps in a new tab. No other external requests, no browser storage,
  no analytics.

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

Tested with Node 24.21.0 / npm 11.19.0 on macOS, Node adapter only (no Cloudflare run). Routes were
checked at 1440px and 375px widths in Chrome; the 1440×1086 homepage fold was measured against the
design screen (vertical positions within about 2px).

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in
the database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (company, roles, address, phone, email) is synthetic; the phone number uses a
range reserved for fiction and the email addresses use the `.example` domain. There are no client
logos, awards or performance claims. Fonts remain under the SIL Open Font License 1.1.
