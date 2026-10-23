# Localways (localways)

A vivid editorial city tours theme for [EmDash](https://emdashcms.com/): terracotta, warm cream and dark
teal, an expressive serif paired with a friendly sans, pill buttons and warm street-food and neighborhood
photography. It ships a homepage with featured tours and a guide story, a filterable experiences listing, a
food walk detail page (photo gallery, ordered itinerary, duration and price, meeting point map, what's
included and dietary notes), a guide profile with languages and favorite stops, and a booking request form
with a live price estimate. Everything is driven by CMS collections and seeded with synthetic sample
content. It is a standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "See the city with a local." photo hero with Explore experiences, three featured tours and a "Meet your guide" band |
| `/experiences` | Experiences — photo hero, filters (neighborhood, cuisine type, duration, walking distance) as server-side query-string filters (`?area=`, `?cuisine=`, `?duration=`, `?distance=` max km, `?guide=<slug>`), a card per tour with duration, walking distance and price per person, and a "Small groups. Big stories." band |
| `/experiences/[slug]` | Food walk detail — back link, headline, introduction, duration / group / guide facts, Check availability, photo gallery, numbered itinerary, story, duration and price card, meeting point with map image and map link, what's included and dietary notes. `/experiences/evening-food-walk` ("The evening food walk") is the designed page |
| `/guides/[slug]` | Meet your guide — portrait hero, story, languages, what I love, approach, favorite stops (each linking to a tour) and an "Explore with me" band. `/guides/sofia` is the designed page |
| `/guides` | Guides listing (a card per published guide) |
| `/booking-request` | Booking request — tour, preferred date, adult and child counts, name, email and dietary notes, with the selected tour card and a live estimated price. Accepts `?experience=<slug>` |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Experiences · Food walk detail · Meet your guide · Booking request`) is an
EmDash menu and can be edited in the admin. The search icon in the header opens the filterable
Experiences page.

## Collections

- **experiences** — tour name, short description, detail headline and introduction, booking summary,
  neighborhood, cuisine type, duration, walking distance (km), group and guide notes, guide slug, price
  per adult and per child (whole amounts), Experiences order, homepage feature flag and order, itinerary
  (stop, description, time), story heading and text, meeting point, map link, inclusions and dietary notes.
  Image pairs: `image` + `photo` (card), `hero_image` + `hero_photo` (main gallery photo), a `gallery`
  repeater (`image` + `photo` + `alt`, the first is the wide one), `story_image` + `story_photo` and
  `map_image` + `map_photo`.
- **guides** — first name, eyebrow, headline, introduction, hero button label, story eyebrow, heading and
  text (blank line between paragraphs), languages, what I love, approach, favorite stops (title, text,
  link, `image` + `photo` + `alt`), closing band copy, list text, order and `image` + `photo` (portrait).
- **company** — one entry: business name, booking request email, phone, home city, currency symbol,
  footer description and the booking form notes.
- **pages** — static pages with Portable Text.

Every image renders the uploaded CMS image when present and otherwise the bundled `photo` path in
`public/images/`.

## Booking form

"Request booking (pending confirmation)" validates in the browser, then opens the visitor's email app with a
pre-filled message (tour, date, participants, estimated price, contact details and notes) to the booking
request email. Nothing is sent by the site itself, and the status message says so. Without JavaScript the
form falls back to a `mailto:` action and the email address is shown. The price is labeled as an estimate
(adults × adult price + children × child price); the guide confirms availability and the final price. The
hosted ZeroHostCMS native inquiry inbox is the intended production handler; it is not wired into this
standalone theme.

## Accessibility notes

Landmarks, a skip link, visible focus rings, real labels on every form control, keyboard-usable steppers
(the number fields also work on their own), and `prefers-reduced-motion` are built in. Terracotta text and
links use `#b4452a` (5:1 on cream) while buttons keep the designed `#c24e30` (4.7:1 with white). Experience
filters apply on change and also have an Apply button for keyboard and no-JavaScript use. Hero copy sits on
a blurred, darkened (or cream-washed) extension of the hero photo so it stays readable.

## Images and external requests

All photographs in `public/images/` (and the street map image) were cropped from the ZeroHostCMS design
mockups for this theme. The arch logo, icons and the olive-branch skyline drawing are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Newsreader for headlines
and DM Sans for text. Remove the `<link>` in `src/layouts/Base.astro` to fall back to system fonts. The
"View on map" links open Google Maps in a new tab only when clicked.

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
