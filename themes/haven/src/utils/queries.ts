import { getEmDashCollection } from "emdash";
import { distinctLocations } from "./listing";

/**
 * Upper bound for listing queries. Haven targets boutique agencies with a
 * modest number of live listings; raise this (or add pagination) for larger
 * inventories.
 */
export const MAX_LISTINGS = 200;

/** Published property locations, for the search form's location select. */
export async function getLocations() {
	const { entries, cacheHint } = await getEmDashCollection("properties", {
		limit: MAX_LISTINGS,
	});
	return { locations: distinctLocations(entries.map((e) => e.data.location)), cacheHint };
}
