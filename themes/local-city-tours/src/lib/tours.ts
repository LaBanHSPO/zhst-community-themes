import { getEmDashCollection } from "emdash";
import type { Company } from "../../emdash-env";

export const TYPES = [
	{ slug: "walking", label: "Walking Tours" },
	{ slug: "food", label: "Food Tours" },
	{ slug: "highlights", label: "City Highlights" },
	{ slug: "private", label: "Private Tours" },
] as const;

export const DAYS = [
	{ key: "mon", label: "Monday", short: "Mon" },
	{ key: "tue", label: "Tuesday", short: "Tue" },
	{ key: "wed", label: "Wednesday", short: "Wed" },
	{ key: "thu", label: "Thursday", short: "Thu" },
	{ key: "fri", label: "Friday", short: "Fri" },
	{ key: "sat", label: "Saturday", short: "Sat" },
	{ key: "sun", label: "Sunday", short: "Sun" },
] as const;

export const typeLabel = (slug: string | null | undefined) => TYPES.find((t) => t.slug === slug)?.label ?? "";

/** "Spanish" -> "spanish", used in ?lang= */
export const langSlug = (lang: string) => lang.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function list(text: string | null | undefined): string[] {
	return (text ?? "")
		.split(",")
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

/** "18 September 2026" from `YYYY-MM-DD`. Parsed by hand so the server timezone cannot shift the day. */
export function longDate(day: string | null | undefined): string {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day ?? "");
	return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";
}

export function formatPrice(price: number | null | undefined, unit?: string | null): string {
	if (typeof price !== "number") return "";
	return `$${price.toLocaleString("en-US")}${unit === "group" ? " per group" : " per person"}`;
}

/** Days a tour runs, in plain words. */
export function runsLabel(runsOn: string | null | undefined): string {
	const keys = list(runsOn).map((k) => k.toLowerCase());
	if (keys.length === 7) return "Every day";
	const labels = DAYS.filter((d) => keys.includes(d.key)).map((d) => d.label);
	return labels.length > 1 ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}` : (labels[0] ?? "");
}

export async function getTours() {
	const result = await getEmDashCollection("tours", { limit: 200 });
	const tours = result.entries
		.map((entry) => ({
			entry,
			languages: list(entry.data.languages),
			times: list(entry.data.start_times),
			days: list(entry.data.runs_on).map((k) => k.toLowerCase()),
		}))
		.sort((a, b) => Number(a.entry.data.position ?? 0) - Number(b.entry.data.position ?? 0));
	return { tours, cacheHint: result.cacheHint };
}
export type TourRow = Awaited<ReturnType<typeof getTours>>["tours"][number];

export async function getGuides() {
	return getEmDashCollection("guides", { orderBy: { position: "asc" }, limit: 30 });
}

export async function getStories() {
	const result = await getEmDashCollection("stories", { limit: 100 });
	const entries = [...result.entries].sort((a, b) => String(b.data.published ?? "").localeCompare(String(a.data.published ?? "")));
	return { entries, cacheHint: result.cacheHint };
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

export function initials(name: string): string {
	return name
		.split(/\s+/)
		.map((p) => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

/**
 * The next seven days (starting today in Asia/Saigon) with the departures that run on each,
 * earliest first. Only tours with a clock time (HH:MM) appear; "by arrangement" tours do not.
 */
export function weekAhead(tours: TourRow[], from = new Date()) {
	const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Saigon", year: "numeric", month: "2-digit", day: "2-digit" });
	const [y, m, d] = fmt.format(from).split("-").map(Number);
	const base = Date.UTC(y, m - 1, d);
	return Array.from({ length: 7 }, (_, i) => {
		const date = new Date(base + i * 86_400_000);
		const dow = (date.getUTCDay() + 6) % 7; // Monday = 0
		const day = DAYS[dow];
		const departures = tours
			.filter((t) => t.entry.data.tour_type !== "private" && t.days.includes(day.key))
			.flatMap((t) => t.times.filter((time) => /^\d{1,2}:\d{2}$/.test(time)).map((time) => ({ time: time.padStart(5, "0"), tour: t })))
			.sort((a, b) => a.time.localeCompare(b.time));
		return { day, date, departures, label: `${day.short} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()].slice(0, 3)}` };
	});
}

export type { Company };
