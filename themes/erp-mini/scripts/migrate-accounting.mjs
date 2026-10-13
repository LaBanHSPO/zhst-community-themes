import { mkdirSync, realpathSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readAccountingTarget } from "./accounting-settings.mjs";

export function parseMigrationArguments(args) {
  if (args.length !== 2 || args[0] !== "--settings" || !args[1] || args[1].startsWith("--")) {
    throw new Error("Usage: npm run accounting:migrate -- --settings <.astro/accounting-settings.json|dist/accounting-settings.json>");
  }
  return args[1];
}

/** Explicit schema-only migration; validation is read-only and cannot retarget from env. */
export async function migrateAccounting(settingsFilename, options = {}) {
  const target = readAccountingTarget(settingsFilename, options);
  if (target.settings.currency !== "VND") throw new Error("Accounting migration requires a captured VND Node installation.");
  const { migrateAccountingDatabase } = await import("@zerohost/plugin-erp-mini/accounting-node");
  mkdirSync(dirname(target.databasePath), { recursive: true, mode: 0o700 });
  migrateAccountingDatabase(target.databasePath);
  return target;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const settingsFilename = parseMigrationArguments(process.argv.slice(2));
    const releaseRoot = realpathSync(fileURLToPath(new URL("..", import.meta.url)));
    if (realpathSync(process.cwd()) !== releaseRoot) throw new Error("Run accounting:migrate from this Node release's root.");
    await migrateAccounting(settingsFilename);
    console.log("Accounting schema migration completed. Book setup still requires an authenticated administrator.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Accounting migration failed.");
    process.exitCode = 1;
  }
}
