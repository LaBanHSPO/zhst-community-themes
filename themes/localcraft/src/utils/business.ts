import { getEmDashEntry } from "emdash";

/** Business contact details edited in the admin under "Business details" (entry slug `details`). */
export interface BusinessDetails {
	phone?: string;
	phoneHref?: string;
	email?: string;
	emailHref?: string;
	base?: string;
	hours?: string;
	responseNote?: string;
	heroEyebrow?: string;
	heroTitle?: string;
	heroText?: string;
	heroImage?: unknown;
	footerLeft?: string;
	footerRight?: string;
}

type EntryCacheHint = Awaited<ReturnType<typeof getEmDashEntry>>["cacheHint"];

const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

/** Build a `tel:` href from a display number. Returns undefined when no usable digits remain. */
export function toTelHref(phone: string | undefined): string | undefined {
	if (!phone) return undefined;
	const trimmed = phone.trim();
	const digits = trimmed.replace(/[^\d]/g, "");
	if (digits.length < 3) return undefined;
	return `tel:${trimmed.startsWith("+") ? "+" : ""}${digits}`;
}

/** Build a `mailto:` href, rejecting values that are not a plain email address. */
export function toMailHref(email: string | undefined): string | undefined {
	if (!email) return undefined;
	const trimmed = email.trim();
	return EMAIL_PATTERN.test(trimmed) ? `mailto:${trimmed}` : undefined;
}

function str(value: unknown): string | undefined {
	return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Load business details. Missing entry or fields resolve to undefined so the
 * layout can hide call/email buttons instead of rendering broken links.
 */
export async function getBusinessDetails(): Promise<{ details: BusinessDetails; cacheHint?: EntryCacheHint }> {
	try {
		const { entry, cacheHint } = await getEmDashEntry("business", "details");
		const data = (entry?.data ?? {}) as Record<string, unknown>;
		const phone = str(data.phone);
		const email = str(data.email);
		return {
			cacheHint,
			details: {
				phone,
				phoneHref: toTelHref(phone),
				email,
				emailHref: toMailHref(email),
				base: str(data.base),
				hours: str(data.hours),
				responseNote: str(data.response_note),
				heroEyebrow: str(data.hero_eyebrow),
				heroTitle: str(data.hero_title),
				heroText: str(data.hero_text),
				heroImage: data.hero_image ?? undefined,
				footerLeft: str(data.footer_left),
				footerRight: str(data.footer_right),
			},
		};
	} catch (error) {
		console.error("[localcraft] Failed to load business details:", error);
		return { details: {} };
	}
}

/** Split a multi-line text field into trimmed, non-empty list items. */
export function toLines(value: unknown): string[] {
	if (typeof value !== "string") return [];
	return value
		.split(/\r?\n/)
		.map((line) => line.replace(/^[-*•]\s*/, "").trim())
		.filter(Boolean);
}

/** Sort entries by their numeric `order` field, then title. */
export function byOrder<T extends { data: { order?: number | null; title?: string } }>(entries: T[]): T[] {
	return [...entries].sort((a, b) => {
		const ao = typeof a.data.order === "number" ? a.data.order : Number.MAX_SAFE_INTEGER;
		const bo = typeof b.data.order === "number" ? b.data.order : Number.MAX_SAFE_INTEGER;
		if (ao !== bo) return ao - bo;
		return (a.data.title ?? "").localeCompare(b.data.title ?? "");
	});
}
