/**
 * End-to-end verification of the built Worker.
 *
 * Builds nothing, but requires `dist/server/entry.mjs` (run `npm run build`
 * first). It starts the compiled Worker under Wrangler, seeds two push tokens,
 * and drives the real OTA contract over HTTP: manifest, multipart push,
 * byte-exact download, range resume, retention deletion, and the
 * authentication, length and caching headers the mobile apps depend on.
 *
 * Usage: npm run verify:local
 *
 * Everything stays on this machine: local D1/R2 state under `.wrangler/verify`,
 * no cloud credentials, no outbound network.
 */

import { createHash, randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { access, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const stateDir = join(root, ".wrangler", "verify");
const port = Number(process.env.OTA_VERIFY_PORT ?? 4343);
const origin = `http://127.0.0.1:${port}`;
const boundary = "----otaVerifyBoundary";
const APP = "unitel-man";
const OTHER_APP = "unitel-logistics";
const CHANNEL = "ducnv/feature/luu-kho";
const BINARY = "1.0.66+93";

const xdg = {
	XDG_CONFIG_HOME: join(stateDir, "xdg", "config"),
	XDG_CACHE_HOME: join(stateDir, "xdg", "cache"),
	XDG_DATA_HOME: join(stateDir, "xdg", "data"),
	WRANGLER_LOG_PATH: join(stateDir, "logs"),
};

const failures = [];
let checks = 0;

function check(name, condition, detail = "") {
	checks += 1;
	if (condition) {
		console.log(`  ok   ${name}`);
		return true;
	}
	failures.push(`${name}${detail === "" ? "" : ` — ${detail}`}`);
	console.log(`  FAIL ${name}${detail === "" ? "" : ` — ${detail}`}`);
	return false;
}

function sha256(value) {
	return createHash("sha256").update(value).digest("hex");
}

function multipart(parts) {
	const chunks = [];
	for (const part of parts) {
		chunks.push(Buffer.from(`--${boundary}\r\n`));
		const filename = part.filename === undefined ? "" : `; filename="${part.filename}"`;
		chunks.push(Buffer.from(`Content-Disposition: form-data; name="${part.name}"${filename}\r\n`));
		if (part.contentType) chunks.push(Buffer.from(`Content-Type: ${part.contentType}\r\n`));
		chunks.push(Buffer.from("\r\n"));
		chunks.push(Buffer.isBuffer(part.value) ? part.value : Buffer.from(part.value ?? ""));
		chunks.push(Buffer.from("\r\n"));
	}
	chunks.push(Buffer.from(`--${boundary}--\r\n`));
	return Buffer.concat(chunks);
}

/** A fresh body per request: `fetch` may detach a reused typed-array body. */
function releaseRequest(token, bundle, overrides = {}) {
	const body = multipart([
		{ name: "channel", value: overrides.channel ?? CHANNEL },
		{ name: "binary", value: overrides.binary ?? BINARY },
		{ name: "sha256", value: overrides.sha256 ?? sha256(bundle) },
		{ name: "note", value: "verify-local" },
		{ name: "commit", value: "deadbeef" },
		{ name: "bundle", filename: "app.bundle", contentType: "application/octet-stream", value: bundle },
	]);
	const headers = { "content-type": `multipart/form-data; boundary=${boundary}` };
	if (token !== null) headers.authorization = `Bearer ${token}`;
	return { body, headers };
}

async function runWrangler(args) {
	return new Promise((resolvePromise, reject) => {
		const child = spawn("npx", ["wrangler", ...args], {
			cwd: root,
			stdio: ["ignore", "pipe", "pipe"],
			env: { ...process.env, ...xdg },
		});
		let output = "";
		child.stdout.on("data", (chunk) => {
			output += chunk;
		});
		child.stderr.on("data", (chunk) => {
			output += chunk;
		});
		child.on("error", reject);
		child.on("close", (code) => resolvePromise({ code, output }));
	});
}

async function waitForServer(deadlineMs = 120_000) {
	const started = Date.now();
	while (Date.now() - started < deadlineMs) {
		try {
			const response = await fetch(`${origin}/ota/${APP}/android/manifest.json`);
			if (response.status === 200) return true;
		} catch {
			// Not listening yet.
		}
		await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
	}
	return false;
}

try {
	await access(join(root, "dist", "server", "entry.mjs"));
} catch {
	console.error("dist/server/entry.mjs is missing. Run `npm run build` first.");
	process.exit(2);
}

await rm(stateDir, { recursive: true, force: true });
await mkdir(join(stateDir, "logs"), { recursive: true });

const localArgs = ["--local", "--config", "wrangler.jsonc", "--persist-to", join(stateDir, "state")];

console.log(`\nSeeding local D1 under ${stateDir}`);
const migrate = await runWrangler(["d1", "migrations", "apply", "OTA_DB", ...localArgs]);
if (migrate.code !== 0) {
	console.error(migrate.output);
	process.exit(1);
}

const token = `otak_${randomBytes(32).toString("base64url")}`;
const otherToken = `otak_${randomBytes(32).toString("base64url")}`;
const now = Date.now();
await writeFile(
	join(stateDir, "seed.sql"),
	[
		`INSERT INTO ota_tokens (id, app, name, token_hash, token_prefix, created_at, last_used_at, revoked_at) VALUES ('verify-token', '${APP}', 'verify', '${sha256(Buffer.from(token))}', '${token.slice(0, 13)}', ${now}, NULL, NULL);`,
		`INSERT INTO ota_tokens (id, app, name, token_hash, token_prefix, created_at, last_used_at, revoked_at) VALUES ('verify-token-other', '${OTHER_APP}', 'verify', '${sha256(Buffer.from(otherToken))}', '${otherToken.slice(0, 13)}', ${now}, NULL, NULL);`,
		"",
	].join("\n"),
);
const seed = await runWrangler(["d1", "execute", "OTA_DB", ...localArgs, "--file", join(stateDir, "seed.sql")]);
if (seed.code !== 0) {
	console.error(seed.output);
	process.exit(1);
}

console.log(`Starting the built Worker on ${origin}`);
const server = spawn(
	"npx",
	[
		"wrangler",
		"dev",
		"--config",
		"dist/server/wrangler.json",
		"--local",
		"--port",
		String(port),
		"--persist-to",
		join(stateDir, "state"),
	],
	{ cwd: root, stdio: "ignore", env: { ...process.env, ...xdg } },
);

try {
	if (!(await waitForServer())) throw new Error(`the Worker did not answer on ${origin} within 120s`);

	console.log("\nmanifest");
	let response = await fetch(`${origin}/ota/${APP}/android/manifest.json`);
	check("empty manifest answers 200", response.status === 200, `got ${response.status}`);
	check(
		"manifest is uncached",
		response.headers.get("cache-control") === "no-cache",
		String(response.headers.get("cache-control")),
	);
	check('empty manifest body is {"channels":{}}', JSON.stringify(await response.json()) === '{"channels":{}}');

	response = await fetch(`${origin}/ota/${APP}/windows/manifest.json`);
	check("unknown platform answers 404", response.status === 404, `got ${response.status}`);

	response = await fetch(`${origin}/ota/${APP}/android/releases`);
	check("release list requires a token", response.status === 401, `got ${response.status}`);

	response = await fetch(`${origin}/api/ota/info`);
	check("admin API rejects an anonymous caller", response.status === 403, `got ${response.status}`);

	console.log("\npush");
	const bundle = randomBytes(3 * 1024 * 1024);
	response = await fetch(`${origin}/ota/${APP}/android/releases`, { method: "POST", ...releaseRequest(token, bundle) });
	const created = await response.json();
	check("push answers 201", response.status === 201, `got ${response.status} ${JSON.stringify(created).slice(0, 200)}`);
	check(
		"push returns the manifest entry shape",
		Object.keys(created).sort().join(",") === "branch,commit,createdAt,file,id,note,sha256,size",
		Object.keys(created).join(","),
	);
	check(
		"file path uses the slugged channel",
		created.file === `bundles/ducnv_feature_luu-kho/${BINARY}/${created.id}.bundle`,
		String(created.file),
	);
	check("declared and computed sha256 match", created.sha256 === sha256(bundle));
	check("size matches the uploaded bytes", created.size === bundle.byteLength, `${created.size} vs ${bundle.byteLength}`);
	check("release id is a UTC timestamp", /^\d{8}-\d{6}$/.test(created.id), String(created.id));

	response = await fetch(`${origin}/ota/${APP}/android/releases`, {
		method: "POST",
		...releaseRequest(token, bundle, { sha256: "0".repeat(64) }),
	});
	check("sha256 mismatch answers 400", response.status === 400, `got ${response.status}`);

	response = await fetch(`${origin}/ota/${APP}/android/releases`, { method: "POST", ...releaseRequest(null, bundle) });
	check("push without a token answers 401", response.status === 401, `got ${response.status}`);

	response = await fetch(`${origin}/ota/${APP}/android/releases`, { method: "POST", ...releaseRequest(otherToken, bundle) });
	check("token for another app answers 403", response.status === 403, `got ${response.status}`);

	console.log("\ndownload");
	response = await fetch(`${origin}/ota/${APP}/android/${created.file}`, { headers: { "accept-encoding": "identity" } });
	const served = Buffer.from(await response.arrayBuffer());
	check("bundle answers 200", response.status === 200, `got ${response.status}`);
	check(
		"Content-Length is present and exact",
		response.headers.get("content-length") === String(bundle.byteLength),
		String(response.headers.get("content-length")),
	);
	check(
		"no Content-Encoding is applied",
		response.headers.get("content-encoding") === null,
		String(response.headers.get("content-encoding")),
	);
	check(
		"bundle is immutable-cacheable",
		response.headers.get("cache-control") === "public, max-age=31536000, immutable",
		String(response.headers.get("cache-control")),
	);
	check("bytes are identical to the upload", sha256(served) === sha256(bundle));
	check(
		"ETag is the bundle sha256",
		response.headers.get("etag") === `"${sha256(bundle)}"`,
		String(response.headers.get("etag")),
	);

	response = await fetch(`${origin}/ota/${APP}/android/${created.file}`, { headers: { range: "bytes=0-1023" } });
	const partial = Buffer.from(await response.arrayBuffer());
	check("range request answers 206", response.status === 206, `got ${response.status}`);
	check(
		"range Content-Range is correct",
		response.headers.get("content-range") === `bytes 0-1023/${bundle.byteLength}`,
		String(response.headers.get("content-range")),
	);
	check(
		"range body is the requested prefix",
		partial.byteLength === 1024 && Buffer.compare(partial, bundle.subarray(0, 1024)) === 0,
	);

	response = await fetch(`${origin}/ota/${APP}/android/${created.file}`, { method: "HEAD" });
	check(
		"HEAD reports Content-Length",
		response.headers.get("content-length") === String(bundle.byteLength),
		String(response.headers.get("content-length")),
	);
	check("HEAD has no body", (await response.text()) === "");

	response = await fetch(`${origin}/ota/${APP}/android/bundles/guess/1.0.0/x.bundle`);
	check("unrecorded file answers 404", response.status === 404, `got ${response.status}`);

	console.log("\nmanifest after push");
	response = await fetch(`${origin}/ota/${APP}/android/manifest.json`);
	const manifest = await response.json();
	check(
		"manifest lists the channel",
		JSON.stringify(Object.keys(manifest.channels)) === JSON.stringify([CHANNEL]),
		JSON.stringify(Object.keys(manifest.channels)),
	);
	check(
		"manifest lists the binary",
		JSON.stringify(Object.keys(manifest.channels[CHANNEL] ?? {})) === JSON.stringify([BINARY]),
		JSON.stringify(manifest.channels[CHANNEL]),
	);
	check(
		"manifest entry equals the push response",
		JSON.stringify(manifest.channels[CHANNEL]?.[BINARY]) === JSON.stringify(created),
	);

	console.log("\ndelete");
	response = await fetch(
		`${origin}/ota/${APP}/android/releases?channel=${encodeURIComponent(CHANNEL)}&binary=${encodeURIComponent(BINARY)}`,
		{ method: "DELETE", headers: { authorization: `Bearer ${token}` } },
	);
	check("delete answers 204", response.status === 204, `got ${response.status}`);
	response = await fetch(`${origin}/ota/${APP}/android/manifest.json`);
	check("manifest is empty again", JSON.stringify(await response.json()) === '{"channels":{}}');
	response = await fetch(`${origin}/ota/${APP}/android/${created.file}`);
	check("deleted bundle is gone", response.status === 404, `got ${response.status}`);

	console.log("\nlanding page");
	response = await fetch(`${origin}/`);
	check("landing page answers 200", response.status === 200, `got ${response.status}`);
	check(
		"landing page links the workspace",
		(await response.text()).includes("/_emdash/admin/plugins/ota-server/workspace"),
	);
} finally {
	server.kill("SIGTERM");
	await new Promise((resolvePromise) => setTimeout(resolvePromise, 1500));
	if (!server.killed) server.kill("SIGKILL");
}

console.log(`\n${checks - failures.length}/${checks} checks passed`);
if (failures.length > 0) {
	console.error(`\n${failures.length} check(s) failed:`);
	for (const failure of failures) console.error(` - ${failure}`);
	process.exit(1);
}
console.log(`Raw state and Wrangler logs: ${stateDir}`);
