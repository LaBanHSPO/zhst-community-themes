import { getEmDashCollection } from "emdash";
import type { Deal, Store, StoreOffer } from "../../emdash-env";

export type { Deal, Store, StoreOffer };

type ImageLike = { src?: string; alt?: string } | null | undefined;
type Keyed = { slug: string | null; id: string };

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function entryKey(entry: Keyed): string {
	return entry.slug ?? entry.id;
}

export const dealUrl = (entry: Keyed) => `/deals/${encodeURIComponent(entryKey(entry))}`;
export const storeUrl = (slug: string) => `/stores/${encodeURIComponent(slug)}`;

export const CATEGORIES = [
	{ slug: "living-room", label: "Living Room" },
	{ slug: "bedroom", label: "Bedroom" },
	{ slug: "kitchen-dining", label: "Kitchen & Dining" },
	{ slug: "bath", label: "Bath" },
	{ slug: "home-decor", label: "Home Decor" },
	{ slug: "organization", label: "Organization" },
	{ slug: "lighting", label: "Lighting" },
	{ slug: "rugs-textiles", label: "Rugs & Textiles" },
	{ slug: "outdoor", label: "Outdoor" },
	{ slug: "storage", label: "Storage" },
] as const;

/** Pill order on the catalog page. */
export const PILL_ORDER = [
	"kitchen-dining",
	"lighting",
	"storage",
	"home-decor",
	"bath",
	"living-room",
	"bedroom",
	"outdoor",
	"rugs-textiles",
	"organization",
];

export const STORE_CATEGORIES = [
	{ slug: "home-decor", label: "Home Decor" },
	{ slug: "kitchen-dining", label: "Kitchen & Dining" },
	{ slug: "bedding", label: "Bedding" },
	{ slug: "bath", label: "Bath" },
	{ slug: "storage-organization", label: "Storage & Organization" },
	{ slug: "lighting", label: "Lighting" },
	{ slug: "rugs-textiles", label: "Rugs & Textiles" },
	{ slug: "furniture", label: "Furniture" },
	{ slug: "outdoor", label: "Outdoor" },
] as const;

export const categoryLabel = (slug: string) =>
	CATEGORIES.find((c) => c.slug === slug)?.label ?? STORE_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;

export const money = (n: number | null | undefined) => (typeof n === "number" ? `$${n.toFixed(2)}` : "");

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
/** Listed dates are stored as calendar days (UTC midnight), so they are shown in UTC. */
export function formatDate(value: string | Date | null | undefined): string {
	if (!value) return "";
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? "" : dateFmt.format(d);
}

/** A listed date is expired once its calendar day has passed in Asia/Saigon. */
export function isExpired(value: string | Date | null | undefined, now = new Date()): boolean {
	if (!value) return false;
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return false;
	const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Saigon" }).format(now);
	return d.toISOString().slice(0, 10) < today;
}

export async function getDeals() {
	return getEmDashCollection("deals", { orderBy: { position: "asc" }, limit: 200 });
}
export async function getStores() {
	return getEmDashCollection("stores", { orderBy: { position: "asc" }, limit: 50 });
}
export async function getStoreOffers() {
	return getEmDashCollection("store_offers", { orderBy: { position: "asc" }, limit: 200 });
}

/** Only link out to http(s) retailer URLs. */
export function safeUrl(value: string | null | undefined): string | undefined {
	if (!value) return undefined;
	try {
		const u = new URL(value);
		return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
	} catch {
		return undefined;
	}
}
