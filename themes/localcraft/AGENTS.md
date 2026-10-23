This is an EmDash site (the Localcraft home-services theme) -- a CMS built on Astro with a full admin UI.

## Commands

```bash
npm run dev              # Start the Astro dev server (Astro 7 runs it as a background daemon; stop with `npx astro dev stop`)
npm run typecheck        # astro check
npm run build            # Production build (Node adapter)
npx emdash seed seed/seed.json   # Apply schema + sample content to ./data.db
npx emdash types         # Regenerate TypeScript types from a running site
```

The admin UI is at `http://localhost:4321/_emdash/admin` (or the port you pass with `--port`).

## Key Files

| File                                | Purpose                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `astro.config.mjs`                  | `emdash()` integration with SQLite, local storage and the forms plugin             |
| `src/live.config.ts`                | EmDash loader registration (boilerplate -- don't modify)                           |
| `seed/seed.json`                    | Schema + synthetic sample content (collections, `area` taxonomy, menu)             |
| `emdash-env.d.ts`                   | Generated collection types (auto-regenerated on dev server start)                  |
| `src/layouts/Base.astro`            | Header (nav, call link, quote button), footer, mobile quick-contact bar            |
| `src/styles/theme.css`              | Design tokens (navy / warm white / yellow), buttons, cards, form theming            |
| `src/utils/business.ts`             | Loads the `business/details` entry; builds safe `tel:` / `mailto:` hrefs            |
| `src/utils/content.ts`              | Ordered collection loading with empty-list fallback                                |
| `src/components/InquiryPanel.astro` | Forms-plugin `<Form id="inquiry">` slot plus always-visible phone/email            |
| `public/media/`                     | Seed images (crops of the Localcraft concept art), referenced by seed image fields |

## Rules

- All content pages are server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Render them with `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- When Astro's cache is enabled, pass content-query hints to `Astro.cache.set(cacheHint)`.
- Taxonomy names in queries must match the seed's `"name"` field exactly: the only taxonomy is `area`.
- Service-area slugs: an `areas` entry and its `area` taxonomy term share the same slug. Services are linked
  to areas by assigning `area` terms; the areas page lists the services tagged with each term.
- Copy must not imply confirmed bookings, availability checks, fixed prices or technician dispatch. Quote and
  callback requests are enquiries.

## Schema

- `pages`: `title`, `content` (Portable Text). `about` and `contact` entries feed `/about` and `/contact`.
- `business` (single entry, slug `details`): phone, email, base, hours, response note, home hero copy/image,
  footer lines.
- `services`: `title`, `summary`, `icon` (select: hammer/pipe/roller/saw/tile/wrench), `featured_image`,
  `content`, `included` / `not_included` (one item per line), `typical_job`, `order`; taxonomy `area`.
- `areas`: `title`, `summary`, `notes`, `order`.
- `team`: `title` (name), `role`, `photo` (optional; initials shown when missing), `bio`, `order`.
- `gallery`: `title`, `image`, `caption`, `order`.

## Pages

| Page           | Path               |
| -------------- | ------------------ |
| Home           | `/`                |
| Services       | `/services`        |
| Service detail | `/services/[slug]` |
| Service areas  | `/areas`           |
| About          | `/about`           |
| Contact        | `/contact`         |
| Other pages    | `/[slug]`          |

## Inquiry form

The form is not in the seed. Create it in the admin (Plugins → Forms) with slug `inquiry`; see README.md.
`<Form>` renders nothing when the form does not exist, so `InquiryPanel` always shows phone/email and a
fallback note.

## Documentation

EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. Verify APIs there rather than
relying on recall.
