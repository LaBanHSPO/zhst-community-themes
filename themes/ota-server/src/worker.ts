/**
 * Cloudflare Worker entry.
 *
 * Keeps EmDash's own fetch/scheduled handlers and adds the OTA retention sweep.
 * Because every push also sweeps expired builds, the cron exists for hosts that
 * stop pushing: without it, a channel that goes quiet would keep its last build
 * (and its storage) forever.
 */

import handler, { createScheduledHandler } from "@emdash-cms/cloudflare/worker";
import {
	OtaService,
	parseKeyMaterial,
	resolveBlobStore,
	resolveMaxBundleBytes,
} from "@zerohost/plugin-ota-server/server";
import { otaRuntime } from "./server/resources.js";

const emdashScheduled = createScheduledHandler();

async function sweepExpired(): Promise<void> {
	const runtime = otaRuntime();
	const key = parseKeyMaterial(runtime.secretKey ?? null);
	let service!: OtaService;
	service = new OtaService({
		db: runtime.db,
		actor: null,
		secretKey: key,
		platformAvailable: runtime.platform !== null && runtime.platform !== undefined,
		blobs: async () =>
			resolveBlobStore({
				settings: await service.getStorageSettings(),
				platform: runtime.platform ?? null,
				key,
			}),
		maxBundleBytes: resolveMaxBundleBytes(runtime.maxBundleBytes),
		...(runtime.retentionDays === undefined ? {} : { retentionDays: runtime.retentionDays }),
	});
	const removed = await service.purgeExpired();
	if (removed > 0) console.log(`[ota] expired ${removed} build(s) in the scheduled sweep`);
}

export default {
	...handler,
	async scheduled(controller: ScheduledController, env: Env, context: ExecutionContext) {
		const results = await Promise.allSettled([emdashScheduled(controller, env, context), sweepExpired()]);
		for (const result of results) {
			if (result.status === "rejected") {
				console.error("[ota] scheduled work failed", {
					errorType: result.reason instanceof Error ? result.reason.name : "unknown",
				});
			}
		}
	},
};
