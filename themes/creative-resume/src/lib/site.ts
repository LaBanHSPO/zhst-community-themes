import { getEmDashCollection } from "emdash";
import type { Experience, Page, Project, Skill, Studio } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Work disciplines, in the order the filter shows them. */
export const DISCIPLINES = [
	{ slug: "brand-web", label: "Brand & web design" },
	{ slug: "product", label: "Product design" },
	{ slug: "identity", label: "Visual identity" },
	{ slug: "editorial", label: "Editorial & print" },
] as const;

export function disciplineLabel(slug: string | null | undefined): string {
	return DISCIPLINES.find((d) => d.slug === slug)?.label ?? "";
}

/** Reasons offered on the contact form; ?reason=<slug> pre-selects one. */
export const REASONS = [
	{ slug: "role", label: "A full-time role" },
	{ slug: "freelance", label: "A freelance project" },
	{ slug: "other", label: "Something else" },
] as const;

/** Descriptions for the bundled images, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	hero: "Mara, a designer with freckles and a messy bun in a black knit sweater, resting her chin on one hand and looking up, in front of a terracotta circle, torn paper and a dark-leaved plant",
	"portrait-collage": "Mara resting her chin on one hand, with a terracotta circle and torn grey paper behind her",
	"work-earthward": "A grey concrete wall by the sea with the words A cleaner tomorrow set into it, and a rocky headland behind",
	"work-habitly": "A phone showing a leaf-shaped progress mark beside the words Small steps big change on a dark green poster",
	"work-forma": "A terracotta arch in raking light with two white ceramic beakers in front of it",
	"print-mountain": "A print of a snow-capped mountain above a cloud bank with a terracotta sun behind the peak",
	"print-leaf": "A print of dark green leaves on a cream background with a patch of ochre paper",
	"print-architecture": "A print of a black angled building facade against grey and terracotta blocks of colour",
	"print-portrait": "A black and white portrait of a woman looking up, printed over a terracotta circle with brush strokes",
	"stone-sphere": "A speckled stone sphere resting on a block of travertine against a dark green backdrop",
	notebook: "A dark green hardback notebook with a gold pen resting on its cover",
	plant: "A leafy houseplant in a marble pot in soft window light",
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

export const getProjects = () => getEmDashCollection("projects", { orderBy: { position: "asc" }, limit: 100 });
export const getExperience = () => getEmDashCollection("experience", { orderBy: { position: "asc" }, limit: 30 });
export const getSkills = () => getEmDashCollection("skills", { orderBy: { position: "asc" }, limit: 12 });

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "", email: "" };

export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single contact-details entry; null-safe for an empty CMS. */
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

/** Profile links from "Label|URL" lines. */
export function profileLinks(text: string | null | undefined): { label: string; url: string }[] {
	return lines(text).flatMap((l) => {
		const [label, url] = l.split("|").map((s) => s.trim());
		return label && url ? [{ label, url }] : [];
	});
}

export const projectHref = (data: { slug: string | null; id: string }) => `/work/${data.slug ?? data.id}`;

export type { Experience, Page, Project, Skill, Studio };
