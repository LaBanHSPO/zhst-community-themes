import { getEmDashCollection } from "emdash";
import type { Venue } from "../../emdash-env";

export const REGIONS = [
	{ slug: "lakes", label: "Lakes" },
	{ slug: "mountains", label: "Mountains" },
	{ slug: "forest", label: "Forest" },
	{ slug: "coast", label: "Coast" },
] as const;

export const LENGTHS = [
	{ slug: "weekend", label: "Weekend (2 to 3 nights)", short: "Weekend", test: (n: number) => n <= 3 },
	{ slug: "midweek", label: "Midweek (4 to 6 nights)", short: "Midweek", test: (n: number) => n >= 4 && n <= 6 },
	{ slug: "week", label: "A week or more (7+ nights)", short: "A week or more", test: (n: number) => n >= 7 },
] as const;

export function regionLabel(slug: string | null | undefined) {
	return REGIONS.find((r) => r.slug === slug)?.label ?? "";
}

/** Today in the site's timezone, `YYYY-MM-DD`. Evaluated per request so past retreats never read as upcoming. */
export function todayKey(): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Saigon" }).format(new Date());
}

/** `YYYY-MM-DD` of a stored datetime (stored at noon UTC so the calendar day never shifts). */
export function dayKey(value: unknown): string {
	if (!value) return "";
	const d = value instanceof Date ? value : new Date(String(value));
	return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function parts(day: string) {
	const [y, m, d] = day.split("-").map(Number);
	return { y, m: m - 1, d };
}

/** "12–14 March 2027" or "25 September – 2 October 2027" */
export function dateRange(start: string, end: string): string {
	const a = parts(start);
	const b = parts(end);
	if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${MONTHS[a.m]} ${a.y}`;
	if (a.y === b.y) return `${a.d} ${MONTHS[a.m]} – ${b.d} ${MONTHS[b.m]} ${a.y}`;
	return `${a.d} ${MONTHS[a.m]} ${a.y} – ${b.d} ${MONTHS[b.m]} ${b.y}`;
}

export function monthYear(day: string): string {
	const a = parts(day);
	return `${MONTHS[a.m]} ${a.y}`;
}

export function nightsLabel(n: number | null | undefined): string {
	return typeof n === "number" ? `${n} ${n === 1 ? "night" : "nights"}` : "";
}

export async function getRetreats() {
	const result = await getEmDashCollection("retreats", { limit: 200 });
	const today = todayKey();
	const all = result.entries
		.map((entry) => ({ entry, start: dayKey(entry.data.start_date), end: dayKey(entry.data.end_date) }))
		.filter((r) => r.start);
	const upcoming = all.filter((r) => (r.end || r.start) >= today).sort((a, b) => a.start.localeCompare(b.start));
	const past = all.filter((r) => (r.end || r.start) < today).sort((a, b) => b.start.localeCompare(a.start));
	return { upcoming, past, cacheHint: result.cacheHint };
}

export type RetreatRow = Awaited<ReturnType<typeof getRetreats>>["upcoming"][number];

export async function getDayRhythm() {
	return getEmDashCollection("day_rhythm", { orderBy: { position: "asc" }, limit: 20 });
}

export async function getPillars() {
	return getEmDashCollection("pillars", { orderBy: { position: "asc" }, limit: 6 });
}

export async function getPosts() {
	return getEmDashCollection("journal", { orderBy: { position: "asc" }, limit: 100 });
}

const FALLBACK: Pick<Venue, "title" | "street" | "locality" | "email"> = { title: "", street: "", locality: "", email: "" };
export type VenueData = Partial<Venue> & typeof FALLBACK;

export async function getVenue() {
	const { entries, cacheHint } = await getEmDashCollection("venue", { limit: 1 });
	const venue: VenueData = entries[0]?.data ?? FALLBACK;
	return { venue, cacheHint };
}

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function rows(text: string | null | undefined): { left: string; right: string }[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean)
		.map((l) => {
			const [a, ...rest] = l.split("|");
			return { left: a.trim(), right: rest.join("|").trim() };
		});
}

export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function formatPrice(price: number | null | undefined): string {
	return typeof price === "number" ? `$${price.toLocaleString("en-US")}` : "";
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(v: VenueData): string {
	const query = [v.street, v.locality, v.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type { Venue };
