# Creative Professional (creative-professional)

A light, editorial portfolio theme for [EmDash](https://emdashcms.com/), shown with the fictional creative director
and photographer "NOVA" (Nova Hartley). It has a full-bleed portrait hero with a live handwritten note, a selected
work row, a services list, a four-step process, a journal teaser, a work archive with a discipline filter and project
pages, a journal, an About page and a project enquiry page. Everything is driven by CMS collections and seeded with
synthetic sample content. It is a standalone EmDash host that runs on any Node.js server with SQLite and local file
storage.

The homepage follows the Buildful design screen for concept 39 ("A fresh perspective, made tangible.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero (eyebrow, headline, sub text, "Explore my work", discipline line, handwritten note, side caption); Selected work (three featured projects); What I do (four services with what is included); How a project runs (four steps); Journal teaser; "Let's talk" band |
| `/work` | All projects as a photo grid; `?discipline=brand-identity`, `campaign`, `photography` or `creative-direction` filters the list (a filter link appears for each discipline that has at least one project) |
| `/work/[slug]` | Project page: client, discipline, year, credits, brief, approach, image sequence, previous and next project, "Start a similar project" |
| `/about` | CMS page `about` with portrait and a plain bio |
| `/journal`, `/journal/[slug]` | Journal list and posts |
| `/contact` | Project enquiry form (what you need, optional budget range, timeline, description); `?discipline=<slug>` pre-selects the kind of work; email and phone always shown beside it |
| `/[slug]` | CMS pages (`working-together`, fees and rights, is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Work, About, Journal`) is an EmDash menu and can be edited in the admin. The black "Let's talk"
pill in the header goes to `/contact`; "Explore my work" goes to `/work`.

Below 900px the navigation collapses into a round button that opens a panel (a native `<details>` element, so it
works without JavaScript). On phones the hero stacks: text first, then the photo. The handwritten note and the side
caption are hidden below 900px. Layouts were checked down to 375px.

## Collections

- **projects** (Work): name, discipline (`brand-identity`, `campaign`, `photography`, `creative-direction`), client
  (a credit), year, one-line summary, brief, approach, credits (one `Role: Name` per line), homepage flag, sort
  order, cover `image` + `photo`, image sequence (`gallery` repeater with image, bundled path and caption).
- **posts** (Journal): title, date shown, topic label, summary, sort order, cover `image` + `photo`, Portable Text body.
- **services**: name, matching work filter, one-line description, included items (one per line), usual timeline,
  sort order.
- **steps** (Process): name, text, sort order.
- **studio** (Studio details): one entry with name, base, phone, enquiry email, reply time and the note beside the form.
- **pages**: title, optional small label and intro, side photo, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: the title ("NOVA") is the thin tracked wordmark and the tagline ("Ideas into reality") is the tracked
caps line beneath it; an uploaded logo replaces both. The letter A in the wordmark is drawn as an open chevron to
match the design. Image-bearing entries render the uploaded CMS image when present and otherwise the bundled `photo`
path in `public/images/`. The theme shows no testimonials, client logos, awards or result claims.

## Inquiries

The form validates in the browser (name, email, what you need, timeline and description required, with inline
messages), then opens the visitor's email app with a pre-filled message addressed to the studio. Nothing is sent or
stored by the site itself, and the status message says so; without JavaScript the email address is shown instead.
No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended production route; it is not
wired into this standalone theme. The extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines, card titles and prose headings. It is the closest free match to
    the design's high-contrast text serif, a little wider, so the headline is tracked tighter.
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter`: body text, navigation, buttons.
  - [Jost](https://github.com/indestructible-type/Jost) (variable) via `@fontsource-variable/jost`: the thin
    wordmark letters.
  - [Zeyada](https://fonts.google.com/specimen/Zeyada) via `@fontsource/zeyada`: the handwritten note on the hero
    (live text, skewed and rotated with CSS).
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 39 (`39-creative-professional-a.png` and `-b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x696): the design hero with the wordmark, navigation, button, eyebrow, headline, sub text,
    discipline line, handwritten note and side caption removed by inpainting (the theme draws live text over the
    same spots). `portrait-wall.webp` is a crop of it, upscaled 1.4 times.
  - `work-still-here`, `work-open-spaces`, `work-human-nature`: the three design work cards, upscaled 2 times. The
    card lettering "A CALMER BRIGHTER YOU" is printed on the physical card and stays.
  - The other crops (`studio-portrait`, `olive-vase`, `brush-pot`, `sculpture`, `moodboard`, `open-book`,
    `profile-print`, `terracotta-print`, `prints-desk`, `sea-print`, `botanical-print`, `sketch`) come from image b,
    upscaled 1.5 to 2.4 times. The source comps are small, so some crops are soft and several images repeat across
    projects. Nova Hartley is a fictional, AI-generated persona; the About page says so.
- **Icons** (arrows, menu button) are inline SVG. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and **Astro 7.3.5**
and owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the admin setup
wizard, which can apply the same seed).

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px (no
horizontal overflow at 375px, mobile menu opens, `?discipline=` filter and pre-selection work, unknown URLs return
404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): wordmark, eyebrow, button, tag
line, section heading and card rows are within about 1 to 2px vertically. The headline is within 1px vertically but
its longest line runs about 4 percent wider than the design, and the handwriting is an approximation of the pen
script.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database
until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (the studio, clients, projects, city, phone, email, prices and notes) is synthetic; the phone
number uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL
Open Font License 1.1.
