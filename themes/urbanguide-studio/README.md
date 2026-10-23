# UrbanGuide Studio

A local-directory theme for [EmDash](https://emdashcms.com/). It uses the [UrbanGuide](../urbanguide/)
data model with a studio layout: a left icon sidebar with a cobalt active pill, an illustrated
“Discover your city” hero with a large search bar and category chips, popular place cards, a local
guides panel and “Explore by category” tiles. On phones it switches to a top bar with a slide-in
menu, compact place rows and a bottom tab bar. The palette is off-white, cobalt blue and coral.

Public pages include a small “Powered by ZeroHost CMS” credit linking to
[UrbanGuide Studio one-click deployment](https://zerohostcms.com/themes/urbanguide-studio). The
[theme credit component](src/components/theme-credit.astro) owns this link. It uses no tracking.

## What is the same as UrbanGuide

- **Content model.** The `listings`, `posts` (Guides) and `pages` collections, their fields, and the
  `category` and `tag` taxonomies are unchanged. An UrbanGuide installation's records work as-is.
- **Routes.** `/`, `/listings`, `/posts`, `/posts/[slug]`, `/[slug]`, `/category/[slug]`,
  `/tag/[slug]` and `/404` are kept.

## What is new

- `/listings/[slug]` — a place page matching the collection's existing `/listings/{slug}` URL
  pattern (address, phone, website and “Open now” when those fields are set).
- `/listings?q=…&category=…` — server-side search and category filter. The hero search is a plain
  GET form, so it works without JavaScript.
- `/category/[slug]` lists the places in that category as well as its guides.
- Artwork is CSS and inline SVG. Listings have no image field, so each place uses an illustration
  for its category. Guides show their featured image when one is set.

## Requirements

- Node.js `^22.22.2 || ^24.15.0 || >=26.0.0`
- npm

The project pins **EmDash 1.2.0** and **Astro 7.3.5** exactly. It owns its own `package-lock.json`.

## Develop locally

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. `.env` is private
and ignored; never commit it. To keep the database and uploads outside the project folder, set
`URBANGUIDE_DATA_DIR=/some/dir` (default: `./data.db` and `./uploads`, as in UrbanGuide).

## Checks

```sh
npm run typecheck
npm run build
npx emdash seed seed/seed.json --validate
```

## Provenance

Forked from the UrbanGuide community theme (`create-emdash@1.2.0`, starter template). Sample
content is synthetic: every place, address, phone number and guide is invented, and websites use
`example.invalid`. Icons, artwork and the skyline illustration are original. No private
ZeroHostCMS code, credentials or customer data is used.

## License

MIT. Preserve upstream EmDash/Astro notices and the licenses of any third-party assets you add.
