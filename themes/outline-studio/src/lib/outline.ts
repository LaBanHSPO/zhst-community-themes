import { getEmDashCollection } from "emdash";
import type { Project, Studio } from "../../emdash-env";

type ImageLike = { src?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
}

/** Work-page filter chips; values match the `categories` multiSelect options. */
export const WORK_FILTERS = [
	{ slug: "all", label: "All work" },
	{ slug: "branding", label: "Branding" },
	{ slug: "web-design", label: "Web design" },
	{ slug: "packaging", label: "Packaging" },
] as const;

export function projectUrl(p: { slug: string | null; id: string }): string {
	return `/work/${encodeURIComponent(p.slug ?? p.id)}`;
}

/** Split a multi-line text field into trimmed, non-empty lines. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);
}

export async function getProjects() {
	return getEmDashCollection("projects", { orderBy: { position: "asc" }, limit: 100 });
}

export async function getPackages() {
	return getEmDashCollection("packages", { orderBy: { position: "asc" }, limit: 20 });
}

const FALLBACK_STUDIO: Pick<Studio, "title" | "email"> = { title: "Outline", email: "" };

/** The single studio entry (contact details); null-safe for an empty CMS. */
export async function getStudio() {
	const { entries, cacheHint } = await getEmDashCollection("studio", { limit: 1 });
	const studio: Partial<Studio> & typeof FALLBACK_STUDIO = entries[0]?.data ?? FALLBACK_STUDIO;
	return { studio, cacheHint };
}

export type { Project };
