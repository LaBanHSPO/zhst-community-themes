# Beauty Studio (beauty-studio)

An elegant independent-salon theme for [EmDash](https://emdashcms.com/), shown with the fictional
studio "LUMIÈRE Beauty Studio". It pairs a full-bleed warm photo of a salon (arched illuminated
mirrors, olive-green velvet chairs) with a large black high-contrast serif headline, a forest-green
italic accent, widely tracked caps, forest-green pill buttons and warm off-white sections. It ships
a treatments list with prices and detail pages, a gallery, an about page with the team, and a
booking-request page, all driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 08 ("Your everyday, elevated." /
"Intentional beauty for real life.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero with the headline, "Beauty · Care · A brighter you", "Book a visit" and the "Good / Beauty / Brighter / Days" note; "Our services" with three photo cards (Facials / Nails / Hair, each linking to its category on `/services`); signature treatments with duration and price; the studio; a dark visit band with address, phone, email and hours |
| `/services` | Treatments grouped by category (Facials, Nails, Hair) with duration and price; each category has an anchor (`#facials`, `#nails`, `#hair`) |
| `/services/[slug]` | Treatment detail: duration, price, intro, Portable Text content, "What is included", "Book this treatment" (pre-selects it on `/book`), more treatments in the same category |
| `/about` | About: CMS page `about`, "What you can expect" (values collection), the team shown as initials monograms, visit band |
| `/gallery` | Gallery: CMS image grid with captions and short notes; photos marked "wide" span two columns |
| `/book` | Book a visit: request form (treatment, date, time, name, email, phone, notes); phone, email, address and opening hours are always shown below it |
| `/[slug]` | CMS pages (`care-and-cancellations` is seeded; it is listed in the footer automatically) |
| `404` | Styled not-found page (unknown pages and treatments render it with HTTP 404) |

The primary menu (`Home · Services · About · Gallery`) is an EmDash menu and can be edited in the
admin. "Book a visit" is the pill button in the header, the mobile menu, the hero and the visit band.

Below 900px the navigation collapses into a round button that opens a panel (a native `<details>`
element, so it works without JavaScript) with the menu, "Book a visit" and the phone number. The
"Good / Beauty / Brighter / Days" note is hidden below 1280px; on phones the hero text sits over a
cream wash at the top of the photo.

## Collections

- **treatments** — name, one-line description, category (`facials`, `nails`, `hair`), duration,
  price (whole dollars), "signature treatment" flag, sort order, intro, Portable Text content,
  included items (one per line), `image` + `photo`. The homepage lists up to four signature
  treatments (or the first four overall if none are flagged). When no photo is set the category
  photo is used.
- **team** — name, role, short bio, sort order. People are shown as initials monograms, not
  photographs.
- **gallery** — caption, short note, alt text, "show wide" flag, sort order, `image` + `photo`.
- **principles** (Values) — title, text, sort order (about page).
- **studio** — one entry: studio name, street, city/state/ZIP, country, phone, booking email,
  opening hours (one `Day|Hours` pair per line) and the note beside the booking form.
- **pages** — title, optional small label and intro, Portable Text content. The page with slug
  `about` feeds `/about`.

Site settings: the title ("LUMIÈRE") is the tracked serif wordmark and the tagline ("Beauty
Studio") is the small caps line under it; an uploaded logo replaces both. Every image-bearing entry
renders the uploaded CMS image when present and otherwise falls back to the bundled `photo` path in
`public/images/`. Empty collections are handled in the templates.

## Booking requests

The form validates in the browser (treatment, date, name and email required, with inline messages;
the date cannot be in the past), then opens the visitor's email app with a pre-filled request
addressed to the studio email. Nothing is sent or stored by the site itself, and the status message
says so; without JavaScript the email address is shown instead. `?treatment=<slug>` pre-selects a
treatment (the treatment pages link this way). Phone, email, address and opening hours are always
listed beside the form. No form plugin is used, so no submissions are stored in the database. The
hosted ZeroHostCMS native booking handler is the intended production route; it is not wired into this
standalone theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes, roman and
    italic) via `@fontsource-variable/newsreader` — SIL Open Font License 1.1, © The Newsreader
    Project Authors.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via
    `@fontsource-variable/figtree` — SIL Open Font License 1.1, © The Figtree Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 08 (`08-beauty-studio-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×710) — the design screen hero; the overlaid wordmark, navigation, buttons,
    headline, eyebrow, right-hand note and the "BEAUTY LIVES HERE" print on the book were removed by
    inpainting (the theme draws the live text over the same spots). `green-chairs.webp` is a crop
    of it.
  - `facials.webp`, `nails.webp`, `hair.webp` (512×492) — the three photo cards from the design
    screen, which are only 256×246 in the source and were upscaled 2× with light sharpening.
  - `salon-chair-light.webp` (1448×1086), `peonies-marble.webp`, `chair-towel.webp` — the text-free
    illustration (b) and crops of it.
  The source comps are small, so detail-page photos of the three categories are soft. Contextual
  mockup (c) is not used because its photos carry printed text. No faces from these photos are used as
  team portraits.
- **Icons** (arrows, menu button) are inline SVG. The studio address links to Google Maps in a new
  tab. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the
admin setup wizard, which can apply the same seed). The generated secrets file is private and
git-ignored; never commit it.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only (no Cloudflare run). Routes were checked at
1440px and 375px widths in Chrome (no horizontal overflow at 375px, mobile menu opens); the
1440×1086 homepage fold was overlaid on the design screen (text and photo positions within about
3px vertically; the serif italic "elevated." is a little narrower than the design's typeface).

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in
the database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (studio, people, address, phone, email, treatments and prices) is synthetic; the
phone number uses the 555-01xx range reserved for fiction and the email uses the `.example` domain.
Fonts remain under the SIL Open Font License 1.1.
