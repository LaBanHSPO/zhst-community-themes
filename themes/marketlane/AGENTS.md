This is an EmDash site -- a CMS built on Astro with a full admin UI. Theme: **Marketlane**, a
campaign-led fashion and lifestyle storefront with product options and inquiries. There is no
cart, checkout, payment or inventory integration; do not add UI that implies one.

## Commands

```bash
npm run dev              # Start the Astro dev server
npm run typecheck        # astro check
npm run build            # production build (Node adapter)
npx emdash seed seed/seed.json   # apply schema + sample content to ./data.db
npx emdash types         # Regenerate TypeScript types from a running site
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

## Key Files

| File                               | Purpose                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `astro.config.mjs`                 | `emdash()` integration, SQLite, local storage, forms plugin             |
| `src/live.config.ts`               | EmDash loader registration (boilerplate -- don't modify)                |
| `seed/seed.json`                   | Schema + sample content (products, campaigns, size charts, contacts)    |
| `emdash-env.d.ts`                  | Generated collection types (regenerated on dev server start)            |
| `src/layouts/Base.astro`           | Header/nav/search/footer, EmDash head/body wiring                       |
| `src/lib/catalog.ts`               | Filter parsing/validation, product queries, colour/size normalisation   |
| `src/components/ProductListing.astro` | GET-form filters (category, department, price, new, sort) + grid     |
| `src/pages/`                       | Server-rendered routes                                                  |
| `public/images/`                   | Sample media derived from the theme's concept cover (see README)        |

## Rules

- All content pages are server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Render with `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID.
- Taxonomy names in queries must match the seed exactly: `category`, `department`, `collection`.
- A product joins a campaign (`campaigns` collection) through the `collection` taxonomy term whose slug equals the campaign slug.
- `where` values are strings (EmDash `WhereValue`); numbers/booleans are passed as strings and compared by the database against the column type.
- The "Ask about this item" CTA submits a GET form to `/contact?product=&color=&size=`. Keep it an inquiry; never label it as buying or adding to a bag.
- The inquiry form comes from `@emdash-cms/plugin-forms` (`<Form id="inquiry" />`) and renders nothing until a form with slug `inquiry` exists. Contact details and a mailto fallback must stay visible.

## Pages

| Page           | Path                    | What it shows                                                        |
| -------------- | ----------------------- | -------------------------------------------------------------------- |
| Home           | `/`                     | Lead campaign hero, favorites, collections, new arrivals, categories |
| Collections    | `/collections`          | All campaigns with piece counts                                      |
| Collection     | `/collections/[slug]`   | Campaign hero + story + filterable products (`?category=&min=&max=`) |
| Category       | `/category`             | All products, filters `?category=&department=&min=&max=&new=&sort=`  |
| Category       | `/category/[slug]`      | One category, filters `?department=&min=&max=&sort=`                 |
| Product detail | `/products/[slug]`      | Gallery, colour + size radio groups, inquiry CTA                     |
| Size guide     | `/size-guide`           | `size-guide` page intro + `size_charts` tables                       |
| Contact        | `/contact`              | Selection summary, inquiry form, contact details                     |
| Page           | `/[slug]`               | Static pages (e.g. `/about`)                                         |

## Documentation

EmDash docs are available as an MCP server at `https://docs.emdashcms.com/mcp`. Verify APIs there
rather than relying on recall.
