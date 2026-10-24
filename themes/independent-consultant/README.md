# Independent Consultant (independent-consultant)

A bright off-white and deep green theme for [EmDash](https://emdashcms.com/), shown with the fictional solo
consultant "Bridgewell" (Clara Weston). It has a full-bleed portrait hero with a live handwritten note, three
service cards, a four-step "how an engagement works" section, short anonymous example projects, an insights
section with a topic filter, an About page, a services price list and an enquiry page, all driven by CMS
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js
server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 37 ("Turn expertise into momentum." / "Practical
support for what's next.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: portrait hero (eyebrow, headline, sub text, "Work with me", handwritten note); "How I can help" with three service cards; how an engagement works (four steps); typical projects; latest insights; contact band |
| `/about` | CMS page `about` with portrait, background in plain words, how Clara works |
| `/services` | The five services, each with who it is for, format, length, a "from" price or "On request", and what is included |
| `/services/[slug]` | Service detail: description, included list, other services |
| `/insights` | All notes as a photo grid; `?topic=strategy`, `?topic=leadership` or `?topic=execution` filters the list (filter links appear for every topic that has at least one entry) |
| `/insights/[slug]` | Note with cover, byline, text and more notes |
| `/contact` | Enquiry form (service, organisation size, start time, short description); `?service=<slug>` pre-selects a service; email and phone always shown beside it |
| `/[slug]` | CMS pages (`working-together`, the terms note, is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Home, About, Services, Insights`) is an EmDash menu and can be edited in the admin. The
outlined "Work with me" pill in the header and the green button on the hero both go to `/contact`.

Below 1000px the navigation collapses into a round button that opens a panel (a native `<details>` element, so it
works without JavaScript). On phones the hero stacks: text first, then the photo. The handwritten note is hidden
below 1000px. Layouts were checked down to 375px.

## Collections

- **services**: name, one-line description, who it is for, format, length, price shown, included items (one per
  line), home card icon (`compass`, `people` or `bars`), homepage flag, sort order, Portable Text description.
- **insights**: title, summary, topic (`strategy`, `leadership` or `execution`), date shown, reading time,
  homepage flag, sort order, cover `image` + `photo`, Portable Text body (bullet lists are styled).
- **steps** (How an engagement works): title, "when" label, text, sort order.
- **projects** (Typical projects): title, who it was for, what was done, related service slug, sort order.
- **practice** (Contact details): one entry with name, base, phone, enquiry email, reply time and the note above
  the form.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug `about` feeds
  `/about`.

Site settings: the title ("Bridgewell") is the serif wordmark and the tagline ("Independent Consultant") is the
tracked caps line beneath it; an uploaded logo replaces both. Image-bearing entries render the uploaded CMS image
when present and otherwise the bundled `photo` path in `public/images/`. Prices are indicative placeholders in US
dollars, not real offers. The theme shows no testimonials, client names, results claims or percentages.

## Inquiries

The form validates in the browser (name, email, service, organisation size, start time and "what would you like
to move forward" required, with inline messages), then opens the visitor's email app with a pre-filled message
addressed to the consultant. It also carries optional organisation and phone fields. Nothing is sent or stored by
the site itself, and the status message says so; without JavaScript the email address is shown instead. No form
plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended production route; it is not wired
into this standalone theme. The extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: wordmark, headlines and card titles. It is the closest free match to the
    design's high-contrast text serif.
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter`: body text, navigation and
    buttons.
  - [Waterfall](https://fonts.google.com/specimen/Waterfall) via `@fontsource/waterfall`: the handwritten note on
    the hero (live text, not an image).
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 37 (`37-independent-consultant-a.png` and `-b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x702): the design hero with the wordmark, navigation, outlined button, eyebrow, headline,
    sub text, call to action and the handwritten wall note removed by inpainting (the theme draws live text over
    the same spots). The mug "GOOD WORK BUILDS CHANGE" and the book "A BRIGHTER MORE FOCUSED TOMORROW" are physical
    objects in the photo and stay.
  - `about-portrait.webp`: a crop of the cleaned hero, upscaled about 1.5 times with light sharpening.
  - `cover-*.webp`: object and desk crops of image b (a globe, a mountain painting with a gold line, a pen pot and
    books, olive branches, an open notebook), upscaled 1.5 to 1.7 times. They have no people or text in them.
  The source comps are small, so some crops are soft and a few images repeat across pages. Clara Weston is a
  fictional, AI-generated persona; the About page says so.
- **Icons** (arrows, menu button, compass, people and bar chart) are inline SVG. No other external requests, no
  browser storage, no analytics.

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
horizontal overflow at 375px, mobile menu opens, `?service=` pre-selection and the `?topic=` filter work, unknown
URLs return 404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): text, buttons,
circles and photo positions are within about 1 to 4px. The right edge sits about 8px left because of the narrower
viewport. The handwriting font is a little more upright than the design's pen.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database
until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (consultant, city, phone, email, services, notes and prices) is synthetic; the phone number
uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL Open
Font License 1.1.
