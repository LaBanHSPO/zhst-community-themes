# Pinecrest Mountain Lodge (mountain-lodge)

A mountain lodge theme for [EmDash](https://emdashcms.com/), shown with the fictional lodge "Pinecrest". A full-bleed
dusk photo of a timber and stone lodge below snowy peaks carries a white serif headline and deep forest green
rectangular buttons, followed by a warm off-white section with a room photo and a short list of three lodge
qualities. Behind it are a rooms and cabins collection (filter by type and by how many people sleep), experiences,
a gallery with a category filter, an about page with the team, lodge policies and an availability request form that
opens an email. It is a standalone EmDash host (Node adapter, SQLite, local files) seeded with synthetic sample
content.

The homepage follows the Buildful design screen for concept 57 ("Find your quiet escape.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero, "A warmer way to experience the mountains." with a room photo and three line-icon rows, three featured stays, summer and winter (hiking and snowshoeing with practical notes), the kitchen and breakfast, getting here (road, parking, winter tyres), booking band |
| `/stay` | All rooms and cabins. `?type=room\|cabin` narrows by type, `?sleeps=2\|4\|6` shows places that sleep that many or more, and the two combine. Unknown values show everything. A filtered list shows its count and a "Clear filters" link |
| `/stay/[slug]` | Type, sleeps, beds, size in m², fireplace, view, "from" price per night (placeholder), photo sequence, what is included, description, similar stays. "Request this stay" goes to `/contact?room=<slug>` |
| `/experience` | Hiking, snowshoeing, sauna, stargazing, lake swim, cross-country skiing and the kitchen. Each shows season, duration, difficulty, details and what to bring, with an anchor per item |
| `/gallery` | Photos with captions. `?category=lodge\|rooms\|valley\|details` filters the grid |
| `/about` | CMS page `about`, a photo and the team list (first names, no portraits) |
| `/contact` | "Book a Stay": room or cabin, check-in, check-out, guests, arrival time, name, email, optional phone, special requests. `?room=<slug>` pre-selects the room and `?guests=1..8` the guest count. Email, phone and address are always shown |
| `/[slug]` | CMS pages. `lodge-policies` ("Lodge policies") is seeded with sample check-in times, a labelled sample cancellation text, children and pets, fires and winter driving |
| `404` | Styled not-found page |

The primary menu (`Home / Stay / Experience / Gallery`) is an EmDash menu. "Book a Stay" goes to `/contact` and
"Explore the lodge" goes to `/stay`. About and the policies page are linked from the footer. Below 1024px the
navigation collapses into a square button that opens a panel (native `<details>`, works without JavaScript), the
two-column layouts stack and the hero text sits on a dark wash over the lower part of the photo.

## Collections

- **stays**: name, one-line description, type (`room` or `cabin`), sleeps, beds, size in m², wood fireplace flag,
  view, amenities (one per line), "from" price per night in whole dollars (placeholder), featured flag, sort order,
  intro, Portable Text content, `image` + `photo` (+ `photo_alt`), `gallery` (more bundled photo paths, one per line).
- **experiences**: name, description, season (`summer`, `winter`, `all-year`), duration, difficulty, what to bring
  (one per line), details (`Label|Value` per line), sort order, `image` + `photo`.
- **gallery**: caption, category (`lodge`, `rooms`, `valley`, `details`), sort order, `image` + `photo`.
- **team**: first name, role, two sentences. No photos.
- **company**: lodge name, address, phone, booking email, reception hours (`Day|Hours` per line), check-in and
  check-out times, parking note, directions by road, winter driving note and the note shown above the booking form.
- **pages**: title, small label, intro, Portable Text content (`about`, `lodge-policies`).

Site settings: title "Pinecrest" and tagline "Mountain Lodge" form the wordmark next to the mountain-and-pines mark;
an uploaded logo replaces them. Prices are labelled samples. No star rating, review score, award, press mention or
booking-platform logo appears anywhere.

## Booking requests

The form validates in the browser (room, both dates with check-out after check-in, name and email required), then
opens the visitor's email app with a pre-filled message addressed to the lodge email. Nothing is sent or stored by
the site. A note above the form and the status message say this is a request, not a booking, and that the lodge
confirms availability and rate by email. Without JavaScript the email address is shown instead. No form plugin is
used. The hosted ZeroHostCMS handler is the intended production route and is not wired here.

## Fonts, images and external requests

- **Fonts**, self-hosted via npm (no CDN): [Newsreader](https://github.com/productiontype/Newsreader)
  (`@fontsource-variable/newsreader`) for everything. SIL Open Font License 1.1, (c) the Newsreader Project Authors.
- **Images** in `public/images/` were cropped from the ZeroHostCMS Buildful preview images of concept 57
  (`57-mountain-lodge-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448x730) is the hero of the design screen. The wordmark, navigation, button, headline,
    sub-headline, call to action and the small right-hand tagline were removed by inpainting (live text is drawn
    over the same spots).
  - `room-bed` and its crops (`room-bed-low`, `room-window`, `room-lamp`) come from the bedroom photo in the design
    screen, upscaled 2 to 2.4 times, so they are soft at full size.
  - `lodge-dusk`, `peak-clouds`, `valley-fog`, `pines-ridge`, `sky-sun`, `glow-room`, `deck-chair` and `b-full` are
    crops of illustration b. `firepit-deck` and `lodge-glass` are crops of the design hero. `mug-pines` is the
    mug in comp c (the pine print is on the physical mug and stays).
  - Photos repeat across the stays, gallery and experiences because the source set is small.
- **Icons** (arrows, menu, the mark and the three list icons) are inline SVG. The lodge address links to Google Maps
  in a new tab. No other external requests, no browser storage, no analytics.

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
heading, body text and the photo sit within about 1 to 8px. Newsreader approximates the design's serif.

## License

MIT. Sample content (lodge, address, phone, email, stays, experiences, team and prices) is synthetic; the phone
number uses the 555-01xx range and the email uses the `.example` domain. Fonts remain under the SIL Open Font
License 1.1.
