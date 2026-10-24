# Pilates Trainer (pilates-trainer)

A bright Pilates instructor theme for [EmDash](https://emdashcms.com/), shown with the fictional instructor
"Mara" and a studio in Marlow Bay. It has a full-bleed studio photo with a light serif headline, olive pill
buttons and a cream page. It ships classes with a type filter and detail pages, a weekly timetable, pricing,
an about page and a mailto booking request form, all driven by CMS collections with synthetic sample content.
It is a standalone EmDash host (Node adapter, SQLite, local files). Extension type: `bio`, inquiry on.

The homepage follows the Buildful design screen for concept 47 ("Strength in every movement.", "Stronger
habits. Brighter days." with the three icon columns).

## Routes

| Route | Page |
|---|---|
| `/` | Hero, three icon columns, class types, this week's timetable, first-class info with the intro price, visit band |
| `/classes` | All classes; `?type=mat`, `?type=reformer` or `?type=private` filters by type |
| `/classes/[slug]` | Class detail: type, level, length, group size, what to expect, what to bring, when it runs (each slot links to `/contact` with class, day and time), related classes |
| `/timetable` | Weekly timetable (weekday, time, class, spaces as a number or "ask") with a request link per slot |
| `/pricing` | Intro offer, drop-in, class packs and private sessions (placeholders) |
| `/about` | CMS page `about`: the instructor (fictional persona), how she teaches, a labelled placeholder for real qualifications |
| `/contact` | Booking request form plus email, phone, address and hours. `?class=<slug>` pre-selects the class, `?day=<mon..sun>` and `?time=<HH:MM>` pre-fill the slot |
| `/[slug]` | CMS pages (`studio-guide` is seeded and linked from the footer) |
| `404` | Styled not-found page |

"Find your class" (header, mobile menu, hero) goes to `/classes`. The primary menu is an EmDash menu
(`Classes, About, Pricing, Contact`). Below 900px the navigation collapses into a round button that opens a
panel (native `<details>`, works without JavaScript) and the hero stacks the text above the photo. The
two-column hero is kept down to 900px.

## Collections

- **classes**: name, one-line description, type (`mat`, `reformer`, `private`), level (`beginner`,
  `all-levels`, `intermediate`), length, group size, featured flag, sort order, intro, Portable Text
  ("what to expect"), what to bring (one per line), `image` + `photo`.
- **sessions** (Timetable): class name, class slug, weekday, 24-hour start (for sorting), displayed time,
  spaces (a number, or `ask`).
- **pillars** (Home columns): title, text, icon (`mat`, `lotus`, `group`).
- **prices** (Pricing): name, group (`intro`, `drop-in`, `pack`, `private`), whole-dollar price, what it covers,
  note, highlight flag. All prices are fictional.
- **studio**: one entry with name, address, phone, booking email, opening hours (`Day|Hours` per line), note.
- **pages**: title, small label, intro, Portable Text content (`about`, `studio-guide`).

Site settings: the title "Pilates Trainer" is the wordmark; an uploaded logo replaces it. Image fields use the
uploaded CMS image when present and otherwise the bundled `photo` path.

## Booking requests

The form validates in the browser (class, day, time, experience, name and email required), then opens the
visitor's email app with a pre-filled request addressed to the studio email. There is a field for injuries,
pregnancy or health conditions that is passed to the instructor. Nothing is sent or stored by the site, and the
status message says so; without JavaScript the email address is shown instead. The hosted ZeroHostCMS handler
is the intended production route and is not wired here. The content makes no medical or body-shape claims and
has no testimonials.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Newsreader](https://github.com/productiontype/Newsreader)
  (`@fontsource-variable/newsreader`) and [Albert Sans](https://github.com/usted/Albert-Sans)
  (`@fontsource-variable/albert-sans`), both SIL Open Font License 1.1, copyright their Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 47
  (`47-pilates-trainer-a.png`, `-b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x714) is the hero of the design screen. The wordmark, navigation, buttons, eyebrow,
    headline, sub-line and the right-hand words were removed by inpainting; live text is drawn over the same
    spots. `instructor-side-stretch`, `reformer-corner` and `bottle-towels` are crops of this cleaned hero.
  - `arabesque-studio.webp` (full illustration b, 1448x1086) and crops `arabesque-portrait`, `ball-blocks`,
    `olive-vase`, `mat-floor`.
  - Concept c (laptop mockup) is not used because its screen carries printed text. The source comps are only
    1448px wide, so some crops (reformer-corner, bottle-towels) are small and soft, and photos repeat.
- The instructor is a fictional, AI-generated persona and is labelled as such on the about page.
- **Icons** (arrows, rolled mat, lotus, group, menu) are inline SVG approximations. The studio address links to
  Google Maps in a new tab. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5**.

```sh
npm ci
npx emdash secrets generate --write .env   # private, git-ignored
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Edit content at `/_emdash/admin/`.

## Checks

```sh
npm run typecheck   # astro check
npm run build       # Node adapter, standalone server
```

Routes were checked at 1440px and 375px in Chrome (no horizontal overflow, the mobile menu is a `<details>`).
The 1440x1086 homepage fold was compared with the 1448x1086 design; text, buttons, columns and dividers sit
within about 1 to 3px. Newsreader approximates the design's headline face, with the second headline line
narrowed slightly (scaleX) to match the design width.

## License

MIT. Sample content (instructor, studio, address, phone, email, classes and prices) is synthetic; the phone
number uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
