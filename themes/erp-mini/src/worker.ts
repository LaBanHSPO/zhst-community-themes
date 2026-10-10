import handler, { createScheduledHandler } from "@emdash-cms/cloudflare/worker";

// Native ERP plugin only: no Worker Loader or sandbox bridge binding is required.
export default {
  ...handler,
  scheduled: createScheduledHandler(),
};
