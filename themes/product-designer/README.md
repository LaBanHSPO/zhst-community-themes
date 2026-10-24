# Product Designer (product-designer)

A warm off-white theme for [EmDash](https://emdashcms.com/) with near-black bold sans headings, black pill buttons and a
sage arch photo hero. It is shown with the fictional product designer "Prose" (Noor Calder). The site has a
photo hero with a live handwritten note, selected case studies with a type filter, how the work runs, what the designer
can help with, short notes, an About page and a project enquiry form. Everything is driven by CMS collections and
seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js server with SQLite and
local file storage.

The homepage follows the Buildful design screen for concept 40 ("Thoughtful design. / Clear outcomes.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (eyebrow, headline, sub text, "View selected work", handwritten note); selected work (three cards); how I work (four steps); what I can help with; latest notes; contact band |
| `/work` | All case studies as cards; `?type=app`, `?type=platform` or `?type=design-system` filters the list (a filter link appears for every type that has at least one entry) |
| `/work/[slug]` | Case study: product, role, team, timeline, platform, the problem, how we worked, what shipped, what we learned, key screens, previous and next case study |
| `/about` | CMS page `about`: plain bio, how the designer works, tools, contact facts |
| `/notes` | All notes as a card grid; `?topic=process`, `?topic=research`, `?topic=craft` or `?topic=systems` filters the list |
| `/notes/[slug]` | Note with cover, byline, text and more notes |
| `/contact` | Project enquiry form (what you need help with, start time, optional budget range); `?service=<slug>` pre-selects a service; email and phone are always shown beside it |
| `/[slug]` | CMS pages (`working-together` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Work, About, Notes`) is an EmDash menu and can be edited in the admin. The black "Let's talk" pill
in the header goes to `/contact`; the "View selected work" button on the hero goes to `/work`.

On the homepage the header sits on top of the hero photo with white links, as in the design. Below 900px the
navigation collapses into a round button that opens a panel (a native `<details>` element, so it works without
JavaScript), the hero stacks with the text first and the photo below, and the handwritten note is hidden. Layouts
were checked down to 375px.

## Collections

- **work** (case studies): product name, type (`app`, `platform` or `design-system`), short label, one-sentence
  summary, role, team, timeline, platform, problem, how we worked, what shipped, what we learned, homepage flag, sort
  order, cover `image` + `photo`, and a "key screens" repeater (image or bundled path, caption).
- **notes**: title, summary, topic (`process`, `research`, `craft` or `systems`), date shown, reading time, homepage
  flag, sort order, cover `image` + `photo`, Portable Text body.
- **services** (What I can help with): title, one-line description, what it covers (one item per line), sort order.
  Each one is also an option in the enquiry form.
- **steps** (How I work): title, short label, text, "what you get", sort order.
- **profile** (Contact details): one entry with name, base, phone, enquiry email, reply time and the note above the
  form.
- **pages**: title, optional small label and intro, cover image, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: the title ("Prose") is the bold wordmark and the tagline ("Product Designer") is the tracked caps text
beside the thin rule; an uploaded logo replaces both. Entries render the uploaded CMS image when present and
otherwise the bundled `photo` path in `public/images/`. The theme shows no testimonials, client logos, awards, press,
metrics or percentages. Case studies describe outcomes in plain words only.

## Inquiries

The form validates in the browser (name, email, what you need help with, start time and "what are you building"
required, with inline messages), then opens the visitor's email app with a pre-filled message addressed to the
designer. Company, phone and budget range are optional. Nothing is sent or stored by the site itself, and the status
message says so; without JavaScript the email address is shown instead. No form plugin is used. The hosted
ZeroHostCMS native inquiry handler is the intended production route; it is not wired into this standalone theme. The
extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, both under the SIL Open Font License 1.1:
  - [Plus Jakarta Sans](https://github.com/tokotype/PlusJakartaSans) (variable) via
    `@fontsource-variable/plus-jakarta-sans`: wordmark, headlines, navigation and body text. It is the closest free
    match to the design's geometric sans.
  - [Caveat](https://github.com/googlefonts/caveat) via `@fontsource/caveat`: the handwritten note on the hero (live
    text, not an image).
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of concept
  40 (`40-product-designer-a.png`, `-b.png` and `-c.png`, AI-generated design comps):
  - `hero-home.webp` (1448x598): the design hero with the wordmark, navigation, "Let's talk" pill, eyebrow,
    headline, sub text, button, caps line and the handwritten wall note removed by inpainting (the theme draws live
    text over the same spots). The laptop screen ("Flowra") is portfolio artwork and stays.
  - `terrana`, `meno`, `orbit` (and their `-phone`, `-panel`, `-arch` and `-planet` details), `flowra`,
    `motion`, `harbor` and `lumina-bowl`: crops of the case-study artwork from images a and c, upscaled about 2 to 5
    times. The UI text inside them is part of the artwork and stays.
  - `study-*` and `desk-*`: object and desk crops from images b and c (a bedside light on a stone base, a sketch
    sheet, material samples, olive branches, a notebook), used for notes, the About page and one case study.
  The source comps are small, so some crops are soft and some images repeat across pages. Noor Calder, the products
  and the places are fictional; the About page says so.
- **Icons** (arrows and the menu button) are inline SVG. No other external requests, no browser storage, no
  analytics.

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
horizontal overflow, mobile menu opens, the `?type=` and `?topic=` filters and the `?service=` pre-selection work,
unknown URLs return 404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): headline,
sub text, button and caps line sit within about 1 to 2px vertically, and the cards within about 5px. The handwriting
font is a little more upright than the design's pen.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database until
deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (designer, city, phone, email, products and notes) is synthetic; the phone number uses a
555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
