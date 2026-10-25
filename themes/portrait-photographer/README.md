# Portrait Photographer (portrait-photographer)

A dark, editorial portrait-photographer theme for [EmDash](https://emdashcms.com/), shown with the
fictional studio "KELLEN". It pairs a full-bleed moody hero photo and a large white high-contrast serif
headline with a warm off-white "A closer look" section, tracked serif caps and a single rust pill button.
It ships portrait series with a category filter and photo grids, a journal, session types, an about page
and a booking page, all driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 11 ("Portraits with personality." /
"Real people. Deeper stories." / "People in focus.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero with headline, kicker and "Explore portraits"; "A closer look" with three portraits; recent series; "approach" band; session types; journal teaser; booking band |
| `/work` | All portrait series as a photo grid; `?category=<slug>` filters by category (server-rendered, works without JavaScript) |
| `/work/[slug]` | Series: category, season, summary, written note, photo grid (gallery repeater with captions) and more work |
| `/about` | About: CMS page `about`, a camera photo, "What to expect" (approach collection) |
| `/journal` | Journal posts as cards |
| `/journal/[slug]` | Post: date, excerpt, cover, written post and more notes |
| `/book` | Booking request form (name, email, phone, preferred date, location, session type, notes); email and phone are always shown beside it |
| `/[slug]` | CMS pages (`terms-and-delivery` is seeded and listed in the footer automatically) |
| `404` | Styled not-found page (unknown pages, series and posts render it with HTTP 404) |

The primary menu (`Work · About · Journal`) is an EmDash menu and can be edited in the admin. The
outlined "Explore portraits" pill in the header goes to `/work`; "Book a session" sits in the mobile
menu, the footer and the booking band.

Below 900px the navigation collapses into a round button that opens a panel (a native `<details>`
element, so it works without JavaScript) with the menu, "Book a session" and the phone number. On phones
the hero keeps the photo full-bleed with the headline over a dark gradient.

## Collections

- **work**: series title, category (drives the filter), season/year as shown, one-line summary, "show
  on the homepage" flag, sort order, cover `image` + `photo`, `gallery` repeater (photo upload or bundled
  path, plus caption), Portable Text note.
- **journal**: title, date as shown, excerpt, "show on the homepage" flag, sort order (1 = newest),
  cover `image` + `photo`, Portable Text post.
- **sessions**: name, one-line description, starting price (whole dollars), length, included items
  (one per line), sort order.
- **principles** (Approach): title, text, sort order (homepage band and about page).
- **studio**: a single entry with studio name, photographer, base, phone, booking email, reply time and the note
  beside the form.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: the title ("KELLEN") is the tracked serif-caps wordmark and the tagline ("Portrait
Photographer") is the tiny caps line under it; an uploaded logo replaces both. Image-bearing entries
render the uploaded CMS image when present and otherwise the bundled `photo` path in `public/images/`.
Empty collections are handled in the templates.

## Booking requests

The form validates in the browser (name, email, preferred date, location and session type required,
with inline messages; the date cannot be in the past), then opens the visitor's email app with a
pre-filled request addressed to the studio email. Nothing is sent or stored by the site itself, and the
status message says so; without JavaScript the email address is shown instead. `?session=<slug>`
pre-selects a session type (the homepage session cards link this way). Email and phone are always listed
beside the form. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended
production route; it is not wired into this standalone theme. The extension manifest declares
`inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Font** is self-hosted through npm, no font CDN, under the SIL Open Font License 1.1:
  [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes, roman and italic)
  via `@fontsource-variable/newsreader`: all headlines, wordmark, navigation, tracked caps and body,
  © The Newsreader Project Authors. Its high optical-size cut approximates the design's display serif;
  the hero headline is set slightly smaller than the comp so that line widths match.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 11 (`11-portrait-photographer-a/b.png`, AI-generated design comps; the sitters are
  not real people):
  - `hero-home.webp` (1448×660): the design screen hero; the overlaid wordmark, navigation, pill,
    headline, kicker and button were removed by inpainting (the theme draws the live text over the same
    spots). `woman-window`, `woman-bw`, `hand-detail` and `window-light` are crops of it.
  - `man-bw`, `redhead`, `grey-hair`: the three portraits from the design screen, only about 330×380
    in the source and upscaled 2× with light sharpening; `redhead-bw` is a greyscale copy.
  - `camera`: crop of the text-free still life (b), used on the about page and not as a portrait of the
    photographer.
  The source comps are small, so some crops are soft and the same ten photos repeat across series and
  posts.
- **Icons** (arrows, menu button) are inline SVG. No other external requests, no browser storage, no
  analytics.

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
Chrome (no horizontal overflow, mobile menu opens, `?session=` pre-selection and form validation work).
The 1440×1086 homepage fold was measured against the design screen (scaled 1448 to 1440): wordmark, nav,
headline, kicker, button, "People in focus." block and portrait tops are within about 1px vertically;
the headline's right edge is about 4px short and the photos start about 1px to the left.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (studio, people, series, posts, phone, email, sessions and prices) is synthetic; the
phone number uses a 555-01xx-style fictional number and the email uses the `.example` domain. The font
remains under the SIL Open Font License 1.1.
