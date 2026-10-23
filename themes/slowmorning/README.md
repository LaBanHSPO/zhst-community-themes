# Slowmorning (slowmorning)

A calm Scandinavian café & bakery theme for [EmDash](https://emdashcms.com/): oat cream, espresso
brown and muted pistachio, a large welcoming serif with a light geometric sans for small labels, a
subtle paper grain and warm coffee and pastry photography. It ships a coffee and bakery menu with
item pages, whole-cake preorder requests, an "Our space" page and a visit page, all driven by CMS
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on
any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "Your daily pause." hero, three highlights, "Good coffee brings people together" story |
| `/menu` | Our menu — Coffee and Bakery tabs (in-page anchors), house-specials dropdown, product cards with prices, seasonal specials band, celebration cakes |
| `/menu/[slug]` | Item detail — for cakes: photo gallery with thumbnails, price, ingredients, allergens, size choice, preferred collection date and "Request preorder"; drinks and bakes show the same details without the form |
| `/our-space` | Our space — "A calmer kind of café.", three features, "Comfort in every detail", seating and quiet hours |
| `/visit` | Visit — "Come say hello.", opening hours, address and directions link, walking/cycling notes, map |
| `/search` | Server-side search across the menu (`?q=`) |
| `/[slug]` | CMS pages (`our-story` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Menu · Cake detail · Our space · Visit`) is an EmDash menu and can be
edited in the admin; "Cake detail" points at `/menu/pistachio-raspberry-cake`.

## Collections

- **items** — name, menu section (`coffee` / `bakery` / `cakes`), price (free text, shown as typed),
  menu line, detail label, full description, ingredients, allergens, preorder sizes (repeater of
  size + serves), house-special flag, sort order, `image` + `photo`, and a gallery (repeater of
  `image` + `photo` + alt text). Items with sizes get the preorder form.
- **features** — title, text, placement (`home`, `our-space`, `space-details`), icon, optional link,
  sort order, `image` + `photo` (homepage circles use photos; our-space rows use icons).
- **hours** — days, hours, sort order (visit page and footer).
- **directions** — title, text, icon (walk / bike / transit), sort order.
- **venue** — one entry: name, street, postcode and city, country, phone, orders email, directions
  link and map labels. The orders email is where preorder requests are addressed.
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS `image` when present and otherwise falls back to
the bundled `photo` path in `public/images/`.

## Forms

"Request preorder" validates in the browser (size and a collection date at least two days ahead),
then opens the visitor's email app with a pre-filled message to the venue's orders email. Nothing is
sent by the site itself, and the status message says so; without JavaScript the form falls back to a
`mailto:` action and the email address is shown. The hosted ZeroHostCMS native inquiry inbox is the
intended production handler; it is not wired into this standalone theme.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme
(interface text in the source screenshots was blurred out). Icons and the location map are inline
SVG; the map is a stylised drawing, not a live map, and links open Google Maps.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Newsreader and Jost.
Remove the `<link>` in `src/layouts/Base.astro` to fall back to system fonts.

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
