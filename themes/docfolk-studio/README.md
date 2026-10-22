# Docfolk Studio

**Your docs. Your brand. In a studio layout.**

Docfolk Studio is the [Docfolk](../docfolk/) documentation data model with a directory-style layout: a wide centered search, an icon navigation with soft accent highlights, overview cards, a tabbed Quick Start code panel, and a right rail with the page outline, language switcher, and AI resources. It is a standalone EmDash theme for ZeroHostCMS. The native CMS supplies content editing, drafts, revisions, and publication.

Public documentation and the landing page include a small “Powered by ZeroHost CMS” footer linking to [Docfolk Studio one-click deployment](https://zerohostcms.com/themes/docfolk-studio). The [theme credit component](src/components/theme-credit.astro) owns this link. It uses no tracking or client-side script.

## What is the same as Docfolk

- **Content model.** The `companies`, `doc_locales`, and `documents` collections and their fields are unchanged. A Docfolk installation's records work as-is.
- **Routes.** `/<company>/<lang>/<page>`, `.md`, `llms.txt`, `llms-full.txt`, `openapi.json`, `search.json`, and the root `/llms.txt` behave exactly as in Docfolk.
- **Rendering and safety.** [src/lib/](src/lib/) is unchanged: published-only reads, sanitized Markdown, escaped raw HTML, and server-rendered Mermaid as inert images.
- **Behaviour.** Scoped search (⌘K / Ctrl+K, arrow keys, Escape restores focus), copy page, copy integration prompt, light/dark toggle, and explicit translation fallback all keep Docfolk's accessibility fixes.

## What the studio layout adds

- **Brand accent.** The company's CMS accent drives the brand mark, active navigation, links, and buttons, with derived light and dark tints. The Orbit sample uses indigo `#3b4ce0`.
- **Overview pages.** Pages with the route key `overview` show category cards and a tabbed **Getting started** panel with the sandbox and production environment setup and AI resource commands. The panel has line numbers and a Copy button.
- **Products without an API.** The API version badge and the API environments panel appear only on pages that carry endpoint or OpenAPI metadata. The sandbox and production Quick Start tabs appear only when the company has at least one such page. Placeholder API fields on a guide-only product therefore stay hidden. Machine exports are unchanged.
- **Prose code.** Code blocks use dark panels with line numbers. Line numbers are CSS counters; copied text is the original source.
- **Landing page.** The root page has a **Search documentation** hero, a company directory, and a dark banner. Its search opens the default company's scoped search with the query (`/<company>/<lang>/overview?q=…`); the query is removed from the address after the search opens.
- **Mobile.** A hamburger menu shows a stacked navigation list with chevrons, the company selector, and language links.

The theme uses system fonts and original inline SVG artwork. There are no external font, image, analytics, or AI-provider requests. Browser storage holds only the light/dark preference.

## Run locally

Use the Node version range in [package.json](package.json). From this directory:

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

The development server listens on `http://127.0.0.1:4344`. Open `/_emdash/admin/`, complete native setup, and import the sample content. The portal starts at `/orbit/en/overview`. Astro 7 may detach its development server; stop it with `npx astro dev stop`.

For a disposable, local-only review, `http://127.0.0.1:4344/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin` creates a development administrator without a passkey. **Never expose the development server to a network or use that database in production.**

To load the starter seed without the admin wizard, stop the server first, then run `npx emdash seed seed/seed.json --database .local/emdash.db --on-conflict skip`.

[.env.example](.env.example) names the configuration. `SITE_URL` and `DOCS_DATA_DIR` are read when the Astro configuration is evaluated, so set them before building. Keep the database, media, session storage, and encryption key private and backed up.

```sh
npx astro dev stop
npm run typecheck
npm test
npm run seed:validate
npm run build
HOST=127.0.0.1 PORT=54387 npm start
```

## Edit in the CMS

Content editing is identical to Docfolk. Use **Companies** for product name, environments, API version, default language, and accent. Use **Documentation** for pages, including category, order, Markdown, and optional endpoint/OpenAPI metadata. Use **Documentation languages** for locale codes and interface strings. Publish to make content visible; drafts never appear in pages, search, Markdown, or AI exports. See the [Docfolk README](../docfolk/README.md) for translation, OpenAPI, and multi-company details.

The company selector is not an access-control boundary: every published company is public.

## Sample content

[seed/seed.json](seed/seed.json) documents the fictional **Orbit API** in English and Vietnamese. It is regenerated by `node scripts/content-source.mjs`. Do not reapply a seed with overwrite semantics to an edited database.

## Dependencies and license

Runtime versions and the lockfile are project-local. EmDash, Astro, React, beautiful-mermaid, marked, and sanitize-html retain their upstream licenses. Theme source follows the repository's [MIT license](../../LICENSE). Follow the repository [review and promotion boundary](../../CONTRIBUTING.md#maintainer-review-and-promotion) before production use.

Known limitation: a very light company accent can lower the contrast of accent-coloured text and button labels. Choose a mid-to-dark accent.
