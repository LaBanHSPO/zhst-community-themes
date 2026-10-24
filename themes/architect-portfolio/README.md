# Architect Portfolio (architect-portfolio)

A light, photo-led portfolio theme for [EmDash](https://emdashcms.com/), shown with the fictional architecture studio
"ARCA". It has a full-bleed sunset hero with the headline and a black rectangular button, a featured projects row, a
studio note, the approach in four steps, services, recent studio notes, an enquiry band, a project archive filtered by
type and by status, project pages with an image sequence and a drawings placeholder, search, an About page, an Approach
page and a project enquiry page. Everything is driven by CMS collections and seeded with synthetic sample content. It is
a standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

The homepage follows the Buildful design screen for concept 41 ("Spaces shaped around people.").

## Routes

| Route | Page |
|---|---|
| `/` | Hero (headline, sub text, "Explore projects", side caption); Featured projects (three cards); From the studio; Approach in four steps; Services (architecture, interiors, landscape, feasibility); Studio news; enquiry band |
| `/projects` | All projects as photo cards. `?type=residential`, `cultural`, `hospitality`, `interiors` or `landscape` filters by type and `?status=built`, `in-progress` or `concept` filters by status; the two combine, and a filter link appears for each value that has at least one project |
| `/projects/[slug]` | Project page: type, location, year, status, approximate floor area, team roles, description, image sequence, drawings placeholder, "Start a similar project", previous and next project |
| `/approach` | CMS page `approach` plus the four phases and what each service includes |
| `/about` | CMS page `about`, the plain description of the studio and the team list |
| `/search?q=` | Search over project titles, types, countries, places and status. The magnifier in the header links here (`aria-label="Search projects"`) |
| `/contact` | Project enquiry form (type of project, site location, optional budget range, timeline, description); `?type=<slug>` pre-selects the type; email, phone, address and hours are always shown beside it; "Explore projects" links to `/projects` |
| `/[slug]` | CMS pages (`fees-and-scope` is seeded and linked from the footer automatically) |
| `404` | Styled not-found page |

The primary menu (`Projects, Approach, About`) is an EmDash menu and can be edited in the admin. Below 900px the
navigation collapses into a button that opens a panel (a native `<details>` element, so it works without JavaScript). On
phones the hero stacks: text first, then the photo; the side caption is hidden. Layouts were checked down to 375px.

## Collections

- **projects**: name, type (`residential`, `cultural`, `hospitality`, `interiors`, `landscape`), country, place or
  region, year, status (`built`, `in-progress`, `concept`), approximate floor area in square metres, team roles (one
  `Role: Name or initials` per line), one-line summary, description, drawings placeholder captions (one per line),
  homepage flag, sort order, cover `image` + `photo`, image sequence (`gallery` repeater with image, bundled path and
  caption).
- **news**: headline, date shown, topic label, text, sort order (the Studio news list on the homepage).
- **services**: name, matching project type, one-line description, included items (one per line), sort order.
- **steps** (Approach steps): name, text, usual length, sort order.
- **team**: name (text or initials), role, one line about the work, sort order.
- **studio**: one entry with name, address, office hours, phone, enquiry email, reply time and the note beside the form.
- **pages**: title, optional small label and intro, side photo, Portable Text content. The pages with slugs `about` and
  `approach` feed `/about` and `/approach`.

Site settings: the title ("ARCA") is the thin tracked wordmark and the tagline ("Architecture for better living") is the
tracked caps text beside it, split onto two lines after the first word; an uploaded logo replaces both. The letter A in
the wordmark is drawn as an open chevron to match the design. Image-bearing entries render the uploaded CMS image when
present and otherwise the bundled `photo` path in `public/images/`. The theme shows no awards, certifications,
testimonials, client logos or result claims. The project areas are approximate and the team is listed by first name and
initial only.

## Inquiries

The form validates in the browser (name, email, type of project, site location, timeline and description required, with
inline messages), then opens the visitor's email app with a pre-filled message addressed to the studio. Nothing is sent
or stored by the site itself, and the status message says so; without JavaScript the email address is shown instead. No
form plugin is used. The hosted ZeroHostCMS native inquiry handler is the intended production route; it is not wired into
this standalone theme. The extension manifest declares `inquiry: true` and type `company`.

## Fonts, images and external requests

- **Fonts** are self-hosted through npm, no font CDN, all under the SIL Open Font License 1.1:
  - [Newsreader](https://github.com/productiontype/Newsreader) (variable, optical sizes) via
    `@fontsource-variable/newsreader`: headlines, card titles and prose headings. It is the closest free match to the
    design's tight text serif. It runs a little wider than the design face, so the two big headings are set at a
    lighter weight and squeezed horizontally by about 5 percent with CSS.
  - [Inter](https://github.com/rsms/inter) (variable) via `@fontsource-variable/inter`: body text, navigation, buttons.
  - [Jost](https://github.com/indestructible-type/Jost) (variable) via `@fontsource-variable/jost`: the thin wordmark
    letters.
- **Images** in `public/images/` were cropped for this theme from the ZeroHostCMS Buildful preview images of concept 41
  (`41-architect-portfolio-a.png` and `-b.png`, AI-generated design comps):
  - `hero-home.webp` (2172x948): the design hero with the wordmark, navigation, search icon, headline, sub text, button
    and side caption removed by inpainting (the theme draws live text over the same spots). `terrace-house`,
    `infinity-pool` and `coast-rocks` are crops of it, upscaled 1.6 times.
  - `cliff-house`, `olive-court`, `forest-retreat`: the three design cards, upscaled 2 times, with the baked-in titles
    and labels inpainted out. The inpainted strip sits under the card's dark gradient and, on project pages, is cropped
    away.
  - `site-model`, `lake-pavilion`, `olive-bowl`, `material-samples` are crops of image b upscaled 1.8 to 2 times;
    `stone-room`, `concrete-shadow`, `olive-steps` and `timber-wall` were straightened from the tilted book pages in
    image b with a perspective transform and upscaled about 3 times. The source comps are small, so these crops are soft
    and several images repeat across projects.
  - The projects are fictional and the photographs are AI-generated; they show designs, not built work.
- **Icons** (arrows, search, menu button) are inline SVG. The drawings placeholder is inline SVG. No other external
  requests, no browser storage, no analytics.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0** and **Astro 7.3.5**
and owns its own `package-lock.json`.

```sh
npm ci
npx emdash init
npx emdash seed seed/seed.json
npm run dev
```

Open the local URL printed by Astro and visit `/_emdash/admin/` to edit content (or complete the admin setup wizard,
which can apply the same seed). `emdash-env.d.ts` is generated by the dev server on first run.

## Checks

```sh
npm run typecheck   # astro check: 0 errors, 0 warnings, 0 hints
npm run build       # Node adapter, standalone server
```

Tested with Node 24.21.0 on macOS, Node adapter only. Every route was screenshotted at 1440px and 375px (no horizontal
overflow at 375px, mobile menu opens, the `?type=` and `?status=` filters, search and the contact pre-selection work,
unknown URLs return 404). The 1440x1086 homepage fold was compared with the design screen (1448 wide): wordmark,
navigation, button, sub text, section heading and card rows are within about 1 to 3px vertically. The headline is within
1px vertically and 1 percent in width, though the two lines break slightly differently from the design face.

## Removal

The theme adds the collections above, one menu and seeded content. Switching away leaves those in the database until
deleted in the admin; no plugins, migrations or external services are involved.

## License

MIT. Sample content (the studio, projects, places, people, phone, email, address and notes) is synthetic; the phone
number uses a 555-01xx-style fictional number and the email uses the `.example` domain. Fonts remain under the SIL Open
Font License 1.1.
