import { getEmDashCollection } from "emdash";
import type { Company } from "../../emdash-env";

export const TYPES = [
	{ slug: "market", label: "Market walks", one: "Market walk" },
	{ slug: "cooking", label: "Cooking classes", one: "Cooking class" },
	{ slug: "lunch", label: "Long lunches", one: "Long lunch" },
	{ slug: "multi-day", label: "Multi-day trips", one: "Multi-day trip" },
] as const;

export const typeLabel = (slug: string | null | undefined) => TYPES.find((t) => t.slug === slug)?.one ?? "";

export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function rows(text: string | null | undefined): { left: string; right: string }[] {
	return lines(text).map((l) => {
		const [a, ...rest] = l.split("|");
		return { left: a.trim(), right: rest.join("|").trim() };
	});
}

export function formatPrice(price: number | null | undefined): string {
	if (typeof price !== "number") return "";
	return `€${price.toLocaleString("en-US")} per person`;
}

export const DIETS = [
	{ key: "diet_vegetarian", label: "Vegetarian" },
	{ key: "diet_vegan", label: "Vegan" },
	{ key: "diet_gluten_free", label: "Gluten-free" },
] as const;

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export async function getExperiences() {
	const result = await getEmDashCollection("experiences", { limit: 200 });
	const experiences = [...result.entries].sort((a, b) => Number(a.data.position ?? 0) - Number(b.data.position ?? 0));
	return { experiences, cacheHint: result.cacheHint };
}
export type ExperienceEntry = Awaited<ReturnType<typeof getExperiences>>["experiences"][number];

export async function getDestinations() {
	const result = await getEmDashCollection("destinations", { orderBy: { position: "asc" }, limit: 50 });
	return { destinations: result.entries, cacheHint: result.cacheHint };
}

export async function getHosts() {
	return getEmDashCollection("hosts", { orderBy: { position: "asc" }, limit: 30 });
}

const FALLBACK: Pick<Company, "title" | "street" | "locality" | "email"> = { title: "", street: "", locality: "", email: "" };
export type CompanyData = Partial<Company> & typeof FALLBACK;

export async function getCompany() {
	const { entries, cacheHint } = await getEmDashCollection("company", { limit: 1 });
	const company: CompanyData = entries[0]?.data ?? FALLBACK;
	return { company, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function initials(name: string): string {
	return name
		.split(/\s+/)
		.map((p) => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

const ALT: Record<string, string> = {
	"card-market": "A market stall with baskets of spices, olives and lemons, and shoppers walking the aisle behind it",
	"class-pasta": "A host and three guests in aprons shaping filled pasta at a floured table, with a hill town and the sea behind them",
	"card-pasta": "Hands pulling fresh ribbons of pasta over a floured wooden table",
	"card-lunch": "Four friends sharing a long lunch on a flowered terrace above the sea",
	produce: "Baskets of ripe tomatoes, basil and artichokes beside a bowl of lemons on a market table",
	"garlic-chili": "Braids of garlic and strings of dried red chilies hanging at a market stall",
	"cheese-board": "A block of hard cheese, a ball of dough and a small bowl of olive oil on a wooden board",
	"coast-town": "A pale coastal town climbing a steep hill above a blue bay, with lemons hanging at the corner of the frame",
	"tomato-woman": "A smiling woman in a straw hat holds a ripe tomato at a market stall",
	"vendor-stall": "A stallholder in a flat cap beside a chalkboard sign and crates of tomatoes",
	"table-wide": "Guests in aprons making filled pasta at a table by the sea, with tomatoes, basil, lemons and cheese in front of them",
	"host-luca": "A cook in a white jacket and apron smiling as he shapes pasta",
	notebook: "A notebook with handwritten words about markets, people and places",
};

/** Alt text for a bundled photo path such as /images/class-pasta.webp. */
export function altFor(src: string | null | undefined, fallback = ""): string {
	const key = (src ?? "").replace(/^.*\//, "").replace(/\.\w+$/, "");
	return ALT[key] ?? fallback;
}
