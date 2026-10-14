# Docfolk

**Your docs. Your brand.**

Open-source documentation for software teams and indie makers.

Build a professional documentation site for your product. Customize its appearance, publish under your own domain, and help customers understand your software and integrate with your APIs.

Docfolk is an open-source, customizable documentation platform for software teams and indie makers. Publish product guides and API documentation under your own brand and domain. It is a standalone EmDash theme for ZeroHostCMS: the native CMS already supplies content editing, drafts, revisions, and publication, so a separate plugin would duplicate those capabilities.

## Documentation that fits your product

Bring product guides, API references, and visual workflows together in one place. Give your customers a clear path from getting started to completing an integration.

- **Make it yours.** Customize the logo, colors, navigation, and appearance to match your product.
- **Publish on your domain.** Give customers a documentation site that feels like part of your business.
- **Explain with diagrams.** Make workflows and integrations easier to understand with Mermaid diagrams.
- **Reach more customers.** Provide documentation in English, Khmer, Vietnamese, Lao, and Burmese, with room for more languages.
- **Keep content current.** Manage and update documentation from the ZeroHostCMS admin.
- **Support AI-assisted integration.** Publish clear, structured documentation for developers working with Claude, Codex, and Cursor.

## Start free on ZeroHostCMS

Docfolk is open source. Deploy on ZeroHostCMS for free.

## Docfolk AI — planned add-on

Extend your documentation with an optional paid AI assistant. Help customers find answers and understand integrations using your product documentation. Docfolk AI will be offered separately from the open-source documentation platform.

## Tài liệu của bạn. Thương hiệu của bạn.

Nền tảng tài liệu mã nguồn mở dành cho doanh nghiệp phần mềm và indie maker.

Tạo website tài liệu chuyên nghiệp cho sản phẩm của bạn. Tùy biến giao diện, sử dụng tên miền riêng và giúp khách hàng dễ dàng tìm hiểu phần mềm, sử dụng tính năng và tích hợp API.

**Một nơi cho toàn bộ tài liệu sản phẩm.** Kết hợp hướng dẫn sử dụng, tài liệu API và sơ đồ nghiệp vụ trong một website rõ ràng, dễ tra cứu.

- Tùy biến logo, màu sắc, điều hướng và giao diện theo thương hiệu.
- Xuất bản tài liệu trên tên miền riêng.
- Minh họa quy trình và luồng tích hợp bằng sơ đồ Mermaid.
- Hỗ trợ tiếng Anh, Khmer, Việt, Lào và Myanmar; có thể bổ sung ngôn ngữ sau.
- Quản lý và cập nhật nội dung từ trang quản trị ZeroHostCMS.
- Cung cấp tài liệu có cấu trúc để lập trình viên sử dụng cùng Claude, Codex và Cursor.

**Docfolk AI — phần mở rộng dự kiến.** Bổ sung trợ lý AI trả phí để giúp khách hàng tìm câu trả lời và hiểu cách tích hợp dựa trên tài liệu sản phẩm của bạn. Docfolk AI được cung cấp riêng với nền tảng tài liệu mã nguồn mở.

> **Cách dùng thương hiệu:** **Docfolk** xuất hiện trên trang giới thiệu và bộ theme/plugin. Website docs được triển khai có thể mang tên **[Tên sản phẩm] Docs**, logo và tên miền của khách hàng. Nội dung tính năng ở trên dùng cho bản ra mắt khi các chức năng tương ứng đã hoàn thành; phần AI đã được ghi rõ là dự kiến.

## Run locally

Use the Node version range in [package.json](package.json). From this directory:

```sh
npm ci
npx emdash secrets generate --write .env
npm run dev
```

Open `http://127.0.0.1:4340/_emdash/admin/`, complete native setup, and select sample content to import the guided tour. The public portal starts at `/orbit/en/overview`. Astro 7 may detach its development server; use `npx astro dev stop` to stop it.

