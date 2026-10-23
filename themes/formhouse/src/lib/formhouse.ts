import { getEmDashCollection } from "emdash";
import type { Business, Material, Project, Service, Step } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

/** Alt text: the uploaded image's own alt, then the entry's description field, then a fallback. */
export function photoAlt(image: ImageLike, alt: string | null | undefined, fallback: string): string {
	return image?.alt || alt || fallback;
}

export const CATEGORIES = ["Kitchen", "Living", "Whole-home"] as const;
export type Category = (typeof CATEGORIES)[number];

/** "Whole-home" -> "whole-home" for the projects filter query string. */
export function categoryKey(category: string): string {
	return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function projectUrl(entry: { slug: string | null; id: string }): string {
	return `/projects/${encodeURIComponent(entry.slug ?? entry.id)}`;
}

export async function getProjects() {
	return getEmDashCollection("projects", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getMaterials() {
	return getEmDashCollection("materials", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK_BUSINESS: Pick<Business, "title" | "email"> = { title: "Formhouse", email: "" };

/** The single studio-details entry (request email, phone, regions); null-safe for an empty CMS. */
export async function getBusiness() {
	const { entries, cacheHint } = await getEmDashCollection("business", { limit: 1 });
	const business: Partial<Business> & typeof FALLBACK_BUSINESS = entries[0]?.data ?? FALLBACK_BUSINESS;
	return { business, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export type { Business, Material, Project, Service, Step };
