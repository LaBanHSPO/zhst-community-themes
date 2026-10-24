import { getEmDashCollection } from "emdash";
import type { Celebration, Occasion, Principle, Service, Step, Studio } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A sunlit outdoor long table with pink linen, rattan chairs and a dahlia centrepiece, with the sea and a flower-covered wall beyond",
	"hero-home-mobile": "A sunlit outdoor long table with pink linen, rattan chairs and a dahlia centrepiece",
	"card-styling": "A place setting with an olive sprig and a menu card on a ceramic plate",
	"card-planning": "A white cake topped with dahlias and ranunculus on a brass cake stand",
	"card-celebrations": "A cream outdoor sofa and brass lanterns on a terrace at sunset above the sea",
	"long-table": "A long wooden table with pink linen napkins, rattan chargers and brass cutlery",
	"dahlia-centrepiece": "A tall arrangement of coral dahlias, ranunculus and yellow blooms in a stone vase with candles",
	"neon-wall": "A warm-white neon sign reading Good People Brighter Days beside climbing roses",
	"peony-table": "A table of peonies in a gold bowl with candles, a balloon arch and a blush arched backdrop",
	"balloon-arch": "A blush, cream and gold balloon arch with foliage, brass candlesticks and flowers",
	"peony-bouquet": "A gold bowl of peach peonies, ranunculus and yellow mimosa with olive foliage",
	"olive-arches": "Sunlit stone arches and an olive tree behind tapered candles",
	"coupes-candles": "Coupe glasses and fluted votives on a linen-covered table",
	"napkin-candles": "A pink napkin on a plate with candles and brass candlesticks",
	"gold-candles": "Pale pink tapers in brass holders in front of a balloon garland",
	"velvet-chairs": "Dusty-rose velvet chairs around a linen-covered table",
	"garden-vase": "Garden roses and wildflowers in a speckled ceramic vase",
	"lakeside-table": "A long table with flowers, candles and pink napkins under a flower arch beside the water",
	"place-card": "A cream card lettered Good People Brighter Parties in a brass holder",
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

export async function getCelebrations() {
	return getEmDashCollection("celebrations", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getOccasions() {
	return getEmDashCollection("occasions", { orderBy: { position: "asc" }, limit: 12 });
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
export const celebrationHref = (data: { slug: string | null; id: string }) => `/gallery/${data.slug ?? data.id}`;
export const celebrationMeta = (c: { place?: string; season?: string }) => [c.place, c.season].filter(Boolean).join(" · ");

export type { Celebration, Occasion, Principle, Service, Step, Studio };
