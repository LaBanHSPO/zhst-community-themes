import { mkdirSync } from "node:fs";
import { siteOrigin } from "./settings.mjs";

process.env.NODE_ENV = "production";
siteOrigin();
if (!/^emdash_enc_v1_[A-Za-z0-9_-]{43}$/.test(process.env.EMDASH_ENCRYPTION_KEY ?? "")) {
  throw new Error("Set a per-installation EMDASH_ENCRYPTION_KEY. For local use run npm run secrets:generate; back up this key with the database.");
}
// Keep ERP_DATA_DIR consistent with the build. Relative defaults follow runtime cwd.
mkdirSync(process.env.ERP_DATA_DIR ?? ".local", { recursive: true, mode: 0o700 });
// Restrict the listener by default. Set HOST deliberately behind a TLS reverse proxy.
process.env.HOST ??= "127.0.0.1";
process.env.PORT ??= "4321";
await import("../dist/server/entry.mjs");
