import { getEmDashCollection } from "emdash";
import type { Post, Project, Service, Step, Studio } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Work disciplines, in the order the filter shows them. */
export const DISCIPLINES = [
	{ slug: "brand-identity", label: "Brand identity" },
	{ slug: "campaign", label: "Campaign" },
	{ slug: "photography", label: "Photography" },
	{ slug: "creative-direction", label: "Creative direction" },
] as const;

export function disciplineLabel(slug: string | null | undefined): string {
	return DISCIPLINES.find((d) => d.slug === slug)?.label ?? "";
}

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "Nova, a creative director in a black knit sweater, resting her cheek on one hand against a pale sunlit wall",
	"portrait-wall": "Nova resting her cheek on one hand in front of a wall with pinned black and white photographs",
	"studio-portrait": "Nova in a black linen jacket at her desk, smiling, with pinned prints behind her",
	"work-still-here": "A folded cream card reading A calmer brighter you, standing on a stone with leaf shadows across it",
	"work-open-spaces": "A white stone villa with a terrace above the sea at dusk",
	"work-human-nature": "Large green leaves with soft shadows on a stone-coloured wall",
	"olive-vase": "An olive branch in a textured cream vase in front of a terracotta arch, with paintbrushes in a pot",
	"brush-pot": "Paintbrushes in a black marble pot on a stack of old books",
	sculpture: "A cream-coloured looped sculpture on a black marble block in front of pinned prints",
	moodboard: "A wall of pinned prints in black and white and terracotta, with a cream sculpture in front",
	"open-book": "An open book of prints: a black and white profile portrait beside a terracotta and slate landscape",
	"profile-print": "A black and white profile portrait of a woman with wavy hair, printed on matte paper",
	"terracotta-print": "A print of terracotta and slate shapes with a pale line running through them",
	"prints-desk": "Printed photographs spread across a dark wooden desk",
	"sea-print": "A print of dark green sea with white foam, lying on a desk",
	"botanical-print": "A black and white print of leaf shadows against a window",
	sketch: "A loose pencil line drawing on cream paper",
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

export const getProjects = () => getEmDashCollection("projects", { orderBy: { position: "asc" }, limit: 100 });
export const getPosts = () => getEmDashCollection("posts", { orderBy: { position: "asc" }, limit: 50 });
export const getServices = () => getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 12 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "", email: "" };

export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single studio entry (contact details); null-safe for an empty CMS. */
export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: StudioData = entries[0]?.data ?? FALLBACK_STUDIO;
	return { studio, cacheHint };
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

export const projectHref = (data: { slug: string | null; id: string }) => `/work/${data.slug ?? data.id}`;
export const postHref = (data: { slug: string | null; id: string }) => `/journal/${data.slug ?? data.id}`;

export type { Post, Project, Service, Step, Studio };
