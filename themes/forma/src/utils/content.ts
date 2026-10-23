import type { TaxonomyTerm } from "emdash";

/** Taxonomy that classifies projects. Must match the seed's taxonomy `name`. */
export const DISCIPLINE_TAXONOMY = "discipline";

/** Pages with dedicated routes; the catch-all `/[slug]` route redirects these. */
export const RESERVED_PAGE_SLUGS: Record<string, string> = {
	home: "/",
	studio: "/studio",
	services: "/services",
	contact: "/contact",
};

interface HasTerms {
	terms?: Record<string, TaxonomyTerm[]>;
}

/** Discipline terms hydrated on a project entry. */
export function disciplinesOf(data: HasTerms): TaxonomyTerm[] {
	return data.terms?.[DISCIPLINE_TAXONOMY] ?? [];
}

/** "Brand Identity & Packaging" style label for a list of terms. */
export function disciplineLine(terms: TaxonomyTerm[]): string {
	const labels = terms.map((term) => term.label);
	if (labels.length <= 1) return labels[0] ?? "";
	return `${labels.slice(0, -1).join(", ")} & ${labels.at(-1)}`;
}

/** Two-digit index label: 1 → "01". */
export function indexLabel(index: number): string {
	return String(index + 1).padStart(2, "0");
}

/** Split a multi-line text field into trimmed, non-empty lines. */
export function lines(value: string | null | undefined): string[] {
	return (value ?? "")
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter(Boolean);
}

/**
 * Split a headline so a trailing full stop can be rendered in the accent colour.
 * Returns the text without the final period and whether one was present.
 */
export function splitFinalPeriod(text: string): { text: string; period: boolean } {
	const trimmed = text.trim();
	return trimmed.endsWith(".")
		? { text: trimmed.slice(0, -1), period: true }
		: { text: trimmed, period: false };
}

/** Allow only http(s), mailto, tel and site-relative links from editor-entered URLs. */
export function safeHref(value: string | null | undefined): string | undefined {
	if (!value) return undefined;
	const href = value.trim();
	if (href.startsWith("/") && !href.startsWith("//")) return href;
	try {
		const url = new URL(href);
		return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.href : undefined;
	} catch {
		return undefined;
	}
}
