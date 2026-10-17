import type { PublicDocument, PublicFund } from "@zerohost/plugin-redcross-chapter";

const BASE = "/_emdash/api/plugins/redcross-chapter";

async function getData<T>(origin: URL, path: string): Promise<T | null> {
	try {
		const response = await fetch(new URL(`${BASE}/${path}`, origin), {
			headers: { accept: "application/json" },
		});
		if (!response.ok) return null;
		const result = (await response.json()) as { ok?: boolean; data?: T };
		if (!result || result.ok !== true || !("data" in result) || result.data === undefined) return null;
		return result.data;
	} catch {
		return null;
	}
}

/** Aggregated fund transparency figures, or null when the plugin is unavailable. */
export function getPublicFund(origin: URL): Promise<PublicFund | null> {
	return getData<PublicFund>(origin, "public-fund");
}

/** Documents marked public, newest first. */
export async function getPublicDocuments(origin: URL): Promise<PublicDocument[] | null> {
	return getData<PublicDocument[]>(origin, "public-documents");
}

export function formatVnd(amountMinor: number): string {
	const sign = amountMinor < 0 ? "−" : "";
	return `${sign}${Math.abs(amountMinor)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ`;
}

export function formatCompactVnd(amountMinor: number): string {
	const value = Math.abs(amountMinor);
	const sign = amountMinor < 0 ? "−" : "";
	if (value >= 1_000_000_000) return `${sign}${(value / 1_000_000_000).toFixed(2)} tỷ`;
	if (value >= 1_000_000) return `${sign}${(value / 1_000_000).toFixed(1)} triệu`;
	return `${sign}${value.toLocaleString("vi-VN")} đ`;
}

export function formatVnDate(value: string): string {
	const [year, month, day] = value.split("-");
	return year && month && day ? `${day}/${month}/${year}` : value;
}
