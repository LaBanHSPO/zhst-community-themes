import { getEmDashCollection } from "emdash";
import type { Post, Project, Studio } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

export const CATEGORIES = [
	{ slug: "civic", label: "Civic" },
	{ slug: "interiors", label: "Interiors" },
	{ slug: "residential", label: "Residential" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryLabel(slug: string | null | undefined): string {
	return CATEGORIES.find((c) => c.slug === slug)?.label ?? "";
}

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A sweeping curved concrete cantilever with floor-to-ceiling glass, an infinity pool, the sea and mountains at golden hour",
	civic: "Looking up through a spiralling concrete rotunda to a circular opening in the sky",
	interiors: "A warm timber wall and a lone chair in a bright hall with floor-to-ceiling glass and sheer curtains",
	residential: "A stone portal framing an olive tree and a view of the sea at sunset",
	"glass-living": "A living room behind curved floor-to-ceiling glass, with a sofa, a lamp and a potted olive tree",
	"curve-soffit": "The sweeping curved edge of a concrete roof against a pale evening sky",
	"sea-horizon": "An infinity pool edge meeting the sea, with mountains on the horizon at sunset",
	"print-pool": "A curved concrete building reflected in a still pool at sunset",
	"print-interior": "A quiet hall with timber fins, a stone floor and a single bowl on a plinth",
	"pavilion-pool": "A concrete pavilion with a glazed living room, a pool in the foreground and soft evening light",
	"prints-camera": "A camera, an olive branch and printed architectural photographs on a stone ledge",
	"camera-lens": "A black camera with a wide lens resting on a stone ledge",
	"sunset-rocks": "A soft sunset sky over the sea with dark rocks in the foreground",
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

export async function getProjects() {
	return getEmDashCollection("projects", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getPosts() {
	return getEmDashCollection("posts", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getApproach() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 12 });
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

export function projectHref(data: { slug: string | null; id: string }): string {
	return `/work/${data.slug ?? data.id}`;
}

export function postHref(data: { slug: string | null; id: string }): string {
	return `/journal/${data.slug ?? data.id}`;
}

/** "Civic · Port Alder · 2024" style meta line. */
export function projectMeta(data: Pick<Project, "category" | "place" | "year">): string {
	return [categoryLabel(data.category), data.place, data.year].filter(Boolean).join(" · ");
}

export type { Post, Project, Studio };
