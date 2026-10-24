# Meditation Retreat (meditation-retreat)

A calm meditation-retreat theme for [EmDash](https://emdashcms.com/), shown with the fictional centre
"SageHaven Meditation Retreat". A full-bleed photo of a woman meditating above a misty forest lake sits
behind a large near-black serif headline, deep olive pill buttons and an off-white lower section. It ships
a retreat catalogue that splits into upcoming and past by today's date, a daily-schedule section, a
journal, a story page and a mailto enquiry form, all driven by CMS collections and seeded with synthetic
sample content. It is a standalone EmDash host (Node adapter, SQLite, local files).

The homepage follows the Buildful design screen for concept 24 ("Pause. Breathe. Begin again." and
"Reconnect with what truly matters").

## Routes

| Route | Page |
|---|---|
| `/` | Hero ("Pause. Breathe. Begin again.", "Explore retreats" to `/retreats`), "Reconnect with what truly matters" with three line icons and a lodge photo, next three retreats, a day at the retreat, journal teaser, enquiry band |
| `/retreats` | Upcoming and past retreats, split by today's date at request time. `?region=lakes\|mountains\|forest\|coast` and `?length=weekend\|midweek\|week` filter both lists (they combine) |
| `/retreats/[slug]` | Retreat detail: dates, nights, place, places available, "from" price, intro, content, what is included, daily rhythm, other dates. Upcoming retreats link to `/contact?retreat=<slug>` |
| `/about` | CMS page `about` (Our Story: the places and the philosophy, no founder presented) |
| `/journal`, `/journal/[slug]` | Journal posts |
| `/contact` | Enquiry form: retreat, guests, room, dietary needs, name, email, phone, notes. `?retreat=<slug>` pre-selects the retreat. Phone, email, address and office hours are always shown |
| `/[slug]` | CMS pages (`guest-guidelines` is seeded and linked from the footer) |
| `404` | Styled not-found page |

"Explore retreats" (header, mobile menu, hero) goes to `/retreats`. The primary menu
(`Retreats / Our Story / Journal / Contact`) is an EmDash menu. Below 860px the navigation collapses into a
round button that opens a panel (native `<details>`, works without JavaScript) and the hero stacks the
text above the photo.

## Collections

- **retreats** : name, one-line description, region (`lakes`, `mountains`, `forest`, `coast`), venue and
  place, first and last day (datetime, stored at noon UTC), nights, places, whole-dollar "from" price,
  featured flag, sort order, intro, Portable Text content, included items (one per line), daily rhythm
  (`Time|Activity` per line), `image` + `photo`. Length bands are derived from nights: weekend (2 to 3),
  midweek (4 to 6), a week or more (7+).
- **day_rhythm** : the six moments shown in "A day at the retreat" (time, title, text).
- **pillars** : the three icons under the intro (`leaf`, `mountains`, `lotus`) and their labels.
- **journal** : title, category, date label, summary, featured, sort order, `image` + `photo`, content.
- **venue** : one entry: name, address, phone, enquiry email, office hours (`Day|Hours` per line), note.
- **pages** : title, small label, intro, Portable Text content (`about`, `guest-guidelines`).

Seed dates are in 2027. Two retreats from 2026 are seeded on purpose so the "Past retreats" list renders;
they move between lists automatically as dates pass. Site settings: title "SageHaven" and tagline
"Meditation Retreat" form the wordmark; an uploaded logo replaces them.

## Enquiries

The form validates in the browser (retreat, name and email required), then opens the visitor's email app
with a pre-filled message addressed to the venue email. Nothing is sent or stored by the site, and the
status message says so; without JavaScript the email address is shown instead. No form plugin is used.
The hosted ZeroHostCMS handler is the intended production route and is not wired here. No medical or
health-outcome claims appear in the content.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [EB Garamond](https://github.com/octaviopardo/EBGaramond12)
  (`@fontsource-variable/eb-garamond`) for headlines and buttons, and
  [Hanken Grotesk](https://github.com/marcologous/hanken-grotesk) (`@fontsource-variable/hanken-grotesk`)
  for navigation and body text. Both are SIL Open Font License 1.1, © their respective Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 24
  (`24-meditation-retreat-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448×687) is the hero of the design screen. The wordmark, navigation, buttons,
    headline, sub-line and caption text were removed by inpainting (live text is drawn over the same spots).
    `lake-deck`, `forest-shore` and `eaves-cushions` are crops of this cleaned hero.
  - `lodge.webp` is the lodge photo from the design (2× upscaled, slightly soft).
  - `deck-sunrise` (full illustration b, 1448×1086) and its crops `woman-back`, `sunrise-lake`,
    `bowl-towel`, `cushion-mat`, `lantern-olive`, `porch-steps`.
  - Concept c (laptop mockup) is not used because its screen carries printed text.
- **Icons** (lotus mark, leaf, mountains, lotus, arrows, menu) are inline SVG approximations. The venue
  address links to Google Maps in a new tab. No other external requests, no browser storage, no analytics.

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

Routes were checked at 1440px and 375px in Chrome (no horizontal overflow, mobile menu is a `<details>`).
The 1440×1086 homepage fold was compared with the 1448×1086 design: logo, navigation, headline, sub-line,
captions, section heading, icons and photo sit within about 1 to 6px. EB Garamond approximates the design's
headline face and Hanken Grotesk its sans text.

## License

MIT. Sample content (centre, address, phone, email, retreats and prices) is synthetic; the phone number
uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
