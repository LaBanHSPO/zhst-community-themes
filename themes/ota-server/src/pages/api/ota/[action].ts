/**
 * Admin API for the OTA workspace (`/_emdash/admin/plugins/ota-server/workspace`).
 *
 * Session-authenticated and same-origin: the permission check happens here, the
 * CSRF check happens inside the plugin handler. JSON only, so the request size
 * never approaches a bundle.
 */

export const prerender = false;

import type { APIRoute } from "astro";
import { hasPermission } from "@emdash-cms/auth";
import { handleOtaAdminRequest } from "@zerohost/plugin-ota-server/server";
import { otaRuntime } from "../../../server/resources.js";

export const ALL: APIRoute = async ({ request, params, locals }) => {
	try {
		const user = locals.user;
		const actor = user ? { id: user.id, administrator: hasPermission(user, "settings:manage") } : null;
		return await handleOtaAdminRequest(request, params.action ?? "", { ...otaRuntime(locals), actor });
	} catch (error) {
		console.error("[ota] admin route failed", {
			errorType: error instanceof Error ? error.name : "unknown",
		});
		return Response.json(
			{ ok: false, error: { code: "CONFIGURATION_ERROR", message: "The OTA server is not configured on this host." } },
			{ status: 503, headers: { "Cache-Control": "private, no-store" } },
		);
	}
};
