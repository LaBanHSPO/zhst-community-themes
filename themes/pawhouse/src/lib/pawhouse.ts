import { getEmDashCollection } from "emdash";
import type { Business, Faq, GalleryPhoto, GroomingService, Highlight, Preview, Room, TeamMember } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
}

export const PETS = ["dog", "cat"] as const;
export type Pet = (typeof PETS)[number];

export function isPet(value: string | null | undefined): value is Pet {
	return value === "dog" || value === "cat";
}

export function roomUrl(entry: { slug: string | null; id: string }): string {
	return `/hotel/${encodeURIComponent(entry.slug ?? entry.id)}`;
}

/** Booking form link; options preselect what to book (grooming or hotel), the pet, a grooming service or a room. */
export function bookingUrl(options: { book?: "grooming" | "hotel"; pet?: Pet; service?: string; room?: string } = {}): string {
	const params = new URLSearchParams();
	if (options.book) params.set("book", options.book);
	if (options.pet) params.set("pet", options.pet);
	if (options.service) params.set("service", options.service);
	if (options.room) params.set("room", options.room);
	const qs = params.toString();
	return `/booking${qs ? `?${qs}` : ""}`;
}

/** "$50" style price, or null when the entry has none. */
export function money(value: number | null | undefined): string | null {
	if (value === null || value === undefined || Number.isNaN(value)) return null;
	return `$${value.toLocaleString("en-US")}`;
}

export async function getGrooming(pet?: Pet) {
	const { entries, cacheHint } = await getEmDashCollection("grooming", { orderBy: { position: "asc" }, limit: 60 });
	return { entries: pet ? entries.filter((e) => (e.data.pet ?? "dog") === pet) : entries, cacheHint };
}

export async function getRooms() {
	return getEmDashCollection("rooms", { orderBy: { position: "asc" }, limit: 24 });
}

async function byPlacement<K extends "previews" | "highlights" | "gallery">(collection: K, placement: string) {
	const { entries, cacheHint } = await getEmDashCollection(collection, { orderBy: { position: "asc" }, limit: 60 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

/** Photo preview cards for one page: `home`, `booking` or `space`. */
export const getPreviews = (placement: string) => byPlacement("previews", placement);
/** Short benefits for one page: `grooming`, `hotel` or `booking`. */
export const getHighlights = (placement: string) => byPlacement("highlights", placement);
/** Space photos for one page: `home` or `hotel`. */
export const getGallery = (placement: string) => byPlacement("gallery", placement);

export async function getTeam() {
	return getEmDashCollection("team", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getFaqs() {
	return getEmDashCollection("faqs", { orderBy: { position: "asc" }, limit: 30 });
}

const FALLBACK_BUSINESS: Pick<Business, "title" | "email"> = { title: "Pawhouse", email: "" };

/** The single business entry (booking email, phone); null-safe for an empty CMS. */
export async function getBusiness() {
	const { entries, cacheHint } = await getEmDashCollection("business", { limit: 1 });
	const business: Partial<Business> & typeof FALLBACK_BUSINESS = entries[0]?.data ?? FALLBACK_BUSINESS;
	return { business, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export type { Business, Faq, GalleryPhoto, GroomingService, Highlight, Preview, Room, TeamMember };
