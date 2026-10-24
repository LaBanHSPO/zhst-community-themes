# Corporate Events (corporate-events)

A deep-navy corporate event organiser theme for [EmDash](https://emdashcms.com/), shown with the
fictional organiser "NexusEvents". It pairs a full-bleed conference hero with a warm sand accent,
an off-white content section with thin gold line icons, a services collection, a venues collection
with a city filter, an about page with team initials and a "Start planning" brief form. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 20 ("Events that bring people
together." / "Start planning"). Type: `company`, inquiry capability on (`zhst.extension.json`).

## Routes

| Route | Page |
|---|---|
| `/` | Hero ("Events that bring people together."), "From strategy to unforgettable experiences." with three featured services and a reception photo, "How we work" steps, featured venues, "Start planning" band |
| `/services` | All services with icon, summary, intro and photo, plus the four working steps |
| `/services/[slug]` | Service detail: summary, content, what is included, typical formats, other services; "Start planning" pre-selects the event type |
| `/venues` | All venues; `?city=halden` (any seeded city slug) filters by city |
| `/venues/[slug]` | Venue detail: city, capacity, spaces and capacities, features, extra photos, other venues; "Plan an event here" pre-fills city and venue |
| `/about` | CMS page `about`, values, team (roles and initials) |
| `/contact` | Planning brief form; `?type=conferences`, `?city=halden` and `?venue=Name` pre-select fields |
| `/[slug]` | CMS pages (`privacy` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Home · About · Services · Venues`) is an EmDash menu editable in the admin. The
header pill "Start planning" always goes to `/contact`. Below 960px the navigation collapses into a
native `<details>` menu that works without JavaScript.

## Collections

- **services** — name, card line, icon (`people`, `calendar`, `cocktail`, `spark`, `compass`),
  homepage flag, sort order, intro, Portable Text content, included (one per line), typical formats
  (one per line), `image` + bundled `photo`. No prices.
- **venues** — name, city, capacity line, summary, homepage flag, sort order, spaces (`Name - detail`
  per line), features (one per line), Portable Text content, `image` + bundled `photo`, `photo_2`,
  `photo_3`. The city filter is built from the cities present in the data.
- **principles** — steps (`placement: steps`) and values (`values`).
- **people** — name, role, short bio (shown as initials, no portraits).
- **office** — company, address, phone, planning email, hours, response note.
- **pages** — title, small label, intro, Portable Text content.

## Contact requests

The brief form validates name, email and event description in the browser, then opens the visitor's
email app with a pre-filled message (event type, date, guests, city, venue, budget range; all but
name, email and message optional). Nothing is sent or stored by the site. Phone, email, address and
hours are always shown beside the form. The hosted ZeroHostCMS inquiry handler is the intended
production route and is not wired into this standalone theme.

## Fonts, images and external requests

- **Fonts** (self-hosted via npm, no CDN): [Outfit](https://github.com/Outfitio/Outfit-Fonts)
  (headings, wordmark, buttons) via `@fontsource-variable/outfit`, and
  [Inter](https://github.com/rsms/inter) (body) via `@fontsource-variable/inter`. Both SIL Open Font
  License 1.1. Outfit approximates the design's geometric sans; it is a little narrower, so
  headline letter-spacing is tuned.
- **Images** in `public/images/` are cropped from the ZeroHostCMS Buildful preview images of concept
  20 (`20-corporate-events-a/b/c.png`, AI-generated comps):
  - `hero-home.webp` (1448x668) and `speaker.webp` — the design hero; the logo, navigation,
    buttons, headline and copy were removed by inpainting. Lettering on the stage set pieces stays.
  - `reception.webp` — the reception photo from the design screen.
  - `conference-stage.webp`, `ballroom-audience.webp`, `keynote-stage.webp`, `skyline-window.webp`
    — crops of the text-free illustration (b).
  - `venue-hall.webp` — the stage photo from the laptop screen in (c), right of the headline.
  The source comps are small, so a few crops are shown upscaled on detail pages, and the same
  photos repeat across services and venues.
- Logo mark, icons and arrows are inline SVG. The office address links to Google Maps. No other
  external requests, browser storage or analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`. Pins **EmDash 1.2.0** and **Astro 7.3.5**.

```sh
npm ci
npx emdash secrets generate --write .env
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Edit content at `/_emdash/admin/`.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server
```

## License

MIT. Sample content (organiser, venues, cities, people, address, phone, email) is synthetic; the
phone number uses a range reserved for fiction and the email uses the `.example` domain. Fonts
remain under the SIL Open Font License 1.1.
