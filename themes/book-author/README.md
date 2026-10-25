# Book Author (book-author)

A warm, literary author theme for [EmDash](https://emdashcms.com/), shown with the fictional novelist
"Elise Rowan". A dark, full-bleed study portrait hero with a large off-white serif headline and a
terracotta button leads into a pale "new novel" section with the book standing on stone, handwritten
margin notes, then a pull-quote band, earlier books, journal teasers and a "write to the author" band.
It ships a books collection with book pages (cover, synopsis, excerpt, details, where to find it), an
about page, a journal and a contact page, all driven by CMS collections and seeded with synthetic
sample content. It is a standalone EmDash host that runs on any Node.js server with SQLite and local
file storage.

The homepage follows the Buildful design screen for concept 13 ("Stories that stay with you." /
"The Farther Shore").

## Routes

| Route | Page |
|---|---|
| `/` | Photo hero (headline, lede, "Discover the book", motto, handwritten note), featured novel section, pull quote from the book, earlier books, journal teasers, contact band |
| `/books` | All books as covers with kind, year and one-line pitch |
| `/books/[slug]` | Book page: cover, pitch, description, details (kind, year, pages, publisher, formats), synopsis, excerpt, "where to find it" (plain-text placeholders, no retailer logos), more books |
| `/about` | About: CMS page `about` with a portrait |
| `/journal` | Journal posts as photo cards |
| `/journal/[slug]` | Journal post with cover photo, text and more posts |
| `/contact` | Contact form (name, email, topic, group, message); `?topic=events\|book-clubs\|rights\|general` pre-selects the topic; email and phone are always shown |
| `/[slug]` | CMS pages (`book-club-guide` is seeded and listed in the footer automatically) |
| `404` | Styled not-found page (unknown pages, books and posts render it with HTTP 404) |

"Discover the book" on the homepage goes to the featured book's page. The primary menu
(`Home · Books · About · Journal`) is an EmDash menu and can be edited in the admin; Contact is linked
from the mobile menu, footer and the contact band.

Below 900px the navigation collapses into a round button that opens a panel (a native `<details>`
element, so it works without JavaScript). On phones the hero stacks: text first, then the portrait,
and the handwritten notes are hidden.

## Collections

- **books**: title, one-line pitch, short description, kind, year, pages, publisher, formats, pull
  quote for the homepage, "where to find it" (one per line, `Place: note`), "feature on the homepage"
  flag, sort order, cover `cover` upload + `cover_photo` bundled path, "print the title on the cover
  art" flag (for art without lettering; a book with no cover at all gets a typeset cover), Portable
  Text excerpt and synopsis.
- **journal**: title, category, date (as shown), summary, homepage flag, sort order (newest first),
  `image` upload + `photo` bundled path, Portable Text post.
- **author**: a single entry with name, base, phone, contact email, reply time and the note beside the form.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: the title ("Elise Rowan") is the tracked serif wordmark and the tagline ("Writer of
brighter places") the tiny caps line beside the leaf-sprig mark; an uploaded logo replaces all three.
Entries render the uploaded CMS image when present and otherwise the bundled path in `public/images/`.
Empty collections are handled in the templates. Note: the homepage "new novel" scene
(`book-scene.webp`) has the Farther Shore cover baked into the photo, so it does not change when
another book is featured; the headline, pitch and links do.

## Contact

The form validates in the browser (name, email, topic and message required, with inline messages),
then opens the visitor's email app with a pre-filled message addressed to the author's email, with the
topic in the subject. Nothing is sent or stored by the site itself, and the status message says so;
without JavaScript the email address is shown instead. Email and phone are always listed beside the
form. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended production
route; it is not wired into this standalone theme. The extension manifest declares `inquiry: true`
and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes, roman and
    italic) via `@fontsource-variable/newsreader`: headlines, wordmark, body, buttons, © The
    Newsreader Project Authors.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via `@fontsource-variable/figtree`:
    navigation, labels and light sans paragraphs, © The Figtree Project Authors.
  - [La Belle Aurore](https://fonts.google.com/specimen/La+Belle+Aurore) via
    `@fontsource/la-belle-aurore`: the handwritten margin notes, © Dave Bastian.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 13 (`13-book-author-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448×651): the design screen hero with the logo, navigation, headline, copy,
    button, motto and the handwritten note removed (inpainting; the theme draws the live text over the
    same spots). The stacked books keep their spine words.
  - `book-scene.webp` (540×432), `coast-cliff.webp` (688×432): the book-on-stone scene and the faded
    coast from the design's second section, with the section text and note removed. The cover lettering
    belongs to the printed book and stays. `cover-farther-shore.webp` is a crop of that cover.
  - `cover-lanterns.webp` (424×566), `portrait-author.webp`, `vase-flowers.webp`, `desk-notebook.webp`,
    `spines-stack.webp`: crops of the text-free illustration (b). The lanterns cover has no lettering,
    so the theme prints its title and the author's name over the art.
  The source comps are small, so several crops are soft and some photos repeat across pages. The same
  AI-generated woman appears as the hero and about portrait; she is fictional.
- **Icons** (leaf mark, arrows, menu button) are inline SVG. No other external requests, no browser
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

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Routes were checked at 1440px and 375px widths in
Chrome (no horizontal overflow at 375px, mobile menu opens, `?topic=` pre-selection and form validation
work). The 1440×1086 homepage fold was measured against the design screen: headline, copy, buttons and
the featured-book text are within about 1–3px; the handwriting font is a little heavier than the
design's pen, and the tracked caps are approximated.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (author, books, publisher, places, phone, email and prose) is synthetic; the phone
number uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain
under the SIL Open Font License 1.1.
