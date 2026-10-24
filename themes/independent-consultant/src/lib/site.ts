import { getEmDashCollection } from "emdash";
import type { Insight, Practice, Project, Service, Step } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "Clara Weston, a consultant in a dark green blazer, resting her chin on one hand at a desk with a laptop and a mug",
	"about-portrait": "Clara resting her chin on one hand at her desk, in a dark green blazer, with a laptop and a mug beside her",
	"cover-globe": "A brass desk globe beside a potted plant in front of a mountain painting",
	"cover-route": "A mountain painting with a thin gold line climbing across it, marked with three small rings",
	"cover-route-2": "The end of a thin gold line on a mountain painting, finishing in an arrowhead",
	"cover-books": "A pen pot and a stack of two books on a dark wooden desk",
	"cover-olive": "Olive branches in soft window light against a wood-slat wall",
	"cover-desk": "An open notebook on a dark wooden desk in warm afternoon light",
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

export const getServices = () => getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
export const getInsights = () => getEmDashCollection("insights", { orderBy: { position: "asc" }, limit: 100 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
export const getProjects = () => getEmDashCollection("projects", { orderBy: { position: "asc" }, limit: 12 });

const FALLBACK: Pick<Practice, "title" | "email"> = { title: "", email: "" };
export type PracticeData = Partial<Practice> & typeof FALLBACK;

/** The single contact-details entry; null-safe for an empty CMS. */
export async function getPractice() {
	const { entries, cacheHint } = await getEmDashCollection("practice", { limit: 1 });
	const practice: PracticeData = entries[0]?.data ?? FALLBACK;
	return { practice, cacheHint };
}

/** Insight topics shown as filter links, in a fixed order. */
export const TOPICS = [
	{ slug: "strategy", label: "Strategy" },
	{ slug: "leadership", label: "Leadership" },
	{ slug: "execution", label: "Execution" },
] as const;

export const topicLabel = (slug: string | null | undefined) => TOPICS.find((t) => t.slug === slug)?.label ?? "";

export const serviceHref = (data: { slug: string | null; id: string }) => `/services/${data.slug ?? data.id}`;
export const insightHref = (data: { slug: string | null; id: string }) => `/insights/${data.slug ?? data.id}`;

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

export type { Insight, Practice, Project, Service, Step };
