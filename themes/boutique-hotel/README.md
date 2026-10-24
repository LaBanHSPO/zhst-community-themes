# Elmwood Boutique Hotel (boutique-hotel)

A boutique hotel theme for [EmDash](https://emdashcms.com/), shown with the fictional hotel "Elmwood". A full-bleed,
warm guest-room photo with a white light serif headline and muted olive pills sits above a warm off-white section
with two photo panels. Behind it are a rooms collection (filter by guests and view), experiences, local walks, an
about page with the team, house policies and a request-your-dates form that opens an email. It is a standalone
EmDash host (Node adapter, SQLite, local files) seeded with synthetic sample content.

The homepage follows the Buildful design screen for concept 55 ("A stay with a sense of place.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero, "A warmer way to travel." with two photo panels, three featured rooms, breakfast and the terrace, the neighbourhood (walks), a check-in strip, booking band |
| `/rooms` | All rooms. `?guests=1..4` shows rooms that fit that many guests or more, `?view=garden\|hillside\|lake` narrows by view, and the two combine. Unknown values show everything. A filtered list shows its count and a "Clear filters" link |
| `/rooms/[slug]` | Size, bed, sleeps, view, "from" price per night (placeholder), photo sequence, amenities, description, similar rooms. "Request this room" goes to `/contact?room=<slug>` |
| `/experience` | Breakfast, terrace bar, local walks (with the walk list), bikes and arranged excursions. Each has plain details such as times and prices and an anchor (`#local-walks`) |
| `/about` | CMS page `about`, a photo and the team list (first names, no portraits, no awards or press) |
| `/contact` | "Book": room, check-in, check-out, guests, name, email, optional phone, special requests. `?room=<slug>` pre-selects the room and `?guests=1..5` pre-selects the guest count. Email, phone and address are always shown |
| `/[slug]` | CMS pages. `policies` ("House policies") is seeded with check-in and check-out times, a labelled sample cancellation text, pets and children |
| `404` | Styled not-found page |

The primary menu (`Rooms / Experience / About`) is an EmDash menu. The "Book" pill goes to `/contact` and
"Explore rooms" goes to `/rooms`. Below 1024px the navigation collapses into a round button that opens a panel
(native `<details>`, works without JavaScript), the two-column layouts stack and the hero text sits on a dark wash
at the top of the photo. The handwritten note on the second homepage panel is hidden below 1024px.

## Collections

- **rooms**: name, one-line description, view (`garden`, `hillside`, `lake`), size in m², bed type, maximum guests,
  amenities (one per line), "from" price per night in whole dollars (placeholder), featured flag, sort order, intro,
  Portable Text content, `image` + `photo` (+ `photo_alt`), `gallery` (more bundled photo paths, one per line).
- **experiences**: name, description, details (`Label|Value` per line), sort order, `image` + `photo`.
- **walks**: walk name, time and terrain, short note, sort order.
- **team**: first name, role, two sentences. No photos.
- **company**: hotel name, address, phone, booking email, reception hours (`Day|Hours` per line), check-in and
  check-out times, parking note and the note shown above the booking form.
- **pages**: title, small label, intro, Portable Text content (`about`, `policies`).

Site settings: title "Elmwood" and tagline "Boutique Hotel" form the wordmark; an uploaded logo replaces them.
Prices are labelled samples. No star rating, review score, award, press mention or booking-platform logo appears
anywhere.

## Booking requests

The form validates in the browser (room, both dates with check-out after check-in, name and email required), then
opens the visitor's email app with a pre-filled message addressed to the hotel email. Nothing is sent or stored by
the site. A note above the form and the status message say this is a request, not a booking, and that the hotel
confirms availability and price by email. Without JavaScript the email address is shown instead. No form plugin
is used. The hosted ZeroHostCMS handler is the intended production route and is not wired here.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN):
  [Fraunces](https://github.com/undercasetype/Fraunces) (`@fontsource-variable/fraunces`) for headlines and the
  wordmark, [Hanken Grotesk](https://github.com/marcologous/hanken-grotesk) (`@fontsource-variable/hanken-grotesk`)
  for text, navigation and forms, and
  [Herr Von Muellerhoff](https://fonts.google.com/specimen/Herr+Von+Muellerhoff)
  (`@fontsource/herr-von-muellerhoff`) for the handwritten note. All three are SIL Open Font License 1.1,
  (c) their respective Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 55
  (`55-boutique-hotel-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x707) is the hero of the design screen. The wordmark, navigation, the olive pills, the
    eyebrow and the headline were removed by inpainting (live text is drawn over the same spots).
  - `panel-coffee` and `panel-wall` are the two lower panels of the design, 2x upscaled (soft, from about 400px
    sources). The handwriting on the wall was removed and is live text. The book titles on the coffee table and in
    the hero are physical objects and stay.
  - `view`, `terrace`, `bench`, `bed` and `armchair` are crops of the same screen, upscaled.
  - `suite`, `arch`, `headboard` and `b-bench` are crops of illustration b (full size for `suite`).
- **Icons** (arrows, menu) are inline SVG. The hotel address links to Google Maps in a new tab. No other
  external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and **Astro 7.3.5**.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Edit content at `/_emdash/admin/`. Seeding skips content that already exists; delete `data.db` to re-seed.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings
npm run build       # Node adapter, standalone server
```

Routes were checked at 1440px and 375px in Chromium (no horizontal overflow, mobile menu is a `<details>`). The
1440x1086 homepage fold was compared with the 1448x1086 design: wordmark, navigation, headline, button, section
heading, body text and both photo panels sit within about 1 to 4px. Fraunces approximates the design's headline
face, which is a little heavier and tighter.

## License

MIT. Sample content (hotel, address, phone, email, rooms, walks, team and prices) is synthetic; the phone number
uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font License 1.1.
