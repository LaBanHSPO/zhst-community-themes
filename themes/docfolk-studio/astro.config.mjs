import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvFile } from "node:process";
import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

if (existsSync(".env")) loadEnvFile(".env");

const dataDirectory = resolve(process.env.DOCS_DATA_DIR || ".local");
mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
const site = process.env.SITE_URL || "http://localhost:4344";

export default defineConfig({
  site,
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    react(),
    emdash({
      siteUrl: site,
      database: sqlite({ url: `file:${dataDirectory}/emdash.db` }),
      storage: local({ directory: `${dataDirectory}/media`, baseUrl: "/_emdash/api/media/file" }),
    }),
  ],
  server: { port: 4344, host: "127.0.0.1" },
  devToolbar: { enabled: false },
});
