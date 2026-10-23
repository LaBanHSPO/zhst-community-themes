# Fieldtested

An independent outdoor-gear review theme for ZeroHostCMS (EmDash 1.2.0, Astro, Node adapter): pine green, warm white and charcoal with restrained orange links.

## Included

- Homepage with a hero, latest reviews and buying-guide cards, plus a visible affiliate disclosure.
- Review catalog with server-side filters (activity chips, category and gear-type checkboxes, brand, search, sort) driven by query strings, no JavaScript required.
- Review articles with a "Demo review" label, pros and cons, key specifications, section anchors, alternatives and retailer links.
- Compare backpacks table (stacked cards on small screens).
- Buying guides with an "On this page" list, top picks and FAQs.
- Field notes (`/posts`, `/category/*`, `/tag/*`), CMS pages and a styled 404.

## Routes

`/`, `/reviews`, `/reviews/[slug]`, `/compare`, `/guides`, `/guides/[slug]`, `/posts`, `/posts/[slug]`, `/category/[slug]`, `/tag/[slug]`, `/[slug]` (CMS pages, e.g. `/affiliate-disclosure`, `/about`), `/404`.

Catalog query strings: `?activity=hiking|camping|travel`, `?type=Backpacks`, `?brand=Osprey`, `?q=text`, `?sort=newest|oldest|name`.

## Collections

`reviews`, `guides` (sections, top picks and FAQs as repeaters), `products` (compare table), `posts`, `pages`, `site` (disclosure wording). Image-bearing entries have an optional `image` upload and a bundled `photo` path; templates use `image ?? photo`.

## Affiliate links and prices

Outbound retailer links use `rel="sponsored noopener"`, announce themselves to screen readers, and sit next to an affiliate disclosure. The demo retailer URLs are placeholders on `.example` domains, not real stores. Prices are CMS text fields shown as the reviewer's noted price ("indicative, not a live price"); replace them and the retailer links with your own. There are no star ratings or review counts in the demo content.

## Images

Photographs were cropped from the ZeroHostCMS design mockups for this theme (`public/images`, about 400 KB). Where the mockup baked headline text into a photo, the wide heroes use only the clean region on a blurred pine extension.

## External requests

Google Fonts (Barlow Condensed and Inter) are loaded from `fonts.googleapis.com` in `src/layouts/Base.astro`. Remove the `<link>` to self-host or fall back to system fonts.

## Run

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```
