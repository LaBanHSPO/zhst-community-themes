import { sanitizeHref } from "emdash";
import type { PageContentBlock } from "../../emdash-env";

type PricingBlock = Extract<PageContentBlock, { _type: "marketing_pricing" }>;
type HeroBlock = Extract<PageContentBlock, { _type: "marketing_hero" }>;

export type StatusTone = "available" | "limited" | "unavailable" | "note";

export interface CatalogDetail {
	text: string;
	tone: StatusTone;
}

export interface CatalogCategory {
	slug: string;
	label: string;
	count: number;
}

export interface CatalogProduct {
	key: string;
	order: number;
	name: string;
	price: string;
	period: string | null;
	description: string | null;
	details: CatalogDetail[];
	ctaLabel: string;
	ctaUrl: string;
	external: boolean;
	featured: boolean;
	category: CatalogCategory;
	amount: number | null;
}

export interface Storefront {
	intro: HeroBlock | null;
	categories: CatalogCategory[];
	products: CatalogProduct[];
	/** Blocks rendered after the catalog, in their authored order. */
	rest: PageContentBlock[];
}

export const SORT_OPTIONS = [
	{ value: "featured", label: "Featured" },
	{ value: "price-asc", label: "Price: low to high" },
	{ value: "price-desc", label: "Price: high to low" },
	{ value: "name", label: "Name: A to Z" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/** "CommerceLite" gives Commerce + Lite; "Corner Shop" gives "Corner " + Shop. */
export function splitWordmark(title: string): { lead: string; tail: string } {
	const trimmed = title.trim();
	const spaced = trimmed.match(/^(.+\s)(\S+)$/);
	if (spaced) return { lead: spaced[1] ?? trimmed, tail: spaced[2] ?? "" };
	const camel = trimmed.match(/^(.*[a-z])([A-Z][a-z]+)$/);
	if (camel) return { lead: camel[1] ?? trimmed, tail: camel[2] ?? "" };
	return { lead: trimmed, tail: "" };
}

export function slugify(value: string): string {
	return value
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 48);
}

/** First number in a free-text price ("$18.00", "18 USD", "From 1,200"); null for "Custom". */
export function parseAmount(price: string): number | null {
	const match = price.replace(/,(?=\d{3}\b)/g, "").match(/\d+(?:\.\d+)?/);
	return match ? Number(match[0]) : null;
}

/** Colour hint for an editor-written availability line. The text itself is always shown. */
export function detailTone(text: string): StatusTone {
	const t = text.toLowerCase();
	if (/^(out of stock|sold out|unavailable|discontinued)/.test(t)) return "unavailable";
	if (/^(low stock|limited|few left|only \d+|last )/.test(t)) return "limited";
	if (/^(in stock|available|ready to ship|ships )/.test(t)) return "available";
	return "note";
}

function isExternal(url: string): boolean {
	return /^https?:\/\//i.test(url);
}

/**
 * Groups a page's blocks into a storefront. Every `marketing_pricing` block is a shelf: its
 * headline is the category and its plans are the products. A hero that comes before the first
 * shelf becomes the catalog introduction. All other blocks keep their authored order.
 */
export function buildStorefront(blocks: PageContentBlock[] | null | undefined): Storefront {
	const list = blocks ?? [];
	const firstShelf = list.findIndex((block) => block._type === "marketing_pricing");
	if (firstShelf === -1) return { intro: null, categories: [], products: [], rest: list };

	const introIndex = list.findIndex(
		(block, index) => block._type === "marketing_hero" && index < firstShelf,
	);
	const intro = introIndex === -1 ? null : (list[introIndex] as HeroBlock);

	const categories: CatalogCategory[] = [];
	const products: CatalogProduct[] = [];
	const used = new Set<string>();

	list.forEach((block, blockIndex) => {
		if (block._type !== "marketing_pricing") return;
		const shelf = block as PricingBlock;
		const label = shelf.headline?.trim() || "Products";
		let slug = slugify(shelf.anchor_id || label) || `shelf-${blockIndex + 1}`;
		while (used.has(slug)) slug = `${slug}-${blockIndex + 1}`;
		used.add(slug);
		const category: CatalogCategory = { slug, label, count: 0 };
		categories.push(category);

		shelf.plans.forEach((plan, planIndex) => {
			const url = sanitizeHref(plan.cta_url);
			category.count += 1;
			products.push({
				key: `${shelf._key}-${planIndex}`,
				order: products.length,
				name: plan.name,
				price: plan.price,
				period: plan.period?.trim() || null,
				description: plan.description?.trim() || null,
				details: (plan.features ?? "")
					.split("\n")
					.map((line) => line.trim())
					.filter(Boolean)
					.map((text) => ({ text, tone: detailTone(text) })),
				ctaLabel: plan.cta_label,
				ctaUrl: url,
				external: isExternal(url),
				featured: !!plan.highlighted,
				category,
				amount: parseAmount(plan.price),
			});
		});
	});

	const rest = list.filter(
		(block, index) => block._type !== "marketing_pricing" && index !== introIndex,
	);

	return { intro, categories, products, rest };
}

export function sortProducts(products: CatalogProduct[], sort: SortValue): CatalogProduct[] {
	const copy = [...products];
	const byAmount = (dir: 1 | -1) => (a: CatalogProduct, b: CatalogProduct) => {
		if (a.amount === null && b.amount === null) return a.order - b.order;
		if (a.amount === null) return 1;
		if (b.amount === null) return -1;
		return (a.amount - b.amount) * dir || a.order - b.order;
	};
	switch (sort) {
		case "price-asc":
			return copy.sort(byAmount(1));
		case "price-desc":
			return copy.sort(byAmount(-1));
		case "name":
			return copy.sort((a, b) => a.name.localeCompare(b.name) || a.order - b.order);
		default:
			return copy.sort((a, b) => a.order - b.order);
	}
}

export function readSort(value: string | null): SortValue {
	return SORT_OPTIONS.some((option) => option.value === value) ? (value as SortValue) : "featured";
}

export function matchesQuery(product: CatalogProduct, query: string): boolean {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	return [product.name, product.description ?? "", product.category.label]
		.join(" ")
		.toLowerCase()
		.includes(q);
}
