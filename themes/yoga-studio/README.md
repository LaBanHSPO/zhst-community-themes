# Yoga Studio (yoga-studio)

A warm, sunlit yoga-studio theme for [EmDash](https://emdashcms.com/), shown with the fictional studio
"sādhana Yoga Studio". It pairs a full-bleed photo (a woman in cobra pose in a plant-filled studio)
with a large deep-green serif headline, tiny tracked caps, forest-green pill buttons and a cream page.
It ships a class catalogue with level filter and detail pages, a weekly timetable, a journal, an about
page, pricing placeholders and a class-booking request form, all driven by CMS collections and seeded
with synthetic sample content. It is a standalone EmDash host (Node adapter, SQLite, local files).

The homepage follows the Buildful design screen for concept 22 ("Make room to breathe." /
"A kinder way forward." with the Move / Breathe / Belong columns).

## Routes

| Route | Page |
|---|---|
| `/` | Hero ("Make room to breathe.", "Explore classes" to `/classes`), "A kinder way forward." with three icon columns, featured classes, this week's timetable, intro-week offer, visit band |
| `/classes` | All class types; `?level=beginner`, `?level=all-levels` or `?level=intermediate` filters by level |
| `/classes/[slug]` | Class detail: style, level, duration, intro, content, what to bring, when it runs (each slot links to `/book` with the class, day and time), related classes |
| `/schedule` | Weekly timetable (weekday, time, class, teacher first name, room) with a "Request" link per slot |
| `/about` | CMS page `about`, a short values section, studio photos |
| `/journal`, `/journal/[slug]` | Journal posts |
| `/book` | Booking request form (class, preferred day and time, optional start date, name, email, phone, first-class checkbox, notes) plus pricing cards; phone, email, address and hours are always shown. `?class=<slug>` pre-selects the class, `?day=<mon..sun>` and `?time=<HH:MM>` pre-fill the slot |
| `/[slug]` | CMS pages (`studio-etiquette` is seeded and linked from the footer) |
| `404` | Styled not-found page |

"Book a Class" (header, mobile menu, visit band) goes to `/book`. The primary menu
(`Classes · About · Journal`) is an EmDash menu; Timetable and Book are linked from the footer, the
classes page sub-navigation and the homepage. Below 820px the navigation collapses into a round button
that opens a panel (native `<details>`, works without JavaScript); the hero stacks text above the photo.

## Collections

- **classes** — name, one-line description, style (`flow`, `gentle`, `restorative`, `strength`,
  `breath`), level (`beginner`, `all-levels`, `intermediate`), duration, featured flag, sort order,
  intro, Portable Text content, what to bring (one per line), `image` + `photo`.
- **sessions** (Timetable) — class name, class slug, weekday, 24-hour start (used for sorting),
  displayed time, teacher first name, room. Teachers are names only.
- **pillars** — Move / Breathe / Belong columns (title, text, icon: `lotus`, `sun`, `stones`).
- **passes** (Pricing) — name, whole-dollar price, note, highlight flag. All prices are fictional.
- **journal** — title, category, date label, summary, featured, sort order, `image` + `photo`, content.
- **studio** — one entry: name, address, phone, booking email, opening hours (`Day|Hours` per line),
  note beside the form.
- **pages** — title, small label, intro, Portable Text content (`about`, `studio-etiquette`).

Site settings: title "sādhana" and tagline "Yoga Studio" form the wordmark; an uploaded logo replaces
them. Image fields use the uploaded CMS image when present and otherwise the bundled `photo` path.

## Booking requests

The form validates in the browser (class, day, time, name and email required), then opens the visitor's
email app with a pre-filled request addressed to the studio email. Nothing is sent or stored by the
site, and the status message says so; without JavaScript the email address is shown instead. No form
plugin is used. The hosted ZeroHostCMS handler is the intended production route and is not wired here.
No medical or health-outcome claims appear in the content.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Newsreader](https://github.com/productiontype/Newsreader)
  (`@fontsource-variable/newsreader`) and [Figtree](https://github.com/erikdkennedy/figtree)
  (`@fontsource-variable/figtree`), both SIL Open Font License 1.1, © their respective Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 22
  (`22-yoga-studio-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448×763) — hero of the design screen; the wordmark, navigation, button, eyebrow,
    headline, sub-line and CTA were removed by inpainting (live text is drawn over the same spots). The
    lettering on the hanging fabric banner is a physical object and was kept. `cobra-card`,
    `blocks-bolster` and `plants-window` are crops of this cleaned hero.
  - `arch-lunge.webp` (full illustration b, 1448×1086) and crops `lunge-card`, `view-sea`, `olive-vase`,
    `props-floor`, `niche-candle`, `bench-towels`.
  - Concept c (laptop mockup) is not used because its screen carries printed text. The source comps are
    only 1448px wide, so some crops (niche-candle, bench-towels, plants-window) are upscaled 2× and soft.
- **Icons** (arrows, lotus, sun, stacked stones, menu) are inline SVG approximations. The studio address
  links to Google Maps in a new tab. No other external requests, no browser storage, no analytics.

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
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server
```

Routes were checked at 1440px and 375px in Chrome (no horizontal overflow, mobile menu is a `<details>`).
The 1440×1086 homepage fold was compared with the 1448×1086 design: headline, sub-line, navigation, section
heading and column text sit within about 1–3px; the CTA and "Book a Class" pill sit a few px left because
the design is 1448 wide. Newsreader approximates the design's headline face.

## License

MIT. Sample content (studio, teachers, address, phone, email, classes and prices) is synthetic; the phone
number uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open
Font License 1.1.
