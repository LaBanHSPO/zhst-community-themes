# Food Journal (food-journal)

A food blog theme for [EmDash](https://emdashcms.com/), shown with a fictional home cook, "Mara Ellison".
A dark food-photo hero with a white serif headline and an herb-green button leads into an off-white section of
four rounded recipe cards, then browse-by-collection tiles, a featured story, an "in season" list and a
"new recipes by email" band. It ships a recipes collection with filters and print-friendly recipe pages,
stories, server-side search, an about page and a contact page, all driven by CMS collections and seeded with
synthetic sample content. It is a standalone EmDash host that runs on any Node.js server with SQLite and
local file storage.

The homepage follows the Buildful design screen for concept 36 ("Made to be shared.").

## Routes

| Route | Page |
|---|---|
| `/` | Photo hero (headline, sub line, "Find a recipe", handwritten note), featured recipes, collection tiles, featured story, in-season list, email band |
| `/recipes` | All recipes; `?collection=fresh-seasonal\|cozy-classics\|weeknight-favorites\|something-sweet` and `?course=starter\|main\|side\|dessert`, which combine; unknown values are ignored |
| `/recipes/[slug]` | Photo, collection, prep/cook/total time, servings, course, "Jump to recipe" link, "Print recipe" button, ingredients (with optional group headings), numbered method, notes, related recipes. Print stylesheet shows only the recipe on white. schema.org `Recipe` JSON-LD is built from the fields |
| `/stories`, `/stories/[slug]` | Short food stories, newest first, 6 per page; a story can link to one recipe at its end |
| `/search` | `?q=` server-side search over recipe titles, summaries, ingredients and collections, and over story titles, summaries and text; the header magnifier links here |
| `/about` | CMS page `about` with a photo |
| `/contact` | Mailto form; `?topic=recipe\|collaboration\|newsletter\|other` pre-selects the topic; email and phone are always shown |
| `/[slug]` | Other CMS pages (listed in the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Home, Recipes, Stories, About`) is an EmDash menu and can be edited in the admin. Search and
Contact are linked from the header icon, mobile menu and footer. Below 900px the navigation collapses into a
round button that opens a panel (a native `<details>` element, so it works without JavaScript), and the hero
photo sits above the headline. The handwritten note is hidden on phones and tablets.

## Collections

- **recipes**: title, short description, collection, course, prep minutes, cook minutes, servings (a number)
  and what it counts (servings, cookies...), ingredients (one per line, a line starting with `#` is a group
  heading), method (one step per line), notes, "show on the home page" flag, sort order, `image` upload +
  `photo` bundled path.
- **stories**: title, date (as shown), reading time, summary, optional recipe slug, homepage flag, sort order,
  `image` upload + `photo` bundled path, Portable Text body with `image` blocks.
- **season**: ingredient, what to look for, recipe slug, sort order (the homepage "in season" list).
- **cook**: a single entry with name, base, phone, email, short bio, reply time and the note beside the form.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug `about` feeds `/about`.

The four collections (Fresh & Seasonal, Cozy Classics, Weeknight Favorites, Something Sweet) and the four
courses are fixed lists in `src/lib/food.ts`. Site settings: the title ("Food Journal") is the serif wordmark and
the tagline ("Good food brighter days") the tiny caps line under it; an uploaded logo replaces both.

## Contact and email list

The form validates in the browser, then opens the visitor's email app with a pre-filled message addressed to the
cook. Nothing is sent or stored by the site. "New recipes by email" is a plain mailto link, with no third-party
service. The hosted ZeroHostCMS native inquiry handler is the intended production route; it is not wired into
this standalone theme. The extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines, wordmark and body, (c) The Newsreader Project Authors.
  - [Poppins](https://github.com/itfoundry/poppins) via `@fontsource/poppins` (300, 400): small caps labels,
    tags, forms, (c) The Poppins Project Authors.
  - [Mr De Haviland](https://fonts.google.com/specimen/Mr+De+Haviland) via `@fontsource/mr-de-haviland`: the
    handwritten note, (c) Robert Leuschke.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 36
  (`36-food-journal-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448x555): the design hero with the headline, copy, button and handwritten note removed
    (inpainting; the theme draws the live text over the same spots). `spaghetti-bowl.webp` is a crop of it.
  - `card-*.webp` are the four design cards, upscaled 2x, so they are soft at large sizes.
  - `quinoa-bowl`, `penne-basil`, `herb-salad` and `cookie-rack` come from the laptop mockup (c). The last three
    are only about 260x125px in the source and are upscaled 3x, so they are noticeably soft on recipe pages.
  - `notebook-spread`, `basil-oil` and `parmesan-board` are crops of the text-free illustration (b).
  The source comps are small, so some crops are soft and photos repeat across pages.
- **Icons** (leaf mark, search, arrows, menu button) are inline SVG; the leaf mark is an approximation. No other
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

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content.

## Checks

```sh
npm run typecheck   # astro check
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px (no
horizontal overflow, mobile menu opens). The recipe filters, search and `?topic=` pre-selection were checked
against the rendered HTML, and the recipe JSON-LD was parsed. The 1440x1086 homepage fold was compared with the
design screen (1448 wide): headline baselines, sub line, button and card photos sit within about 1 to 3px of the
design. The headline is Newsreader squeezed with `scaleX(0.94)` to match the design's narrower letterforms; the
leaf mark and the handwriting are approximations.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database
until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (cook, recipes, stories, phone, email and prose) is synthetic; the phone number uses a
555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
