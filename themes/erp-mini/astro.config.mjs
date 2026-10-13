import { mkdirSync } from "node:fs";
import { join } from "node:path";
import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";
import { erpMiniPlugin } from "@zerohost/plugin-erp-mini";
import { accountingIntegration } from "./scripts/accounting-integration.mjs";
import { captureAccountingSettings } from "./scripts/accounting-settings.mjs";

// The selected directory is captured at build time; relative paths stay portable.
const settings = captureAccountingSettings();
const { dataDirectory, currency, origin: site } = settings;
mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });

export default defineConfig({
  site,
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    accountingIntegration(settings),
    emdash({
      siteUrl: site,
      database: sqlite({ url: `file:${join(dataDirectory, "emdash.db")}` }),
      storage: local({ directory: join(dataDirectory, "media"), baseUrl: "/_emdash/api/media/file" }),
      plugins: [erpMiniPlugin({ currency, accounting: currency === "VND" })],
    }),
  ],
  // Linked plugin development dependencies must not become a second host runtime.
  vite: {
    resolve: { dedupe: ["react", "react-dom", "emdash", "kysely"] },
    // Preserve package-relative SQL assets and one shared domain/driver error class.
    ssr: { external: ["@zerohost/plugin-erp-mini/accounting", "@zerohost/plugin-erp-mini/accounting-node"] },
  },
  devToolbar: { enabled: false },
});
