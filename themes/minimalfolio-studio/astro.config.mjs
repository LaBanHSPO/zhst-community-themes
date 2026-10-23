import { resolve } from "node:path";
import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

// Optional: keep the local database and uploads outside the project folder.
// Unset, the theme uses ./data.db and ./uploads exactly like MinimalFolio.
const dataDir = process.env.MINIMALFOLIO_DATA_DIR
	? resolve(process.env.MINIMALFOLIO_DATA_DIR)
	: null;

export default defineConfig({
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: sqlite({
				url: dataDir ? `file:${dataDir}/data.db` : "file:./data.db",
			}),
			storage: local({
				directory: dataDir ? `${dataDir}/uploads` : "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter Tight",
			cssVariable: "--font-heading",
			weights: [400, 500, 600, 700, 800],
			fallbacks: ["sans-serif"],
		},
	],
	server: { port: 4364 },
	devToolbar: { enabled: false },
});
