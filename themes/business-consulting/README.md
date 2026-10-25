# Business Consulting (business-consulting)

A calm, editorial management-consultancy theme for [EmDash](https://emdashcms.com/), shown with the
fictional firm "Northbridge". It pairs a bright office-photo hero with a white fade, large navy
serif headlines, Inter body copy, warm-grey sections, white rounded service cards with navy, sage
and taupe icon badges, and navy pill buttons. It ships services with detail pages, an insights
journal, an about page with values and team, and a "Talk to us" contact page, all driven by CMS
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on
any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 04 ("Clarity for your next chapter." /
"Talk to us").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: "Clarity for your next chapter." photo hero with "Talk to us" and the "Brighter / Businesses / Stronger / People" side note, "How we help" with three service cards, "Our approach" (photo and four numbered steps), the three latest insights, a navy "Talk to us" band |
| `/about` | About: intro and story from the CMS page `about`, a wide team photo, "What we believe" values, team members (initials monograms), closing band |
| `/services` | All services with icon, summary, intro and photo; "How engagements run" steps |
| `/services/[slug]` | Service detail: summary, intro, photo, Portable Text content, "What you can expect" outcomes, typical engagement, "Talk to us" (pre-selects the service on the contact form), other services |
| `/insights` | Insights journal: newest article as a large feature, the rest as cards, cursor pagination |
| `/insights/[slug]` | Article: topic, date, reading time, photo, Portable Text body (headings, lists, quotes), more insights |
| `/contact` | Talk to us: enquiry form (name, organisation, email, phone, topic, message); phone, email, address and hours are always shown beside it, plus "What happens next" |
| `/[slug]` | CMS pages (`working-together` and `privacy` are seeded) |
| `404` | Styled not-found page (unknown slugs, services and articles render it with HTTP 404) |

The primary menu (`About · Services · Insights · Contact`) is an EmDash menu and can be edited in
the admin. The "Talk to us" pill in the header always links to `/contact`. CMS pages that are not
in the primary menu are listed automatically in the footer (by their small label when set).

On screens narrower than 900px the navigation collapses into a button that opens a panel (a native
`<details>` element, so it works without JavaScript); below 560px the header pill moves into that
panel. The hero stacks its text above the photo on narrow screens.

## Collections

- **services**: name, card description, icon (`chart`, `people`, `gear`, `compass`), icon colour
  (`navy`, `sage`, `taupe`), "show on the homepage" flag, sort order, intro, Portable Text content,
  outcomes (one per line), typical engagement, `image` + `photo`. The homepage shows the first three
  services flagged for the homepage (or the first three overall if none are flagged).
- **insights**: title, topic label, excerpt, date, reading time, `featured_image` + `photo`,
  Portable Text article. Lists are sorted by the `date` field (newest first); if it is empty the
  publish date is shown.
- **principles**: title, text, placement (`approach` for the numbered steps on the homepage and
  services page, `values` for the about page), sort order.
- **people**: name, role, short bio, sort order (about page team).
- **office**: one entry: company name, street, city and postcode, country, phone, enquiries email,
  office hours and the response note shown on the contact page.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug
  `about` feeds `/about`.

Site settings: the title ("Northbridge") is the serif wordmark and the tagline ("Business
Consulting") is the tracked caps line under it; an uploaded logo replaces both. Every image-bearing
entry renders the uploaded CMS image when present and otherwise falls back to the bundled `photo`
path in `public/images/`. Empty collections are handled in the templates.

## Contact requests

"Talk to us" validates in the browser (name, email and message required, with inline error
messages), then opens the visitor's email app with a pre-filled enquiry addressed to the office
email. Nothing is sent or stored by the site itself, and the status message says so; without
JavaScript the email address is shown instead. Phone, email, address and hours are always listed
beside the form. No form plugin is used, so no submissions are stored in the database. The hosted
ZeroHostCMS native inquiry handler is the intended production route; it is not wired into this
standalone theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: SIL Open Font License 1.1, © Production Type.
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter`: SIL Open
    Font License 1.1, © The Inter Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 04 (`04-business-consulting-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×674): design screen hero; the overlaid logo, navigation, button,
    headline, copy and the painted "Brighter Businesses…" wall note were removed by inpainting (the
    theme draws them as live text over the same spot). `team-laptop.webp` is a crop of it.
  - `team-workshop.webp` (1448×1086), `planning-session.webp`, `strategy-tiles.webp`: the
    text-free product illustration (b).
  - `client-meeting.webp` (576×374): the hero photo on the laptop screen in the contextual mockup
    (c), with its wall lettering removed by inpainting.
  The source comps are small (1448×1086), so some crops (the stone tiles and the meeting photo) are
  shown slightly upscaled on detail pages.
- **Icons** (logo mark, service badges, arrows, menu button) are inline SVG. The office address
  links to Google Maps in a new tab. No other external requests, no browser storage, no analytics.

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
checked at 1440px and 375px widths in Chrome; the 1440×1086 homepage fold was measured against the
design screen.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in
the database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (company, people, address, phone, email, articles) is synthetic; the phone
number uses a range reserved for fiction and the email uses the `.example` domain. Fonts remain
under the SIL Open Font License 1.1.
