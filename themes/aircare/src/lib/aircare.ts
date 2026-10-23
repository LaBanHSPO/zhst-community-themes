import { getEmDashCollection } from "emdash";
import type { Business, Highlight, Plan, Service, Step } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
}

export function serviceUrl(entry: { slug: string | null; id: string }): string {
	return `/services/${encodeURIComponent(entry.slug ?? entry.id)}`;
}

/** "Learn more" target: an explicit link (e.g. the plans page) or the service detail page. */
export function learnMoreUrl(entry: Service): string {
	return entry.link?.trim() || serviceUrl(entry);
}

export function requestUrl(service?: string | null, plan?: string | null): string {
	const params = new URLSearchParams();
	if (service) params.set("service", service);
	if (plan) params.set("plan", plan);
	const qs = params.toString();
	return `/request${qs ? `?${qs}` : ""}#request-form`;
}

/** "$549" style price, or null when the entry has none. */
export function money(value: number | null | undefined, currency = "$"): string | null {
	if (value === null || value === undefined || Number.isNaN(value)) return null;
	return `${currency}${value.toLocaleString("en-US")}`;
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getPlans() {
	return getEmDashCollection("plans", { orderBy: { position: "asc" }, limit: 12 });
}

/** Process steps that belong to one service (matched on the service slug). */
export async function getSteps(service: string) {
	const { entries, cacheHint } = await getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 60 });
	return { entries: entries.filter((e) => e.data.service === service), cacheHint };
}

/** Benefits for one placement: `home`, `plans`, `request`, or `service-<slug>` for a service page. */
export async function getHighlights(placement: string) {
	const { entries, cacheHint } = await getEmDashCollection("highlights", { orderBy: { position: "asc" }, limit: 60 });
	return { entries: entries.filter((e) => e.data.placement === placement).map((e) => e.data), cacheHint };
}

const FALLBACK_BUSINESS: Pick<Business, "title" | "phone" | "email"> = { title: "Aircare", phone: "", email: "" };

/** The single business entry (phone, request email); null-safe for an empty CMS. */
export async function getBusiness() {
	const { entries, cacheHint } = await getEmDashCollection("business", { limit: 1 });
	const business: Partial<Business> & typeof FALLBACK_BUSINESS = entries[0]?.data ?? FALLBACK_BUSINESS;
	return { business, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export type { Business, Highlight, Plan, Service, Step };
