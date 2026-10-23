import { getEmDashCollection } from "emdash";
import type { Company, Experience, Guide } from "../../emdash-env";

export type { Company, Experience, Guide };

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

/** Alt text: the uploaded image's own alt, then the entry's description field, then a fallback. */
export function photoAlt(image: ImageLike, alt: string | null | undefined, fallback: string): string {
	return image?.alt || alt || fallback;
}

export function entryKey(entry: { slug: string | null; id: string }): string {
	return entry.slug ?? entry.id;
}

export function experienceUrl(entry: { slug: string | null; id: string }): string {
	return `/experiences/${encodeURIComponent(entryKey(entry))}`;
}

export function guideUrl(entry: { slug: string | null; id: string }): string {
	return `/guides/${encodeURIComponent(entryKey(entry))}`;
}

export function bookingUrl(entry?: { slug: string | null; id: string }): string {
	return entry ? `/booking-request?experience=${encodeURIComponent(entryKey(entry))}` : "/booking-request";
}

/** "€" + 65 -> "€65". */
export function money(amount: number, currency = "€"): string {
	return `${currency}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(amount)}`;
}

/** 2.5 -> "2.5 km". */
export function km(distance: number | null | undefined): string | undefined {
	if (typeof distance !== "number" || !Number.isFinite(distance) || distance <= 0) return undefined;
	return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(distance)} km`;
}

/** Splits text on blank lines into paragraphs. */
export function paragraphs(text: string | null | undefined): string[] {
	return (text ?? "")
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);
}

/** Splits text into its non-empty lines. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

/** The child price falls back to the adult price when not set. */
export function childPrice(e: Pick<Experience, "price" | "child_price">): number {
	return typeof e.child_price === "number" && e.child_price >= 0 ? e.child_price : e.price;
}

export async function getExperiences() {
	return getEmDashCollection("experiences", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getGuides() {
	return getEmDashCollection("guides", { orderBy: { position: "asc" }, limit: 50 });
}

const FALLBACK_COMPANY: Pick<Company, "title" | "email"> = { title: "Localways", email: "" };

/** The single business-details entry (booking email, phone, currency); null-safe for an empty CMS. */
export async function getCompany() {
	const { entries, cacheHint } = await getEmDashCollection("company", { limit: 1 });
	const company: Partial<Company> & typeof FALLBACK_COMPANY = entries[0]?.data ?? FALLBACK_COMPANY;
	return { company, cacheHint };
}

/** ISO yyyy-mm-dd for today in the business's display timezone. */
export function todayIso(): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Saigon" }).format(new Date());
}

/** Sorted unique non-empty values. */
export function distinct(values: (string | null | undefined)[]): string[] {
	return [...new Set(values.map((v) => (v ?? "").trim()).filter(Boolean))].sort((a, b) =>
		a.localeCompare(b, "en", { numeric: true }),
	);
}
