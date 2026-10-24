import { getEmDashCollection } from "emdash";
import type { Practice, Principle, Step, Area, Faq } from "../../emdash-env";

export async function getPrinciples() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getSteps() {
	return getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 12 });
}

export async function getAreas() {
	return getEmDashCollection("areas", { orderBy: { position: "asc" }, limit: 24 });
}

export async function getFaqs() {
	return getEmDashCollection("faqs", { orderBy: { position: "asc" }, limit: 50 });
}

const FALLBACK: Pick<Practice, "title" | "email"> = { title: "", email: "" };
export type PracticeData = Partial<Practice> & typeof FALLBACK;

/** The single practice entry (contact details); null-safe for an empty CMS. */
export async function getPractice() {
	const { entries, cacheHint } = await getEmDashCollection("practice", { limit: 1 });
	const practice: PracticeData = entries[0]?.data ?? FALLBACK;
	return { practice, cacheHint };
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

export type { Practice, Principle, Step, Area, Faq };
