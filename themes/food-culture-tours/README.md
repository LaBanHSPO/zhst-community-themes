# Food Culture Tours (food-culture-tours)

A food tour operator theme for [EmDash](https://emdashcms.com/), shown with the fictional company "Food Culture Tours".
A full-bleed market photo with a white serif headline and coral button, a floating cream header panel with a dark green
pill, and a cream lower section with rounded photo cards sit on top of CMS-driven experiences (filter by type and
destination), destinations with experience counts, hosts, an about page and a mailto enquiry form. It is a standalone
EmDash host (Node adapter, SQLite, local files) seeded with synthetic sample content. Towns and producers are invented;
the countries are real.

The homepage follows the Buildful design screen for concept 54 ("Taste the stories of a place.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero, "Real food. Richer connections." with three photo cards linking to the type filters, a "Coming up" board of featured experiences with start times and sample prices, a sample tour day, a dietary table counted from the experiences, and a Plan Your Trip band |
| `/experiences` | All experiences. `?type=market\|cooking\|lunch\|multi-day` and `?destination=<destination-slug>` filter and combine. Unknown values show everything |
| `/experiences/[slug]` | Destination, duration, start time, group limit, days, meeting point, what you will taste or make, vegetarian/vegan/gluten-free status, sample price. "Ask about this experience" goes to `/contact?experience=<slug>` |
| `/destinations` | Five towns with the number of experiences each, linking to `/experiences?destination=<slug>` |
| `/about` | CMS page `about`, labelled placeholder boxes for licences and insurance and for food safety registration, and the hosts (first names and roles; one portrait, the rest show initials) |
| `/contact` | Plan Your Trip: experience, preferred date, group size, dietary needs, allergies, name, email, phone, notes. `?experience=<slug>` pre-selects the experience. Phone, email, address and desk hours are always shown |
| `/[slug]` | CMS pages (`allergies-and-diets` and `changes-and-cancellations` are seeded as clearly marked sample text and linked from the footer) |
| `404` | Styled not-found page |

The primary menu (`Experiences / Destinations / About`) is an EmDash menu. "Plan Your Trip" goes to `/contact`. Below
1024px the navigation collapses into a round button that opens a panel (native `<details>`, works without JavaScript),
the two-column layouts stack, and the hero photo sits above the headline on dark green so the text never covers busy
parts of the photo.

## Collections

- **experiences**: name, one-line description, type (market, cooking, lunch, multi-day), destination slug, duration, largest
  group, start time, days it runs, vegetarian/vegan/gluten-free (`yes` or `ask`), price per person in whole euros
  (placeholder), what you will taste or make (one per line), meeting point and how to recognize the host, intro, Portable
  Text content, `image` + `photo`.
- **destinations**: place, country, description, best months, `image` + `photo`.
- **hosts**: first name, role, base town, two-sentence bio, `image` + `photo`.
- **company**: address, phone, enquiry email, desk hours (`Day|Hours` per line), note beside the form, sample tour day
  (`Time|What happens` per line), allergies paragraph, Plan Your Trip paragraph, licences and food-safety placeholders.
- **pages**: title, small label, intro, Portable Text content (`about`, `allergies-and-diets`, `changes-and-cancellations`).

Site settings: title "Food Culture Tours" and tagline "People  Places  Good Food" (two spaces split the phrases) form the
wordmark; an uploaded logo replaces them. Prices are labelled samples. No reviews, ratings, testimonials, awards or
licence claims appear anywhere.

## Enquiries

The form validates in the browser (experience, date, name and email required), then opens the visitor's email app with a
pre-filled message addressed to the company email. Nothing is sent or stored by the site, and the status message says so;
without JavaScript the email address is shown instead. No form plugin is used. The hosted ZeroHostCMS handler is the
intended production route and is not wired here.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Newsreader](https://github.com/productiontype/Newsreader)
  (`@fontsource-variable/newsreader`) for headlines, titles and the wordmark, and
  [Instrument Sans](https://github.com/Instrument/instrument-sans) (`@fontsource-variable/instrument-sans`) for text,
  navigation and forms. Both are SIL Open Font License 1.1, (c) their respective Project Authors. Newsreader is wider than
  the design's headline face, so the headline uses tighter letter spacing.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 54
  (`54-food-culture-tours-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448x625) is the hero of the design screen. The header panel, headline, sub-line, button and tracked
    caps were removed by inpainting (live text is drawn over the same spots, so the smoothed areas sit behind it). The
    chalkboards in the photo are physical signs. `tomato-woman` is a crop of it.
  - `card-market`, `card-pasta`, `card-lunch` are the three card photos of the design, 2x upscaled (soft, from about 430px
    sources).
  - `class-pasta`, `coast-town`, `produce`, `garlic-chili`, `cheese-board`, `host-luca` and `table-wide` are crops of
    illustration b. `vendor-stall` is a crop of the design screen. `notebook` is a crop of illustration c outside the
    laptop screen; the handwriting is physical.
  - Several images repeat across experiences and destinations.
- **Icons** (sprig mark, arrows, menu) are inline SVG approximations. No external requests, no browser storage, no analytics.

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

Routes were checked at 1440px and 375px in Chromium (mobile menu is a `<details>`). The 1440x1086 homepage fold was
compared with the 1448x1086 design: headline, sub-line, button, caps, section heading and cards sit within about 1 to 3px
vertically (right-aligned items sit about 4px left because the design is 1448px wide).

## License

MIT. Sample content (company, address, phone, email, experiences, towns, hosts and prices) is synthetic; the phone number
uses the 555 01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font License 1.1.
