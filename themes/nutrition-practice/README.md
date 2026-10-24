# Nutrition Practice (nutrition-practice)

A warm off-white and forest-green theme for [EmDash](https://emdashcms.com/), shown with the fictional nutrition
practice "NourishWay" and its nutritionist, Nora Bell. It has a full-bleed photo hero with a live handwritten
note, three approach points, a short "what working together looks like" section, a services price list, a
resource library of articles, recipes and guides with a type filter, an About page and a consultation request
page, all driven by CMS collections and seeded with synthetic sample content. It is a standalone EmDash host
that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 28 ("Find your balance with food." /
"A kinder, more balanced approach to nutrition.").

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero (eyebrow, headline, sub text, "Meet your nutritionist", handwritten note); approach with three points and a second handwritten note; how working together goes (three steps); services price list; resources teaser; consultation band |
| `/about` | "Meet your nutritionist": CMS page `about` with portrait and a link to request a consultation |
| `/services` | The four services (initial consultation, follow-up sessions, family nutrition, meal planning support) with format, length, a "from" price and what is included |
| `/services/[slug]` | Service detail: description, included list, other services |
| `/resources` | All articles, recipes and guides as a photo grid; `?category=articles`, `?category=recipes` or `?category=guides` filters the list (filter links appear for every type that has at least one entry) |
| `/resources/[slug]` | Article, recipe or guide with cover, byline, quick facts, text and more from the library |
| `/contact` | Consultation request form (requests only, no medical details); `?service=<slug>` pre-selects a service; email and phone always shown beside it |
| `/[slug]` | CMS pages (`good-to-know` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Home, About, Services, Resources`) is an EmDash menu and can be edited in the admin. The
green "Get Started" pill in the header goes to `/contact`; "Meet your nutritionist" on the hero goes to `/about`.

Below 1000px the navigation collapses into a round button that opens a panel (a native `<details>` element,
so it works without JavaScript). On phones the hero stacks: text first, then the photo. The handwritten notes
and the basil sprig are hidden below 1000px. Layouts were checked down to 375px.

## Collections

- **services**: name, one-line description, best-for phrase, format, length, price shown, included items
  (one per line), homepage flag, sort order, `image` + `photo`, Portable Text description.
- **resources**: title, summary, type (`articles`, `recipes` or `guides`), quick facts (for example
  "Serves 4. About 35 minutes."), date shown, reading time, homepage flag, sort order, cover `image` + `photo`,
  Portable Text body (bullet and numbered lists are styled).
- **principles** (Approach): title, text (a line break splits it), icon (`leaf`, `bowl` or `heart`), sort order.
- **steps** (How it works): title, "when" label, text, sort order.
- **practice**: one entry with name, base, phone, request email, reply time and the note above the form.
- **pages**: title, optional small label and intro, Portable Text content. The page with slug `about` feeds `/about`.

Site settings: the title ("NourishWay") is the serif wordmark and the tagline ("Nutrition Practice") is the
tracked caps line beneath it; an uploaded logo replaces both. Image-bearing entries render the uploaded CMS
image when present and otherwise the bundled `photo` path in `public/images/`. Prices are indicative
placeholders in US dollars, not real offers.

The theme makes no weight-loss or treatment claims and shows no testimonials. The footer, the Good to know
page, the About page, every resource and the request form each say that nutrition guidance does not replace
medical advice, and the form asks visitors to leave out medical details.

## Inquiries

The form validates in the browser (name, email, service and "what would you like help with" required, with
inline messages), then opens the visitor's email app with a pre-filled message addressed to the practice. It
also carries an optional phone number, preferred day, preferred time and meeting format. Nothing is sent or
stored by the site itself, and the status message says so; without JavaScript the email address is shown
instead. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended production
route; it is not wired into this standalone theme. The extension manifest declares `inquiry: true` and type `bio`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Source Serif 4](https://github.com/adobe-fonts/source-serif) (variable, optical sizes) via
    `@fontsource-variable/source-serif-4`: the hero headline only. It is the closest free match to the
    design's heavy headline serif.
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: wordmark, section titles, card titles and page headings.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via `@fontsource-variable/figtree`: body
    text, navigation and buttons.
  - [Nothing You Could Do](https://fonts.google.com/specimen/Nothing+You+Could+Do) via
    `@fontsource/nothing-you-could-do`: the two handwritten notes (live text, not images).
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of
  concept 28 (`28-nutrition-practice-a.png` and `-b.png`, AI-generated design comps):
  - `hero-home.webp` (1448x718): the design hero with the wordmark, navigation, button, eyebrow, headline, sub
    text, call to action, caption line and handwritten note removed by inpainting (the theme draws live text
    over the same spots). The framed print "HEALTHY FOOD HAPPIER PEOPLE" is a physical object in the photo and
    stays.
  - `sprig.webp`: the basil sprig from the design, with the handwritten note beside it painted out.
  - `nutritionist-portrait` and `nutritionist-counter` are crops of the cleaned hero (about 1.4 to 1.5 times
    upscaled with light sharpening); the other `resource-*` images are crops of image b (and two of the hero
    counter), upscaled 1.2 to 1.8 times.
  The source comps are small, so some crops are soft and several photos repeat across pages. Nora is a
  fictional, AI-generated persona; the About page says so.
- **Icons** (arrows, menu button, leaf mark, leaf, bowl, heart) are inline SVG approximations. No other
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

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px
(no horizontal overflow at 375px, mobile menu opens, `?service=` pre-selection and the `?category=` filter
work, unknown URLs return 404). The 1440x1086 homepage fold was compared with the design screen (1448 wide):
text, buttons, circles and photo positions are within about 1 to 4px. The right edge sits about 8px left
because of the narrower viewport. Source Serif 4 sets "Find your" about 40px narrower than the design, and
the handwriting is neater than the design's pen.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (practice, nutritionist, city, phone, email, services, recipes and prices) is synthetic;
the phone number uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts
remain under the SIL Open Font License 1.1.
