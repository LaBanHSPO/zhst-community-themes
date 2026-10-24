import { getEmDashCollection } from "emdash";
import type { Company } from "../../emdash-env";

export const THEMES = [
	{ slug: "food", label: "Food" },
	{ slug: "culture", label: "Culture" },
	{ slug: "nature", label: "Nature" },
	{ slug: "ocean", label: "Ocean" },
	{ slug: "wellbeing", label: "Wellbeing" },
] as const;

export const REGIONS = [
	{ slug: "europe", label: "Europe" },
	{ slug: "asia", label: "Asia" },
	{ slug: "africa", label: "Africa" },
	{ slug: "pacific", label: "South Pacific" },
] as const;

export function themeLabel(slug: string | null | undefined) {
	return THEMES.find((t) => t.slug === slug)?.label ?? "";
}
export function regionLabel(slug: string | null | undefined) {
	return REGIONS.find((r) => r.slug === slug)?.label ?? "";
}

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

/** "18 September 2026" from `YYYY-MM-DD`. Parsed by hand so the server timezone cannot shift the day. */
export function longDate(day: string | null | undefined): string {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day ?? "");
	return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";
}

export async function getJourneys() {
	const result = await getEmDashCollection("journeys", { limit: 200 });
	const list = result.entries
		.map((entry) => ({
			entry,
			themes: (entry.data.themes ?? "")
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
			tags: lines(entry.data.tags),
		}))
		.sort((a, b) => Number(a.entry.data.position ?? 0) - Number(b.entry.data.position ?? 0));
	return { journeys: list, cacheHint: result.cacheHint };
}
export type JourneyRow = Awaited<ReturnType<typeof getJourneys>>["journeys"][number];

export async function getDestinations() {
	return getEmDashCollection("destinations", { orderBy: { position: "asc" }, limit: 30 });
}
export async function getExperiences() {
	return getEmDashCollection("experiences", { orderBy: { position: "asc" }, limit: 10 });
}
export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 10 });
}
export async function getTeam() {
	return getEmDashCollection("team", { orderBy: { position: "asc" }, limit: 20 });
}
export async function getPosts() {
	const result = await getEmDashCollection("inspiration", { limit: 100 });
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

export function mapHref(v: CompanyData): string {
	const query = [v.street, v.locality, v.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type { Company };
