import { getEmDashCollection } from "emdash";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "Five smiling counselors sit and stand around a round wooden coffee table in a warm lounge with shelves, plants and a framed print",
	"room-session": "Five people talk in a circle of cream armchairs around a low table, with an olive tree and a green arched wall behind them",
	"room-arch": "A counselor in a beige jacket gestures as she talks, seated in a cream armchair in front of a green arch and an olive tree",
	"room-table": "A low round wooden table with a plant, two mugs and a stack of books between cream armchairs",
	"room-right": "A man in a green sweater and a woman in a lilac sweater talk across a small table in a lounge with plants",
	"room-left": "A man in a green sweater and a woman in a brown sweater sit in cream armchairs, in the middle of a conversation",
	"lounge-detail": "A coffee table with a stack of books, a small mug, a stoneware bowl and a leafy plant",
	"team-1": "Marisol Vega, smiling with her chin resting on her hand, in a rust-colored sweater",
	"team-2": "Daniel Okafor, smiling, with glasses and a beard, in a dark green shirt",
	"team-3": "Hannah Brooks, smiling, with wavy blonde hair, in a cream sweater",
	"team-4": "Naomi Park, smiling, with long dark hair, in a black t-shirt",
	"team-5": "Samir Haddad, smiling, with curly hair, glasses and a beard, in an olive shirt",
	"team-6": "Tamara Wells, smiling, with curly hair, in a beige jacket",
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

export const getTeam = () => getEmDashCollection("team", { orderBy: { position: "asc" }, limit: 50 });
export const getServices = () => getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 8 });
export const getPosts = async () => {
	const result = await getEmDashCollection("posts", { limit: 50 });
	result.entries.sort((a, b) => (b.data.posted ?? "").localeCompare(a.data.posted ?? ""));
	return result;
};

const FALLBACK = { title: "", email: "" };
export type PracticeData = {
	title: string;
	email: string;
	phone?: string;
	address?: string;
	hours?: string;
	response?: string;
	contact_note?: string;
	fees_note?: string;
	sliding_note?: string;
};

/** The single practice entry (contact details, hours); null-safe for an empty CMS. */
export async function getPractice() {
	const { entries, cacheHint } = await getEmDashCollection("practice", { limit: 1 });
	const practice: PracticeData = (entries[0]?.data as PracticeData | undefined) ?? FALLBACK;
	return { practice, cacheHint };
}

type Slugged = { slug: string | null; id: string };
export const teamHref = (d: Slugged) => `/team/${d.slug ?? d.id}`;
export const serviceHref = (d: Slugged) => `/services/${d.slug ?? d.id}`;
export const postHref = (d: Slugged) => `/resources/${d.slug ?? d.id}`;

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Comma separated field to a clean list. */
export function list(text: string | null | undefined): string[] {
	return (text ?? "").split(",").map((l) => l.trim()).filter(Boolean);
}

/** Opening hours: each line is "Day | time". */
export function hoursRows(text: string | null | undefined): { day: string; time: string }[] {
	return lines(text).map((l) => {
		const [day, ...rest] = l.split("|");
		return { day: day.trim(), time: rest.join("|").trim() };
	});
}

export function formatDate(iso: string | null | undefined): string {
	if (!iso) return "";
	const d = new Date(`${iso}T00:00:00`);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Saigon" }).format(d);
}

export const firstName = (name: string) => name.split(/\s+/)[0] ?? name;

