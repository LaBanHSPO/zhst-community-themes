import { readFileSync } from "node:fs";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { otaServerPlugin } from "@zerohost/plugin-ota-server";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { parse } from "jsonc-parser";

// The deployment file is the single source of truth for bindings and vars; the
// Cloudflare adapter reads the same file at build time.
const configPath = process.env.OTA_CONFIG || "./wrangler.jsonc";
const configErrors = [];
const deployment = parse(readFileSync(new URL(configPath, import.meta.url), "utf8"), configErrors, {
	allowTrailingComma: true,
});
if (configErrors.length) throw new Error(`Invalid deployment configuration: ${configPath}`);
const site = deployment.vars.OTA_SITE_URL;
if (!site || !/^https?:\/\//.test(site))
	throw new Error("OTA_SITE_URL must be an absolute HTTP(S) origin.");
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(site) && !site.startsWith("https://"))
	throw new Error("A deployed OTA server must use HTTPS.");

export default defineConfig({
	site,
	output: "server",
	server: { port: 4342, host: "127.0.0.1" },
	adapter: cloudflare({ configPath, imageService: "passthrough" }),
	integrations: [
		react(),
		emdash({
			siteUrl: site,
			database: d1({ binding: "DB", session: "disabled" }),
			// `MEDIA` is the site storage adapter. It backs the "ZeroHostCMS
			// storage plan" mode; a private R2 bucket is configured in the
			// workspace instead and never needs this binding.
			storage: r2({ binding: "MEDIA" }),
			plugins: [otaServerPlugin()],
		}),
	],
	vite: {
		resolve: {
			dedupe: ["react", "react-dom", "emdash", "kysely", "@cloudflare/kumo"],
		},
		environments: {
			ssr: { build: { rolldownOptions: { output: { strictExecutionOrder: true } } } },
		},
	},
	devToolbar: { enabled: false },
});
