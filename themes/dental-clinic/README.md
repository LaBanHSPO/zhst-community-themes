# Dental Clinic (dental-clinic)

A bright dental clinic theme for [EmDash](https://emdashcms.com/), shown with the fictional practice
"PearlDental". Airy white and pale blue, deep navy headings in a geometric sans, sage-teal pill buttons and a
full-width team photo behind the headline. It ships a team collection, a services collection with a detail
page per service, a "new patients" page, a first-visit steps section, opening hours with an emergency note and a
mailto appointment request form. Everything is driven by CMS collections and seeded with synthetic sample
content. It is a standalone EmDash host (Node adapter, SQLite, local files).

The homepage follows the Buildful design screen for concept 26 ("Feel good about your smile." and
"More than a visit.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero ("Feel good about your smile.", "Meet the team" to `/team`, three icon points), "More than a visit." with three pillars, services list with length and "from" price, first-visit steps, hours and address, booking band |
| `/team`, `/team/[slug]` | Team collection and profiles. The page ends with a "Book a visit" link to `/contact` |
| `/services`, `/services/[slug]` | Services collection. Each service shows appointment length, price note, what happens, aftercare basics and a link to `/contact?service=<slug>` |
| `/contact` | Appointment request form: new or existing patient, service, preferred day and time, name, email, phone, booking notes. `?service=<slug>` pre-selects the service. Address, phone, email and hours are always shown, with a note that the form is for requests only and that emergencies should call the clinic |
| `/[slug]` | CMS pages. `new-patients` and `privacy` are seeded and linked from the footer |
| `404` | Styled not-found page |

The primary menu (`Home / Our Team / Services / Contact`) is an EmDash menu. "Meet the team" in the header and
hero goes to `/team`. Below 1020px the navigation collapses into a round button that opens a panel (native
`<details>`, works without JavaScript) and the hero stacks the text above the photo.

## Collections

- **services**: name, summary, icon, homepage flag, sort order, appointment length, price note
  (for example "From $95" or "Ask at reception"), intro, Portable Text content, what happens (one step per line),
  aftercare basics (one per line), `image` + `photo`.
- **people**: name, role, short bio, sort order, Portable Text profile, `image` + `photo`.
- **points**: the three hero icon labels and the three pillars under "More than a visit." (icon, title, text).
- **steps**: the first-visit steps.
- **clinic**: one entry: name, address, phone, appointment email, opening hours (`Day|Hours` per line),
  emergency note, note shown on the contact page.
- **pages**: title, small label, intro, Portable Text content.

Site settings: title "PearlDental" and tagline "Brighter days ahead" form the wordmark; an uploaded logo
replaces them.

## Appointment requests

The form validates in the browser (patient type, service, name and email required), then opens the visitor's
email app with a pre-filled message addressed to the clinic email. Nothing is sent or stored by the site, and the
status message says so; without JavaScript the email address is shown instead. The form asks for no medical
details. The content makes no outcome promises, no "painless" claims, no testimonials and no degrees, awards or
review claims. The hosted ZeroHostCMS handler is the intended production route and is not wired here.

## Fonts, images and external requests

- **Font**, self-hosted via npm (no CDN): [DM Sans](https://github.com/googlefonts/dm-fonts)
  (`@fontsource-variable/dm-sans`) for headings, navigation and body text. SIL Open Font License 1.1,
  © the DM Sans Project Authors. It approximates the geometric sans in the design.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 26
  (`26-dental-clinic-a.png`, `26-dental-clinic-b.png`, AI-generated design comps; the people are not real):
  - `hero-home.webp` is the photo half of the design hero, cut at the point where the headline ends. The left
    edge fades into the page colour in CSS. The wall handwriting is part of the photo.
  - `approach-room.webp` is the treatment-room photo from the design (1.5x upscaled). The wall lettering is
    painted on the wall in the picture and stays. The rounded corners are applied in CSS.
  - `visit-dentist` (illustration b) and its crops `instruments`, `tooth-sign`, `patient-smile`, `lamp`.
  - Portraits `team-ana`, `team-tom`, `team-nora` (from the hero) and `team-priya`, `team-luis` (from
    illustration b) are small crops, upscaled 2x to 2.5x, so they are a little soft.
  - Concept c (monitor mockup) is not used because its screen carries printed text.
- **Icons** (tooth mark, leaf, tooth, people, smile and the service icons) are inline SVG approximations. The
  clinic address links to Google Maps in a new tab. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5**.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Edit content at `/_emdash/admin/`. Seeding skips content that already exists; delete `data.db` to re-seed.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server
```

Routes were checked at 1440px and 375px in Chrome (no horizontal overflow, mobile menu is a `<details>`).
The 1440x1086 homepage fold was compared with the 1448x1086 design: wordmark, navigation, headline, sub-line,
icon row, section heading, pillars and photos sit within a few pixels.

## License

MIT. Sample content (clinic, address, phone, email, staff and prices) is synthetic; the phone number uses the
555-01xx range and the email uses the `.example` domain. The font remains under the SIL Open Font License 1.1.
