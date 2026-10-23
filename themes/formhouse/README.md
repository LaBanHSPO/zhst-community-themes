# Formhouse (formhouse)

An architectural, editorial renovation-studio theme for [EmDash](https://emdashcms.com/): stone,
charcoal-brown and burnt sienna, an oversized display serif with a precise small sans, and large
residential interior photography. It ships a homepage with a featured project, a filterable projects
grid, a project detail page with scope, materials and before/after images, a services and process page,
and a site visit request form. Everything is driven by CMS collections and seeded with synthetic sample
content. It is a standalone EmDash host that runs on any Node.js server with SQLite and local file storage.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage — "Make room for better living." photo hero and the featured project teaser |
| `/projects` | Projects — "Our work" header with All / Kitchen / Living / Whole-home filter pills (`?type=kitchen`, `?type=living`, `?type=whole-home`, filtered on the server) and a grid of project cards with location and type |
| `/projects/[slug]` | Project detail — hero, project overview, scope table (location, type, size, timeline, key materials), before/after images, full-width detail photo with closing text, more projects and a site visit call to action. `/projects/the-courtyard-house` is the designed page |
| `/services` | Services & process — hero, kitchen and whole-home renovation packages, the material palette and the four-step design-to-build process |
| `/site-visit` | Book a site visit — split layout with the request form (project type, property area, location, budget band, preferred visit date, name, email, details) and a photo. `?type=kitchen|living|whole-home` preselects the project type |
| `/[slug]` | CMS pages (`about` is seeded) |
| `404` | Styled not-found page |

The primary menu (`Homepage · Projects · Project detail · Services & process · Book a site visit`) is an
EmDash menu and can be edited in the admin. The `/site-visit` item is rendered as the header button.

## Collections

- **projects** — name, location, filter category (Kitchen, Living, Whole-home), detail eyebrow, hero
  introduction, homepage teaser, overview, project type, size, timeline, key materials, closing heading
  and text, "feature on homepage" flag, sort order, and image pairs with descriptions: `image` + `photo`
  (card), `hero_image` + `hero_photo` (detail hero), `feature_image` + `feature_photo` (homepage feature),
  `before_image` + `before_photo`, `after_image` + `after_photo`, `detail_image` + `detail_photo`
  (full-width closing photo; falls back to the feature photo).
- **services** — renovation packages: service name, heading, scope description, link label and URL,
  sort order, `image` + `photo`.
- **materials** — material palette: name, where it is used, sort order, `image` + `photo` swatch.
- **steps** — process steps: title, description, sort order, `image` + `photo`.
- **business** — one entry: studio name, site visit request email, phone, studio address, regions
  served (offered as suggestions in the location field).
- **pages** — static pages with Portable Text.

Every image renders the uploaded CMS image when present and otherwise the bundled `photo` path in
`public/images/`.

## Form

"Request site visit" validates in the browser, then opens the visitor's email app with a pre-filled
message to the studio's request email. Nothing is sent by the site itself, and the status message says
so. Without JavaScript the form falls back to a `mailto:` action and the email address is shown. The
hosted ZeroHostCMS native inquiry inbox is the intended production handler; it is not wired into this
standalone theme.

## Accessibility notes

Landmarks, a skip link, visible focus rings and `prefers-reduced-motion` are built in. Form control
borders use `#8f877f` (3:1 against the stone background) instead of the mockup's lighter `#cfcdc9`,
and small caption text uses `#6f6862` instead of the mockup's `#9c9896`.

## Images and external requests

All photographs in `public/images/` were cropped from the ZeroHostCMS design mockups for this theme.
Icons are inline SVG.

Fonts load from Google Fonts (`fonts.googleapis.com` and `fonts.gstatic.com`): Newsreader for display
type and Figtree for text. Remove the `<link>` in `src/layouts/Base.astro` to fall back to system fonts.

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
