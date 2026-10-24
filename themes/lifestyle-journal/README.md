# Lifestyle Journal (lifestyle-journal)

A warm editorial lifestyle blog theme for [EmDash](https://emdashcms.com/), shown with the fictional journal
"The Lifestyle Journal" (editor Mara Ellison). It pairs a full-bleed sunlit-table hero and a deep olive-black
serif headline ("A little inspiration for every day.") with small tracked sans labels, linen paper and one dark
olive button. It ships a story archive with categories and pagination, story pages with an in-story photo and
related reading, server-side search, an about page and an email contact page, all driven by CMS collections and
seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js server with
SQLite and local file storage.

The homepage follows the Buildful design screen for concept 35. The extension manifest declares type `bio`
with `inquiry: true`.

## Routes

| Route | Page |
|---|---|
| `/` | Hero, "From the journal" cards, a featured story, three category columns, a note from the editor, the monthly email letter band |
| `/stories` | All stories, six per page, with category filter links and numbered pagination (`/stories?category=living`, `wellbeing`, `travel`, `&page=2`) |
| `/stories/[slug]` | Story: breadcrumb, byline, cover, summary, body with an optional photo inside it, more stories (same category first) |
| `/search?q=` | Server-side search over titles, summaries and category names; the header magnifier links here |
| `/about` | CMS page `about` |
| `/contact` | Email form with `?topic=story-idea\|question\|newsletter\|other` pre-selection; the email address is always shown |
| `/[slug]` | Other CMS pages (`reading-and-credits` is seeded and listed in the footer) |
| `404` | Styled not-found page |

Categories use one approach: `/stories?category=<slug>`. The primary menu (`Home, Stories, Living, Travel, About`)
is an EmDash menu editable in the admin and highlights the matching category link. Below 901px the menu
collapses into a native `<details>` panel that works without JavaScript, and the hero stacks (text, then photo).

## Collections

- **stories**: title, category (`living` / `wellbeing` / `travel`), date (as shown), reading time, summary,
  optional homepage-card title with line breaks, "show in the homepage cards" flag, "large featured story" flag,
  sort order, cover `image` + bundled `photo`, optional in-story photo with caption and alt, Portable Text body.
- **journal**: a single entry with the footer name, editor, base, contact email, reply time, contact note,
  homepage editor note and newsletter note.
- **pages**: title, small label, intro, side photo, Portable Text content. The page with slug `about` feeds `/about`.

Site settings: the title ("The Lifestyle Journal", with the leading "The" shown small above the rest) and the
tagline. An uploaded logo replaces the sprig and wordmark. Image-bearing entries render the uploaded CMS image
when present and otherwise the bundled `photo` path in `public/images/`.

## Contact and newsletter

The form validates in the browser, then opens the visitor's email app with a pre-filled message to the journal
email. Nothing is sent or stored by the site, and the status message says so; without JavaScript the address is
shown instead. The monthly letter is by email only: the homepage button goes to `/contact?topic=newsletter` and
the address is shown beside it. No third-party service is used. The hosted ZeroHostCMS inquiry handler is the
intended production route; it is not wired into this standalone theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, both under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines and body, © The Newsreader Project Authors. Its display optical
    size with tight tracking approximates the design's headline face.
  - [Hanken Grotesk](https://github.com/hankenhummel/hanken-grotesk) (variable) via
    `@fontsource-variable/hanken-grotesk`: navigation, labels and buttons, © The Hanken Grotesk Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 35
  (`35-lifestyle-journal-a/b.png`, AI-generated design comps):
  - `hero.webp` (1448×618): the design screen's hero photograph with the nav, wordmark, headline, button, labels
    and search icon removed by inpainting (the theme draws the live text). Lettering on physical objects (book
    spines, the chalk sign, the notebook handwriting) is part of the photo and was kept.
  - `lemons`, `coast`, `notebook` (about 440×225): the three card photos from the design screen. They are small
    and look soft when shown larger on story pages.
  - `table-wide`, `flowers-sign`: crops of the hero photo.
  - `latte-table`, `open-book`, `village`, `bedside`, `vase-olive`, `linen-olive`, `scrapbook`: crops of the
    text-free illustration (b). The mockup (c) is not used. Photos repeat across stories. No person is
    presented as the editor.
- **Icons** (sprig mark, arrows, search, menu button) are inline SVG. No other external requests, no browser
  storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and **Astro 7.3.5**
and owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content.

## Checks

`npm run typecheck` (astro check) and the production build (Node adapter, standalone server) both pass.

Tested with Node 24.21.0 on macOS. Routes were checked at 1440px and 375px in Chrome (no horizontal overflow,
mobile menu opens, `?category=`, `?page=`, `?q=` and `?topic=` work). The 1440×1086 homepage fold was compared
with the design screen (1448 wide): hero text, photo and card positions are within a few pixels. Newsreader is
slightly lighter than the design's headline face and the sprig mark is an SVG approximation.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database
until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (journal, editor, places, email) is synthetic; the email uses the `.example` domain.
Fonts remain under the SIL Open Font License 1.1.
