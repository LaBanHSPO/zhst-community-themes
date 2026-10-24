# Everyday Nutrition (everyday-nutrition)

A warm cream and forest green theme for [EmDash](https://emdashcms.com/), shown with the fictional nutrition
coaching practice "Everyday Nutrition". It has a full-bleed food photo hero with a serif headline, three
rounded photo cards, a how-coaching-works section, a recipe collection filtered by meal, coaching packages, an
approach page, an about page and a start page. Everything is driven by CMS collections and seeded with
synthetic sample content. It is a standalone EmDash host that runs on any Node.js server with SQLite and local
file storage.

The homepage follows the Buildful design screen for concept 30 ("Good food for real life.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: hero (headline, sub text, "Start your journey", three small icons, handwritten note), "Nutrition that fits your life." with three photo cards, how coaching works, latest recipes, coaching packages, start band |
| `/approach` | CMS page `approach`: how sessions run, what you work on together, what coaching is not |
| `/coaching` | All coaching packages (length, calls, "from" price) and what happens after you write to us |
| `/coaching/[slug]` | Package detail: format, length, price, what is included, other packages |
| `/recipes` | Recipe collection; `?meal=breakfast\|lunch\|dinner\|snacks` filters the list |
| `/recipes/[slug]` | Recipe: photo, time, servings, tags, ingredients list, method steps, cook's note |
| `/about` | CMS page `about`: the practice described plainly, no person presented as the coach, no qualifications claimed |
| `/contact` | Start form (mailto): `?package=<slug>` pre-selects a package; goals and preferred call times; phone, email and hours always shown |
| `/[slug]` | Any other CMS page (linked from the footer when it is not in the menu) |
| `404` | Styled not-found page |

The primary menu (`Approach, Coaching, Recipes, About`) is an EmDash menu and can be edited in the admin. The
"Start your journey" pill in the header goes to `/contact`.

Below 900px the navigation collapses into a round button that opens a panel (a native `<details>` element, so
it works without JavaScript). The hero stacks: text first, then the photo. The handwritten note on the hero is
hidden at that width. Layouts were checked down to 375px.

## Collections

- **pages**: title, eyebrow, intro, optional bundled photo path and description, Portable Text content.
- **packages** (coaching): title, summary, format, length, calls and check-ins, price (a "from" placeholder),
  what is included (one per line), home page flag (up to three flagged packages appear on the homepage), order,
  `image` + `photo`, Portable Text description.
- **recipes**: title, short description, meal type (select: breakfast, lunch, dinner, snacks), time, servings,
  ingredients (one per line), method steps (one per line), tags (comma separated), cook's note, home page flag,
  order, `image` + `photo`.
- **steps** (how coaching works): title, text, order.
- **studio**: one entry with the business name, phone, email, address, hours (one per line, day and time split
  by a `|`), a note under the hours and the note above the form.

Site settings: the title ("Everyday Nutrition") is the wordmark beside the leaf mark; an uploaded logo replaces
both. Entries render the uploaded CMS image when present and otherwise the bundled `photo` path in
`public/images/`.

## Health content

The theme makes no weight or health-outcome promises, shows no testimonials, awards or ratings, sells no
supplements and states no qualifications. The footer says coaching does not replace medical advice. The form
asks visitors to leave out medical details. Prices, hours, the address and the business itself are
placeholders: replace them with your own details, and add allergen information where your local rules require it.

## Inquiries

The Start form validates in the browser (name, email, package, goals and preferred times required, with inline
messages), then opens the visitor's email app with a pre-filled message addressed to the studio. Nothing is
sent or stored by the site itself, and the status message says so; without JavaScript the email address is
shown instead. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended
production route; it is not wired into this standalone theme. The extension manifest declares `inquiry: true`
and type `company`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical size) via
    `@fontsource-variable/newsreader`: wordmark, headlines and recipe numerals. It approximates the design's
    headline serif; the hero headline is set slightly condensed to match its width.
  - [DM Sans](https://github.com/googlefonts/dm-fonts) (variable) via `@fontsource-variable/dm-sans`: body
    text, navigation and buttons.
  - [Over the Rainbow](https://fonts.google.com/specimen/Over+the+Rainbow) via `@fontsource/over-the-rainbow`:
    the handwritten note, which is live text.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 30. Text that was baked into the design photos (headline, buttons, card titles, the note on the
  cloth) was removed by inpainting and replaced with live text. Writing on physical objects (the notebook) was
  left in. Photos repeat across recipes and packages, and some crops are small and upscaled. Replace them from
  the CMS media library; an uploaded image always wins over the bundled path.
- The leaf mark and line icons are hand-drawn SVG approximations, not traced artwork.
- No analytics, trackers or third-party requests.

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
npm run typecheck
npm run build
```

Screenshots of every route at 1440 and 375 pixels are in `screenshots/`.

## Licence

Theme code and seed content: see the repository licence. Fonts: SIL Open Font License 1.1.
