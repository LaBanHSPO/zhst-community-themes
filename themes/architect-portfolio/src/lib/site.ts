import { getEmDashCollection } from "emdash";
import type { New as News, Project, Service, Step, Studio, Team as TeamMember } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Project types, in the order the filter shows them. */
export const TYPES = [
	{ slug: "residential", label: "Residential" },
	{ slug: "cultural", label: "Cultural" },
	{ slug: "hospitality", label: "Hospitality" },
	{ slug: "interiors", label: "Interiors" },
	{ slug: "landscape", label: "Landscape" },
] as const;

export const STATUSES = [
	{ slug: "built", label: "Built" },
	{ slug: "in-progress", label: "In progress" },
	{ slug: "concept", label: "Concept" },
] as const;

export const typeLabel = (slug: string | null | undefined): string => TYPES.find((t) => t.slug === slug)?.label ?? "";
export const statusLabel = (slug: string | null | undefined): string => STATUSES.find((s) => s.slug === slug)?.label ?? "";

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A concrete house with a cantilevered roof and glass walls on a cliff above the sea at sunset, with an infinity pool and an olive tree",
	"cliff-house": "A stone wall and a concrete terrace with glass doors, looking out over the sea at dusk through the branches of a pine",
	"olive-court": "An olive tree in a courtyard between concrete walls, with a glazed hall and a shallow pool behind it",
	"forest-retreat": "A timber-clad lodge with a long window, set between spruce trees with a mountain behind",
	"terrace-house": "A concrete roof on slim black posts over a glass living room, a terrace and a pool beside an olive tree",
	"infinity-pool": "The edge of a pool in front of a concrete terrace and a glass-walled living room",
	"coast-rocks": "A rocky headland and a bay at sunset, with a pool edge in the foreground",
	"site-model": "A pale concrete study model of a house on a stone base, with a small olive tree among model rocks",
	"lake-pavilion": "A concrete pavilion with a cantilevered upper floor and warm lit glass, beside still water and large boulders at dusk",
	"stone-room": "A living room with a limestone floor and oak ceiling, open to a lake view, with low sofas and a bench",
	"concrete-shadow": "Shadows of olive leaves across a board-marked concrete wall",
	"olive-steps": "An olive tree beside a flight of stone steps between concrete walls",
	"timber-wall": "A concrete wall beside a wall of vertical timber slats",
	"olive-bowl": "A weathered stone bowl holding an olive branch",
	"material-samples": "Samples of travertine stone, dark oak and plaster lying on a table",
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
export const getNews = () => getEmDashCollection("news", { orderBy: { position: "asc" }, limit: 12 });
export const getServices = () => getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 12 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
export const getTeam = () => getEmDashCollection("team", { orderBy: { position: "asc" }, limit: 24 });

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

export const projectHref = (data: { slug: string | null; id: string }) => `/projects/${data.slug ?? data.id}`;

/** /projects URL with the given filters; empty values are left out. */
export function projectsUrl(filters: { type?: string | null; status?: string | null }): string {
	const q = new URLSearchParams();
	if (filters.type) q.set("type", filters.type);
	if (filters.status) q.set("status", filters.status);
	const s = q.toString();
	return s ? `/projects?${s}` : "/projects";
}

/** "Approx. 340 m²" for a rounded floor area. */
export function areaLabel(area: number | null | undefined): string {
	return area ? `Approx. ${area.toLocaleString("en-GB")} m²` : "";
}

export type { News, Project, Service, Step, Studio, TeamMember };
