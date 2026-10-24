# NatureTours (nature-tours)

A small-group nature tour operator theme for [EmDash](https://emdashcms.com/), shown with the fictional company
"NatureTours". A full-bleed alpine lake photo with a heavy white serif headline, a moss-green call to action and
a very dark green header pill sits on top of a CMS-driven set of tours (filter by activity level and region, with
dated departures), destinations with tour counts, a "How we travel" page, an about page with a team list and a
mailto enquiry form. It is a standalone EmDash host (Node adapter, SQLite, local files) seeded with synthetic
sample content.

The homepage follows the Buildful design screen for concept 53 ("Follow a different path.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero, intro with three icon columns, four featured tours, four "how we travel" rules, the next eight 2027 departures, plan band |
| `/tours` | All tours. `?level=gentle\|moderate\|active`, `?region=europe\|north-america\|oceania\|south-america` and `?country=<country-slug>` filter and combine. Unknown values show everything. A key explains the three levels |
| `/tours/[slug]` | Country, length, level, largest group, focus (wildlife or landscape), best months, "from" price (placeholder), daily outline, included and not included, what to pack, 2027 departures, similar tours. "Plan this trip" goes to `/contact?tour=<slug>`, each date to `/contact?tour=<slug>&departure=YYYY-MM-DD` |
| `/destinations` | Seven countries grouped by region, each with its tours and a count linking to `/tours?country=<slug>`; region headings link to `/tours?region=<key>` |
| `/approach` | CMS page "How we travel": concrete practices only (group size cap, local guides, marked trails, packing out waste), plus a labelled placeholder box for the owner's real memberships. No certification or carbon claims |
| `/about` | CMS page `about`, the team list (fictional names and roles) and a labelled placeholder box for licences and insurance |
| `/contact` | "Plan Your Trip" form: tour, preferred departure, group size, fitness level, name, email, phone, notes. `?tour=<slug>` pre-selects the tour and its fitness level, `?departure=YYYY-MM-DD` the date (only if that tour runs it), `?level=` the fitness level. Phone, email, address and phone hours are always shown |
| `/[slug]` | Other CMS pages |
| `404` | Styled not-found page |

The primary menu (`Tours / Destinations / About`) is an EmDash menu. "Find your adventure" goes to `/tours`; the
header pill goes to `/contact`. Below 1024px the navigation collapses into a round button that opens a panel
(native `<details>`, works without JavaScript), the two-column layouts stack, the header stops overlaying the
photo and the hero text sits at the top of the photo over a dark wash. The "Explore Respect Belong" caption is
hidden below 1024px.

## Collections

- **tours**: name, one-line description, country, region, level, largest group, focus, days, best months, "from"
  price in whole dollars (placeholder), featured flag, sort order, intro, daily outline (`Day|What happens` per
  line), included items, what to pack (one per line), departures (`YYYY-MM-DD|Open`, `Few places` or `Full` per
  line), Portable Text content, `image` + `photo`.
- **destinations**: country, region, best months, description, `image` + `photo`.
- **pillars**: the three icon columns on the homepage (label, icon `leaf`, `group` or `mountains`).
- **practices**: the "how we travel" rules (name, short figure, explanation).
- **team**: names, roles and two sentences each. Shown with initials, no portraits.
- **company**: address, phone, enquiry email, phone hours (`Day|Hours` per line), enquiry note, not-included list,
  and the licences and memberships placeholders.
- **pages**: title, small label, intro, Portable Text content (`about`, `approach`).

Site settings: the title "NatureTours" is the wordmark; an uploaded logo replaces it. Prices are labelled samples
and no licence, award, review, certification or press claim appears anywhere.

## Enquiries

The form validates in the browser (tour, group size, fitness level, name and email required), then opens the
visitor's email app with a pre-filled message addressed to the company email. Nothing is sent or stored by the
site, and the status message says so; without JavaScript the email address is shown instead. The departure list
shows only the dates of the chosen tour. No form plugin is used. The hosted ZeroHostCMS handler is the intended
production route and is not wired here.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Newsreader](https://github.com/productiontype/Newsreader)
  (`@fontsource-variable/newsreader`) for headlines, and [DM Sans](https://github.com/googlefonts/dm-fonts)
  (`@fontsource-variable/dm-sans`) for text, navigation and forms. Both are SIL Open Font License 1.1, (c) their
  respective Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 53
  (`53-nature-tours-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x794) is the hero of the design screen. The wordmark, navigation, header pill, eyebrow,
    headline, subline, button and the bottom-right caption were removed by inpainting (live text is drawn over
    the same spots).
  - `t-fjord`, `t-falls`, `t-peaks`, `t-spruce`, `t-trail`, `t-moss` are crops of illustration b; `t-ridge` and
    `t-shore` are crops of the design screen (right side, below the header). Crops are at their native size.
- **Icons** (mountain mark, leaf, group, mountains, arrows, menu) are inline SVG approximations. The company
  address links to Google Maps in a new tab. No other external requests, no browser storage, no analytics.

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
homepage fold was compared with the 1448x1086 design by measuring text boxes in both images: wordmark,
navigation, eyebrow, headline, subline, button, section heading, body text and icon circles sit within about
1 to 4px. Newsreader approximates the design's headline face, which is slightly narrower with taller ascenders.

## License

MIT. Sample content (company, address, phone, email, tours, places, team and prices) is synthetic; the phone
number uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font License 1.1.
