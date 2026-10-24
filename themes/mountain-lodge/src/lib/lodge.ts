import { getEmDashCollection } from "emdash";
import type { Company } from "../../emdash-env";

export const TYPES = [
	{ slug: "room", label: "Rooms" },
	{ slug: "cabin", label: "Cabins" },
] as const;

/** Sleeps filter steps. A stay matches when it sleeps at least this many. */
export const SLEEP_STEPS = [2, 4, 6] as const;

export const CATEGORIES = [
	{ slug: "lodge", label: "The lodge" },
	{ slug: "rooms", label: "Rooms" },
	{ slug: "valley", label: "The valley" },
	{ slug: "details", label: "Details" },
] as const;

export const SEASONS = [
	{ slug: "summer", label: "Summer" },
	{ slug: "winter", label: "Winter" },
	{ slug: "all-year", label: "All year" },
] as const;

export function typeLabel(slug: string | null | undefined, plural = false) {
	const t = TYPES.find((v) => v.slug === slug);
	if (!t) return "";
	return plural ? t.label : t.label.replace(/s$/, "");
}

export function seasonLabel(slug: string | null | undefined) {
	return SEASONS.find((s) => s.slug === slug)?.label ?? "";
}

export function formatPrice(price: number | null | undefined): string {
	return typeof price === "number" ? `$${price.toLocaleString("en-US")}` : "";
}

export function sleepsLabel(n: number | null | undefined): string {
	return typeof n === "number" ? `Sleeps ${n}` : "";
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

export async function getStays() {
	const result = await getEmDashCollection("stays", { limit: 100 });
	const list = [...result.entries].sort((a, b) => Number(a.data.position ?? 0) - Number(b.data.position ?? 0));
	return { stays: list, cacheHint: result.cacheHint };
}
export type StayEntry = Awaited<ReturnType<typeof getStays>>["stays"][number];

export async function getExperiences() {
	return getEmDashCollection("experiences", { orderBy: { position: "asc" }, limit: 40 });
}
export async function getGallery() {
	return getEmDashCollection("gallery", { orderBy: { position: "asc" }, limit: 100 });
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
