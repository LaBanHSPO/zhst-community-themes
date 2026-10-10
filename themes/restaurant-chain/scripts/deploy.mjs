import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const built = new URL("../dist/server/wrangler.json", import.meta.url);
const config = JSON.parse(await readFile(built, "utf8"));
if (config.vars?.RESTAURANT_ENVIRONMENT !== "production") {
	throw new Error(
		"Refusing to deploy local resources. Configure resources and run npm run build:production first.",
	);
}
if (process.env.RESTAURANT_DEPLOY_APPROVED !== config.name) {
	throw new Error(
		"Set RESTAURANT_DEPLOY_APPROVED to the reviewed Worker name after migration, secrets, backup and promotion review.",
	);
}
const result = spawnSync("wrangler", ["deploy", "--config", built.pathname], { stdio: "inherit" });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
