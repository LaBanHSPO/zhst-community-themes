# Bistro Studio

A neighborhood restaurant theme for [EmDash](https://emdashcms.com/) in warm cream, terracotta and
olive. It is the [Bistro](../bistro/) data model with a designed public layout: an editorial hero,
an olive "visit us" panel with opening hours and contact details, menu cards, a course-grouped menu,
and a journal. It is a standalone EmDash host that runs on any Node.js server with SQLite and local
file storage.

## What is the same as Bistro

- **Content model.** The `menu` (name, description, price, category, available), `posts` and
  `pages` collections, the `category`/`tag` taxonomies, the `primary` menu and the `sidebar` widget
  area are unchanged. A Bistro installation's records work as-is.
- **Routes.** `/`, `/menu`, `/posts`, `/posts/[slug]`, `/category/[slug]`, `/tag/[slug]`, `/[slug]`
  and `/404` behave as in Bistro.
- **Dependencies.** EmDash 1.2.0 and Astro 7.3.5 are pinned exactly, with the same lockfile.

## What the studio layout adds

- **Home.** The site tagline is the hero heading. The course labels under it come from the menu
  items' `category` values. The olive panel reads two pages: the first two paragraphs of the page
  with slug `hours` and the first paragraph of the page with slug `contact`. If either page is
  missing, its rows are hidden; if both are missing, the hero spans the full width. Up to four dishes
  are shown in course order (starters, mains, sides, desserts, drinks, then others).
- **Menu.** `/menu` groups dishes by category with a course jump list, dotted price leaders and an
  "unavailable" state. `/menu/[slug]` is a dish detail page, matching the collection's declared
  `urlPattern`.
- **Artwork.** The menu has no image field, so dishes and the hero use original inline SVG
  illustrations tinted by category. Journal entries show their featured image when one is set.
- **Mobile.** A menu button opens a stacked navigation panel (Escape closes it and returns focus).
  On tablets and phones the visit panel becomes a row of cream cards.

The theme uses system serif and sans-serif fonts. It makes no external font, image or analytics
requests. There is no dark mode, as in Bistro.

## Develop locally

Use the Node version range `^22.22.2 || ^24.15.0 || >=26.0.0`.

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open `/_emdash/admin/` to edit content. `.env` is private and ignored; never commit it.

To keep the database and uploads outside the project folder, set `BISTRO_DATA_DIR` before running
or building (it is read when the Astro configuration is evaluated). By default they live in the
project folder, as in Bistro.

```sh
npm run typecheck
npm run build
HOST=127.0.0.1 PORT=4321 npm start
```

## Sample content

[seed/seed.json](seed/seed.json) holds synthetic content: six dishes, two journal entries, and the
`about`, `hours` and `contact` pages. The address, phone number and email are placeholders. Replace
them with your own details.

## License

MIT. Preserve upstream EmDash/Astro notices and the licenses of any third-party assets you add.
