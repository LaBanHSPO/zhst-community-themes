import { getEmDashCollection } from "emdash";
import type { Journal, Story } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

export const CATEGORIES = [
	{ slug: "living", label: "Living", blurb: "Kitchen habits, linen, flowers and the small things that make a house easier to be in." },
	{ slug: "wellbeing", label: "Wellbeing", blurb: "Short routines for evenings and mornings that fit around a busy week." },
	{ slug: "travel", label: "Travel", blurb: "Coastal walks, off-season villages and how to keep a record of a trip." },
] as const;

export const PAGE_SIZE = 6;

/** Contact form topics; `?topic=<slug>` pre-selects one. */
export const TOPICS = [
	{ slug: "story-idea", label: "A ritual or walk I would like to share" },
	{ slug: "question", label: "A question about a story" },
	{ slug: "newsletter", label: "The monthly email letter" },
	{ slug: "other", label: "Something else" },
] as const;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	hero: "A sunlit wooden table by a window with a speckled ceramic mug, three stacked books, a glass vase of white flowers and a knitted throw",
	lemons: "A wooden bowl of lemons on a kitchen counter beside a potted herb and a striped tea towel",
	coast: "A woman in a sun hat sitting on a rocky cliff above the sea",
	notebook: "A speckled mug and a spiral notebook with a pen on a marble table",
	"table-wide": "A speckled mug and a stack of books on a sunlit wooden table",
	"flowers-sign": "A glass vase of small white flowers in front of a framed sign and a wooden chair",
	"latte-table": "A latte on a cork coaster beside an open scrapbook on a wooden table",
	"open-book": "An open scrapbook with two taped photographs on a wooden table",
	village: "A printed photograph of a hillside village above the sea",
	bedside: "A speckled mug on a rumpled linen bed beside an olive sprig",
	"vase-olive": "A speckled ceramic vase with an olive branch on a wooden table",
	"linen-olive": "A striped linen towel with an olive sprig beside an open book",
	scrapbook: "A latte, an open scrapbook, a ceramic vase and a linen towel with an olive sprig on a wooden table",
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

export async function getStories() {
	return getEmDashCollection("stories", { orderBy: { position: "asc" }, limit: 100 });
}

const FALLBACK_JOURNAL: Pick<Journal, "title" | "email"> = { title: "", email: "" };

export type JournalData = Partial<Journal> & typeof FALLBACK_JOURNAL;

/** The single journal-details entry (contact info and notes); null-safe for an empty CMS. */
export async function getJournal() {
	const { entries, cacheHint } = await getEmDashCollection("journal", { limit: 1 });
	const journal: JournalData = entries[0]?.data ?? FALLBACK_JOURNAL;
	return { journal, cacheHint };
}

export function storyHref(data: { slug: string | null; id: string }): string {
	return `/stories/${data.slug ?? data.id}`;
}

export function categoryHref(slug: string): string {
	return `/stories?category=${slug}`;
}

export function categoryLabel(slug: string | null | undefined): string {
	return CATEGORIES.find((c) => c.slug === slug)?.label ?? "";
}

/** "5 min read" label, empty when the story has no reading time. */
export function readLabel(data: { read_minutes?: number | null }): string {
	return data.read_minutes ? `${data.read_minutes} min read` : "";
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export type { Journal, Story };
