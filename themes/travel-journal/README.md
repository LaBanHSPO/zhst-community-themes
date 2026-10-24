# Travel Journal (travel-journal)

A personal travel blog theme for [EmDash](https://emdashcms.com/), shown with a fictional writer, "Iris Calder".
A cinematic mountain-lake photo hero with a white serif headline and a muted sage button leads into an
off-white section of white article cards, then destinations by region, a featured long read, a short
about-the-writer band and a "new posts by email" band. It ships a journal with region filters and
pagination, a destinations page with post counts, server-side search, an about page and a contact page, all
driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash host that runs
on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 34 ("Stories from the road.").

## Routes

| Route | Page |
|---|---|
| `/` | Photo hero (headline, sub line, "Explore the journal", handwritten note), latest posts, regions, long read, writer band, email band |
| `/journal` | All posts, newest first, 6 per page ("Older posts" / "Newer posts"); `?region=europe\|canada\|asia\|field-notes`, `?destination=<slug>` and `?page=` |
| `/journal/[slug]` | Post: cover, region, destination, date, reading time, body with photo blocks, newer/older links, related posts |
| `/destinations` | Regions and destinations with live post counts; each links to the filtered journal |
| `/search` | `?q=` server-side search over titles, excerpts, destinations and regions; the header magnifier links here |
| `/about` | CMS page `about` with a photo |
| `/contact` | Mailto form; `?topic=note\|collaboration\|newsletter\|other` pre-selects the topic; email and phone are always shown |
| `/[slug]` | Other CMS pages (listed in the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Home, Journal, Destinations, About`) is an EmDash menu and can be edited in the admin.
Search and Contact are linked from the header icon, mobile menu and footer. Below 900px the navigation
collapses into a round button that opens a panel (a native `<details>` element, so it works without
JavaScript). On phones the handwritten note is hidden.

## Collections

- **journal**: title, region, destination, date (as shown), reading time, summary, "show on the homepage"
  flag, "homepage long read" flag, sort order (newest first), `image` upload + `photo` bundled path, Portable
  Text body. Photos inside a post use the `image` block (`asset.url`, `alt`, `caption`).
- **destinations**: name, region, note, sort order, `image` upload + `photo` bundled path. Regions are the
  distinct `region` values; counts come from the posts.
- **writer**: a single entry with name, base, phone, email, short bio, reply time and the note beside the form.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug `about` feeds `/about`.

Site settings: the title ("Travel Journal") is the serif wordmark and the tagline ("Places, People, A
brighter you", comma separated) the three tiny caps words under it; an uploaded logo replaces all of it.
Entries render the uploaded CMS image when present and otherwise the bundled path in `public/images/`.

## Contact and email list

The form validates in the browser, then opens the visitor's email app with a pre-filled message addressed
to the writer. Nothing is sent or stored by the site. "New posts by email" is a plain mailto link, with no
third-party service. The hosted ZeroHostCMS native inquiry handler is the intended production route; it is
not wired into this standalone theme. The extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines, wordmark and body, © The Newsreader Project Authors.
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter`: navigation, labels
    and buttons, © The Inter Project Authors.
  - [La Belle Aurore](https://fonts.google.com/specimen/La+Belle+Aurore) via `@fontsource/la-belle-aurore`:
    the handwritten note, © Dave Bastian.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 34
  (`34-travel-journal-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x601): the design hero with the wordmark, navigation, headline, copy, button and
    note removed (inpainting; the theme draws the live text over the same spots). `hiker-ledge.webp` and
    `fjord-lake.webp` are crops of it. The hiker is seen from behind and is fictional.
  - `card-amalfi`, `card-banff`, `card-hoian` and their detail crops come from the three design cards,
    upscaled 2x, so they are soft at large sizes.
  - `sunset-water`, `hillside-town`, `journal-book`, `journal-scene`, `straw-hat`, `cup-blanket` are crops of
    the text-free illustration (b).
  The source comps are small, so some crops are soft and several photos repeat across pages.
- **Icons** (mountain mark, search, arrows, menu button) are inline SVG; the mountain mark is an
  approximation. No other external requests, no browser storage, no analytics.

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
horizontal overflow, mobile menu opens, `?topic=` pre-selection works, unknown URLs return 404). The 1440x1086
homepage fold was compared with the design screen (1448 wide): headline, sub line, button, cards and the
card text sit within about 1 to 4px of the design. The mountain mark and the handwriting are approximations.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (writer, places, phone, email and prose) is synthetic; the phone number uses a
555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL Open
Font License 1.1.
