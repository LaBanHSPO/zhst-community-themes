# Aircare (aircare)

A crisp, technical air-conditioning service theme for [EmDash](https://emdashcms.com/): cobalt and
icy blue on dark navy, a restrained orange call to action, a geometric sans and real technician and
equipment photography. It ships a homepage with service previews, a services overview, an AC cleaning
service page with a starting price, what's included and a four-step process, three maintenance plans
with yearly prices, and a service request form with a callback card, all driven by CMS collections and
seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js server
with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "Comfort, all year round." hero with Request service button, phone number and three benefits; four service preview cards |
| `/services` | Services — "Complete AC services for every space." header; one card per service with photo, checklist, a link to the service page and a Request service button that preselects the service on the form |
| `/services/[slug]` | Service detail — hero with benefits, price card ("from $120 / unit", what's included, booking button) and the service's process steps. `/services/cleaning` is the designed "AC cleaning" page; the other services use the same template |
| `/maintenance-plans` | Maintenance plans — hero with benefits; three plans with service frequency, equipment limit, inclusions and per-year price; the highlighted plan carries a "Most popular" band. "Request plan" opens the form with the plan named |
| `/request` | Request service — service choice cards, number of AC units, issue description, address, contact details and preferred date; photo card with "Request a callback"; promise strip. Accepts `?service=<service slug>&plan=<plan name>` |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Services · AC cleaning · Maintenance plans · Request service`) is an
EmDash menu and can be edited in the admin.

## Collections

- **services** — name, short card description, icon for the Services page / detail and a separate icon
  for the homepage card, checklist (repeater), optional "Learn more" link (blank = the service page),
  request-form option title and text, detail headline (white and blue lines), intro, starting price in
  whole dollars and unit (blank = "Quoted on request"), what's included (repeater), booking button
  label, process section title and intro, "show on homepage" flag, sort order, and three image pairs:
  `image` + `photo` (Services card), `card_image` + `card_photo` (homepage card), `hero_image` +
  `hero_photo` (detail hero).
- **steps** — process steps for a service (matched on the service slug): title, text, sort order,
  `image` + `photo`.
- **plans** — plan name, summary, yearly price in whole dollars, price period, service frequency,
  equipment limit, inclusions (repeater), icon, "highlight this plan" flag and label, sort order.
- **highlights** — short benefits with an icon, placed as hero benefits (`home`, `plans`,
  `service-<slug>`) or the request page strip (`request`).
- **business** — one entry: name, phone, service request email, region served, opening hours.
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS image when present and otherwise falls back to the
bundled `photo` path in `public/images/`.

## Forms

"Request service" and "Request a callback" validate in the browser, then open the visitor's email app
with a pre-filled message to the business service request email. Nothing is sent by the site itself,
and the status message says so. Without JavaScript each form falls back to a `mailto:` action and the
email address is shown. The hosted ZeroHostCMS native inquiry inbox is the intended production handler;
it is not wired into this standalone theme.

## Accessibility notes

The design's orange button (`#fe5a24`) does not reach WCAG AA contrast with white labels, so buttons use
`#d53f0e`. Blue link text uses `#0b6fd0`, and the light-blue "a service" heading word uses `#1e95de`
(large text, 3:1) instead of the mockup's `#5fc4fe`.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme.
Icons and the wordmark snowflake are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Plus Jakarta Sans for
headings and Inter for text. Remove the `<link>` in `src/layouts/Base.astro` to fall back to system
fonts.

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
