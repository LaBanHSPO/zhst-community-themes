import { getEmDashCollection } from "emdash";
import type { Agenda, Benefit, Capability, Company, Comparison, Plan, Stage, Workflow } from "../../emdash-env";

type ImageLike = { src?: string; alt?: string } | null | undefined;

/** CMS upload wins; otherwise the bundled photo path seeded with the theme. */
export function photoSrc(image: ImageLike, photo: string | null | undefined): string | undefined {
	return image?.src ?? photo ?? undefined;
}

export function workflowUrl(entry: { slug: string | null; id: string }): string {
	return `/customer-workflow/${encodeURIComponent(entry.slug ?? entry.id)}`;
}

export const DEMO_URL = "/book-a-demo";

const byPosition = { orderBy: { position: "asc" }, limit: 50 } as const;

export async function getBenefits(placement: "home" | "demo") {
	const { entries, cacheHint } = await getEmDashCollection("benefits", byPosition);
	return { entries: entries.filter((e) => (placement === "home" ? e.data.on_home : e.data.on_demo)), cacheHint };
}

export async function getStages() {
	return getEmDashCollection("stages", byPosition);
}

export async function getCapabilities() {
	return getEmDashCollection("capabilities", byPosition);
}

export async function getPlans() {
	return getEmDashCollection("plans", byPosition);
}

export async function getComparison() {
	return getEmDashCollection("comparison", byPosition);
}

export async function getWorkflows() {
	return getEmDashCollection("workflows", byPosition);
}

export async function getAgenda() {
	return getEmDashCollection("agenda", byPosition);
}

const FALLBACK_COMPANY: Pick<Company, "title" | "email"> = { title: "Clarity", email: "" };

/** The single company entry (demo email, footer copy); null-safe for an empty CMS. */
export async function getCompany() {
	const { entries, cacheHint } = await getEmDashCollection("company", { limit: 1 });
	const company: Partial<Company> & typeof FALLBACK_COMPANY = entries[0]?.data ?? FALLBACK_COMPANY;
	return { company, cacheHint };
}

/** "$1,234" style price without trailing cents for whole numbers. */
export function formatPrice(value: number): string {
	const whole = Number.isInteger(value);
	return `$${value.toLocaleString("en-US", { minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 })}`;
}

/** Comparison cell: "yes" / "no" render as a check / dash, anything else as text. */
export function cellKind(value: string | null | undefined): "yes" | "no" | "text" {
	const v = (value ?? "").trim().toLowerCase();
	if (v === "yes" || v === "true" || v === "✓") return "yes";
	if (v === "" || v === "no" || v === "false" || v === "—" || v === "-") return "no";
	return "text";
}

export function lines(text: string | null | undefined): string[] {
	return (text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

export const COMPANY_SIZES = ["Just me", "2–10 people", "11–50 people", "51–200 people", "201–1,000 people", "1,000+ people"] as const;

export const USE_CASES = [
	"Marketing content",
	"Product updates and announcements",
	"Internal docs and briefs",
	"Sales and customer emails",
	"Reports and plans",
	"Something else",
] as const;

export const DEMO_TIMES = [
	"Weekday morning (9:00–12:00)",
	"Weekday lunchtime (12:00–14:00)",
	"Weekday afternoon (14:00–17:00)",
	"I’m flexible — suggest a time",
] as const;

export type { Agenda, Benefit, Capability, Company, Comparison, Plan, Stage, Workflow };
