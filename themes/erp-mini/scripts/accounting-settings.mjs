import { readFileSync, realpathSync } from "node:fs";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { installationCurrency, siteOrigin } from "./settings.mjs";

const keys = ["version", "currency", "dataDirectory", "origin"];

/** Shared scalar authority for the Node config, manifest, CLI and startup. */
export function captureAccountingSettings(env = process.env) {
  const dataDirectory = env.ERP_DATA_DIR ?? ".local";
  if (typeof dataDirectory !== "string" || !dataDirectory.trim() || dataDirectory.includes("\0")) {
    throw new Error("ERP_DATA_DIR must be a nonempty directory path.");
  }
  return Object.freeze({
    version: 1,
    currency: installationCurrency(env.ERP_CURRENCY ?? "USD"),
    dataDirectory,
    origin: siteOrigin(env.EMDASH_SITE_URL ?? "http://localhost:4321"),
  });
}

export function validateAccountingSettings(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
      Object.keys(value).length !== keys.length || keys.some((key) => !Object.hasOwn(value, key)) ||
      value.version !== 1 || typeof value.currency !== "string" ||
      typeof value.origin !== "string" || typeof value.dataDirectory !== "string") {
    throw new Error("Unsupported accounting settings manifest. Rebuild the owning Node release.");
  }
  const validated = captureAccountingSettings({
    ERP_CURRENCY: value.currency, ERP_DATA_DIR: value.dataDirectory, EMDASH_SITE_URL: value.origin,
  });
  if (validated.origin !== value.origin) throw new Error("Accounting manifest origin is not canonical.");
  return validated;
}

export function accountingDatabasePath(settings, releaseRoot) {
  return join(isAbsolute(settings.dataDirectory) ? settings.dataDirectory : resolve(releaseRoot, settings.dataDirectory), "accounting.db");
}

/**
 * Read-only: all parity checks precede directory creation or driver loading.
 * @param {string} filename
 * @param {{cwd?: string, current?: ReturnType<typeof captureAccountingSettings>, captured?: ReturnType<typeof captureAccountingSettings>}} [options]
 */
export function readAccountingTarget(filename, { cwd = process.cwd(), current = captureAccountingSettings(), captured } = {}) {
  const manifestPath = resolve(cwd, filename);
  const container = dirname(manifestPath);
  if (basename(manifestPath) !== "accounting-settings.json" || ![".astro", "dist"].includes(basename(container))) {
    throw new Error("Select .astro/accounting-settings.json or dist/accounting-settings.json from the owning Node release.");
  }
  const releaseRoot = realpathSync(dirname(container));
  if (realpathSync(cwd) !== releaseRoot) {
    throw new Error("Run from the release root that owns the accounting settings manifest.");
  }
  if (realpathSync(manifestPath) !== join(releaseRoot, basename(container), "accounting-settings.json")) {
    throw new Error("Accounting settings must belong to this release, not a redirected manifest.");
  }
  const settings = validateAccountingSettings(JSON.parse(readFileSync(manifestPath, "utf8")));
  const expected = validateAccountingSettings(current);
  if (settings.currency !== expected.currency || settings.origin !== expected.origin ||
      resolve(releaseRoot, settings.dataDirectory) !== resolve(releaseRoot, expected.dataDirectory)) {
    throw new Error("Current currency, origin or data directory differs from the captured Node release. Refusing accounting access.");
  }
  if (captured) {
    const artifact = validateAccountingSettings(captured);
    if (keys.some((key) => settings[key] !== artifact[key])) {
      throw new Error("Accounting manifest does not match this running Node artifact.");
    }
  }
  return { settings, releaseRoot, manifestPath, databasePath: accountingDatabasePath(settings, releaseRoot) };
}
