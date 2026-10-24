import { getEmDashCollection } from "emdash";
import type { Clinic, Service, Step, Team } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** Descriptions for the bundled photos, used when an entry carries no alt text of its own. */
const PHOTO_ALT: Record<string, string> = {
	"hero-home": "A physiotherapist in a navy polo guides an older woman through a squat with her arms held forward, in a bright clinic with a treatment table and an exercise ball behind them",
	squat: "A physiotherapist steadies an older woman's hips as she squats with her arms held forward",
	session: "A physiotherapist guides a woman through a kneeling arm-and-leg raise on a mat, with an exercise ball and a treatment table behind them",
	mobility: "A woman stretches one arm forward and one leg back on a mat while a physiotherapist supports her hip",
	posture: "A model of the spine and pelvis beside an anatomy chart in a bright treatment room",
	strength: "A physiotherapist helps a man pull on a resistance band while he sits in a chair",
	"team-priya": "Priya Nair, smiling, in a navy clinic polo",
	"team-daniel": "Daniel Brooks, looking down with a smile, in a white polo",
	"team-marta": "Marta Kowalski, smiling, in a dark clinic polo",
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
export const getSteps = () => getEmDashCollection("steps", { orderBy: { position: "asc" }, limit: 8 });

const FALLBACK_CLINIC: Pick<Clinic, "title" | "email"> = { title: "", email: "" };
export type ClinicData = Partial<Clinic> & typeof FALLBACK_CLINIC;

/** The single clinic entry (contact details, hours); null-safe for an empty CMS. */
export async function getClinic() {
	const { entries, cacheHint } = await getEmDashCollection("clinic", { limit: 1 });
	const clinic: ClinicData = entries[0]?.data ?? FALLBACK_CLINIC;
	return { clinic, cacheHint };
}

export const serviceHref = (data: { slug: string | null; id: string }) => `/services/${data.slug ?? data.id}`;

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

export type { Clinic, Service, Step, Team };
