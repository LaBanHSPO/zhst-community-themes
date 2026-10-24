# Adventure Travel (adventure-travel)

A small-group travel theme for [EmDash](https://emdashcms.com/), shown with the fictional company
"WILDROUTES Adventure Travel". A full-bleed alpine photo with a white serif headline, forest-green pills and an
off-white lower section with three dark photo cards sits on top of a trips catalogue that filters by activity,
difficulty and region, a destinations page, departures with 2027 dates, an about page with a team list and a
mailto enquiry form. Everything is driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host (Node adapter, SQLite, local files).

The homepage follows the Buildful design screen for concept 49 ("Go further. Feel more." and
"Real places. Remarkable people.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero ("Go further. Feel more.", "Explore adventures" to `/trips`), "Real places. Remarkable people." with three activity cards, next six departures, how a trip works, included and not included, plan-your-trip band |
| `/trips` | All trips. `?activity=hiking\|kayaking\|expedition`, `?difficulty=easy\|moderate\|challenging` and `?region=alps\|norway\|patagonia\|rockies` filter the list and combine. Unknown values show everything |
| `/trips/[slug]` | Trip detail: place, days, difficulty, group size, "from" price (placeholder), day-by-day plan, departures (spaces always "ask"), what is included, what to bring, similar trips. "Plan this trip" goes to `/contact?trip=<slug>` |
| `/destinations` | The four regions with their trips and a count that links to `/trips?region=<region>` |
| `/about` | CMS page `about`, a labelled placeholder box for the owner's real licences and insurance, and the team list |
| `/contact` | "Plan your trip" form: trip, preferred departure, group size, experience level, name, email, phone, notes. `?trip=<slug>` pre-selects the trip and `?departure=YYYY-MM-DD` one of its dates. Choosing a trip narrows the departure list. Phone, email, address and office hours are always shown |
| `/[slug]` | CMS pages (`booking-terms` is seeded as clearly marked sample text and linked from the footer) |
| `404` | Styled not-found page |

"PLAN YOUR TRIP" (header, mobile menu) goes to `/contact`. "Explore adventures" and "Find your next trip" go to
`/trips`. The primary menu (`Trips / Destinations / About`) is an EmDash menu. Below 1024px the navigation
collapses into a round button that opens a panel (native `<details>`, works without JavaScript), the two-column
layouts stack and the hero text moves to the bottom of the photo. The handwritten note in the hero is hidden
below 1200px.

## Collections

- **trips**: name, one-line description, activity, region, place, days, difficulty, largest group, "from" price
  in whole dollars (placeholder), featured flag, sort order, intro, Portable Text content, departures
  (`First day|Last day` per line, `YYYY-MM-DD`), day by day (`Day|What happens` per line), included items
  (one per line), what to bring (one per line), `image` + `photo`. Departures that have passed are hidden at
  request time.
- **destinations**: name, region key, country, season, description, `image` + `photo`.
- **activities**: the three homepage cards (name, line under it, icon, which trips filter it opens, photo).
- **steps**: the four steps in "How a trip works".
- **guides**: team members (name, role, two sentences). Shown with initials, no portraits.
- **company**: one entry with address, phone, enquiry email, office hours (`Day|Hours` per line), enquiry
  note, the included and not included lists, and the licences and insurance placeholder.
- **pages**: title, small label, intro, Portable Text content (`about`, `booking-terms`).

Seed dates are in 2027. Site settings: title "WILDROUTES" and tagline "Adventure Travel" form the wordmark; an
uploaded logo replaces them. Spaces are never shown as numbers: every departure says "Spaces: ask". Prices are
labelled samples. The about page claims no licence, award or certification.

## Enquiries

The form validates in the browser (trip, name and email required), then opens the visitor's email app with a
pre-filled message addressed to the company email. Nothing is sent or stored by the site, and the status
message says so; without JavaScript the email address is shown instead. No form plugin is used. The hosted
ZeroHostCMS handler is the intended production route and is not wired here.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Newsreader](https://github.com/productiontype/Newsreader)
  (`@fontsource-variable/newsreader`) for headlines, [Hanken Grotesk](https://github.com/marcologous/hanken-grotesk)
  (`@fontsource-variable/hanken-grotesk`) for navigation and text, and
  [Mrs Saint Delafield](https://fonts.google.com/specimen/Mrs+Saint+Delafield) (`@fontsource/mrs-saint-delafield`)
  for the handwritten hero note. All are SIL Open Font License 1.1, (c) their respective Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 49
  (`49-adventure-travel-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448x680) is the hero of the design screen. The wordmark, navigation, button, headline,
    sub-line, eyebrow and handwritten note were removed by inpainting (live text is drawn over the same spots).
    `fjord-lake`, `golden-ridge`, `summit-hiker` and `alpine-peaks` are crops of this cleaned hero.
  - `card-hiking`, `card-kayaking`, `card-expeditions` are the three photo cards of the design with their
    icon and caption inpainted out; `turquoise-lake`, `kayak-lake` and `ridge-hiker` are 2x upscaled copies
    (soft, from 250px sources) used on trip pages.
  - `trail-sunset` (full illustration b, 1448x1086) and its crops `peaks-glacier`, `hikers-ridge`,
    `lake-sunset`.
  - `screen-trail` is the walking-group photo from the laptop screen of concept c, cropped clear of the text.
- **Icons** (mountain mark, activity icons, arrows, menu) are inline SVG approximations. The company address
  links to Google Maps in a new tab. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5**.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Edit content at `/_emdash/admin/`. Seeding skips content that already exists; delete `data.db` to re-seed.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server
```

Routes were checked at 1440px and 375px in Chromium (no horizontal overflow, mobile menu is a `<details>`).
The 1440x1086 homepage fold was compared with the 1448x1086 design: logo, navigation, headline, sub-line,
button, section heading, body text and cards sit within about 1 to 8px. Newsreader approximates the design's
headline face (about 1% wider) and Hanken Grotesk its sans text.

## License

MIT. Sample content (company, address, phone, email, trips, places, team and prices) is synthetic; the phone
number uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
