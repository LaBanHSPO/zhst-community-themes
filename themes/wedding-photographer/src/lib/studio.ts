import { getEmDashCollection } from "emdash";
import type { Package, Studio, Story } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when a gallery item carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A bride and groom embracing on a Tuscan hillside at golden hour, her long veil blowing in the wind",
	"table-setting": "A wedding table with peach roses, candles and glassware overlooking the hills",
	"walking-bw": "A bride and groom walking away hand in hand along a stone path lined with cypress trees, in black and white",
	"rings-card": "Two gold rings resting on a handwritten card beside white roses",
	bouquet: "A bride's bouquet of peach roses, white flowers and olive leaves",
	veil: "A long lace veil lifting in the breeze above rolling hills",
	hills: "Cypress trees and a hilltop village in soft evening light",
	"camera-prints": "A camera and printed photographs on a stone wall, with a couple embracing by a lake behind",
	camera: "A black camera with a flower bouquet and leather strap on a sunlit stone wall",
	"lake-couple": "A bride and groom touching foreheads on a lakeside terrace at golden hour",
	prints: "Printed wedding photographs resting on a stone ledge",
	"embrace-close": "A smiling bride and groom close together, her veil drifting past",
};

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src || photo || undefined;
}

export function photoAlt(image: ImageLike, photo: string | null | undefined, fallback = ""): string {
	if (image?.alt) return image.alt;
	const name = photo?.split("/").pop()?.replace(/\.\w+$/, "");
	return (name && PHOTO_ALT[name]) || fallback;
}

export async function getStories() {
	return getEmDashCollection("stories", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getPackages() {
	return getEmDashCollection("packages", { orderBy: { position: "asc" }, limit: 20 });
}

export async function getApproach() {
	return getEmDashCollection("principles", { orderBy: { position: "asc" }, limit: 12 });
}

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "", email: "" };

export type StudioData = Partial<Studio> & typeof FALLBACK_STUDIO;

/** The single studio entry (contact details); null-safe for an empty CMS. */
export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: StudioData = entries[0]?.data ?? FALLBACK_STUDIO;
	return { studio, cacheHint };
}

export function formatPrice(price: number | null | undefined): string {
	return typeof price === "number" ? `$${price.toLocaleString("en-US")}` : "";
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export function storyHref(data: { slug: string | null; id: string }): string {
	return `/stories/${data.slug ?? data.id}`;
}

export type { Package, Studio, Story };
