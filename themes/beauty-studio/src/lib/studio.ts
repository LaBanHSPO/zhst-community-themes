import { getEmDashCollection } from "emdash";
import type { Studio, Treatment } from "../../emdash-env";

/** Treatment categories in display order; slugs match the `category` select options. */
export const CATEGORIES = [
	{
		slug: "facials",
		label: "Facials",
		blurb: "Slow, tailored facials with warm towels and a long massage.",
		photo: "/images/facials.webp",
		alt: "Close-up of a relaxed face with fresh, glowing skin",
	},
	{
		slug: "nails",
		label: "Nails",
		blurb: "Manicures and pedicures with a clean, natural finish.",
		photo: "/images/nails.webp",
		alt: "A hand with neutral pink manicured nails resting on a towel",
	},
	{
		slug: "hair",
		label: "Hair",
		blurb: "Cuts, colour gloss and styling designed around how you wear your hair.",
		photo: "/images/hair.webp",
		alt: "A low, softly twisted updo with a gold hoop earring",
	},
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryOf(slug: string | null | undefined) {
	return CATEGORIES.find((c) => c.slug === slug);
}

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export async function getTreatments() {
	const result = await getEmDashCollection("treatments", { orderBy: { position: "asc" }, limit: 200 });
	return result;
}

export async function getGallery() {
	return getEmDashCollection("gallery", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getValues() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 40 });
}

export async function getTeam() {
	return getEmDashCollection("team", { orderBy: { position: "asc" }, limit: 60 });
}

const FALLBACK_STUDIO: Pick<Studio, "title" | "street" | "locality" | "email"> = {
	title: "",
	street: "",
	locality: "",
	email: "",
};

export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single studio entry (address, contact, hours); null-safe for an empty CMS. */
export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: StudioData = entries[0]?.data ?? FALLBACK_STUDIO;
	return { studio, cacheHint };
}

/** Treatments grouped by category, in category order, sorted by position (CMS order). */
export function groupByCategory<T extends { data: Pick<Treatment, "category"> }>(entries: T[]) {
	return CATEGORIES.map((category) => ({
		category,
		items: entries.filter((e) => e.data.category === category.slug),
	})).filter((g) => g.items.length > 0);
}

/** Opening hours: one `Day|Hours` pair per line. */
export function hoursRows(hours: string | null | undefined): { day: string; time: string }[] {
	return (hours ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean)
		.map((l) => {
			const [day, ...rest] = l.split("|");
			return { day: day.trim(), time: rest.join("|").trim() };
		});
}

export function formatPrice(price: number | null | undefined): string {
	return typeof price === "number" ? `$${price}` : "";
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(studio: StudioData): string {
	const query = [studio.street, studio.locality, studio.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function entryHref(base: string, data: { slug: string | null; id: string }): string {
	return `${base}/${data.slug ?? data.id}`;
}

export type { Studio, Treatment };
