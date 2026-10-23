import { getEmDashCollection } from "emdash";
import type { Feature, Item, Venue } from "../../emdash-env";

/** Menu sections in display order; values match the `category` select options. */
export const SECTIONS = [
	{ slug: "coffee", label: "Coffee", note: "Carefully sourced, expertly brewed" },
	{ slug: "bakery", label: "Bakery", note: "Seasonal ingredients, always fresh" },
	{ slug: "cakes", label: "Celebration cakes", note: "Whole cakes to preorder" },
] as const;

type ImageLike = { src?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
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

/** Highlights for one placement (homepage trio, our-space trio, seating details). */
export async function getFeatures(placement: string) {
	const { entries, cacheHint } = await getEmDashCollection("features", { orderBy: { position: "asc" }, limit: 60 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

const FALLBACK_VENUE: Pick<Venue, "title" | "street" | "locality" | "email"> = {
	title: "Slowmorning",
	street: "",
	locality: "",
	email: "",
};

/** The single venue entry (address, contact, map labels); null-safe for an empty CMS. */
export async function getVenue() {
	const { entries, cacheHint } = await getEmDashCollection("venue", { limit: 1 });
	const venue: Partial<Venue> & typeof FALLBACK_VENUE = entries[0]?.data ?? FALLBACK_VENUE;
	return { venue, cacheHint };
}

export type { Feature, Item };
