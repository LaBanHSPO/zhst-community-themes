import { getEmDashCollection } from "emdash";
import type { Credential, Page, Profile, Project, Role, Skill } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "Theo Alder, a man with curly dark hair and glasses, in a dark blazer and sweater, looking off to the side in front of a pale wall with a green plant",
	portrait: "Theo Alder, a man with curly dark hair and glasses, in a dark blazer, looking off to the side",
	"portrait-close": "Close portrait of Theo Alder, a man with curly dark hair and glasses",
	"project-notebook": "A dark green leather notebook with a black and gold pen resting on it",
	"project-marble": "A block of dark green marble with a brass base resting on top",
	"project-globe": "A vintage globe with a brass stand on a marble shelf",
	"project-plant": "A leafy houseplant in a white marble pot",
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

export const getRoles = () => getEmDashCollection("roles", { orderBy: { position: "asc" }, limit: 50 });
export const getProjects = () => getEmDashCollection("projects", { orderBy: { position: "asc" }, limit: 100 });
export const getSkills = () => getEmDashCollection("skills", { orderBy: { position: "asc" }, limit: 12 });
export const getCredentials = () => getEmDashCollection("credentials", { orderBy: { position: "asc" }, limit: 30 });

const FALLBACK: Pick<Profile, "title" | "email"> = { title: "", email: "" };
export type ProfileData = Partial<Profile> & typeof FALLBACK;

/** The single contact-details entry; null-safe for an empty CMS. */
export async function getProfile() {
	const { entries, cacheHint } = await getEmDashCollection("profile", { limit: 1 });
	const profile: ProfileData = entries[0]?.data ?? FALLBACK;
	return { profile, cacheHint };
}

export const projectHref = (data: { slug: string | null; id: string }) => `/projects/${data.slug ?? data.id}`;

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

/** Reasons offered in the contact form; `?reason=` pre-selects one. */
export const REASONS = [
	{ value: "role", label: "A role or hiring conversation" },
	{ value: "project", label: "A project or freelance work" },
	{ value: "other", label: "Something else" },
] as const;

export type { Credential, Page, Profile, Project, Role, Skill };
