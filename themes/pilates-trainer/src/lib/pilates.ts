import { getEmDashCollection } from "emdash";
import type { Studio } from "../../emdash-env";

export const TYPES = [
	{ slug: "mat", label: "Mat", blurb: "Floor exercises with a mat, a ball and a band." },
	{ slug: "reformer", label: "Reformer", blurb: "Spring-loaded machine work in groups of six." },
	{ slug: "private", label: "Private", blurb: "One to one, or shared with a friend." },
] as const;

export const LEVELS = [
	{ slug: "beginner", label: "Beginner" },
	{ slug: "all-levels", label: "All levels" },
	{ slug: "intermediate", label: "Intermediate" },
] as const;

export const DAYS = [
	{ slug: "mon", label: "Monday", short: "Mon" },
	{ slug: "tue", label: "Tuesday", short: "Tue" },
	{ slug: "wed", label: "Wednesday", short: "Wed" },
	{ slug: "thu", label: "Thursday", short: "Thu" },
	{ slug: "fri", label: "Friday", short: "Fri" },
	{ slug: "sat", label: "Saturday", short: "Sat" },
	{ slug: "sun", label: "Sunday", short: "Sun" },
] as const;

export const PRICE_GROUPS = [
	{ slug: "intro", label: "New students" },
	{ slug: "drop-in", label: "Drop in" },
	{ slug: "pack", label: "Class packs" },
	{ slug: "private", label: "Private sessions" },
] as const;

export function levelLabel(slug: string | null | undefined) {
	return LEVELS.find((l) => l.slug === slug)?.label ?? "";
}

export function typeLabel(slug: string | null | undefined) {
	return TYPES.find((t) => t.slug === slug)?.label ?? "";
}

export async function getClasses() {
	return getEmDashCollection("classes", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getSessions() {
	const result = await getEmDashCollection("sessions", { limit: 300 });
	const order = DAYS.map((d) => d.slug as string);
	const entries = [...result.entries].sort(
		(a, b) =>
			order.indexOf(a.data.weekday) - order.indexOf(b.data.weekday) || String(a.data.start).localeCompare(String(b.data.start)),
	);
	return { entries, cacheHint: result.cacheHint };
}

export async function getPillars() {
	return getEmDashCollection("pillars", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getPrices() {
	return getEmDashCollection("prices", { orderBy: { position: "asc" }, limit: 40 });
}

const FALLBACK: Pick<Studio, "title" | "street" | "locality" | "email"> = { title: "", street: "", locality: "", email: "" };
export type StudioData = Partial<Studio> & typeof FALLBACK;

export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: StudioData = entries[0]?.data ?? FALLBACK;
	return { studio, cacheHint };
}

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function hoursRows(hours: string | null | undefined): { day: string; time: string }[] {
	return (hours ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean)
		.map((l) => {
			const [day, ...rest] = l.split("|");
			return { day: day.trim(), time: rest.join("|").trim() };
		});
}

export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function formatPrice(price: number | null | undefined): string {
	return typeof price === "number" ? `$${price}` : "";
}

/** "6" becomes "6 spaces", "1" becomes "1 space", anything else (such as "ask") becomes "Ask". */
export function spacesLabel(spaces: string | null | undefined): string {
	const n = Number.parseInt(String(spaces ?? ""), 10);
	if (Number.isFinite(n) && /^\d+$/.test(String(spaces).trim())) return `${n} ${n === 1 ? "space" : "spaces"}`;
	return "Ask for spaces";
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(studio: StudioData): string {
	const query = [studio.street, studio.locality, studio.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type { Studio };
