# Wellness Coach (wellness-coach)

A calm cream-and-sage theme for [EmDash](https://emdashcms.com/), shown with the fictional coaching practice
"Willow & Well" and its coach, Iris Calder. It has a full-bleed photo hero with a live handwritten note, a
"whole you" approach with three line-icon pillars, how coaching works, services, a journal, a "Meet your
coach" page and a discovery-call request page, all driven by CMS collections and seeded with synthetic
sample content. It is a standalone EmDash host that runs on any Node.js server with SQLite and local file
storage.

The homepage follows the Buildful design screen for concept 23 ("Build a rhythm that feels like you." /
"Small shifts. A brighter you.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (eyebrow, headline, sub, "Meet your coach", handwritten note); approach with three pillars; four coaching steps; services teaser; coach introduction; journal teaser; discovery-call band |
| `/about` | "Meet your coach": CMS page `about` with portrait and a link to book a discovery call |
| `/services` | The three services (1:1 coaching, programme, workshops) with format, length, a "from" price or "On request" and what is included |
| `/services/[slug]` | Service detail: description, included list, other services |
| `/journal` | All posts as a photo grid |
| `/journal/[slug]` | Post with cover, byline, text and more posts |
| `/contact` | Discovery-call request form; `?service=<slug>` pre-selects a service; email and phone always shown beside it |
| `/[slug]` | CMS pages (`coaching-and-wellbeing` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Home, About, Services, Journal`) is an EmDash menu and can be edited in the admin. The
sage pill "Meet your coach" in the header goes to `/about`; "Book a discovery call" links go to `/contact`.

Below 1000px the navigation collapses into a round button that opens a panel (a native `<details>` element,
so it works without JavaScript). On phones the hero stacks: text first, then the photo. The handwritten
note is hidden below 1000px. Layouts were checked down to 375px.

## Collections

- **services**: name, one-line description, best-for phrase, format, length, price shown, included items
  (one per line), homepage flag, sort order, `image` + `photo`, Portable Text description.
- **posts** (Journal): title, summary, topic, date shown, reading time, homepage flag, sort order, cover
  `image` + `photo`, Portable Text body.
- **principles** (Approach): title, text (a line break splits it), icon (`leaf`, `sun` or `heart`), sort order.
- **steps** (How it works): title, text, sort order.
- **coach**: one entry with name, base, phone, request email, reply time and the note beside the form.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug `about` feeds `/about`.

Site settings: the title ("Willow & Well") is the serif wordmark and the tagline ("Wellness Coach") is the
tracked caps line beneath it; an uploaded logo replaces both. Image-bearing entries render the uploaded CMS
image when present and otherwise the bundled `photo` path in `public/images/`. Prices are indicative
placeholders, not real offers.

Coaching is not therapy or medical care. The theme carries a footer note saying so, makes no health
claims and shows no testimonials.

## Inquiries

The form validates in the browser (name, email, service and message required, with inline messages), then
opens the visitor's email app with a pre-filled message addressed to the coach. Nothing is sent or stored by
the site itself, and the status message says so; without JavaScript the email address is shown instead. No
form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended production route; it is
not wired into this standalone theme. The extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines, wordmark, pillar titles. It approximates the design's serif.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via `@fontsource-variable/figtree`: body
    text, navigation and buttons.
  - [Over the Rainbow](https://fonts.google.com/specimen/Over+the+Rainbow) via
    `@fontsource/over-the-rainbow`: the handwritten note (live text, not an image).
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 23 (`23-wellness-coach-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x705): the design hero with the eyebrow, headline, sub text, button and handwritten
    note removed by inpainting (the theme draws live text over the same spots).
  - `coach-terrace`, `coach-portrait` and the service and journal images are crops of image b, some upscaled
    1.3 to 1.7 times with light sharpening; `journal-mist-lake` and `journal-ridge` are crops of the cleaned hero.
  The source comps are small, so some crops are soft and a few photos repeat across pages. Iris is a fictional,
  AI-generated persona; the About page says so.
- **Icons** (arrows, menu button, leaf mark, leaf, sun, heart) are inline SVG approximations. No other
  external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

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

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px
(no horizontal overflow at 375px, mobile menu opens, `?service=` pre-selection works, unknown URLs return
404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): text and photo positions
are within about 1 to 4px; the right edge sits about 8px left because of the narrower viewport. Newsreader
approximates the headline face, so "Build a rhythm" is slightly wider than in the design, and the handwriting
is neater than the design's pen.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (practice, coach, city, phone, email, services and prices) is synthetic; the phone number
uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL
Open Font License 1.1.
