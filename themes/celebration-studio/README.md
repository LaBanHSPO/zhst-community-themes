# Celebration Studio (celebration-studio)

A warm party-planning theme for [EmDash](https://emdashcms.com/), shown with the fictional studio
"Celebration Studio". It pairs a full-bleed sunlit long-table hero with a heavy near-black serif headline,
tracked caps, terracotta pill buttons and cream sections. It ships styling and planning services, a gallery
of celebrations filterable by occasion, an about page and a "Create your event" enquiry page, all driven by
CMS collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on any
Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 21 ("Make the moment yours." / "Events with
heart and a personal touch.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero ("Make the moment yours.", sub, "Create your event", tracked-caps note); "Our approach" with three photo cards (the first three featured services); occasions we plan; gallery teaser; how it works; enquiry band |
| `/services` | Five services with summary, "From" price or "On request" and what is included; each links to `/contact?service=<slug>` |
| `/services/[slug]` | Service detail: description, included list, other services |
| `/gallery` | All celebrations as photo cards with occasion filter chips (`/gallery?occasion=birthdays` etc.) |
| `/gallery/[slug]` | Celebration: facts, story, photo sequence with captions, more celebrations |
| `/about` | CMS page `about`, scenic photos, "What to expect" (approach collection) |
| `/contact` | Enquiry form: name, email, phone, occasion, event date, guest count, location, service, notes; email and phone always shown. `?service=<slug>` and `?occasion=<slug>` pre-select options |
| `/[slug]` | CMS pages (`booking-notes` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page (unknown pages, services and celebrations render it with HTTP 404) |

The primary menu (`Services · Gallery · About`) is an EmDash menu and can be edited in the admin. "Create
your event" is the terracotta pill in the header, mobile menu, hero and enquiry band. Below 900px the
navigation collapses into a round button that opens a panel (a native `<details>` element, so it works
without JavaScript); on phones the hero stacks text first, then the photo. Layouts were checked down to 375px.

## Collections

- **services** — name, short card line, one-line description, best-for phrase, price shown, included items
  (one per line), homepage flag, sort order, `image` + `photo`, Portable Text description.
- **celebrations** (Gallery) — title, occasion slug, venue and region, season, guests, summary, homepage
  flag, sort order, cover `image` + `photo`, `gallery` repeater (upload or bundled path, plus caption),
  Portable Text story.
- **occasions** — birthdays, anniversaries, showers, dinners, milestones: title, short line, photo. The
  entry slug is the value used by `?occasion=` and by a celebration's `occasion` field.
- **principles** (Approach), **steps** (How it works) — title, text, sort order.
- **studio** — one entry: name, base, phone, enquiry email, reply time and the note beside the form.
- **pages** — title, optional small label and intro, Portable Text content. Slug `about` feeds `/about`.

Site settings: the title is the serif wordmark and the tagline ("People / Places / Happier Days") is shown as
three tracked-caps phrases beneath it; an uploaded logo replaces both. Image-bearing entries render the
uploaded CMS image when present, otherwise the bundled `photo` path in `public/images/`. Prices are
indicative placeholders, not real offers.

## Enquiries

The form validates in the browser (name, email, occasion, date, guest count, location and service required,
with inline messages; the date cannot be in the past), then opens the visitor's email app with a pre-filled
message addressed to the studio email. Nothing is sent or stored by the site itself, and the status message
says so; without JavaScript the email address is shown instead. No form plugin is used. The hosted
ZeroHostCMS native enquiry handler is the intended production route; it is not wired into this standalone
theme. The extension manifest declares `inquiry: true` and type `company`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Playfair Display](https://github.com/clauseggers/Playfair) (variable) via
    `@fontsource-variable/playfair-display` — headlines, © The Playfair Project Authors.
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable) via
    `@fontsource-variable/newsreader` — the wordmark, © The Newsreader Project Authors.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via `@fontsource-variable/figtree` — body
    text and tracked caps, © The Figtree Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 21 (`21-celebration-studio-a/b/c.png`, AI-generated design comps):
  - `hero-home` (1448×729) and `hero-home-mobile` — the design hero; wordmark, navigation, pill, headline,
    sub text, button and tracked-caps note were removed by inpainting (the theme draws live text over the same
    spots). The neon sign and the place card are physical objects in the photo and remain.
  - `card-styling`, `card-planning`, `card-celebrations` — the three design cards, upscaled 2× (the "Gather"
    menu is lettering on a physical card). `long-table`, `dahlia-centrepiece`, `neon-wall` are crops of the
    cleaned hero.
  - `peony-table`, `balloon-arch`, `peony-bouquet`, `olive-arches`, `coupes-candles`, `napkin-candles`,
    `gold-candles`, `velvet-chairs` — text-free crops of the product illustration (b), upscaled 1.2–1.7×.
  - `lakeside-table` (handwritten overlay inpainted out), `garden-vase`, `place-card` — crops of the photos
    around the laptop in (c), upscaled 2–2.5×.
  The source comps are small, so some crops are soft and the same photos repeat across services and
  celebrations. No faces are shown.
- **Icons** (chevrons, menu button, leaf-sprig mark) are inline SVG approximations. No other external
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

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Routes were checked at 1440px and 375px in Chrome (no
horizontal overflow, mobile menu, `?service=`/`?occasion=` pre-selection, `?occasion=` gallery filter, 404s).
The 1440×1086 homepage fold was compared with the design screen (1448 wide): text and photo positions are
within about 1–5px vertically; right-anchored elements sit about 8px left because of the narrower viewport.
Playfair Display approximates the headline face (line 1 is slightly narrower than the design) and the
leaf-sprig mark is an approximation.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (studio, venues, places, phone, email, services and prices) is synthetic; the phone number
uses a 555-01xx fictional number and the email uses the `.example` domain. Fonts remain under the SIL Open
Font License 1.1.
