import { getEmDashCollection } from "emdash";
import type { Company } from "../../emdash-env";

export const ACTIVITIES = [
	{ slug: "hiking", label: "Hiking" },
	{ slug: "kayaking", label: "Kayaking" },
	{ slug: "expedition", label: "Expeditions" },
] as const;

export const DIFFICULTIES = [
	{ slug: "easy", label: "Easy", note: "Three to five hours a day on good paths" },
	{ slug: "moderate", label: "Moderate", note: "Five to seven hours a day with steady climbs" },
	{ slug: "challenging", label: "Challenging", note: "Long days, rough ground, strong fitness needed" },
] as const;

export const REGIONS = [
	{ slug: "alps", label: "The Alps" },
	{ slug: "norway", label: "Norway" },
	{ slug: "patagonia", label: "Patagonia" },
	{ slug: "rockies", label: "The Rockies" },
] as const;

export function activityLabel(slug: string | null | undefined) {
	return ACTIVITIES.find((a) => a.slug === slug)?.label ?? "";
}
export function difficultyLabel(slug: string | null | undefined) {
	return DIFFICULTIES.find((d) => d.slug === slug)?.label ?? "";
}
export function regionLabel(slug: string | null | undefined) {
	return REGIONS.find((r) => r.slug === slug)?.label ?? "";
}

/** Today in the site's timezone, `YYYY-MM-DD`. Evaluated per request so past departures never read as upcoming. */
export function todayKey(): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Saigon" }).format(new Date());
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(day: string) {
	const [y, m, d] = day.split("-").map(Number);
	return { y, m: m - 1, d };
}

/** "12–17 June 2027" or "25 September to 2 October 2027" */
export function dateRange(start: string, end: string): string {
	const a = parts(start);
	const b = parts(end || start);
	if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${MONTHS[a.m]} ${a.y}`;
	if (a.y === b.y) return `${a.d} ${MONTHS[a.m]} to ${b.d} ${MONTHS[b.m]} ${a.y}`;
	return `${a.d} ${MONTHS[a.m]} ${a.y} to ${b.d} ${MONTHS[b.m]} ${b.y}`;
}

/** { day: "12", mon: "Jun", year: "2027" } for the date badge on departure rows */
export function dateBadge(day: string) {
	const a = parts(day);
	return { day: String(a.d), mon: SHORT[a.m], year: String(a.y) };
}

export function daysLabel(n: number | null | undefined): string {
	return typeof n === "number" ? `${n} ${n === 1 ? "day" : "days"}` : "";
}

export function formatPrice(price: number | null | undefined): string {
	return typeof price === "number" ? `$${price.toLocaleString("en-US")}` : "";
}

export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function rows(text: string | null | undefined): { left: string; right: string }[] {
	return lines(text).map((l) => {
		const [a, ...rest] = l.split("|");
		return { left: a.trim(), right: rest.join("|").trim() };
	});
}

export type Departure = { start: string; end: string };

/** Parses "2027-06-19|2027-06-25" lines. Past departures are dropped unless `all` is set. */
export function parseDepartures(text: string | null | undefined, all = false): Departure[] {
	const today = todayKey();
	return rows(text)
		.map((r) => ({ start: r.left, end: r.right || r.left }))
		.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.start) && /^\d{4}-\d{2}-\d{2}$/.test(d.end))
		.filter((d) => all || d.end >= today)
		.sort((a, b) => a.start.localeCompare(b.start));
}

export async function getTrips() {
	const result = await getEmDashCollection("trips", { limit: 200 });
	const rowsOut = result.entries
		.map((entry) => ({ entry, departures: parseDepartures(entry.data.departures) }))
		.sort((a, b) => Number(a.entry.data.position ?? 0) - Number(b.entry.data.position ?? 0));
	return { trips: rowsOut, cacheHint: result.cacheHint };
}

export type TripRow = Awaited<ReturnType<typeof getTrips>>["trips"][number];

/** Every upcoming departure across all trips, soonest first. */
export function upcomingDepartures(trips: TripRow[]) {
	return trips
		.flatMap((t) => t.departures.map((d) => ({ trip: t, ...d })))
		.sort((a, b) => a.start.localeCompare(b.start) || String(a.trip.entry.data.title).localeCompare(String(b.trip.entry.data.title)));
}

export async function getDestinations() {
	return getEmDashCollection("destinations", { orderBy: { position: "asc" }, limit: 20 });
}
export async function getActivities() {
	return getEmDashCollection("activities", { orderBy: { position: "asc" }, limit: 6 });
}
export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 10 });
}
export async function getGuides() {
	return getEmDashCollection("guides", { orderBy: { position: "asc" }, limit: 20 });
}

const FALLBACK: Pick<Company, "title" | "street" | "locality" | "email"> = { title: "", street: "", locality: "", email: "" };
export type CompanyData = Partial<Company> & typeof FALLBACK;

export async function getCompany() {
	const { entries, cacheHint } = await getEmDashCollection("company", { limit: 1 });
	const company: CompanyData = entries[0]?.data ?? FALLBACK;
	return { company, cacheHint };
}

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(v: CompanyData): string {
	const query = [v.street, v.locality, v.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type { Company };
