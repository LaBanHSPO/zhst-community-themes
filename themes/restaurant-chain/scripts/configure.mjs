import { readFile, writeFile } from "node:fs/promises";
import { parse } from "jsonc-parser";

const required = [
	"WORKER_NAME",
	"SITE_ORIGIN",
	"CMS_DATABASE_ID",
	"RESTAURANT_DATABASE_ID",
	"MEDIA_BUCKET",
	"JOBS_QUEUE",
	"JOBS_DLQ",
];
const values = Object.fromEntries(
	required.map((key) => {
		const value = process.env[key]?.trim();
		if (!value) throw new Error(`Set ${key} before configuring deployment.`);
		return [key, value];
	}),
);
const origin = new URL(values.SITE_ORIGIN);
if (
	origin.protocol !== "https:" ||
	origin.origin !== values.SITE_ORIGIN ||
	origin.username ||
	origin.password
) {
	throw new Error("SITE_ORIGIN must be an HTTPS origin with no path or credentials.");
}
for (const key of ["CMS_DATABASE_ID", "RESTAURANT_DATABASE_ID"]) {
	if (
		!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(values[key]) ||
		values[key].startsWith("00000000-")
	) {
		throw new Error(`${key} must be the ID of an explicitly provisioned database.`);
	}
}
if (values.CMS_DATABASE_ID === values.RESTAURANT_DATABASE_ID)
	throw new Error("CMS and restaurant databases must be separate.");
for (const key of ["WORKER_NAME", "MEDIA_BUCKET", "JOBS_QUEUE", "JOBS_DLQ"]) {
	if (!/^[a-z][a-z0-9-]{2,62}$/.test(values[key])) throw new Error(`Invalid ${key}.`);
}
if (values.JOBS_QUEUE === values.JOBS_DLQ)
	throw new Error("The recovery dead-letter queue must be separate.");
const configErrors = [];
const config = parse(
	await readFile(new URL("../wrangler.local.jsonc", import.meta.url), "utf8"),
	configErrors,
	{ allowTrailingComma: true },
);
if (configErrors.length) throw new Error("Invalid local deployment template.");
config.name = values.WORKER_NAME;
config.vars = { EMDASH_SITE_URL: origin.origin, RESTAURANT_ENVIRONMENT: "production" };
config.routes = [{ pattern: origin.hostname, custom_domain: true }];
config.d1_databases[0].database_id = values.CMS_DATABASE_ID;
config.d1_databases[0].database_name = `${values.WORKER_NAME}-cms`;
config.d1_databases[1].database_id = values.RESTAURANT_DATABASE_ID;
config.d1_databases[1].database_name = `${values.WORKER_NAME}-domain`;
config.r2_buckets[0].bucket_name = values.MEDIA_BUCKET;
config.queues.producers[0].queue = values.JOBS_QUEUE;
config.queues.consumers[0].queue = values.JOBS_QUEUE;
config.queues.consumers[0].dead_letter_queue = values.JOBS_DLQ;
await writeFile(
	new URL("../wrangler.production.json", import.meta.url),
	`${JSON.stringify(config, null, "\t")}\n`,
	{ flag: "wx", mode: 0o600 },
);
console.log(
	"Wrote private deployment mapping. No resources were created and nothing was deployed.",
);
