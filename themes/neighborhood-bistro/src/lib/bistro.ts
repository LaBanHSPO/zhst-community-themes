import { getEmDashCollection } from "emdash";
import type { Dish, Highlight, Venue } from "../../emdash-env";

/** Menu courses in display order; slugs match the `course` select options. */
export const COURSES = [
	{ slug: "snacks", label: "To start", note: "Something to nibble while you decide" },
	{ slug: "starters", label: "Starters", note: "Bright, seasonal and made to share" },
	{ slug: "mains", label: "Mains", note: "Cooked to order from the day's market" },
	{ slug: "sides", label: "Sides", note: "For the middle of the table" },
	{ slug: "desserts", label: "Desserts", note: "A little something sweet" },
	{ slug: "drinks", label: "Drinks", note: "Small-producer wine and house cocktails" },
] as const;

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export async function getDishes() {
	return getEmDashCollection("dishes", { orderBy: { position: "asc" }, limit: 300 });
}

export async function getHighlights(placement: "story" | "booking") {
	const { entries, cacheHint } = await getEmDashCollection("highlights", { orderBy: { position: "asc" }, limit: 60 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

export async function getHours() {
	return getEmDashCollection("hours", { orderBy: { position: "asc" }, limit: 14 });
}

const FALLBACK_VENUE: Pick<Venue, "title" | "street" | "locality" | "email"> = {
	title: "Neighborhood Bistro",
	street: "",
	locality: "",
	email: "",
};

export type VenueData = Partial<Venue> & typeof FALLBACK_VENUE;

/** The single venue entry (address, contact); null-safe for an empty CMS. */
export async function getVenue() {
	const { entries, cacheHint } = await getEmDashCollection("venue", { limit: 1 });
	const venue: VenueData = entries[0]?.data ?? FALLBACK_VENUE;
	return { venue, cacheHint };
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapLinks(venue: VenueData) {
	const query = [venue.title, venue.street, venue.locality, venue.country].filter(Boolean).join(", ");
	return {
		map: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
		directions:
			venue.directions_url || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`,
	};
}

export type { Dish, Highlight };
