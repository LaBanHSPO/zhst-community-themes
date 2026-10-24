import { getEmDashCollection } from "emdash";
import type { Office, People as Person, Principle, Service, Venue } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getVenues() {
	return getEmDashCollection("venues", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getPrinciples(placement: "steps" | "values") {
	const { entries, cacheHint } = await getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 40 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

export async function getPeople() {
	return getEmDashCollection("people", { orderBy: { position: "asc" }, limit: 40 });
}

const FALLBACK_OFFICE: Pick<Office, "title" | "street" | "locality" | "email"> = {
	title: "",
	street: "",
	locality: "",
	email: "",
};

export type OfficeData = Partial<Office> & typeof FALLBACK_OFFICE;

/** The single office entry (address, contact); null-safe for an empty CMS. */
export async function getOffice() {
	const { entries, cacheHint } = await getEmDashCollection("office", { limit: 1 });
	const office: OfficeData = entries[0]?.data ?? FALLBACK_OFFICE;
	return { office, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(office: OfficeData): string {
	const query = [office.street, office.locality, office.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

/** "Name - detail" lines split into a pair. */
export function splitDetail(line: string): { name: string; detail: string } {
	const i = line.indexOf(" - ");
	return i < 0 ? { name: line, detail: "" } : { name: line.slice(0, i), detail: line.slice(i + 3) };
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export type { Person, Principle, Service, Venue };
