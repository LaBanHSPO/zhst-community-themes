/**
 * Small presentation helpers shared by the layout and pages.
 * They only reshape CMS values (site title, tagline); they never invent content.
 */

/** Public contact address. Replace before publishing (same value as MinimalFolio). */
export const CONTACT_EMAIL = "hello@studio.example";

export interface TextSegment {
	text: string;
	accent: boolean;
}

/**
 * Split text on `*marked*` words so the layout can colour them with the accent.
 * "Design for a *clearer* tomorrow." -> plain / accent / plain segments.
 * Unmarked text yields a single plain segment.
 */
export function accentSegments(value: string): TextSegment[] {
	const segments: TextSegment[] = [];
	const pattern = /\*([^*]+)\*/g;
	let last = 0;
	for (const match of value.matchAll(pattern)) {
		const index = match.index ?? 0;
		if (index > last) segments.push({ text: value.slice(last, index), accent: false });
		segments.push({ text: match[1] ?? "", accent: true });
		last = index + match[0].length;
	}
	if (last < value.length) segments.push({ text: value.slice(last), accent: false });
	return segments;
}

/** The tagline without accent markers, for meta tags, feeds and plain text. */
export function plainText(value: string): string {
	return value.replace(/\*([^*]+)\*/g, "$1");
}

/**
 * Split the site title into a dark part and an accent part for the wordmark:
 * "MinimalFolio" -> ["Minimal", "Folio"], "Ana Ruiz" -> ["Ana ", "Ruiz"].
 */
export function wordmarkParts(title: string): [string, string] {
	const trimmed = title.trim();
	const space = trimmed.lastIndexOf(" ");
	if (space > 0) return [trimmed.slice(0, space + 1), trimmed.slice(space + 1)];
	for (let i = trimmed.length - 1; i > 0; i--) {
		const ch = trimmed.charAt(i);
		if (ch !== ch.toLowerCase() && ch === ch.toUpperCase()) {
			return [trimmed.slice(0, i), trimmed.slice(i)];
		}
	}
	return [trimmed, ""];
}

/** True when `href` is the current page or a section that contains it. */
export function isCurrent(pathname: string, href: string): boolean {
	if (!href.startsWith("/")) return false;
	const clean = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
	const path = clean(pathname);
	const target = clean(href.split(/[?#]/)[0] || "/");
	if (target === "/") return path === "/";
	return path === target || path.startsWith(`${target}/`);
}
