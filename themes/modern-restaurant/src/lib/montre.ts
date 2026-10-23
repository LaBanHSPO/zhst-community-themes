import { getEmDashCollection } from "emdash";
import type { Dish, Gallery, Highlight, Venue } from "../../emdash-env";

/** Menu courses in display order; slugs match the `course` select options. */
export const COURSES = [
	{ slug: "snacks", label: "To begin", note: "Small bites while you settle in" },
	{ slug: "starters", label: "First courses", note: "Light, bright and seasonal" },
	{ slug: "mains", label: "Main courses", note: "From our growers, the day boat and the grill" },
	{ slug: "sides", label: "For the table", note: "To share" },
	{ slug: "desserts", label: "Desserts", note: "Something sweet, or something from the cheese trolley" },
	{ slug: "drinks", label: "To drink", note: "Pairings, house aperitifs and alcohol-free" },
] as const;

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export async function getDishes() {
	return getEmDashCollection("dishes", { orderBy: { position: "asc" }, limit: 300 });
}

export async function getGallery() {
	return getEmDashCollection("gallery", { orderBy: { position: "asc" }, limit: 120 });
}

export async function getHighlights(placement: Highlight["placement"]) {
	const { entries, cacheHint } = await getEmDashCollection("highlights", { orderBy: { position: "asc" }, limit: 60 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

export async function getHours() {
	return getEmDashCollection("hours", { orderBy: { position: "asc" }, limit: 14 });
}

const FALLBACK_VENUE: Pick<Venue, "title" | "street" | "locality" | "email"> = {
	title: "Montré",
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

export type { Dish, Gallery, Highlight };
