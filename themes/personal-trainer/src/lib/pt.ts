import { getEmDashCollection } from "emdash";
import type { Plan, Step, Studio, Training } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A smiling trainer in a black t-shirt with his arms crossed in a dark gym, a woman doing a kettlebell swing behind him",
	"trainer-arms": "A smiling trainer in a black t-shirt and a smartwatch with his arms crossed",
	kneel: "A trainer in black kneeling on a gym floor and smiling at the camera, with a woman training behind him",
	rope: "A woman in black training gear making waves with a battle rope in a gym",
	"gym-pair": "A trainer kneeling on a gym floor, with a woman doing battle rope waves behind him",
	dumbbells: "Two black hex dumbbells and a black bottle on a dark gym floor",
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

export const getTraining = () => getEmDashCollection("training", { orderBy: { position: "asc" }, limit: 50 });
export const getPlans = () => getEmDashCollection("plans", { orderBy: { position: "asc" }, limit: 50 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 8 });

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "", email: "" };
export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single studio entry (contact details, hours, notes); null-safe for an empty CMS. */
export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: StudioData = entries[0]?.data ?? FALLBACK_STUDIO;
	return { studio, cacheHint };
}

export const trainingHref = (data: { slug: string | null; id: string }) => `/training/${data.slug ?? data.id}`;

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

/** "$240 a month (sample price)" as amount, unit and note. Falls back to the whole text as the amount. */
export function splitPrice(price: string | null | undefined): { amount: string; unit: string; note: string } {
	const text = (price ?? "").trim();
	const open = text.indexOf("(");
	const note = open >= 0 ? text.slice(open + 1).replace(/\)\s*$/, "").trim() : "";
	const head = (open >= 0 ? text.slice(0, open) : text).trim();
	const space = head.indexOf(" ");
	if (!head.startsWith("$") || space < 0) return { amount: head, unit: "", note };
	return { amount: head.slice(0, space), unit: head.slice(space + 1).trim(), note };
}

export type { Plan, Step, Studio, Training };
