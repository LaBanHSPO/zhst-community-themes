# Music Producer (music-producer)

A dark, cinematic music-producer theme for [EmDash](https://emdashcms.com/), shown with the fictional
studio "SonicForge". A full-bleed studio hero with a heavy grotesque headline ("Bring your sound to life.")
and a handwritten chalk note on the wall leads into the latest credits, a studio teaser, services with
starting rates, a four-step process and a booking band. It ships a music collection of credits filterable
by role, a studio page with rooms, gear and rates, an about page and a booking contact page, all driven by
CMS collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on any
Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 18 ("Bring your sound to life." / "Hear the work").

## Routes

| Route | Page |
|---|---|
| `/` | Hero, latest four credits with the studio teaser, services, process steps, booking band |
| `/studio` | CMS page `studio` with the rooms and gear list, services with starting rates, booking band |
| `/music` | All credits as covers; `?role=produced\|mixed\|mastered` filters by what the studio did |
| `/music/[slug]` | Credit page: cover, artist, role tags, optional native `<audio>` preview, session notes, more music |
| `/about` | CMS page `about` with the producer shown from behind |
| `/contact` | Mailto booking form; `?service=production\|recording\|mixing\|mastering` pre-selects the service; email and phone are always shown |
| `/[slug]` | CMS pages (`booking-terms` is seeded and listed in the footer automatically) |
| `404` | Styled not-found page |

"Hear the work" (header and hero) goes to `/music`; "Explore the studio" goes to `/studio`. The primary menu
(`Home · Studio · Music · About`) is an EmDash menu. Below 900px the navigation collapses into a round button
that opens a panel (a native `<details>` element, so it works without JavaScript); the chalk note is hidden
on small screens.

## Collections

- **credits** (Music) — title, artist, year, type (Single / EP / Album), studio roles (multi-select:
  produced, mixed, mastered), short description, sort order, `cover` upload + `cover_photo` bundled path,
  optional `audio` file, credits text, Portable Text session notes. A credit with an audio file gets a
  native `<audio controls>`; the seed has none, so the page says no preview has been uploaded yet.
  The first four credits by sort order appear on the homepage.
- **services** — name, description, "from" rate text, included items, sort order, photo.
- **rooms** — name, description, gear list (one per line), sort order, photo.
- **producer** — one entry: studio name, base, phone, contact email, reply time and the note beside the form.
- **pages** — title, optional small label and intro, Portable Text content (`about`, `studio`, `booking-terms`).

Site settings: the title ("SonicForge") is split into a white bold "SONIC" and a gold "FORGE" in the wordmark;
the tagline ("Music Producer") is the tiny caps line under it. An uploaded logo replaces both.

All artists, credits, names, rates and contact details are synthetic. The rates are fictional placeholder
figures and are labelled as such on the page; the phone is `(555) 010-0148` and the email is on `.example`.
No real artists, labels, streaming logos, awards, reviews or play counts are used.

## Contact

The form validates in the browser (name, email, service and message required, inline messages), then opens the
visitor's email app with a pre-filled message addressed to the studio, with the service in the subject. Nothing is
sent or stored by the site itself, and the status message says so; without JavaScript the email address is shown
instead. Email and phone are always listed beside the form. The hosted ZeroHostCMS native inquiry handler is the
intended production route; it is not wired into this standalone theme. The extension manifest declares
`inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter` — body text, navigation,
    buttons, © The Inter Project Authors.
  - [Inter Tight](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter-tight` — headlines,
    © The Inter Project Authors.
  - [Covered By Your Grace](https://fonts.google.com/specimen/Covered+By+Your+Grace) via
    `@fontsource/covered-by-your-grace` — the handwritten chalk note, © Kimberly Geswein.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 18 (`18-music-producer-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×650) — the design hero with the wordmark, navigation, headline, sub-line, both
    buttons, the eyebrow and the handwritten chalk note removed (inpainting; the theme draws the live text
    over the same spots). The mug lettering is on a physical object and stays.
  - `cover-higher-ground`, `cover-midnight-thoughts`, `cover-same-skies`, `cover-still-here` — the four covers
    from the design's release row, 2.6× upscaled, with the baked title and artist lettering inpainted out
    (the theme draws it live).
  - `cover-midnight-skies`, `cover-further-still`, `cover-slow-light` (from the mockup, 2.4× upscaled, titles
    removed) and `cover-afterglow` (perspective-corrected record sleeve from the text-free illustration).
  - `studio-lounge.webp` (the design's lounge photo; the neon sign is on a physical wall and stays),
    `studio-desk.webp` and the `gear-*.webp` crops (text-free illustration), `producer-console.webp` and
    `desk-console.webp` (crops of the hero).
  The source comps are small, so the covers and the lounge photo are soft at large sizes, and some photos
  repeat across pages. The producer is shown only from behind.
- No analytics, trackers or third-party requests.

## Run it

```bash
npm install
npx emdash init
npx emdash seed seed/seed.json
npm run dev          # http://localhost:4321
npm run typecheck    # astro check: 0 errors, 0 warnings, 0 hints
npm run build        # Node adapter, standalone server
npm start
```
