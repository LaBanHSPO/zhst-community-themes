import { getEmDashCollection } from "emdash";
import type { Band, Member, Photo, Release, Show } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"venue-riverton": "A black and white photo of a band on a lit stage in front of a packed crowd with raised hands",
	"venue-lakeside": "A black and white photo of a wide theatre stage with a band under spotlights and a full crowd",
	"venue-maplewood": "A black and white photo of a singer on a stage beside amplifiers, with city buildings behind",
	"venue-hall": "A black and white photo of a drummer behind a kit in the haze of stage lights",
	"venue-club": "A black and white photo of a band on a small club stage under a single spotlight",
	"venue-pit": "A black and white photo of the crowd silhouetted with raised hands before a lit stage",
	"venue-stage": "A black and white photo of a singer with a guitar, a drummer and a bassist on a smoky stage",
	"cover-louder-together": "A blue spotlight cutting through stage smoke above a crowd",
	"cover-harbor-lights": "Warm golden light and smoke behind a drum kit on a dark stage",
	"cover-second-row": "Silhouettes of the crowd with hands raised toward the stage lights",
	"member-vocals": "The singer mid-song at the microphone with a guitar, lit from the side",
	"member-drums": "The drummer behind the kit in warm backlight",
	"member-bass": "The bassist leaning into the song with long hair, in cool blue light",
	"gallery-stage": "The whole band on stage: drummer on the left, singer and guitarist in the centre, bassist on the right",
	"gallery-crowd": "Raised hands in the crowd in front of a stage lit in red and teal",
	"gallery-singer": "The singer with a guitar at the microphone under golden stage light",
	"gallery-drums": "The drummer behind a kit with cymbals and warm stage lights",
	"gallery-bass": "The bassist playing in blue stage light and smoke",
	"gallery-kit": "A drum kit in smoke and warm light, with crowd hands in the foreground",
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

const FALLBACK_BAND: Pick<Band, "title" | "email"> = { title: "", email: "" };
export type BandData = Partial<Band> & typeof FALLBACK_BAND;

/** The single band entry (contact details); null-safe for an empty CMS. */
export async function getBand() {
	const { entries, cacheHint } = await getEmDashCollection("band", { limit: 1 });
	const band: BandData = entries[0]?.data ?? FALLBACK_BAND;
	return { band, cacheHint };
}

export async function getMembers() {
	return getEmDashCollection("members", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getPhotos() {
	return getEmDashCollection("photos", { orderBy: { position: "asc" }, limit: 24 });
}

export async function getReleases() {
	const result = await getEmDashCollection("releases", { orderBy: { position: "asc" }, limit: 50 });
	return result;
}

/** `YYYY-MM-DD` of a stored datetime (stored at noon UTC so the calendar day never shifts). */
export function dayKey(value: unknown): string {
	if (!value) return "";
	const d = value instanceof Date ? value : new Date(String(value));
	return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

/** Today in the site's timezone, `YYYY-MM-DD`. Evaluated per request so past shows never read as upcoming. */
export function todayKey(): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Saigon" }).format(new Date());
}

export async function getShows() {
	const result = await getEmDashCollection("shows", { limit: 200 });
	const today = todayKey();
	const all = result.entries
		.map((entry) => ({ entry, day: dayKey(entry.data.show_date) }))
		.filter((s) => s.day);
	const upcoming = all.filter((s) => s.day >= today).sort((a, b) => a.day.localeCompare(b.day));
	const past = all.filter((s) => s.day < today).sort((a, b) => b.day.localeCompare(a.day));
	return { upcoming, past, cacheHint: result.cacheHint };
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "APR 12" */
export function shortDate(day: string): string {
	const [, m, d] = day.split("-").map(Number);
	return `${MONTHS[m - 1]} ${d}`;
}

/** "12 April 2027" */
export function longDate(day: string): string {
	const [y, m, d] = day.split("-").map(Number);
	return `${d} ${MONTHS_LONG[m - 1]} ${y}`;
}

export function statusLabel(status: string | null | undefined): string {
	return status === "sold-out" ? "Sold out" : status === "cancelled" ? "Cancelled" : "On sale";
}

export function showHref(data: { slug: string | null; id: string }): string {
	return `/tour/${data.slug ?? data.id}`;
}

export function releaseHref(data: { slug: string | null; id: string }): string {
	return `/music/${data.slug ?? data.id}`;
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

export function initialsOf(name: string, given?: string | null): string {
	if (given) return given;
	return name
		.split(/\s+/)
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export type { Band, Member, Photo, Release, Show };
