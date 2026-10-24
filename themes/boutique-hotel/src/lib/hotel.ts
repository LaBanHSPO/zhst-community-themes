import { getEmDashCollection } from "emdash";
import type { Company } from "../../emdash-env";

export const VIEWS = [
	{ slug: "garden", label: "Garden" },
	{ slug: "hillside", label: "Hillside" },
	{ slug: "lake", label: "Lake" },
] as const;

/** Guest counts offered as filter chips. A room matches when it sleeps at least this many. */
export const GUEST_STEPS = [1, 2, 3, 4] as const;

export function viewLabel(slug: string | null | undefined) {
	return VIEWS.find((v) => v.slug === slug)?.label ?? "";
}

export function formatPrice(price: number | null | undefined): string {
	return typeof price === "number" ? `$${price.toLocaleString("en-US")}` : "";
}

export function guestsLabel(n: number | null | undefined): string {
	return typeof n === "number" ? `${n} ${n === 1 ? "guest" : "guests"}` : "";
}

export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function rows(text: string | null | undefined): { left: string; right: string }[] {
	return lines(text).map((l) => {
		const [a, ...rest] = l.split("|");
		return { left: a.trim(), right: rest.join("|").trim() };
	});
}

export async function getRooms() {
	const result = await getEmDashCollection("rooms", { limit: 100 });
	const list = [...result.entries].sort((a, b) => Number(a.data.position ?? 0) - Number(b.data.position ?? 0));
	return { rooms: list, cacheHint: result.cacheHint };
}
export type RoomEntry = Awaited<ReturnType<typeof getRooms>>["rooms"][number];

export async function getExperiences() {
	return getEmDashCollection("experiences", { orderBy: { position: "asc" }, limit: 20 });
}
export async function getWalks() {
	return getEmDashCollection("walks", { orderBy: { position: "asc" }, limit: 20 });
}
export async function getTeam() {
	return getEmDashCollection("team", { orderBy: { position: "asc" }, limit: 20 });
}

const FALLBACK: Pick<Company, "title" | "street" | "locality" | "email"> = { title: "", street: "", locality: "", email: "" };
export type CompanyData = Partial<Company> & typeof FALLBACK;

export async function getCompany() {
	const { entries, cacheHint } = await getEmDashCollection("company", { limit: 1 });
	const company: CompanyData = entries[0]?.data ?? FALLBACK;
	return { company, cacheHint };
}

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(v: CompanyData): string {
	const query = [v.street, v.locality, v.country].filter(Boolean).join(", ");
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export type { Company };
