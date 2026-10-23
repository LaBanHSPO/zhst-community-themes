/**
 * Appointment inquiry form, backed by the official EmDash Forms plugin (`@emdash-cms/plugin-forms`).
 *
 * The theme renders its own server-side form (so the service list can come from the live `services`
 * collection and the page works without JavaScript) and forwards a validated submission to the
 * plugin's public `submit` route through EmDash's supported SSR dispatcher
 * (`getPublicPluginApiRouteHandler` from `emdash/plugin-utils`). The plugin stores the submission in
 * its own private storage; admins read it under Plugins → Forms → Submissions. Nothing here is ever
 * rendered on a public route, and nothing is logged.
 */
import { getPublicPluginApiRouteHandler, type PublicPluginRuntimeLocals } from "emdash/plugin-utils";

/** Slug of the Forms-plugin form this theme submits to (see `seed/inquiry-form.json`). */
export const INQUIRY_FORM_SLUG = "appointment-inquiry";
const PLUGIN_ID = "emdash-forms";

/** Field limits. They match `seed/inquiry-form.json`, so the plugin enforces the same rules. */
export const LIMITS = {
	name: 120,
	email: 254,
	service: 120,
	preferredTime: 120,
	message: 2000,
} as const;

/** Reject request bodies larger than this before parsing (the fields above fit easily). */
export const MAX_BODY_BYTES = 16 * 1024;

export const SUCCESS_MESSAGE = "We received your inquiry. This is not a confirmed appointment.";

export type InquiryField = "name" | "email" | "service" | "preferredTime" | "message" | "consent";

export interface InquiryValues {
	name: string;
	email: string;
	service: string;
	preferredTime: string;
	message: string;
	consent: boolean;
}

export type InquiryErrors = Partial<Record<InquiryField | "form", string>>;

export const EMPTY_VALUES: InquiryValues = {
	name: "",
	email: "",
	service: "",
	preferredTime: "",
	message: "",
	consent: false,
};

/** Plugin field name for each theme field. */
const PLUGIN_FIELD: Record<InquiryField, string> = {
	name: "name",
	email: "email",
	service: "service",
	preferredTime: "preferred_time",
	message: "message",
	consent: "consent",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(form: FormData, key: string): string {
	const value = form.get(key);
	return typeof value === "string" ? value.trim() : "";
}

/** Read and validate a posted inquiry. `serviceNames` are the services a visitor may choose. */
export function parseInquiry(
	form: FormData,
	serviceNames: string[],
): { values: InquiryValues; errors: InquiryErrors; honeypot: string } {
	const values: InquiryValues = {
		name: text(form, "name"),
		email: text(form, "email"),
		service: text(form, "service"),
		preferredTime: text(form, "preferred_time"),
		message: text(form, "message"),
		consent: form.get("consent") === "yes",
	};
	const errors: InquiryErrors = {};

	if (!values.name) errors.name = "Enter your name.";
	else if (values.name.length > LIMITS.name) errors.name = `Use ${LIMITS.name} characters or fewer.`;

	if (!values.email) errors.email = "Enter your email address.";
	else if (values.email.length > LIMITS.email || !EMAIL_RE.test(values.email))
		errors.email = "Enter an email address like name@example.com.";

	if (values.service && !serviceNames.includes(values.service)) {
		errors.service = "Choose a service from the list.";
		values.service = "";
	}

	if (values.preferredTime.length > LIMITS.preferredTime)
		errors.preferredTime = `Use ${LIMITS.preferredTime} characters or fewer.`;

	if (!values.message) errors.message = "Tell us briefly what you would like help with.";
	else if (values.message.length > LIMITS.message)
		errors.message = `Use ${LIMITS.message} characters or fewer (you used ${values.message.length}).`;

	if (!values.consent) errors.consent = "Confirm that we may store your inquiry to reply to you.";

	return { values, errors, honeypot: text(form, "website") };
}

interface PluginEnvelope {
	success?: boolean;
	data?: unknown;
	error?: { code?: string; message?: string };
}

function dispatcher(locals: unknown) {
	return getPublicPluginApiRouteHandler(locals as PublicPluginRuntimeLocals);
}

function jsonRequest(base: URL, path: string, body: unknown): Request {
	return new Request(new URL(`/_emdash/api/plugins/${PLUGIN_ID}${path}`, base), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}

/** True when the Forms plugin is active and the inquiry form exists and accepts submissions. */
export async function isInquiryFormActive(locals: unknown, base: URL): Promise<boolean> {
	const handle = dispatcher(locals);
	if (!handle) return false;
	try {
		const result = (await handle(
			PLUGIN_ID,
			"POST",
			"/definition",
			jsonRequest(base, "/definition", { id: INQUIRY_FORM_SLUG }),
		)) as PluginEnvelope;
		const data = result?.data as { status?: string } | undefined;
		return result?.success === true && data?.status === "active";
	} catch {
		return false;
	}
}

const FIELD_BY_PLUGIN_NAME = new Map<string, InquiryField>(
	(Object.entries(PLUGIN_FIELD) as [InquiryField, string][]).map(([field, name]) => [name, field]),
);

/**
 * Forward a validated inquiry to the Forms plugin. Returns field errors reported by the plugin, a
 * form-level error, or `{ ok: true }`. The honeypot value is passed as the plugin's `_hp` field, so a
 * filled honeypot gets the plugin's silent success and nothing is stored.
 */
export async function submitInquiry(
	locals: unknown,
	base: URL,
	values: InquiryValues,
	honeypot: string,
): Promise<{ ok: true } | { ok: false; errors: InquiryErrors }> {
	const unavailable = {
		ok: false as const,
		errors: { form: "Online inquiries are not available right now. Please contact us another way." },
	};
	const handle = dispatcher(locals);
	if (!handle) return unavailable;

	const data: Record<string, unknown> = {
		name: values.name,
		email: values.email,
		message: values.message,
		consent: "true",
	};
	if (values.service) data.service = values.service;
	if (values.preferredTime) data.preferred_time = values.preferredTime;
	if (honeypot) data._hp = honeypot;

	let result: PluginEnvelope;
	try {
		result = (await handle(
			PLUGIN_ID,
			"POST",
			"/submit",
			jsonRequest(base, "/submit", { formId: INQUIRY_FORM_SLUG, data }),
		)) as PluginEnvelope;
	} catch {
		return unavailable;
	}

	if (result?.success !== true) return unavailable;
	const outcome = result.data as { success?: boolean; errors?: { field: string; message: string }[] };
	if (outcome?.success === true) return { ok: true };

	const errors: InquiryErrors = {};
	for (const item of outcome?.errors ?? []) {
		const field = FIELD_BY_PLUGIN_NAME.get(item.field);
		errors[field ?? "form"] = item.message;
	}
	if (Object.keys(errors).length === 0) errors.form = "Please check the form and try again.";
	return { ok: false, errors };
}
