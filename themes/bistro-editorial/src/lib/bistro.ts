import { getEmDashCollection } from "emdash";
import type { Dish, Venue } from "../../emdash-env";

/** Menu sections in display order; values match the `category` select options. */
export const CATEGORIES = [
	{ slug: "starters", label: "Starters" },
	{ slug: "mains", label: "Mains" },
	{ slug: "pastas", label: "Pastas" },
	{ slug: "seafood", label: "Seafood" },
	{ slug: "steaks", label: "Steaks" },
	{ slug: "sides", label: "Sides" },
	{ slug: "desserts", label: "Desserts" },
] as const;

export const DIETARY: Record<string, { label: string; short: string }> = {
	vegetarian: { label: "Vegetarian", short: "leaf" },
	"vegan-on-request": { label: "Vegan on request", short: "V" },
	"gluten-free": { label: "Gluten-free", short: "GF" },
};

type ImageLike = { src?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
}

export function formatPrice(price: number | null | undefined): string {
	if (typeof price !== "number" || !Number.isFinite(price)) return "";
	return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

export function dishUrl(dish: { slug: string | null; id: string }): string {
	return `/menu/${encodeURIComponent(dish.slug ?? dish.id)}`;
}

export function categoryLabel(slug: string): string {
	return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export async function getDishes() {
	return getEmDashCollection("dishes", { orderBy: { position: "asc" }, limit: 200 });
}

const FALLBACK_VENUE: Pick<Venue, "title" | "street" | "locality" | "email"> = {
	title: "Bistro",
	street: "",
	locality: "",
	email: "",
};

/** The single venue entry (address, contact, map); null-safe for an empty CMS. */
export async function getVenue() {
	const { entries, cacheHint } = await getEmDashCollection("venue", { limit: 1 });
	const venue: Partial<Venue> & typeof FALLBACK_VENUE = entries[0]?.data ?? FALLBACK_VENUE;
	return { venue, cacheHint };
}

export type { Dish };
