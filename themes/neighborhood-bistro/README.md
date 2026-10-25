# Neighborhood Bistro (neighborhood-bistro)

A warm neighborhood restaurant theme for [EmDash](https://emdashcms.com/): a candlelit dining-room
photo hero, cream paper sections, olive-green pill buttons and brass accents, a classic transitional
serif for headlines and body, and a tracked geometric sans for the wordmark and small labels. It
ships a seasonal menu with prices, an "Our Story" page, a visit page with hours, address and map
links, and a table-request page, all driven by CMS collections and seeded with synthetic sample
content. It is a standalone EmDash host that runs on any Node.js server with SQLite and local file
storage.

The homepage follows the Buildful design screen for concept 02 ("Good food. Great company." /
"Book a table").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: "Good food. Great company." photo hero with "Book a table", "Our kitchen" section with two photos, three featured dishes from the menu, a dark "Visit us" band with hours, booking and directions |
| `/menu` | The menu: course chips (in-page anchors), six courses with dish name, dotted leader, price, description and dietary marks; optional round dish photos; allergy note and booking button |
| `/our-story` | Our Story: photo header, story text from the CMS page `our-story`, two photos, "What we care about" highlights, closing booking band |
| `/visit` | Visit: opening hours table, address with "Get directions" and "View on map" (Google Maps links), phone and email, a stylised map card linking to Google Maps, "Getting here" notes |
| `/book` | Book a table: date, time, guests, name, email, optional phone and notes; phone and email are always shown beside the form; "Good to know" notes |
| `/[slug]` | CMS pages (`private-dining` and `allergies` are seeded) |
| `404` | Styled not-found page (unknown slugs render it with HTTP 404) |

The primary menu (`Home · Menu · Our Story · Visit`) is an EmDash menu and can be edited in the
admin. The "Book a table" pill in the header always links to `/book`. CMS pages that are not in the
primary menu are listed automatically in the footer.

On screens narrower than 920px the navigation collapses into a button that opens a panel (a native
`<details>` element, so it works without JavaScript); below 560px the header pill moves into that
panel.

## Collections

- **dishes**: name, course (`snacks`, `starters`, `mains`, `sides`, `desserts`, `drinks`), price
  (free text, shown as typed), description, dietary notes, "feature on the homepage" flag, sort
  order, `image` + `photo`. The first three featured dishes appear on the homepage.
- **highlights**: title, text, placement (`story` for the Our Story values, `booking` for the
  booking notes), sort order.
- **hours**: days, hours, sort order (homepage band, visit page, footer).
- **venue**: one entry: name, street, postcode and city, country, phone, reservations email,
  optional directions link, "getting here" notes and a booking note.
- **pages**: title, optional small label and intro line, Portable Text content. The page with slug
  `our-story` feeds `/our-story`.

Every image-bearing entry renders the uploaded CMS `image` when present and otherwise falls back to
the bundled `photo` path in `public/images/`. Empty collections are handled in the templates (the menu and
Our Story pages show short fallback messages).

## Table requests

"Request a table" validates in the browser (date today or later, name and email required, with
inline error messages), then opens the visitor's email app with a pre-filled request addressed to the
venue's reservations email. Nothing is sent or stored by the site itself, and the status message says
so; without JavaScript the email address is shown instead. The phone number and email are always
listed under the form ("Prefer to talk to us?"). No form plugin is used, so no submissions are stored
in the database. The hosted ZeroHostCMS native booking handler is the intended production route; it
is not wired into this standalone theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Source Serif 4](https://github.com/adobe-fonts/source-serif) (variable, optical sizes) via
    `@fontsource-variable/source-serif-4`: SIL Open Font License 1.1, © Adobe.
  - [Jost](https://github.com/indestredesign/jost) (variable) via `@fontsource-variable/jost`: SIL
    Open Font License 1.1, © Indestructible Type.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 02 (`02-neighborhood-bistro-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp`: design screen hero; the overlaid logo, navigation, headline and buttons were
    removed by inpainting (the theme draws them as real text over the same spot).
  - `kitchen-salad.webp`, `kitchen-room.webp`, `dish-scallops.webp`, `dish-beets.webp`: design
    screen photos.
  - `dinner-table.webp`, `dining-room-evening.webp`, `dish-salmon.webp`, `bread-and-oil.webp`,
    `wine-and-candle.webp`: the text-free product illustration (b).
  The source comps are small (1448×1086), so some crops are shown at roughly their native size or
  slightly upscaled.
- **Icons** (olive sprig, menu button) and the location map are inline SVG. The map is a stylised
  drawing, not a live map; links open Google Maps in a new tab. No other external requests, no
  browser storage, no analytics.

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
npm run build       # Node adapter, standalone server in dist/
```

Tested with Node 24.21.0 / npm 11.19.0 on macOS, Node adapter only (no Cloudflare run). Routes were
checked at 1440px and 375px widths in Chrome.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in
the database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (restaurant, people, address, phone, email) is synthetic. Fonts remain under the
SIL Open Font License 1.1.
