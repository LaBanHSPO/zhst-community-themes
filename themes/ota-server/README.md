# OTA server Cloudflare theme

An Astro/EmDash host for the [OTA server plugin](../../../zhst-community-plugins/plugins/ota-server/README.md). The mobile apps poll `/ota/{app}/{platform}/manifest.json` and download the bundles it points at; app managers use `/_emdash/admin/plugins/ota-server/workspace`. The host runs on Cloudflare Workers with D1 and R2, and needs no Vercel Blob or other third-party blob service.

The theme owns the HTTP paths because EmDash plugin routes are mounted under `/_emdash/api/plugins/{id}/*` with an 8 MiB body ceiling, and a bundle is 25–100 MiB. `/ota/*` is nine lines of routing around the plugin's handler; every rule lives in the plugin.

This is a standalone template, not an entry in the ZeroHostCMS catalog. Community acceptance is not a production deployment.

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
npm run migrate:local  # apply the plugin migration to local D1
npm run dev
```

Open `http://localhost:4342/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin/plugins/ota-server/workspace` for a local administrator. That development-only endpoint initializes the CMS database and creates a session; it is not available in a production build. Then create a push token in the workspace and publish a build with `curl` or CI as described in the [plugin guide](../../../zhst-community-plugins/plugins/ota-server/README.md#push).

Check the host after a plugin rebuild:

```sh
npm run typecheck
npm run build
npm run verify:local   # drives the built Worker against the real contract
```

`npm run verify:local` stops at 35 checks covering the manifest, a 3 MiB push, byte-exact download, range resume, retention deletion, authentication and caching headers, and the anonymous admin rejection. It uses only local state under `.wrangler/verify`.

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
| `OTA_MAX_BUNDLE_BYTES` | Accepted bundle ceiling in bytes, default `104857600` (100 MiB) |
| `OTA_RETENTION_DAYS` | Days a build survives without another push, default `14` |
| `OTA_SECRET_KEY` | Runtime secret. Encrypts a private R2 secret at rest; also generate it with `openssl rand -base64 32` |

A host that cannot add a binding can point the OTA metadata at the EmDash database instead: `src/server/resources.ts` uses `env.OTA_DB ?? env.DB`, and the plugin migration is idempotent, so applying it to the CMS database is safe.

```sh
wrangler d1 execute DB --remote --file node_modules/@zerohost/plugin-ota-server/migrations/0001_ota.sql
```

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

1. Provision isolated resources and put their identifiers in a production copy of `wrangler.jsonc` (`OTA_CONFIG=./wrangler.production.json` selects it): a CMS D1 database, an OTA D1 database, an R2 bucket, and the approved HTTPS origin in `OTA_SITE_URL`.
2. `npm run migrate:remote` applies the plugin migration to the OTA database.
3. Set `OTA_SECRET_KEY` as a Worker secret (`wrangler secret put OTA_SECRET_KEY`) if a private R2 bucket will be used. Never commit it.
4. Build and deploy with the approved configuration, then create the first push token in the workspace and publish a build.
5. If the private R2 mode is used, run the workspace's **Test connection** before the first real push, then delete that release and re-push to confirm the bucket receives and serves the object.

`OTA_SECRET_KEY` cannot be rotated without re-entering the stored R2 secret; rotate it by saving the storage settings again with the same secret after setting the new key.

Nothing in this repository deploys, provisions resources, or holds provider credentials. Local Node results and local `workerd` results do not prove Cloudflare production isolation, limits or platform support.

## License

MIT. See [LICENSE](LICENSE).
