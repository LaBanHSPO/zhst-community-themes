# Bistro (bistro-editorial)

A warm editorial restaurant theme for [EmDash](https://emdashcms.com/): oxblood, ivory and
charcoal, a refined serif with a clean sans, and evening dining photography. It ships a seasonal
menu with dish pages, a table-request form and a visit page, all driven by CMS collections and
seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js
server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — hero, seasonal dishes, story teaser, “Join us at the table” band |
| `/menu` | Our seasonal menu — section tabs (`?category=starters` … `desserts`, server-side), two-column menu with dietary marks, seasonal recommendation, photo strip |
| `/menu/[slug]` | Dish detail — gallery with thumbnails, price, ingredients, allergens, quantity and “Add to order request”, related dishes |
| `/reserve` | Reserve a table — date, time, party size, name, email, phone, special requests |
| `/visit` | Visit — address and directions, opening hours, map, “A look inside” gallery |
| `/[slug]` | CMS pages (`our-story` and `private-dining` are seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Menu · Dish detail · Reserve a table · Visit`) is an EmDash menu
and can be edited in the admin.

## Collections

- **dishes** — name, menu section (select), price, menu line, full description, ingredients,
  allergens, dietary marks (vegetarian / vegan on request / gluten-free), homepage, photo-strip
  and recommendation flags, related dish slugs, sort order, `image` + `photo`, a wide
  `banner_image` + `banner_photo` for the menu strip, and a gallery (repeater of `image` +
  `photo` + alt text).
- **hours** — day, hours, sort order (visit page table and footer).
- **spaces** — caption/alt text, sort order, `image` + `photo` (visit page gallery).
- **venue** — one entry: name, street, city line, phone, reservations email, directions link and
  map labels. The reservations email is where the forms address their requests.
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS `image` when present and otherwise falls back
to the bundled `photo` path in `public/images/`.

## Forms

“Request reservation” and “Add to order request” validate in the browser, then open the visitor's
email app with a pre-filled message to the venue's reservations email. Nothing is sent by the site
itself, and the status message says so; without JavaScript the forms fall back to a `mailto:`
action and the email address is shown. The hosted ZeroHostCMS native inquiry inbox is the
intended production handler; it is not wired into this standalone theme.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this
theme (interface text in the source screenshots was blurred out). Icons and the location map are
inline SVG; the map is a stylised drawing, not a live map, and “Get directions” opens Google Maps.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Newsreader and
Mulish. Remove the `<link>` in `src/layouts/Base.astro` to fall back to system fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0**
and **Astro 7.3.5** and owns its own `package-lock.json`.

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
