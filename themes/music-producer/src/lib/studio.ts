import { getEmDashCollection } from "emdash";
import type { Credit, Producer, Room, Service } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;
type AudioLike = { src?: string; url?: string } | null | undefined;

export const ROLES = ["produced", "mixed", "mastered"] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_LABEL: Record<Role, string> = { produced: "Produced", mixed: "Mixed", mastered: "Mastered" };

export const SERVICE_SLUGS = ["production", "recording", "mixing", "mastering"] as const;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function getCredits() {
	return getEmDashCollection("credits", { orderBy: { position: "asc" }, limit: 100 });
}
export function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 20 });
}
export function getRooms() {
	return getEmDashCollection("rooms", { orderBy: { position: "asc" }, limit: 20 });
}

const FALLBACK: Pick<Producer, "title" | "email"> = { title: "", email: "" };
export type ProducerData = Partial<Producer> & typeof FALLBACK;

/** The single studio-details entry; null-safe for an empty CMS. */
export async function getProducer() {
	const { entries, cacheHint } = await getEmDashCollection("producer", { limit: 1 });
	const producer: ProducerData = entries[0]?.data ?? FALLBACK;
	return { producer, cacheHint };
}

export const creditHref = (d: { slug: string | null; id: string }) => `/music/${d.slug ?? d.id}`;

export function rolesOf(c: Credit): Role[] {
	const r = c.roles as unknown;
	const list = Array.isArray(r) ? r : typeof r === "string" && r ? [r] : [];
	return list.filter((x): x is Role => (ROLES as readonly string[]).includes(x));
}

export const roleText = (c: Credit) => rolesOf(c).map((r) => ROLE_LABEL[r]).join(" · ");

export function audioSrc(c: Credit): string | undefined {
	const a = c.audio as AudioLike;
	return a?.src || a?.url || undefined;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export type { Credit, Producer, Room, Service };
