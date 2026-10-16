import { mkdirSync, realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readAccountingTarget } from "./accounting-settings.mjs";
import { migrateAccounting } from "./migrate-accounting.mjs";

process.env.NODE_ENV = "production";
const releaseRoot = realpathSync(fileURLToPath(new URL("..", import.meta.url)));
if (realpathSync(process.cwd()) !== releaseRoot) {
  throw new Error("Start the built Node server from its owning release root.");
}
// Fail closed before any database/directory access if build and startup drift.
const { settings } = readAccountingTarget("dist/accounting-settings.json");
if (!/^emdash_enc_v1_[A-Za-z0-9_-]{43}$/.test(process.env.EMDASH_ENCRYPTION_KEY ?? "")) {
  throw new Error("Set a per-installation EMDASH_ENCRYPTION_KEY. For local use run npm run secrets:generate; back up this key with the database.");
}
// Settings have already matched the captured release; never reinterpret its target.
mkdirSync(settings.dataDirectory, { recursive: true, mode: 0o700 });
if (settings.currency === "VND") {
  await migrateAccounting("dist/accounting-settings.json", { captured: settings });
}
// Restrict the listener by default. Set HOST deliberately behind a TLS reverse proxy.
process.env.HOST ??= "127.0.0.1";
process.env.PORT ??= "4321";
await import("../dist/server/entry.mjs");
