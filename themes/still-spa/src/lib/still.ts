import { getEmDashCollection } from "emdash";
import type { Business, Highlight, Therapist, Treatment } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
}

export const CATEGORIES = [
	{
		key: "massage",
		label: "Massage",
		icon: "lotus",
		heading: "Massage Treatments",
		intro: "Release tension, ease tired muscles and restore a sense of calm with our range of therapeutic massages.",
	},
	{
		key: "facial",
		label: "Facial",
		icon: "face",
		heading: "Facial Treatments",
		intro: "Gentle, results-minded facials that cleanse, nourish and calm the skin, chosen for how your skin feels today.",
	},
	{
		key: "body",
		label: "Body",
		icon: "leaf",
		heading: "Body Treatments",
		intro: "Warm stones, mineral scrubs and nourishing wraps to soften the skin and settle the whole body.",
	},
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export function categoryOf(value: string | null | undefined) {
	return CATEGORIES.find((c) => c.key === value) ?? CATEGORIES[0];
}

export function slugOf(entry: { slug: string | null; id: string }): string {
	return entry.slug ?? entry.id;
}

export function treatmentUrl(entry: { slug: string | null; id: string }): string {
	return `/treatments/${encodeURIComponent(slugOf(entry))}`;
}

/** Appointment form link; options preselect a treatment and/or therapist by slug. */
export function appointmentUrl(options: { treatment?: string; therapist?: string } = {}): string {
	const params = new URLSearchParams();
	if (options.treatment) params.set("treatment", options.treatment);
	if (options.therapist) params.set("therapist", options.therapist);
	const qs = params.toString();
	return `/appointment${qs ? `?${qs}` : ""}`;
}

/** "$120" style price, or null when the entry has none. */
export function money(value: number | null | undefined): string | null {
	if (value === null || value === undefined || Number.isNaN(value)) return null;
	return `$${value.toLocaleString("en-US")}`;
}

/** "60 minutes", or null when the entry has none. */
export function minutes(value: number | null | undefined): string | null {
	if (!value) return null;
	return `${value} minutes`;
}

/** First name for "Book with Maya". */
export function firstName(name: string): string {
	return name.trim().split(/\s+/)[0] ?? name;
}

/** "Massage, Aromatherapy" → ["Massage", "Aromatherapy"] */
export function practiceList(value: string | null | undefined): string[] {
	return (value ?? "")
		.split(/[,|]/)
		.map((s) => s.trim())
		.filter(Boolean);
}

export async function getTreatments() {
	return getEmDashCollection("treatments", { orderBy: { position: "asc" }, limit: 60 });
}

/** The treatment flagged as the signature treatment (first by sort order). */
export async function getSignature() {
	const { entries, cacheHint } = await getTreatments();
	return { entry: entries.find((e) => e.data.signature) ?? null, cacheHint };
}

export async function getTherapists() {
	return getEmDashCollection("therapists", { orderBy: { position: "asc" }, limit: 24 });
}

/** Short icon + text items for one page: `home` or `appointment`. */
export async function getHighlights(placement: string) {
	const { entries, cacheHint } = await getEmDashCollection("highlights", { orderBy: { position: "asc" }, limit: 30 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

const FALLBACK_BUSINESS: Pick<Business, "title" | "email"> = { title: "Still", email: "" };

/** The single business entry (appointment email, phone); null-safe for an empty CMS. */
export async function getBusiness() {
	const { entries, cacheHint } = await getEmDashCollection("business", { limit: 1 });
	const business: Partial<Business> & typeof FALLBACK_BUSINESS = entries[0]?.data ?? FALLBACK_BUSINESS;
	return { business, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export type { Business, Highlight, Therapist, Treatment };
