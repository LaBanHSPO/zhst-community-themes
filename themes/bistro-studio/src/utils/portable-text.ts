/**
 * Plain-text lines from the first Portable Text blocks of an entry.
 * Used for short summaries (opening hours, address) on the home page;
 * the full content is always available on the page itself.
 */
interface SpanLike {
	_type?: string;
	text?: string;
}
interface BlockLike {
	_type?: string;
	children?: SpanLike[];
}

export function blockLines(content: unknown, count: number): string[] {
	if (!Array.isArray(content)) return [];
	const lines: string[] = [];
	for (const block of content as BlockLike[]) {
		if (lines.length >= count) break;
		if (block?._type !== "block" || !Array.isArray(block.children)) continue;
		const text = block.children
			.map((child) => (typeof child?.text === "string" ? child.text : ""))
			.join("")
			.trim();
		if (text) lines.push(text);
	}
	return lines;
}

/** "starters" -> "Starters"; empty -> "Other". */
export function categoryLabel(category?: string | null): string {
	const value = (category ?? "").trim();
	if (!value) return "Other";
	return value
		.split(/[-_\s]+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

const CATEGORY_ORDER = ["starters", "mains", "sides", "desserts", "drinks"];

/** Sort key that keeps the usual course order, unknown categories after. */
export function categoryRank(category?: string | null): number {
	const index = CATEGORY_ORDER.indexOf((category ?? "").toLowerCase().trim());
	return index === -1 ? CATEGORY_ORDER.length : index;
}

/** Menu item fields, read defensively (generated types may not list `menu`). */
export interface Dish {
	name: string;
	description: string | null;
	price: string | null;
	category: string | null;
	available: boolean | null;
}

const str = (value: unknown): string | null =>
	typeof value === "string" && value.trim() ? value : null;

export function toDish(data: unknown): Dish {
	const record = (data ?? {}) as Record<string, unknown>;
	return {
		name: str(record.name) ?? "",
		description: str(record.description),
		price: str(record.price),
		category: str(record.category),
		available: typeof record.available === "boolean" ? record.available : null,
	};
}
