import { getEmDashCollection } from "emdash";
import type { Meal, Plan, Post, Step, Studio } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A woman in a black sports top and leggings sits on a rocky summit at golden hour, with hills and the sea behind her",
	athlete: "A woman in a black sports top and leggings sits on a rocky summit at golden hour",
	"bowl-home": "A grain bowl of sliced chicken, roasted sweet potato, kale and avocado on grey stone beside a green linen cloth and a black bottle",
	"bowl-top": "A grain bowl of sliced chicken, roasted sweet potato, kale and avocado seen from above",
	"bowl-side": "A bowl of grilled chicken, quinoa, avocado, rocket, red cabbage and tomato on a stone ledge, with a mountain behind",
	scene: "A chicken and quinoa bowl and a green smoothie on a stone ledge, with a dumbbell, a folded towel and a mountain coast behind",
	shaker: "A tall shaker bottle of green smoothie beside a lemon half and spinach leaves",
	dumbbell: "A black hex dumbbell and a folded grey towel on a stone ledge",
	landscape: "Hills, a bay and a rocky ledge seen from a summit in warm evening light",
	chicken: "Grilled chicken slices and roasted sweet potato over quinoa",
	avocado: "Sliced avocado, halved cherry tomatoes and pumpkin seeds on quinoa",
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

export const getPlans = () => getEmDashCollection("plans", { orderBy: { position: "asc" }, limit: 50 });
export const getMeals = () => getEmDashCollection("meals", { orderBy: { position: "asc" }, limit: 50 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 8 });
export async function getPosts() {
	const result = await getEmDashCollection("posts", { limit: 100 });
	const entries = [...result.entries].sort((a, b) => (b.data.posted ?? "").localeCompare(a.data.posted ?? ""));
	return { entries, cacheHint: result.cacheHint };
}

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "", email: "" };
export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single studio entry (contact details, hours, order info); null-safe for an empty CMS. */
export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: StudioData = entries[0]?.data ?? FALLBACK_STUDIO;
	return { studio, cacheHint };
}

export const planHref = (data: { slug: string | null; id: string }) => `/coaching/${data.slug ?? data.id}`;
export const postHref = (data: { slug: string | null; id: string }) => `/lifestyle/${data.slug ?? data.id}`;

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Opening hours: each line is "Day | time". */
export function hoursRows(text: string | null | undefined): { day: string; time: string }[] {
	return lines(text).map((l) => {
		const [day, ...rest] = l.split("|");
		return { day: day.trim(), time: rest.join("|").trim() };
	});
}

/** "2026-09-28" as "28 September 2026"; the raw text when it does not parse. */
export function formatDate(value: string | null | undefined): string {
	if (!value) return "";
	const d = new Date(`${value}T12:00:00Z`);
	if (Number.isNaN(d.getTime())) return value;
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(d);
}

/** Approximate macros per serving as one readable line. */
export function macroLine(m: { calories?: number | null; protein?: number | null; carbs?: number | null; fat?: number | null }): string {
	const parts: string[] = [];
	if (m.calories != null) parts.push(`${m.calories} kcal`);
	if (m.protein != null) parts.push(`${m.protein} g protein`);
	if (m.carbs != null) parts.push(`${m.carbs} g carbs`);
	if (m.fat != null) parts.push(`${m.fat} g fat`);
	return parts.join(" / ");
}

export type { Meal, Plan, Post, Step, Studio };