For a disposable, local-only review, EmDash also provides `http://127.0.0.1:4340/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin`. This creates a development administrator without a passkey. **Never expose the development server to a network or use this database as a production installation.** The upstream helper is disabled in a production build.

[.env.example](.env.example) names the configuration. `SITE_URL` and `DOCS_DATA_DIR` are read from environment variables or `.env` when the Astro configuration is evaluated. Set them before building. The data path is captured at build time: build for the intended persistent filesystem location. Keep the database, media, session storage, and encryption key private and backed up.

For a local built-server check:

```sh
npx astro dev stop
npm run typecheck
npm test
npm run build
HOST=127.0.0.1 PORT=54387 npm start
```

Stop development before rebuilding or regenerating the seed, and restart it before CMS editing. During review, the upstream development runtime retained a closed Vite module runner after reloads; restarting cleared the failure. The built Node server does not use Vite's development module runner.

`npm start` loads `.env` when present; an injected production environment also works. Initial production setup must use a real administrator and supported authentication over HTTPS. Reverse-proxy configuration, hosting promotion, Cloudflare compatibility, and deployment are not included or implied by the Node build.

## Edit in the CMS

The content model is declared in [seed/seed.json](seed/seed.json). Open these native admin collections:

- **Companies:** product name, description, API environments, API version, default documentation language, and the brand marker's accent color. The company's native slug is its URL key.
- **Documentation:** page title, description, company slug, document language, shared route key, navigation category/order, Markdown content, and optional endpoint/OpenAPI metadata. The native slug must be globally unique; use `company-language-page`.
- **Documentation languages:** native language label, URL language code, API `Accept-Language` value, and interface strings.

Save a draft to review it in the CMS; publish to make it visible to readers. The portal intentionally stays on the published revision even in an editor's session. Drafts do not belong in search, Markdown exports, or AI context. Native visual editing/preview is not used for this Markdown theme.

Use Markdown tables and fenced `mermaid` blocks in **Markdown content**. [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) renders supported diagrams on the server. Readers get inert SVG images, horizontally scrollable diagrams where needed, and copyable Mermaid source. Raw HTML is escaped and Markdown is sanitized; invalid diagrams show a source-review message instead of breaking the page. Standard Mermaid features outside this renderer's supported syntax must be adapted.

Leave a blank line before and after each Markdown table; otherwise a following paragraph can be parsed as another table row.

The **Self-contained OpenAPI operation** JSON field owns the machine contract; the Markdown field owns its human explanation. Update both when an endpoint changes. Supply a unique `operationId`, parameters, request body when applicable, and responses. Use inline schemas rather than unresolved external `$ref` values. A webhook operation uses `x-webhook-name` and no provider API path. [src/lib/model.ts](src/lib/model.ts) owns export assembly and authentication schemes.

### Add a product (company)

1. Create and publish its Company record with a stable slug and correct environment URLs.
2. Create its documentation records, setting **Company slug** to that slug. Start with the shared route key `overview` in the company's default language.
3. Publish the pages; the company appears in the switcher without a rebuild.

The company selector is **not an access-control boundary**. Every published company is public. Administration is centralized; this theme does not provide private customer login, company-specific editor permissions, or secret storage. Never publish private credentials, contracts, personal data, or confidential examples. Use separate installations or a separately designed authorization system if those requirements change.

### Languages and translations

English and Vietnamese sample content are seeded. English, Khmer, Vietnamese, Lao, and Burmese interface strings are provided in [src/content/locales.mjs](src/content/locales.mjs). Khmer/Lao/Burmese pages show a visible fallback notice until their content translations are published. Native-speaker and technical review are required before releasing translated material to customers.

To translate a page, create another Documentation record with the same **Company slug** and **Shared translation route key**, but a different **Document language**. Keep each company/key/language tuple unique. A prose-only translation inherits missing endpoint/OpenAPI metadata from the company's default-language page, then English. Do not duplicate a record in the same language; ambiguity is rejected instead of selecting an arbitrary contract.

