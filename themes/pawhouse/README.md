# Pawhouse (pawhouse)

A playful but tidy pet grooming and pet hotel theme for [EmDash](https://emdashcms.com/): butter yellow,
dark indigo, coral and cream, chunky rounded headings, rounded photo masks and real dog and cat
photography. It ships a homepage with grooming and stay previews, a grooming menu with Dogs / Cats tabs
and size-based prices, a pet hotel page with room cards, daily routine, feeding and stay policies and a
photo strip, room detail pages, an "Our space" page with the team and a care requirements FAQ, and a
booking request form, all driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "Good days for good pets." hero with Request booking; Grooming menu and Pet hotel preview cards; "A place made for the ones we love." space band |
| `/grooming` | Grooming menu — hero with Dogs / Cats tabs (`?pet=dog` or `?pet=cat`, filtered on the server); one card per service with prices by size, what's included and duration; "Gentle care for every breed." band with four benefits |
| `/hotel` | Pet hotel — hero with Request a stay; room cards with View details; daily routine, feeding and stay policies; "Take a look inside our space." photo strip; a Compare rooms table (`#compare`) |
| `/hotel/[slug]` | Room detail — introduction, best for, space, what's included, the hotel information and the other rooms |
| `/our-space` | Our space — hero; Grooming studio, Play spaces and Pet hotel cards; Meet our team photos; Care requirements FAQ (`<details>`) |
| `/booking` | Request booking — pet type and size, pet's name, grooming or pet hotel with the matching service or room, dates, owner contact details and care notes. Accepts `?book=grooming\|hotel&pet=dog\|cat&service=<grooming slug>&room=<room slug>` |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Grooming menu · Pet hotel · Our space · Request booking`) is an EmDash
menu and can be edited in the admin. The menu item that points to `/booking` is shown as the coral
header button; the others are the text navigation.

## Collections

- **grooming** — service name, pet (`dog` or `cat`), description, title icon, card colour (yellow, pink
  or cream), prices by size (repeater of size label and whole-dollar price), what's included (repeater),
  duration, sort order, `image` + `photo` + alt text.
- **rooms** — room name, card description, room page introduction, best for, space, what's included
  (repeater), sort order, `image` + `photo` + alt text. Each room has a page at `/hotel/<slug>`.
- **previews** — photo cards with icon, colour, link and link label, placed on the homepage (`home`),
  the booking page (`booking`) or Our space (`space`); `image` + `photo` + alt text.
- **highlights** — short benefits with an icon and icon circle colour: the grooming band (`grooming`),
  hotel information (`hotel`) and the booking hero (`booking`).
- **gallery** — space photos for the homepage band (`home`) and the hotel photo strip (`hotel`); the title
  is the alt text.
- **team** — name, short note, photo description, `image` + `photo`.
- **faqs** — care requirement questions and answers.
- **business** — one entry: name, booking request email, phone, address, opening hours.
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS image when present and otherwise falls back to the
bundled `photo` path in `public/images/`.

## Booking form

"Submit request" validates in the browser, then opens the visitor's email app with a pre-filled
message to the business booking request email. Nothing is sent by the site itself, the request is
pending until the business confirms it, and the status message says so. Choosing Pet hotel swaps the
service select for a room select and the date labels to check-in / check-out (CSS `:has()`; the
check-out date becomes required with JavaScript). Without JavaScript the form falls back to a `mailto:`
action and the email address is shown. The hosted ZeroHostCMS native inquiry inbox is the intended
production handler; it is not wired into this standalone theme.

## Accessibility notes

The design's coral button (`#e05e4b`) does not reach WCAG AA contrast with white labels, so buttons use
`#cb4c39`; the brighter coral stays on decorative hearts and icons. Form field and choice-chip borders
use `#9a8f80` (3:1 against white) instead of the mockup's pale beige, and a selected chip gets a darker
gold `#a7811a` outline in addition to its yellow fill.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme. The
homepage hero's hand-lettered "Clean pets, happier days" note was painted out of the photo and is set as
live text. Icons, the wordmark paw and the yellow strokes are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Fredoka for headings,
Figtree for text and Patrick Hand for the hand-lettered note. Remove the `<link>` in
`src/layouts/Base.astro` to fall back to system fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content. The generated
secrets file is private and git-ignored; never commit it.

## Checks

```sh
npm run typecheck
npm run build
```

## License

MIT. Sample content is synthetic. Preserve upstream EmDash/Astro notices and the licenses of any
third-party assets you add.
