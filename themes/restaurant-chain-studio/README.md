# Restaurant Chain Studio

Restaurant Chain Studio is the [Restaurant Chain](../restaurant-chain/) theme with a studio presentation: a charcoal sidebar landing page with a table-plan illustration, the guest ordering flow and the menu capabilities, and a phone-first guest table menu with red category pills, dish rows with a round add button, and a full-width **Đặt món tại bàn** bar. It hosts the same [restaurant chain plugin](../../../zhst-community-plugins/plugins/restaurant-chain/README.md). Guests order through `/order/<table-token>`; staff uses `/_emdash/admin/plugins/restaurant-chain/workspace`. The host runs on Cloudflare Workers with D1, Queues, scheduled recovery, and R2. Internet access is required.

## What is the same as Restaurant Chain

- **Data and behaviour.** The plugin, its migrations, `src/worker.ts`, the API routes (`/api/restaurant/[action]`, `/api/sepay/[context]`), bindings, secrets, configure and deploy scripts are unchanged. A Restaurant Chain installation's data works as-is.
- **Guest logic.** Joining a visit, the basket, price-change refusal, sold-out items, call waiter and request bill, offline notice and polling are the same code; only markup and styles changed.
- **Staff workspace.** The workspace is rendered by the plugin and keeps the plugin's own design.

## What the studio presentation changes

- **Landing page.** Dark sidebar with section links, a labelled table-plan illustration (no live data), the four-step order flow, menu capabilities and a guest QR/NFC card. Mobile stacks the panels and turns the sidebar into a scrolling link row.
- **Guest menu.** Segmented Menu / Basket / Status tabs, search, category pills, dish rows with a placeholder mark when a dish has no image, size/topping chips, and a sticky order bar. Two-column dish grid on desktop.
- **Not-found pages.** A branded 404 page, also used (with HTTP 404) for malformed table links.

The theme uses system fonts and inline SVG. It bundles no photography and makes no font, image or analytics requests. It is light only.

## Run locally

Use Node 24.15 or later in the 24.x line, or Node 26 or later. Clone the public plugin and theme repositories as siblings, install and build the restaurant plugin using its README, then run these commands from this theme directory.

```sh
npm ci
cp .env.example .env
node -p "require('node:crypto').randomBytes(32).toString('hex')"
```

Put the generated value in `.env` as `EMDASH_ENCRYPTION_KEY`. Keep `SEPAY_CONTEXTS={}` until configuring an authorized provider environment. `.env` is ignored by Git. Do not create `.dev.vars`, which takes precedence over `.env` in Wrangler.

Generate binding types, apply the restaurant migration to local D1, and start the host.

```sh
npm run types
npm run migrate:local
npm run dev
```

Open `http://localhost:4366/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin/plugins/restaurant-chain/workspace` for a local administrator. This development-only endpoint initializes the separate CMS database and establishes a session. It is not available in a production build. Follow the plugin's [branch setup and operating guide](../../../zhst-community-plugins/plugins/restaurant-chain/README.md#configure-a-branch) to create synthetic branch, table, and menu data.

Astro's development command runs a background server. Use `npx astro dev logs` for diagnostics and `npx astro dev stop` to stop it. Local D1/Queue state lives under `.wrangler/`; neither local UUIDs nor local resource names are production resources.

Run the host checks after rebuilding a changed plugin.

```sh
npm run typecheck
npm run build
```

`npm run preview` runs the compiled local Worker through Wrangler on port 4366, sharing the migrated `.wrangler/state` directory. Stop the development server first. For an empty local CMS database, use the normal setup flow: the development bypass is disabled in compiled builds. Keep the origin/port consistent with the built configuration when testing mutations.

## Bindings and secrets

The committed `wrangler.local.jsonc` declares restaurant bindings. The Astro adapter adds its `SESSION` binding to the built configuration.

| Binding | Purpose |
| --- | --- |
| `DB` | EmDash CMS, users, authentication, and native-plugin metadata |
| `RESTAURANT_DB` | Restaurant schema, visits, orders, payments, invoices, inbox, outbox, and audit |
| `MEDIA` | R2 media storage |
| `RESTAURANT_JOBS` | Queue producer and consumer; messages carry persisted job IDs |
| `SESSION` | Astro adapter's KV session binding; separate from EmDash's D1 authentication |

The custom `src/worker.ts` preserves EmDash's fetch/scheduled handlers and adds restaurant Queue consumption and scheduled recovery. The one-minute schedule recovers leases and republishes due work; it is required even when normal Queue delivery works.

`EMDASH_ENCRYPTION_KEY` and `SEPAY_CONTEXTS` are runtime secrets. The latter is a JSON object keyed by the credential-context identifiers configured on branches. Each entry contains:

- `environment`: `sandbox` or `live`, matching the branch.
- `webhook`: `{ "mode": "hmac", "secret": "..." }`, or explicitly configured `apikey` mode. Use the same mode/key in the SePay webhook settings. There is no automatic downgrade.
- `invoice`: `{ "clientId": "...", "clientSecret": "..." }` when electronic invoicing is enabled for that context.
- `bankApiToken`: optional SePay API-v2 Bearer token for reconciliation.

