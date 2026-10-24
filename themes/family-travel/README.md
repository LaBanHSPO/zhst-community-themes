# Family Travel (family-travel)

A family travel agency theme for [EmDash](https://emdashcms.com/), shown with the fictional company "FamilyWay".
A bright beach hero with a deep navy serif headline, a coral button and a teal header pill sits on top of a
catalogue of family escapes that filters by travel style, children's ages and destination, a destinations page,
a travel styles page, practical inspiration posts, an about page with a team list and a mailto enquiry form.
Everything is driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash
host (Node adapter, SQLite, local files).

The homepage follows the Buildful design screen for concept 51 ("More moments together." and
"Popular family escapes").

## Routes

| Route | Page |
|---|---|
| `/` | Hero ("More moments together.", "Discover escapes" to `/escapes`), "Popular family escapes" with three travel-style cards, three starter escapes, what family-friendly means here, how planning works, three inspiration notes, plan-your-trip band |
| `/escapes` | All escapes. `?style=beach\|culture\|nature`, `?ages=under-5\|5-12\|teens` and `?destination=<key>` (`maldives`, `thailand`, `croatia`, `greece`, `saint-lucia`) filter the list and combine. Unknown values show everything |
| `/escapes/[slug]` | Escape detail: place, nights, best ages, pace, "from" price for a family of four (placeholder), day-by-day plan, family details (rooms, transfers, pace), what is included, similar escapes. "Plan this escape" goes to `/contact?escape=<slug>` |
| `/destinations` | The five places with their escapes, best months and a count that links to `/escapes?destination=<key>` |
| `/styles` | Beach, culture and nature explained: what each is, a normal day, who it suits, what to know. Each links to `/escapes?style=<key>` |
| `/inspiration` | Practical posts. `?topic=planning\|packing\|with-kids` filters the list |
| `/inspiration/[slug]` | A post with cover photo, body and more notes |
| `/about` | CMS page `about`, a labelled placeholder box for the owner's real licences and insurance, and the team list |
| `/contact` | "Plan Your Trip" form: escape, month or dates, adults, children, children's ages, optional budget, name, email, optional phone, notes. `?escape=<slug>` pre-selects the escape. Phone, email, address and office hours are always shown |
| `/[slug]` | CMS pages (`good-to-know` is seeded as clearly marked sample text and linked from the footer) |
| `404` | Styled not-found page |

"Plan Your Trip" (header, mobile menu) goes to `/contact`. "Discover escapes" goes to `/escapes` and "View all
destinations" to `/destinations`. The primary menu (`Destinations / Travel Styles / Inspiration / About`) is an
EmDash menu. Below 1024px the navigation collapses into a round button that opens a panel (native `<details>`,
works without JavaScript), the two-column layouts stack, the hero text moves above the photo and the handwritten
note is hidden.

## Collections

- **escapes**: name, one-line description, travel style, destination key, place, nights, best ages (comma
  separated `under-5`, `5-12`, `teens`), pace, "from" price for a family of four in whole dollars (placeholder),
  featured flag, sort order, intro, day by day (`Day|What happens` per line), included items (one per line),
  family details (`Label|Detail` per line), Portable Text content, `image` + `photo`.
- **destinations**: name, key, country, best months, description, `image` + `photo`.
- **styles**: the three homepage cards and the `/styles` page (name, three words, what it means, a normal day,
  who it suits, what to know, photo).
- **inspiration**: posts (title, summary, topic, date label, reading time, featured flag, Portable Text body, photo).
- **comforts**: the four "what family-friendly means here" items.
- **steps**: the four "how planning works" steps.
- **team**: team members (name, role, two sentences). Shown with initials, no portraits.
- **company**: one entry with address, phone, enquiry email, office hours (`Day|Hours` per line), enquiry note,
  the included and not included lists, and the licences and insurance placeholder.
- **pages**: title, small label, intro, Portable Text content (`about`, `good-to-know`).

Site settings: title "FamilyWay" and tagline "Travel together" form the wordmark (the two-tone "Family" and "Way"
split happens at the last capital letter); an uploaded logo replaces it. Prices are labelled samples, no dates
are listed, and the site shows no reviews, ratings, awards or popularity claims. Children in the photos are not
named. The about page claims no licence, award or membership.

## Enquiries

The form validates in the browser (escape, when, children's ages, name and email required), then opens the
visitor's email app with a pre-filled message addressed to the company email. Nothing is sent or stored by the
site, and the status message says so; without JavaScript the email address is shown instead. No form plugin is
used. The hosted ZeroHostCMS handler is the intended production route and is not wired here.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Source Serif 4](https://github.com/adobe-fonts/source-serif)
  (`@fontsource-variable/source-serif-4`) for headlines and the wordmark, [Open Sans](https://fonts.google.com/specimen/Open+Sans)
  (`@fontsource-variable/open-sans`) for navigation and text, and
  [Nothing You Could Do](https://fonts.google.com/specimen/Nothing+You+Could+Do) (`@fontsource/nothing-you-could-do`)
  for the handwritten hero note. All are SIL Open Font License 1.1, (c) their respective Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 51
  (`51-family-travel-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448x601) is the hero of the design screen. The wordmark, navigation, button, headline,
    sub-line, caps line and handwritten note were removed by inpainting (live text is drawn over the same
    spots). The left-hand fill is smooth sea and sky, so a faint seam sits at about x=500 under the white wash.
  - `card-beach`, `card-culture`, `card-nature` are the three photo cards of the design with their captions and
    arrows inpainted out, upscaled 2x (soft, from about 430px sources).
  - `beach-sunset` (full illustration b, 1448x1086) and its crops `karst-bay`, `sunset-boat`, `beach-hats`,
    `beach-basket`.
  - `family-wading` and `family-shore` are photos from the laptop screen of concept c, cropped clear of the text
    and upscaled 1.5x (soft).
  - Eight images repeat across escape, destination and post pages.
- **Icons** (sun-and-wave mark, arrows, menu) are inline SVG approximations. The company address links to
  Google Maps in a new tab. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5**.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Edit content at `/_emdash/admin/`. Seeding skips content that already exists; delete `data.db` to re-seed, or run
`npx emdash seed seed/seed.json --on-conflict update` after editing the seed file.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server
```

Routes were checked at 1440px and 375px in Chromium (no horizontal overflow, mobile menu is a `<details>`).
The 1440x1086 homepage fold was compared with the 1448x1086 design: logo, navigation, headline, sub-line, button,
section heading and cards sit within about 1 to 6px. Source Serif 4 approximates the design's headline face:
"moments" and "together." match in width while "More" is about 7% narrower and the capitals about 4% shorter.
Open Sans runs slightly wider than the design's sans text.

## License

MIT. Sample content (company, address, phone, email, escapes, places, team and prices) is synthetic; the phone
number uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
