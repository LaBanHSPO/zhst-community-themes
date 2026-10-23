import { getEmDashCollection } from "emdash";
import type { Author, Book, Journal as JournalPost } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"cover-farther-shore": "The hardcover of The Farther Shore: a woman sitting on a sea cliff at sunset",
	"cover-lanterns": "Cover art for Lanterns on the Low Water: a figure on a rock above a lake at sunset",
	"coast-cliff": "A pale, misty coastline with rocky cliffs",
	"spines-stack": "Two clothbound books with gold leaf designs on their spines, stacked on a wooden table",
	"desk-notebook": "A speckled ceramic cup beside an open notebook and a fountain pen",
	"vase-flowers": "A speckled vase holding sprigs of small white flowers and olive leaves",
	"portrait-author": "The author at a wooden table, chin resting on her hand, smiling thoughtfully",
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

export async function getBooks() {
	return getEmDashCollection("books", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getPosts() {
	return getEmDashCollection("journal", { orderBy: { position: "asc" }, limit: 100 });
}

const FALLBACK_AUTHOR: Pick<Author, "title" | "email"> = { title: "", email: "" };

export type AuthorData = Partial<Author> & typeof FALLBACK_AUTHOR;

/** The single author entry (contact details); null-safe for an empty CMS. */
export async function getAuthor() {
	const { entries, cacheHint } = await getEmDashCollection("author", { limit: 1 });
	const author: AuthorData = entries[0]?.data ?? FALLBACK_AUTHOR;
	return { author, cacheHint };
}

/** The book flagged as featured, else the first one. */
export function pickFeatured<T extends { data: Book }>(books: T[]): T | undefined {
	return books.find((b) => b.data.featured) ?? books[0];
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

export function bookHref(data: { slug: string | null; id: string }): string {
	return `/books/${data.slug ?? data.id}`;
}

export function postHref(data: { slug: string | null; id: string }): string {
	return `/journal/${data.slug ?? data.id}`;
}

export type { Author, Book, JournalPost };
