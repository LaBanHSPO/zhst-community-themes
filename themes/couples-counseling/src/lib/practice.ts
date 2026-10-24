import { getEmDashCollection } from "emdash";
import type { Counselor, Fee, Practice, Principle, Resource, Step, Topic } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A couple sitting close together on a linen sofa in a calm living room, with books and a vase of leaves on the coffee table",
	"room-wide": "A counseling room with two green armchairs facing a round wooden table with flowers and a candle, in warm afternoon light",
	"room-table": "A round wooden table with a vase of white flowers, a candle and a box of tissues between two armchairs",
	"room-chair": "A green armchair with a knitted cushion beside a low wooden table",
	"room-olive": "A tall olive tree in a stone planter beside an armchair and a sunny window",
	"room-print": "A framed landscape print on a cream wall above a wooden sideboard with a trailing plant",
	"room-throw": "A green armchair with a chunky knitted throw over one arm, on a woven rug",
	"still-life": "A speckled vase of leaves and a stoneware mug on a wooden coffee table beside a stack of books",
	"couple-sofa": "A couple leaning together on a linen sofa, smiling, in a bright living room",
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

export const photoAltByName = (name: string) => PHOTO_ALT[name] ?? "";

export async function getResources() {
	return getEmDashCollection("resources", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getPrinciples() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getTopics() {
	return getEmDashCollection("topics", { orderBy: { position: "asc" }, limit: 24 });
}

export async function getFees() {
	return getEmDashCollection("fees", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getCounselors() {
	return getEmDashCollection("counselors", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK: Pick<Practice, "title" | "email"> = { title: "", email: "" };
export type PracticeData = Partial<Practice> & typeof FALLBACK;

/** The single practice entry (contact details); null-safe for an empty CMS. */
export async function getPractice() {
	const { entries, cacheHint } = await getEmDashCollection("practice", { limit: 1 });
	const practice: PracticeData = entries[0]?.data ?? FALLBACK;
	return { practice, cacheHint };
}

/** Resource topics shown as filter links, in a fixed order. */
export const CATEGORIES = [
	{ slug: "communication", label: "Communication" },
	{ slug: "conflict", label: "Conflict" },
	{ slug: "everyday", label: "Everyday life" },
	{ slug: "counseling", label: "About counseling" },
] as const;

export const categoryLabel = (slug: string | null | undefined) => CATEGORIES.find((c) => c.slug === slug)?.label ?? "";

export const resourceHref = (data: { slug: string | null; id: string }) => `/resources/${data.slug ?? data.id}`;

/** Shown wherever someone might be looking for urgent help. */
export const CRISIS_NOTE =
	"If either of you is unsafe or in crisis, contact your local emergency number or a crisis line now; this practice can't respond urgently.";

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Up to two initials from a name. */
export function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]!.toUpperCase())
		.join("");
}

export type { Counselor, Fee, Practice, Principle, Resource, Step, Topic };
