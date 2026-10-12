import { mkdirSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateAccountingSettings } from "./accounting-settings.mjs";

const virtualId = "virtual:erp-mini/accounting-settings";
const resolvedId = `\0${virtualId}`;
const endpoint = fileURLToPath(new URL("../src/server/accounting-endpoint.ts", import.meta.url));
const resources = fileURLToPath(new URL("../src/server/accounting-resources.ts", import.meta.url));

export function accountingIntegration(input) {
  const settings = validateAccountingSettings(input);
  let outputDirectory;
  const writeManifest = (filename) => {
    mkdirSync(dirname(filename), { recursive: true });
    writeFileSync(filename, `${JSON.stringify(settings, null, 2)}\n`, { mode: 0o600 });
  };
  return {
    name: "erp-mini-accounting-node",
    hooks: {
      "astro:config:setup": ({ config, command, injectRoute, updateConfig }) => {
        if (realpathSync(process.cwd()) !== realpathSync(fileURLToPath(config.root))) {
          throw new Error("Run the Node host from its owning release root.");
        }
        if (settings.currency === "VND") {
          injectRoute({ pattern: "/api/erp-mini/accounting/[action]", entrypoint: endpoint, prerender: false });
        }
        if (command === "dev") writeManifest(join(fileURLToPath(config.root), ".astro/accounting-settings.json"));
        updateConfig({ vite: { plugins: [{
          name: "erp-mini-accounting-settings",
          resolveId(id) { if (id === virtualId) return resolvedId; },
          load(id) {
            if (id === resolvedId) return `export default Object.freeze(${JSON.stringify(settings)});`;
          },
          configureServer(server) {
            // Retrieve the request module before Vite tears down its SSR graph.
            const close = server.close.bind(server);
            server.close = async () => {
              try {
                if (settings.currency === "VND") {
                  const module = await server.ssrLoadModule(resources);
                  module.closeAccountingResources();
                }
              } finally {
                await close();
              }
            };
          },
        }] } });
      },
      "astro:config:done": ({ config }) => {
        outputDirectory = fileURLToPath(config.outDir);
        if (outputDirectory.replace(/[\\/]$/, "") !== join(fileURLToPath(config.root), "dist")) {
          throw new Error("The Node accounting release requires the dist output directory.");
        }
      },
      "astro:build:done": () => {
        if (!outputDirectory) throw new Error("Accounting settings require a resolved Astro output directory.");
        writeManifest(join(outputDirectory, "accounting-settings.json"));
      },
    },
  };
}
