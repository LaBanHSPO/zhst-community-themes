# Freelance Writer (freelance-writer)

An editorial freelance-writer portfolio theme for [EmDash](https://emdashcms.com/), shown with the fictional
writer "Freelance Writer" (Rowan Blake, Bristol). It pairs a sunlit writing-desk hero and a near-black serif
headline ("Words that move ideas forward.", with "forward." in dark green) with tracked monospace labels,
warm off-white paper and a single dark-green button. It ships a filterable archive of articles, article
pages, a services section, an about page and a commission enquiry page, all driven by CMS collections and
seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js server with
SQLite and local file storage.

The homepage follows the Buildful design screen for concept 14 ("Words that move ideas forward." / "Read
selected work" / "Ideas, people and the wider picture."). The design shows no navigation, so the theme adds a
small Work / About / Contact menu in a translucent paper chip at the top right. The extension manifest
declares type `bio` with `inquiry: true`.

## Routes

| Route | Page |
|---|---|
| `/` | Hero (wordmark, headline, "Read selected work"), "Featured writing" with three article cards and the closing quote, "What I write" services with who-I-write-for sectors, commission band |
| `/work` | All articles as a card grid with a category filter (`/work?category=technology`, `productivity`, `lifestyle`, `culture`) |
| `/work/[slug]` | Article: category breadcrumb, publication (fictional), date, reading time, cover, summary, body, more writing |
| `/about` | About: CMS page `about` with the workspace photograph (no person is shown) |
| `/contact` | Commission enquiry (name, email, service, project, optional deadline and phone, notes); email and phone always shown beside it |
| `/[slug]` | CMS pages (`usage-and-credits` is seeded and listed in the footer automatically) |
| `404` | Styled not-found page (unknown pages and articles render it with HTTP 404) |

The primary menu (`Work · About · Contact`) is an EmDash menu editable in the admin. Below 861px it collapses
into a button that opens a panel (a native `<details>` element, so it works without JavaScript). On phones the
hero stacks: text on paper first, then the photograph.

## Collections

- **articles** (Work): title, category (select: `technology` / `productivity` / `lifestyle` / `culture`),
  publication (a fictional name), date (as shown), reading time in minutes, one-line summary, "show on the
  homepage" flag, sort order, cover `image` + `photo`, Portable Text body.
- **services**: title, text, sort order (homepage section; each links to `/contact?service=<slug>`).
- **studio**: a single entry with name, writer, base, phone, enquiry email, reply time, contact note, "who I write
  for" sectors (one per line) and the closing note used in the commission band.
- **pages**: title, optional small label and intro, optional side photo, Portable Text content. The page
  with slug `about` feeds `/about`.

Site settings: the title ("Freelance Writer") is the serif wordmark and the tagline ("Ideas  People  A
brighter tomorrow") is the small tracked monospace line under it; an uploaded logo replaces the quill mark and
both. Image-bearing entries render the uploaded CMS image when present and otherwise the bundled `photo`
path in `public/images/`. Empty collections are handled in the templates; an unknown `?category=` shows all
articles.

## Commission enquiries

The form validates in the browser (name, email, service and project required, with inline messages), then
opens the visitor's email app with a pre-filled message addressed to the enquiry email. Nothing is sent or
stored by the site itself, and the status message says so; without JavaScript the email address is shown
instead. `?service=articles|copywriting|editing|ghostwriting` pre-selects the service (the homepage service
links use this). Email and phone are always listed beside the form. No form plugin is used. The hosted
ZeroHostCMS native inquiry handler is the intended production route; it is not wired into this standalone
theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, both under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines and body, © The Newsreader Project Authors. Its display
    optical size with tight tracking approximates the design's headline face.
  - [IBM Plex Mono](https://github.com/IBM/plex) via `@fontsource/ibm-plex-mono`: tracked small-caps
    labels, © IBM Corp.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 14 (`14-freelance-writer-a/b.png`, AI-generated design comps):
  - `hero-desk.webp` (1018×592): the design screen's desk photograph; the headline's overlapping letters
    were removed by inpainting (the theme draws the live text). Text on physical objects (book spines, mug,
    plant pot, pinned note) is part of the photo and was kept.
  - `coast-path`, `focused-day`, `valley` (about 333×170): the three card photos from the design screen;
    they are small and look soft on the article and archive pages. `books-stack` is a crop of the desk photo.
  - `desk-full`, `desk-wide`, `papers`, `notebook-pen`, `window-cup`, `plant-sea`: the text-free product
    illustration (b) and crops of it.
  The mockup (c) is not used. The photos repeat across articles. No person is presented as the writer.
- **Icons** (quill mark, arrows, menu button) are inline SVG. No other external requests, no browser
  storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the admin
setup wizard, which can apply the same seed).

## Checks

`npm run typecheck` (astro check: 0 errors, 0 warnings) and the production build (Node adapter, standalone
server) both pass.

Tested with Node 24.21.0 on macOS, Node adapter only. Routes were checked at 1440px and 375px widths in
Chrome (no horizontal overflow at 375px, mobile menu opens, `?service=` pre-selection and form validation
work). The 1440×1086 homepage fold was overlaid on the design screen (1448 wide, so right-hand elements sit
about 8px left); text, photo and card positions are within about 3px vertically. Newsreader is slightly
wider than the design's serif, so card excerpts wrap differently in places.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (writer, publications, services, phone, email) is synthetic; the phone number uses a
555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL Open
Font License 1.1.
