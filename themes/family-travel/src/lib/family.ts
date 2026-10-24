import { getEmDashCollection } from "emdash";
import type { Company } from "../../emdash-env";

export const STYLES = [
	{ slug: "beach", label: "Beach" },
	{ slug: "culture", label: "Culture" },
	{ slug: "nature", label: "Nature" },
] as const;

export const AGES = [
	{ slug: "under-5", label: "Under 5", note: "Naps, cots and short days" },
	{ slug: "5-12", label: "Ages 5 to 12", note: "Hunts, boats and workshops" },
	{ slug: "teens", label: "Teens", note: "Kayaks, hikes and some freedom" },
] as const;

export const PACES = [
	{ slug: "relaxed", label: "Relaxed" },
	{ slug: "steady", label: "Steady" },
	{ slug: "active", label: "Active" },
] as const;

export const TOPICS = [
	{ slug: "planning", label: "Planning" },
	{ slug: "packing", label: "Packing" },
	{ slug: "with-kids", label: "With children" },
] as const;

export const BUDGETS = [
	"Not sure yet",
	"Under $3,000",
	"$3,000 to $5,000",
	"$5,000 to $8,000",
	"Over $8,000",
] as const;

const labelOf = (list: readonly { slug: string; label: string }[], slug: string | null | undefined) =>
	list.find((i) => i.slug === slug)?.label ?? "";

export const styleLabel = (slug: string | null | undefined) => labelOf(STYLES, slug);
export const paceLabel = (slug: string | null | undefined) => labelOf(PACES, slug);
export const topicLabel = (slug: string | null | undefined) => labelOf(TOPICS, slug);

export function ageSlugs(ages: string | null | undefined): string[] {
	return (ages ?? "")
		.split(",")
		.map((a) => a.trim())
		.filter(Boolean);
}

export function agesLabel(ages: string | null | undefined): string {
	return ageSlugs(ages)
		.map((s) => labelOf(AGES, s))
		.filter(Boolean)
		.join(", ");
}

export function nightsLabel(n: number | null | undefined): string {
	return typeof n === "number" ? `${n} ${n === 1 ? "night" : "nights"}` : "";
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

export async function getEscapes() {
	const result = await getEmDashCollection("escapes", { limit: 200 });
	const entries = [...result.entries].sort((a, b) => Number(a.data.position ?? 0) - Number(b.data.position ?? 0));
	return { entries, cacheHint: result.cacheHint };
}
export type EscapeEntry = Awaited<ReturnType<typeof getEscapes>>["entries"][number];

export async function getDestinations() {
	return getEmDashCollection("destinations", { orderBy: { position: "asc" }, limit: 20 });
}
export async function getStyles() {
	return getEmDashCollection("styles", { orderBy: { position: "asc" }, limit: 6 });
}
export async function getComforts() {
	return getEmDashCollection("comforts", { orderBy: { position: "asc" }, limit: 8 });
}
export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 10 });
}
export async function getTeam() {
	return getEmDashCollection("team", { orderBy: { position: "asc" }, limit: 20 });
}
export async function getPosts() {
	const result = await getEmDashCollection("inspiration", { limit: 100 });
	const entries = [...result.entries].sort((a, b) => Number(a.data.position ?? 0) - Number(b.data.position ?? 0));
	return { entries, cacheHint: result.cacheHint };
}
export type PostEntry = Awaited<ReturnType<typeof getPosts>>["entries"][number];

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

const ALT: Record<string, string> = {
	"/images/card-beach.webp": "Wooden overwater bungalows beside a white beach with palms and turquoise water",
	"/images/card-culture.webp": "A whitewashed hillside town above a rocky coast at sunset",
	"/images/card-nature.webp": "Green forested hills and two steep peaks above a sheltered blue bay",
	"/images/karst-bay.webp": "Palms in the foreground and forested limestone islands across a turquoise bay",
	"/images/family-wading.webp": "A family of four holding hands and wading into shallow sea, seen from behind",
	"/images/family-shore.webp": "A family walking along the edge of the sea on a bright day, seen from behind",
	"/images/beach-hats.webp": "A family of four in straw hats sitting together on a sandy beach at sunset, seen from behind",
	"/images/beach-basket.webp": "A straw beach bag on a striped blanket by a palm on the sand",
	"/images/sunset-boat.webp": "A wooden longtail boat on calm water below limestone islands at sunset",
	"/images/beach-sunset.webp": "A family sitting on the sand watching the sun set behind limestone islands, seen from behind",
};
export function photoAlt(image: ImageLike, photo: string | null | undefined): string {
	return image?.alt || (photo ? ALT[photo] ?? "" : "");
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(v: CompanyData): string {
	const query = [v.street, v.locality, v.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type { Company };
