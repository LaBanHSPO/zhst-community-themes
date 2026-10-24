import { getEmDashCollection } from "emdash";
import type { Service, Studio, Wedding } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A flower arch on a lakeside stone terrace, with rows of wooden chairs and mountains beyond",
	"hero-home-mobile": "A flower arch on a lakeside stone terrace, with rows of wooden chairs and mountains beyond",
	"approach-roses": "Blush and ivory roses on tulle beside a card and two gold rings in a dish",
	"arch-lakeside": "A ceremony arch of garden roses and olive branches above a stone terrace and the lake",
	"chairs-blooms": "Rows of wooden ceremony chairs behind loose arrangements of white and blush flowers",
	"rings-card": "A handwritten card and two gold rings in a ceramic dish on tulle",
	"sunset-ceremony": "A draped flower arch, a guest book and gold rings on a terrace above the sea at sunset",
	"arch-sunset": "A silk-draped arch of roses and olive branches against a peach sunset sky",
	"bouquet-ribbon": "A bouquet of blush roses and white hydrangea tied with a long silk ribbon",
	"guest-book": "A guest book, pen and gold rings on a marble table with olive leaves",
	"aisle-lanterns": "Brass lanterns with candles lining a marble aisle between rows of chairs",
	"olive-terrace": "An old olive tree beside a stone terrace with flowers, chairs and the sea behind",
	"sea-sunset": "A calm sea and distant hills at sunset beyond a flower-draped arch",
	"arch-lake": "A flower arch beside a stone balustrade, with cypress trees and the lake behind",
};

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function photoAlt(image: ImageLike, photo: string | null | undefined, fallback = ""): string {
	if (image?.alt) return image.alt;
	const name = photo?.split("/").pop()?.replace(/\.\w+$/, "");
	return (name && PHOTO_ALT[name]) || fallback;
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 20 });
}

export async function getWeddings() {
	return getEmDashCollection("weddings", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getPrinciples() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "", email: "" };

export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single studio entry (contact details); null-safe for an empty CMS. */
export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: StudioData = entries[0]?.data ?? FALLBACK_STUDIO;
	return { studio, cacheHint };
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export const serviceHref = (data: { slug: string | null; id: string }) => `/services/${data.slug ?? data.id}`;
export const weddingHref = (data: { slug: string | null; id: string }) => `/work/${data.slug ?? data.id}`;
export const weddingMeta = (w: { place?: string; season?: string }) => [w.place, w.season].filter(Boolean).join(" · ");

export type { Service, Studio, Wedding };
