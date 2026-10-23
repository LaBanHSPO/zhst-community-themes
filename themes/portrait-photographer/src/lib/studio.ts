import { getEmDashCollection } from "emdash";
import type { Journal, Session, Studio, Work } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when a gallery item carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A woman with freckles resting her chin on her hand, window-light shadows on the dark wall behind her",
	"woman-window": "Close portrait of a freckled woman resting her chin on her hand in soft window light",
	"woman-bw": "Black-and-white portrait of a woman resting her chin on her hand",
	"man-bw": "Black-and-white portrait of a man laughing with his head tilted back",
	redhead: "Portrait of a red-haired woman with freckles, her hair lifting in the wind",
	"redhead-bw": "Black-and-white portrait of a red-haired woman with freckles",
	"grey-hair": "Portrait of a grey-haired man with a short beard looking away from the camera",
	"hand-detail": "A hand wearing a ring, resting against a cheek",
	"window-light": "Soft window light falling across a dark wall",
	camera: "A black camera with a wide lens resting on a stone ledge",
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

export async function getWork() {
	return getEmDashCollection("work", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getJournal() {
	return getEmDashCollection("journal", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getSessions() {
	return getEmDashCollection("sessions", { orderBy: { position: "asc" }, limit: 20 });
}

export async function getApproach() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "", email: "" };

export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single studio entry (contact details); null-safe for an empty CMS. */
export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: StudioData = entries[0]?.data ?? FALLBACK_STUDIO;
	return { studio, cacheHint };
}

export function formatPrice(price: number | null | undefined): string {
	return typeof price === "number" ? `$${price.toLocaleString("en-US")}` : "";
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function workHref(data: { slug: string | null; id: string }): string {
	return `/work/${data.slug ?? data.id}`;
}

export function journalHref(data: { slug: string | null; id: string }): string {
	return `/journal/${data.slug ?? data.id}`;
}

export type { Journal, Session, Studio, Work };
