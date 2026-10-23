# Freshspace (freshspace)

A fresh, airy home and office cleaning theme for [EmDash](https://emdashcms.com/): deep teal, mint and
warm white, a friendly rounded geometric sans and bright, spotless home photography. It ships a
homepage with service previews, a package comparison with starting prices, a deep-clean service page
with before-and-after photos and clear inclusions and exclusions, an itemised illustrative estimate and
a cleaning request form, all driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "Come home to clean." hero with a booking button and three service cards (each links to its service page) |
| `/packages` | Packages — Home Clean, Deep Clean and Office Clean compared: photo, summary, "From" price, inclusions and a booking button that carries the package to the request form |
| `/services/[slug]` | Service detail — hero, before-and-after photos (when both are set), rooms and tasks, what's included and not included. `/services/deep-clean` is the designed "Deep-clean service" page |
| `/estimate` | Estimate — property type, home size, bedrooms, bathrooms and frequency on the left; an itemised illustrative estimate with a final-price note on the right. Updates live with JavaScript and also works as a plain GET form (`?property=&size=&bedrooms=&bathrooms=&frequency=`) |
| `/request` | Request cleaning — package choice, address, name, phone, email, preferred date and time, notes. Accepts `?service=<service slug>`, `?package=<package slug>` and `?estimate=<summary>` |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Packages · Deep-clean service · Estimate · Request cleaning`) is an EmDash
menu and can be edited in the admin.

## Collections

- **services** — name, summary (homepage card and page intro), short request-form text, icon,
  two-line headline, rooms (repeater: room + what we do), tasks, what's included, what's not included,
  "show on homepage" / "offer on request form" flags, sort order, and four image pairs: `image` + `photo`
  (hero), `card_image` + `card_photo` (homepage card), `before_image` + `before_photo` and
  `after_image` + `after_photo` (before-and-after).
- **packages** — name, summary, starting price as displayed (e.g. `$99`), price unit, inclusions,
  icon, button label, the service it preselects on the request form (empty adds the package itself as an
  option, as Office Clean does), sort order, `image` + `photo`.
- **estimate_options** — the estimate controls: label, group (`property`, `size`, `bedrooms`,
  `bathrooms`, `frequency`), label in the summary, price adjustment in dollars (for `frequency` a
  percentage discount), icon, default flag, sort order. Edit these to change the illustrative pricing.
- **highlights** — short benefit lines with an icon, placed under the estimate (`estimate`) or beside
  the request form (`request`).
- **business** — one entry: name, cleaning requests email, phone, area served, opening hours.
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS image when present and otherwise falls back to the
bundled `photo` path in `public/images/`.

## Forms

"Submit request" validates in the browser, then opens the visitor's email app with a pre-filled message
to the business requests email (package, any package or estimate selection carried over, address,
contact details, preferred date and time, notes). Nothing is sent by the site itself, and the status
message says so. Without JavaScript the form falls back to a `mailto:` action and the email address is
shown. The hosted ZeroHostCMS native inquiry inbox is the intended production handler; it is not wired
into this standalone theme.

The estimate is illustrative and computed from the `estimate_options` collection; the page states that
the final price may vary.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme.
Icons and the leaf mark are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Urbanist (headings and
wordmark) and Figtree (text). Remove the `<link>` in `src/layouts/Base.astro` to fall back to system
fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The generated secrets
file is private and git-ignored; never commit it.

## Checks

```sh
npm run typecheck
npm run build
```

## License

MIT. Sample content is synthetic. Preserve upstream EmDash/Astro notices and the licenses of any
third-party assets you add.
