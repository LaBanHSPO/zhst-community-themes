# CommerceLite Studio

CommerceLite Studio is the [CommerceLite](../commercelite/) data model with a calm storefront
layout for [EmDash](https://emdashcms.com/). It uses a cream, forest-green and sand palette and a
serif wordmark. A sand sidebar holds the introduction and the product categories, and a
four-column product grid shows prices, availability notes, an **Ask a question** button and a
purchase link.

It is a catalog with external purchase links, not a checkout engine. It shows products, prices
and links, and takes questions by email. No payment is processed on the site.

## What is the same as CommerceLite

- **Content model.** The `pages` collection, its `blocks` field and all five block types
  (`marketing_hero`, `marketing_features`, `marketing_testimonials`, `marketing_pricing`,
  `marketing_faq`) are unchanged. A CommerceLite site's content works as-is.
- **Routes.** `/`, `/pricing`, `/contact` and the 404 page. The four menus (`primary`,
  `footer_product`, `footer_company`, `footer_support`) are unchanged.
- **Light, dark and system** theme switcher in the footer.

## How the storefront reads the blocks

- Every **Pricing** block on a page is a product shelf. Its headline is the category name, and
  each plan is a product: name, price, optional period and description, purchase button label and
  URL, and the **Highlight** flag (shown as a *Featured* badge).
- Each line of a plan's **Features** text is shown as an availability note. Lines starting with
  "In stock" or "Available" get a green marker, "Low stock" or "Limited" amber, and "Sold out" or
  "Unavailable" grey. Other lines get a neutral marker. The text is always shown as written.
- A **Hero** block placed before the first shelf becomes the sidebar introduction. Other blocks
  (features, FAQ, testimonials) render below the catalog in their authored order.
- Category links, header search (`?q=`) and **Sort by** (`?sort=`) are server-rendered, so they
  work without JavaScript. With JavaScript, the sort applies as soon as it changes.
- **Ask a question** opens `/contact?product=<name>`. The contact page names the product and
  pre-fills the email subject of each address.
- Purchase URLs pass through `sanitizeHref()`. External links open in a new tab with
  `noopener noreferrer`.

Pricing plans have no image field, so product tiles use a typographic treatment (the product's
initial and an original leaf mark) instead of photos. The sidebar still life is an original
inline SVG.

## Requirements

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`
- npm

The project pins **EmDash 1.2.0** and **Astro 7.3.5** exactly. It owns its own
`package-lock.json`; there is no root install.

## Develop locally

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. `.env` is
private and ignored; never commit it or share its key. To keep the development database and
uploads outside the project, set `COMMERCELITE_DATA_DIR` to a directory before starting the
server.

## Checks

```sh
npm run typecheck
npm run build
npx emdash seed seed/seed.json --validate
```

## Provenance

Forked from CommerceLite (itself generated with `create-emdash@1.2.0`, `--template marketing`).
Sample content is synthetic, and purchase links point to `shop.example.com`. No private
ZeroHostCMS code, credentials or customer data is used.

## License

MIT. Preserve upstream EmDash/Astro notices and the licenses of any third-party assets you add.
