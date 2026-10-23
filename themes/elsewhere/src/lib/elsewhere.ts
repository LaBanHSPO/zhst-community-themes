import { getEmDashCollection } from "emdash";
import type { Post, Profile } from "../../emdash-env";

export type { Post, Profile };

type ImageLike = { src?: string; alt?: string } | null | undefined;
type Keyed = { slug: string | null; id: string };

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function photoAlt(image: ImageLike, alt: string | null | undefined, fallback: string): string {
	return image?.alt || alt || fallback;
}

export function entryKey(entry: Keyed): string {
	return entry.slug ?? entry.id;
}

export function postUrl(entry: Keyed): string {
	return `/posts/${encodeURIComponent(entryKey(entry))}`;
}

export const REGIONS = [
	{ value: "europe", label: "Europe" },
	{ value: "asia", label: "Asia" },
	{ value: "coastal", label: "Coastal" },
] as const;
export type RegionValue = (typeof REGIONS)[number]["value"];

export function isRegion(value: string | null | undefined): value is RegionValue {
	return REGIONS.some((r) => r.value === value);
}
export function regionLabel(value: string | null | undefined): string {
	return REGIONS.find((r) => r.value === value)?.label ?? "";
}

export function formatDate(value: Date | string | null | undefined): string {
	if (!value) return "";
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "Asia/Saigon" });
}

export async function getPosts(limit = 100) {
	return getEmDashCollection("posts", { orderBy: { position: "asc" }, limit });
}

const FALLBACK_PROFILE = { title: "Claire Montgomery", email: "" };

/** The single author profile entry; null-safe for an empty CMS. */
export async function getProfile() {
	const { entries, cacheHint } = await getEmDashCollection("profile", { limit: 1 });
	const profile: Partial<Profile> & typeof FALLBACK_PROFILE = entries[0]?.data ?? FALLBACK_PROFILE;
	return { profile, cacheHint };
}

export function sortByPosition<T extends { data: { position?: number } }>(entries: T[]): T[] {
	return [...entries].sort((a, b) => (a.data.position ?? 0) - (b.data.position ?? 0));
}

export function mailtoHref(email: string, subject: string, body: string): string {
	return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export type Block = { _type?: string; style?: string; children?: { text?: string }[] };
export type ArticleSection = { id: string; title: string; blocks: Block[] };

/** Splits a Portable Text body into numbered sections at each h2; text before the first h2 is dropped into section 1. */
export function splitSections(content: Block[] | undefined): ArticleSection[] {
	const sections: ArticleSection[] = [];
	for (const block of content ?? []) {
		if (block._type === "block" && block.style === "h2") {
			const title = (block.children ?? []).map((c) => c.text ?? "").join("");
			sections.push({ id: `section-${sections.length + 1}`, title, blocks: [] });
		} else if (sections.length > 0) {
			sections[sections.length - 1].blocks.push(block);
		} else {
			sections.push({ id: "section-1", title: "", blocks: [block] });
		}
	}
	return sections;
}
