import { getEmDashCollection } from "emdash";
import type { Business, EstimateOption, Highlight, Package, Service } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
}

export function serviceUrl(entry: { slug: string | null; id: string }): string {
	return `/services/${encodeURIComponent(entry.slug ?? entry.id)}`;
}

/** Link to the request form, optionally preselecting a service or naming a package / estimate. */
export function requestUrl(opts: { service?: string | null; package?: string | null; estimate?: string | null } = {}): string {
	const params = new URLSearchParams();
	if (opts.service) params.set("service", opts.service);
	if (opts.package) params.set("package", opts.package);
	if (opts.estimate) params.set("estimate", opts.estimate);
	const qs = params.toString();
	return `/request${qs ? `?${qs}` : ""}`;
}

export async function getServices() {
	return getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
}

export async function getPackages() {
	return getEmDashCollection("packages", { orderBy: { position: "asc" }, limit: 50 });
}

/** Highlights for one placement (estimate strip, request page side list). */
export async function getHighlights(placement: string) {
	const { entries, cacheHint } = await getEmDashCollection("highlights", { orderBy: { position: "asc" }, limit: 60 });
	return { entries: entries.filter((e) => e.data.placement === placement), cacheHint };
}

/** Service the estimate is priced as; the request form preselects it. */
export const ESTIMATE_SERVICE = "standard-cleaning";

export const ESTIMATE_GROUPS = ["property", "size", "bedrooms", "bathrooms", "frequency"] as const;
export type EstimateGroup = (typeof ESTIMATE_GROUPS)[number];

export async function getEstimateOptions() {
	const { entries, cacheHint } = await getEmDashCollection("estimate_options", {
		orderBy: { position: "asc" },
		limit: 100,
	});
	const groups = Object.fromEntries(ESTIMATE_GROUPS.map((g) => [g, [] as EstimateChoice[]])) as Record<
		EstimateGroup,
		EstimateChoice[]
	>;
	for (const e of entries) {
		const group = e.data.group as EstimateGroup;
		if (!groups[group]) continue;
		groups[group].push({
			value: e.data.slug ?? e.data.id,
			label: e.data.title,
			summary: e.data.summary_label || e.data.title,
			amount: Number(e.data.amount ?? 0) || 0,
			icon: e.data.icon ?? "",
			isDefault: Boolean(e.data.is_default),
		});
	}
	return { groups, cacheHint };
}

export interface EstimateChoice {
	value: string;
	label: string;
	summary: string;
	/** Dollar amount, except frequency where it is a percentage discount. */
	amount: number;
	icon: string;
	isDefault: boolean;
}

export interface EstimateLine {
	label: string;
	detail: string;
	amount: number | null;
	discount?: boolean;
}

/** Pick the choice named in the query string, else the default, else the first. */
export function pickChoice(choices: EstimateChoice[], requested: string | null): EstimateChoice | undefined {
	return choices.find((c) => c.value === requested) ?? choices.find((c) => c.isDefault) ?? choices[0];
}

/**
 * Illustrative itemised estimate. Mirrored by the inline script on /estimate so the
 * page updates live; the server version answers the no-JS form submit.
 */
export function computeEstimate(sel: Partial<Record<EstimateGroup, EstimateChoice>>) {
	const base = (sel.size?.amount ?? 0) + (sel.property?.amount ?? 0);
	const bed = sel.bedrooms?.amount ?? 0;
	const bath = sel.bathrooms?.amount ?? 0;
	const subtotal = base + bed + bath;
	const pct = sel.frequency?.amount ?? 0;
	const discount = Math.round(subtotal * pct) / 100;
	const lines: EstimateLine[] = [
		{ label: "Standard cleaning", detail: "All essential cleaning tasks for a fresh, tidy home.", amount: base },
		{ label: `Bedrooms (${sel.bedrooms?.label ?? "–"})`, detail: "Dusting, vacuuming, floor care, and more.", amount: bed || null },
		{ label: `Bathrooms (${sel.bathrooms?.label ?? "–"})`, detail: "Deep cleaning and sanitizing.", amount: bath || null },
		{ label: "Kitchen", detail: "Countertops, appliances (exterior), sink, and floors.", amount: null },
	];
	if (discount > 0) {
		lines.push({
			label: `${sel.frequency?.label ?? ""} discount (${pct}%)`,
			detail: "Applied to every visit on a regular schedule.",
			amount: discount,
			discount: true,
		});
	}
	return { lines, total: subtotal - discount };
}

export function money(n: number): string {
	return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const FALLBACK_BUSINESS: Pick<Business, "title" | "email"> = { title: "Freshspace", email: "" };

/** The single business entry (request email, phone); null-safe for an empty CMS. */
export async function getBusiness() {
	const { entries, cacheHint } = await getEmDashCollection("business", { limit: 1 });
	const business: Partial<Business> & typeof FALLBACK_BUSINESS = entries[0]?.data ?? FALLBACK_BUSINESS;
	return { business, cacheHint };
}

export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export type { Business, EstimateOption, Highlight, Package, Service };
