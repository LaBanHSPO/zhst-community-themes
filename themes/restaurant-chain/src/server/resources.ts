import { env } from "cloudflare:workers";
import {
	parseCredentialContexts,
	type IntegrationOptions,
} from "@zerohost/plugin-restaurant-chain/server";

export function restaurantResources(): IntegrationOptions {
	return {
		db: env.RESTAURANT_DB,
		queue: env.RESTAURANT_JOBS,
		contexts: parseCredentialContexts(process.env.SEPAY_CONTEXTS || "{}"),
	};
}
