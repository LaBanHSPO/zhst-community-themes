# OTA server Cloudflare theme

An Astro/EmDash host for the [OTA server plugin](../../../zhst-community-plugins/plugins/ota-server/README.md). The mobile apps poll `/ota/{app}/{platform}/manifest.json` and download the bundles it points at; app managers use `/_emdash/admin/plugins/ota-server/workspace`. The host runs on Cloudflare Workers with D1 and R2, and needs no Vercel Blob or other third-party blob service.

The theme owns the HTTP paths because EmDash plugin routes are mounted under `/_emdash/api/plugins/{id}/*` with an 8 MiB body ceiling, below typical bundle sizes. Theme routes delegate contract rules to the plugin.

This is a standalone template, not an entry in the ZeroHostCMS catalog. Community acceptance is not a production deployment.

The canonical [Vietnamese API and operations handover](docs/ota-van-hanh.vi.md) covers FE/mobile, CI, admin upload protection, deployment approval, migration and recovery. `Downloads/ota-be-api.md` is a separately requested export of that guide, not a second source of truth.

## Run locally

Use Node 24.15 or later in the 24.x line, or Node 26 or later. Clone both repositories as siblings. The plugin's compiled server entry must exist before the theme builds or starts.

```sh
git clone https://github.com/ZeroHostCMS/zhst-community-plugins.git
git clone https://github.com/ZeroHostCMS/zhst-community-themes.git
cd zhst-community-plugins/plugins/ota-server
npm ci
npm run check
cd ../../../zhst-community-themes/themes/ota-server
npm ci
cp .env.example .env
node -p "require('node:crypto').randomBytes(32).toString('base64')"
```

Put the generated value in `.env` as `OTA_SECRET_KEY`. Without it the storage-plan mode still works and a private R2 bucket cannot be configured. `.env` is ignored by Git; do not create `.dev.vars`, which takes precedence over `.env` in Wrangler.

```sh
npm run types          # binding types from wrangler.jsonc
npm run migrate:local  # apply all pending plugin migrations to local OTA D1
npm run dev
```

Open `http://localhost:4342/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin/plugins/ota-server/workspace` for a local administrator. That development-only endpoint initializes the CMS database and creates a session; production rejects dev-bypass. Create a bearer under Push tokens; optionally create extra upload protection for the app in that tab. The [Vietnamese handover](docs/ota-van-hanh.vi.md) owns publishing examples and the separation between public `signature`, boolean `mandatory`, bearer auth and the private `X-OTA-Upload-Key`.

Check the host after a plugin rebuild:

```sh
npm run typecheck
npm run build
npm run verify:local   # drives the built Worker against the real contract
```

Stop the dev server before rebuilding the plugin. `tsdown --clean` deletes the plugin's `dist/` first, so a running dev server briefly cannot resolve `@zerohost/plugin-ota-server/server` and logs `Cannot find module …` on its next reload. It recovers when the build finishes, but restart the host after a change to plugin server code; admin React source is compiled by Astro and reloads on its own.

[`scripts/verify-local.mjs`](scripts/verify-local.mjs) owns the built-Worker contract checks and uses isolated local state under `.wrangler/verify`. Its local D1 fixtures exercise upload-key activation and rotation; they are not proof of a live production admin session or private R2 deployment.

The admin workspace lives at `/_emdash/admin/plugins/ota-server/workspace` and requires `settings:manage`. Screenshots of the running page, taken against a local synthetic database, are in [`docs/evidence/`](docs/evidence): the releases and upload view, the push-token list, and the storage mode picker including the private R2 fields.

## Bindings and secrets

`wrangler.jsonc` is the executable deployment description; `astro.config.mjs` reads the same file so the build and the bindings cannot disagree.

| Binding | Purpose |
| --- | --- |
| `DB` | EmDash CMS, users, sessions and native-plugin metadata |
| `OTA_DB` | OTA apps, releases, the current-build pointer, tokens, settings and audit |
| `MEDIA` | R2 bucket behind the site storage adapter — the ZeroHostCMS storage-plan mode |
| `SESSION` | KV sessions added by the Astro adapter |
| `OTA_SITE_URL` | Absolute origin; also validated at build time |
| `OTA_MAX_BUNDLE_BYTES` | Application bundle ceiling in bytes, default `104857600` (100 MiB); not a Worker memory guarantee |
| `OTA_RETENTION_DAYS` | Age limit from release creation time, default `14`; replay does not refresh creation time |
| `OTA_SECRET_KEY` | Runtime secret. Encrypts a private R2 secret at rest; also generate it with `openssl rand -base64 32` |

A host that cannot add a binding can use the EmDash database through [`src/server/resources.ts`](src/server/resources.ts), which selects `env.OTA_DB ?? env.DB`. Apply every pending OTA migration to the actual target database through migration tracking before serving new code. Applying only the initial SQL file is not an upgrade procedure; [the migration directory](../../../zhst-community-plugins/plugins/ota-server/migrations/) owns the schema and legacy metadata defaults.

The scheduled handler runs EmDash's own schedule plus the OTA expiry sweep once a day. The sweep matters for a channel that stops receiving pushes; every push also sweeps.

## Routes

| Path | Served by |
| --- | --- |
| `/ota/{app}/{platform}/manifest.json`, `/ota/{app}/{platform}/{file}`, `/ota/{app}/{platform}/releases` | `src/pages/ota/[...path].ts` (public, the frozen client contract) |
| `/api/ota/{action}` | `src/pages/api/ota/[action].ts` (session + `settings:manage` + same-origin CSRF) |
| `/_emdash/admin/plugins/ota-server/workspace` | the plugin's admin page, mounted by EmDash |
| `/` | `src/pages/index.astro`, a short contract summary linking to the workspace |

Bundle downloads carry an exact `Content-Length` and no content coding. The bundle content type is `application/octet-stream`, which plain HTTP compression never rewrites, so the apps can compute their download percentage.

## Prepare an approved deployment

Deployment is an operator action, not a consequence of copying this template.

1. Provision isolated approved resources and put their identifiers in a restricted production copy of `wrangler.jsonc`; `OTA_CONFIG=./wrangler.production.json` selects that file for the Astro build. Set the approved HTTPS `OTA_SITE_URL`.
2. Apply every pending plugin migration to the production OTA database using an explicit production `--config`. The package's `migrate:remote` and `types` scripts hardcode `wrangler.jsonc`; `OTA_CONFIG` does not redirect them. The [handover](docs/ota-van-hanh.vi.md) owns the explicit-config example and backup prerequisite.
3. Set `OTA_SECRET_KEY` through the approved Worker secret route if private R2 is used. Never commit or document its value. Configure R2 credentials in the workspace.
4. Build/deploy through the approved environment workflow, use normal EmDash setup/login for production administrators, then create bearer and optional upload protection in the workspace and publish an approved dev artifact.
5. For private R2, run **Test connection**, then exercise publish/read/download/delete against the approved bucket. Keep actual credentials, resource identifiers and receipts in their restricted operational owner.

`OTA_SECRET_KEY` cannot be rotated without re-entering the stored R2 secret; rotate it by saving the storage settings again with the same secret after setting the new key.

Nothing in this repository deploys, provisions resources, or holds provider credentials. Local Node results and local `workerd` results do not prove Cloudflare production isolation, limits or platform support.

## License

MIT. See [LICENSE](LICENSE).
