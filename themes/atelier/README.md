# Atelier

An editorial product catalog theme for [EmDash](https://emdashcms.com/), aimed at independent
makers, pottery studios and curated homeware brands. Large product photography, a quiet serif
layout and a clear next step on every piece: follow the link to an external shop, or send an
inquiry. It is a standalone EmDash host that runs on Node.js with SQLite and local file storage —
no cloud account, credentials or private platform access required.

## Pages

| Page           | Route                 | Source                                                         |
| -------------- | --------------------- | -------------------------------------------------------------- |
| Home           | `/`                   | `src/pages/index.astro` — hero, featured pieces, collections, story teaser |
| Collection     | `/collection`         | `src/pages/collection/index.astro` — all products with collection filters |
| Collection term| `/collection/[slug]`  | `src/pages/collection/[slug].astro` — products in one collection |
| Product detail | `/products/[slug]`    | `src/pages/products/[slug].astro` — gallery, material, care, story, purchase link, inquiry |
| Our story      | `/our-story`          | `src/pages/our-story.astro` — `our-story` page + maker stories |
| Contact        | `/contact`            | `src/pages/contact.astro` — `contact` page, studio details, inquiry form |
| Other pages    | `/[slug]`             | `src/pages/[slug].astro` — any other entry in `pages` |
| Not found      | `/404`                | `src/pages/404.astro` (unknown slugs render it with HTTP 404) |

`/products` redirects (301) to `/collection`.

## Scope implemented

- **Editorial product catalog** — `products` collection: title, price display text, short
  summary, image gallery (repeater of image + caption), material notes, care information, story
  (Portable Text), maker, dimensions, external purchase URL, home-page feature flag and sort order.
- **Product galleries, material notes and care information** on every product page; empty
  optional fields are omitted and a product without images shows a neutral placeholder.
- **Collection pages** — `collection` taxonomy (Tableware, Vessels, Everyday Rituals) with term
  descriptions, filter links and "from the same collection" suggestions.
- **Maker-story pages** — `makers` collection (name, role, optional portrait, story) rendered on
  Our story; a missing portrait falls back to initials.
- **Product inquiry form** — the official forms plugin, shown on Contact and on each product page
  with the product name displayed above it ("Asking about …"). If the form has a field named
  `product`, it is pre-filled with the product name. Email, phone, address and visiting hours are
  always shown next to the form, and a fallback message points to email when the form is absent.
- **External purchase links** — an optional per-product URL rendered as an outbound
  "Buy from our partner shop" link (`target="_blank"`, `rel="noopener noreferrer external"`); only
  `http(s)` URLs are rendered and the button is hidden when the field is empty (then the page says
  the piece is available by inquiry).
- Home-page copy, header aside, hero values and contact details live in a single `studio` entry
  (slug `studio`) so they are editable in the admin; every value has a fallback.

## Out of scope

Cart, payment processing, checkout, fulfillment/shipping and inventory synchronization are not
built and not implied. Prices are display text only. The footer states that the site is an online
catalog and purchases happen with partner shops or by inquiry.

## Requirements

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm
- Pins **EmDash 1.2.0** and **Astro 7.3.5** exactly, with `@astrojs/node` (standalone) and React
  19.2.4. The project owns its `package-lock.json`; there is no root install.

## Setup

```sh
npm ci
npx emdash secrets generate --write .env   # private, gitignored
npx emdash seed                             # applies seed/seed.json to ./data.db
npm run dev
```

Alternatively skip `npx emdash seed` and run the setup wizard at `/_emdash/admin/`, which offers
the same seed. Open the printed URL (normally `http://localhost:4321/`) and edit content at
`/_emdash/admin/`.

### Create the inquiry form (admin)

Forms are stored by the plugin, not in the seed, and `<Form id="inquiry" />` renders nothing until
the form exists. The pages still show contact details and an email fallback meanwhile.

1. In the admin, open **Plugins → Forms** and create a new form.
2. Set the **slug** to `inquiry` exactly (any name, e.g. "Inquiry").
3. Add fields:
   - `name` — Text, required (half width)
   - `email` — Email, required (half width)
   - `product` — Text, optional, label "Piece you are asking about" (pre-filled on product pages)
   - `message` — Textarea, required
4. Set the submit label (e.g. "Send inquiry"), a confirmation message and, if you want email
   notifications, the notification addresses. Honeypot spam protection works without any keys.
5. Submissions appear under **Plugins → Forms → Submissions**.

## Checks

```sh
npm run typecheck
npm run build
npm run preview   # or: npm run start (built Node server)
```

## Dependencies and capabilities

| Package | Version | License | Purpose |
| --- | --- | --- | --- |
| `emdash` | 1.2.0 | MIT | CMS runtime |
| `astro` | 7.3.5 | MIT | Framework |
| `@astrojs/node`, `@astrojs/react` | ^11.1.5, ^6.0.5 | MIT | Adapter, React islands for the admin |
| `@emdash-cms/plugin-forms` | 0.2.11 | MIT | Inquiry form |
| `@cloudflare/kumo` | 2.6.0 | MIT | Peer of the forms plugin (admin UI) |
| `@phosphor-icons/react` | 2.1.10 | MIT | Peer of the forms plugin (admin icons) |
| `@fontsource/cormorant-garamond`, `@fontsource/eb-garamond`, `@fontsource/jost` | 5.3.0 | OFL-1.1 (fonts), MIT (packaging) | Self-hosted fonts, latin subset |

**Forms plugin capabilities:** the plugin declares `email:send`, `media:write` and
`network:request` with `allowedHosts: ["*"]`. It stores form definitions and submissions
(names, emails, messages, IP/user-agent metadata) in the site database, can send notification and
autoresponder email, can accept file uploads if you add a file field, and can call any webhook URL
you configure. None of these are used unless configured in the form settings. Theme code itself
makes no external requests; fonts are bundled, no Google Fonts or CDN at runtime. No browser
storage is used by the theme. A tiny inline script handles the mobile menu and product-name
pre-fill.

## Assets and provenance

- Seed images in `public/media/` are crops of AI-generated concept art from the ZeroHostCMS
  listing kit (the Atelier cover concept), made with `sips`. They are not photographs of real
  products. They are referenced from the seed as external-provider image values pointing at
  `/media/*.jpg`, so they do not appear in the EmDash media library; uploading a replacement in the
  admin works normally.
- All people, studio names, addresses (`atelier.example`, "sample address"), phone numbers and
  shop links (`shop.example.com`) are invented. No awards, testimonials or claims.
- Generated from the community `urbanguide` starter skeleton (`create-emdash@1.2.0`, starter
  template) and rewritten for this theme.

## Tested evidence (local, Node adapter, macOS, Node 24.21.0 / npm 11.19.0)

- `npm run typecheck`: 0 errors, 0 warnings. `npm run build`: complete.
- Fresh `npx emdash seed` on a new `data.db`: 4 collections, 35 fields, 1 taxonomy (3 terms),
  1 menu, 11 entries.
- Built server (`npm run start`, port 4401): `/`, `/collection`, the three collection terms,
  all six product pages, `/our-story`, `/contact` return 200; `/products` 301; unknown product,
  collection and page slugs return 404 with the custom page.
- Inquiry form created via the plugin admin API with slug `inquiry`: renders on Contact and on
  product pages with "Asking about <product>"; one test submission was accepted and listed under
  submissions. Without the form, the email fallback is shown.
- Purchase link renders for products with a URL and is absent on the Solace Vase (empty URL).
- Screenshots at 1440 px and 375 px (home, product, collection, our story, contact, 404); mobile
  menu toggles `aria-expanded` and closes on Escape; no horizontal overflow at 375 px.
- Accessibility features: skip link, landmarks (header/nav/main/footer), visible focus outline,
  labelled navigation, alt text on all seeded images, `aria-current` on active links,
  `prefers-reduced-motion` respected. No automated contrast audit or screen-reader pass was run.

## Known limitations

- Light mode only; English only; no RTL testing.
- Seed images are small crops (about 200–685 px wide) and look soft on large screens; replace them
  with real product photography.
- Only the Node adapter was tested; Cloudflare compatibility is not verified.
- Collection and catalog pages load up to 100 products without pagination.
- Contact details shown next to the form come from the `studio` entry; if both the form and the
  details are removed, only a generic fallback message remains.

## License

MIT for theme code. Fonts under the SIL Open Font License 1.1 via Fontsource. Preserve upstream
EmDash/Astro notices.
