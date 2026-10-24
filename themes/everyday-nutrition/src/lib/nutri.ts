import { getEmDashCollection } from "emdash";
import type { Package, Recipe, Step, Studio } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-bowl": "A grain bowl with roasted sweet potato, chickpeas, kale, avocado and radish on a linen cloth, with a board of pumpkin seeds and a glass of lemon water",
	"bowl-sweet-potato": "A grain bowl with roasted sweet potato, chickpeas, quinoa, kale, avocado and radish seen from above",
	"bowl-chicken": "A bowl of sliced chicken, quinoa, kale, red cabbage, sweet potato, avocado and chickpeas on a kitchen counter",
	"card-recipes": "Hands chopping curly kale on a wooden board with a chef's knife",
	"card-choices": "A speckled bowl of lentil salad with roasted vegetables and herbs on a wooden table",
	"card-habits": "A speckled mug of tea beside a spiral notebook with handwriting on a wooden table",
	"avocado-board": "Half an avocado, cherry tomatoes, rocket and a small bowl of seeds on a wooden board",
	"oil-basil": "A bottle of olive oil, half a lemon and a pot of basil in morning light",
	"seeds-board": "A small stone bowl of pumpkin seeds on a wooden board with fresh herbs",
	"kitchen-wide": "A sunlit kitchen counter with a grain bowl, a bottle of olive oil, a lemon half, a pot of basil and a green cloth",
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

export const getPackages = () => getEmDashCollection("packages", { orderBy: { position: "asc" }, limit: 50 });
export const getRecipes = () => getEmDashCollection("recipes", { orderBy: { position: "asc" }, limit: 100 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 8 });

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "", email: "" };
export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single studio entry (contact details, hours); null-safe for an empty CMS. */
export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: StudioData = entries[0]?.data ?? FALLBACK_STUDIO;
	return { studio, cacheHint };
}

export const packageHref = (data: { slug: string | null; id: string }) => `/coaching/${data.slug ?? data.id}`;
export const recipeHref = (data: { slug: string | null; id: string }) => `/recipes/${data.slug ?? data.id}`;

export const MEALS = [
	{ value: "breakfast", label: "Breakfast" },
	{ value: "lunch", label: "Lunch" },
	{ value: "dinner", label: "Dinner" },
	{ value: "snacks", label: "Snacks" },
] as const;
export const mealLabel = (value: string | null | undefined) => MEALS.find((m) => m.value === value)?.label ?? "";

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Comma separated tags as a list. */
export function tagList(text: string | null | undefined): string[] {
	return (text ?? "").split(",").map((t) => t.trim()).filter(Boolean);
}

/** Opening hours: each line is "Day | time". */
export function hoursRows(text: string | null | undefined): { day: string; time: string }[] {
	return lines(text).map((l) => {
		const [day, ...rest] = l.split("|");
		return { day: day.trim(), time: rest.join("|").trim() };
	});
}

export type { Package, Recipe, Step, Studio };
