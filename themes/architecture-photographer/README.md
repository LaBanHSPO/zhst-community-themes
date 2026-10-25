# Architecture Photographer (architecture-photographer)

A calm, editorial architecture-photography portfolio theme for [EmDash](https://emdashcms.com/), shown
with the fictional practice "KELLEN". It pairs a full-bleed golden-hour hero photograph with a large
near-black serif headline, very widely tracked thin capitals, square black buttons and warm off-white
sections. It ships a project portfolio with a Civic / Interiors / Residential filter, project pages with
a photo sequence and credits, a journal, an about page and a commission page, all driven by CMS
collections and seeded with synthetic sample content. It is a standalone EmDash host that runs on any
Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 12 ("Space. Light. Perspective." /
"Architecture Through a Clearer Lens"). The extension manifest declares type `bio` with `inquiry: true`.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage: photo hero with the eyebrow, headline, "View projects →" and the "Buildings / People / Places / Perspective" rail; "Featured work" with Civic, Interiors and Residential photos linking to the filtered portfolio; selected projects; "for architects and developers" approach; journal teaser; commission band |
| `/work` | All projects as a photo grid with a category filter (`/work?category=civic`, `interiors`, `residential`) |
| `/work/[slug]` | Project: category and year, summary, cover, credits (architect, location, year, building type, category), project notes, photo sequence with captions, "Commission similar work" and more projects |
| `/about` | About: CMS page `about`, a camera-and-prints photograph (no person is shown), "What to expect" (approach collection) |
| `/journal` | Journal posts as a list with cover photos |
| `/journal/[slug]` | Post with cover, written body and more notes |
| `/contact` | Commission enquiry form (name, email, phone, project type, project and location, timing, notes); email and phone are always shown beside it |
| `/[slug]` | CMS pages (`usage-and-licensing` is seeded and listed in the footer automatically) |
| `404` | Styled not-found page (unknown pages, projects and posts render it with HTTP 404) |

The primary menu (`Work · About · Journal`) is an EmDash menu and can be edited in the admin. The black
"View projects" button in the header always goes to `/work`; `/contact` is reached from the commission
bands, the footer, the mobile menu and each project page.

Below 821px the navigation collapses into a button that opens a panel (a native `<details>` element, so
it works without JavaScript) with the menu, "Commission", "View projects" and the phone number. On phones
the hero stacks: text on paper first, then the photograph, with the four subject words as a small row.

## Collections

- **projects**: name (title), category (select: `civic` / `interiors` / `residential`), architect
  (credit), location, year, building type, one-line summary, "show on the homepage" flag, sort order,
  cover `image` + `photo`, `gallery` repeater (photo upload or bundled path, plus caption) and a Portable
  Text notes field. Architects, places and projects in the seed are fictional.
- **posts** (Journal): title, date (as shown), topic label, summary, sort order, cover `image` +
  `photo`, Portable Text body.
- **principles** (Approach): title, text, sort order (homepage section and about page).
- **studio**: a single entry with studio name, base, phone, commission email, reply time and the note beside
  the form.
- **pages**: title, optional small label and intro, optional side photo, Portable Text content. The
  page with slug `about` feeds `/about`.

Site settings: the title ("KELLEN") is the tracked capital wordmark and the tagline ("Architecture
Photographer") is the small tracked line under it; an uploaded logo replaces both. Image-bearing entries
render the uploaded CMS image when present and otherwise the bundled `photo` path in `public/images/`.
Empty collections are handled in the templates; an unknown `?category=` shows all projects.

## Commission enquiries

The form validates in the browser (name, email, project type and project/location required, with inline
messages), then opens the visitor's email app with a pre-filled enquiry addressed to the studio email.
Nothing is sent or stored by the site itself, and the status message says so; without JavaScript the
email address is shown instead. `?type=civic|interiors|residential` pre-selects the project type (the
commission bands and project pages link this way, using the category being viewed). Email and phone are
always listed beside the form. No form plugin is used. The hosted ZeroHostCMS native inquiry handler is
the intended production route; it is not wired into this standalone theme.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, both under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines and body prose, © The Newsreader Project Authors.
    Its light optical-size cut with tight tracking is the closest free match to the design's headline face.
  - [Figtree](https://github.com/erikdkennedy/figtree) (variable) via `@fontsource-variable/figtree`:
    navigation, buttons, forms and the tracked capitals, © The Figtree Project Authors.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview
  images of concept 12 (`12-architecture-photographer-a/b/c.png`, AI-generated design comps):
  - `hero-home.webp` (1448×751): the design screen hero. The overlaid wordmark, navigation, button,
    eyebrow, headline, subtitle, CTA and the right-hand rail were removed (smooth fill over the sky,
    texture-matched fill over the concrete, and the mountain ridge under the CTA redrawn); the theme draws
    the live text over the same spots. `glass-living`, `curve-soffit` and `sea-horizon` are crops of it.
  - `civic`, `interiors`, `residential`: the three photos from the design screen, only about 285×204 in
    the source and upscaled 2.5× with light sharpening.
  - `prints-camera` (1448×1086) is the text-free product illustration (b) as is, with `print-pool`,
    `print-interior` and `camera-lens` cropped from it (the angled print was straightened). `sunset-rocks`
    is an out-of-focus crop from the same comp.
  - `pavilion-pool` is cropped from the photograph shown on the monitor in (c), upscaled 2×; its baked-in
    interface text lies outside the crop.
  The source comps are small, so several crops are soft at full size and the same eleven or so photographs
  repeat across projects and journal posts. No person is shown or presented as the photographer.
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

Tested with Node 24.21.0 on macOS, Node adapter only. Routes were checked at 1440px and 375px widths in
Chrome (no horizontal overflow at 375px, mobile menu opens and navigates, `?type=` pre-selection, form
validation and the `?category=` filter work). The 1448×1086 homepage fold was overlaid on the design
screen: wordmark, navigation, eyebrow, headline, subtitle, button, rail and the featured row are within
about 2px vertically and horizontally. Newsreader approximates the design's headline face, so letter
shapes differ slightly ("Perspective." is a few pixels wider).

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the
database until deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (practice, architects, buildings, places, phone, email) is synthetic; the phone number
uses a 555-01xx-style fictional number and the email uses the `.example` domain. There are no awards,
publications or client reviews. Fonts remain under the SIL Open Font License 1.1.
