import { getEmDashCollection } from "emdash";
import type { Credential, Page, Profile, Project, Role, Skill } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled images, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-graduate": "Maya Linden, a smiling young woman with long dark hair in a dark sweater, holding a laptop, with a green leaf shape behind her",
	"leafly-card": "A houseplant beside a phone showing a plant care app with the words A greener day, simpler.",
	"leafly-phone": "A phone showing a plant care app with three prompts: Water, Light and Thrive",
	"leafly-plant": "A leafy green houseplant in soft window light",
	"roam-card": "A laptop on a wooden table showing a travel website over a mountain landscape",
	"roam-screen": "A laptop screen showing a travel website with the words Explore Closer over a mountain valley",
	"nextstep-card": "A spiral notebook with the words Plan, Learn, Build, Repeat beside a mug on a wooden desk",
	"nextstep-notebook": "A spiral notebook with the words Plan, Learn, Build, Repeat handwritten on the page",
	"nextstep-mug": "A white mug with the words Small Steps, Brighter Days handwritten on it",
	"desk-notebook": "A notebook page with handwriting and a black pen resting on it",
	"quiet-hours-card": "A white mug with the words Small Steps, Brighter Days handwritten on it",
	"desk-mug": "A white mug with handwritten words on a wooden desk",
	"desk-books": "A stack of three books on a desk",
	"cap-desk": "A navy graduation cap with a gold tassel resting on a dark green book",
	"desk-leaves": "A green leafy sprig in warm light",
	"desk-pen": "A black and gold pen on navy fabric",
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

/** Project kinds offered as filters on /projects; `?kind=` selects one. */
export const KINDS = [
	{ value: "course", label: "Course" },
	{ value: "personal", label: "Personal" },
	{ value: "team", label: "Team" },
] as const;
export const kindLabel = (kind: string | null | undefined) => KINDS.find((k) => k.value === kind)?.label ?? kind ?? "";

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
	{ value: "internship", label: "An internship or placement" },
	{ value: "job", label: "A job or graduate role" },
	{ value: "project", label: "A project or freelance work" },
	{ value: "other", label: "Something else" },
] as const;

/** Split "path | caption" lines of the gallery field. */
export function gallery(text: string | null | undefined): { src: string; caption: string }[] {
	return lines(text).map((l) => {
		const [src, ...rest] = l.split("|");
		return { src: src.trim(), caption: rest.join("|").trim() };
	});
}

export type { Credential, Page, Profile, Project, Role, Skill };
