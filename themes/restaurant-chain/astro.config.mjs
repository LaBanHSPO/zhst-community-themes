import { readFileSync } from "node:fs";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { restaurantChainPlugin } from "@zerohost/plugin-restaurant-chain";
import { parse } from "jsonc-parser";

const configPath = process.env.RESTAURANT_CONFIG || "./wrangler.local.jsonc";
const configErrors = [];
const deployment = parse(readFileSync(new URL(configPath, import.meta.url), "utf8"), configErrors, {
	allowTrailingComma: true,
});
if (configErrors.length) throw new Error(`Invalid deployment configuration: ${configPath}`);
const site = deployment.vars.EMDASH_SITE_URL;
if (!site || !/^https?:\/\//.test(site))
	throw new Error("EMDASH_SITE_URL must be an absolute HTTP(S) origin.");
if (deployment.vars.RESTAURANT_ENVIRONMENT !== "local" && !site.startsWith("https://")) {
	throw new Error("Deployed restaurant sites require HTTPS.");
}
export default defineConfig({
	site,
	output: "server",
	server: { port: 4341, host: "127.0.0.1" },
	adapter: cloudflare({ configPath, imageService: "passthrough" }),
	integrations: [
		react(),
		emdash({
			siteUrl: site,
			database: d1({ binding: "DB", session: "disabled" }),
			storage: r2({ binding: "MEDIA" }),
			plugins: [restaurantChainPlugin()],
		}),
	],
	vite: {
		resolve: {
			dedupe: [
				"react",
				"react-dom",
				"emdash",
				"kysely",
				"@lingui/core",
				"@lingui/react",
				"@cloudflare/kumo",
			],
		},
		environments: {
			ssr: { build: { rolldownOptions: { output: { strictExecutionOrder: true } } } },
		},
	},
	devToolbar: { enabled: false },
});
