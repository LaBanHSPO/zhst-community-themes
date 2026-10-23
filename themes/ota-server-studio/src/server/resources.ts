/**
 * Builds the plugin runtime for this host.
 *
 * The OTA metadata database is either its own D1 database (`OTA_DB`, what the
 * committed `wrangler.jsonc` provisions) or, on a host that cannot add a
 * binding, the EmDash database (`DB`) after applying the plugin migration to it
 * manually. The theme's README documents both paths.
 */

import { env } from "cloudflare:workers";
import { R2Storage } from "@emdash-cms/cloudflare/storage/r2";
import type { OtaRuntime, PlatformStorage } from "@zerohost/plugin-ota-server/server";

/** Only `emdash.storage` is read from request locals. */
export interface OtaLocals {
	emdash?: { storage?: unknown };
}

function optionalString(source: Record<string, unknown>, name: string): string | null {
	const value = source[name];
	return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function optionalPositiveInt(source: Record<string, unknown>, name: string): number | undefined {
	const value = source[name];
	if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return value;
	if (typeof value === "string" && /^\d+$/.test(value.trim())) {
		const parsed = Number(value.trim());
		if (Number.isSafeInteger(parsed) && parsed > 0) return parsed;
	}
	return undefined;
}

/**
 * `locals.emdash.storage` is the site storage adapter that EmDash configured
 * (the ZeroHostCMS storage plan). A scheduled sweep has no request, so it falls
 * back to the same adapter built directly from the `MEDIA` binding.
 */
export function otaRuntime(locals: OtaLocals = {}): OtaRuntime {
	const bindings = env as unknown as Record<string, unknown>;
	const maxBundleBytes = optionalPositiveInt(bindings, "OTA_MAX_BUNDLE_BYTES");
	const retentionDays = optionalPositiveInt(bindings, "OTA_RETENTION_DAYS");
	// The host types `locals.emdash.storage` loosely, so the adapter is narrowed
	// here; it is the same adapter `emdash.storage` callers receive.
	const siteStorage = locals.emdash?.storage as PlatformStorage | undefined;
	const platform =
		siteStorage ?? (env.MEDIA ? new R2Storage(env.MEDIA, optionalString(bindings, "OTA_PUBLIC_URL") ?? undefined) : null);
	return {
		db: env.OTA_DB ?? env.DB,
		platform,
		secretKey: optionalString(bindings, "OTA_SECRET_KEY"),
		baseUrl: optionalString(bindings, "OTA_SITE_URL") ?? "",
		...(maxBundleBytes === undefined ? {} : { maxBundleBytes }),
		...(retentionDays === undefined ? {} : { retentionDays }),
	};
}
