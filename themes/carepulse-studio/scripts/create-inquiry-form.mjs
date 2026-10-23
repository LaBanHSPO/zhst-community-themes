#!/usr/bin/env node
/**
 * Create the "appointment-inquiry" form in the EmDash Forms plugin.
 *
 * The EmDash seed format has no section for plugin data, so the form definition lives in
 * `forms/appointment-inquiry.json` and is created once per site through the plugin's admin route.
 *
 * Usage:
 *   EMDASH_TOKEN=<admin API token> node scripts/create-inquiry-form.mjs --url https://example.com
 *
 * Create the token in the admin under Settings → API Tokens. The script sends only the form
 * definition; it never reads or prints submissions. Running it twice fails with a 409 (the slug exists).
 */
import { readFile } from "node:fs/promises";

const urlIndex = process.argv.indexOf("--url");
const siteUrl = urlIndex > -1 ? process.argv[urlIndex + 1] : process.env.EMDASH_URL;
const token = process.env.EMDASH_TOKEN;

if (!siteUrl || !token) {
	console.error("Usage: EMDASH_TOKEN=<token> node scripts/create-inquiry-form.mjs --url <site URL>");
	process.exit(1);
}

const definition = JSON.parse(
	await readFile(new URL("../forms/appointment-inquiry.json", import.meta.url), "utf8"),
);

const response = await fetch(new URL("/_emdash/api/plugins/emdash-forms/forms/create", siteUrl), {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
		"X-EmDash-Request": "1",
	},
	body: JSON.stringify(definition),
});

const body = await response.json().catch(() => ({}));
if (!response.ok || body.success === false) {
	console.error(`Failed (${response.status}): ${body?.error?.message ?? "unknown error"}`);
	process.exit(1);
}
console.log(`Created form "${definition.slug}".`);
