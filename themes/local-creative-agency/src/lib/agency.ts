import { getEmDashCollection } from "emdash";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getProjects(limit = 60) {
	return getEmDashCollection("projects", { orderBy: { position: "asc" }, limit });
}

export async function getPeople() {
	return getEmDashCollection("people", { orderBy: { position: "asc" }, limit: 40 });
}

export async function getValues() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 40 });
}

export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
}

export interface OfficeData {
	title: string;
	street?: string | null;
	locality?: string | null;
	country?: string | null;
	phone?: string | null;
	email?: string | null;
	hours?: string | null;
	response_note?: string | null;
}

const FALLBACK_OFFICE: OfficeData = { title: "", street: "", locality: "", email: "" };

/** The single contact-details entry; null-safe for an empty CMS. */
export async function getOffice() {
	const { entries, cacheHint } = await getEmDashCollection("office", { limit: 1 });
	const office: OfficeData = (entries[0]?.data as OfficeData | undefined) ?? FALLBACK_OFFICE;
	return { office, cacheHint };
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(office: OfficeData): string {
	const query = [office.street, office.locality, office.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Comma-separated tag field → clean list. */
export function tagList(tags: string | null | undefined): string[] {
	return (tags ?? "")
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);
}

/** "Brand, Packaging" → "Brand & Packaging" (the tracked caps label under a work card). */
export function disciplineLabel(tags: string | null | undefined): string {
	return tagList(tags).join(" & ");
}

export function tagSlug(tag: string): string {
	return tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function entryHref(base: string, data: { slug?: string | null; id: string }): string {
	return `${base}/${data.slug ?? data.id}`;
}
