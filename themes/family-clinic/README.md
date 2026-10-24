# Family Clinic (family-clinic)

A bright white and mint theme for [EmDash](https://emdashcms.com/), shown with the fictional practice
"Havenbrook Family Clinic". It has a full-bleed photo hero, a row of four care cards, a new-patient steps
band, an hours and address block, a care services collection, a team page, a patient information page and an
appointment request page. Everything is driven by CMS collections and seeded with synthetic sample content.
It is a standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 25 ("Care for every chapter." /
"Whole-family care, all in one place.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (eyebrow, headline, sub text, "Book an appointment", three icon labels); four care cards; four new-patient steps; hours, address and contact |
| `/care` | The four care services as photo cards, each with who it is for |
| `/care/[slug]` | Service detail: description, what a visit involves, how to book, other care |
| `/team` | Team grid: photo or initials, name, role and a one-line description |
| `/patients` | CMS page `patients`: new patients, what to bring, cancellations, after-hours information, insurance placeholder, privacy; opening hours beside the text |
| `/contact` | Appointment request form; `?service=<slug>` pre-selects the visit type; phone, email, address and hours are always shown beside it |
| `/[slug]` | CMS pages (`privacy` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Care, Our Team, For Patients, Contact`) is an EmDash menu and can be edited in the admin.
The teal "Book an appointment" pill in the header and every booking button go to `/contact`.

Below 1000px the navigation collapses into a round button that opens a panel (a native `<details>` element,
so it works without JavaScript). On phones the hero stacks: text first, then the photo. Layouts were checked
down to 375px.

## Collections

- **services** (Care): name, one-line description, who it is for, what a visit involves (one item per line),
  how to book, homepage card text (a line break splits it into two lines), icon (`stethoscope`, `baby`,
  `family` or `heart`), circle colour (`mint`, `blue`, `peach` or `lavender`), homepage flag, sort order,
  `image` + `photo`, Portable Text description.
- **team**: name, role, short description, sort order, `image` + `photo`. A member without a photo shows
  initials in a tinted circle.
- **highlights** (icon row in the hero): label, icon (`people`, `heart` or `leaf`), sort order.
- **steps** (new-patient steps): title, text, sort order.
- **clinic**: one entry with clinic name, phone, request email, address (one line per row), opening hours (one
  per line, day and time split by a `|`), a note under the hours, after-hours information and the note shown
  beside the form.
- **pages**: title, optional small label and intro, Portable Text content.

Site settings: the title ("Havenbrook") is the serif wordmark and the tagline ("Family Clinic") is the
tracked caps line beneath it; an uploaded logo replaces both. Image-bearing entries render the uploaded CMS
image when present and otherwise the bundled `photo` path in `public/images/`.

## Health content

The theme makes no outcome promises, shows no testimonials, awards or ratings, and states no degrees or
years of experience. The footer says the site is general information and not medical advice. The request form
and the contact page both say the form is for appointment requests only, to leave out medical details, and to
call the local emergency number in an emergency. Opening hours, insurance wording and the practice itself are
placeholders: replace them with your own details and policies.

## Inquiries

The form validates in the browser (name, email, new or existing patient, and visit type required, with inline
messages), then opens the visitor's email app with a pre-filled message addressed to the clinic. Nothing is
sent or stored by the site itself, and the status message says so; without JavaScript the email address is
shown instead. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended
production route; it is not wired into this standalone theme. The extension manifest declares `inquiry: true`
and type `company`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines, wordmark, card titles. It approximates the design's serif.
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter`: body text,
    navigation and buttons.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 25 (`25-family-clinic-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x698): the design hero with the logo, navigation, header button, eyebrow, headline,
    sub text, button and icon row removed by inpainting (the theme draws live text over the same spots). The
    handwriting and the "Kind people, healthy communities" sign are part of the photo and were kept.
  - `reception.webp` is the full image b. The care, team and sign images are crops of image b (and the team
    photo of Hannah Lindqvist is a crop of the hero), some enlarged 1.3 to 1.7 times with light sharpening.
  The source comps are small, so some crops are soft and a few photos repeat across pages. All people, names,
  the clinic, the address and the phone number are fictional.
- **Icons** (arrows, menu button, leaf mark, hero icons, care icons) are inline SVG approximations. No other
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
404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): text, icons and card
positions are within about 1 to 3px; the right edge sits about 8px left because of the narrower viewport.
Newsreader approximates the headline face, so letter shapes differ slightly from the design.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (clinic, staff, address, phone, email, services and opening hours) is synthetic; the
phone number uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain
under the SIL Open Font License 1.1.
