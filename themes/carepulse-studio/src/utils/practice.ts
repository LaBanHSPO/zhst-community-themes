import { getEmDashCollection, getEmDashEntry, getTaxonomyTerms, getWidgetArea } from "emdash";
import type { IconName } from "../components/Icon.astro";
import { isInquiryFormActive } from "./inquiry";

/** Widget areas added by CarePulse Studio. Both are optional: empty or missing areas render nothing. */
export const HERO_AREA = "home-intro";
export const HOURS_AREA = "opening-hours";
/** Optional CMS page that explains how to send an inquiry. */
export const INQUIRY_PAGE_SLUG = "contact";

interface PortableSpan {
	_type?: string;
	text?: string;
}

interface PortableBlock {
	_type?: string;
	children?: PortableSpan[];
}

/** Plain text of each Portable Text block (one string per block, empty blocks dropped). */
export function blockLines(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return (value as PortableBlock[])
		.filter((block) => block?._type === "block" && Array.isArray(block.children))
		.map((block) =>
			(block.children ?? [])
				.map((child) => (typeof child?.text === "string" ? child.text : ""))
				.join("")
				.trim(),
		)
		.filter((line) => line.length > 0);
}

export interface HoursRow {
	label: string;
	value: string | null;
}

/**
 * Split an hours line on the first ": " (colon + space) so times such as "9:00" stay intact.
 * "Mon: 9:00 AM – 6:00 PM" → { label: "Mon", value: "9:00 AM – 6:00 PM" }.
 * Lines without a separator are kept as a single full-width note.
 */
export function parseHoursLine(line: string): HoursRow {
	const index = line.indexOf(": ");
	if (index <= 0) return { label: line, value: null };
	return { label: line.slice(0, index).trim(), value: line.slice(index + 2).trim() };
}

export interface ContentWidget {
	title: string | null;
	content: unknown;
}

async function contentWidgets(name: string): Promise<ContentWidget[]> {
	try {
		const area = await getWidgetArea(name);
		if (!area) return [];
		return area.widgets
			.filter((widget) => widget.type === "content" && widget.content)
			.map((widget) => ({ title: widget.title ?? null, content: widget.content }));
	} catch {
		return [];
	}
}

export async function getHeroIntro(): Promise<ContentWidget | null> {
	const [first] = await contentWidgets(HERO_AREA);
	return first ?? null;
}

export interface OpeningHours {
	title: string | null;
	rows: HoursRow[];
}

export async function getOpeningHours(): Promise<OpeningHours | null> {
	const [first] = await contentWidgets(HOURS_AREA);
	if (!first) return null;
	const rows = blockLines(first.content).map(parseHoursLine);
	return rows.length > 0 ? { title: first.title, rows } : null;
}

/**
 * Where inquiry links point: "/contact#inquiry" when the Forms-plugin inquiry form is active,
 * "/contact" when only the CMS contact page is published, otherwise null (no dead links).
 */
export async function getInquiryHref(locals: unknown, url: URL): Promise<string | null> {
	if (await isInquiryFormActive(locals, url)) return `/${INQUIRY_PAGE_SLUG}#inquiry`;
	try {
		const { entry } = await getEmDashEntry("pages", INQUIRY_PAGE_SLUG);
		return entry ? `/${INQUIRY_PAGE_SLUG}` : null;
	} catch {
		return null;
	}
}

/** Names of published services that are marked available, for the inquiry form's service list. */
export async function getAvailableServiceNames(limit = 50): Promise<string[]> {
	try {
		const { entries } = await getEmDashCollection("services", { limit });
		return entries
			.filter((service) => service.data.available !== false)
			.map((service) => (typeof service.data.name === "string" ? service.data.name.trim() : ""))
			.filter((name) => name.length > 0);
	} catch {
		return [];
	}
}

/** Map service category slugs to their taxonomy labels where a matching term exists. */
export async function getCategoryLabels(): Promise<Map<string, string>> {
	try {
		const terms = await getTaxonomyTerms("category");
		return new Map(terms.map((term) => [term.slug, term.label]));
	} catch {
		return new Map();
	}
}

export function categoryLabel(value: string | undefined | null, labels: Map<string, string>): string | null {
	if (!value) return null;
	const known = labels.get(value);
	if (known) return known;
	return value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");
}

export type ServiceTone = "sage" | "peach" | "stone";

export interface ServiceVisual {
	icon: IconName;
	tone: ServiceTone;
}

/** Decorative icon + tone per category; unknown categories rotate through the set. */
export function serviceVisual(category: string | undefined | null, index: number): ServiceVisual {
	const key = (category ?? "").toLowerCase();
	if (key.includes("therap") || key.includes("massage")) return { icon: "lotus", tone: "sage" };
	if (key.includes("mind") || key.includes("coach") || key.includes("counsel")) return { icon: "person", tone: "stone" };
	if (key.includes("wellness") || key.includes("nutrition")) return { icon: "sprout", tone: "peach" };
	if (key.includes("diagnos") || key.includes("screen")) return { icon: "pulse", tone: "stone" };
	const fallback: ServiceVisual[] = [
		{ icon: "lotus", tone: "sage" },
		{ icon: "person", tone: "stone" },
		{ icon: "sprout", tone: "peach" },
	];
	return fallback[index % fallback.length]!;
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