The documentation language is an explicit custom field. Leave the CMS's separate native content locale at `en` for these collections. To add another public locale, publish a Documentation languages record using a valid BCP 47 code and matching interface strings, then publish translations. No code change or rebuild is required. Missing UI strings fall back to English.

The sample API uses a single `Authorization: Bearer` token per environment, which the theme documents across its pages and OpenAPI export.

Other customers can declare their operation's OpenAPI `security` explicitly. Put any required scheme definitions in the same operation's `x-security-schemes` object; the exporter moves them into `components.securitySchemes`. Repeated definitions must agree. An explicit `security: []` remains public. Without an explicit declaration, the Orbit bearer-token and inbound webhook defaults remain unchanged.

## Human and AI resources

Each published company/language namespace provides:

- `/<company>/<locale>/<page>` — human documentation.
- `/<company>/<locale>/<page>.md` — page Markdown, including diagram source.
- `/<company>/<locale>/llms.txt` — scoped discovery index.
- `/<company>/<locale>/llms-full.txt` — complete resolved documentation.
- `/<company>/<locale>/openapi.json` — OpenAPI 3.1, including status webhooks.
- `/<company>/<locale>/search.json` — scoped published search content.

`/llms.txt` discovers public companies and languages. The page's **Copy prompt** action gives Claude, Codex, or Cursor these URLs and instructs the assistant to preserve documented constraints and keep secrets out of prompts. This is a provider-neutral documentation interface, not an embedded chatbot or an MCP server. Tools need access to the deployed URL; remote AI services cannot fetch a developer's localhost.

Machine resources are public, permit cross-origin reading, and are served without response caching so publication changes are immediately eligible for retrieval. They never proxy or execute provider requests.

## Sample content, ownership, and maintenance

The checked-in seed documents a **fictional Orbit API** to demonstrate a real portal: product introduction, authentication, webhooks, three API-reference pages, and resource pages. Names, identifiers, URLs, and responses are synthetic examples published with Docfolk; they are not a contract for any live service, and no live API requests are made.

[Source content modules](src/content/) and [scripts/content-source.mjs](scripts/content-source.mjs) maintain the checked-in starter seed. Regenerate it with `node scripts/content-source.mjs`, then validate using `npm run seed:validate`. This does not change an installed CMS. Do not reapply a seed with overwrite semantics to a customer's edited database; live model changes belong in native Content Types and an explicit migration process.

[src/lib/data.ts](src/lib/data.ts) owns published-only CMS reads; [src/lib/render.ts](src/lib/render.ts) owns safe rendering; [DocsLayout.astro](src/layouts/DocsLayout.astro) and [docs.css](src/styles/docs.css) own the interface. [tests/documentation.test.ts](tests/documentation.test.ts) covers company/language resolution, metadata inheritance, ambiguous contracts, authentication semantics, and content safety.

Switching themes retains the CMS records. Removing this theme does not delete companies or documents. Back up the data directory and encryption key before upgrades or removal. This theme does not migrate any existing installation.

## Customer logistics content — Cambodia

The customer's logistics guide is preserved separately in [seed/cambodia.json](seed/cambodia.json). It contains the complete recovered English/Vietnamese adaptation of `Api_integration_guide_v2_Cambodia.docx`: 28 documents covering the 13 original sections plus AI integration guidance, ten API endpoints, status webhooks, and Mermaid diagrams. Personal examples remain sanitized. Source-contract ambiguities remain documented rather than invented.

Open `/cambodia/en/overview` or `/cambodia/vi/overview`; edit the **Metfone Express** company and its **Documentation** records in the CMS. The restored live content remains CMS-managed. Khmer, Lao, and Burmese interfaces use the explicit English content fallback until their translations are published.

**Customer documentation is not disposable demo content.** Do not remove or replace this seed, its CMS records, or customer databases during branding changes, theme renames, or Orbit demo cleanup. Obtain the owner's approval before deleting customer content. `scripts/content-source.mjs` owns only `seed/seed.json`, not `seed/cambodia.json`.

To validate or recover the customer guide into a fresh installation, first back up the target database and encryption key, stop its server, then run from this directory:

