import { getEmDashCollection } from "emdash";
import type { Post, Profile, Project, Skill, Step } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled images, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A developer with glasses and a dark sweater looking up from a laptop in a dim room with a desk lamp and plants",
	portrait: "A developer with glasses and a dark sweater at a desk, looking out of frame",
	"project-laptop": "A laptop on a dark stone desk showing a code editor beside a page with a lake photograph and four round icons",
	"project-screen": "A web page with a mountain lake photograph, three smaller pictures and a row of four round icons",
	"project-code": "A code editor on a dark theme with a file tree on the left and coloured lines of code",
	"project-icons": "A row of four round icons on a light panel: code brackets, a paint palette, layers and a gear",
	"project-lake": "A web page with a lake at dusk and three smaller pictures of a curved building, a leaf and a dark rock",
	"desk-plant": "A leafy plant in a dark stone pot, with a ring of warm light behind it on a round marble panel",
	"desk-brackets": "A bronze pair of angle brackets and a slash, standing on a block of dark stone",
	"desk-notebook": "A black hardback notebook with an elastic band and a metal pen resting on it",
	"desk-mug": "A dark marble mug on a small metal coaster",
	"desk-surface": "A dark stone desk surface catching soft light",
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

export const getProjects = () => getEmDashCollection("projects", { orderBy: { position: "asc" }, limit: 50 });
export const getPosts = () => getEmDashCollection("posts", { orderBy: { position: "asc" }, limit: 100 });
export const getSkills = () => getEmDashCollection("skills", { orderBy: { position: "asc" }, limit: 12 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });

const FALLBACK: Pick<Profile, "title" | "email"> = { title: "", email: "" };
export type ProfileData = Partial<Profile> & typeof FALLBACK;

/** The single contact-details entry; null-safe for an empty CMS. */
export async function getProfile() {
	const { entries, cacheHint } = await getEmDashCollection("profile", { limit: 1 });
	const profile: ProfileData = entries[0]?.data ?? FALLBACK;
	return { profile, cacheHint };
}

/** Project types offered in the enquiry form (?type=<slug> pre-selects one). */
export const TYPES = [
	{ slug: "website", label: "A new website" },
	{ slug: "web-app", label: "A web app" },
	{ slug: "frontend-rebuild", label: "A frontend rebuild" },
	{ slug: "performance", label: "Speed or accessibility work" },
	{ slug: "other", label: "Something else" },
] as const;

export const typeLabel = (slug: string | null | undefined) => TYPES.find((t) => t.slug === slug)?.label ?? "";

export const slugify = (text: string) =>
	text
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

/** Stack tags of a project, from its comma-separated field. */
export function stackTags(stack: string | null | undefined): { slug: string; label: string }[] {
	return (stack ?? "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean)
		.map((label) => ({ slug: slugify(label), label }));
}

export const projectHref = (data: { slug: string | null; id: string }) => `/projects/${data.slug ?? data.id}`;
export const postHref = (data: { slug: string | null; id: string }) => `/writing/${data.slug ?? data.id}`;

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

export type { Post, Profile, Project, Skill, Step };
