This is **Forma**, an EmDash site (a CMS built on Astro with a full admin UI): an editorial portfolio
for design studios, agencies and independent creatives.

## Commands

```bash
npm run dev              # Start the Astro dev server
npm run typecheck        # astro check
npm run build            # Production build (Node adapter)
npx emdash seed seed/seed.json   # Apply the schema + sample content to ./data.db
npx emdash types         # Regenerate TypeScript types from a running site
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key files

| File | Purpose |
| --- | --- |
| `astro.config.mjs` | `emdash()` integration: SQLite, local storage, `formsPlugin()` |
| `src/live.config.ts` | EmDash loader registration (boilerplate — don't modify) |
| `seed/seed.json` | Schema (projects, services, pages, `discipline` taxonomy, menu) + synthetic content |
| `public/seed-media/` | Theme-bundled sample images referenced by the seed |
| `emdash-env.d.ts` | Generated collection types (regenerated on dev server start) |
| `src/layouts/Base.astro` | Header, mobile nav, footer and EmDash head/body wiring |
| `src/styles/global.css` | Design tokens (palette, fonts, spacing) and shared components |
| `src/components/` | `ProjectCard`, `PageHeader`, `FactList`, `InquiryCta`, `ArrowIcon` |
| `src/utils/content.ts` | Discipline helpers, reserved page slugs, link sanitising |
| `src/pages/` | Server-rendered routes |

## Rules

- All content pages are server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt, ... }`), not strings. Render them with `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID.
- When Astro's cache is enabled, pass query `cacheHint`s to `Astro.cache.set()`.
- The project taxonomy is named `discipline` (see `DISCIPLINE_TAXONOMY`); keep queries in sync with the seed.
- Editor-entered links (page `facts[].url`) go through `safeHref()` before rendering.
- The inquiry form is rendered with `<Form id="inquiry" />` from `@emdash-cms/plugin-forms/ui`. It renders nothing
  until a form with slug `inquiry` exists, so Contact always shows the email details next to it.

## Pages

| Page | Path | Source |
| --- | --- | --- |
| Home | `/` | page `home` (eyebrow, headline, lede, hero image, side words) + selected projects + services |
| Work | `/work`, `/work?discipline=<slug>` | `projects`, filtered by the `discipline` taxonomy, with empty states |
| Project detail | `/work/[slug]` | project facts, cover, brief / approach / outcome, gallery, inquiry CTA, next project |
| Services | `/services` | page `services` + `services` collection + process steps (`points`) |
| Studio | `/studio` | page `studio`: story, principles (`points`), details (`facts`) |
| Contact | `/contact` | page `contact` details (`facts`) + inquiry form |
| Other pages | `/[slug]` | any other `pages` entry; `/home` redirects to `/` |

## Visual character

Warm paper background, near-black ink, one orange accent (`--accent` for decoration, `--accent-strong`
for text and buttons so white text keeps AA contrast). Display type is Newsreader (serif, generous sizes,
tight tracking); body type is Manrope. Both are self-hosted via `@fontsource-variable/*` (OFL). Layouts are
editorial: big headlines, numbered sections, generous whitespace. Re-skin by overriding the custom
properties in `:root` of `src/styles/global.css`.

## What not to do

- Don't add awards, client logos, testimonials or measured business results to sample content.
- Don't load fonts from a CDN at runtime.
- Don't remove the visible contact details from `/contact`; the form is optional.
