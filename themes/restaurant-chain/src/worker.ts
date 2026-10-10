import handler, { createScheduledHandler } from "@emdash-cms/cloudflare/worker";
import { dispatchOutbox, processJobs, recoverJobs } from "@zerohost/plugin-restaurant-chain/server";
import { restaurantResources } from "./server/resources.js";

const emdashScheduled = createScheduledHandler();

export default {
	...handler,
	async scheduled(controller: ScheduledController, env: Env, context: ExecutionContext) {
		const results = await Promise.allSettled([
			emdashScheduled(controller, env, context),
			(async () => {
				const resources = restaurantResources();
				await recoverJobs(resources);
				await dispatchOutbox(resources);
			})(),
		]);
		for (const result of results) {
			if (result.status === "rejected") {
				console.error("[restaurant] scheduled recovery failed");
				throw new Error("Scheduled recovery did not complete.");
			}
		}
	},
	async queue(batch: MessageBatch<{ id: string }>) {
		await processJobs(batch, restaurantResources());
	},
};
