# Counseling Collective (counseling-collective)

A warm cream-and-green theme for [EmDash](https://emdashcms.com/), shown with the fictional group practice
"Counseling Collective". It has a full-bleed team photo hero with a near-black serif headline and a deep green
pill button, a "How we help" row, a team directory with a focus filter, services, resources with a category
filter, an about page and a request-a-counselor page. Everything is driven by CMS collections and seeded with
synthetic sample content. It is a standalone EmDash host that runs on any Node.js server with SQLite and local
file storage.

The homepage follows the Buildful design screen for concept 33 ("Support, at your pace.").

## Routes

| Route | Page |
|---|---|
| `/` | Photo hero (headline, sub text, "Find your counselor", handwritten note, "A safe space" caption), "How we help" columns, four counselors, how matching works, fees note, latest resources, contact band |
| `/team` | Counselor directory; `?focus=<name>` filters by focus area |
| `/team/[slug]` | Counselor page: focus areas, languages, how they meet clients, availability, a labelled placeholder for registration details; links to `/contact?counselor=<slug>` |
| `/services` | Individual, couples, family, life transitions and group sessions with format, length and a sample fee |
| `/services/[slug]` | Service page with what a session looks like and other services |
| `/resources` | Short articles; `?category=<name>` filters the list |
| `/resources/[slug]` | Article page |
| `/about` | CMS page `about` |
| `/contact` | Request form (mailto): `?counselor=<slug>` and `?service=<slug>` pre-select the lists; preferred days and times, in person or online; crisis note; email, phone, address and hours always shown |
| `/[slug]` | Any other CMS page (linked from the footer when it is not in the menu) |
| `404` | Styled not-found page |

The primary menu (About, Our Team, Services, Resources) is an EmDash menu and can be edited in the admin. The
header pill and the hero button go to `/team`. Below 900px the navigation collapses into a round button that
opens a panel (a native `<details>` element, so it works without JavaScript). On phones the hero stacks: text
first, then the photo. Layouts were checked down to 375px.

## Collections

- **team**: name, role, focus areas (comma separated; the filter is built from these), languages, how they meet
  clients, availability, short introduction, a registration details field (placeholder text), sort order,
  `image` + `photo`, Portable Text biography.
- **services**: name, one-line description, homepage column text, who it is for, format, session length, fee
  (placeholder), what a session looks like (one per line), icon (`people`, `leaf`, `sun`, `family`, `circle`),
  homepage flag (up to three flagged services form the "How we help" row), sort order, `image` + `photo`,
  Portable Text description.
- **posts** (resources): title, excerpt, category, date posted (`YYYY-MM-DD`), reading time, `image` + `photo`,
  Portable Text content.
- **steps** (how matching works): title, text, sort order.
- **practice**: one entry with name, phone, email, address, front desk hours (one per line, day and time split
  by a `|`), reply time, the note above the form and the fees and reduced-fee notes shown on the homepage.
- **pages**: title, optional small label and intro, Portable Text content.

Site settings: the title is the wordmark and the tagline ("People heal together") is the tracked caps line
beneath it; an uploaded logo replaces both. Entries render the uploaded CMS image when present and otherwise
the bundled `photo` path in `public/images/`.

## Health content

The theme makes no outcome promises, shows no testimonials, awards, ratings or years of practice, and states
no qualifications. Each counselor page has a labelled placeholder for real registration details: add your
professional body and number. The contact page and footer say that the practice cannot respond urgently and
point to local emergency numbers and crisis lines. The form asks visitors not to share detailed personal
information. Names, fees, hours and the practice itself are placeholders to replace.

## Inquiries

The form validates in the browser (name, email and preferred times required, with inline messages), then opens
the visitor's email app with a pre-filled message to the practice. Nothing is sent or stored by the site, and
the status message says so; without JavaScript the email address is shown. No form plugin is used. The hosted
ZeroHostCMS native inquiry handler is the intended production route; it is not wired into this standalone
theme. The extension manifest declares `inquiry: true` and type `company`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines, wordmark and titles. It approximates the design's serif;
    the headline size and tracking were tuned to the design.
  - [Inter](https://rsms.me/inter/) (variable) via `@fontsource-variable/inter`: body text, navigation, buttons.
  - [Geist Mono](https://github.com/vercel/geist-font) via `@fontsource/geist-mono`: tracked caps labels.
  - [La Belle Aurore](https://fonts.google.com/specimen/La+Belle+Aurore) via `@fontsource/la-belle-aurore`:
    the handwritten note, which is thinner and more slanted in the design.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 33 (`33-counseling-collective-a.png` and `-b.png`, AI-generated design comps; the people are not real):
  - `hero-home.webp` (1448x725): the design hero with the headline, sub text, button, handwritten note and
    "A safe space" caption removed by inpainting (the theme draws live text over the same spots). The framed
    print and the book titles are physical objects in the photo and stay.
  - `team-1` to `team-5` are cropped from the five people in the hero; `team-6` and the `room-*` photos come
    from image b. Crops are at native resolution (240 to 340px wide portraits), so they are soft when enlarged.
    Photos repeat across pages because the source comps are small.
- **Icons** (arrows, menu button, leaf mark, group, leaf, sun) are inline SVG approximations. No other external
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

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content.

## Checks

```sh
npm run typecheck   # astro check
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px (no
horizontal overflow, mobile menu opens, `?counselor=` and `?service=` pre-selection works, unknown URLs return
404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): wordmark, headline, sub text,
button, caption and the "How we help" row sit within about 1 to 5px of the design. The leaf mark and the
handwriting are approximations.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database
until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (practice, counselors, town, phone, email and fees) is synthetic; the phone number uses a
555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
