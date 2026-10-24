# Developer Portfolio (developer-portfolio)

A dark theme for [EmDash](https://emdashcms.com/) built for a freelance full-stack developer. It is shown with the
fictional developer "Devfolio" (Theo Marsh). The homepage has a full-bleed photo hero with a gradient accent word and a
handwritten wall note, a skills strip, selected projects, how the work runs, writing and a "Let's build" band. Projects
can be filtered by stack tag, posts render code blocks in monospace, and the enquiry form opens the visitor's email app.
Everything is driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash host that
runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 42 ("Ideas built / for the web.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (tracked caps line, headline, sub text, "See projects" and "Explore my work", three short points, handwritten note); skills strip; selected projects; how I work; latest writing; "Let's build" band |
| `/projects` | All projects as cards; `?stack=<tag>` (for example `?stack=react` or `?stack=html-and-css`) filters the list. A filter link appears for every stack tag in use |
| `/projects/[slug]` | Project: summary, links (live site, source code), cover, role, year, team, stack tags, the brief, what I built, choices along the way, screens, previous and next project |
| `/about` | CMS page `about`: plain bio, current focus, tools, where the developer is based |
| `/writing` | All posts with thumbnails |
| `/writing/[slug]` | Post with cover, byline and body; code blocks are shown in a monospace panel that scrolls sideways on small screens |
| `/contact` | Enquiry form (project type, start time, optional budget range); `?type=website`, `web-app`, `frontend-rebuild`, `performance` or `other` pre-selects the project type; email and phone are always shown beside it |
| `/[slug]` | CMS pages (`working-together` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Home, Projects, About, Contact`) is an EmDash menu and can be edited in the admin. Writing is linked
from the footer and from the homepage. The outlined "Let's build" button in the header goes to `/contact`; "See
projects" on the hero goes to `/projects`.

On the homepage the header sits on top of the hero photo, as in the design. Below 900px the navigation collapses into
a square button that opens a panel (a native `<details>` element, so it works without JavaScript), the hero stacks
with the text first and the photo below, and the handwritten note is hidden. Layouts were checked down to 375px.

## Collections

- **projects**: name, kind (`website`, `web-app`, `frontend-rebuild` or `performance`, used to pre-select the
  enquiry form), short label, summary, stack tags (comma separated, they become the `?stack=` filter), role, team,
  year, the brief, what I built, choices along the way, links (button label and address), homepage flag, sort order,
  cover `image` + `photo`, and a "screens" repeater (image or bundled path, caption).
- **posts** (Writing): title, summary, date shown, reading time, homepage flag, sort order, cover `image` + `photo`,
  Portable Text body that supports code blocks.
- **skills**: title, icon (`html`, `js`, `orbit`, `hexagon`, `database`), two short lines, sort order. They fill the
  homepage strip.
- **steps** (How I work): title, short label, text, "what you get", sort order.
- **profile** (Contact details): one entry with name, base, phone, enquiry email, reply time and the note above the
  form.
- **pages**: title, optional small label and intro, cover image, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: the title ("Devfolio") is the bold wordmark; an uploaded logo replaces it. Entries show the uploaded CMS
image when present and otherwise the bundled `photo` path in `public/images/`. The theme shows no testimonials, client
logos, GitHub statistics, awards or metrics. Project links point at placeholder addresses on `.example`.

## Inquiries

The form validates in the browser (name, email, project type, start time and "what do you want to build" required,
with inline messages), then opens the visitor's email app with a pre-filled message addressed to the developer.
Company, phone and budget range are optional. Nothing is sent or stored by the site itself, and the status message
says so; without JavaScript the email address is shown instead. No form plugin is used. The hosted ZeroHostCMS native
inquiry handler is the intended production route; it is not wired into this standalone theme. The extension manifest
declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Inter Tight](https://github.com/rsms/inter) (variable, SIL OFL 1.1) via `@fontsource-variable/inter-tight`:
    wordmark and headlines, the closest free match to the design's heavy geometric sans.
  - [Inter](https://github.com/rsms/inter) (variable, SIL OFL 1.1) via `@fontsource-variable/inter`: body text and
    navigation.
  - [IBM Plex Mono](https://github.com/IBM/plex) (SIL OFL 1.1) via `@fontsource/ibm-plex-mono`: code blocks, stack
    tags, dates.
  - [Zeyada](https://fonts.google.com/specimen/Zeyada) (SIL OFL 1.1) via `@fontsource/zeyada`: the handwritten note on
    the hero (live text, not an image).
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of concept
  42 (`42-developer-portfolio-a.png`, `-b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x740): the design hero with the wordmark, navigation, button, tracked caps line, headline,
    sub text, calls to action, icon row and the handwritten wall note removed by inpainting (the theme draws live text
    over the same spots). The framed print "Good Code Brighter Tomorrow" is a physical object and stays.
  - `portrait.webp`: a crop of that cleaned hero, used on the About page.
  - `project-*` and `desk-*`: crops of the laptop, code editor, lake web page, icon row, plant, bronze brackets,
    notebook, mug and desk surface from image b, used as project covers, screens and post covers.
  The source comps are small, so some crops are soft (upscaled about 1.5 to 2.4 times) and some images repeat across
  pages. The screen artwork inside the laptop shots is part of the picture. Theo Marsh, the projects and the places are
  fictional; the About page says so.
- **Icons** (arrows, menu button, skill and point icons) are inline SVG drawn for this theme. No third-party logos are
  shipped. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and **Astro 7.3.5**
and owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the admin setup wizard,
which can apply the same seed).

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px (no
horizontal overflow, the mobile menu opens, the `?stack=` filter and the `?type=` pre-selection work, unknown URLs
return 404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): headline, sub text, buttons,
icon row and skills tiles sit within a few pixels. The headline runs a little narrower than the design and the
handwriting font is tidier than the design's pen. Grey text on the dark background meets WCAG AA contrast.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database until
deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (developer, city, phone, email, projects and posts) is synthetic; the phone number uses a
555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
