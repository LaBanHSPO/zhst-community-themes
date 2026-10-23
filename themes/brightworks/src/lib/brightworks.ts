import { getEmDashCollection } from "emdash";
import type { Business, Choice, Project, Service, Step } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
}

export function serviceUrl(entry: { slug: string | null; id: string }): string {
	return `/services/${encodeURIComponent(entry.slug ?? entry.id)}`;
}

export function projectUrl(entry: { slug: string | null; id: string }): string {
	return `/projects/${encodeURIComponent(entry.slug ?? entry.id)}`;
}

/** Sign types offered by the quote form; values match the services `quote_type` select. */
export const SIGN_TYPES = [
	{ value: "exterior", label: "Exterior / shopfront sign" },
	{ value: "illuminated", label: "Illuminated sign" },
	{ value: "interior", label: "Interior signage" },
	{ value: "window", label: "Window graphics" },
	{ value: "print", label: "Print" },
	{ value: "installation", label: "Installation only" },
	{ value: "not-sure", label: "Not sure yet" },
] as const;

export const LOCATIONS = [
	"Shopfront / fascia",
	"Exterior wall",
	"Windows",
	"Interior / reception",
	"Freestanding / pavement",
	"Other",
] as const;

export const TIMEFRAMES = [
	"As soon as possible",
	"Within 2 weeks",
	"Within a month",
	"In 1–3 months",
	"Just planning ahead",
] as const;

export function quoteUrl(type?: string | null): string {
	return type ? `/quote?type=${encodeURIComponent(type)}#quote-form` : "/quote#quote-form";
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

/** Material / option cards that belong to one service (matched on the service slug). */
export async function getChoices(service: string) {
	const { entries, cacheHint } = await getEmDashCollection("choices", { orderBy: { position: "asc" }, limit: 100 });
	return { entries: entries.filter((e) => e.data.service === service), cacheHint };
}

/** Process steps for one placement (services page, service detail, quote page). */
export async function getSteps(placement: "services" | "detail" | "quote") {
	const { entries, cacheHint } = await getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 40 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

export async function getProjects() {
	return getEmDashCollection("projects", { orderBy: { position: "asc" }, limit: 50 });
}

const FALLBACK_BUSINESS: Pick<Business, "title" | "email"> = { title: "Brightworks", email: "" };

/** The single business entry (quote email, phone); null-safe for an empty CMS. */
export async function getBusiness() {
	const { entries, cacheHint } = await getEmDashCollection("business", { limit: 1 });
	const business: Partial<Business> & typeof FALLBACK_BUSINESS = entries[0]?.data ?? FALLBACK_BUSINESS;
	return { business, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export type { Business, Choice, Project, Service, Step };
