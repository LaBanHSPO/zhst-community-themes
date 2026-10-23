# Brightworks (brightworks)

A practical local company theme for [EmDash](https://emdashcms.com/), built for a commercial signage, print and
installation business: ink navy, sign yellow and off-white, a confident heavy sans and large installation
photography. It ships a homepage with service previews, a services overview, service detail pages with material
choices and a design-to-install process, project case studies with before/after photos, and a quote request form,
all driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on
any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "Make your business stand out." hero, three service previews, "Our approach" split section |
| `/services` | Services — "Signs. Print. Installation." split hero, four service cards, "Our process" band |
| `/services/[slug]` | Service detail — photo hero, option cards, numbered process and a quote panel. `/services/exterior-signage` is the designed "Signage detail" page; services without a wide hero photo show their card photo framed |
| `/projects` | Project listing (not in the mockups; links to every case study) |
| `/projects/[slug]` | Project case study — hero, before/after photos, client brief, materials and deliverables, photo gallery. `/projects/harpers-local-market` is the designed page |
| `/quote` | Request a quote — hero, "From idea to installation" steps, quote form, "Need help?" band. Accepts `?type=exterior|illuminated|interior|window|print|installation|not-sure` to preselect the sign type |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Services · Signage detail · Project case study · Request quote`) is an EmDash menu
and can be edited in the admin.

## Collections

- **services** — name, Services-page card text and link label, homepage card title/text/link label and "show on
  homepage" flag, detail eyebrow, two-part headline, intro, options eyebrow/title/intro, process title/intro, quote
  panel copy, quote-form sign type, sort order, and three image pairs: `image` + `photo` (Services card),
  `card_image` + `card_photo` (homepage preview), `hero_image` + `hero_photo` (detail hero).
- **choices** — material/option cards for a service (matched on the service slug): title, text, sort order,
  optional `image` + `photo`.
- **steps** — process steps with an icon, placed on the Services page (`services`), service detail pages
  (`detail`) or the quote page (`quote`).
- **projects** — case studies: listing summary, eyebrow, two-part headline, intro, client brief, deliverables
  (repeater: title, detail, icon), related service, `hero_*`, `before_*` and `after_*` image pairs and a gallery
  repeater (`image`, `photo`, `alt`).
- **business** — one entry: name, quote requests email, phone, address, hours, area served (footer and form).
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS image when present and otherwise falls back to the bundled
`photo` path in `public/images/`.

## Forms

"Request a quote" validates in the browser, then opens the visitor's email app with a pre-filled message to the
business quote email. Nothing is sent by the site itself, and the status message says so; attached files cannot be
added to a `mailto:` link, so the visitor is asked to attach them before sending. Without JavaScript the form falls
back to a `mailto:` action and the email address is shown. The hosted ZeroHostCMS native inquiry inbox is the
intended production handler; it is not wired into this standalone theme.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme. The wordmark
sunburst and all icons are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Figtree. Remove the `<link>` in
`src/layouts/Base.astro` to fall back to system fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The generated secrets file is
private and git-ignored; never commit it.

## Checks

```sh
npm run typecheck
npm run build
```

## License

MIT. Sample content is synthetic. Preserve upstream EmDash/Astro notices and the licenses of any third-party assets
you add.
