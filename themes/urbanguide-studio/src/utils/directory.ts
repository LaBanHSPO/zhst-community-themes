import { getEmDashCollection, getTaxonomyTermsWithCacheHint } from "emdash";
import { resolveCategory } from "./categories";

type Cache = { set: (hint: any) => void; enabled?: boolean } | undefined;

/** Category terms (resolved for display) and every published listing. */
export async function loadDirectory(cache: Cache, limit = 200) {
	const [termsResult, listingsResult] = await Promise.all([
		getTaxonomyTermsWithCacheHint("category", { includeCounts: false }),
		getEmDashCollection("listings", { limit }),
	]);
	if (cache?.enabled) {
		cache.set(termsResult.cacheHint);
		cache.set(listingsResult.cacheHint);
	}
	const terms = termsResult.data.map((t) => ({ slug: t.slug, label: t.label }));
	const listings = listingsResult.entries;
	const counts = new Map<string, number>();
	for (const listing of listings) {
		const cat = resolveCategory(listing.data.category, terms);
		if (cat) counts.set(cat.slug, (counts.get(cat.slug) ?? 0) + 1);
	}
	const categories = terms
		.map((t) => resolveCategory(t.slug, terms))
		.filter((c): c is NonNullable<typeof c> => Boolean(c))
		.map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 }));
	return { terms, listings, categories };
}
