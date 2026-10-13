import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { installationCurrency, siteOrigin } from "./settings.mjs";

const { values } = parseArgs({ options: {
  name: { type: "string" },
  "account-id": { type: "string" },
  "database-id": { type: "string" },
  "database-name": { type: "string" },
  "bucket-name": { type: "string" },
  "site-url": { type: "string" },
  currency: { type: "string" },
} });
function required(option, environment, pattern) {
  const value = values[option] ?? process.env[environment];
  if (!value || !pattern.test(value)) throw new Error(`Provide a valid --${option} or ${environment} from your provisioned staging resources.`);
  return value;
}
const name = required("name", "ERP_CF_WORKER_NAME", /^[a-z0-9][a-z0-9-]{0,62}$/);
const account = required("account-id", "CLOUDFLARE_ACCOUNT_ID", /^(?!0{32}$)[a-f0-9]{32}$/i);
const databaseId = required("database-id", "ERP_CF_DATABASE_ID", /^(?!00000000-0000-0000-0000-000000000000$)[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i);
const databaseName = required("database-name", "ERP_CF_DATABASE_NAME", /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}$/);
const bucketName = required("bucket-name", "ERP_CF_BUCKET_NAME", /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/);
const rawOrigin = values["site-url"] ?? process.env.ERP_CF_SITE_URL;
if (!rawOrigin) throw new Error("Provide --site-url or ERP_CF_SITE_URL with the staging Worker's actual HTTPS origin.");
const origin = siteOrigin(rawOrigin, true);
const currency = installationCurrency(values.currency);
const config = {
  $schema: "node_modules/wrangler/config-schema.json",
  name,
  account_id: account,
  main: "./src/worker.ts",
  compatibility_date: "2026-10-01",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: [{ binding: "DB", database_name: databaseName, database_id: databaseId }],
  r2_buckets: [{ binding: "MEDIA", bucket_name: bucketName }],
  // Stable namespace identity belongs to this Worker, not a shared service or CRM D1.
  ...(currency === "VND" ? {
    durable_objects: { bindings: [{ name: "ERP_ACCOUNTING", class_name: "ErpAccounting" }] },
    migrations: [{ tag: "erp-accounting-sqlite-v1", new_sqlite_classes: ["ErpAccounting"] }],
  } : {}),
  vars: { EMDASH_SITE_URL: origin, ERP_CURRENCY: currency },
  triggers: { crons: ["* * * * *"] },
};
// Exclusive creation prevents accidentally replacing another customer's resource mapping.
writeFileSync("wrangler.json", `${JSON.stringify(config, null, 2)}\n`, { flag: "wx", mode: 0o600 });
console.log("Created ignored wrangler.json. Resource identifiers are syntax-validated, not provisioned or verified remotely. Review it, set EMDASH_ENCRYPTION_KEY with Wrangler secrets, then run cloudflare:build. Nothing was deployed.");
