# Physiotherapy Clinic (physiotherapy-clinic)

A bright white and deep green theme for [EmDash](https://emdashcms.com/), shown with the fictional practice
"MoveWell Physiotherapy Clinic". It has a full-bleed photo hero, three service columns, a first-visit guide,
a list of common reasons to visit, a team teaser, an hours and address block, a services collection, an about
page with the team, a first-visit page and an appointment request page. Everything is driven by CMS
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on any
Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 27 ("Move with more confidence." / "Care for how
you move.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (eyebrow, headline, sub text, "Explore services"); three service columns; first-visit steps beside a photo; common reasons to visit; team; hours and address |
| `/services` | All services as cards with typical length and a "from" price |
| `/services/[slug]` | Service detail: who it is for, length, price, description, what a session involves, how to book, other services |
| `/about` | CMS page `about` with opening hours beside the text and the team grid below |
| `/first-visit` | CMS page `first-visit`: what to wear and bring, cancelling |
| `/contact` | Appointment request form; `?service=<slug>` pre-selects the service; phone, email, address and hours are always shown beside it |
| `/[slug]` | Any other CMS page (linked from the footer automatically when it is not in the menu) |
| `404` | Styled not-found page |

The primary menu (`Home, Services, About, Contact`) is an EmDash menu and can be edited in the admin. The
"Book a visit" pill in the header and every booking button go to `/contact`; "Explore services" goes to
`/services`.

Below 900px the navigation collapses into a round button that opens a panel (a native `<details>` element, so
it works without JavaScript). On phones the hero stacks: photo first, then the text. Layouts were checked down
to 375px.

## Collections

- **services**: name, summary, who it is for, typical length, price (a "from" placeholder), what a session
  involves (one item per line), how to book, home column text (a line break splits it into two lines), icon
  (`runner`, `stretch`, `lotus`, `bolt`, `dumbbell` or `repair`), home page flag (the first three flagged
  services appear on the homepage), sort order, `image` + `photo`, Portable Text description.
- **team**: name, role, short description, sort order, `image` + `photo`. A member without a photo shows
  initials in a tinted square.
- **steps** (first-visit steps): title, text, sort order.
- **clinic**: one entry with the clinic name, phone, request email, address (one line per row), opening hours
  (one per line, day and time split by a `|`), a note under the hours, the list of common reasons to visit (one
  per line) and the note shown beside the form.
- **pages**: title, optional small label and intro, Portable Text content.

Site settings: the title ("MoveWell") is the wordmark with its last word in green and the tagline
("Physiotherapy Clinic") is the tracked caps line beneath it; an uploaded logo replaces both. Image-bearing
entries render the uploaded CMS image when present and otherwise the bundled `photo` path in `public/images/`.

## Health content

The theme makes no outcome promises, shows no testimonials, awards or ratings, and states no degrees or years
of experience. The footer says the site is general information and not medical advice. The request form asks
visitors to leave out medical details and to call the local emergency number for anything urgent. Opening
hours, prices and the practice itself are placeholders: replace them with your own details and policies.

## Inquiries

The form validates in the browser (name, email, first or returning visit, and service required, with inline
messages), then opens the visitor's email app with a pre-filled message addressed to the clinic. Nothing is
sent or stored by the site itself, and the status message says so; without JavaScript the email address is
shown instead. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended
production route; it is not wired into this standalone theme. The extension manifest declares `inquiry: true`
and type `company`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Inter Tight](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter-tight`: headlines,
    wordmark, titles. It approximates the design's geometric sans.
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter`: body text, navigation
    and buttons.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 27 (`27-physiotherapy-clinic-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448x633): the design hero with the eyebrow, headline, sub text and button removed by
    inpainting (the theme draws live text over the same spots). The "Move Live Thrive" handwriting is on the
    wall in the photo and was kept.
  - `session.webp` is the full image b. `mobility`, `posture`, `squat`, `strength` and the team portraits are
    crops of images a, b and c. The "WellMove" lettering on one polo in image c was inpainted out of the team
    portrait. Some crops are small and a few photos repeat across pages.
  All people, names, the clinic, the address and the phone number are fictional.
- **Icons** (arrows, menu button, leaf mark, service icons) are inline SVG approximations. No other external
  requests, no browser storage, no analytics.

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

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px (no
horizontal overflow at 375px, mobile menu opens, `?service=` pre-selection works, unknown URLs return 404).
The 1440x1086 homepage fold was compared with the design screen (1448 wide): text, icons and column positions
are within a few pixels; the right edge sits about 8px left because of the narrower viewport. Inter Tight
approximates the headline face, so letter shapes differ slightly from the design.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database
until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (clinic, staff, address, phone, email, services, prices and opening hours) is synthetic;
the phone number uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts
remain under the SIL Open Font License 1.1.
