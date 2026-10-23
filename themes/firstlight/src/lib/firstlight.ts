import { getEmDashCollection } from "emdash";
import type { Faq, Feature, Highlight, Launch, RoadmapItem } from "../../emdash-env";

export type { Faq, Feature, Highlight, Launch, RoadmapItem };

type ImageLike = { src?: string; alt?: string } | null | undefined;
type Keyed = { slug: string | null; id: string };

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

/** Alt text: the uploaded image's own alt, then the entry's alt field, then a fallback. */
export function photoAlt(image: ImageLike, alt: string | null | undefined, fallback: string): string {
	return image?.alt || alt || fallback;
}

export function entryKey(entry: Keyed): string {
	return entry.slug ?? entry.id;
}

export function roadmapUrl(entry: Keyed): string {
	return `/roadmap/${encodeURIComponent(entryKey(entry))}`;
}

/** Roadmap columns in the order the public roadmap shows them. */
export const STATUSES = [
	{ value: "planned", label: "Planned", blurb: "Ideas we’re preparing to build.", icon: "leaf" },
	{ value: "in-progress", label: "In progress", blurb: "Actively building and refining.", icon: "progress" },
	{ value: "next", label: "Next", blurb: "Exploring and prioritizing.", icon: "bars" },
] as const;

export function statusInfo(value: string | null | undefined) {
	return STATUSES.find((s) => s.value === value) ?? STATUSES[0];
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

const byPosition = (a: { data: { position?: number } }, b: { data: { position?: number } }) =>
	(a.data.position ?? 999) - (b.data.position ?? 999);

/** Benefit trios and the "What to expect" list, filtered by where they show. */
export async function getFeatures(placement: "home" | "preview" | "confirmation" | "expect") {
	const result = await getEmDashCollection("features", { limit: 100 });
	const entries = result.entries.filter((e) => e.data.placement === placement).sort(byPosition);
	return { entries, cacheHint: result.cacheHint };
}

export async function getHighlights() {
	const result = await getEmDashCollection("highlights", { limit: 50 });
	return { entries: [...result.entries].sort(byPosition), cacheHint: result.cacheHint };
}

export async function getRoadmap() {
	const result = await getEmDashCollection("roadmap", { limit: 200 });
	return { entries: [...result.entries].sort(byPosition), cacheHint: result.cacheHint };
}

export async function getFaqs() {
	const result = await getEmDashCollection("faqs", { limit: 100 });
	return { entries: [...result.entries].sort(byPosition), cacheHint: result.cacheHint };
}

const FALLBACK: Pick<Launch, "title" | "email"> = { title: "Firstlight", email: "" };

/** The single launch-details entry (contact email, share link); null-safe for an empty CMS. */
export async function getLaunch() {
	const { entries, cacheHint } = await getEmDashCollection("launch", { limit: 1 });
	const launch: Partial<Launch> & typeof FALLBACK = entries[0]?.data ?? FALLBACK;
	return { launch, cacheHint };
}
