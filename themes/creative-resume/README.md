# Creative Resume (creative-resume)

A warm, editorial resume theme for [EmDash](https://emdashcms.com/), shown with the fictional designer "Mara Ellison"
and the wordmark "CreativeResume". It has a collage portrait hero with live text and a handwritten note, selected
projects, a work archive with a discipline filter and project pages, an experience timeline, skills and tools, a
"Currently open to" band, an About page with a print-friendly resume, and a contact page with a reason selector.
Everything is driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash host that
runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 44 ("Curiosity, craft, and fresh ideas.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero (eyebrow, headline with hand-drawn underline, sub text, "Explore my profile", motto, handwritten note, side caption); Selected Projects (three featured); Experience (three roles); Skills and tools; Currently open to band |
| `/work` | All projects as a photo grid; `?discipline=brand-web`, `product`, `identity` or `editorial` filters the list |
| `/work/[slug]` | Project page: client, role, discipline, year, brief, what I did, how it turned out (described in words, no metrics), image sequence, previous and next project |
| `/about` | CMS page `about` with portrait and bio, full experience timeline, education placeholders, skills, and a one-page resume sheet with a "Print or save as PDF" button |
| `/contact` | Message form (name, email, reason, optional company and start time, message); `?reason=role`, `freelance` or `other` pre-selects the reason; email and phone always shown, with profile links as `.example` placeholders |
| `/[slug]` | CMS pages (`working-together` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Home, Work, About, Contact`) is an EmDash menu and can be edited in the admin. Below 900px the
navigation collapses into a round button that opens a panel (a native `<details>` element, so it works without
JavaScript). On phones the hero stacks: text first, then the collage. The handwritten note and the side caption are
hidden below 1100px. Layouts were checked down to 375px.

## Print stylesheet

On `/about`, the resume sheet (summary, experience, education, skills, selected projects) is the only thing printed:
the header, footer and every other section carry a `no-print` class. Use the button or the browser print command and
choose Save as PDF.

## Collections

- **projects** (Work): name, discipline (`brand-web`, `product`, `identity`, `editorial`), client, year, role,
  summary, brief, what I did, how it turned out, homepage flag, sort order, cover `image` + `photo`, image sequence
  (`gallery` repeater with image, bundled path and caption).
- **experience**: role or course, studio or school, kind (`work` or `education`), years, place, bullets (one per
  line), sort order. The two education entries are labelled placeholders.
- **skills**: group name, items (one per line), sort order.
- **studio** (Contact details): one entry with name, base, phone, email, availability text, reply time, a note
  beside the form and profile links (one `Label|URL` per line).
- **pages**: title, optional small label and intro, portrait, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: title "CreativeResume" (split at the second capital so "Resume" takes the accent colour) and tagline
"Ideas for a brighter tomorrow" (shown top right). An uploaded logo replaces the text wordmark. The theme shows no
testimonials, client logos, awards or result numbers.

## Inquiries

The form validates in the browser (name, email, reason and message required, with inline messages), then opens the
visitor's email app with a pre-filled message addressed to the site owner. Nothing is sent or stored by the site
itself, and the status message says so; without JavaScript the email address is shown instead. The hosted
ZeroHostCMS native inquiry handler is the intended production route; it is not wired into this standalone theme.
The manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: wordmark, headlines, card titles. It is the closest free match to the design
    serif; the two headline lines are slightly condensed with CSS to match the design widths.
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter`: body text, navigation.
  - [Qwigley](https://fonts.google.com/specimen/Qwigley) via `@fontsource/qwigley`: the handwritten note (live text,
    rotated with CSS). It is an approximation of the design pen.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of concept
  44 (`44-creative-resume-a.png` and `-b.png`, AI-generated design comps):
  - `hero.webp` (908x700): the design collage with the navigation, tagline, headline and underline, handwritten note
    and side caption removed by inpainting and flat fill (the theme draws live text in the same places).
  - `work-earthward`, `work-habitly`, `work-forma`: the three design project cards, upscaled 2 times. The lettering
    inside them is project artwork and stays.
  - The other crops (`print-mountain`, `print-leaf`, `print-architecture`, `print-portrait`, `stone-sphere`,
    `notebook`, `plant`) come from image b, upscaled about 2 times; `portrait-collage` is a crop of the hero upscaled
    1.5 times. The source comps are small, so some crops are soft and several images repeat across projects.
  - Mara Ellison is a fictional, AI-generated persona; the About page says so.
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

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS. Every route was screenshotted at 1440px and 375px (no horizontal overflow at
375px, mobile menu opens, `?discipline=` filter and `?reason=` pre-selection checked in the rendered HTML, unknown
URLs return 404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): wordmark, navigation,
headline lines, sub text, button and card rows sit within a few pixels. The headline is an approximation of the
design face and the handwriting is tidier than the design pen.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database until
deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (the designer, studios, clients, projects, city, phone, email and notes) is synthetic; the phone
number uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL
Open Font License 1.1.
