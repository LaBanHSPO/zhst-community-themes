import { getEmDashCollection } from "emdash";
import type { Artist, Release, Show } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;
type Track = NonNullable<Release["tracks"]>[number];

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"cover-higher-ground": "Cover art for Higher Ground: a mountain lake at a pink sunset, with the title in handwritten script",
	"cover-moon-room": "Cover art for Moon Room: a woman sitting in front of a glowing full moon",
	"cover-still-here": "Cover art for Still Here: a full moon rising between dark cliffs over still water",
	"cover-lamp-light": "Cover art for Lamp Light Sessions: an acoustic guitar standing in warm lamp light",
	"portrait-moon": "nova sitting on a rug in front of a glowing full moon, one arm resting on her knee",
	"scene-room": "nova sitting between her acoustic guitar and a vinyl record, in front of a glowing full moon",
	"hero-home": "nova leaning on an acoustic guitar by a lamp-lit window, looking at the camera",
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

export async function getReleases() {
	return getEmDashCollection("releases", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getShows() {
	return getEmDashCollection("shows", { orderBy: { show_date: "asc" }, limit: 200 });
}

const FALLBACK_ARTIST: Pick<Artist, "title" | "email"> = { title: "", email: "" };
export type ArtistData = Partial<Artist> & typeof FALLBACK_ARTIST;

/** The single artist entry (contact details); null-safe for an empty CMS. */
export async function getArtist() {
	const { entries, cacheHint } = await getEmDashCollection("artist", { limit: 1 });
	const artist: ArtistData = entries[0]?.data ?? FALLBACK_ARTIST;
	return { artist, cacheHint };
}

/** The release flagged as latest, else the first one. */
export function pickFeatured<T extends { data: Release }>(releases: T[]): T | undefined {
	return releases.find((r) => r.data.featured) ?? releases[0];
}

export const releaseHref = (data: { slug: string | null; id: string }) => `/music/${data.slug ?? data.id}`;

/** Playable source of a track's optional audio upload. */
export function audioSrc(track: Track): string | undefined {
	return track.audio?.src || track.audio?.url || undefined;
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Today's calendar date (YYYY-MM-DD) in the studio's timezone, evaluated at request time. */
export function todayKey(): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Saigon", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** Show date as a YYYY-MM-DD key (dates are calendar days; the stored time of day is ignored). */
export function showKey(show: Show): string {
	const v = show.show_date as unknown;
	const iso = v instanceof Date ? v.toISOString() : String(v ?? "");
	return iso.slice(0, 10);
}

export function showParts(show: Show) {
	const d = new Date(`${showKey(show)}T12:00:00Z`);
	const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...o }).format(d);
	return {
		day: fmt({ day: "numeric" }),
		month: fmt({ month: "short" }),
		year: fmt({ year: "numeric" }),
		weekday: fmt({ weekday: "short" }),
		long: fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }),
		iso: showKey(show),
	};
}

/** Upcoming (today and later, soonest first) and past (most recent first) shows. */
export function splitShows<T extends { data: Show }>(entries: T[]) {
	const today = todayKey();
	const upcoming = entries.filter((s) => showKey(s.data) >= today).sort((a, b) => showKey(a.data).localeCompare(showKey(b.data)));
	const past = entries.filter((s) => showKey(s.data) < today).sort((a, b) => showKey(b.data).localeCompare(showKey(a.data)));
	return { upcoming, past };
}

export const STATUS_LABEL: Record<string, string> = { "on-sale": "On sale", "sold-out": "Sold out", cancelled: "Cancelled" };

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

export type { Artist, Release, Show };
