# Fixwell (fixwell)

A trustworthy local home repair theme for [EmDash](https://emdashcms.com/): navy, safety orange and
white, a bold practical sans, fine grid lines and real electrician and plumber photography. It ships
a services overview, a plumbing service page with common jobs, starting prices and what's included,
a service-area page with a postcode check, and a quote request form, all driven by CMS collections
and seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js
server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "Small repairs. Sorted." hero with quote button and guarantees, three service cards, promise strip |
| `/services` | Services — "Our services" header, Plumbing / Electrical / Home repairs panels with photo, checklist and a request button that preselects the issue type on the quote form |
| `/services/[slug]` | Service detail — hero, common jobs (each links to a prefilled quote), starting-price list, what's included, closing call-to-action band. `/services/plumbing` is the designed "Plumbing service" page |
| `/service-areas` | Service areas — area list, highlighted district map, "Check your area" postcode check (server-side, `?postcode=`), request a callback |
| `/quote` | Request a quote — issue selector, job description, optional photo, address, postcode, phone, preferred contact time; "What happens next?" steps and call box. Accepts `?issue=plumbing|electrical|other&job=...` |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Services · Plumbing service · Service areas · Request a quote`) is an
EmDash menu and can be edited in the admin.

## Collections

- **services** — name, homepage card title and text, Services-page intro and checklist (repeater),
  request button label, quote-form issue type (`plumbing` / `electrical` / `other`), detail eyebrow,
  two-line headline, intro, closing band copy, "show on homepage" / "show on Services page" flags,
  sort order, and three image pairs: `image` + `photo` (Services panel), `hero_image` + `hero_photo`
  (detail hero), `card_image` + `card_photo` (homepage card).
- **jobs** — common jobs for a service (matched on the service slug): title, short text, sort order,
  `image` + `photo`.
- **prices** — starting prices for a service: job, detail, price as displayed (e.g. `from £65`),
  service slug, sort order.
- **guarantees** — short promises with an icon, placed as hero badges (`badges`, `badges-areas`,
  `badges-quote`), closing strips (`strip`, `strip-areas`) or the "What's included" list (`included`).
- **areas** — area name, covered postcode districts (comma separated, used by the postcode check),
  map position (1–6, 0 = list only), sort order.
- **business** — one entry: name, phone, quote requests email, region served, opening hours.
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS image when present and otherwise falls back to the
bundled `photo` path in `public/images/`.

## Forms

"Submit quote request" validates in the browser, then opens the visitor's email app with a pre-filled
message to the business quote email. Nothing is sent by the site itself, and the status message says
so; an attached photo cannot be added to a `mailto:` link, so the visitor is asked to attach it before
sending. Without JavaScript the form falls back to a `mailto:` action and the email address is shown.
The hosted ZeroHostCMS native inquiry inbox is the intended production handler; it is not wired into
this standalone theme.

"Check your area" is a plain GET form answered on the server from the `areas` collection, so it works
without JavaScript. "Request a callback" opens the quote form prefilled with a callback note.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme.
Icons and the service-area map are inline SVG; the map is a stylised drawing, not a live map.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Figtree. Remove the
`<link>` in `src/layouts/Base.astro` to fall back to system fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The generated
secrets file is private and git-ignored; never commit it.

## Checks

```sh
npm run typecheck
npm run build
```

## License

MIT. Sample content is synthetic. Preserve upstream EmDash/Astro notices and the licenses of any
third-party assets you add.
