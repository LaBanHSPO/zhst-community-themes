import node from "@astrojs/node";
import react from "@astrojs/react";
import { formsPlugin } from "@emdash-cms/plugin-forms";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

// Optional: keep the local database and uploads outside the project folder.
// Defaults to the project root, exactly like the base CarePulse theme.
const dataDir = (process.env.CAREPULSE_DATA_DIR || ".").replace(/\/$/, "");

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
			database: sqlite({ url: `file:${dataDir}/data.db` }),
			storage: local({
				directory: `${dataDir}/uploads`,
				baseUrl: "/_emdash/api/media/file",
			}),
			// Official EmDash Forms plugin: stores appointment inquiries for admins (Plugins → Forms).
			plugins: [formsPlugin({ defaultSpamProtection: "honeypot" })],
		}),
	],
	devToolbar: { enabled: false },
});
