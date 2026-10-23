import node from "@astrojs/node";
import react from "@astrojs/react";
import icon from "astro-iconset";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { resolve } from "node:path";

// Local data (SQLite database and media) lives next to the project by default,
// exactly as in Tradecraft. Set EMDASH_DATA_DIR (read when the config is
// evaluated) to keep it in another directory, e.g. a disposable review folder.
const dataDirectory = process.env.EMDASH_DATA_DIR ? resolve(process.env.EMDASH_DATA_DIR) : null;

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
		icon({
			// Only ship the Phosphor icons actually referenced in templates,
			// not the full @iconify-json/ph set.
			include: {
				ph: [
					"chart-bar",
					"check-circle",
					"clock",
					"cloud",
					"code",
					"arrow-right",
					"arrow-up-right",
					"currency-dollar",
					"envelope",
					"globe",
					"heart",
					"lifebuoy",
					"lightning",
					"list",
					"lock",
					"moon",
					"shield-check",
					"sparkle",
					"star",
					"sun",
					"users-three",
					"x",
				],
			},
		}),
		emdash({
			database: sqlite({
				url: dataDirectory ? `file:${resolve(dataDirectory, "data.db")}` : "file:./data.db",
			}),
			storage: local({
				directory: dataDirectory ? resolve(dataDirectory, "uploads") : "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Montserrat",
			cssVariable: "--font-display",
			weights: [600, 700, 800],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-body",
			weights: [400, 500, 600, 700, 800],
			fallbacks: ["sans-serif"],
		},
	],
	devToolbar: { enabled: false },
});
