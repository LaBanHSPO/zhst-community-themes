import { getEmDashCollection } from "emdash";
import { byOrder } from "./business";

type CollectionName = "services" | "areas" | "team" | "gallery";

/**
 * Load every published entry of a theme collection, sorted by `order`.
 * A missing collection (e.g. a site set up without this theme's schema) or a
 * query failure resolves to an empty list so pages render their empty state.
 */
export async function loadOrdered<C extends CollectionName>(collection: C, limit = 100) {
	try {
		const result = await getEmDashCollection(collection, { limit });
		return { entries: byOrder(result.entries), cacheHint: result.cacheHint };
	} catch (error) {
		console.error(`[localcraft] Failed to load ${collection}:`, error);
		return { entries: [], cacheHint: undefined };
	}
}

/** Services tagged with one `area` taxonomy term. */
export async function loadServicesInArea(areaSlug: string) {
	try {
		const result = await getEmDashCollection("services", { where: { area: areaSlug }, limit: 100 });
		return byOrder(result.entries);
	} catch (error) {
		console.error(`[localcraft] Failed to load services for area ${areaSlug}:`, error);
		return [];
	}
}
