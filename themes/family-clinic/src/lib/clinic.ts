import { getEmDashCollection } from "emdash";
import type { Clinic, Highlight, Service, Step, Team } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A mother and her young daughter hold hands with a smiling doctor in a white coat, while a nurse in blue scrubs looks on in a bright reception area with plants",
	reception: "A family high-fives a doctor at a curved wooden reception desk, with a nurse and a receptionist smiling behind it",
	"care-primary": "A doctor in a white coat smiling across the reception desk, with a nurse behind her",
	"care-pediatric": "A young girl in a pink sweater holding a teddy bear and high-fiving a doctor over the reception desk",
	"care-family": "A father and mother smiling down at their daughter in a bright clinic waiting area",
	"care-chronic": "A nurse in light blue scrubs holding a clipboard beside a green plant at the reception desk",
	sign: "A doctor and a nurse smiling at the reception desk beneath a lit heart-shaped sign showing a family",
	"team-elena": "Elena Marquez, smiling, in a white coat with a stethoscope",
	"team-hannah": "Hannah Lindqvist, smiling in a white coat",
	"team-samuel": "Samuel Adeyemi, smiling, in blue scrubs with a stethoscope",
	"team-mei": "Mei Tanaka, smiling, in light blue scrubs",
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

export const getServices = () => getEmDashCollection("services", { orderBy: { position: "asc" }, limit: 50 });
export const getTeam = () => getEmDashCollection("team", { orderBy: { position: "asc" }, limit: 50 });
export const getHighlights = () => getEmDashCollection("highlights", { orderBy: { position: "asc" }, limit: 6 });
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 8 });

const FALLBACK_CLINIC: Pick<Clinic, "title" | "email"> = { title: "", email: "" };
export type ClinicData = Partial<Clinic> & typeof FALLBACK_CLINIC;

/** The single clinic entry (contact details, hours); null-safe for an empty CMS. */
export async function getClinic() {
	const { entries, cacheHint } = await getEmDashCollection("clinic", { limit: 1 });
	const clinic: ClinicData = entries[0]?.data ?? FALLBACK_CLINIC;
	return { clinic, cacheHint };
}

export const serviceHref = (data: { slug: string | null; id: string }) => `/care/${data.slug ?? data.id}`;

/** `tel:` href from a human-formatted phone number. */
export function telHref(phone: string): string {
	return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Non-empty lines of a multi-line text field. */
export function lines(text: string | null | undefined): string[] {
	return (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
}

/** Opening hours: each line is "Day | time". */
export function hoursRows(text: string | null | undefined): { day: string; time: string }[] {
	return lines(text).map((l) => {
		const [day, ...rest] = l.split("|");
		return { day: day.trim(), time: rest.join("|").trim() };
	});
}

export function initials(name: string): string {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export type { Clinic, Highlight, Service, Step, Team };
