import { getEmDashCollection } from "emdash";
import type { Practice, Resource, Principle, Service, Step } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A smiling woman in an olive linen shirt leans on a kitchen counter full of kale, carrots, radishes, lemons, avocado and tomatoes",
	"nutritionist-portrait": "Nora resting her chin on one hand at a kitchen counter with kale, carrots, radishes, a lemon and an avocado in front of her",
	"nutritionist-counter": "Nora leaning on a bright kitchen counter, with bowls of kale, tomatoes and fresh vegetables in front of her",
	"resource-kale": "A speckled bowl of curly kale beside radishes and leafy greens",
	"resource-carrots": "Carrots and half a lemon on a wooden board beside an avocado",
	"resource-tomato": "A speckled bowl of vine tomatoes beside fresh herbs",
	"resource-bowl": "A speckled bowl of chickpea and avocado salad on a wooden table",
	"resource-veg": "A bowl of carrots, red cabbage, kale, lemons and radishes with a bowl of blueberries beside it",
	"resource-berries": "A bowl of blueberries and a dish of nuts on a wooden board with a sprig of herbs",
	"resource-notebook": "An open notebook with a gold pen on a wooden table",
	"resource-carafe": "A glass carafe of lemon slices and herbs on a wooden table",
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
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getResources() {
	return getEmDashCollection("resources", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getPrinciples() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK: Pick<Practice, "title" | "email"> = { title: "", email: "" };
export type PracticeData = Partial<Practice> & typeof FALLBACK;

/** The single practice entry (contact details); null-safe for an empty CMS. */
export async function getPractice() {
	const { entries, cacheHint } = await getEmDashCollection("practice", { limit: 1 });
	const practice: PracticeData = entries[0]?.data ?? FALLBACK;
	return { practice, cacheHint };
}

/** Resource types shown as filter links, in a fixed order. */
export const CATEGORIES = [
	{ slug: "articles", label: "Articles" },
	{ slug: "recipes", label: "Recipes" },
	{ slug: "guides", label: "Guides" },
] as const;

export const categoryLabel = (slug: string | null | undefined) => CATEGORIES.find((c) => c.slug === slug)?.label ?? "";

export const serviceHref = (data: { slug: string | null; id: string }) => `/services/${data.slug ?? data.id}`;
export const resourceHref = (data: { slug: string | null; id: string }) => `/resources/${data.slug ?? data.id}`;

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

export type { Practice, Resource, Principle, Service, Step };
