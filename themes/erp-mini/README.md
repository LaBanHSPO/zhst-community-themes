# ERP mini standalone EmDash theme

A runnable Astro/EmDash host for the community CRM and sales plugin, with optional Node-only internal VND bookkeeping. The public page opens the private workspace; it never queries business records. EmDash owns authentication, users, admin navigation and CRM/sales storage. The companion [ERP plugin handbook](https://github.com/ZeroHostCMS/zhst-community-plugins/tree/main/plugins/erp-mini) owns business behavior, API rules and ERPNext adaptation.

This is an independently deployed application template, **not** an already-approved ZeroHostCMS website-catalog option. Community acceptance is not a production deployment.

## Prerequisites and clean setup

Use Git, Node satisfying the [`package.json`](package.json) engines (**24.15+ in the 24.x line, or 26+**) and npm. Baseline dependencies are pinned in `package.json` and `package-lock.json`: EmDash **1.2.0**, Astro **7.3.5**, React **19.3.0**. No cloud credentials are needed for Node development.

Clone both repositories as siblings. For a customer variant, substitute your fork URLs but keep these directory names:

```sh
mkdir my-erp
cd my-erp
git clone https://github.com/ZeroHostCMS/zhst-community-plugins.git
git clone https://github.com/ZeroHostCMS/zhst-community-themes.git
cd zhst-community-plugins/plugins/erp-mini
npm ci
npm run check
cd ../../../zhst-community-themes/themes/erp-mini
npm ci
cp .env.example .env
# For a fresh bookkeeping installation, edit .env: ERP_CURRENCY=VND
# before building or starting the host; see Accounting setup below.
npm run secrets:generate
npm run typecheck
npm run build
npm run dev
```

`secrets:generate` writes a unique local encryption key. Never copy an existing customer's key or database into a new customer installation; keep a protected backup for that installation. Do not use `--force` to replace a key protecting existing data.

This sequence keeps the template's USD CRM/sales default. For a **new VND bookkeeping installation**, set `ERP_CURRENCY=VND` in `.env` before the first host build/start, then follow [Accounting setup](#optional-node-vnd-accounting). Do not reinterpret an existing CRM installation by changing this value: its persisted currency lock still applies. Copying `.env.example` and generating a key are fresh-install steps, not upgrades.

Visit `http://localhost:4321`, select **Open workspace**, and follow EmDash's site/account/passkey setup. The first account becomes an administrator. Use synthetic data for development. Create a customer, contact and item; save and submit a quotation; accept it; convert it to an order; then view and fulfill/cancel the order. The [plugin guide](https://github.com/ZeroHostCMS/zhst-community-plugins/tree/main/plugins/erp-mini#first-complete-sale) explains the precise semantics and exclusions.

If port 4321 is occupied, set both `EMDASH_SITE_URL=http://localhost:4337` and `PORT=4337` in `.env` **before building**. Start development with `npm run dev -- --port 4337`; the built server reads `PORT` itself. Keep the browser origin and configured origin identical for passkeys.

The plugin's compiled server entries must exist before the theme installs/builds/starts. When editing plugin server code, run its `npm run build` again, rebuild the production host and restart the host. Admin React source is compiled by Astro and reloads during development. No install lifecycle script executes the plugin build automatically. With the local `file:` dependency, if npm installed a copy rather than a sibling link, reinstall host dependencies after building the plugin before rebuilding/restarting.

## Configuration and customer isolation

The executable declarations are [`scripts/settings.mjs`](scripts/settings.mjs), [`astro.config.mjs`](astro.config.mjs), [`scripts/start.mjs`](scripts/start.mjs) and [`.env.example`](.env.example).

| Variable | Meaning |
| --- | --- |
| `EMDASH_SITE_URL` | Build-time origin and passkey relying-party context; default `http://localhost:4321`; production must use the real HTTPS origin |
| `ERP_CURRENCY` | Build-time business currency; USD default, also EUR/GBP/VND/JPY; existing saved configuration rejects reinterpretation |
| `ERP_DATA_DIR` | Captured Node database/media location; default `.local`; relative paths resolve from the owning release root |
| `EMDASH_ENCRYPTION_KEY` | Private per-installation key; loaded for the built server too; never `PUBLIC_*` |
| `HOST`, `PORT` | Node listener; default `127.0.0.1:4321`; not the public origin |

The Node CMS database is `<ERP_DATA_DIR>/emdash.db`; media is `<ERP_DATA_DIR>/media`; enabled accounting uses the separate `<ERP_DATA_DIR>/accounting.db`. Run config, migration and startup from this theme's release root. [`scripts/accounting-settings.mjs`](scripts/accounting-settings.mjs) owns the captured currency, canonical origin and data directory: development writes `.astro/accounting-settings.json`, a Node build writes `dist/accounting-settings.json`. Migration/runtime/startup reject mismatches with current settings rather than retargeting a database. Shell environment values can override `.env`; keep them consistent. An absolute directory is installation-specific; a relative directory stays portable with the release root. Do not share it between customer applications.

Keep separate application builds, data directories, encryption keys, hostnames, users and backups per customer. Use separate D1/R2/session resources for Cloudflare. Neither customer source forks nor UI filtering make a shared database safe.

Changing captured settings requires restarting development or rebuilding and restarting the production host; editing `.env` alone does not change an existing artifact. A rebuild does not migrate existing currency or bookkeeping data.

The root page's company/workspace presentation can be changed in `src/pages/index.astro`. CRM/sales behavior and private admin UI belong in the plugin repository. Do not add a public SSR loader for private sales data or another login/session implementation.

## Run the production Node build locally

Stop the dev server before reusing its port:

```sh
npm run typecheck
npm run build
npm start
```

`npm run preview` starts the same built production server. It requires the per-installation key and intentionally sets production mode; success in a dev-bypass session is not proof of deployed authentication.

For a real Node deployment, install/build in the approved release directory, use a dedicated OS/container identity and persistent volume, and terminate HTTPS at a controlled reverse proxy. Set the true public origin **before building**. Only change `HOST` deliberately; do not expose the unclaimed first-admin setup wizard publicly. Restrict access until the intended operator has completed setup. Configure legitimate email/login-provider recovery if required; no email provider or delivery guarantee is included.

Deploy an immutable application image or install a reviewed plugin tarball rather than depending on a mutable sibling checkout. Record the theme/plugin commits, tarball hash, package lockfiles, Node/core versions, resource identity, backup and approval. The plugin guide contains the `npm pack` workflow. A packed plugin still requires the theme's host dependencies and a host build; it is not a standalone executable.

### Optional Node VND Accounting

Internal double-entry bookkeeping, receivables/payables and reports are implemented for the **Node VND installation only**. This is not statutory accounting/tax certification, electronic invoicing, stock valuation or foreign-currency accounting. CRM/sales remain separate: fulfilling a sales order is neither payment nor automatic ledger posting. See the companion [accounting contract](https://github.com/ZeroHostCMS/zhst-community-plugins/blob/main/plugins/erp-mini/docs/accounting.md) and [storage/operator guide](https://github.com/ZeroHostCMS/zhst-community-plugins/blob/main/plugins/erp-mini/docs/accounting-storage.md).

After building the plugin and installing the paired host, choose VND/origin/data directory for a fresh installation as above. **The Node host initializes or verifies its accounting schema automatically before accepting traffic.** Repeated startup is idempotent; it does not configure a book, seed business records or reinterpret existing data.

- **Development:** start/restart `npm run dev` from the theme root. It captures `.astro/accounting-settings.json` and applies the matching schema in the server-setup hook before listening. A browser refresh does not run migrations.
- **Built Node release:** run `npm run typecheck` and `npm run build`, then `npm start` (or `npm run preview`). `scripts/start.mjs` validates `dist/accounting-settings.json` and the installation key, then initializes/verifies the schema before loading the built server. Do not bypass this startup script by launching `dist/server/entry.mjs` directly.

Installation, build and typecheck do not migrate databases. The standalone `npm run accounting:migrate -- --settings <.astro/accounting-settings.json|dist/accounting-settings.json>` remains available for operator checks and CI on isolated resources, but is not required before normal startup. Do not edit manifests, substitute a development manifest for a built release or redirect migration through environment drift. Non-VND startup skips accounting; unknown/newer schema, checksum mismatch or captured-settings drift fails startup rather than resetting data or serving an unusable ledger. Review upgrades and retain the paired backup described below before starting a changed artifact.

Complete EmDash's real account setup, ensure **ERP mini is enabled**, and use an authenticated user with `plugins:manage`. In the private workspace's **Accounting** area, explicitly configure the book with the operator-chosen `startDate`. Migration creates schema only, not a book or an administrator. The start date and VND book settings are immutable after setup; choose the accounting boundary deliberately before entering opening balances. A development workspace bypass or bearer token is not an accounting session. Disabling ERP mini denies accounting access.

Once the book is configured, **Accounts → Nhập từ bộ tài khoản mẫu** lets the operator explicitly choose **TT133/2016** or **TT99/2025**, select all or a subset, preview required parent accounts/conflicts and confirm atomic create-only import. Neither startup nor page reload chooses a regime or seeds accounts. Existing accounts are never overwritten; import is not statutory certification, regime conversion, foreign-exchange support or automatic closing. An ambiguous import retains its exact installation-scoped session command; use **Thử lại / đối soát lệnh gốc**, including after reload, rather than issuing a replacement.

The paired plugin now requires accounting **schema2**. The existing startup hook upgrades only exact checksummed schema1/2 and preserves business rows; malformed/unknown schemas fail **before listening**. Before starting a changed release, stop all old writers and take the coherent SQLite-aware/offline backup below (never copy just a live main DB without WAL). Build the plugin before the host. The upgrade is forward-only: schema1 artifacts refuse schema2. Restore the matching DB/code backup to roll back; no down-migration or automatic relabeling of manually created911 accounts is provided. Record/book `schemaVersion=1` remains the data-format version. See the plugin [schema upgrade procedure](https://github.com/ZeroHostCMS/zhst-community-plugins/blob/main/plugins/erp-mini/docs/accounting-storage.md#schema1--schema2).

[`src/server/accounting-endpoint.ts`](src/server/accounting-endpoint.ts) owns session/permission/origin guards; [`src/server/accounting-resources.ts`](src/server/accounting-resources.ts) owns the separate database lifecycle. The UI uses the canonical installation origin and private, no-store transport. Do not add a public ledger loader or a Node fallback to the Worker.

For upgrades and rollback, keep a coherent, installation-specific recovery set: CMS database, accounting database, media, private encryption key and the matching reviewed source/build pair. Quiesce writes and follow the storage guide's SQLite/WAL backup procedure; copying only a live `accounting.db` file is not a recovery plan. Restore the set together, never regenerate its key or assume an older application can open a newer schema. Validate restore/rollback on isolated data before operator approval; this README is not evidence that those gates have run.

## Optional manual Cloudflare review deployment

This path uses [`astro.cloudflare.config.mjs`](astro.cloudflare.config.mjs), [`src/worker.ts`](src/worker.ts) and [`scripts/configure-cloudflare.mjs`](scripts/configure-cloudflare.mjs). It requires your own authorized Cloudflare account and isolated **review** resources. Nothing here provisions resources, sets credentials or deploys during install/build/CI.

Cloudflare retains the existing CRM/sales path, including VND sales precision, but **Accounting is unsupported**. Its config does not enable accounting, inject the accounting route or import the Node accounting graph. Do not run the Node migration against D1 or add a Node-driver fallback to make the UI appear supported.

1. Authenticate Wrangler through your operator environment. Create a dedicated D1 database and R2 bucket:

   ```sh
   npx wrangler d1 create "$ERP_CF_DATABASE_NAME"
   npx wrangler r2 bucket create "$ERP_CF_BUCKET_NAME"
   ```

2. Set the environment values from the resources you actually provisioned: `CLOUDFLARE_ACCOUNT_ID`, `ERP_CF_WORKER_NAME`, `ERP_CF_DATABASE_ID`, `ERP_CF_DATABASE_NAME`, `ERP_CF_BUCKET_NAME`, `ERP_CF_SITE_URL`. The site URL must be the actual intended HTTPS origin, not a local URL or another customer's hostname. Then generate the private mapping:

   ```sh
   npm run cloudflare:configure -- --currency USD
   ```

   The script accepts equivalent explicit `--name`, `--account-id`, `--database-id`, `--database-name`, `--bucket-name`, `--site-url` options. It validates syntax, rejects missing/nil identifiers and refuses to overwrite an existing `wrangler.json`. It does **not** verify resource ownership remotely. Check every resource in your account before continuing. Generated configuration is ignored by Git.

3. Create a fresh per-installation encryption key in your private operator environment and set it on this Worker, never in `vars` or source:

   ```sh
   npx wrangler secret put EMDASH_ENCRYPTION_KEY --config wrangler.json
   ```

   Wrangler may ask to create the named Worker before its first deployment. Verify that name/account before authorizing it. Keep the key backup private.

4. Build and inspect the generated deployment configuration and session binding requirements:

   ```sh
   npm run cloudflare:build
   npm run cloudflare:preview
   ```

   Preview explicitly uses Wrangler `--local`, not remote bindings. Supply a disposable local key through ignored Wrangler development secrets if needed. Because this build is configured for the deployment's HTTPS origin, localhost preview is a startup/API-guard smoke, not proof of passkey login at that HTTPS origin. Use the Node path for full local development and the actual review hostname for deployed authentication acceptance. The Astro adapter manages its own session KV binding, separate from EmDash's database-backed auth. Inspect `dist/server/wrangler.json`; do not reuse another installation's bindings. `src/worker.ts` preserves EmDash's scheduled handler and the configuration includes its cron trigger.

5. After source/dependency/security review, stop preview, confirm backups and target identity, and explicitly deploy:

   ```sh
   npm run cloudflare:deploy
   ```

   Complete setup privately. Exercise the real authenticated browser workflow, permission/CSRF denial, conflicting edits, isolation, migrations, media, cron and recovery on the deployed review instance. A local Node or Worker build is not this evidence. Record remote resource identities privately, not in a public PR.

6. Only after this manual ZeroHostCMS review, propose a separate hosting-platform promotion PR. The current private website runtime is pinned to EmDash 1.1.0 and has an allowlisted customization model; this ERP's 1.2.0 project is not automatically accepted by that catalog/operator. Do not bypass its ownership, billing or publication checks to force a deployment.

## Compatible upstream updates

EmDash remains an upstream dependency, not a fork. The daily compatibility workflow checks the pinned baseline and npm's latest `emdash` release against a recorded companion-plugin commit. It packs the plugin, exercises real SQLite business behavior, then builds and starts both the Node host and a local Cloudflare Worker. Core and `@emdash-cms/cloudflare` must be tested at the **same exact version**. Dependabot creates reviewable dependency PRs; there is no auto-merge or deployment workflow. Scheduled checks and Dependabot become active after these files reach the repository's default branch; forks must enable Actions and update both the companion repository and its pinned SHA.

Follow the [plugin compatibility and release guide](https://github.com/ZeroHostCMS/zhst-community-plugins/blob/main/plugins/erp-mini/docs/compatibility.md) for candidate testing, migration review, backups, rollback pairs and per-customer rollout. GitHub's latest release tag may belong to another EmDash monorepo package; it is not the core version source.

Both build configurations resolve linked-plugin runtime peers from the host. The Cloudflare SSR bundle also enables [Rolldown source execution ordering](https://rolldown.rs/reference/OutputOptions.strictExecutionOrder), which prevents the observed cross-chunk Kysely class-initialization failure in workerd. This adds server initialization wrappers, not a core patch. Keep the local Worker runtime check when changing bundler/core dependencies; compilation alone did not catch this failure.

## Forks, AI and PRs

See [`AGENTS.md`](AGENTS.md), the [ERPNext workflow-porting guide](https://github.com/ZeroHostCMS/zhst-community-plugins/blob/main/plugins/erp-mini/docs/porting.md) and the repository [contribution guide](../../CONTRIBUTING.md). AI can assist source changes with synthetic fixtures; this theme does not transmit customer records to an AI provider or implement autonomous business actions.

Cross-repository changes need linked PRs and an exact tested source pair. Keep customer-only secrets, resource mappings, data and proprietary requirements private. General improvements can flow back to the community without forking EmDash core.

MIT, inherited from the repository [license](../../LICENSE). This project uses no ERPNext source/assets. Capacity for thousands of variants is an operational goal, not a result established by these starter checks.
