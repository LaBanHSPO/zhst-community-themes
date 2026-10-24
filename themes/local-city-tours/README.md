# Local City Tours (local-city-tours)

A tour-operator theme for [EmDash](https://emdashcms.com/), shown with the fictional company "Local City Tours".
A full-bleed old-town street photo with a white serif headline, a mustard call-to-action, very dark green pills and a warm
off-white lower section with white cards sits on top of CMS-driven tours (filter by type and language), guides, stories,
an about page and a mailto booking request form. It is a standalone EmDash host (Node adapter, SQLite, local files)
seeded with synthetic sample content. The city is generic ("the old city") with invented square and street names.

The homepage follows the Buildful design screen for concept 52 ("See the city through local eyes.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero, "A closer look at the real city." with three tour-type cards, a seven-day timetable built from the tours' start times and days, four guides, meeting point and what to bring, private tours band |
| `/tours` | All tours. `?type=walking\|food\|highlights\|private` and `?lang=<language-slug>` (for example `?lang=french`) filter and combine. Unknown values show everything |
| `/tours/[slug]` | Duration, group limit, start times, days, meeting point, languages, price (placeholder), accessibility notes, what is included, numbered route outline. "Book this tour" goes to `/contact?tour=<slug>` |
| `/guides` | Six guides: first names, languages (link to the language filter), what they like to show. One portrait, the others show initials. No ratings |
| `/stories`, `/stories/[slug]` | Short pieces from the guides, newest first |
| `/about` | CMS page `about`, a labelled placeholder box for licences and insurance, and the guide list |
| `/contact` | Book a tour: tour, date, start time, group size, language, access needs, name, email, phone, notes. `?tour=<slug>` pre-selects the tour, `?lang=<language-slug>` the language. The page says bookings are confirmed by email. Phone, email, address and desk hours are always shown |
| `/[slug]` | CMS pages (`cancellations` is seeded as clearly marked sample text and linked from the footer) |
| `404` | Styled not-found page |

The primary menu (`Tours / About / Stories`) is an EmDash menu. "Explore tours" goes to `/tours`. Guides and "Book a tour"
are linked from the footer and the mobile menu. Below 1024px the navigation collapses into a round button that opens a
panel (native `<details>`, works without JavaScript), the two-column layouts stack, and the hero photo sits above the
headline on dark green so the text never covers busy foliage.

## Collections

- **tours**: name, one-line description, type (walking, food, highlights, private), duration, largest group, start times
  (`10:00, 15:00`), days it runs (`mon,tue,...`), meeting point and how to recognize the guide, languages, price in whole
  dollars (placeholder) with per person or per group, accessibility notes, included items, route outline (`Stop|What we do`
  per line), intro, Portable Text content, `image` + `photo`.
- **guides**: first name, languages, what they like to show, two-sentence bio, `image` + `photo`.
- **stories**: title, summary, kind, date (`YYYY-MM-DD`), minutes to read, Portable Text, `image` + `photo`.
- **company**: address, phone, booking email, desk hours (`Day|Hours` per line), booking note, meeting point paragraph,
  what to bring (one per line), private tours paragraph, licences placeholder.
- **pages**: title, small label, intro, Portable Text content (`about`, `cancellations`).

Site settings: title "Local City Tours" and tagline "Real people  Bolder stories" (two spaces split the two phrases) form
the wordmark; an uploaded logo replaces them. The timetable on the homepage starts today (Asia/Saigon) and lists tours that
have clock-time start times; private tours are by arrangement and do not appear. Prices are labelled samples. No review
scores, ratings, testimonials, awards or licence claims appear anywhere.

## Bookings

The form validates in the browser (tour, date, start time, name and email required), then opens the visitor's email app
with a pre-filled request addressed to the company email. Nothing is sent or stored by the site, and the status message
says so; without JavaScript the email address is shown instead. No form plugin is used. The hosted ZeroHostCMS handler
is the intended production route and is not wired here.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Newsreader](https://github.com/productiontype/Newsreader)
  (`@fontsource-variable/newsreader`) for headlines and card titles, and
  [Instrument Sans](https://github.com/Instrument/instrument-sans) (`@fontsource-variable/instrument-sans`) for text,
  navigation and forms. Both are SIL Open Font License 1.1, (c) their respective Project Authors. Newsreader approximates
  the design's headline face, which is slightly heavier with a wider x-height.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 52
  (`52-local-city-tours-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448x680) is the hero of the design screen. The brand panel, navigation, pill, eyebrow, headline,
    sub-line and button were removed by inpainting (live text is drawn over the same spots, so the smoothed areas sit
    behind it). `street-group` is a crop of it.
  - `tour-walking`, `tour-food`, `tour-highlights` are the three card photos of the design, 2x upscaled (soft, from about
    430px sources). The chalkboard "Local Food Happier People" is a physical sign in the photo.
  - `group-guide` (full illustration b) and its crops `view-bridge`, `group-couple`, `guide-marta` (portrait) and `cobbles`.
  - `map-note`, `cup` are crops of illustration c outside the laptop screen; the handwriting on them is physical.
- **Icons** (domed skyline mark, arrows, menu) are inline SVG approximations. No external requests, no browser storage, no analytics.

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
1440x1086 homepage fold was compared with the 1448x1086 design: wordmark, navigation, eyebrow, headline, sub-line, button,
section heading, blurb and cards sit within about 1 to 2px vertically (right-aligned items sit about 8px left because the
design is 1448px wide).

## License

MIT. Sample content (company, address, phone, email, tours, places, guides and prices) is synthetic; the phone number uses
the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font License 1.1.
