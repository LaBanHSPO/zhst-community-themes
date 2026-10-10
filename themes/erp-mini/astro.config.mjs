import { mkdirSync } from "node:fs";
import { join } from "node:path";
import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { erpMiniPlugin } from "@zerohost/plugin-erp-mini";
import { installationCurrency, siteOrigin } from "./scripts/settings.mjs";

// The selected directory is captured at build time; relative paths stay portable.
const dataDirectory = process.env.ERP_DATA_DIR ?? ".local";
mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
const site = siteOrigin();

export default defineConfig({
  site,
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    emdash({
      siteUrl: site,
      database: sqlite({ url: `file:${join(dataDirectory, "emdash.db")}` }),
      storage: local({ directory: join(dataDirectory, "media"), baseUrl: "/_emdash/api/media/file" }),
      plugins: [erpMiniPlugin({ currency: installationCurrency() })],
    }),
  ],
  // Linked plugin development dependencies must not become a second host runtime.
  vite: { resolve: { dedupe: ["react", "react-dom", "emdash", "kysely"] } },
  devToolbar: { enabled: false },
});
