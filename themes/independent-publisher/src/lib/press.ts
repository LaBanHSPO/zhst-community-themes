import { getEmDashCollection } from "emdash";
import type { Author, Book, Journal, Press, Topic } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

export const GENRES = [
	{ slug: "fiction", label: "Fiction" },
	{ slug: "poetry", label: "Poetry" },
	{ slug: "nonfiction", label: "Nonfiction" },
] as const;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"cover-river-between": "Cover of The River Between: a mountain valley with a river winding through forest",
	"cover-brighter-silence": "Cover of A Brighter Silence: golden ginkgo leaves on cream paper",
	"cover-long-way-home": "Cover of The Long Way Home: a sea cliff under a blue sky",
	"cover-small-kindnesses": "Cover of Small Kindnesses: a hillside with cypress trees and a farmhouse",
	"journal-notebook": "A fountain pen resting on an open manuscript beside a dark stone bowl",
	"journal-olive": "An olive branch in a speckled vase beside a row of cloth-bound books",
	"journal-stone": "A piece of green-veined stone on a stack of small books in warm light",
	"journal-bowl": "A dark marble bowl and a speckled vase next to cloth-bound books",
	"journal-cliff": "A cloth-bound book with a coastal cliff and a pale sun on its cover",
	shelf: "Cloth-bound books, a stone bowl, a vase of olive leaves and a pen on an open manuscript",
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
	return getEmDashCollection("books", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getAuthors() {
	return getEmDashCollection("authors", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getJournal() {
	return getEmDashCollection("journal", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getTopics() {
	return getEmDashCollection("topics", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK_PRESS: Pick<Press, "title" | "email"> = { title: "", email: "" };

export type PressData = Partial<Press> & typeof FALLBACK_PRESS;

/** The single publisher-details entry (contact info); null-safe for an empty CMS. */
export async function getPress() {
	const { entries, cacheHint } = await getEmDashCollection("press", { limit: 1 });
	const press: PressData = entries[0]?.data ?? FALLBACK_PRESS;
	return { press, cacheHint };
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

/** Paragraphs of a text field, separated by blank lines. */
export function paragraphs(text: string | null | undefined): string[] {
	return (text ?? "")
		.split(/\n\s*\n/)
		.map((p) => p.replace(/\s*\n\s*/g, " ").trim())
		.filter(Boolean);
}

export const slugOf = (data: { slug: string | null; id: string }) => data.slug ?? data.id;
export const bookHref = (data: { slug: string | null; id: string }) => `/books/${slugOf(data)}`;
export const authorHref = (data: { slug: string | null; id: string }) => `/authors/${slugOf(data)}`;
export const journalHref = (data: { slug: string | null; id: string }) => `/journal/${slugOf(data)}`;

export function genreLabel(slug: string | null | undefined): string {
	return GENRES.find((g) => g.slug === slug)?.label ?? "";
}

/** "LH" from "L. K. Hart": first letter of the first and last words. */
export function initials(name: string): string {
	const words = name.split(/\s+/).filter(Boolean);
	if (words.length === 0) return "";
	const first = words[0]![0] ?? "";
	const last = words.length > 1 ? (words[words.length - 1]![0] ?? "") : "";
	return `${first}${last}`.toUpperCase();
}

export type { Author, Book, Journal, Press, Topic };
