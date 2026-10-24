# SandCove (beach-resort)

A beach resort theme for [EmDash](https://emdashcms.com/), shown with the fictional "SandCove Beach Resort". A
full-bleed photo of an infinity pool above a turquoise bay carries a deep teal serif headline, deep teal pill
buttons and a thin palm mark with widely tracked capitals. Below it sit an off-white suites section, a CMS-driven
suites collection (filter by view and group size), activities, three dining venues, an about page, a resort
policies page and a mailto availability request form. It is a standalone EmDash host (Node adapter, SQLite, local
files) seeded with synthetic sample content.

The homepage follows the Buildful design screen for concept 56 ("Let the days unfold.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero, "A calmer kind of luxury" suites intro, four featured room types, dining venues with hours, five activities, booking band with check-in times and how to get there |
| `/stay` | All suites. `?view=ocean\|garden` and `?guests=2\|3\|4\|6` (sleeps at least that many) filter and combine. Unknown values show everything |
| `/stay/[slug]` | Size in m², bed, most guests, view, private pool yes or no, amenities, "from" price per night (placeholder), a photo sequence, good to know, other rooms. "Ask about this suite" goes to `/contact?suite=<slug>` |
| `/experience` | Activities grouped on the water, on land and wellness, each with duration, season and a sample price |
| `/experience/[slug]` | Duration, season, group size, price, how it runs, what we provide, what to bring. "Add to a stay request" goes to `/contact?experience=<slug>` |
| `/dining` | CMS page "dining" plus the venues: hours, sample menu highlights with sample prices, and an allergy and diet note |
| `/about` | CMS page `about`: a fictional history and sustainability described only as concrete practices, with an explicit note that there is no certification |
| `/contact` | "Book Your Stay" availability request (see below). Phone, email, address, desk hours, check-in times and getting here are always shown |
| `/[slug]` | Other CMS pages, for example `/policies` ("Resort policies", sample text) |
| `404` | Styled not-found page |

The primary menu (`Stay / Experience / Dining / About`) is an EmDash menu. "Book Your Stay" (header, booking band
and page ends) goes to `/contact`; "Discover your stay" and "Explore our suites" go to `/stay`. Below 1024px the
navigation collapses into a round button that opens a panel (native `<details>`, works without JavaScript), the
two-column layouts stack and the hero headline sits over the pale sky under a soft white wash. The
"Slower Brighter Together" and "Rooms for a more beautiful tomorrow" captions are hidden below 1024px.

## Collections

- **suites**: name, one-line description, size (m²), bed, most guests, view (`ocean` or `garden`), private pool,
  amenities (one per line), "from" price per night in whole dollars (placeholder), featured flag, sort order, intro,
  good to know (one per line), Portable Text content, `image` + `photo` + `photo_alt` for the cover and `gallery`
  (one `path|description` per line) for the rest of the photo sequence.
- **experiences**: activity, one-line description, kind (`water`, `land`, `wellness`), duration, season, price
  (whole dollars, `0` for included), largest group, featured flag, sort order, intro, how it runs (`Time|What
  happens` per line), what to bring and what we provide (one per line), Portable Text content, photo fields.
- **venues**: name, kind, description, hours (`Day|Hours` per line), menu highlights (`Dish|Description|Price` per
  line, price optional), sort order, photo fields.
- **company**: resort name, address, phone, reservations email, desk hours (`Day|Hours`), check-in and check-out
  (`Label|Time`), getting here (`How|Detail`), the note shown beside the form.
- **pages**: title, small label, intro, Portable Text content (`about`, `dining`, `policies`).

Site settings: the title "SandCove" is the wordmark and the tagline "Beach resort" is the small line under it; an
uploaded logo replaces both. Prices and rates are labelled samples. No star rating, review score, award, rate
guarantee or booking-platform logo appears anywhere.

## Availability requests

The form takes a suite, check-in and check-out dates, adults, children, name, email, optional phone and special
requests. It validates in the browser (suite, dates, adults, name and email required, check-out after check-in,
guests within the suite's limit), then opens the visitor's email app with a pre-filled message addressed to the
reservations email. Nothing is sent or stored by the site, and the page says the resort confirms availability and the
rate by email and that a request holds no room and takes no payment. Without JavaScript the email address is shown
instead. `?suite=<slug>` pre-selects the suite, `?checkin=YYYY-MM-DD`, `?checkout=`, `?adults=` and `?children=` fill
the other fields, and `?experience=<slug>` adds a line about that activity to the requests box. The hosted
ZeroHostCMS handler is the intended production route and is not wired here.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Newsreader](https://github.com/productiontype/Newsreader)
  (`@fontsource-variable/newsreader`) for headlines, and [DM Sans](https://github.com/googlefonts/dm-fonts)
  (`@fontsource-variable/dm-sans`) for text, navigation and forms. Both are SIL Open Font License 1.1, (c) their
  respective Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 56
  (`56-beach-resort-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x721) is the hero of the design screen. The wordmark, navigation, header pill,
    headline, eyebrow, button and the wall caption were removed by inpainting (live text is drawn over the same
    spots).
  - `suite-ocean` (689x312) is the suite photo from the design screen. `terrace`, `pool-bay` are crops of the
    cleaned hero. `villa-sunset`, `lounger-hat`, `beach-sunset`, `sunset-pool`, `sky-palms`, `towels-coconut` are
    crops of illustration b. Crops are at their native size, so a few are upscaled on wide detail pages, and
    photos repeat across suites, activities and venues because only ten distinct images exist.
- **Icons** (palm mark, arrows, menu) are inline SVG approximations. The resort address links to Google Maps in a
  new tab. No other external requests, no browser storage, no analytics.

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
npm run typecheck   # astro check
npm run build       # Node adapter, standalone server
```

Routes were checked at 1440px and 375px in Chromium (no horizontal overflow, mobile menu is a `<details>`). The
homepage fold was compared with the 1448x1086 design by measuring text boxes in both images: headline, eyebrow,
button, navigation, wordmark, wall caption, section heading, body text and side caption sit within about 1 to 4px.
Newsreader approximates the design's headline face, which has slightly different proportions in "A calmer kind of
luxury."

## License

MIT. Sample content (resort, address, phone, email, suites, activities, venues, people and prices) is synthetic;
the phone number uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open
Font License 1.1.
