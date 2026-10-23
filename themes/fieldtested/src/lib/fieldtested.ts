import { getEmDashCollection } from "emdash";
import type { Guide, Product, Review, Site } from "../../emdash-env";

export type { Guide, Product, Review, Site };

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function photoAlt(image: ImageLike, alt: string | null | undefined, fallback: string): string {
	return image?.alt || alt || fallback;
}

type Keyed = { slug: string | null; id: string };
export const entryKey = (e: Keyed) => e.slug ?? e.id;
export const reviewUrl = (e: Keyed) => `/reviews/${encodeURIComponent(entryKey(e))}`;
export const guideUrl = (e: Keyed) => `/guides/${encodeURIComponent(entryKey(e))}`;
export const postUrl = (e: Keyed) => `/posts/${encodeURIComponent(entryKey(e))}`;

export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

/** "Label | value" lines to rows. */
export function specRows(text: string | null | undefined): { label: string; value: string }[] {
	return lines(text).map((l) => {
		const i = l.indexOf("|");
		return i < 0 ? { label: l, value: "" } : { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() };
	});
}

export function slugify(text: string): string {
	return text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const TZ = "Asia/Saigon";
export function shortDate(value: string | Date | null | undefined): string {
	if (!value) return "";
	const d = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: TZ }).format(d);
}
export function isoDate(value: string | Date | null | undefined): string | undefined {
	if (!value) return undefined;
	const d = value instanceof Date ? value : new Date(value);
	return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export const ACTIVITIES = [
	{ slug: "hiking", label: "Hiking" },
	{ slug: "camping", label: "Camping" },
	{ slug: "travel", label: "Travel" },
] as const;

export async function getReviews() {
	const r = await getEmDashCollection("reviews", { limit: 100 });
	const entries = [...r.entries].sort((a, b) => (b.data.date ?? "").localeCompare(a.data.date ?? ""));
	return { entries, cacheHint: r.cacheHint };
}

export async function getGuides() {
	return getEmDashCollection("guides", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getProducts() {
	return getEmDashCollection("products", { orderBy: { position: "asc" }, limit: 6 });
}

const FALLBACK: Site = {
	id: "main", slug: "main", status: "published", title: "Fieldtested",
	footer_disclosure: "We may earn a commission from purchases made through our links, at no extra cost to you.",
	createdAt: new Date(0), updatedAt: new Date(0), publishedAt: null,
};
export async function getSite() {
	const { entries, cacheHint } = await getEmDashCollection("site", { limit: 1 });
	const site = { ...FALLBACK, ...(entries[0]?.data ?? {}) };
	return { site, cacheHint };
}
