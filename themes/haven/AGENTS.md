This is an EmDash site -- a CMS built on Astro with a full admin UI. It is the **Haven** real-estate
theme: property listings, search, agent profiles and viewing inquiries.

## Commands

```bash
npm run dev              # Start the Astro dev server
npm run typecheck        # astro check
npm run build            # Production build (Node adapter)
npx emdash types         # Regenerate TypeScript types from a running site
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File | Purpose |
| --- | --- |
| `astro.config.mjs` | Astro config with `emdash()` (SQLite, local storage) and the Forms plugin |
| `src/live.config.ts` | EmDash loader registration (boilerplate -- don't modify) |
| `seed/seed.json` | Schema + sample content: `properties`, `agents`, `pages`, `primary` menu |
| `emdash-env.d.ts` | Generated collection types (regenerated on dev server start) |
| `src/layouts/Base.astro` | Header (menu, "Get in touch"), footer, fonts, EmDash head/body wiring |
| `src/styles/theme.css` | Palette, type, buttons, shared layout and Forms plugin styling |
| `src/utils/listing.ts` | Listing/property-type labels, budget bands, search parsing, price formatting |
| `src/utils/queries.ts` | Shared listing query limit and location list |
| `src/components/` | `SearchForm`, `PropertyCard`, `AgentCard`, `InquiryPanel`, `Icon` |
| `src/pages/` | `index`, `properties/index`, `properties/[slug]`, `search`, `agents/[slug]`, `contact`, `[slug]`, `404` |
| `public/images/haven/` | Seed photos (crops of the Haven concept art) |

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID.
- When Astro's cache is enabled, pass content-query hints to `Astro.cache.set(cacheHint)`.
- `listing_type` / `property_type` select options in the seed must match `src/utils/listing.ts`.
- A property's `agent` field holds an agent **slug**.
- The inquiry form is created in the admin (Plugins → Forms, slug `inquiry`); `<Form id="inquiry" />`
  renders nothing until it exists, so always keep visible contact details beside it.
- Viewing requests are inquiries, not confirmed appointments. Do not add booking, payment, CRM,
  IDX/MLS or live map features without an explicit scope change.

## Documentation

The EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. Verify APIs
there rather than relying on recall.
