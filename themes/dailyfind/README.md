# Dailyfind (dailyfind)

A home & living deals theme for [EmDash](https://emdashcms.com/): cream, ink and tangerine with pale peach
panels, Plus Jakarta Sans and photo-led product cards. It ships a homepage, a filterable deals catalog, offer
pages with a reveal-code dialog, store pages with active and expired offers, and an affiliate disclosure page.
Everything is driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash
host that runs on any Node.js server with SQLite and local file storage.

## Honesty about deals

Prices, discounts, coupon codes and expiry dates are CMS fields shown as the editor's listing. They are not
live retailer data and the site never claims a deal is verified. Expiry is a static listed date; an offer
counts as expired once that calendar day has passed (Asia/Saigon). There are no countdowns. Retailer links
point at placeholder `*.example` domains and carry `rel="sponsored noopener"`; the footer, offer pages and
`/disclosure` carry the affiliate disclosure.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: "Useful finds. Better prices.", category row, featured deals |
| `/deals` | Deals catalog: category checkboxes and quick pills (`?category=`, repeatable), discount (`?discount=10\|25\|50`), price (`?min=&max=`), store (`?store=`), search (`?q=`), sort (`?sort=`), all server-side; `?saved=1` shows deals saved in this browser |
| `/deals/[slug]` | Offer detail: gallery (`?img=N`), price, facts, disclosure, about, related deals. `?reveal=1` opens the code dialog (also opened by the button with JavaScript) |
| `/stores/[slug]` | Store offers: category tabs (`?category=`), sort (`?sort=ending`), active offers with reveal code, expired offers, store deals |
| `/[slug]` | CMS pages (`disclosure` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Deals catalog · Offer detail · Store offers · Reveal code`) is an EmDash menu.

## Collections

- **deals** — product, short description, Portable Text "about", store slug, sale/original price, discount,
  categories, coupon code and note, listed expiry, valid for, exclusions, retailer link, highlights,
  gallery, `image` + `photo`, fit, homepage flag/order, catalog order.
- **stores** — name, headline, sub-headline, link, logo mark, perks.
- **store_offers** — store-wide offers: title, description, categories, badge, code, expiry, terms, `image` + `photo`.
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS `image` when present and otherwise the bundled `photo` path.
Saved deals (heart buttons) are remembered in the browser's local storage only. The header bag icon links to the
catalog; there is no cart or checkout.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme; some
product photos are small crops and look soft when enlarged on the offer page. Expired-offer photos are
grayscale crops. Icons and logos are inline SVG (the Target mark is a simple drawn bullseye).

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Plus Jakarta Sans. Remove the
`<link>` in `src/layouts/Base.astro` to fall back to system fonts.

## Forms

The theme has no forms that submit anything. Search and filters are plain GET forms. The hosted ZeroHostCMS
native inquiry inbox is the intended production handler for any inquiry form and is not wired into this
standalone theme.

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
