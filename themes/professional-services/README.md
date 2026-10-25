# Professional Services (professional-services)

An editorial advisory-firm theme for [EmDash](https://emdashcms.com/), shown with the fictional
firm "Northbridge". It pairs a full-bleed dusk photo of a rooftop terrace and city skyline with a
large dark green-black serif headline, widely tracked caps labels, thin copper rules, deep teal
square buttons and warm off-white sections. It ships services with detail pages, a team directory
with profile pages, an insights journal, an about page with values and a contact page, all driven
by CMS collections and seeded with synthetic sample content. It is a standalone EmDash host that
runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 06 ("Expertise you can build on." /
"Meet our team"). This is a separate theme from `business-consulting`, which also uses the sample
name Northbridge; the two share no styles.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: "Expertise you can build on." photo hero with the "People Insight Lasting value" eyebrow, "Meet our team" button and the "Ideas / People / Places / Progress" and "A more resilient tomorrow" notes; "Our approach" with the meeting photo and "Different perspectives" note; numbered services on a teal band; four team cards; the three latest insights; a contact band |
| `/about` | About: intro and story from the CMS page `about`, a wide photo, "What we value" (values collection), a team teaser, contact band |
| `/services` | All services as alternating photo rows, "How we work" values on a teal band |
| `/services/[slug]` | Service detail: number, summary, intro, photo, Portable Text content, "What you can expect" outcomes, typical engagement, "Discuss this service" (pre-selects the service on the contact form), other services |
| `/team` | Our Team: every team member as a card with an initials monogram, role, short bio and focus areas |
| `/team/[slug]` | Team profile: monogram, role, bio, Portable Text profile, focus areas, "Talk to …" (pre-fills the adviser on the contact form), colleagues |
| `/insights` | Insights journal: newest article as a large feature, the rest as cards, cursor pagination |
| `/insights/[slug]` | Article: topic, date, reading time, photo, Portable Text body (headings, lists, quotes), more insights |
| `/contact` | Contact: enquiry form (name, organization, email, phone, topic, message); phone, email, address and hours are always shown beside it, plus "What happens next" |
| `/[slug]` | CMS pages (`how-we-work` and `privacy` are seeded) |
| `404` | Styled not-found page (unknown pages, services, people and articles render it with HTTP 404) |

The primary menu (`About · Services · Our Team · Insights`) is an EmDash menu and can be edited in
the admin. Every "Meet our team" button links to `/team`. Contact is linked from the mobile menu,
the contact band and the footer; CMS pages that are not in the primary menu are listed in the
footer automatically (by their small label when set).

Below 960px the navigation collapses into a button that opens a panel (a native `<details>`
element, so it works without JavaScript) with the menu, Contact, "Meet our team" and the phone
number. Below 1200px the decorative side notes on the photos are hidden; on phones the hero copy
sits over the sky with a light wash and the approach photo moves under the text.

## Collections

- **services**: name, one-line summary, "show on the homepage" flag, sort order, intro, Portable
  Text content, outcomes (one per line), typical engagement, `image` + `photo`. The homepage lists
  up to four services flagged for the homepage (or the first four overall if none are flagged).
- **people** (Our Team): name, role, short bio, focus areas (one per line), monogram colour
  (`teal`, `copper`, `stone`), sort order, Portable Text profile. People are shown as initials
  monograms, not photographs.
- **insights**: title, topic label, excerpt, date, reading time, `featured_image` + `photo`,
  Portable Text article. Lists are sorted by the `date` field (newest first); if it is empty the
  publish date is shown.
- **principles** (Values): title, text, sort order (about page and the services page).
- **office**: one entry: company name, street, city/state/ZIP, country, phone, enquiries email,
  office hours and the response note shown on the contact page.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug
  `about` feeds `/about`.

Site settings: the title ("Northbridge") is the serif wordmark and the tagline ("Professional
Services") is the tracked caps line under it; an uploaded logo replaces both. Every image-bearing
entry renders the uploaded CMS image when present and otherwise falls back to the bundled `photo`
path in `public/images/`. Empty collections are handled in the templates.

## Contact requests

The contact form validates in the browser (name, email and message required, with inline error
messages), then opens the visitor's email app with a pre-filled enquiry addressed to the office
email. Nothing is sent or stored by the site itself, and the status message says so; without
JavaScript the email address is shown instead. Phone, email, address and hours are always listed
beside the form. No form plugin is used, so no submissions are stored in the database. The hosted
ZeroHostCMS native inquiry handler is the intended production route; it is not wired into this
standalone theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Source Serif 4](https://github.com/adobe-fonts/source-serif) (variable, optical sizes) via
    `@fontsource-variable/source-serif-4`: SIL Open Font License 1.1, © Adobe.
  - [Instrument Sans](https://github.com/Instrument/instrument-sans) (variable) via
    `@fontsource-variable/instrument-sans`: SIL Open Font License 1.1, © The Instrument Sans
    Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 06 (`06-professional-services-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×698): the design screen hero; the overlaid wordmark, navigation,
    buttons, eyebrow, headline and the white side notes were removed by inpainting (the theme draws
    them as live text over the same spots). `terrace-office.webp` and `city-dusk.webp` are crops
    of it.
  - `approach-meeting.webp` (615×387): the meeting photo from the design screen's first section.
  - `model-review.webp` (1448×1086), `model-table.webp`, `plan-session.webp`: the text-free
    product illustration (b).
  - `studio-team.webp` (600×458): the right-hand, text-free part of the hero photo on the monitor
    in the contextual mockup (c).
  The source comps are small (1448×1086), so the meeting and studio photos are shown slightly
  upscaled where they fill wide columns on narrow layouts. No faces from these photos are used as
  team portraits.
- **Icons** (arrows, menu button, monogram lines) are inline SVG. The office address links to
  Google Maps in a new tab. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the
admin setup wizard, which can apply the same seed). The generated secrets file is private and
git-ignored; never commit it.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 / npm 11.19.0 on macOS, Node adapter only (no Cloudflare run). Routes were
checked at 1440px and 375px widths in Chrome (no horizontal overflow at 375px, mobile menu opens);
the 1440×1086 homepage fold was measured against the design screen (text positions within about
3px).

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in
the database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (company, people, address, phone, email, articles) is synthetic; the phone
number uses the 555-01xx range reserved for fiction and the email uses the `.example` domain. Fonts
remain under the SIL Open Font License 1.1.
