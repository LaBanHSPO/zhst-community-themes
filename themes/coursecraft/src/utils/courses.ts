import type { Course } from "../../emdash-env";

export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

const LEVEL_LABELS: Record<Level, string> = {
	beginner: "Beginner",
	intermediate: "Intermediate",
	advanced: "Advanced",
};

export function isLevel(value: unknown): value is Level {
	return typeof value === "string" && (LEVELS as readonly string[]).includes(value);
}

export function levelLabel(value: string | null | undefined): string {
	return isLevel(value) ? LEVEL_LABELS[value] : "All levels";
}

/** Split a module's "one lesson per line" text into trimmed, non-empty lesson titles. */
export function lessonsOf(lessons: string | null | undefined): string[] {
	if (!lessons) return [];
	return lessons
		.split(/\r?\n/)
		.map((line) => line.replace(/^\s*[-*\d.)]+\s*/, "").trim())
		.filter(Boolean);
}

export interface CurriculumModule {
	title: string;
	lessons: string[];
}

export function curriculumOf(course: Pick<Course, "curriculum">): CurriculumModule[] {
	return (course.curriculum ?? [])
		.filter((m) => m && typeof m.module === "string" && m.module.trim())
		.map((m) => ({ title: m.module.trim(), lessons: lessonsOf(m.lessons) }));
}

export function lessonCount(course: Pick<Course, "curriculum">): number {
	return curriculumOf(course).reduce((sum, m) => sum + m.lessons.length, 0);
}

export function plural(n: number, one: string, many = `${one}s`): string {
	return `${n} ${n === 1 ? one : many}`;
}

/** Only allow http(s) links to leave the site; anything else is ignored. */
export function externalCourseUrl(value: string | null | undefined): string | null {
	if (!value) return null;
	try {
		const url = new URL(value);
		return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
	} catch {
		return null;
	}
}

export function initials(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
}
