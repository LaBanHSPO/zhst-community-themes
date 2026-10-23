# Luma Dental (luma-dental)

A calm, premium dental clinic theme for [EmDash](https://emdashcms.com/): petrol blue, warm white and pale
aqua with a teal accent, a friendly humanist sans, soft rounded cards and pill buttons, and bright clinic
photography. It ships a homepage with service previews, a services page with care groups, a treatment
detail page (appointment stages, indicative fee, preparation and FAQ), a dentist profile with weekly
appointment-request times, and an appointment request form with the clinic address, map, opening hours
and phone. Everything is driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "Feel at ease with your smile." photo hero with three highlights, and four service preview cards |
| `/services` | Services — photo hero and a card per care group (Preventive, Restorative, Cosmetic) with description and an "Explore … care" button to its detail page |
| `/services/[slug]` | Treatment detail — eyebrow, headline, introduction, appointment stages, indicative fee card, how to prepare and an FAQ accordion. `/services/check-up` ("Your first check-up") is the designed page |
| `/dentists/[slug]` | Dentist profile — portrait, name, qualifications line, introduction, highlights, a "Request an appointment" card with this week's or next week's request times (`?week=next`), qualifications and experience, areas of practice, approach with signature, and a photo. `/dentists/emily-carter` is the designed page |
| `/dentists` | Team listing (a card per published dentist) |
| `/request-appointment` | Request appointment — new or existing patient, service, preferred date and time, name, phone, email and additional information, beside the clinic card (photo, address, directions link, map, opening hours, phone). Accepts `?service=<slug>`, `?dentist=<slug>&slot=YYYY-MM-DD 9:00 AM` and `?date=&time=` |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Services · Check-up detail · Dentist profile · Request appointment`) is an
EmDash menu and can be edited in the admin. The `/request-appointment` item is also rendered as the header
button.

## Collections

- **services** — care group name (Services page), optional homepage card title, Services page and homepage
  descriptions, card button label, icon name, show-on-Services and show-on-homepage flags with their own
  sort orders, and the detail page: eyebrow, headline, introduction, indicative fee (whole dollars) with
  label and note, appointment stages, how-to-prepare tips (repeaters with an icon name) and FAQs. Image
  pairs: `image` + `photo` (Services card), `home_image` + `home_photo` (homepage card, falls back to the
  card photo), `hero_image` + `hero_photo` (detail hero).
- **dentists** — name, short name, eyebrow, qualifications line, introduction, highlights, qualifications
  and experience, areas of practice, approach, signature, weekly request times (weekday + time, turned
  into dated options for this week and next week in Asia/Saigon time), `image` + `photo` (portrait) and
  `approach_image` + `approach_photo`.
- **clinic** — one entry: clinic name, appointment request email, phone and note, address lines,
  directions link, opening hours, footer description, form note, `image` + `photo` (reception) and
  `map_image` + `map_photo`.
- **pages** — static pages with Portable Text.

Icon names: tooth, sparkle, implant, heart, clipboard, xray, notes, toothbrush, calendar, user, users,
chat, cap, clock, phone (unknown names show the tooth). Every image renders the uploaded CMS image when
present and otherwise the bundled `photo` path in `public/images/`.

## Form

"Request appointment" validates in the browser, then opens the visitor's email app with a pre-filled
message to the clinic's appointment request email. Nothing is sent by the site itself, and the status
message says so. Without JavaScript the form falls back to a `mailto:` action and the email address is
shown. The form is a request only: it asks for no medical history or patient records, and the page says
so. The dentist profile's times are preferred request times, not live availability; picking one prefills
the request form. The hosted ZeroHostCMS native inquiry inbox is the intended production handler; it is
not wired into this standalone theme.

## Accessibility notes

Landmarks, a skip link, visible focus rings, real labels on every form control, native `<details>` FAQs
and `prefers-reduced-motion` are built in. Form control borders use `#8297a2` (3:1 against white) instead
of the mockup's lighter hairline, eyebrow text uses `#54707e` and teal text uses `#0e7f89` for 4.5:1
contrast; the bright teal `#0cafb9` is kept for the decorative headline dot. Date fields show "Mon, Apr 21"
style text over the native date control and reveal the native control while it has focus.

## Images and external requests

All photographs in `public/images/` (and the street map image) were cropped from the ZeroHostCMS design
mockups for this theme. Icons and the tooth logo are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Figtree for all text and
Mrs Saint Delafield for the dentist's signature. Remove the `<link>` in `src/layouts/Base.astro` to fall
back to system fonts. The "Get directions" link opens Google Maps in a new tab only when clicked.

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