The ellipses above denote operator-supplied secrets, not usable credentials. Keep secrets out of branch forms, source control, screenshots, and chat. For deployed Workers, set each secret through Wrangler or the Cloudflare dashboard after selecting the approved configuration. The server reads secret values at runtime; they are not public Vite variables.

Set the SePay webhook URL to `https://<approved-host>/api/sepay/<context-id>`, choose JSON, and enable retries. The endpoint authenticates raw bytes, persists receipt plus processing intent, and returns `200 {"success":true}`. It does not use the browser CSRF header. Browser commands at `/api/restaurant/[action]` require same-origin `Origin` and `X-EmDash-Request: 1`.

SePay remains an external payment/invoice provider. Its QR image service is also external; internet availability and correct bank configuration are required. Table-ordering QR PNGs are generated locally in the browser.

## Guest table surface

`/order/<table-token>` shows the branch menu, a basket with size/topping options and a
note, and a live status view. From the status view a guest can **Gọi nhân viên** (call a
waiter) or **Yêu cầu tính tiền** (request the bill); each request is deduplicated per
visit and surfaced to floor staff, who mark it handled. If a menu price changes after the
guest started choosing, the submission is refused and the basket is refreshed with the
new prices for the guest to confirm, so nobody is charged a price they did not see. When
the browser loses
connectivity the table surface shows a notice that unsent actions are retried once the
connection returns. A dish the kitchen marks sold out is shown faded with a **Hết món**
badge, its price struck through, and cannot be added to the basket.

## Prepare an approved deployment

Deployment is an operator action, not a consequence of installing this template. Obtain ZeroHostCMS promotion approval and reconcile the host's pinned EmDash 1.2.0/Astro 7 baseline with the target platform. Provision isolated Cloudflare resources and confirm the actual SePay bank/provider configuration before production use.

Set these environment variables to the approved resources before running `npm run configure`.

| Variable | Required value |
| --- | --- |
| `WORKER_NAME` | Reviewed Worker name |
| `SITE_ORIGIN` | Exact HTTPS origin, without a path or trailing slash |
| `CMS_DATABASE_ID` | Provisioned CMS D1 UUID |
| `RESTAURANT_DATABASE_ID` | Different provisioned restaurant D1 UUID |
| `MEDIA_BUCKET` | Provisioned R2 bucket name |
| `JOBS_QUEUE` | Provisioned application queue name |
| `JOBS_DLQ` | Different provisioned dead-letter queue name |

The configuration command writes ignored `wrangler.production.json` and refuses to overwrite an existing mapping. It creates no resources and performs no deployment. Database display names follow `<WORKER_NAME>-cms` and `<WORKER_NAME>-domain`; database IDs are authoritative. Review the resulting custom domain, bindings, schedule, queue consumer, and resource ownership.

After backing up existing resources and approving the migration, apply `RESTAURANT_DB` migrations using the production configuration and Wrangler's explicit `--remote` mode. Configure runtime secrets against the same Worker. Do not run restaurant migrations on `DB`. Build the approved artifact with the following command.

```sh
npm run build:production
```

Inspect `dist/server/wrangler.json`, including the adapter-added `SESSION` KV namespace. Assign an approved namespace in the production configuration or explicitly approve Wrangler's provisioning before deployment. `npm run deploy` refuses a local build and also requires `RESTAURANT_DEPLOY_APPROVED` to equal the reviewed Worker name. Set that gate only after migration, secret, backup, and promotion review. This guard does not replace Cloudflare access controls or an authorized release process.

After deployment, verify HTTPS, branch permissions, table ordering, actual Queue consumption, scheduled recovery, and authorized provider conformance. Verify SePay eligibility, legal seller/template/series/location mappings, file retrieval, and tax-authority states before accepting real customers. Run an expected-peak load test before rolling out to approximately 50 branches; that capacity has not been benchmarked here.

## Operations and evidence

The plugin guide owns [payment/invoice recovery and backup/restore procedures](../../../zhst-community-plugins/plugins/restaurant-chain/README.md#recover-and-preserve-data). Preserve old credential contexts while historical transactions need them. Do not turn ambiguous provider outcomes into automatic retries.

Local verification covers the development host and compiled Cloudflare Worker, two branch accounts, ordering through cashier collection, authenticated synthetic webhook delivery through the Queue consumer, invoice-intent persistence, CSV output, and Vietnamese/Arabic guest/staff layouts. Compiled builds reject both development auth bypasses. Controlled-provider tests cover draft/issue tracking, corrections, files, and ambiguous outcomes. No real bank transfer, live tax invoice, deployment, or 50-branch capacity claim is included.

## License and assets

[MIT](LICENSE). The template uses public EmDash, Astro, Cloudflare, React, Kumo, and Lingui packages. Preserve their notices and dependency licenses. The guest interface uses system fonts and contains no bundled restaurant photography or customer content. EmDash's admin supplies its own font assets and licenses. Operator-uploaded media requires separate redistribution rights.
