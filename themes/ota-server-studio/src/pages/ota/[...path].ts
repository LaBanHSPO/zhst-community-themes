/**
 * Public OTA API. This is the exact path shape the mobile clients call, so the
 * catch-all forwards the whole tail to the plugin:
 *
 *   GET    /ota/{app}/{platform}/manifest.json
 *   GET    /ota/{app}/{platform}/{file}
 *   POST   /ota/{app}/{platform}/releases
 *   DELETE /ota/{app}/{platform}/releases?channel=&binary=
 *   GET    /ota/{app}/{platform}/releases
 *
 * EmDash plugin routes cannot serve this: they always mount under
 * `/_emdash/api/plugins/{id}/*` and cap request bodies at 8 MiB, while a bundle
 * is 25-100 MiB. This route is therefore the contract's home. Responses carry
 * the caching, length and no-compression headers the apps depend on.
 */

export const prerender = false;

import type { APIRoute } from "astro";
import { handleOtaAppRequest } from "@zerohost/plugin-ota-server/server";
import { otaRuntime } from "../../server/resources.js";

export const ALL: APIRoute = async ({ request, params, locals }) => {
	try {
		return await handleOtaAppRequest(request, params.path ?? "", otaRuntime(locals));
	} catch (error) {
		// A missing binding is an operator problem, not a client one.
		console.error("[ota] app route failed", {
			errorType: error instanceof Error ? error.name : "unknown",
		});
		return Response.json(
			{ error: { code: "CONFIGURATION_ERROR", message: "The OTA server is not configured on this host." } },
			{ status: 503, headers: { "Cache-Control": "no-store" } },
		);
	}
};
