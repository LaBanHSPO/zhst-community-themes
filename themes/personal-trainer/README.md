# Personal Trainer (personal-trainer)

A dark gym theme for [EmDash](https://emdashcms.com/), shown with the fictional one-person studio "Movement
Personal Training". The homepage has a full-bleed charcoal hero with the headline "Stronger, one session at a
time.", a light panel with three short promises beside a dumbbell photo, then how it works, three training
options, a pricing summary, location and hours, and a start band. Training options and pricing plans are CMS
collections. It is a standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 46 ("Stronger, one session at a time." and "A
training approach that fits you").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (headline, sub text, "Explore training"); approach panel with dumbbell photo; how it works; featured training options; pricing summary; location and hours; start band |
| `/training` | All training options: who each is for, length, first step of a session |
| `/training/[slug]` | Training detail: what a session looks like step by step, who it is for, length, what to bring, other options |
| `/pricing` | Pricing plans from a CMS collection: price, sessions, best for, what is included, plus "good to know" notes |
| `/about` | CMS page `about`: how the trainer works, a clearly labelled placeholder for the owner's real qualifications |
| `/contact` | Free intro chat form (mailto): `?option=<training slug>\|not-sure` pre-selects what to try, `?plan=<plan slug>` pre-selects a plan; a health-check note, phone, email, studio address and hours are always shown |
| `/[slug]` | Any other CMS page (linked from the footer when it is not in the menu) |
| `404` | Styled not-found page |

The primary menu (`About, Training, Pricing, Contact`) is an EmDash menu and can be edited in the admin. The lime
"Explore training" pill in the header and the hero button go to `/training`.

Below 900px the navigation collapses into a round lime button that opens a panel (a native `<details>` element,
so it works without JavaScript). On phones the hero stacks: text first, then the photo. Between 900px and 1448px
the hero scales in proportion and stays two columns. Layouts were checked down to 375px.

## Collections

- **training**: title, summary, who it is for, length, where, what a session looks like (one step per line), what
  to bring, home page flag (up to three flagged options appear on the homepage), sort order, `image` + `photo`,
  Portable Text description.
- **plans** (pricing): name, price (a placeholder such as `$240 a month (sample price)`; the amount and the unit are
  split for display), sessions, best for, what is included (one per line), sort order.
- **steps** (how it works): title, text, sort order.
- **studio**: one entry with the business name, phone, email, address (one line per row), hours (one per line, day
  and time split by a `|`), a note under the hours, the intro chat note, the health check note, the qualifications
  placeholder and the pricing notes (one per line).
- **pages**: title, optional small label and intro, Portable Text content.

Site settings: the title ("Movement") is the wordmark in tracked caps and the tagline ("Personal Trainer") is the
tiny caps line beneath it; an uploaded logo replaces both. Entries render the uploaded CMS image when present and
otherwise the bundled `photo` path in `public/images/`.

## Health and claims

The theme shows no before and after photos, no weight or body-change promises, no testimonials, no awards and no
certifications. The about page has a dashed "Placeholder: qualifications" box where the owner adds real
qualifications and insurance. The contact page and the footer tell visitors to check with a doctor before starting
a new programme if they have a medical condition, and the form asks them to leave medical details out. Prices,
hours, terms and the business itself are placeholders: replace them with your own.

## Inquiries

The intro chat form validates in the browser (name, email, what to try, goals and availability required, with
inline messages), then opens the visitor's email app with a pre-filled message addressed to the studio. Nothing is
sent or stored by the site itself, and the status message says so; without JavaScript the email address is shown
instead. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended production route;
it is not wired into this standalone theme. The extension manifest declares `inquiry: true`, `type: "bio"` and no
booking, checkout, map, PWA or WhatsApp capability.

## Design and assets

- **Type**: Plus Jakarta Sans (variable, weights 200 to 800), self-hosted through Fontsource. It is the closest
  free face to the heavy geometric sans in the design. The headline uses weight 800 with tight tracking.
- **Colour**: charcoal `#14181b`, lime `#c6e989` for buttons, `#84ae47` for rules on light panels, light grey
  `#f4f3f0` panels.
- **Photos**: cropped from the three design images in `public/images/`. The hero photo had the design's wordmark,
  navigation, headline and button painted over it; those were removed so the text on the page is live. Lettering
  that is part of a photographed object (the wall lettering, the bottle) was left in place.
- **People**: the trainer and the woman in the photos are AI-generated. The trainer is presented as a fictional
  person on the about page and is not given qualifications, years of experience or client results.
- **Icons** (arrows, menu button, the double-slash mark, the three line icons) are inline SVG approximations. No
  other external requests, no browser storage, no analytics.

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
horizontal overflow at 375px, mobile menu opens, `?option=` and `?plan=` pre-select, unknown URLs return 404). The
1440x1086 homepage fold was compared with the design screen (1448 wide): headline, sub text, button, tags line,
navigation, panel text and icons are within a few pixels; the right edge sits about 8px left because of the
narrower viewport.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database
until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (business, trainer, address, phone, email, training options, plans, prices and opening hours)
is synthetic; the phone number uses a 555-01xx-style fictional number and the email uses the `.example` domain.
Plus Jakarta Sans is by Tokotype and is licensed under the SIL Open Font License 1.1.
