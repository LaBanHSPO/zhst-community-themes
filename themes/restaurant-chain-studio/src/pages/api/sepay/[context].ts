export const prerender = false;

import type { APIRoute } from "astro";
import { receivePaymentWebhook, apiFailure } from "@zerohost/plugin-restaurant-chain/server";
import { restaurantResources } from "../../../server/resources.js";

export const POST: APIRoute = async ({ request, params }) => {
	try {
		return await receivePaymentWebhook(request, params.context || "", restaurantResources());
	} catch {
		return apiFailure(
			"WEBHOOK_UNAVAILABLE",
			"The payment notification could not be persisted.",
			503,
		);
	}
};
