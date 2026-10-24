import { getEmDashCollection } from "emdash";
import type { Company } from "../../emdash-env";

export const LEVELS = [
	{ slug: "gentle", label: "Gentle", hint: "Up to 5 hours a day, up to 400 m of climbing", dots: 1 },
	{ slug: "moderate", label: "Moderate", hint: "5 to 7 hours a day, up to 800 m of climbing", dots: 2 },
	{ slug: "active", label: "Active", hint: "6 to 9 hours a day, 900 m or more of climbing", dots: 3 },
] as const;

export const REGIONS = [
	{ slug: "europe", label: "Europe" },
	{ slug: "north-america", label: "North America" },
	{ slug: "oceania", label: "Oceania" },
	{ slug: "south-america", label: "South America" },
] as const;

export const FOCUS = [
	{ slug: "wildlife", label: "Wildlife" },
	{ slug: "landscape", label: "Landscape" },
] as const;

export const levelOf = (slug: string | null | undefined) => LEVELS.find((l) => l.slug === slug);
export const levelLabel = (slug: string | null | undefined) => levelOf(slug)?.label ?? "";
export const regionLabel = (slug: string | null | undefined) => REGIONS.find((r) => r.slug === slug)?.label ?? "";
export const focusLabel = (slug: string | null | undefined) => FOCUS.find((f) => f.slug === slug)?.label ?? "";

export function countrySlug(country: string | null | undefined): string {
	return (country ?? "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
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

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "12 June 2027" from `YYYY-MM-DD`. Parsed by hand so the server timezone cannot shift the day. */
export function longDate(day: string | null | undefined): string {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day ?? "");
	return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";
}

export function shortDate(day: string | null | undefined): { d: string; m: string; y: string } {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day ?? "");
	return m ? { d: String(Number(m[3])), m: MONTHS[Number(m[2]) - 1].slice(0, 3), y: m[1] } : { d: "", m: "", y: "" };
}

export interface Departure {
	date: string;
	status: string;
}

export async function getTours() {
	const result = await getEmDashCollection("tours", { limit: 200 });
	const list = result.entries
		.map((entry) => ({
			entry,
			departures: rows(entry.data.departures).map<Departure>((r) => ({ date: r.left, status: r.right || "Open" })),
		}))
		.sort((a, b) => Number(a.entry.data.position ?? 0) - Number(b.entry.data.position ?? 0));
	return { tours: list, cacheHint: result.cacheHint };
}
export type TourRow = Awaited<ReturnType<typeof getTours>>["tours"][number];

/** Every departure of every tour, soonest first. */
export function allDepartures(tours: TourRow[]) {
	return tours
		.flatMap((t) => t.departures.map((dep) => ({ tour: t, ...dep })))
		.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getDestinations() {
	return getEmDashCollection("destinations", { orderBy: { position: "asc" }, limit: 30 });
}
export async function getPillars() {
	return getEmDashCollection("pillars", { orderBy: { position: "asc" }, limit: 6 });
}
export async function getPractices() {
	return getEmDashCollection("practices", { orderBy: { position: "asc" }, limit: 10 });
}
export async function getTeam() {
	return getEmDashCollection("team", { orderBy: { position: "asc" }, limit: 20 });
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
