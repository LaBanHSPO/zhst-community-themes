import { getEmDashCollection } from "emdash";
import type { Article, Studio } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

export const CATEGORIES = [
	{ slug: "technology", label: "Technology" },
	{ slug: "productivity", label: "Productivity" },
	{ slug: "lifestyle", label: "Lifestyle" },
	{ slug: "culture", label: "Culture" },
] as const;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-desk": "A sunlit writing desk with stacked books, a mug, a potted plant, an open notebook and pinned coastal photographs",
	"coast-path": "A footpath winding along a grassy clifftop above the sea at sunset",
	"focused-day": "A cup of black coffee beside an open notebook and pen on a wooden desk",
	valley: "A green mountain valley with forested slopes in soft morning light",
	"books-stack": "A stack of three books titled Better Questions, Brighter Ideas and Kinder Futures",
	"desk-full": "A warm wooden desk with printed article pages, a steaming cup, a notebook with a fountain pen and a plant by the window",
	"desk-wide": "Printed article pages, a notebook and a fountain pen on a wooden desk in golden light",
	"window-cup": "A speckled ceramic cup of coffee on a coaster beside an open notebook",
	"notebook-pen": "An open handwritten notebook with a black fountain pen",
	papers: "A fan of printed article pages with coastal photographs on a wooden desk",
	"plant-sea": "A potted olive plant on a desk in front of a window looking out to the sea",
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

export async function getArticles() {
	return getEmDashCollection("articles", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "", email: "" };

export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single writer-details entry (contact info); null-safe for an empty CMS. */
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

export function articleHref(data: { slug: string | null; id: string }): string {
	return `/work/${data.slug ?? data.id}`;
}

export function categoryLabel(slug: string | null | undefined): string {
	return CATEGORIES.find((c) => c.slug === slug)?.label ?? "";
}

/** "TECHNOLOGY / 6 MIN READ" style meta, uppercased in CSS. */
export function articleMeta(data: { category?: string | null; read_minutes?: number | null }): string {
	const cat = categoryLabel(data.category);
	const read = data.read_minutes ? `${data.read_minutes} min read` : "";
	return [cat, read].filter(Boolean).join(" / ");
}

export type { Article, Studio };
