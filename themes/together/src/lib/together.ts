import { getEmDashCollection } from "emdash";
import type { Activity, Association, Event as CommunityEvent, Post } from "../../emdash-env";

export type { Activity, Association, CommunityEvent, Post };

const TZ = "Asia/Saigon";

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

export function eventUrl(entry: Keyed | string): string {
	return `/events/${encodeURIComponent(typeof entry === "string" ? entry : entryKey(entry))}`;
}

export function postUrl(entry: Keyed): string {
	return `/posts/${encodeURIComponent(entryKey(entry))}`;
}

/** Activity categories, in filter order. `events` is the extra filter that lists dated events. */
export const CATEGORIES = [
	{ value: "environment", label: "Environment", icon: "leaf" },
	{ value: "community", label: "Community", icon: "people" },
	{ value: "skills", label: "Skills & Learning", icon: "spark" },
] as const;

export function categoryLabel(value: string | null | undefined): string {
	return CATEGORIES.find((c) => c.value === value)?.label ?? (value ? value.charAt(0).toUpperCase() + value.slice(1) : "");
}

export function categoryIcon(value: string | null | undefined): string {
	return CATEGORIES.find((c) => c.value === value)?.icon ?? "leaf";
}

function toDate(value: string | Date | null | undefined): Date | null {
	if (!value) return null;
	const d = value instanceof Date ? value : new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

function fmt(d: Date, options: Intl.DateTimeFormatOptions): string {
	return new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...options }).format(d);
}

/** "9:00 AM". */
export function timeOf(value: string | Date | null | undefined): string {
	const d = toDate(value);
	return d ? fmt(d, { hour: "numeric", minute: "2-digit" }) : "";
}

/** "9:00 AM – 12:00 PM" (or just the start time). */
export function timeRange(start: string | null | undefined, end: string | null | undefined): string {
	const a = timeOf(start);
	const b = timeOf(end);
	return a && b ? `${a} – ${b}` : a;
}

/** "Saturday, Apr 26, 2025". */
export function longDate(value: string | Date | null | undefined): string {
	const d = toDate(value);
	return d ? fmt(d, { weekday: "long", month: "short", day: "numeric", year: "numeric" }) : "";
}

/** "SAT, APR 26". */
export function shortDay(value: string | Date | null | undefined): string {
	const d = toDate(value);
	return d ? fmt(d, { weekday: "short", month: "short", day: "numeric" }).toUpperCase() : "";
}

/** "APR 12, 2025". */
export function storyDateShort(value: string | Date | null | undefined): string {
	const d = toDate(value);
	return d ? fmt(d, { month: "short", day: "numeric", year: "numeric" }).toUpperCase() : "";
}

/** "April 5, 2025". */
export function storyDateLong(value: string | Date | null | undefined): string {
	const d = toDate(value);
	return d ? fmt(d, { month: "long", day: "numeric", year: "numeric" }) : "";
}

/** ISO string for <time datetime>, or undefined when the value is not a date. */
export function isoOf(value: string | Date | null | undefined): string | undefined {
	return toDate(value)?.toISOString();
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

export async function getActivities() {
	return getEmDashCollection("activities", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getEvents() {
	return getEmDashCollection("events", { orderBy: { starts_at: "asc" }, limit: 100 });
}

export async function getStories(limit = 20, cursor?: string) {
	return getEmDashCollection("posts", { orderBy: { date: "desc" }, limit, cursor });
}

const FALLBACK: Pick<Association, "title" | "email"> = { title: "Together", email: "" };

/** The single association-details entry (contact email, neighborhoods, interests); null-safe for an empty CMS. */
export async function getAssociation() {
	const { entries, cacheHint } = await getEmDashCollection("association", { limit: 1 });
	const association: Partial<Association> & typeof FALLBACK = entries[0]?.data ?? FALLBACK;
	return { association, cacheHint };
}
