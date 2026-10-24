# Graduate Resume (graduate-resume)

An off-white and forest green theme for [EmDash](https://emdashcms.com/), made for an early-career resume site. It is
shown with the fictional graduate "Maya Linden" under the wordmark "Graduate Resume". It has a portrait hero with
handwritten notes, featured projects, a projects collection you can filter by kind, education, skills and short
experience (internships, part-time work, volunteering), a print-friendly resume on the About page and an email contact
form. All content comes from CMS collections and is seeded with synthetic sample text. It is a standalone EmDash host
that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 45 ("Ready for what comes next.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero (portrait, headline, intro, "View my projects", handwritten notes), three featured projects, education and skills, experience list, a "what I am looking for" note, contact band |
| `/projects`, `/projects/[slug]` | Project cards with a kind filter: `?kind=course`, `?kind=personal` or `?kind=team`. Detail pages show the problem, what was built, an image sequence, what was learned, tools and role |
| `/about` | CMS page `about` with portrait and plain bio, then a one-page resume with a print stylesheet. The "Print or save as PDF" button calls the browser print dialog (it appears only when JavaScript is available) |
| `/contact` | "Let's Talk": an email form. `?reason=internship`, `?reason=job`, `?reason=project` or `?reason=other` pre-selects the reason. Email, phone and profile links are always shown |
| `/[slug]` | Other CMS pages (`colophon` is seeded and linked from the footer) |
| `404` | Styled not-found page |

The primary menu (`Home, Projects, About`) is an EmDash menu and can be edited in the admin. "Let's Talk" in the header
goes to `/contact`. Below 1024px the navigation collapses into a round button that opens a panel (a native `<details>`
element, so it works without JavaScript). The two-column hero stays down to 1024px, then stacks (text first, then the
portrait) and the handwritten notes are hidden. Layouts were checked down to 375px.

## Collections

- **projects**: name, one-line summary, kind (`course`, `personal` or `team`), year, role, tools (one per line), the
  problem, what I built (one item per line), what I learned, more images (one per line as `path | caption`), homepage
  flag, sort order, cover `image` + `photo`, optional Portable Text notes.
- **roles** (Experience): role, organisation, dates shown, kind (internship, part-time or volunteering), a short
  description, sort order (newest first).
- **skills**: group name, one sentence, skills and tools (one per line), sort order.
- **credentials** (Education): degree or course, kind, school, years, short note, sort order.
- **profile** (Contact details): one entry with name, headline, location, phone, email, what I am looking for, two profile
  URLs, the summary line for the resume and the note above the form.
- **pages**: title, optional small label and intro, Portable Text content.

Site settings: the title ("Graduate Resume") is the serif wordmark; the last word is drawn in sage green. Phone numbers
use 555-01xx and emails and profile links use the `.example` domain. The university, employers and projects are
invented. The theme shows no testimonials, awards, employer logos, percentages or revenue claims. The only numbers in
the sample text are small, plain facts about a student project (a survey of 31 classmates, for example).

## Inquiries

The form validates in the browser, then opens the visitor's email app with a pre-filled message addressed to the profile
email. Nothing is sent or stored by the site itself, and the status message says so. Without JavaScript the email
address is shown instead. The extension manifest declares `inquiry: true` and type `bio`.

## Printing the resume

Open `/about#resume` and choose Print, then Save as PDF. The print stylesheet hides the header, footer, bio and contact
band, removes the paper shadow and sets margins and page breaks.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable), SIL OFL 1.1: wordmark and headlines, set at
    weight 800 with tight spacing to approximate the heavy serif in the design.
  - [Inter](https://github.com/rsms/inter) (variable), SIL OFL 1.1: body text, navigation.
  - [Zeyada](https://fonts.google.com/specimen/Zeyada) by Kimberly Geswein, SIL OFL 1.1: the handwritten notes on the
    hero (live text, not an image). It is a little more looped than the pen in the design.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of concept 45
  (`45-graduate-resume-a.png`, `-b.png`, `-c.png`, AI-generated design comps):
  - `hero-graduate.webp`: the right part of the design hero at full resolution (716 by 634). The baked-in navigation, the
    "Let's Talk" button and both handwritten notes were removed by inpainting, because the theme draws them as live
    text. The page edge of the photo is feathered into the page colour.
  - `leafly-*`, `roam-*`, `nextstep-*`, `quiet-hours-card`: crops of the three design project cards (lettering on the
    phone, laptop screen, notebook and mug is part of the project artwork), upscaled 1.5 to 3 times, so they are soft on
    detail pages.
  - `desk-*`, `cap-desk`: a notebook, books, leaves, a pen and a graduation cap cropped from images b and c.
  Maya Linden is a fictional, AI-generated persona; the About page says so.
- **Icons** are inline SVG. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and **Astro 7.3.5** and
owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS. Every route was screenshotted at 1440px and 375px (no horizontal overflow, mobile menu
opens, `?kind=` filters and `?reason=` pre-selection checked in the rendered HTML, unknown URLs return 404). The 1440x1086
homepage fold was compared with the design screen (1448 wide): text, buttons, cards and photo positions are within about
1 to 6px vertically. Right-hand elements sit about 8px further left because the design is 8px wider.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database until
deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (person, school, employers, projects, dates, phone, email and profile links) is synthetic. Fonts keep
their own licences as listed above.
