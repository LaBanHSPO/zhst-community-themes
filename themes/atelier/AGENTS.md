This is an EmDash site -- a CMS built on Astro with a full admin UI.

## Commands

```bash
npm run dev              # Start the Astro dev server
npx emdash types      # Regenerate TypeScript types from a running site
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File                     | Purpose                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `astro.config.mjs`       | Astro config with `emdash()` integration, database, and storage                    |
| `src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)                           |
| `seed/seed.json`         | Schema definition + demo content (collections, fields, taxonomies, menus, widgets) |
| `emdash-env.d.ts`        | Generated types for collections (auto-regenerated on dev server start)             |
| `src/layouts/Base.astro` | Base layout with EmDash wiring (menus, footer, page contributions)                  |
| `src/pages/`             | Astro pages -- all server-rendered                                                 |

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. When you need to verify an API, hook, config option, field type, or pattern, call `search_docs` against the live documentation rather than relying on training-data recall. The docs reflect current behaviour; assumptions may not.


## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- When Astro's cache is enabled, pass content-query hints to `Astro.cache.set(cacheHint)`. Use the `WithCacheHint` variants for site settings, menus, taxonomies, and widget areas rendered by cached routes.
- Taxonomy names in queries must match the seed's `"name"` field exactly (here `"collection"`).

## This Template

Atelier — an editorial product catalog for ceramics, homeware and independent makers. Visitors
browse pieces, read material/care notes and maker stories, then follow an external purchase link
or send an inquiry. There is deliberately no cart, payment, fulfillment or inventory sync.

## Pages

| Page            | Path                 | What it shows                                              |
| --------------- | -------------------- | ---------------------------------------------------------- |
| Home            | `/`                  | Hero, featured pieces, collections, story teaser           |
| Collection      | `/collection`        | All products + collection filters                          |
| Collection term | `/collection/[slug]` | Products in one `collection` term                          |
| Product detail  | `/products/[slug]`   | Gallery, material, care, story, purchase link, inquiry     |
| Our story       | `/our-story`         | `pages/our-story` entry + `makers` collection               |
| Contact         | `/contact`           | `pages/contact` entry + studio details + inquiry form       |
| Page            | `/[slug]`            | Any other `pages` entry                                    |

## Schema

- `products`: `title`, `price` (display text), `summary`, `images` (repeater: `image`, `caption`),
  `material`, `care`, `story` (Portable Text), `maker`, `dimensions`, `purchase_url` (url),
  `featured` (boolean), `sort_order` (integer).
- `makers`: `name`, `role`, `portrait` (image), `story` (Portable Text), `sort_order`.
- `studio`: single entry with slug `studio` — home copy, header aside, contact details.
- `pages`: `title`, `lede`, `image`, `content`.
- Taxonomy `collection` (on `products`). Single `primary` menu.

## Conventions

- Design tokens live in `src/styles/theme.css`; fonts are self-hosted via `@fontsource` imports in
  `src/layouts/Base.astro`. Do not add CDN fonts.
- Shared helpers (studio fallbacks, gallery filtering, safe external URLs) are in `src/lib/catalog.ts`.
- The inquiry form is `<Form id="inquiry" />` from `@emdash-cms/plugin-forms/ui`, wrapped by
  `src/components/InquiryPanel.astro`. The form is created in the admin (Plugins → Forms, slug
  `inquiry`), never in the seed; keep the visible contact details next to it.
- Optional fields and images must render gracefully when empty.
