import { getEmDashCollection } from "emdash";
import type { Note, Profile, Service, Step, Work } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled images, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A laptop on a travertine block in front of a sage green arch, with a plant and a dark green mug",
	terrana: "Terrana app welcome screen on dark green with a phone showing a monthly saving",
	"terrana-phone": "A phone showing the Terrana monthly view: a hillside picture, a leaf icon and the figure for the month",
	"terrana-panel": "Terrana welcome panel on dark green with the line 'A more sustainable tomorrow'",
	meno: "Meno welcome screen on soft pink with an arched sunset illustration of a person sitting by water",
	"meno-panel": "Meno welcome panel on soft pink with the line 'A kinder relationship with work'",
	"meno-arch": "Arched illustration of a person sitting by water at sunset, in peach and dusty pink",
	orbit: "Orbit welcome screen on black with a pale planet at the corner",
	"orbit-panel": "Orbit welcome panel on black with the line 'Ideas find a home here'",
	"orbit-planet": "A grey planet rising in the corner of a black screen",
	flowra: "A laptop showing the Flowra home page, on a stone block beside a green plant",
	"flowra-screen": "The Flowra home page: a calm headline, a phone with a plant behind it and a small progress card",
	"flowra-phone": "A phone showing a pale pink Flowra screen with plant leaves and a small progress card",
	motion: "A phone on a dark background showing the Motion fitness app and a rising line",
	"motion-phone": "Close view of a phone showing the Motion fitness app with a green progress line",
	harbor: "A dark laptop screen showing the Harbor dashboard with a green trend line",
	"harbor-chart": "Close view of the Harbor line chart in its dark theme",
	"lumina-bowl": "A pale ceramic bowl on a wooden stand beside a small vase on a stone shelf",
	"study-sketches": "A printed sheet with a close view of a stone and white light, above pencil sketches of the object",
	"study-lamp": "A cream bedside light with a warm glow on a round stone base",
	"study-swatches": "A board with material samples: stone, oak and woven fabric, beside photographs of the light",
	"study-materials": "Three rounded material samples, in stone, walnut and cream, resting on a rock",
	"study-olive": "Olive branches in front of a printed sheet with a thin glowing line",
	"desk-notebook": "A spiral notebook with wireframe sketches and a black pen on a wooden desk",
	"desk-plant": "A speckled plant pot with green leaves beside a desk monitor",
};

/** CMS upload wins; otherwise the bundled image path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function photoAlt(image: ImageLike, photo: string | null | undefined, fallback = ""): string {
	if (image?.alt) return image.alt;
	const name = photo?.split("/").pop()?.replace(/\.\w+$/, "");
	return (name && PHOTO_ALT[name]) || fallback;
}

export const getWork = () => getEmDashCollection("work", { orderBy: { position: "asc" }, limit: 50 });
export const getNotes = () => getEmDashCollection("notes", { orderBy: { position: "asc" }, limit: 100 });
export const getServices = () => getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 12 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });

const FALLBACK: Pick<Profile, "title" | "email"> = { title: "", email: "" };
export type ProfileData = Partial<Profile> & typeof FALLBACK;

/** The single contact-details entry; null-safe for an empty CMS. */
export async function getProfile() {
	const { entries, cacheHint } = await getEmDashCollection("profile", { limit: 1 });
	const profile: ProfileData = entries[0]?.data ?? FALLBACK;
	return { profile, cacheHint };
}

/** Work types shown as filter links, in a fixed order. */
export const TYPES = [
	{ slug: "app", label: "App" },
	{ slug: "platform", label: "Platform" },
	{ slug: "design-system", label: "Design system" },
] as const;

export const typeLabel = (slug: string | null | undefined) => TYPES.find((t) => t.slug === slug)?.label ?? "";

export const TOPICS = [
	{ slug: "process", label: "Process" },
	{ slug: "research", label: "Research" },
	{ slug: "craft", label: "Craft" },
	{ slug: "systems", label: "Systems" },
] as const;

export const topicLabel = (slug: string | null | undefined) => TOPICS.find((t) => t.slug === slug)?.label ?? "";

export const workHref = (data: { slug: string | null; id: string }) => `/work/${data.slug ?? data.id}`;
export const noteHref = (data: { slug: string | null; id: string }) => `/notes/${data.slug ?? data.id}`;

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

export type { Note, Profile, Service, Step, Work };
