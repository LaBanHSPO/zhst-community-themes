import { getEmDashEntry } from "emdash";
import type { ImageValue } from "emdash";

/** Media value as stored on image fields (seeded or uploaded). */
export type ImageField = ImageValue;

export interface GalleryItem {
	image?: ImageField | null;
	caption?: string | null;
}

export interface StudioDetails {
	name: string;
	heroTitle: string;
	heroSubtitle: string;
	heroImage: ImageField | null;
	heroCta: string;
	asideNote: string[];
	heroValues: string[];
	featuredNote: string;
	intro: string;
	email: string;
	phone: string;
	address: string[];
	hours: string;
	purchaseNote: string;
}

const FALLBACK_STUDIO: StudioDetails = {
	name: "Atelier",
	heroTitle: "Objects for everyday rituals",
	heroSubtitle: "Handmade ceramics for a more meaningful home",
	heroImage: null,
	heroCta: "Explore the collection",
	asideNote: [],
	heroValues: [],
	featuredNote: "",
	intro: "",
	email: "",
	phone: "",
	address: [],
	hours: "",
	purchaseNote: "",
};

/** Split a multi-line text field into trimmed, non-empty lines. */
export function lines(value: unknown): string[] {
	if (typeof value !== "string") return [];
	return value
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);
}

function text(value: unknown, fallback = ""): string {
	return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

/** Studio details live in a single `studio` entry; every field falls back gracefully. */
export async function getStudio(): Promise<{ studio: StudioDetails; cacheHint?: unknown }> {
	try {
		const { entry, cacheHint } = await getEmDashEntry("studio", "studio");
		if (!entry) return { studio: FALLBACK_STUDIO };
		const d = entry.data;
		return {
			cacheHint,
			studio: {
				name: text(d.name, FALLBACK_STUDIO.name),
				heroTitle: text(d.hero_title, FALLBACK_STUDIO.heroTitle),
				heroSubtitle: text(d.hero_subtitle, FALLBACK_STUDIO.heroSubtitle),
				heroImage: d.hero_image?.src || d.hero_image?.id ? d.hero_image : null,
				heroCta: text(d.hero_cta, FALLBACK_STUDIO.heroCta),
				asideNote: lines(d.aside_note),
				heroValues: lines(d.hero_values),
				featuredNote: text(d.featured_note),
				intro: text(d.intro),
				email: text(d.email),
				phone: text(d.phone),
				address: lines(d.address),
				hours: text(d.hours),
				purchaseNote: text(d.purchase_note),
			},
		};
	} catch (error) {
		console.error("[atelier] Failed to load studio details:", error);
		return { studio: FALLBACK_STUDIO };
	}
}

/** First gallery image that actually carries media. */
export function coverImage(images: GalleryItem[] | null | undefined): GalleryItem | null {
	return (images ?? []).find((item) => item?.image && (item.image.src || item.image.id)) ?? null;
}

export function validImages(images: GalleryItem[] | null | undefined): GalleryItem[] {
	return (images ?? []).filter((item) => item?.image && (item.image.src || item.image.id));
}

/** Sort by an optional integer `sort_order`, then title. */
export function bySortOrder<T extends { data: { sort_order?: number | null; title?: string; name?: string } }>(
	a: T,
	b: T,
): number {
	const ao = a.data.sort_order ?? Number.MAX_SAFE_INTEGER;
	const bo = b.data.sort_order ?? Number.MAX_SAFE_INTEGER;
	if (ao !== bo) return ao - bo;
	return (a.data.title ?? a.data.name ?? "").localeCompare(b.data.title ?? b.data.name ?? "");
}

/** Only allow http(s) outbound purchase links. */
export function safeExternalUrl(value: unknown): string | null {
	if (typeof value !== "string" || !value.trim()) return null;
	try {
		const url = new URL(value.trim());
		return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
	} catch {
		return null;
	}
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
