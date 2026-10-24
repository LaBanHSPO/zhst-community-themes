# Public Speaker (public-speaker)

A dark stage and off-white theme for [EmDash](https://emdashcms.com/), shown with the fictional speaker "Caleb Rivers".
It has a full-bleed photo hero with a live handwritten note, three signature talk cards, four speaking formats, upcoming
and past dates, a speaker kit with downloadable photos, a journal and a booking enquiry form. All content comes from CMS
collections and is seeded with synthetic sample text. It is a standalone EmDash host that runs on any Node.js server with
SQLite and local file storage.

The homepage follows the Buildful design screen for concept 38 ("Ideas that move the room." / "Fresh perspectives for
what's next.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero (eyebrow, headline, sub text, "Explore talks", handwritten note), signature talks, formats with typical lengths, next four dates, speaker kit teaser, latest journal posts, booking band |
| `/talks` | All talks as photo cards; `?topic=leadership`, `?topic=human-potential` or `?topic=culture` filters the list. Below it, the calendar split into upcoming and past by date |
| `/talks/[slug]` | Talk detail: description, what the audience leaves with, formats and lengths, suitable audiences, "Book this talk" |
| `/about` | CMS page `about` with portrait, plain bio and a note that the speaker is fictional |
| `/journal`, `/journal/[slug]` | Journal posts with cover, byline and more posts |
| `/contact` | Booking enquiry form (talk, event date, city or Virtual, audience size, optional budget range); `?talk=<slug>` pre-selects a talk; email and phone always shown |
| `/speaker-kit` | CMS page `speaker-kit` (short and long bio, introduction to read aloud, tech rider) plus three photo downloads |
| `/[slug]` | Other CMS pages (`booking-notes` is seeded and linked from the footer) |
| `404` | Styled not-found page |

The primary menu (`Talks, About, Journal`) is an EmDash menu and can be edited in the admin. The white pill in the header
goes to `/talks`; booking links go to `/contact`. Below 860px the navigation collapses into a round button that opens a
panel (a native `<details>` element, so it works without JavaScript). Below 1060px the hero stacks: text first, then the
photo, and the handwritten note is hidden. Layouts were checked down to 375px.

## Collections

- **talks**: title, one-line summary, topic, what the audience leaves with, formats and lengths, suitable audiences (one
  item per line each), homepage flag, sort order, cover `image` + `photo`, Portable Text description.
- **formats**: name, typical length, text, sort order.
- **events** (Speaking dates): name, date, venue, city or Online, format, related talk slug, short note. Upcoming and past
  are split by date in the site timezone (Asia/Saigon) on every request, so past events never read as upcoming.
- **journal**: title, summary, date shown, reading time, homepage flag, sort order, cover `image` + `photo`, body.
- **speaker** (Contact details): one entry with name, base, phone, booking email, reply time and the note above the form.
- **pages**: title, optional small label and intro, Portable Text content. Slugs `about` and `speaker-kit` feed their own routes.

Site settings: the title ("Caleb Rivers") is the serif wordmark and the tagline is the tracked caps line beneath it.
Phone numbers use 555-01xx and emails use the `.example` domain. Dates, venues, events and fee ranges are placeholders.
The theme shows no testimonials, client names, "as seen at" logos, audience numbers, awards or media mentions.

## Inquiries

The form validates in the browser, then opens the visitor's email app with a pre-filled message addressed to the
speaker's team. Nothing is sent or stored by the site itself, and the status message says so. Without JavaScript the
email address is shown instead. The extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes), SIL OFL 1.1: wordmark,
    headlines, card titles.
  - [Inter](https://github.com/rsms/inter) (variable), SIL OFL 1.1: body text, navigation, buttons.
  - [Homemade Apple](https://fonts.google.com/specimen/Homemade+Apple) by Sideshow, Apache License 2.0: the handwritten
    note on the hero (live text, not an image).
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of concept 38
  (`38-public-speaker-a.png` and `-b.png`, AI-generated design comps):
  - `hero-home.webp`: the design hero with the wordmark, navigation, button, eyebrow, headline, sub text, call to action,
    handwritten note and small caps removed by inpainting (the theme draws live text over the same spots).
  - `talk-*.webp`: the three card photos from image a with their baked-in text removed, plus a mountain, a seedling and a
    group in silhouette cut from the three panels in image b and straightened.
  - `headshot-*.webp` and `journal-*.webp`: crops of the cleaned hero and of image b, upscaled 1.5 to 2.2 times.
  The source comps are small, so some crops are soft and a few images repeat across pages. Caleb Rivers is a fictional,
  AI-generated persona; the About page and the speaker kit say so.
- **Icons** are inline SVG. No other external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and **Astro 7.3.5** and
owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS. Every route was screenshotted at 1440px and 375px (no horizontal overflow, mobile
menu opens, `?talk=` pre-selection and the `?topic=` filter checked in the rendered HTML, unknown URLs return 404). The
1440x1086 homepage fold was compared with the design screen (1448 wide): text, buttons, cards and photo positions are
within about 1 to 4px. The headline font is a little wider than the design's, and the handwriting font is a little
rounder than the design's pen.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database until
deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (speaker, cities, venues, events, phone, email, talks, posts and fee ranges) is synthetic. Fonts
keep their own licences as listed above.
