# Together (together)

A warm civic community theme for a neighborhood association, built for [EmDash](https://emdashcms.com/):
deep ultramarine navy, marigold and ivory, a confident readable sans (Figtree) with a hand-lettered
"together." accent, pill buttons and documentary photos of neighborhood volunteers. It ships a homepage with
the next activity and the latest stories, an activities page with topic filters, an event detail page
(date and venue, agenda, what to bring, register action), long-form news stories with related stories, and a
"Join us" form. Everything is driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "A better neighborhood, together." photo hero with Join us, the upcoming activity (the event flagged for the homepage, else the next one) and the two latest stories |
| `/activities` | Activities — hero, topic filters as server-side query strings (`?category=environment`, `community`, `skills`, `events`), ongoing activity cards (topic chip, place, schedule, Learn more) and upcoming event cards |
| `/events/[slug]` | Event detail — back link, title, introduction, date/time and venue, Register for this event, photo, about, agenda timeline, what to bring and an "Everyone is welcome" band. `/events/saturday-at-the-community-garden` is the designed page; `/events` redirects to the Events filter |
| `/posts` | News — all stories, newest first, with category filters and pagination |
| `/posts/[slug]` | News story — eyebrow, headline, standfirst, author and date, full-width photo, Portable Text body, tags and related stories. `/posts/a-place-to-grow-together` is the designed page |
| `/category/[slug]`, `/tag/[slug]` | Stories in a category or with a tag |
| `/join` | Join us — first/last name, email, phone, neighborhood, how to participate (volunteer, member, stay informed), interests, comments and consent. `?event=<slug>` registers for an event; `?interest=<text>` pre-fills the comment |
| `/search` | Site search (`?q=`) across stories, events, activities and pages, opened by the header search icon |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Activities · Event detail · News story · Join us`) is an EmDash menu and can be
edited in the admin.

## Collections

- **posts** (News) — headline, standfirst, card summary, date shown, author name and author photo
  (`author_image` + `author_photo`), story photo (`image` + `photo` + `photo_alt`) and Portable Text body;
  `category` and `tag` taxonomies.
- **activities** — name, short description, topic (`environment`, `community`, `skills`), where, when, the
  slug of its next event (target of Learn more), order and card photo (`image` + `photo` + `photo_alt`).
- **events** — title, card title, card summary, introduction, topic, start and end, venue, address, about,
  agenda (time + item), what to bring (item, second line, icon), welcome band copy, homepage feature flag, and
  three image pairs: card (`image` + `photo`), detail (`hero_image` + `hero_photo`, defaults to the card
  photo) and welcome band (`band_image` + `band_photo`).
- **association** — one entry: name, contact email (join form recipient), phone, address, footer
  description, the join form's neighborhoods and interests (one per line) and the note beside Submit.
- **pages** — static pages with Portable Text.

Every image renders the uploaded CMS image when present and otherwise the bundled `photo` path in
`public/images/`. Dates are shown in the Asia/Saigon time zone.

## Join form

Submit validates in the browser, then opens the visitor's email app with a pre-filled message (name, contact,
neighborhood, participation, interests, comments and the event when registering) addressed to the
association's contact email. Nothing is sent by the site itself, and the status message says so. Without
JavaScript the form falls back to a `mailto:` action and the email address is shown. The hosted ZeroHostCMS
native inquiry inbox is the intended production handler; it is not wired into this standalone theme.

## Accessibility notes

Landmarks, a skip link, visible focus rings, real labels and fieldsets on every form control, filters as
plain links with `aria-current`, a `<details>` mobile menu and `prefers-reduced-motion` are built in. Buttons
use navy text on marigold (9.7:1). On light backgrounds the "together." script accent uses a darker marigold
`#c08000` (3.1:1, large text); it keeps the bright `#fbb92f` on dark hero photos. Form control borders are
`#8c95a3` (3:1 on white).

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme. The
logo and icons are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Figtree for text and
headings, Caveat Brush (with Caveat as fallback) for the script accent. Remove the `<link>` in
`src/layouts/Base.astro` to fall back to system fonts.

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
