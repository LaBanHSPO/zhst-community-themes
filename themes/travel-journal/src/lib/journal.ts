import { getEmDashCollection } from "emdash";
import type { Destination, Journal as JournalPost, Writer } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"card-amalfi": "A pastel village on a rocky coast above deep blue water, with pink flowers in the foreground",
	"card-banff": "A turquoise mountain lake with snowy peaks behind and tall spruce trees on the shore",
	"card-hoian": "A woman in a conical hat walking along a quiet lane lined with yellow walls and paper lanterns",
	"hiker-ledge": "A hiker in a beanie with a green backpack, seen from behind, sitting on a rock above a fjord",
	"fjord-lake": "A wide blue fjord with forested islands and snowy mountains in warm evening light",
	"journal-book": "An open travel journal with watercolour sketches and taped-in photographs of a coast",
	"journal-scene": "A travel journal, a camera, an enamel mug and a straw hat on a rock at sunset above the sea",
	"sunset-water": "The sun setting over a calm sea with small boats and a rocky headland",
	"hillside-town": "Terraced houses climbing a steep hillside beside the sea",
	"straw-hat": "A straw hat with a black band resting on a stone wall beside an open journal",
	"banff-trees": "Snowy mountains above a turquoise lake, with a tall dark spruce tree on the right",
	"cup-blanket": "A leather journal and brass compass on a striped blanket beside an enamel mug",
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

export async function getPosts() {
	return getEmDashCollection("journal", { orderBy: { position: "asc" }, limit: 200 });
}

export async function getDestinations() {
	return getEmDashCollection("destinations", { orderBy: { position: "asc" }, limit: 100 });
}

const FALLBACK_WRITER: Pick<Writer, "title" | "email"> = { title: "", email: "" };
export type WriterData = Partial<Writer> & typeof FALLBACK_WRITER;

/** The single writer entry (contact details); null-safe for an empty CMS. */
export async function getWriter() {
	const { entries, cacheHint } = await getEmDashCollection("writer", { limit: 1 });
	const writer: WriterData = entries[0]?.data ?? FALLBACK_WRITER;
	return { writer, cacheHint };
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function postHref(data: { slug: string | null; id: string }): string {
	return `/journal/${data.slug ?? data.id}`;
}

export function journalHref(params: { region?: string; destination?: string; page?: number } = {}): string {
	const q = new URLSearchParams();
	if (params.region) q.set("region", params.region);
	if (params.destination) q.set("destination", params.destination);
	if (params.page && params.page > 1) q.set("page", String(params.page));
	const s = q.toString();
	return s ? `/journal?${s}` : "/journal";
}

export function postWord(n: number): string {
	return n === 1 ? "1 post" : `${n} posts`;
}

export interface Region {
	name: string;
	slug: string;
	count: number;
	photo?: string;
}

/** Regions in destination order, with live post counts. */
export function buildRegions(
	destinations: { data: Destination }[],
	posts: { data: JournalPost }[],
): Region[] {
	const regions = new Map<string, Region>();
	for (const d of destinations) {
		const name = d.data.region;
		if (!name) continue;
		if (!regions.has(name)) regions.set(name, { name, slug: slugify(name), count: 0, photo: d.data.photo ?? undefined });
	}
	for (const p of posts) {
		const name = p.data.region;
		if (!name) continue;
		if (!regions.has(name)) regions.set(name, { name, slug: slugify(name), count: 0 });
		regions.get(name)!.count += 1;
	}
	return [...regions.values()];
}

export function postMeta(post: { date_label?: string | null; reading_time?: number | null }): string {
	return [post.date_label, post.reading_time ? `${post.reading_time} min read` : ""].filter(Boolean).join(" · ");
}

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export type { Destination, JournalPost, Writer };
