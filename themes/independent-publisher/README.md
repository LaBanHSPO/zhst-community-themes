# Independent Publisher (independent-publisher)

An independent-publisher theme for [EmDash](https://emdashcms.com/), shown with the fictional press "Cord & Page"
(tagline "Independent Publisher"). It pairs a photographic hero (book covers on a wooden shelf, leaf shadows on
a cream wall), a huge near-black serif headline ("A home for curious readers."), tracked small-caps labels, warm
off-white paper and a single very dark green button. It ships a filterable book collection with book pages,
authors, a journal, an about page with submissions info and a topic-routed contact page, all driven by CMS
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js
server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 15. The extension manifest declares type `company`
with `inquiry: true`.

## Routes

| Route | Page |
|---|---|
| `/` | Hero, "Featured titles" (three covers and the small-caps aside), authors teaser, journal teaser, submissions band, footer |
| `/books` | All books with a genre filter (`/books?genre=fiction`, `poetry`, `nonfiction`) |
| `/books/[slug]` | Book page: cover, author link, summary, synopsis, details (genre, year, format, pages, sample ISBN), "where to find it" text, more books |
| `/authors` | Author list (initials monogram, titles, one-line intro) |
| `/authors/[slug]` | Author page: biography and their books |
| `/journal` | Journal posts as a card grid |
| `/journal/[slug]` | Journal post |
| `/about` | CMS page `about`, including submissions information |
| `/contact` | Topic-routed contact form (`?topic=submissions\|rights\|events\|bookshops\|general` pre-selects); emails and phone always shown |
| `/[slug]` | CMS pages (`usage-and-credits` is seeded and listed in the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Books / Authors / Journal / About`) is an EmDash menu editable in the admin. Below 921px it
collapses into a button that opens a panel (a native `<details>` element, so it works without JavaScript) and
also lists Contact. The search icon links to `/books`; there is no site search. On phones the hero stacks: text
first, then the photograph.

## Collections

- **books** — title, subtitle, author (slug of an author entry), genre (select: `fiction` / `poetry` /
  `nonfiction`), one-line summary, synopsis (paragraphs separated by a blank line), year, pages, format, sample
  ISBN, "show on the homepage" flag, sort order, typeset-cover colour (`forest` / `ink` / `clay` / `sand`),
  cover `image` + `photo`, optional Portable Text body.
- **authors** — name, one-line intro, homepage flag, sort order, Portable Text biography.
- **journal** — title, kind, date (as shown), written by, summary, sort order, cover `image` + `photo`, Portable
  Text body.
- **topics** — contact topics: title, description, the email of the desk that answers, sort order.
- **press** — one entry: name, address, phone, main email, reply time, contact note, the small caps beside the
  search icon and beside the featured titles, the submissions-band text and the "where to buy" sentence.
- **pages** — title, small label, intro, optional side photo, optional contact topic for the closing button,
  Portable Text content.

Site settings: the title ("Cord & Page") is the serif wordmark and the tagline ("Independent Publisher") is the
tracked line under it; an uploaded logo replaces the sprig mark and both. Books with no cover image render a
typeset cover from the title, subtitle, author and chosen colour; four seeded books use cover images and three
use typeset covers. Authors have no photographs; they are shown with an initials monogram. Empty collections
are handled in the templates; an unknown `?genre=` shows all books.

## Contact

The form validates in the browser (name, email, topic and subject required, with inline messages), then opens
the visitor's email app with a pre-filled message addressed to the desk of the chosen topic (falling back to
the main email). Nothing is sent or stored by the site itself, and the status message says so; without
JavaScript the email address is shown instead. `?topic=` pre-selects a topic (the submissions band and the
About page link with `?topic=submissions`). All desks, the main email and the phone are listed beside the form.
No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended production route; it is
not wired into this standalone theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, both under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines and body, © The Newsreader Project Authors. It is slightly
    wider and lighter than the design's headline face, so the headline is set a little smaller and tighter.
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter`: tracked small-caps
    labels, © The Inter Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 15 (`15-independent-publisher-a.png` and `-b.png`, AI-generated design comps):
  - `hero.webp` (1448×554) and `header-band.webp` (1448×78): the design screen's hero photograph and header
    background; all overlaid UI text (wordmark, navigation, headline, subhead, button) was removed by
    inpainting and is rendered live. Text printed on the books in the photo ("Small Kindnesses", "The Quieter
    World", "Maps of Belonging", the spine) is part of the product imagery and was kept.
  - `cover-river-between`, `cover-brighter-silence`, `cover-long-way-home` (336×508) and
    `cover-small-kindnesses` (414×756): the printed covers from the design screen, upscaled 2× from about
    170×255 px, so they are soft on the book pages.
  - `journal-*.webp` and `shelf.webp`: crops and a resize of the text-free product illustration (b).
  The mockup (c) is not used. Author names on covers are fictional. Photos repeat across pages and no person is
  shown.
- **Icons** (sprig mark, search, arrows, menu button) are inline SVG. No other external requests, no browser
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

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the admin setup
wizard, which can apply the same seed).

## Checks

`npm run typecheck` (astro check: 0 errors, 0 warnings, 0 hints) and the production build (Node adapter,
standalone server) both pass.

Tested with Node 24.21.0 on macOS, Node adapter only. Routes were checked at 1440px and 375px widths in Chrome
(no horizontal overflow at 375px). The 1440×1086 homepage fold was overlaid on the design screen (1448 wide):
text, photo and cover positions are within about 3px; the headline is about 3% wider and lighter than the
design.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database
until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (press, authors, books, journal posts, phone, emails) is synthetic; the phone number uses a
fictional 555-01xx-style number and emails use the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
