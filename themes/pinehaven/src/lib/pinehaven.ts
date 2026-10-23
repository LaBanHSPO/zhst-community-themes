import { getEmDashCollection } from "emdash";
import type { Cabin, Experience, Gallery, Lodge } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

/** Alt text: the uploaded image's own alt, then the entry's description field, then a fallback. */
export function photoAlt(image: ImageLike, alt: string | null | undefined, fallback: string): string {
	return image?.alt || alt || fallback;
}

export function cabinKey(entry: { slug: string | null; id: string }): string {
	return entry.slug ?? entry.id;
}

export function cabinUrl(entry: { slug: string | null; id: string }): string {
	return `/rooms/${encodeURIComponent(cabinKey(entry))}`;
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export function money(amount: number): string {
	return usd.format(amount);
}

/** "2" -> "2 guests", "1" -> "1 guest", "2–4" -> "2–4 guests". */
export function guestsLabel(guests: string): string {
	return `${guests} ${guests.trim() === "1" ? "guest" : "guests"}`;
}

export function plural(n: number, one: string, many: string): string {
	return `${n} ${n === 1 ? one : many}`;
}

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
export function countWord(n: number): string {
	return WORDS[n] ?? String(n);
}

export async function getCabins() {
	return getEmDashCollection("cabins", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getGallery() {
	return getEmDashCollection("gallery", { orderBy: { position: "asc" }, limit: 200 });
}

export async function getExperiences() {
	return getEmDashCollection("experiences", { orderBy: { position: "asc" }, limit: 30 });
}

const FALLBACK_LODGE: Pick<Lodge, "title" | "email"> = { title: "Pinehaven", email: "" };

/** The single lodge-details entry (request email, phone, address); null-safe for an empty CMS. */
export async function getLodge() {
	const { entries, cacheHint } = await getEmDashCollection("lodge", { limit: 1 });
	const lodge: Partial<Lodge> & typeof FALLBACK_LODGE = entries[0]?.data ?? FALLBACK_LODGE;
	return { lodge, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** ISO yyyy-mm-dd for today + offset days, in the lodge's display timezone. */
export function isoDay(offsetDays = 0): string {
	const d = new Date(Date.now() + offsetDays * 86_400_000);
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Saigon" }).format(d);
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
export function validIso(value: string | null): string | undefined {
	if (!value || !ISO.test(value)) return undefined;
	return Number.isNaN(Date.parse(`${value}T00:00:00Z`)) ? undefined : value;
}

/** "2025-04-17" -> "Apr 17, 2025" (UTC so the calendar day never shifts). */
export function prettyDay(iso: string): string {
	return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
		new Date(`${iso}T00:00:00Z`),
	);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
	return Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86_400_000);
}

export type { Cabin, Experience, Gallery, Lodge };