```sh
npx emdash seed seed/cambodia.json --validate
npx emdash seed seed/cambodia.json --database .local/emdash.db --on-conflict skip
```

The default conflict policy above preserves existing records; it does not refresh an already edited record. Do not use `--on-conflict update` against customer edits. After recovery, restart the server and inspect the Cambodia collection and published routes.

The logistics contract explicitly requires **both** `X-Api-Token` and `X-Client-Source` in one OpenAPI security requirement; it does not use Orbit's bearer authentication. The recovered seed carries its own scheme declarations, while the separate Orbit demo remains unchanged.

Before this recovery, the live database and current theme source were backed up under the ignored `.local/recovery/` directory. Keep these local backups private; do not commit databases, session data, or encryption keys. Future CMS edits remain authoritative and require fresh backups—the checked-in seed is a recovery snapshot, not automatic database synchronization.

## Dependencies and review boundary

Runtime versions and lockfile are project-local. EmDash, Astro, React, beautiful-mermaid, marked, and sanitize-html retain their upstream licenses; theme source follows the repository's [MIT license](../../LICENSE). The favicon and line icons are original local SVG, and the public theme uses system fonts with Southeast Asian fallbacks. There are no analytics, external font requests, AI-provider calls, or provider calls in the public theme. Browser storage holds only the light/dark preference; CMS session storage is owned by EmDash.

Local verification targets Node and SQLite. The upstream bundled admin currently produces a Vite chunk-size warning; it has not been suppressed. Community source acceptance is not hosting publication. Follow the repository [review and promotion boundary](../../CONTRIBUTING.md#maintainer-review-and-promotion) for an isolated ZeroHostCMS evaluation before production use.

## Verification performed

- Seed validation, Astro checks (zero errors/warnings/hints), nine behavior tests, and the standalone Node build passed on Node 24.21.0.
- The regenerated seed contains one sample product (Orbit), five interface locales, and sixteen documents (eight pages in English and Vietnamese), exercising guides, API reference with OpenAPI 3.1, webhooks, Mermaid diagrams, and AI discovery resources.
- The separate Cambodia customer seed was imported into an empty SQLite database successfully: three collections, 22 fields, and 34 content records (one company, five locales, 28 documents).

Customer-recovery checks matched all 28 public Markdown pages against the original content snapshot, rendered eight diagram instances, and confirmed all 16 Orbit records were unchanged. Live provider requests, production passkey enrollment, and hosting deployment were not tested.

### Browser review — 14 October 2026

The local Cambodia portal was exercised at desktop and 390px mobile widths. Search result navigation, the empty-search state, Escape focus restoration, Vietnamese page switching, and the explicit Khmer-to-English content fallback were observed. The mobile search trigger lost its accessible name when its visible label was hidden; [DocsLayout.astro](src/layouts/DocsLayout.astro) now retains the localized label, verified as “Search” and “Tìm kiếm” in the browser accessibility tree.

The review also repaired missing English endpoint-metadata fallback when a non-English default translation has only prose; its regression failed before the change and passed afterward. Namespace-root URLs now redirect to the overview so relative documentation links retain their company/language scope, verified by opening the authentication page from `/orbit/en`. The Orbit starter's Vietnamese API value is now `vi`, matching its OpenAPI contract; the separate Cambodia seed and installed CMS values were not changed. Ten behavior tests, Astro checks (zero errors/warnings/hints), and starter-seed validation passed after these fixes. No new production build was performed.

This is local UI evidence, not a production release. The production directory did not list Docfolk during this review, and access to the owner's signed-in Chrome session was blocked by an unconnected browser relay. No customer content, database, production Worker, or domain was changed.

The hosting adapter also compiles browser scripts alongside Cloudflare Worker declarations. Language selectors now narrow real `HTMLSelectElement` nodes at runtime, and DOM insertion uses `appendChild`/`insertBefore` to avoid the Worker's unrelated HTML-rewriter `Element` overloads. This retains the same search and code-toolbar behavior without casting away type errors.
