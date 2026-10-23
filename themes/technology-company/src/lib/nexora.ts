import { getEmDashCollection } from "emdash";
import type { Industry, Office, Opening, Principle, Solution } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

/** Bundled glass illustrations (cropped from the design screen), keyed by the `illustration` select. */
export const ILLUSTRATIONS: Record<Solution["illustration"], string> = {
	layers: "/images/illus-layers.webp",
	cubes: "/images/illus-cubes.webp",
	spheres: "/images/illus-spheres.webp",
};

export function illustrationSrc(kind: string | null | undefined): string {
	return ILLUSTRATIONS[(kind ?? "") as Solution["illustration"]] ?? ILLUSTRATIONS.layers;
}

export async function getSolutions() {
	return getEmDashCollection("solutions", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getIndustries() {
	return getEmDashCollection("industries", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getPrinciples(placement: Principle["placement"]) {
	const { entries, cacheHint } = await getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 40 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

/** Open roles, newest first by the posted date. */
export async function getOpenings(limit = 50) {
	return getEmDashCollection("openings", { orderBy: { posted: "desc" }, limit });
}

const FALLBACK_OFFICE: Pick<Office, "title" | "street" | "locality" | "email"> = {
	title: "",
	street: "",
	locality: "",
	email: "",
};

export type OfficeData = Partial<Office> & typeof FALLBACK_OFFICE;

/** The single company-details entry (address, contact); null-safe for an empty CMS. */
export async function getOffice() {
	const { entries, cacheHint } = await getEmDashCollection("office", { limit: 1 });
	const office: OfficeData = entries[0]?.data ?? FALLBACK_OFFICE;
	return { office, cacheHint };
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(office: OfficeData): string {
	const query = [office.street, office.locality, office.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Posted date: the editorial `posted` field, else the publish timestamp. */
export function postedDate(date: string | Date | null | undefined, publishedAt: Date | null): Date | null {
	if (date) {
		const d = date instanceof Date ? date : new Date(date);
		if (!Number.isNaN(d.getTime())) return d;
	}
	return publishedAt;
}

export function formatDate(d: Date): string {
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Saigon" }).format(d);
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export type { Industry, Opening, Principle, Solution };
