export const prerender = false;

import type { APIRoute } from "astro";
import { hasPermission } from "@emdash-cms/auth";
import { after } from "emdash";
import {
	apiFailure,
	handleRestaurantRequest,
	dispatchOutbox,
} from "@zerohost/plugin-restaurant-chain/server";
import { restaurantResources } from "../../../server/resources.js";

export const ALL: APIRoute = async ({ request, params, locals }) => {
	try {
		const user = locals.user;
		const actor = user
			? { id: user.id, administrator: hasPermission(user, "settings:manage") }
			: null;
		const resources = restaurantResources();
		const action = params.action || "";
		const response = await handleRestaurantRequest(request, action, actor, resources);
		if (
			response.ok &&
			request.method === "POST" &&
			["request-invoice", "issue-invoice", "correct-invoice", "reconcile-invoice"].includes(action)
		) {
			after(async () => {
				try {
					await dispatchOutbox(resources);
				} catch {
					console.error(
						"[restaurant] immediate outbox dispatch failed; scheduled recovery will retry",
					);
				}
			});
		}
		return response;
	} catch {
		return apiFailure("CONFIGURATION_ERROR", "Restaurant service is not configured.", 503);
	}
};
