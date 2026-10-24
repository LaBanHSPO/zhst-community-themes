import { getEmDashCollection } from "emdash";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getPeople() {
	return getEmDashCollection("people", { orderBy: { position: "asc" }, limit: 60 });
}

export async function getPoints() {
	return getEmDashCollection("points", { orderBy: { position: "asc" }, limit: 20 });
}

export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK = { title: "", street: "", locality: "", email: "" };

/** The single clinic entry (address, phone, hours); null-safe for an empty CMS. */
export async function getClinic() {
	const { entries, cacheHint } = await getEmDashCollection("clinic", { limit: 1 });
	const data = entries[0]?.data;
	const clinic = { ...FALLBACK, ...(data ?? {}) } as typeof FALLBACK & {
		country?: string | null;
		phone?: string | null;
		hours?: string | null;
		emergency_note?: string | null;
		response_note?: string | null;
	};
	return { clinic, cacheHint };
}

export type Clinic = Awaited<ReturnType<typeof getClinic>>["clinic"];

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(c: Clinic): string {
	const query = [c.street, c.locality, c.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

/** Opening hours: one `Day|Hours` pair per line. */
export function hoursRows(text: string | null | undefined): { day: string; time: string }[] {
	return lines(text).map((l) => {
		const [day, ...rest] = l.split("|");
		return { day: (day ?? "").trim(), time: rest.join("|").trim() };
	});
}

export function entryHref(base: string, data: { slug: string | null; id: string }): string {
	return `${base}/${data.slug ?? data.id}`;
}

export function firstName(name: string): string {
	return name.replace(/^Dr\.?\s+/i, "").split(/\s+/)[0] ?? name;
}
