# Wedding Planner (wedding-planner)

A light, romantic wedding-planner theme for [EmDash](https://emdashcms.com/), shown with the fictional
studio "Evermore". It pairs a full-bleed lakeside flower-arch hero with a large light near-black serif
headline, tracked caps, deep olive pill buttons and ivory sections. It ships planning services, a
portfolio of weddings with photo sequences, an about page and a "Plan your day" inquiry page, all
driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash host that
runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 19 ("Beautifully planned. Deeply felt." /
"More than a day. A story worth living.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (eyebrow, headline, sub, "Plan your day"); "Our approach" split with three line-icon pillars and a rose/card photo; services teaser; featured weddings; four planning steps; inquiry band |
| `/services` | The four services (full planning, partial planning, day-of coordination, destination weddings) with summary, "from" price or "On request" and what is included; each links to `/contact?service=<slug>` |
| `/services/[slug]` | Service detail: description, included list, other services |
| `/work` | All weddings as a photo grid (couple, venue/region, season, style) |
| `/work/[slug]` | Wedding: facts (venue, season, style, guests), story, photo sequence, more weddings |
| `/about` | About: CMS page `about`, scenic photo, "Care in every detail" (approach collection) |
| `/contact` | "Plan your day" inquiry form: names, email, phone, wedding date, guest count, location, service, notes; email and phone always shown beside it |
| `/[slug]` | CMS pages (`planning-terms` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page (unknown pages, services and weddings render it with HTTP 404) |

The primary menu (`Home · Services · Our Work · About`) is an EmDash menu and can be edited in the
admin. "Plan your day" is the olive pill in the header, the mobile menu, the hero and the inquiry band.

Below 900px the navigation collapses into a round button that opens a panel (a native `<details>`
element, so it works without JavaScript). On phones the hero stacks: text on paper first, then the
photo. Layouts were checked down to 375px.

## Collections

- **services** — name, one-line description, best-for phrase, price shown ("From $4,800" or "On
  request"), included items (one per line), homepage flag, sort order, `image` + `photo`, Portable Text
  description.
- **weddings** (Our work) — couple (title), venue and region, season, style, guests, summary, homepage
  flag, sort order, cover `image` + `photo`, `gallery` repeater (upload or bundled path, plus caption),
  Portable Text story.
- **principles** (Approach) — title, text, icon (`sprig`, `flower` or `heart`), sort order.
- **steps** — title, text, sort order (homepage "How it works").
- **studio** — one entry: studio name, base, phone, inquiry email, reply time and the note beside the form.
- **pages** — title, optional small label and intro, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: the title ("Evermore") is the light serif wordmark and the tagline ("Wedding Planner")
is the tracked caps line beneath it; an uploaded logo replaces both. Image-bearing entries render the
uploaded CMS image when present and otherwise the bundled `photo` path in `public/images/`. Empty
collections are handled in the templates. Prices are indicative placeholders, not real offers.

## Inquiries

The form validates in the browser (names, email, wedding date, guest count, location and service
required, with inline messages; the date cannot be in the past), then opens the visitor's email app with
a pre-filled message addressed to the studio email. Nothing is sent or stored by the site itself, and the
status message says so; without JavaScript the email address is shown instead. `?service=<slug>`
pre-selects a service (the services pages link this way). Email and phone are always listed beside the
form. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended production
route; it is not wired into this standalone theme. The extension manifest declares `inquiry: true` and
type `company`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader` — headlines, wordmark, navigation and buttons, © The Newsreader
    Project Authors. It approximates the design's high-contrast serif.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via `@fontsource-variable/figtree` —
    body text and small tracked caps, © The Figtree Project Authors.
  - [Cormorant Garamond](https://github.com/CatharsisFonts/Cormorant) (variable) via
    `@fontsource-variable/cormorant-garamond` — installed as a fallback for the display face, © The
    Cormorant Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 19 (`19-wedding-planner-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×681) and `hero-home-mobile.webp` (1448×597, without the header strip) — the
    design screen hero; the wordmark, navigation, pill, eyebrow, headline, sub text and button were removed
    by inpainting (the theme draws the live text over the same spots). `arch-lakeside` and
    `chairs-blooms` are crops of the cleaned hero, upscaled 1.5× with light sharpening.
  - `approach-roses` (846×397), `rings-card` — crops of the design's roses/tulle photo (the script on the
    physical card is part of the photo).
  - `sunset-ceremony`, `arch-sunset`, `bouquet-ribbon`, `guest-book`, `aisle-lanterns`, `olive-terrace`,
    `sea-sunset` — text-free crops of the product illustration (b), some upscaled 1.3–1.4×;
    `arch-lake` is the right part of the photo shown on the laptop in (c), upscaled 1.6×.
  The source comps are small, so some crops are soft and the same thirteen photos repeat across services
  and weddings. No faces are shown.
- **Icons** (arrows, menu button, sprig, flower, heart) are inline SVG approximations. No other external
  requests, no browser storage, no analytics.

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
Chrome (no horizontal overflow at 375px, mobile menu opens, `?service=` pre-selection works, unknown URLs
return 404). The 1440×1086 homepage fold was compared with the design screen (1448 wide): text and
photo positions are within about 1–4px vertically; the right edge sits about 8px left because of the
narrower viewport. Newsreader approximates the headline face: "Deeply felt." is a few pixels narrower than
in the design, and the nav and pillar labels are slightly smaller than the design's lettering. The sprig
icon is an approximation.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (studio, couples, venues, phone, email, services and prices) is synthetic; the phone
number uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain
under the SIL Open Font License 1.1.
