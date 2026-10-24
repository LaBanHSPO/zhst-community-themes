# Live Band (live-band)

An energetic independent-band theme for [EmDash](https://emdashcms.com/), shown with the fictional band
"The Live Band". A full-bleed concert hero with a heavy condensed headline, a brush-script wordmark,
handwritten notes, a single red pill button and an off-white "Next Stops" section of tour-date cards. It
ships a tour collection that splits upcoming from past shows at request time, releases with tracklists
and optional audio, band members, a gallery, an about page and a contact page with topic
pre-selection. Everything is CMS-driven and seeded with synthetic sample content. It is a standalone
EmDash host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 17 ("Made for the live moment." /
"See tour dates").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: concert hero, headline, tagline, "See tour dates" button and handwritten notes; "Next Stops" with the next three upcoming dates from the tour collection; latest release with tracklist; band members; gallery; "Never miss a night" updates band |
| `/tour` | Upcoming shows (with on-sale / sold-out / cancelled status and an optional ticket link) and past shows, split by today's date on every request |
| `/tour/[slug]` | Show: date, venue, time, status, note, ticket link (upcoming and on sale only), about text, more nights |
| `/music` | Releases as a cover grid |
| `/music/[slug]` | Release: cover, year and format, tracklist with a native `<audio>` player per track when an audio URL is set, credits, liner notes |
| `/about` | About: CMS page `about`, a stage photo and the band members with bios |
| `/contact` | Contact form with a topic (`?topic=updates`, `booking` or `press`); email addresses and phone are always listed beside it |
| `/[slug]` | CMS pages (`show-info` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Home · Tour · Music · About`) is an EmDash menu and can be edited in the admin.
"Get Updates" (outlined pill in the header) links to `/contact?topic=updates`. Below 900px the
navigation collapses into a round button that opens a panel (a native `<details>` element, so it works
without JavaScript) with the menu, "Get Updates" and the phone number.

## Collections

- **shows** (Tour dates) — city (title), venue, show date (datetime, stored at noon UTC so the day never
  shifts), doors text, ticket status (`on-sale`, `sold-out`, `cancelled`), optional ticket link, short
  note, venue `image` + `photo`, Portable Text. A show is "upcoming" when its date is today or later in
  the `Asia/Saigon` timezone; this is evaluated per request, so cards never show stale upcoming dates.
  Cancelled dates stay on `/tour` struck through but are left out of the homepage "Next Stops".
- **releases** (Music) — title, format (Album / EP / Single), year, one-liner, cover, tracklist repeater
  (title, length, optional audio file URL), credits, sort order (newest first), liner notes.
  Without an audio URL the page says audio is not published yet instead of showing a dead player.
- **members** — name, role, initials (shown when there is no photo), short bio, photo, sort order.
- **photos** (Gallery) — title, caption, image, sort order.
- **band** — one entry: band name, base, phone, general / booking / press emails, reply time and the
  note beside the form.
- **pages** — title, optional small label and intro, Portable Text content.

Site settings: the title ("The Live Band") is rendered as the brush wordmark with a leading "The" set
small above the rest; an uploaded logo replaces it. Image-bearing entries render the uploaded CMS image
when present and otherwise the bundled `photo` path in `public/images/`.

## Contact and updates

The form validates in the browser, then opens the visitor's email app with a pre-filled message
addressed to the matching address (updates and general to the general email, booking to the booking
email, press to the press email). Booking asks for an event date (not in the past) and city and venue;
"Get updates" only needs a name and email. Nothing is sent or stored by the site itself and the status
message says so; without JavaScript the email address is shown. No form plugin is used. The hosted
ZeroHostCMS native inquiry handler is the intended production route; it is not wired into this
standalone theme. The extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Anton](https://fonts.google.com/specimen/Anton) via `@fontsource/anton` — the hero headline and page
    titles (SIL OFL 1.1, © The Anton Project Authors). It is a little narrower than the design's heavy
    grotesque, so the headline is widened 8% with `scaleX`.
  - [Playfair Display](https://github.com/clauseggers/Playfair) via `@fontsource-variable/playfair-display`
    — serif headings and city names (SIL OFL 1.1, © The Playfair Display Project Authors).
  - [Figtree](https://github.com/erikdkennedy/figtree) via `@fontsource-variable/figtree` — navigation,
    body text and tracked caps (SIL OFL 1.1, © The Figtree Project Authors).
  - [Kaushan Script](https://fonts.google.com/specimen/Kaushan+Script) via `@fontsource/kaushan-script` —
    the brush wordmark, squeezed and tilted to approximate the design's lettering (SIL OFL 1.1,
    © The Kaushan Script Project Authors).
  - [Shadows Into Light](https://fonts.google.com/specimen/Shadows+Into+Light) via
    `@fontsource/shadows-into-light` — handwritten notes (SIL OFL 1.1, © Kimberly Geswein). The notes are
    live text and are hidden below 1100px.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 17 (`17-live-band-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×743) — the design screen hero; the wordmark, navigation, pill, headline,
    tagline, button and handwritten note were removed by inpainting (the theme draws the live text over
    the same spots). The `gallery-crowd` and `gallery-drums` crops come from it.
  - `venue-riverton`, `venue-lakeside`, `venue-maplewood` — the three black and white photos from the
    design screen, only about 285×165 in the source and upscaled 2.5× with light sharpening.
    `venue-hall`, `venue-club`, `venue-pit`, `venue-stage` are black and white crops of the stage
    photograph (b).
  - `member-*`, `cover-*` and `gallery-*` are crops of (b) (the band on stage). Member photos are the
    same AI-generated performers, who stand in for the fictional members; covers are text-free crops with
    titles set as live text. The product image (c) is not used, because its screen and road case carry
    baked-in text.
  Because the source comps are small, some crops are soft and the same performers repeat across pages.
  Venue photos are generic stage shots, not the named fictional venues.
- **Icons** (arrows, menu button) are inline SVG. No other external requests, no browser storage, no
  analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the admin
setup wizard, which can apply the same seed).

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. All routes were screenshotted at 1440px and 375px
in Chrome (no horizontal overflow at 375px, the mobile menu opens, topic pre-selection, conditional
booking fields and form validation work). The 1440×1086 homepage fold was measured against the design
screen: headline, tagline, button, "Next Stops" text and cards sit within about 1–4px vertically (the
design is 1448px wide, so the right-hand cards and the dark strip sit about 8px further left). The brush
wordmark and the handwritten notes are approximations of the design's hand lettering.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (band, people, venues, cities, phone, emails, ticket links and dates) is synthetic;
the phone number uses a 555-01xx-style fictional number, emails use the `.example` domain and ticket
links point at `tickets.example`. Fonts remain under the SIL Open Font License 1.1.
