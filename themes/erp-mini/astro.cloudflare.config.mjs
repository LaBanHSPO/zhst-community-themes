import { readFileSync } from "node:fs";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { erpMiniPlugin } from "@zerohost/plugin-erp-mini";
import { installationCurrency, siteOrigin } from "./scripts/settings.mjs";

// Generated only after the operator provides real, isolated D1 and R2 resources.
const deployment = JSON.parse(readFileSync(new URL("./wrangler.json", import.meta.url), "utf8"));
const site = siteOrigin(deployment.vars.EMDASH_SITE_URL, true);
export default defineConfig({
  site,
  output: "server",
  adapter: cloudflare({ configPath: "./wrangler.json", imageService: "passthrough" }),
  integrations: [
    react(),
    emdash({
      siteUrl: site,
      database: d1({ binding: "DB", session: "disabled" }),
      storage: r2({ binding: "MEDIA" }),
      plugins: [erpMiniPlugin({ currency: installationCurrency(deployment.vars.ERP_CURRENCY) })],
    }),
  ],
  // Linked plugin development dependencies must not become a second host runtime.
  vite: {
    resolve: { dedupe: ["react", "react-dom", "emdash", "kysely"] },
    environments: {
      ssr: {
        // Preserve class initialization order when Rolldown splits EmDash's dependencies.
        build: { rolldownOptions: { output: { strictExecutionOrder: true } } },
      },
    },
  },
  devToolbar: { enabled: false },
});
