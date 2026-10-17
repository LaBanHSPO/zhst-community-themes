import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { redcrossChapterPlugin } from "@zerohost/plugin-redcross-chapter";

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
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [redcrossChapterPlugin()],
		}),
	],
	// A linked plugin dependency must not become a second host runtime.
	vite: {
		resolve: { dedupe: ["react", "react-dom", "emdash"] },
	},
	devToolbar: { enabled: false },
});
