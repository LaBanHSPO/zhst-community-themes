# Still (still-spa)

A serene day spa theme for [EmDash](https://emdashcms.com/): pale sand, deep plum and dusty rose, refined
thin serif headings with a readable sans, and warm treatment, linen and stone photography. It ships a
homepage with the signature treatment and spa atmosphere, a treatments page with Massage / Facial / Body
tabs and clear durations and prices, treatment pages (the signature "Still Ritual" with its four-step
treatment journey), therapist profiles, and an appointment request form, all driven by CMS collections
and seeded with synthetic sample content. It is a standalone EmDash host that runs on any Node.js server
with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "A little time, entirely yours." hero with Explore treatments; three highlights; signature treatment panel with Discover the ritual; "A more peaceful kind of place." photo |
| `/treatments` | Treatments — hero; Massage / Facial / Body tabs (`?category=massage\|facial\|body`, filtered on the server); treatment cards with duration, price, Book treatment; "Not sure what's right for you?" band |
| `/treatments/[slug]` | Treatment page — hero photo, duration, price, Request an appointment; treatment journey steps (when the entry has them); what to expect; therapist consultation note. The signature treatment is `/treatments/the-still-ritual` |
| `/therapists` | Therapists — portraits, names, areas of practice, approach and Book with … buttons; "Not sure who to choose?" band |
| `/appointment` | Appointment request — treatment, preferred therapist, preferred date and time, name, phone and notes, plus "A few things to know". Accepts `?treatment=<treatment slug>&therapist=<therapist slug>` |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Treatments · Signature treatment · Therapists · Appointment request`) is an
EmDash menu and can be edited in the admin. "Signature treatment" points at the signature treatment's
page; on other treatment pages "Treatments" is marked as the current item.

## Collections

- **treatments** — name, category (`massage`, `facial` or `body`, the tab it appears under), card
  description, page introduction, duration in minutes, whole-dollar price, signature flag (the first
  flagged entry is featured on the homepage), treatment journey heading and steps (repeater of step,
  description and icon name), what-to-expect heading and text, sort order, `image` + `photo` + alt text
  for cards, and optional page hero (`hero_image` / `hero_photo`) and what-to-expect photos
  (`expect_image` / `expect_photo`). Each treatment has a page at `/treatments/<slug>`.
- **therapists** — name, areas of practice (comma separated), approach, sort order, `image` + `photo` +
  alt text.
- **highlights** — short icon items: the homepage row (`home`) and "A few things to know" on the
  appointment page (`appointment`). Icons: lotus, sprout, stones, face, leaf, steam, clock, calendar.
- **business** — one entry: name, appointment request email, phone, address, opening hours.
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS image when present and otherwise falls back to the
bundled path in `public/images/`.

## Appointment form

"Request appointment" validates in the browser, then opens the visitor's email app with a pre-filled
message to the business appointment request email. Nothing is sent by the site itself, the appointment
is pending until the spa confirms it, and the status message says so. Without JavaScript the form falls
back to a `mailto:` action and the email address is shown. The hosted ZeroHostCMS native inquiry inbox is
the intended production handler; it is not wired into this standalone theme.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme. The
headlines that sat on the hero and band photos were softened out of the image and are set as live text.
The mockups only show massage photography, so the Facial and Body cards use other still-life crops from
the same mockups. Icons and the arrow are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Newsreader for headings
and the wordmark, Jost for text. Remove the `<link>` in `src/layouts/Base.astro` to fall back to system
fonts.

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
