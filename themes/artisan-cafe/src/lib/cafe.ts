import { getEmDashCollection } from "emdash";
import type { Item, Venue } from "../../emdash-env";

/** Menu sections in display order; values match the `category` select options. */
export const SECTIONS = [
	{ slug: "coffee", label: "Coffee", title: "Coffee", note: "House blend and single origins, pulled with care" },
	{ slug: "tea", label: "Tea & more", title: "Tea & more", note: "For slower sips and warm hands" },
	{ slug: "pastries", label: "Pastries", title: "Pastries", note: "Baked in small batches every morning" },
	{ slug: "brunch", label: "Brunch", title: "Brunch", note: "Served until two, every day" },
] as const;

type ImageLike = { src?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function itemUrl(item: { slug: string | null; id: string }): string {
	return `/menu/${encodeURIComponent(item.slug ?? item.id)}`;
}

export function sectionLabel(slug: string): string {
	return SECTIONS.find((s) => s.slug === slug)?.label ?? slug;
}

export async function getItems() {
	return getEmDashCollection("items", { orderBy: { position: "asc" }, limit: 300 });
}

export async function getHours() {
	return getEmDashCollection("hours", { orderBy: { position: "asc" }, limit: 14 });
}

const FALLBACK_VENUE: Pick<Venue, "title" | "street" | "locality"> = {
	title: "Artisan Café",
	street: "",
	locality: "",
};

/** The single venue entry (address, contact, notes); null-safe for an empty CMS. */
export async function getVenue() {
	const { entries, cacheHint } = await getEmDashCollection("venue", { limit: 1 });
	const venue: Partial<Venue> & typeof FALLBACK_VENUE = entries[0]?.data ?? FALLBACK_VENUE;
	return { venue, cacheHint };
}

/** Google Maps search link built from the address when no explicit link is set. */
export function mapUrl(venue: Partial<Venue>): string | undefined {
	if (venue.directions_url) return venue.directions_url;
	const q = [venue.street, venue.locality, venue.country].filter(Boolean).join(", ");
	return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : undefined;
}

export type { Item };
