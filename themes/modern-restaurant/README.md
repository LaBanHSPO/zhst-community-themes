# Modern Restaurant (modern-restaurant)

A dark, contemporary fine-dining theme for [EmDash](https://emdashcms.com/), with the sample wordmark
"MONTRÉ". It has a full-bleed, near-black food photography hero, warm off-white paper sections,
sand-gold pill buttons and thin gold rules. Headlines use a light editorial serif and the interface
uses a clean geometric sans. It ships a tasting-menu section, an à la carte menu with prices, an
"Our Story" page, a photo gallery with captions, and a table-request page with visit information. All
of it is driven by CMS collections and seeded with synthetic sample content. The theme is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 03 ("A taste worth discovering." /
"Reserve a table").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: "A taste worth discovering." photo hero with "Reserve a table →" and a "Good food / brighter / company" marker; "Our philosophy" section with the dining-room photo; a dark tasting-menu band (featured dishes, numbered, plus the tasting note); a "Visit us" band with address, hours, reserve button and directions |
| `/menu` | The menu: photo header with course chips (in-page anchors), a tasting-menu strip, then six courses with dish name, dotted leader, price, description and dietary marks; optional round dish photos; allergy note and reserve button |
| `/our-story` | Our Story: photo header, story text from the CMS page `our-story`, two photos, "What we hold on to" highlights, closing reserve band |
| `/gallery` | Gallery: CMS-driven photo grid with captions and short notes; photos marked "wide" span two columns |
| `/reserve` | Reserve a table: date, time, guests, menu choice, name, email, optional phone and notes. Phone and email are always shown beside the form, together with the visit information (address, "Get directions", "View on map", getting here, opening hours) and "good to know" notes |
| `/[slug]` | CMS pages (`private-dining` and `allergies` are seeded) |
| `404` | Styled not-found page (unknown slugs render it with HTTP 404) |

The primary menu (`Home · Menu · Our Story · Gallery`) is an EmDash menu and can be edited in the
admin. The "Reserve a table" pill in the header always links to `/reserve`. CMS pages that are not
in the primary menu are listed automatically in the footer. The footer also shows the address with a
map link, opening hours and contact details on every page.

The site header floats over the dark first section of every page. On screens narrower than 920px
the navigation collapses into a round button that opens a panel. The panel is a native `<details>`
element, so it works without JavaScript. Below 560px the header pill moves into that panel.

## Collections

- **dishes**: name, course (`snacks`, `starters`, `mains`, `sides`, `desserts`, `drinks`, shown as
  "To begin", "First courses", "Main courses", "For the table", "Desserts", "To drink"), price (free
  text, shown as typed), description, dietary notes, "feature in the homepage tasting menu" flag,
  sort order, `image` + `photo`. Up to five featured dishes appear on the homepage.
- **gallery**: caption, short note, alt text, "show wide" flag, sort order, `image` + `photo`.
- **highlights**: title, text, placement (`story` for the Our Story values, `reserve` for the notes
  on the reserve page), sort order.
- **hours**: days, hours, sort order (homepage band, reserve page, footer).
- **venue**: one entry with name, street, postcode and city, country, phone, reservations email,
  optional directions link, "getting here" notes, a booking note and a tasting-menu note (length and
  price).
- **pages**: title, optional small label and intro line, Portable Text content. The page with slug
  `our-story` feeds `/our-story`.

Every image-bearing entry renders the uploaded CMS `image` when present. Otherwise it falls back to
the bundled `photo` path in `public/images/`. The templates handle empty collections: the menu,
gallery and Our Story pages show short fallback messages, and the homepage tasting band is hidden.

## Table requests

"Request a table" validates in the browser (date today or later, name and email required, with
inline error messages). It then opens the visitor's email app with a pre-filled request addressed to
the venue's reservations email. The site itself sends and stores nothing, and the status message
says so. Without JavaScript, the page shows the email address instead. The phone number and email
are always listed beside the form under "Prefer to talk to us?". No form plugin is used, so no
submissions are stored in the database. The hosted ZeroHostCMS native booking handler is the intended
production route; it is not wired into this standalone theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, with no font CDN:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`, SIL Open Font License 1.1, © Production Type.
  - [DM Sans](https://github.com/googlefonts/dm-fonts) (variable) via `@fontsource-variable/dm-sans`,
    SIL Open Font License 1.1, © Colophon Foundry and the DM Sans project authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 03 (`03-modern-restaurant-a/b/c.png`, AI-generated design comps):
  - `hero-scallops.webp` comes from the design screen hero. The overlaid wordmark, navigation,
    headline, subline, buttons and marker text were removed by inpainting, and the theme draws them
    as real text over the same spots. `scallops-plate.webp` and `wine-and-candle.webp` are crops of
    that cleaned hero.
  - `dining-room.webp` is the design screen's interior photo, with its overlaid caption removed (the
    theme renders the caption as live text).
  - `beef-dinner.webp`, `beef-plate.webp`, `lounge.webp` and `red-wine-candle.webp` come from the
    text-free product illustration (b).
  - `scallop-bowl.webp` is the dish shown on the laptop screen in the contextual mockup (c).

  The source comps are small (1448×1086), so the smaller crops (`dining-room`, `scallop-bowl`,
  `wine-and-candle`) are shown at roughly native size or slightly upscaled.
- **Icons** (arrows, menu button) are inline SVG. Map links open Google Maps in a new tab; there is
  no embedded map. There are no other external requests, no browser storage and no analytics.

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

Open the local URL printed by Astro, then visit `/_emdash/admin/` to edit content. You can also
complete the admin setup wizard, which can apply the same seed. The generated secrets file is private
and git-ignored; never commit it.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server in dist/
```

Tested with Node 24.21.0 and npm 11.19.0 on macOS, with the Node adapter only (no Cloudflare run).
Routes were checked at 1440px and 375px widths in Chrome.

## Removal

The theme adds the collections above, one menu and seeded content. If you switch away, these stay
in the database until you delete them in the admin. No plugins, migrations or external services are
involved.

## License

MIT. The sample content (restaurant, people, address, phone, email) is synthetic. The fonts remain
under the SIL Open Font License 1.1.
