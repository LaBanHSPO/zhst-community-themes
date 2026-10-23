import { getEmDashCollection } from "emdash";
import type { Area, Business, Guarantee, Job, Price, Service } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
}

export function serviceUrl(entry: { slug: string | null; id: string }): string {
	return `/services/${encodeURIComponent(entry.slug ?? entry.id)}`;
}

/** Issue types offered by the quote form; values match the services `issue` select. */
export const ISSUES = [
	{ value: "plumbing", label: "Plumbing", icon: "drop" },
	{ value: "electrical", label: "Electrical", icon: "bolt" },
	{ value: "other", label: "Other", icon: "wrench" },
] as const;

export function quoteUrl(issue?: string | null, job?: string | null): string {
	const params = new URLSearchParams();
	if (issue) params.set("issue", issue);
	if (job) params.set("job", job);
	const qs = params.toString();
	return `/quote${qs ? `?${qs}` : ""}#quote-form`;
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

/** Common jobs that belong to one service (matched on the service slug). */
export async function getJobs(service: string) {
	const { entries, cacheHint } = await getEmDashCollection("jobs", { orderBy: { position: "asc" }, limit: 100 });
	return { entries: entries.filter((e) => e.data.service === service), cacheHint };
}

/** Starting-price rows that belong to one service (matched on the service slug). */
export async function getPrices(service: string) {
	const { entries, cacheHint } = await getEmDashCollection("prices", { orderBy: { position: "asc" }, limit: 100 });
	return { entries: entries.filter((e) => e.data.service === service), cacheHint };
}

/** Guarantees for one placement (hero badges, bottom strips, "What's included"). */
export async function getGuarantees(placement: string) {
	const { entries, cacheHint } = await getEmDashCollection("guarantees", { orderBy: { position: "asc" }, limit: 60 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

export async function getAreas() {
	return getEmDashCollection("areas", { orderBy: { position: "asc" }, limit: 100 });
}

const FALLBACK_BUSINESS: Pick<Business, "title" | "phone" | "email"> = { title: "Fixwell", phone: "", email: "" };

/** The single business entry (phone, quote email); null-safe for an empty CMS. */
export async function getBusiness() {
	const { entries, cacheHint } = await getEmDashCollection("business", { limit: 1 });
	const business: Partial<Business> & typeof FALLBACK_BUSINESS = entries[0]?.data ?? FALLBACK_BUSINESS;
	return { business, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Outward code of a UK-style postcode ("BS3 5PL" -> "BS3"); short input is used as typed. */
export function outwardCode(input: string): string {
	const compact = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
	return compact.length >= 5 ? compact.slice(0, -3) : compact;
}

/** The area that lists this postcode district, if any. */
export function findArea(areas: Area[], postcode: string): Area | undefined {
	const code = outwardCode(postcode);
	if (!code) return undefined;
	return areas.find((a) =>
		(a.postcodes ?? "")
			.split(",")
			.map((p) => p.trim().toUpperCase().replace(/\s+/g, ""))
			.includes(code),
	);
}

export type { Area, Business, Guarantee, Job, Price, Service };
