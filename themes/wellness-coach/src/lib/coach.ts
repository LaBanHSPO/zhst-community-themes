import { getEmDashCollection } from "emdash";
import type { Coach, Post, Principle, Service, Step } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A smiling woman in a cream cardigan sits on rocks above a misty lake and mountains in soft morning light",
	"coach-terrace": "Iris sitting cross-legged on a woven rug at sunset, resting her chin on one hand, with a yoga mat, a singing bowl and a stack of stones beside her",
	"coach-portrait": "Iris sitting cross-legged on a woven rug at sunset, resting her chin on one hand",
	"service-one-to-one": "Iris seated on a terrace at sunset, relaxed and smiling, ready for a conversation",
	"service-programme": "A rolled green yoga mat and a linen cushion on a stone terrace",
	"service-workshop": "A stack of smooth stones on a stone wall above a calm bay at sunset",
	"journal-sunset-sea": "A calm bay at sunset with hills fading into the distance",
	"journal-olive": "An olive tree in a stone pot beside a wooden post",
	"journal-bowl": "A brass singing bowl on a stone block beside a linen cushion",
	"journal-mist-lake": "A misty lake below rocks and small evergreen shrubs",
	"journal-ridge": "Soft layered mountain ridges rising from a misty lake",
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

export async function getPosts() {
	return getEmDashCollection("posts", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getPrinciples() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK_COACH: Pick<Coach, "title" | "email"> = { title: "", email: "" };
export type CoachData = Partial<Coach> & typeof FALLBACK_COACH;

/** The single coach entry (contact details); null-safe for an empty CMS. */
export async function getCoach() {
	const { entries, cacheHint } = await getEmDashCollection("coach", { limit: 1 });
	const coach: CoachData = entries[0]?.data ?? FALLBACK_COACH;
	return { coach, cacheHint };
}

export const serviceHref = (data: { slug: string | null; id: string }) => `/services/${data.slug ?? data.id}`;
export const postHref = (data: { slug: string | null; id: string }) => `/journal/${data.slug ?? data.id}`;

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

export type { Coach, Post, Principle, Service, Step };
