# Pinehaven (pinehaven)

A quiet mountain-lodge boutique stay theme for [EmDash](https://emdashcms.com/): forest green, oatmeal and
dark brown, an editorial book serif with a light letter-spaced sans for small labels, and wide
atmospheric cabin and pine-forest photography. It ships a homepage with a date and guests availability
strip and featured cabins, a cabins listing, a cabin detail page with gallery, amenities, sleeping
arrangements and location, a local experiences page, and a stay request form with a live indicative
summary. Everything is driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "A slower kind of stay." photo hero, check-in / check-out / guests strip (submits to `/request-a-stay` with the values prefilled) and three featured cabins |
| `/rooms` | Rooms — photo hero and a card per cabin with bed configuration, guest capacity, starting nightly price and "View cabin" |
| `/rooms/[slug]` | Cabin detail — title, tagline, introduction, guests / bedrooms / bathrooms, starting price, "Request availability", in-page section links (Overview, Amenities, Sleeping arrangements, Gallery, Location), photo gallery mosaic and more cabins. `/rooms/the-pine-cabin` is the designed page |
| `/explore` | Explore — photo hero, experience cards with walk/drive distance and travel time, and planning notes per experience |
| `/request-a-stay` | Request a stay — check-in/out, guests, cabin, name, email and special requests, with a stay summary (photo, dates and nights, guests, cabin, starting rate × nights). Accepts `?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&guests=N&cabin=<slug>` |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Rooms · Cabin detail · Explore · Request a stay`) is an EmDash menu and can
be edited in the admin. The `/request-a-stay` item is also rendered as the header button.

## Collections

- **cabins** — name, detail tagline, card description, detail introduction, bed configuration, guests
  (free text such as `2–4`), maximum guests (used to validate the request form), bedrooms, bed layout,
  bathrooms, starting nightly price (USD), overview heading and text, amenities and sleeping
  arrangements (repeaters), location text, "feature on homepage" flag, sort order, and image pairs:
  `image` + `photo` (card), `hero_image` + `hero_photo` (detail hero, falls back to the card photo),
  `interior_image` + `interior_photo` (stay summary photo).
- **gallery** — cabin photos: description (used as alt text), cabin slug, sort order (the first is shown
  large), `image` + `photo`.
- **experiences** — name, walk or drive, distance, travel time, card description, planning notes, good to
  know, sort order, `image` + `photo`.
- **lodge** — one entry: lodge name, stay request email, phone, address, check-in and check-out times,
  stay summary note.
- **pages** — static pages with Portable Text.

Every image renders the uploaded CMS image when present and otherwise the bundled `photo` path in
`public/images/`.

## Form

"Request availability" validates in the browser (check-out after check-in, guests within the chosen
cabin's capacity), then opens the visitor's email app with a pre-filled message to the lodge's request
email. Nothing is sent by the site itself, and the status message says so. Without JavaScript the form
falls back to a `mailto:` action and the email address is shown. The summary shows starting rates only
and makes no live inventory claim. The hosted ZeroHostCMS native inquiry inbox is the intended production
handler; it is not wired into this standalone theme.

## Accessibility notes

Landmarks, a skip link, visible focus rings, real labels on every form control and
`prefers-reduced-motion` are built in. Form control borders use `#8f8573` (3:1 against the oatmeal
background) instead of the mockup's lighter hairline. Date fields show "Apr 17, 2025" style text over the
native date control and reveal the native control while it has focus.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme; on the
hero photos the mockup's overlaid header and headline text were retouched out. Icons are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): EB Garamond for text and
display, Jost for small letter-spaced labels. Remove the `<link>` in `src/layouts/Base.astro` to fall back
to system fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The generated secrets
file is private and git-ignored; never commit it.

## Checks

```sh
npm run typecheck
npm run build
```

## License

MIT. Sample content is synthetic. Preserve upstream EmDash/Astro notices and the licenses of any
third-party assets you add.
