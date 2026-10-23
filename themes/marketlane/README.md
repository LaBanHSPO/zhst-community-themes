# Marketlane

A campaign-led storefront theme for [EmDash](https://emdashcms.com/), aimed at independent fashion
labels, lifestyle retailers and curated boutiques. Seasonal campaigns open each collection, concise
product cards make pieces easy to compare, and product pages show real colour and size choices.

**Commerce is not integrated.** There is no cart, checkout, payment gateway, stock or order
handling. The purchase call to action is deliberately an inquiry: “Ask about this item” sends the
product and the chosen colour/size to the contact page, where the visitor sends a message. Choose
and implement a commerce backend, payment provider, stock rules and order workflow before
advertising any buying flow.

It is a standalone EmDash host on Node.js with SQLite and local file storage. No cloud account,
credentials or private platform access is required.

## Pages

| Page           | Route                                  | Notes                                                                     |
| -------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| Home           | `/`                                    | Lead campaign hero, “Our favorites”, collections, new arrivals, categories |
| Collections    | `/collections`, `/collections/[slug]`  | Campaign index; campaign page = hero, story, filterable products          |
| Category       | `/category`, `/category/[slug]`        | All products or one category, with filters                                |
| Product detail | `/products/[slug]`                     | Image gallery, colour + size selection, inquiry CTA                       |
| Size guide     | `/size-guide`                          | Intro page + editable size-chart tables                                   |
| Contact        | `/contact`                             | Selection summary, inquiry form, contact details                          |
| Static page    | `/[slug]`                              | e.g. `/about`; `404` for anything unknown                                 |

`/category` is the all-categories listing; the primary menu uses it for “New arrivals”
(`?new=1`), “Women” and “Men” (`?department=`).

## Scope implemented

- **Campaign-led collection pages.** `campaigns` collection (eyebrow, headline, intro, hero image,
  side note, story, sort order). A product belongs to a campaign through the `collection` taxonomy
  term with the same slug. Empty campaigns show a “still being put together” state.
- **Product detail and image galleries.** One slide per colour image plus the main image and extra
  gallery images; thumbnail buttons (`aria-pressed`) switch the visible image. Products without
  photos show a labelled placeholder.
- **Size and colour selection.** Driven by each product’s `colors` (name, swatch hex, image) and
  `sizes` (label, offered) repeaters. Both are native radio groups (arrow keys, visible focus).
  Picking a colour updates the legend and shows that colour’s image; picking a size updates the
  legend and a live “Your selection” line. Sizes marked not offered are disabled and crossed out.
- **Category and price filtering.** Server-side, via query parameters on a plain GET form (works
  without JavaScript, shareable URLs): `category`, `department`, `collection` (fixed on campaign
  pages), `min`, `max`, `new=1`, `sort=newest|price-asc|price-desc`. Values are validated
  (slug pattern, non-negative capped prices, min/max swapped if reversed); filters are pushed into
  EmDash’s content query (taxonomy JOIN + price range), so cursor pagination stays correct.
  “Clear filters”, active-filter chips, price shortcuts, an empty-result state and an
  unknown-category message are included. On mobile the panel starts collapsed.
- **Purchase-flow design pending commerce.** “Ask about this item” submits
  `/contact?product=&color=&size=`. The contact page re-reads the product and echoes only values
  that exist on it, shows the selection (image, product, price, colour, size) and a copyable
  inquiry line, prefills matching form fields, and offers a pre-addressed “Email this inquiry”
  link. Notices on the product page, contact page and footer say purchase is coming soon.

### Out of scope

No cart/bag, checkout, payment, stock or inventory sync, order processing, customer accounts,
shipping or returns logic, and no external purchase links. “Offered” sizes are an editorial field,
not stock levels.

## Setup

Requirements: Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. Pins: **EmDash 1.2.0**,
**Astro 7.3.5**, `@astrojs/node`, React 19.2.4. The project owns its `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env   # private, ignored; never commit or share
npm run dev
```

Open the printed URL (normally `http://localhost:4321/`) and complete setup at `/_emdash/admin/`,
choosing to include the sample content. Or apply the seed directly to a fresh local database:

```sh
npx emdash seed seed/seed.json        # schema + sample content into ./data.db
npx emdash seed seed/seed.json --no-content   # schema only (empty shop)
```

### Create the inquiry form (admin)

The inquiry form uses the official forms plugin. Forms are created in the admin, not by the seed,
and `<Form id="inquiry" />` renders nothing until one exists. Until then the contact page shows a
fallback note, the contact details and the “Email this inquiry” link.

1. Admin → **Plugins → Forms** → create a form.
2. Set the **slug to `inquiry`** (exactly).
3. Add fields. Use these **field names** so the page can prefill them from the product selection:

   | Label     | Type     | Name      | Required |
   | --------- | -------- | --------- | -------- |
   | Your name | text     | `name`    | yes      |
   | Email     | email    | `email`   | yes      |
   | Product   | text     | `product` | no       |
   | Color     | text     | `color`   | no       |
   | Size      | text     | `size`    | no       |
   | Message   | textarea | `message` | yes      |

   `product`, `color` and `size` may also be hidden fields. `message` is prefilled with the
   readable inquiry line.
4. Suggested settings: submit label “Send inquiry”; confirmation message making clear it is not an
   order (e.g. “Thanks — we received your inquiry and will reply by email. This is not an order.”).
5. Configure notification email in the plugin settings if you want submissions emailed.

## Content model

- `products`: title, price (USD), summary, main image, gallery (image + caption), colors (name,
  swatch hex, image), sizes (label, offered), description, materials, care, fit notes, featured
  (“Our favorites”), new arrival. Taxonomies: `category`, `department`, `collection`.
- `campaigns` (admin label “Collections”), `size_charts` (four labelled columns + rows),
  `contacts` (name, email, phone, address, hours, note; the first one appears in the footer),
  `pages` (`about`, `size-guide` and `contact` intros).
- Menus `primary` and `footer`. Site title/tagline in settings.

## Dependencies and capabilities

| Package | Why | License |
| --- | --- | --- |
| `emdash` 1.2.0, `astro` 7.3.5, `@astrojs/node`, `@astrojs/react`, `react`/`react-dom` 19.2.4 | starter baseline | MIT |
| `@emdash-cms/plugin-forms` 0.2.11 | inquiry form | MIT |
| `@cloudflare/kumo` 2.6.0, `@phosphor-icons/react` 2.1.10 | forms plugin peer deps (admin UI) | MIT |
| `@fontsource-variable/inter` 5.3.0, `@fontsource-variable/source-serif-4` 5.3.1 | self-hosted fonts | OFL-1.1 |

The forms plugin declares the capabilities **`email:send`, `media:write`, `network:request`** with
**`allowedHosts: ["*"]`**. It stores submissions in the site database, can send notification email,
can store uploaded files (only if you add a file field) and may make outbound requests (e.g.
Turnstile verification or webhooks if configured). Review these before enabling it in production.

Theme code makes no external requests and uses no browser storage. Fonts are bundled locally (no
Google Fonts CDN). Search uses EmDash’s built-in live search (client JavaScript calling the site’s
own API). Removing the theme leaves the collections, content, taxonomies, menus and forms-plugin
data in the database; nothing is migrated irreversibly.

## Assets and provenance

- Generated with `create-emdash` (`--platform node --template starter`) via the repo’s
  `urbanguide` skeleton, then rewritten for this theme.
- **All images in `public/images/`** are crops, resizes and recolours of the Marketlane concept
  cover (AI-generated concept art owned by the project author): product tiles cropped from the
  cover’s product row (upscaled 2x), additional colourways produced by recolouring the product
  silhouette, fabric details by cropping, and campaign images cropped from the hero band (text that
  was baked into the cover was removed). No third-party or stock images, and no real people or
  brands. They are referenced from seed image fields as same-origin paths (`/images/...`), so they
  ship with the theme and need no download during seeding; replace them through the media picker.
- Brand, products, prices, addresses (`*.example`, `555` phone numbers) and copy are invented.
- Icons are inline SVG drawn for this theme.

## Tested evidence

Local only, macOS, Node v24.21.0, npm 11.19.0, Node adapter. Not tested on Cloudflare.

- `npm run typecheck`: 0 errors, 0 warnings, 0 hints (21 files).
- `npm run build`: completed. The only warning is Vite’s chunk-size advisory.
- Fresh DB: `npx emdash seed seed/seed.json` gives 5 collections, 10 terms, 2 menus, 19 entries.
- Dev server and `npm run start` (production build): every route above returned 200; unknown
  page, product, category and collection slugs returned 404.
- Filters checked by rendered results: category, department, combined category + department,
  price ranges and shortcuts, `new=1`, sorting, no-match (`min=200`), unknown category, malformed
  prices (ignored), campaign + category, empty campaign.
- Browser (agent-browser, 1440 and 375 wide): choosing colour “Black” and size “M” updated the
  legends, the visible image and the selection line. “Ask about this item” went to
  `/contact?product=ribbed-knit-sweater&color=black&size=M` with product/colour/size/message
  prefilled. The mobile menu opens and closes (Escape returns focus). No horizontal overflow at
  375px on the main routes.
- Forms plugin: created the `inquiry` form through the plugin API in local dev, confirmed the form
  rendered on `/contact`, submitted one test inquiry and confirmed it was stored.
- Tampered query values (unknown colour, size that isn’t offered, unknown product) are not echoed back.

## Known limitations

- Seed images are path-based (`provider: "external"`, same-origin), so EmDash’s `<Image>` serves
  the original file without resizing; absolute URLs use the request origin. Images uploaded through
  the admin go through the normal media pipeline.
- Listings fetch 24 products per page with cursor pagination. The collections index counts pieces
  from the first 200 products.
- Search, gallery thumbnails, colour-driven image swapping and form prefill need JavaScript. Without
  it, filters, selection and the inquiry hand-off still work through plain forms and links.
- Light mode only; English, left-to-right only. No dark mode or RTL styling.
- Accessibility was checked for keyboard operation, landmarks, labels and alt text, but this was
  not a full audit (no screen-reader or automated contrast run).

## License

MIT. Keep upstream EmDash/Astro notices and the OFL notices of the bundled fonts.
