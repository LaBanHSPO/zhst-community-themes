import { getEmDashCollection } from "emdash";
import type { Clinic, Dentist, Service } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

/** Alt text: the uploaded image's own alt, then the entry's description field, then a fallback. */
export function photoAlt(image: ImageLike, alt: string | null | undefined, fallback: string): string {
	return image?.alt || alt || fallback;
}

export function entryKey(entry: { slug: string | null; id: string }): string {
	return entry.slug ?? entry.id;
}

export function serviceUrl(entry: { slug: string | null; id: string }): string {
	return `/services/${encodeURIComponent(entryKey(entry))}`;
}

export function dentistUrl(entry: { slug: string | null; id: string }): string {
	return `/dentists/${encodeURIComponent(entryKey(entry))}`;
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export function money(amount: number): string {
	return usd.format(amount);
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getDentists() {
	return getEmDashCollection("dentists", { orderBy: { position: "asc" }, limit: 50 });
}

const FALLBACK_CLINIC: Pick<Clinic, "title" | "email"> = { title: "Luma Dental", email: "" };

/** The single clinic-details entry (request email, phone, address, hours); null-safe for an empty CMS. */
export async function getClinic() {
	const { entries, cacheHint } = await getEmDashCollection("clinic", { limit: 1 });
	const clinic: Partial<Clinic> & typeof FALLBACK_CLINIC = entries[0]?.data ?? FALLBACK_CLINIC;
	return { clinic, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Splits a sentence so its final word can carry the teal full stop used in every headline. */
export function splitLast(text: string): { lead: string; last: string } {
	const trimmed = text.trim().replace(/[.!?]$/, "");
	const i = trimmed.lastIndexOf(" ");
	return i < 0 ? { lead: "", last: trimmed } : { lead: trimmed.slice(0, i + 1), last: trimmed.slice(i + 1) };
}

const TZ = "Asia/Saigon";

/** ISO yyyy-mm-dd for today + offset days, in the clinic's display timezone. */
export function isoDay(offsetDays = 0): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(Date.now() + offsetDays * 86_400_000));
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
export function validIso(value: string | null): string | undefined {
	if (!value || !ISO.test(value)) return undefined;
	return Number.isNaN(Date.parse(`${value}T00:00:00Z`)) ? undefined : value;
}

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

/** "2025-04-21" -> "Mon, Apr 21". */
export function prettyDay(iso: string): string {
	return dayFmt.format(new Date(`${iso}T00:00:00Z`));
}

export type Slot = { date: string; label: string; time: string };

/**
 * Turns weekly request times ("Monday 9:00 AM") into dated options for a 7-day window.
 * "this" = the next seven days starting tomorrow, "next" = the seven days after that.
 */
export function slotsForWeek(slots: Dentist["slots"], week: "this" | "next"): Slot[] {
	const start = week === "this" ? 1 : 8;
	const out: Slot[] = [];
	for (let offset = start; offset < start + 7; offset++) {
		const date = isoDay(offset);
		const weekday = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
		for (const slot of slots ?? []) {
			if (slot.weekday.trim().toLowerCase().startsWith(weekday.slice(0, 3))) {
				out.push({ date, label: prettyDay(date), time: slot.time.trim() });
			}
		}
	}
	return out;
}

/** Half-hour request times within opening hours, 8:00 AM to 5:30 PM. */
export function timeOptions(): string[] {
	const out: string[] = [];
	for (let minutes = 8 * 60; minutes <= 17 * 60 + 30; minutes += 30) {
		const h = Math.floor(minutes / 60);
		const m = minutes % 60;
		out.push(`${((h + 11) % 12) + 1}:${m === 0 ? "00" : "30"} ${h < 12 ? "AM" : "PM"}`);
	}
	return out;
}

export type { Clinic, Dentist, Service };

/** Splits a short phrase into two balanced lines at the word boundary nearest its middle. */
export function twoLines(text: string): [string, string] {
	const t = text.trim();
	const mid = t.length / 2;
	let best = -1;
	for (let i = t.indexOf(" "); i !== -1; i = t.indexOf(" ", i + 1)) {
		if (best === -1 || Math.abs(i - mid) <= Math.abs(best - mid) - 0.01) best = i;
	}
	return best === -1 ? [t, ""] : [t.slice(0, best), t.slice(best + 1)];
}
