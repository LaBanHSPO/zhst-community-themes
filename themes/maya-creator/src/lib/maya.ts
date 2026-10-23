import { getEmDashCollection } from "emdash";
import type { Post, Profile } from "../../emdash-env";

export type { Post };

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

export type LibraryTab = "recipes" | "stories" | "video";
export const LIBRARY_TABS: { value: LibraryTab; label: string }[] = [
	{ value: "recipes", label: "Recipes" },
	{ value: "stories", label: "Stories" },
	{ value: "video", label: "Video" },
];

export function isLibraryTab(value: string | null | undefined): value is LibraryTab {
	return LIBRARY_TABS.some((t) => t.value === value);
}

/** Recipes tab = recipes, Stories tab = written stories, Video tab = anything published as video. */
export function inTab(post: Pick<Post, "kind" | "format">, tab: LibraryTab): boolean {
	if (tab === "recipes") return post.kind === "recipe";
	if (tab === "video") return post.format === "video";
	return post.kind === "story" && post.format === "article";
}

/** Small label above a card title in the library grid. */
export function kindLabel(post: Pick<Post, "kind" | "format">): string {
	if (post.kind === "recipe") return "Recipes";
	return post.format === "video" ? "Video" : "Stories";
}

export async function getPosts(limit = 100) {
	return getEmDashCollection("posts", { orderBy: { position: "asc" }, limit });
}

const FALLBACK_PROFILE: Pick<Profile, "title" | "email"> = { title: "Maya", email: "" };

/** The single profile entry (contact email and social links); null-safe for an empty CMS. */
export async function getProfile() {
	const { entries, cacheHint } = await getEmDashCollection("profile", { limit: 1 });
	const profile: Partial<Profile> & typeof FALLBACK_PROFILE = entries[0]?.data ?? FALLBACK_PROFILE;
	return { profile, cacheHint };
}

export function sortByPosition<T extends { data: { position?: number } }>(entries: T[]): T[] {
	return [...entries].sort((a, b) => (a.data.position ?? 0) - (b.data.position ?? 0));
}

/** Compose and open a mailto: request. Used by the inline form scripts through data attributes. */
export function mailtoHref(email: string, subject: string, body: string): string {
	return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
