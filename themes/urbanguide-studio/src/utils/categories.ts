/**
 * Presentation helpers for listing categories.
 *
 * Listings store their category as a plain string (normally a `category`
 * taxonomy slug). These helpers turn that value into a display label, an icon
 * and a colour tone. They never invent data: an unknown category falls back to
 * its own text and a neutral pin icon.
 */

export type CategoryIcon =
	| "fork"
	| "bag"
	| "bed"
	| "camera"
	| "cup"
	| "wrench"
	| "leaf"
	| "pin";

export type CategoryTone = "cobalt" | "coral";

export interface TermLike {
	slug: string;
	label: string;
}

const ICON_RULES: Array<[RegExp, CategoryIcon]> = [
	[/coffee|cafe|café|tea|bakery/i, "cup"],
	[/eat|food|drink|restaurant|dining|bar/i, "fork"],
	[/shop|store|retail|market/i, "bag"],
	[/stay|hotel|lodging|hostel|sleep/i, "bed"],
	[/see|things|museum|art|attraction|tour|culture/i, "camera"],
	[/service|repair|plumb|trade|fix/i, "wrench"],
	[/park|outdoor|wellness|garden|nature/i, "leaf"],
];

export function categoryIcon(key: string): CategoryIcon {
	for (const [pattern, icon] of ICON_RULES) {
		if (pattern.test(key)) return icon;
	}
	return "pin";
}

export function categoryTone(icon: CategoryIcon): CategoryTone {
	return icon === "bag" || icon === "camera" || icon === "leaf" ? "coral" : "cobalt";
}

function humanize(value: string): string {
	const text = value.replace(/[-_]+/g, " ").trim();
	return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

/** Resolve a listing's stored category value against the taxonomy terms. */
export function resolveCategory(value: unknown, terms: TermLike[]) {
	const raw = typeof value === "string" ? value.trim() : "";
	if (!raw) return null;
	const term =
		terms.find((t) => t.slug === raw) ??
		terms.find((t) => t.label.toLowerCase() === raw.toLowerCase());
	const slug = term?.slug ?? raw;
	const label = term?.label ?? humanize(raw);
	const icon = categoryIcon(`${slug} ${label}`);
	return { slug, label, icon, tone: categoryTone(icon), isTerm: Boolean(term) };
}

/** Only allow http(s) links from CMS text fields. */
export function safeHttpUrl(value: unknown): string | null {
	if (typeof value !== "string") return null;
	try {
		const url = new URL(value.trim());
		return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
	} catch {
		return null;
	}
}

/** Build a tel: href from a display phone number. */
export function telHref(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const digits = value.replace(/[^\d+]/g, "");
	return digits.length >= 3 ? `tel:${digits}` : null;
}

export function displayHost(url: string): string {
	try {
		return new URL(url).host.replace(/^www\./, "");
	} catch {
		return url;
	}
}
