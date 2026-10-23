import node from "@astrojs/node";
import react from "@astrojs/react";
import icon from "astro-iconset";
import { defineConfig, fontProviders } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

// Local data lives next to the project by default. Set COMMERCELITE_DATA_DIR to keep the
// development database and uploads somewhere else (for example a scratch directory).
const dataDir = (process.env.COMMERCELITE_DATA_DIR || ".").replace(/\/+$/, "");

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
					"arrow-right",
					"arrow-square-out",
					"chart-bar",
					"check-circle",
					"clock",
					"cloud",
					"code",
					"currency-dollar",
					"envelope",
					"envelope-simple",
					"globe",
					"heart",
					"leaf",
					"lifebuoy",
					"lightning",
					"list",
					"lock",
					"magnifying-glass",
					"shield-check",
					"sparkle",
					"squares-four",
					"star",
					"tag-simple",
					"users-three",
					"x",
				],
			},
		}),
		emdash({
			database: sqlite({ url: `file:${dataDir}/data.db` }),
			storage: local({
				directory: `${dataDir}/uploads`,
				baseUrl: "/_emdash/api/media/file",
			}),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-body",
			weights: [400, 500, 600, 700, 800],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "Newsreader",
			cssVariable: "--font-serif",
			weights: [400, 500, 600],
			styles: ["normal", "italic"],
			fallbacks: ["Georgia", "serif"],
		},
	],
	devToolbar: { enabled: false },
});
