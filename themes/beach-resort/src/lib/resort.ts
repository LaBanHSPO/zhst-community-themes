import { getEmDashCollection } from "emdash";
import type { Company } from "../../emdash-env";

export const VIEWS = [
	{ slug: "ocean", label: "Ocean view" },
	{ slug: "garden", label: "Garden view" },
] as const;

/** Guest filter: suites that sleep at least this many. */
export const GUEST_OPTIONS = [2, 3, 4, 6] as const;

export const CATEGORIES = [
	{ slug: "water", label: "On the water" },
	{ slug: "land", label: "On land" },
	{ slug: "wellness", label: "Wellness" },
] as const;

export const viewLabel = (slug: string | null | undefined) => VIEWS.find((v) => v.slug === slug)?.label ?? "";
export const categoryLabel = (slug: string | null | undefined) => CATEGORIES.find((c) => c.slug === slug)?.label ?? "";

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

/** Menu lines as Dish|Description|Price. */
export function dishes(text: string | null | undefined): { name: string; note: string; price: string }[] {
	return lines(text).map((l) => {
		const [name = "", note = "", price = ""] = l.split("|").map((s) => s.trim());
		return { name, note, price };
	});
}

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export async function getSuites() {
	const result = await getEmDashCollection("suites", { limit: 100 });
	const list = [...result.entries].sort((a, b) => Number(a.data.position ?? 0) - Number(b.data.position ?? 0));
	return { suites: list, cacheHint: result.cacheHint };
}
export type SuiteEntry = Awaited<ReturnType<typeof getSuites>>["suites"][number];

/** Cover photo first, then the extra gallery lines (path|description). */
export function suitePhotos(s: SuiteEntry): { src: string; alt: string }[] {
	const d = s.data;
	const cover = photoSrc(d.image, d.photo);
	const list: { src: string; alt: string }[] = [];
	if (cover) list.push({ src: cover, alt: d.image?.alt || d.photo_alt || d.title });
	for (const r of rows(d.gallery)) if (r.left) list.push({ src: r.left, alt: r.right || d.title });
	return list;
}

export async function getExperiences() {
	const result = await getEmDashCollection("experiences", { limit: 100 });
	const list = [...result.entries].sort((a, b) => Number(a.data.position ?? 0) - Number(b.data.position ?? 0));
	return { experiences: list, cacheHint: result.cacheHint };
}
export type ExperienceEntry = Awaited<ReturnType<typeof getExperiences>>["experiences"][number];

export async function getVenues() {
	return getEmDashCollection("venues", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK: Pick<Company, "title" | "street" | "locality" | "email"> = { title: "", street: "", locality: "", email: "" };
export type CompanyData = Partial<Company> & typeof FALLBACK;

export async function getCompany() {
	const { entries, cacheHint } = await getEmDashCollection("company", { limit: 1 });
	const company: CompanyData = entries[0]?.data ?? FALLBACK;
	return { company, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(v: CompanyData): string {
	const query = [v.street, v.locality, v.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type { Company };
