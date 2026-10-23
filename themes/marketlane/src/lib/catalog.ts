import { getEmDashCollection, getTaxonomyTermsWithCacheHint, type WhereValue } from "emdash";
import type { Product } from "../../emdash-env";

export type ProductImage = NonNullable<Product["image"]>;

/** Product colour normalised for rendering and for matching URL query values. */
export interface ColorOption {
	slug: string;
	name: string;
	swatch: string | null;
	image: ProductImage | null;
}

export interface SizeOption {
	label: string;
	available: boolean;
}

export type SortKey = "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: "newest", label: "Newest" },
	{ value: "price-asc", label: "Price: low to high" },
	{ value: "price-desc", label: "Price: high to low" },
];

/** Upper bound for a single listing request; listings paginate beyond it with a cursor. */
export const PAGE_SIZE = 24;
/** Ceiling for user-supplied prices, so absurd query values cannot reach the database. */
const MAX_PRICE = 100_000;

export interface ProductFilters {
	category: string | null;
	department: string | null;
	collection: string | null;
	min: number | null;
	max: number | null;
	newOnly: boolean;
	sort: SortKey;
	cursor: string | null;
}

export interface TermOption {
	slug: string;
	label: string;
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

function readSlug(value: string | null): string | null {
	if (!value) return null;
	const v = value.trim().toLowerCase();
	return SLUG_RE.test(v) ? v : null;
}

function readPrice(value: string | null): number | null {
	if (value == null || value.trim() === "") return null;
	const n = Number(value);
	if (!Number.isFinite(n) || n < 0) return null;
	return Math.min(Math.round(n * 100) / 100, MAX_PRICE);
}

/**
 * Parse listing filters from the query string. Unknown or malformed values are dropped rather
 * than trusted; `fixed` pins values owned by the route (e.g. the category of /category/[slug]).
 */
export function parseFilters(url: URL, fixed: Partial<ProductFilters> = {}): ProductFilters {
	const q = url.searchParams;
	const sortParam = q.get("sort");
	const sort: SortKey = SORT_OPTIONS.some((o) => o.value === sortParam) ? (sortParam as SortKey) : "newest";
	let min = readPrice(q.get("min"));
	let max = readPrice(q.get("max"));
	if (min != null && max != null && min > max) [min, max] = [max, min];
	const cursor = q.get("cursor");
	return {
		category: readSlug(q.get("category")),
		department: readSlug(q.get("department")),
		collection: readSlug(q.get("collection")),
		min,
		max,
		newOnly: q.get("new") === "1",
		sort,
		cursor: cursor && cursor.length <= 512 ? cursor : null,
		...fixed,
	};
}

/** True when a visitor-controlled filter is active (route-fixed values excluded). */
export function hasActiveFilters(f: ProductFilters, fixedKeys: (keyof ProductFilters)[] = []): boolean {
	const check = (k: keyof ProductFilters, active: boolean) => !fixedKeys.includes(k) && active;
	return (
		check("category", f.category != null) ||
		check("department", f.department != null) ||
		check("collection", f.collection != null) ||
		check("min", f.min != null) ||
		check("max", f.max != null) ||
		check("newOnly", f.newOnly)
	);
}

/** Build a query string for a listing, keeping only non-default values. */
export function filtersToQuery(f: ProductFilters, fixedKeys: (keyof ProductFilters)[] = [], extra: Record<string, string> = {}): string {
	const q = new URLSearchParams();
	const add = (k: keyof ProductFilters, name: string, v: string | null) => {
		if (v != null && v !== "" && !fixedKeys.includes(k)) q.set(name, v);
	};
	add("category", "category", f.category);
	add("department", "department", f.department);
	add("collection", "collection", f.collection);
	add("min", "min", f.min != null ? String(f.min) : null);
	add("max", "max", f.max != null ? String(f.max) : null);
	add("newOnly", "new", f.newOnly ? "1" : null);
	if (f.sort !== "newest") q.set("sort", f.sort);
	for (const [k, v] of Object.entries(extra)) q.set(k, v);
	const s = q.toString();
	return s ? `?${s}` : "";
}

/**
 * Query products with server-side filtering. Taxonomy filters and the price range are pushed
 * down to EmDash's content query (taxonomy JOIN + column range), so results stay correct with
 * cursor pagination.
 */
export async function queryProducts(f: ProductFilters, limit = PAGE_SIZE) {
	// EmDash's public WhereValue is string-based; the database compares bound values against the
	// column's type (REAL price, 0/1 boolean), so numbers and flags are passed as strings.
	const where: Record<string, WhereValue> = {};
	if (f.category) where.category = f.category;
	if (f.department) where.department = f.department;
	if (f.collection) where.collection = f.collection;
	if (f.newOnly) where.is_new = "1";
	if (f.min != null || f.max != null) {
		where.price = {
			...(f.min != null ? { gte: String(f.min) } : {}),
			...(f.max != null ? { lte: String(f.max) } : {}),
		};
	}
	const orderBy: Record<string, "asc" | "desc"> =
		f.sort === "price-asc"
			? { price: "asc" }
			: f.sort === "price-desc"
				? { price: "desc" }
				: { created_at: "desc" };
	return getEmDashCollection("products", {
		where,
		orderBy,
		limit,
		...(f.cursor ? { cursor: f.cursor } : {}),
	});
}

/** Terms of a product taxonomy, for filter controls. Returns [] if the taxonomy is missing. */
export async function getTermOptions(taxonomy: "category" | "department" | "collection") {
	const result = await getTaxonomyTermsWithCacheHint(taxonomy, { includeCounts: false });
	const options: TermOption[] = result.data.map((t) => ({ slug: t.slug, label: t.label }));
	return { options, cacheHint: result.cacheHint };
}

export function slugify(value: string): string {
	return value
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 64);
}

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export function getColors(p: Pick<Product, "colors">): ColorOption[] {
	const seen = new Set<string>();
	const out: ColorOption[] = [];
	for (const c of p.colors ?? []) {
		const name = c?.name?.trim();
		if (!name) continue;
		const slug = slugify(name) || `color-${out.length + 1}`;
		if (seen.has(slug)) continue;
		seen.add(slug);
		const swatch = c.swatch && HEX_RE.test(c.swatch.trim()) ? c.swatch.trim() : null;
		out.push({ slug, name, swatch, image: c.image && (c.image.src || c.image.id) ? c.image : null });
	}
	return out;
}

export function getSizes(p: Pick<Product, "sizes">): SizeOption[] {
	return (p.sizes ?? [])
		.filter((s) => s?.label?.trim())
		.map((s) => ({ label: s.label.trim(), available: s.available !== false }));
}

/** Cover image for cards: the main image, else the first colour image. */
export function getCoverImage(p: Pick<Product, "image" | "colors">): ProductImage | null {
	if (p.image && (p.image.src || p.image.id)) return p.image;
	return getColors(p).find((c) => c.image)?.image ?? null;
}

const priceFormat = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 0,
	maximumFractionDigits: 2,
});

export function formatPrice(value: number | null | undefined): string {
	if (typeof value !== "number" || !Number.isFinite(value)) return "Price on request";
	return priceFormat.format(value);
}
