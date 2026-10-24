# Professional Resume (professional-resume)

A warm off-white and forest green theme for [EmDash](https://emdashcms.com/), shown with the fictional product designer
"Theo Alder" under the wordmark "ProResume". It has a portrait hero, a dark career timeline, a full experience page, a
printable one-page resume, projects with case-study pages, skills, education placeholders, an About page and an email
contact form. All content comes from CMS collections and is seeded with synthetic sample text. It is a standalone EmDash
host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 43 ("Experience with a clear direction.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero (portrait, headline, intro, "View experience", handwritten note), the career timeline from the four latest roles, skill groups, three featured projects, education and certifications, contact band |
| `/experience` | All roles, newest first, each with company, dates, location, work mode and 3 to 5 bullet points; side panel with a link to the printable resume and the education list |
| `/resume` | One-page resume with a print stylesheet. A "Print or save as PDF" button calls the browser print dialog (it appears only when JavaScript is available) |
| `/projects`, `/projects/[slug]` | Project cards, and detail pages with context, role, what was done, outcome and an optional reflection |
| `/about` | CMS page `about` with portrait, plain bio, how he works, what he is looking for, and a note that the person is fictional |
| `/contact` | Email form (company, timing, reason, message); `?reason=role`, `?reason=project` or `?reason=other` pre-selects the reason. Email, phone and profile links are always shown |
| `/[slug]` | Other CMS pages (`colophon` is seeded and linked from the footer) |
| `404` | Styled not-found page |

The primary menu (`Home, Experience, Projects, About`) is an EmDash menu and can be edited in the admin. Below 980px the
navigation collapses into a round button that opens a panel (a native `<details>` element, so it works without
JavaScript). Below 1240px the hero stacks (text first, then the portrait) and the side captions and handwritten note are
hidden. The timeline is horizontal on desktop and tablet and vertical below 760px. Layouts were checked down to 375px.

## Collections

- **roles**: job title, company, dates shown, location, on site/hybrid/remote, one-line summary (used on the home
  timeline), bullet points (one per line), current-role flag, sort order (oldest first).
- **projects**: title, summary, company, year, role, context, what was done (one item per line), outcome, homepage flag,
  sort order, cover `image` + `photo`, optional Portable Text reflection.
- **skills**: group name, one sentence, skills (one per line), sort order.
- **credentials** (Education and certifications): name, kind, school or issuer, years, note. The seeded entries are
  labelled placeholders.
- **profile** (Contact details): one entry with name, headline, location, phone, email, availability text, two profile
  URLs, the summary line for the printable resume and the note above the form.
- **pages**: title, optional small label and intro, Portable Text content.

Site settings: the title ("ProResume") is the serif wordmark; the part after the capital R is drawn in green. Phone
numbers use 555-01xx and emails and profile links use the `.example` domain. Companies, dates and projects are invented.
Results are described in words. The theme shows no testimonials, endorsements, employer logos, percentages or revenue
claims.

## Inquiries

The form validates in the browser, then opens the visitor's email app with a pre-filled message addressed to the
profile email. Nothing is sent or stored by the site itself, and the status message says so. Without JavaScript the email
address is shown instead. The extension manifest declares `inquiry: true` and type `bio`.

## Printing the resume

Open `/resume` and choose Print, then Save as PDF. The print stylesheet hides the header, footer and contact band,
removes the paper shadow and sets margins and page breaks for A4 and US Letter.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes), SIL OFL 1.1: wordmark and
    headlines. The hero headline is drawn about 4% narrower (`scaleX`) to match the design's tighter serif.
  - [Inter](https://github.com/rsms/inter) (variable), SIL OFL 1.1: body text, navigation, buttons.
  - [Zeyada](https://fonts.google.com/specimen/Zeyada) by Kimberly Geswein, SIL OFL 1.1: the handwritten note on the hero
    (live text, not an image).
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of concept 43
  (`43-professional-resume-a.png` and `-b.png`, AI-generated design comps):
  - `hero-home.webp`: the right part of the design hero at full resolution (908 by 660), with the baked-in headline tail,
    intro text and the small side captions removed by inpainting (the theme draws live text over the same spots).
  - `portrait.webp` and `portrait-close.webp`: crops of the cleaned hero for About and Contact.
  - `project-*.webp`: a notebook and pen, a marble block, a globe and a houseplant, cropped from image b and upscaled
    1.6 to 2 times, so they are a little soft on detail pages.
  Theo Alder is a fictional, AI-generated persona; the About page and the Contact page say so.
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
opens, `?reason=` pre-selection checked in the rendered HTML, unknown URLs return 404). The 1440x1086 homepage fold was
compared with the design screen (1448 wide): text, buttons, timeline and photo positions are within about 1 to 4px
vertically. The right-hand elements sit about 8px further left because the design is 8px wider.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database until
deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (person, companies, projects, dates, phone, email and profile links) is synthetic. Fonts keep their
own licences as listed above.
