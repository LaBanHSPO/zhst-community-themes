import { getEmDashCollection } from "emdash";
import type { Cook, Recipe, Season, Story } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A speckled bowl of spaghetti with roasted cherry tomatoes, basil and parmesan on a dark wooden table beside a striped linen cloth",
	"card-squash-salad": "A bowl of roasted squash salad with kale, feta, pomegranate seeds and pumpkin seeds",
	"card-carrot-soup": "A stoneware bowl of orange carrot soup with a swirl of yogurt, herbs and seeds",
	"card-lemon-chicken": "Roasted chicken thighs with lemon slices and fresh herbs in a shallow dish",
	"card-cookies": "A stack of three dark chocolate cookies with flaky salt on top",
	"spaghetti-bowl": "Spaghetti with roasted cherry tomatoes, basil leaves and grated parmesan in a speckled bowl",
	"quinoa-bowl": "A bowl of quinoa with charred cherry tomatoes, courgette, crumbled feta, avocado slices and basil",
	"penne-basil": "Penne in a rich tomato sauce with basil leaves and grated parmesan on a plate",
	"herb-salad": "A plate of salad leaves with roasted carrot, crumbled feta and black olives",
	"cookie-rack": "Chocolate chip cookies cooling on a wire rack",
	"notebook-spread": "An open recipe notebook with a photograph of spaghetti on the left page and small ingredient drawings on the right, beside a bottle of olive oil and a pot of basil",
	"basil-oil": "A bottle of olive oil with a cork stopper beside a pot of fresh basil on a pale stone counter",
	"parmesan-board": "A wedge of parmesan on a wooden board with basil leaves and garlic",
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

export const getRecipes = () => getEmDashCollection("recipes", { orderBy: { position: "asc" }, limit: 200 });
export const getStories = () => getEmDashCollection("stories", { orderBy: { position: "asc" }, limit: 200 });
export const getSeason = () => getEmDashCollection("season", { orderBy: { position: "asc" }, limit: 20 });

const FALLBACK_COOK: Pick<Cook, "title" | "email"> = { title: "", email: "" };
export type CookData = Partial<Cook> & typeof FALLBACK_COOK;

/** The single cook entry (contact details); null-safe for an empty CMS. */
export async function getCook() {
	const { entries, cacheHint } = await getEmDashCollection("cook", { limit: 1 });
	const cook: CookData = entries[0]?.data ?? FALLBACK_COOK;
	return { cook, cacheHint };
}

export const recipeHref = (data: { slug: string | null; id: string }) => `/recipes/${data.slug ?? data.id}`;
export const storyHref = (data: { slug: string | null; id: string }) => `/stories/${data.slug ?? data.id}`;

/** The four recipe collections shown on the homepage design. */
export const COLLECTIONS = [
	{ value: "fresh-seasonal", label: "Fresh & Seasonal", blurb: "Salads and bowls built around what is good this month.", photo: "/images/quinoa-bowl.webp" },
	{ value: "cozy-classics", label: "Cozy Classics", blurb: "Soups and slow sauces for a cold evening.", photo: "/images/penne-basil.webp" },
	{ value: "weeknight-favorites", label: "Weeknight Favorites", blurb: "Dinners that are on the table in about an hour.", photo: "/images/spaghetti-bowl.webp" },
	{ value: "something-sweet", label: "Something Sweet", blurb: "Cookies and small bakes that keep for a few days.", photo: "/images/cookie-rack.webp" },
] as const;
export const collectionLabel = (value: string | null | undefined) => COLLECTIONS.find((c) => c.value === value)?.label ?? "";

export const COURSES = [
	{ value: "starter", label: "Starters" },
	{ value: "main", label: "Mains" },
	{ value: "side", label: "Sides" },
	{ value: "dessert", label: "Desserts" },
] as const;
export const courseLabel = (value: string | null | undefined) => COURSES.find((c) => c.value === value)?.label ?? "";
const courseSingular: Record<string, string> = { starter: "Starter", main: "Main", side: "Side", dessert: "Dessert" };
export const courseName = (value: string | null | undefined) => courseSingular[value ?? ""] ?? "";

export function recipesHref(params: { collection?: string; course?: string } = {}): string {
	const q = new URLSearchParams();
	if (params.collection) q.set("collection", params.collection);
	if (params.course) q.set("course", params.course);
	const s = q.toString();
	return s ? `/recipes?${s}` : "/recipes";
}

export function minutesLabel(min: number | null | undefined): string {
	if (!min) return "";
	const h = Math.floor(min / 60);
	const m = min % 60;
	if (h === 0) return `${m} min`;
	return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

export const totalMinutes = (r: { prep_minutes?: number | null; cook_minutes?: number | null }) =>
	(r.prep_minutes ?? 0) + (r.cook_minutes ?? 0);

export function servingsLabel(r: { servings?: number | null; servings_unit?: string | null }): string {
	if (!r.servings) return "";
	const unit = (r.servings_unit || "servings").trim();
	return unit === "servings" ? `Serves ${r.servings}` : `Makes ${r.servings} ${unit}`;
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Ingredient lines grouped under optional "# Heading" lines. */
export function ingredientGroups(text: string | null | undefined): { heading: string; items: string[] }[] {
	const groups: { heading: string; items: string[] }[] = [{ heading: "", items: [] }];
	for (const line of lines(text)) {
		if (line.startsWith("#")) groups.push({ heading: line.replace(/^#+\s*/, ""), items: [] });
		else groups[groups.length - 1].items.push(line);
	}
	return groups.filter((g) => g.items.length > 0);
}

/** Plain text of a Portable Text value, for search. */
export function plainText(value: any[] | null | undefined): string {
	return (value ?? [])
		.map((b) => (b?._type === "block" ? (b.children ?? []).map((c: any) => c.text ?? "").join("") : ""))
		.join(" ");
}

export function storyMeta(story: { date_label?: string | null; reading_time?: number | null }): string {
	return [story.date_label, story.reading_time ? `${story.reading_time} min read` : ""].filter(Boolean).join(" · ");
}

export const countWord = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${n} ${many}`);

function iso(min: number | null | undefined): string | undefined {
	return min ? `PT${min}M` : undefined;
}

/** schema.org Recipe structured data built from the recipe fields. */
export function recipeJsonLd(
	d: Recipe,
	opts: { url: string; image?: string; author?: string },
): Record<string, unknown> {
	const total = totalMinutes(d);
	const unit = (d.servings_unit || "servings").trim();
	return {
		"@context": "https://schema.org",
		"@type": "Recipe",
		name: d.title,
		description: d.summary ?? undefined,
		image: opts.image ? [opts.image] : undefined,
		author: opts.author ? { "@type": "Person", name: opts.author } : undefined,
		url: opts.url,
		prepTime: iso(d.prep_minutes),
		cookTime: iso(d.cook_minutes),
		totalTime: iso(total),
		recipeYield: d.servings ? `${d.servings} ${unit}` : undefined,
		recipeCategory: courseName(d.course) || undefined,
		keywords: [collectionLabel(d.collection), courseName(d.course)].filter(Boolean).join(", ") || undefined,
		recipeIngredient: lines(d.ingredients).filter((l) => !l.startsWith("#")),
		recipeInstructions: lines(d.method).map((text) => ({ "@type": "HowToStep", text })),
	};
}

export type { Cook, Recipe, Season, Story };
