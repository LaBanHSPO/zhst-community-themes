# Wedding Photographer (wedding-photographer)

A romantic, editorial wedding-photographer theme for [EmDash](https://emdashcms.com/), shown with the
fictional studio "evermore". It pairs a full-bleed golden-hour hero photo with a large, light,
near-black high-contrast serif headline, tracked caps, a single dark olive button and warm off-white
sections. It ships wedding stories with photo grids, packages with starting prices, an about page and
an inquiry page, all driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 10 ("Your story, beautifully kept." /
"Honest moments. Extraordinary stories.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero with the eyebrow, headline, "View stories" and the "People / Places / Love / Always" rail; "More than photos" intro with three photos; recent stories; an olive "approach" band; packages teaser; inquiry band |
| `/stories` | All wedding stories as a photo grid with couple, place and date |
| `/stories/[slug]` | Story: couple, place, date, cover, written story, photo grid (gallery repeater) and more stories |
| `/about` | About: CMS page `about`, a camera photo, "What you can expect" (approach collection) |
| `/packages` | Packages with coverage, starting price and what is included; each links to `/inquire?package=<slug>` |
| `/inquire` | Inquiry form (names, email, phone, wedding date, venue, package, notes); email and phone are always shown beside it |
| `/[slug]` | CMS pages (`terms-and-delivery` is seeded and listed in the footer automatically) |
| `404` | Styled not-found page (unknown pages and stories render it with HTTP 404) |

The primary menu (`Home · Stories · About · Packages`) is an EmDash menu and can be edited in the
admin. "Inquire" is the outlined pill in the header, the mobile menu and the inquiry band.

Below 900px the navigation collapses into a round button that opens a panel (a native `<details>`
element, so it works without JavaScript) with the menu, "Inquire" and the phone number. On phones the
hero stacks: text on paper first, then the photo. The right-hand rail is hidden below 1100px.

## Collections

- **stories**: couple (title), place, wedding date (as shown), one-line summary, "show on the
  homepage" flag, sort order, cover `image` + `photo`, `gallery` repeater (photo upload or bundled
  path, plus caption), Portable Text story.
- **packages**: name, one-line description, starting price (whole dollars), coverage, included
  items (one per line), "most booked" highlight flag, sort order.
- **principles** (Approach): title, text, sort order (homepage band and about page).
- **studio**: a single entry with studio name, photographer, base, phone, inquiry email, reply time and the
  note beside the form.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: the title ("evermore") is the tracked lowercase serif wordmark and the tagline
("Wedding Photographer") is the small caps line under it; an uploaded logo replaces both. Image-bearing
entries render the uploaded CMS image when present and otherwise the bundled `photo` path in
`public/images/`. Empty collections are handled in the templates.

## Inquiries

The form validates in the browser (names, email, wedding date, venue and package required, with inline
messages; the date cannot be in the past), then opens the visitor's email app with a pre-filled
inquiry addressed to the studio email. Nothing is sent or stored by the site itself, and the status
message says so; without JavaScript the email address is shown instead. `?package=<slug>`
pre-selects a package (the packages page links this way). Email and phone are always listed beside
the form. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended
production route; it is not wired into this standalone theme. The extension manifest declares
`inquiry: true` and type `bio` (as the other portfolio-style themes do).

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Cormorant Garamond](https://github.com/CatharsisFonts/Cormorant) (variable, roman and italic)
    via `@fontsource-variable/cormorant-garamond`: headlines and wordmark, © The Cormorant Project
    Authors.
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: body text and button labels, © The Newsreader Project Authors.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via `@fontsource-variable/figtree`:
    navigation and small tracked caps, © The Figtree Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 10 (`10-wedding-photographer-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×693): the design screen hero; the overlaid wordmark, navigation, pill,
    eyebrow, headline, button and right-hand rail were removed by inpainting (the theme draws the live
    text over the same spots). `bouquet`, `veil` and `hills` are crops of it.
  - `table-setting`, `walking-bw`, `rings-card`: the three photos from the design screen, only about
    262×283 in the source and upscaled 2× with light sharpening (the handwritten card is part of the
    photo). `embrace-close` is the right part of the photo shown on the laptop in (c), upscaled 2×.
  - `camera-prints`, `camera`, `lake-couple`, `prints`: the text-free product illustration (b) and
    crops of it.
  The source comps are small, so some crops are soft and the same eleven photos repeat across stories.
  No faces from these photos are used as portraits of the photographer.
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

Tested with Node 24.21.0 on macOS, Node adapter only. Routes were checked at 1440px and 375px widths
in Chrome (no horizontal overflow at 375px, mobile menu opens, `?package=` pre-selection and form
validation work). The 1440×1086 homepage fold was overlaid on the design screen; text and photo
positions are within about 3px vertically. The headline typeface (Cormorant Garamond) approximates the
design's face: "Your story," is a few pixels narrower and "beautifully kept." a few pixels wider.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (studio, people, venues, phone, email, packages and prices) is synthetic; the phone
number uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain
under the SIL Open Font License 1.1.
