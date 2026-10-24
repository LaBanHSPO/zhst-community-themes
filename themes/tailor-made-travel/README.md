# TailorMade Travel (tailor-made-travel)

A travel-designer theme for [EmDash](https://emdashcms.com/), shown with the fictional studio "TailorMade Travel".
A full-bleed sunset caldera photo with a near-black light serif headline, very dark green pills and an off-white
lower section with white itinerary cards sits on top of a CMS-driven set of itineraries (filter by theme, region
and country), destinations, experiences, inspiration posts, an about page with a team list and a mailto enquiry
form. It is a standalone EmDash host (Node adapter, SQLite, local files) seeded with synthetic sample content.

The homepage follows the Buildful design screen for concept 50 ("Your journey, thoughtfully made.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero, "Extraordinary places, personally yours." with four itinerary cards, experiences by theme, how planning works (four steps), three inspiration posts, plan band |
| `/journeys` | All itineraries. `?theme=food\|culture\|nature\|ocean\|wellbeing`, `?region=europe\|asia\|africa\|pacific` and `?country=<country-slug>` filter and combine. Unknown values show everything |
| `/journeys/[slug]` | Country, days, best months, themes, "from" price (placeholder), day-by-day outline, what is included and not included, similar itineraries. "Plan this trip" goes to `/contact?journey=<slug>` |
| `/destinations` | Countries grouped by region, each with its itineraries and a count linking to `/journeys?country=<slug>`; region headings link to `/journeys?region=<key>` |
| `/experiences` | Five themes (food, culture, nature, ocean, wellbeing) with examples and a link to `/journeys?theme=<key>` |
| `/inspiration`, `/inspiration/[slug]` | Planning notes and field reports, newest first |
| `/about` | CMS page `about`, a labelled placeholder box for licences, bonding and insurance, and the team list (fictional names, no awards or press) |
| `/contact` | "Plan your journey" form: itinerary, dates or month, travellers, optional budget, interests, name, email, phone, notes. `?journey=<slug>` pre-selects the itinerary and ticks its themes, `?theme=<key>` ticks one interest. Phone, email, address and phone hours are always shown |
| `/[slug]` | CMS pages (`booking-terms` is seeded as clearly marked sample text and linked from the footer) |
| `404` | Styled not-found page |

The primary menu (`Destinations / Experiences / About / Inspiration`) is an EmDash menu. "Plan your journey" goes
to `/contact`; "Explore all journeys" goes to `/journeys`. Below 1024px the navigation collapses into a round
button that opens a panel (native `<details>`, works without JavaScript), the two-column layouts stack and the
hero text moves to the top of the photo. The two small captions at the bottom of the hero are hidden below 1024px.

## Collections

- **journeys**: name, one-line description, country, region, theme keys (comma separated), card words, days,
  best months, "from" price in whole dollars (placeholder), featured flag, sort order, intro, day by day
  (`Day|What happens` per line), included items (one per line), Portable Text content, `image` + `photo`.
- **destinations**: country, region, best months, description, `image` + `photo`.
- **experiences**: name, theme key, description, examples (one per line), `image` + `photo`.
- **inspiration**: title, summary, kind, date (`YYYY-MM-DD`), minutes to read, Portable Text post, `image` + `photo`.
- **steps**: the four "how planning works" steps.
- **team**: names, roles and two sentences each. Shown with initials, no portraits.
- **company**: address, phone, enquiry email, phone hours (`Day|Hours` per line), enquiry note, included and not
  included lists, and the licences placeholder.
- **pages**: title, small label, intro, Portable Text content (`about`, `booking-terms`).

Site settings: title "TailorMade" and tagline "Travel" form the wordmark; an uploaded logo replaces them. Prices
are labelled samples and no licence, award, review or press claim appears anywhere.

## Enquiries

The form validates in the browser (itinerary, dates and name and email required), then opens the visitor's
email app with a pre-filled message addressed to the company email. Nothing is sent or stored by the site, and the
status message says so; without JavaScript the email address is shown instead. No form plugin is used. The hosted
ZeroHostCMS handler is the intended production route and is not wired here.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Newsreader](https://github.com/productiontype/Newsreader)
  (`@fontsource-variable/newsreader`) for headlines and text, and
  [Hanken Grotesk](https://github.com/marcologous/hanken-grotesk) (`@fontsource-variable/hanken-grotesk`) for the
  small tracked capitals and forms. Both are SIL Open Font License 1.1, (c) their respective Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 50
  (`50-tailor-made-travel-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x628) is the hero of the design screen. The wordmark, navigation, both pills, the
    eyebrow, the headline and the two bottom captions were removed by inpainting (live text is drawn over the same
    spots). `j-greece` is a crop of it.
  - `j-japan`, `j-italy`, `j-morocco`, `j-polynesia` are the four photo cards of the design, 2x upscaled
    (soft, from about 316px sources).
  - `desk` (full illustration b) and its crops `globe`, `journal`, `postcards`, `olive`, `j-amalfi`, and `hat` (from the hero).
- **Icons** (mountain mark, arrows, menu) are inline SVG approximations. The company address links to Google Maps
  in a new tab. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and **Astro 7.3.5**.

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

Routes were checked at 1440px and 375px in Chromium (no horizontal overflow, mobile menu is a `<details>`). The
1440x1086 homepage fold was compared with the 1448x1086 design: wordmark, navigation, headline, buttons, section
heading, body text and cards sit within about 1 to 4px. Newsreader approximates the design's headline face, which
is slightly heavier with a taller x-height.

## License

MIT. Sample content (company, address, phone, email, itineraries, places, team and prices) is synthetic; the phone
number uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font License 1.1.
