# Local Red Cross — project context

A public EmDash site (Astro, server-rendered) for a local Red Cross chapter. Vietnamese UI, red humanitarian identity.

## Commands

```bash
npm run dev            # Astro dev server (admin at /_emdash/admin)
npm run build          # astro build
npm run preview        # preview the built site
npm run typecheck      # astro check
npx emdash types       # regenerate types from a running site
```

## Key files

| File | Purpose |
| --- | --- |
| `astro.config.mjs` | EmDash integration, SQLite + local storage, registers the `redcross-chapter` plugin |
| `seed/seed.json` | Collections (`posts`, `pages`), taxonomies, menu, settings, sample content |
| `emdash-env.d.ts` | Generated collection types |
| `src/layouts/Base.astro` | Site header/nav/footer + EmDash head/body helpers + icon sprite |
| `src/styles/theme.css` | Design system ported from the approved prototype |
| `src/utils/chapter-api.ts` | Server-side reads of the plugin's public fund/document routes |
| `src/utils/leadership.ts` | Static leadership data (org chart is not CMS-managed) |
| `src/components/` | `FundSummary`, `Leadership` |

## Rules

- Content pages are server-rendered (`output: "server"`); no `getStaticPaths()` for CMS content.
- `entry.id` is the slug; `entry.data.id` is the ULID.
- Image fields are objects (`{ src, alt }`).
- Fund/document public pages read `/_emdash/api/plugins/redcross-chapter/public-*` and must tolerate `null` (plugin absent).
- Keep the org chart and contact details static or clearly marked as placeholders — they are not CMS content.
- Do not edit generated files (`emdash-env.d.ts`, `.astro/`). Additions to the schema flow from `seed/seed.json`.
- Match the prototype's visual language; keep `theme.css` tokens as the single source of styling.
