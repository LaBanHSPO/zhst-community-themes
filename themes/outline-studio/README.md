# Outline (outline-studio)

A confident independent-studio theme for [EmDash](https://emdashcms.com/): black, warm white and
vivid vermilion, very large editorial type, an asymmetric portfolio grid and a generous project
enquiry form. It ships a homepage, packages, a filterable work page, case studies and a project
enquiry page, all driven by CMS collections and seeded with synthetic sample content. It is a
standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — hero, “Selected work” (projects flagged for the homepage) |
| `/services` | Services & packages — three packages with price, checklist and “Get started” |
| `/work` | Work — asymmetric grid with server-side filters (`?type=branding`, `web-design`, `packaging`) |
| `/work/[slug]` | Case study — challenge, approach, deliverables, imagery, more work (`/work/common-ground` is the “Case study” nav link) |
| `/start-a-project` | Start a project — enquiry form and studio contact details (`?service=<package-slug>` preselects a service) |
| `/[slug]` | CMS pages (`privacy` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Services & packages · Work · Case study · Start a project`) is an
EmDash menu and can be edited in the admin.

## Collections

- **projects** — name, work filters (branding / web design / packaging), discipline lines for the
  work page and the homepage card, summary, grid size, homepage and work-grid flags, sort order,
  `image` + `photo`, and the case-study copy (headline, intro, challenge, approach, deliverables,
  image gallery).
- **packages** — name, number, summary, price line, “what's included” (one per line), sort order,
  `image` + `photo`.
- **studio** — one entry: name, enquiries email, phone, address and reply time. The email is where
  the enquiry form addresses its message (`hello@outline.example` is a placeholder; replace it).
- **pages** — static pages with Portable Text.

Every image-bearing entry renders the uploaded CMS `image` when present and otherwise falls back
to the bundled `photo` path in `public/images/`.

## Forms

“Send enquiry” validates in the browser, then opens the visitor's email app with a pre-filled
message to the studio email. Nothing is sent by the site itself, and the status message says so;
without JavaScript the form falls back to a `mailto:` action and the email address is shown. The
hosted ZeroHostCMS native inquiry inbox is the intended production handler; it is not wired into
this standalone theme.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this
theme. Icons are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Inter, Instrument
Sans and JetBrains Mono. Remove the `<link>` in `src/layouts/Base.astro` to fall back to system
fonts.

## Develop locally

Requires Node.js `^22.22.2 || ^24.15.0 || >=26.0.0` and npm. The project pins **EmDash 1.2.0**
and **Astro 7.3.5** and owns its own `package-lock.json`.

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
