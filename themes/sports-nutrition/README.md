# Sports Nutrition (sports-nutrition)

A sunlit sports nutrition theme for [EmDash](https://emdashcms.com/), shown with the fictional coaching
business "Nutriforce Sports Nutrition". It has a full-bleed photo hero with a heavy dark headline, a split
section with a grain-bowl photo and an off-white panel, a coaching plans list, a weekly meal prep menu, a
lifestyle journal with category filter, an about page and a get-started page. Everything is driven by CMS
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on any
Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 29 ("Fuel your next chapter." / "Real food.
Active lives.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (headline, sub text, "Explore coaching", handwritten note); split section with photo and "Real food. Active lives." panel; coaching plans; this week's meal prep menu; lifestyle posts; start band |
| `/coaching` | All coaching plans (who it is for, format, check-ins, "from" price) and how coaching starts |
| `/coaching/[slug]` | Plan detail: format, check-ins, price, what is included, description, other plans |
| `/meal-prep` | Meal collection: ingredients, allergens, approximate macros per serving, sample price; weekly order info as plain text (no checkout) |
| `/lifestyle` | Posts and recipes; `?category=<name>` filters the list |
| `/lifestyle/[slug]` | Post detail with more posts below |
| `/about` | CMS page `about`: the team in plain words, a note that the photos are AI-generated and the athlete is fictional |
| `/contact` | Get Started form (mailto): `?interest=coaching\|meal-prep\|other` pre-selects the interest, `?plan=<slug>` pre-selects a plan; phone, email, pickup address and hours are always shown |
| `/[slug]` | Any other CMS page (linked from the footer when it is not in the menu) |
| `404` | Styled not-found page |

The primary menu (`Coaching, Meal Prep, Lifestyle, About`) is an EmDash menu and can be edited in the admin.
The "Get Started" pill in the header goes to `/contact`; "Explore coaching" goes to `/coaching`.

Below 900px the navigation collapses into a round button that opens a panel (a native `<details>` element, so
it works without JavaScript). On phones the hero stacks: text first, then the photo. Layouts were checked down
to 375px. The handwritten note beside the hero photo is hidden below 900px.

## Collections

- **plans** (coaching plans): title, summary, who it is for, sports covered, format, check-in cadence, price (a
  "from" placeholder), what is included (one per line), home page flag (up to four flagged plans appear on the
  homepage), sort order, `image` + `photo`, Portable Text description.
- **meals**: name, short description, ingredients, allergens, calories, protein, carbohydrate and fat (integers,
  shown as approximate per serving), price placeholder, label, "on this week's menu" flag (flagged meals feed
  the homepage menu), sort order, `image` + `photo`.
- **posts** (lifestyle): title, excerpt, category (free text; the filter chips are built from the categories in
  use), date posted (`YYYY-MM-DD`), reading time, `image` + `photo`, Portable Text content.
- **steps** (how coaching starts): title, text, sort order.
- **studio**: one entry with the business name, phone, email, pickup address, hours (one per line, day and
  time split by a `|`), a note under the hours, the weekly meal order info (one line per row) and the note
  shown above the form.
- **pages**: title, optional small label and intro, Portable Text content.

Site settings: the title ("Nutriforce") is the wordmark in tracked caps and the tagline ("Sports Nutrition")
is the tiny caps line beneath it; an uploaded logo replaces both. Entries render the uploaded CMS image when
present and otherwise the bundled `photo` path in `public/images/`.

## Health content

The theme makes no outcome promises (no times, weight or body changes), shows no testimonials, awards or
ratings, sells no supplements and states no qualifications. Each plan page says what the plan does not do. The
footer says guidance is general and does not replace medical advice. The form asks visitors to leave out
medical details. Macros, prices, hours and the business itself are placeholders: replace them with your own
details, and add allergen and labelling information that your local rules require.

## Inquiries

The Get Started form validates in the browser (name, email, interest, sport and goals required, with inline
messages), then opens the visitor's email app with a pre-filled message addressed to the studio. Nothing is
sent or stored by the site itself, and the status message says so; without JavaScript the email address is
shown instead. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended
production route; it is not wired into this standalone theme. The extension manifest declares `inquiry: true`
and type `company`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [DM Sans](https://github.com/googlefonts/dm-fonts) (variable) via `@fontsource-variable/dm-sans`:
    headlines, body text, navigation and buttons. It is close to the design's headline face at weight 800.
  - [DM Mono](https://github.com/googlefonts/dm-fonts) via `@fontsource/dm-mono`: tracked caps labels.
  - [Qwigley](https://fonts.google.com/specimen/Qwigley) via `@fontsource/qwigley`: the handwritten note. It
    approximates the design's pen lettering, which is neater than the original.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 29 (`29-sports-nutrition-a/b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x647): the design hero with the logo, navigation, button, headline, sub text,
    caption and handwritten note removed by inpainting (the theme draws live text over the same spots).
    `athlete.webp` and `landscape.webp` are crops of it.
  - `bowl-home.webp` (796x434): the grain-bowl photo with the caps caption removed by inpainting. The
    "NUTRIFORCE" lettering on the black bottle is part of the photo and was kept. `bowl-top.webp` is a crop.
  - `scene.webp` is the full image b; `bowl-side`, `shaker`, `dumbbell`, `chicken` and `avocado` are crops of
    it. Some crops are small and several photos repeat across pages. The mountain background in image b is
    out of focus in the source.
  All people, names, the business, the address and the phone number are fictional. The athlete is an
  AI-generated person and is not presented as a coach or client.
- **Icons** (arrows, menu button, leaf mark, the three line icons) are inline SVG approximations. No other
  external requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and
**Astro 7.3.5** and owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the admin setup
wizard, which can apply the same seed).

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px (no
horizontal overflow at 375px, mobile menu opens, `?interest=`, `?plan=` and `?category=` work, unknown URLs
return 404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): headline, sub
text, button, caption, navigation, panel text and icons are within a few pixels; the right edge sits about 8px
left because of the narrower viewport.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database
until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (business, team, address, phone, email, plans, meals, prices and opening hours) is
synthetic; the phone number uses a 555-01xx-style fictional number and the email uses the `.example` domain.
Fonts remain under the SIL Open Font License 1.1.
