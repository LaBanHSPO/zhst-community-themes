/**
 * Listing vocabulary, formatting and search-criteria parsing for Haven.
 *
 * The select options here must match the `listing_type` / `property_type`
 * options declared in `seed/seed.json`.
 */

export const LISTING_TYPES = {
	sale: "For sale",
	rent: "To rent",
} as const;
export type ListingType = keyof typeof LISTING_TYPES;

export const PROPERTY_TYPES = {
	house: "House",
	villa: "Villa",
	apartment: "Apartment",
	townhouse: "Townhouse",
} as const;
export type PropertyType = keyof typeof PROPERTY_TYPES;

export interface BudgetBand {
	id: string;
	label: string;
	listing: ListingType;
	min?: number;
	max?: number;
}

/** Budget bands. Each band belongs to one listing type, so a rent band never matches sale prices. */
export const BUDGETS: readonly BudgetBand[] = [
	{ id: "under-750k", label: "Up to $750,000", listing: "sale", max: 750_000 },
	{ id: "750k-1250k", label: "$750,000 – $1,250,000", listing: "sale", min: 750_000, max: 1_250_000 },
	{ id: "1250k-2m", label: "$1,250,000 – $2,000,000", listing: "sale", min: 1_250_000, max: 2_000_000 },
	{ id: "over-2m", label: "$2,000,000 and above", listing: "sale", min: 2_000_000 },
	{ id: "rent-under-2500", label: "Up to $2,500 / month", listing: "rent", max: 2_500 },
	{ id: "rent-2500-4000", label: "$2,500 – $4,000 / month", listing: "rent", min: 2_500, max: 4_000 },
	{ id: "rent-over-4000", label: "$4,000 / month and above", listing: "rent", min: 4_000 },
];

const MAX_LOCATION_LENGTH = 80;

export interface SearchCriteria {
	listing?: ListingType;
	type?: PropertyType;
	location?: string;
	budget?: BudgetBand;
}

function isListingType(value: string): value is ListingType {
	return Object.hasOwn(LISTING_TYPES, value);
}

function isPropertyType(value: string): value is PropertyType {
	return Object.hasOwn(PROPERTY_TYPES, value);
}

/**
 * Parse search query parameters. Unknown listing/type/budget values are
 * dropped rather than trusted; the location is trimmed and length-limited and
 * matched case-insensitively against the locations that exist.
 */
export function parseSearch(params: URLSearchParams, knownLocations: readonly string[]): SearchCriteria {
	const criteria: SearchCriteria = {};

	const listing = params.get("listing")?.trim().toLowerCase() ?? "";
	if (isListingType(listing)) criteria.listing = listing;

	const type = params.get("type")?.trim().toLowerCase() ?? "";
	if (isPropertyType(type)) criteria.type = type;

	const location = (params.get("location") ?? "").trim().slice(0, MAX_LOCATION_LENGTH);
	if (location) {
		const known = knownLocations.find((l) => l.toLowerCase() === location.toLowerCase());
		criteria.location = known ?? location;
	}

	const budgetId = params.get("budget")?.trim() ?? "";
	const budget = BUDGETS.find((b) => b.id === budgetId);
	if (budget) criteria.budget = budget;

	return criteria;
}

export function hasCriteria(criteria: SearchCriteria): boolean {
	return Boolean(criteria.listing || criteria.type || criteria.location || criteria.budget);
}

/** Build a /search URL for the given criteria (used for "remove filter" links). */
export function searchHref(criteria: SearchCriteria): string {
	const params = new URLSearchParams();
	if (criteria.location) params.set("location", criteria.location);
	if (criteria.type) params.set("type", criteria.type);
	if (criteria.budget) params.set("budget", criteria.budget.id);
	if (criteria.listing) params.set("listing", criteria.listing);
	const qs = params.toString();
	return qs ? `/search?${qs}` : "/search";
}

/** True when a price falls inside a budget band (both bounds inclusive). */
export function inBudget(price: number | null | undefined, band: BudgetBand): boolean {
	if (typeof price !== "number" || !Number.isFinite(price)) return false;
	if (band.min !== undefined && price < band.min) return false;
	if (band.max !== undefined && price > band.max) return false;
	return true;
}

const usd = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

export function formatPrice(price: number | null | undefined, listing: string | null | undefined): string {
	if (typeof price !== "number" || !Number.isFinite(price)) return "Price on request";
	const amount = usd.format(price);
	return listing === "rent" ? `${amount} / month` : amount;
}

export function listingLabel(listing: string | null | undefined): string | null {
	return listing && isListingType(listing) ? LISTING_TYPES[listing] : null;
}

export function propertyTypeLabel(type: string | null | undefined): string | null {
	return type && isPropertyType(type) ? PROPERTY_TYPES[type] : null;
}

export function plural(count: number, one: string, many: string): string {
	return `${count} ${count === 1 ? one : many}`;
}

/** Distinct, sorted, non-empty location names. */
export function distinctLocations(values: Iterable<string | null | undefined>): string[] {
	const set = new Set<string>();
	for (const v of values) {
		const trimmed = v?.trim();
		if (trimmed) set.add(trimmed);
	}
	return [...set].sort((a, b) => a.localeCompare(b));
}

export function initials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	const letters = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
	return letters.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}
