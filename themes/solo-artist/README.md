# Solo Artist (solo-artist)

A moody, cinematic singer-songwriter theme for [EmDash](https://emdashcms.com/), shown with the fictional
artist "nova". A full-bleed lamp-lit portrait hero with a large cream serif headline and handwritten notes
leads into a "latest release" section (cover, tracklist), earlier releases, upcoming shows, a story teaser
and a booking and press band. It ships a music collection with release pages (tracklist, optional audio
players, liner notes), a tour collection split into upcoming and past shows, an about page and a contact
page, all driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash
host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 16 ("Find your next favorite sound." /
"Higher Ground").

## Routes

| Route | Page |
|---|---|
| `/` | Photo hero, latest release with tracklist, earlier releases, next three shows, story teaser, contact band |
| `/music` | All releases as covers with type, year and one-line description |
| `/music/[slug]` | Release page: cover, description, tracklist (native `<audio>` player for tracks with an audio file, otherwise length only), liner notes, more music |
| `/tour` | Shows split into **Upcoming** and **Past shows** by today's date (Asia/Saigon), computed on every request; on-sale, sold-out and cancelled states, optional ticket link |
| `/about` | About: CMS page `about` with the hero photo |
| `/contact` | Mailto contact form; `?topic=booking\|press\|other` pre-selects the topic; email and phone are always shown |
| `/[slug]` | CMS pages (`press-kit` is seeded and listed in the footer automatically) |
| `404` | Styled not-found page (unknown pages and releases render it with HTTP 404) |

The primary menu (`Music · Tour · About`) is an EmDash menu and can be edited in the admin. The outlined
"Listen now" button in the header goes to `/music`; "Listen now" on the homepage goes to the latest
release. Track rows on the homepage link to that track on the release page, so no play control is a dead
button. Below 900px the navigation collapses into a round button that opens a panel (a native
`<details>` element, so it works without JavaScript); the handwritten notes are hidden on phones.

## Collections

- **releases** (Music): title, type (Single / EP / Album), year, one-line description, short
  description, "latest release" flag (homepage), sort order (newest first), `cover` upload +
  `cover_photo` bundled path, tracklist (repeater: title, length, optional audio file upload), credits,
  Portable Text liner notes. A track with an audio file gets a native `<audio controls>`; the seed has
  none, so the page says "No audio attached".
- **shows** (Tour): name, city, venue, date, time text, status (on-sale / sold-out / cancelled),
  optional ticket link, optional note. Seeded ticket links use `tickets.example`; no real vendors.
- **artist**: one entry: name, base, phone, contact email, reply time and the note beside the form.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug `about`
  feeds `/about`.

Site settings: the title ("nova") is the lowercase tracked serif wordmark and the tagline ("Solo Artist")
the tiny caps line under it; an uploaded logo replaces both. The seeded shows run from May 2026 to March
2027, so on 2026-10-24 some are upcoming and some past; as time passes shows move to "Past shows" by
themselves.

## Contact

The form validates in the browser (name, email, topic and message required, inline messages), then
opens the visitor's email app with a pre-filled message addressed to the artist's email, with the topic
in the subject. Nothing is sent or stored by the site itself, and the status message says so; without
JavaScript the email address is shown instead. Email and phone are always listed beside the form. The
hosted ZeroHostCMS native inquiry handler is the intended production route; it is not wired into this
standalone theme. The extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines and wordmark, © The Newsreader Project Authors.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via `@fontsource-variable/figtree`:
    navigation, buttons, body text, © The Figtree Project Authors.
  - [IBM Plex Mono](https://github.com/IBM/plex) via `@fontsource/ibm-plex-mono`: sub-lines, track
    numbers and times, © IBM Corp.
  - [Zeyada](https://fonts.google.com/specimen/Zeyada) via `@fontsource/zeyada`: the handwritten
    margin notes, © The Zeyada Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 16 (`16-solo-artist-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448×681): the design hero with the wordmark, navigation, headline, sub-line,
    button and both handwritten notes removed (inpainting; the theme draws the live text over the same
    spots).
  - `cover-higher-ground.webp`: the cover from the design's release section (2× upscaled, lettering
    on the artwork stays). `cover-still-here.webp` (perspective-corrected record sleeve),
    `cover-moon-room.webp`, `cover-lamp-light.webp`, `portrait-moon.webp`, `scene-room.webp`: crops
    of the text-free illustration (b).
  The source comps are small, so several crops are soft and some photos repeat across pages. The woman
  shown is an AI-generated fictional persona, used here as the artist's own portrait.
- All names, venues, cities, songs and releases are fictional; phone numbers are 555-01xx and emails
  use `.example`. There are no streaming-service logos, awards, reviews or play counts.
- **Icons** (play, arrows, menu button) are inline SVG. No other external requests, no browser storage,
  no analytics.

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

Tested with Node 24.21.0 on macOS, Node adapter only. Routes were checked at 1440px and 375px widths in
Chrome (no horizontal overflow, mobile menu, `?topic=` pre-selection, 404 status for unknown pages and
releases). The 1440×1086 homepage fold was measured against the design screen (1448×1086): headline,
sub-line, buttons, cover, title and tracklist are within about 1–5px vertically; right-aligned elements
sit about 8px further left because the design is 8px wider. The handwriting font is a little tidier
than the design's pen and the mono is an approximation.
