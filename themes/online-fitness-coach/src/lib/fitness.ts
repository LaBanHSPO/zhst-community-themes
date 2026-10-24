import { getEmDashCollection } from "emdash";

export const EQUIPMENT = [
	{ slug: "none", label: "No equipment", short: "None", blurb: "Workouts with a mat or a towel and nothing else." },
	{ slug: "dumbbells", label: "Dumbbells", short: "Dumbbells", blurb: "Programs that use one or two pairs of dumbbells." },
	{ slug: "gym", label: "Gym", short: "Gym", blurb: "Programs for a gym with machines, dumbbells and a barbell." },
] as const;

export const LEVELS = [
	{ slug: "beginner", label: "Beginner" },
	{ slug: "all-levels", label: "All levels" },
	{ slug: "intermediate", label: "Intermediate" },
] as const;

export const CATEGORIES = [
	{ slug: "workouts", label: "Workouts", blurb: "Simple workouts you can follow today. Each one lists what you need." },
	{ slug: "habits", label: "Habits", blurb: "Short guides on fitting training into a normal week." },
	{ slug: "getting-started", label: "Getting started", blurb: "Set-up advice for a small space and a small budget." },
] as const;

export function equipmentLabel(slug: string | null | undefined) {
	return EQUIPMENT.find((e) => e.slug === slug)?.label ?? "";
}

export function levelLabel(slug: string | null | undefined) {
	return LEVELS.find((l) => l.slug === slug)?.label ?? "";
}

export function categoryLabel(slug: string | null | undefined) {
	return CATEGORIES.find((c) => c.slug === slug)?.label ?? "";
}

export const getPrograms = () => getEmDashCollection("programs", { orderBy: { position: "asc" }, limit: 100 });
export const getResources = () => getEmDashCollection("resources", { orderBy: { position: "asc" }, limit: 100 });
export const getFaqs = () => getEmDashCollection("faqs", { orderBy: { position: "asc" }, limit: 100 });
export const getWeek = () => getEmDashCollection("week", { orderBy: { position: "asc" }, limit: 10 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 10 });
export const getHighlights = () => getEmDashCollection("highlights", { orderBy: { position: "asc" }, limit: 10 });

const FALLBACK = { title: "", name: "", email: "" };
export type CoachData = {
	title: string;
	name: string;
	email: string;
	place?: string;
	phone?: string;
	hours?: string;
	booking_note?: string;
};

export async function getCoach() {
	const { entries, cacheHint } = await getEmDashCollection("coach", { limit: 1 });
	const coach: CoachData = (entries[0]?.data as CoachData | undefined) ?? FALLBACK;
	return { coach, cacheHint };
}

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function labelRows(text: string | null | undefined): { label: string; text: string }[] {
	return lines(text).map((l) => {
		const [label, ...rest] = l.split("|");
		return { label: label.trim(), text: rest.join("|").trim() };
	});
}

export function formatPrice(price: number | null | undefined): string {
	return typeof price === "number" ? `$${price}` : "";
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
