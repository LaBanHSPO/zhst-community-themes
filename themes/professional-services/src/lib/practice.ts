import { getEmDashCollection } from "emdash";
import type { Insight, Office, People as Person, Principle, Service } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

/** Newest first by the article's own date (seeded content shares one publish timestamp). */
export async function getInsights(limit = 50) {
	return getEmDashCollection("insights", { orderBy: { date: "desc" }, limit });
}

export async function getValues() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 40 });
}

export async function getPeople() {
	return getEmDashCollection("people", { orderBy: { position: "asc" }, limit: 60 });
}

const FALLBACK_OFFICE: Pick<Office, "title" | "street" | "locality" | "email"> = {
	title: "",
	street: "",
	locality: "",
	email: "",
};

export type OfficeData = Partial<Office> & typeof FALLBACK_OFFICE;

/** The single office entry (address, contact); null-safe for an empty CMS. */
export async function getOffice() {
	const { entries, cacheHint } = await getEmDashCollection("office", { limit: 1 });
	const office: OfficeData = entries[0]?.data ?? FALLBACK_OFFICE;
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

/** Article date: the editorial `date` field, else the publish timestamp. */
export function articleDate(date: string | Date | null | undefined, publishedAt: Date | null): Date | null {
	if (date) {
		const d = date instanceof Date ? date : new Date(date);
		if (!Number.isNaN(d.getTime())) return d;
	}
	return publishedAt;
}

export function formatDate(d: Date): string {
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Saigon" }).format(d);
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

/** Two-digit index label ("01", "02", …) used for numbered lists. */
export function indexLabel(i: number): string {
	return String(i + 1).padStart(2, "0");
}

export function entryHref(base: string, data: { slug: string | null; id: string }): string {
	return `${base}/${data.slug ?? data.id}`;
}

export type { Insight, Person, Principle, Service };
