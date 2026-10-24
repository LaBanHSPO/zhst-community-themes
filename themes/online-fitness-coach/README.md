# Online Fitness Coach (online-fitness-coach)

A bright online fitness coaching theme for [EmDash](https://emdashcms.com/), shown with the fictional brand
"FitWithYou" and a fictional coach, Nora. It has a full-bleed home studio photo with a white wash, a very dark
green heavy sans headline and pill buttons, and peach and mint icon circles. It ships programs with an equipment
filter and detail pages, a resources section (workouts and short guides) with a category filter, an about page, a
contact form for a free call, an FAQ and a mailto request form, all driven by CMS collections with synthetic sample
content. It is a standalone EmDash host (Node adapter, SQLite, local files). Extension type: `bio`, inquiry on.

The homepage follows the Buildful design screen for concept 48 ("Training that fits your life.", "Simple.
Flexible. Built around you." with the three steps).

## Routes

| Route | Page |
|---|---|
| `/` | Hero with the three icon labels, how it works, three featured programs, a week with the coach, four FAQ items, start-with-a-call band |
| `/programs` | All programs; `?equipment=none`, `?equipment=dumbbells` or `?equipment=gym` filters by equipment |
| `/programs/[slug]` | Program detail: level, weeks, workouts per week, workout length, placeholder price, what is included, related programs; "Start this program" links to `/contact?program=<slug>` |
| `/resources` | Workouts and guides; `?category=workouts`, `?category=habits` or `?category=getting-started` filters by category |
| `/resources/[slug]` | Resource detail with Portable Text content (lists, headings) and a link to the contact page |
| `/about` | CMS page `about`: "Meet your coach" with a labelled fictional portrait, how coaching works, a dashed placeholder box for real qualifications, and a closing "Start with a free call" link |
| `/contact` | Free-call request form plus email, phone, place and reply times. `?program=<slug>` pre-selects a program and its equipment; `?equipment=<none|dumbbells|gym>` pre-selects the equipment |
| `/faq` | Questions from the CMS, rendered with native `<details>` |
| `/[slug]` | CMS pages (`privacy` is seeded and linked from the footer) |
| `404` | Styled not-found page |

"Meet your coach" (header, mobile menu, hero) goes to `/about`. The primary menu is an EmDash menu
(`Home, Programs, About, Resources`); FAQ and Contact are linked from the footer and the mobile menu. Below 1024px
the navigation collapses into a round button that opens a panel (native `<details>`, works without JavaScript)
and the hero stacks the text above the photo. The two-column hero is kept down to 1024px.

## Collections

- **programs**: name, one-line description, level (`beginner`, `all-levels`, `intermediate`), weeks, workouts per
  week, workout length, equipment (`none`, `dumbbells`, `gym`), what is included (one per line), placeholder price
  per month (whole dollars), featured flag, sort order, intro, Portable Text ("how it runs"), `image` + `photo`.
- **resources**: title, one-line description, category (`workouts`, `habits`, `getting-started`), length label,
  date label, featured flag, sort order, Portable Text content, `image` + `photo`.
- **faqs**: question, answer, show-on-homepage flag, sort order.
- **week**: day label, what happens, one or two sentences, kind (`workout`, `rest`, `chat`), sort order.
- **steps** (How it works): title, short text (line breaks kept), icon (`plan`, `shoe`, `group`), circle colour
  (`peach`, `mint`), sort order.
- **highlights** (hero icons): two-line label, icon (`dumbbell`, `laptop`, `heart`), sort order.
- **coach**: one entry with brand, coach name, place, phone, contact email, reply times (`Label|Details` per
  line), note beside the form.
- **pages**: title, small label, intro, Portable Text content (`about`, `privacy`).

Site settings: the title "FitWithYou" is the wordmark and the tagline "Online fitness coach" is shown in tracked
caps under it; an uploaded logo replaces both. Image fields use the uploaded CMS image when present and otherwise
the bundled `photo` path.

## Contact requests

The form validates in the browser (program, goals, equipment, workouts per week, name and email required), then
opens the visitor's email app with a pre-filled request addressed to the coach email. It has an optional field for
injuries or health conditions and a short note asking visitors to check with their doctor before starting if they
have a health concern. Nothing is sent or stored by the site, and the status message says so; without JavaScript
the email address is shown instead. The hosted ZeroHostCMS handler is the intended production route and is not
wired here. The content makes no weight-loss or medical claims and has no testimonials, client counts or
before and after photos.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Inter Tight](https://github.com/rsms/inter)
  (`@fontsource-variable/inter-tight`) for headlines and [Inter](https://github.com/rsms/inter)
  (`@fontsource-variable/inter`) for body text, both SIL Open Font License 1.1, copyright their Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 48
  (`48-online-fitness-coach-a.png`, `-b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x766) is the hero of the design screen. The wordmark, navigation, button, eyebrow,
    headline, sub-line, icons and labels were removed by inpainting; live text is drawn over the same spots. The
    framed print and the bottle are physical objects in the photo and were left in. `coach-seated`,
    `shelf-kettlebells` and `coach-smile` are crops of this cleaned hero.
  - `coach-reach.webp` (full illustration b, 1448x1086) and crops `gear-corner`, `living-corner`, `mat-sneaker`,
    `plants` and `ball-plant`.
  - Concept c (laptop mockup) is not used because its screen carries printed text. The source comps are only
    1448px wide, so some crops (`mat-sneaker`, `shelf-kettlebells`, `ball-plant`) are small and photos repeat
    across programs and resources.
- The coach is a fictional, AI-generated persona and is labelled as such on the about page.
- **Icons** (arrows, dumbbell, laptop, heart, clipboard, sneaker, group, menu) and the leaf mark are inline SVG
  approximations. No external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5**.

```sh
npm ci
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
The 1440x1086 homepage fold was compared with the 1448x1086 design: logo, nav, eyebrow, headline lines, sub-line,
button, icon row, section heading and the three step circles sit within about 1 to 3px. Inter Tight at weight 740
approximates the design's headline face, with a slightly different tracking on each line to match its width.

## License

MIT. Sample content (coach, brand, programs, resources, phone, email and prices) is synthetic; the phone number
uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font License 1.1.
