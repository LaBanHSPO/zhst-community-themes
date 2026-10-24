import { getEmDashCollection } from "emdash";
import type { Event, Format, Journal, Speaker, Talk } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "Caleb Rivers, a speaker in a dark blazer and headset microphone, smiling with his arms open on a dark stage under a spotlight",
	"headshot-portrait": "Caleb Rivers in a dark blazer and black shirt with a headset microphone, smiling and looking up",
	"headshot-wide": "Caleb Rivers on a dark stage with his arms open, a spotlight behind him",
	"headshot-gesture": "Caleb Rivers from the chest down, one hand held out and one raised, in a dark blazer",
	"talk-leadership": "A person standing on a rocky summit at sunrise, seen from behind",
	"talk-human": "A young seedling with two green leaves in dark forest light",
	"talk-culture": "An audience seen from behind under warm stage lights",
	"talk-summit": "A snow-capped mountain peak lit by the setting sun",
	"talk-seedling": "A green seedling growing out of soil in soft light",
	"talk-group": "Five people in silhouette against a low sun",
	"journal-audience": "A blurred audience in warm light",
	"journal-spotlight": "A beam of blue spotlight on a dark stage",
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

export const getTalks = () => getEmDashCollection("talks", { orderBy: { position: "asc" }, limit: 100 });
export const getFormats = () => getEmDashCollection("formats", { orderBy: { position: "asc" }, limit: 12 });
export const getJournal = () => getEmDashCollection("journal", { orderBy: { position: "asc" }, limit: 100 });

const FALLBACK: Pick<Speaker, "title" | "email"> = { title: "", email: "" };
export type SpeakerData = Partial<Speaker> & typeof FALLBACK;

/** The single contact-details entry; null-safe for an empty CMS. */
export async function getSpeaker() {
	const { entries, cacheHint } = await getEmDashCollection("speaker", { limit: 1 });
	const speaker: SpeakerData = entries[0]?.data ?? FALLBACK;
	return { speaker, cacheHint };
}

/** Talk topics shown as filter links, in a fixed order. */
export const TOPICS = [
	{ slug: "leadership", label: "Leadership" },
	{ slug: "human-potential", label: "Human potential" },
	{ slug: "culture", label: "Culture" },
] as const;

export const topicLabel = (slug: string | null | undefined) => TOPICS.find((t) => t.slug === slug)?.label ?? "";

export const talkHref = (data: { slug: string | null; id: string }) => `/talks/${data.slug ?? data.id}`;
export const journalHref = (data: { slug: string | null; id: string }) => `/journal/${data.slug ?? data.id}`;

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

/** `YYYY-MM-DD` of a stored datetime (stored at noon UTC so the calendar day never shifts). */
export function dayKey(value: unknown): string {
	if (!value) return "";
	const d = value instanceof Date ? value : new Date(String(value));
	return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

/** Today in the site's timezone, `YYYY-MM-DD`. Evaluated per request so past events never read as upcoming. */
export function todayKey(): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Saigon" }).format(new Date());
}

/** Speaking dates split into upcoming (soonest first) and past (latest first). */
export async function getEvents() {
	const result = await getEmDashCollection("events", { limit: 200 });
	const today = todayKey();
	const all = result.entries.map((entry) => ({ entry, day: dayKey(entry.data.event_date) })).filter((e) => e.day);
	const upcoming = all.filter((e) => e.day >= today).sort((a, b) => a.day.localeCompare(b.day));
	const past = all.filter((e) => e.day < today).sort((a, b) => b.day.localeCompare(a.day));
	return { upcoming, past, cacheHint: result.cacheHint };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const dateParts = (day: string) => {
	const [y, m, d] = day.split("-").map(Number);
	return { day: d, month: MONTHS[m - 1], year: y };
};

export type { Event, Format, Journal, Speaker, Talk };
