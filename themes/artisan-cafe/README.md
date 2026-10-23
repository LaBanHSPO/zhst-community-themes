# Artisan Café (artisan-cafe)

A warm, editorial specialty-coffee theme for [EmDash](https://emdashcms.com/): a full-bleed dark
café photograph under a large serif headline ("Coffee, made slowly."), cream paper sections,
terracotta pill buttons and small tracked-caps monospace labels. It ships a categorised menu with
item pages, an about page, a visit page with opening hours and a map link, CMS pages and menu
search, all driven by CMS collections and seeded with synthetic English sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

Intended users: independent cafés, coffee bars and small bakeries that want a calm, photo-led site
with an always-current menu and opening hours.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — photo hero with "View menu", "From our kitchen" split with two photos, "On the counter today" favourites (items flagged *Show on the homepage*), "Visit us" band with address and hours, footer |
| `/menu` | Menu — photo header, sticky section tabs (Coffee, Tea & more, Pastries, Brunch; in-page anchors), priced item rows with optional thumbnails |
| `/menu/[slug]` | Item detail — photo (or branded placeholder), price, description, "What's in it", allergens, and up to three more items from the same section |
| `/about` | About — photo header with the page intro, Portable Text story from the CMS page `about`, photos, "View menu" band |
| `/visit` | Visit — opening hours, today's weekday, address, phone, email, getting-here and accessibility notes, "Open in Google Maps" link, photo |
| `/search` | Server-side search across menu items (`?q=`) |
| `/[slug]` | Any other CMS page (`private-events` is seeded and linked from the footer) |
| `404` | Styled not-found page |

The primary navigation (`Home · Menu · About · Visit`) is the EmDash menu `primary` and can be
edited in the admin. Below 900px the navigation collapses into a `<details>` menu button that works
without JavaScript. The "A cup brighter" pill in the header links to `/visit`.

## Collections

- **items** — name, menu section (`coffee` / `tea` / `pastries` / `brunch`), price (free text,
  shown as typed), menu line, full description, "what's in it", allergens, *show on the homepage*
  flag (first four flagged items appear on the homepage), sort order, `image` upload and bundled
  `photo` path.
- **hours** — days, hours, sort order (homepage band, visit page, footer).
- **venue** — one entry: name, street, postcode and city, country, phone, email, map/directions
  link (falls back to a Google Maps search built from the address), getting-here note, seating and
  accessibility note.
- **pages** — title, intro line and Portable Text. The page with slug `about` feeds `/about`; any
  other page is served at `/{slug}`.

Every image-bearing item renders the uploaded CMS `image` when present, otherwise the bundled
`photo` path in `public/images/`, otherwise a quiet branded placeholder. Section headings and
section notes live in `src/lib/cafe.ts` (`SECTIONS`); adding a menu section means adding the option
to the `category` select and a row there.

## Source map

- `seed/seed.json` — collections, menu, settings and sample content
- `src/layouts/Base.astro` — head, header (overlay variant for photo heroes), mobile nav, footer
- `src/pages/` — routes listed above
- `src/components/` — `ItemPhoto`, `FavGrid`, `Hours`, `Arrow`, `Leaf`
- `src/lib/cafe.ts` — menu sections and data helpers
- `src/styles/theme.css` — the whole visual system (tokens at the top)

## Images, fonts and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS concept artwork for this
theme (`01-artisan-cafe-a/b/c.png`, AI-generated design mockups prepared for the ZeroHostCMS
template gallery). The homepage hero is the hero photograph of the design screen with its interface
text removed by inpainting; the cinnamon-bun and interior photos are the two section photos of the
same screen; the latte, croissant, coffee-bean and café-bar images are crops of the product
illustration. Chalkboard lettering and the mug print are part of the photographs.

Fonts are self-hosted through Fontsource npm packages, so the site makes no font requests to third
parties:

- Source Serif 4 (variable, optical sizes) — Adobe, SIL Open Font License 1.1
- Inter (variable) — Rasmus Andersson, SIL Open Font License 1.1
- IBM Plex Mono — IBM, SIL Open Font License 1.1

Icons (arrow, leaf) are inline SVG. The only external links are the Google Maps link on the visit
page and footer; there is no embedded map, analytics, cookie or browser storage use.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** (Node adapter, SQLite, local storage) and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npx emdash seed seed/seed.json   # or run the setup wizard at /_emdash/admin/
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The generated
secrets file, `data.db` and `uploads/` are private and git-ignored; never commit them.

## Checks

```sh
npm run typecheck
npm run build
```

Tested with Node 24.21.0 on macOS using the Node adapter only; Cloudflare compatibility has not
been evaluated.

## Known limitations

- No ordering, reservations or contact form — the visit page links to email, phone and maps.
- Light mode only; left-to-right English only.
- The footer links to `/private-events`; remove the link in `src/layouts/Base.astro` if that page
  is deleted.

## License

MIT. Sample content is synthetic. Preserve upstream EmDash/Astro notices and the licenses of the
fonts listed above and of any third-party assets you add.
