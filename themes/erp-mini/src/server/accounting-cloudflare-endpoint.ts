import captured from 'virtual:erp-mini/accounting-settings';
import { accountingLedger, accountingSource } from './accounting-cloudflare-resources.js';
import { resolveSourceCustomer } from './accounting-rpc.js';
import { createAccountingEndpoint } from './accounting-transport.js';

export const prerender = false;
export const ALL = createAccountingEndpoint({
  origin: captured.origin,
  unavailableMessage: 'Accounting is unavailable. Verify the VND Worker ERP_ACCOUNTING SQLite binding and run the explicit signed operator schema migration before retrying.',
  source: accountingSource,
  async execute(action, input, actorId, source) {
    const snapshot = await resolveSourceCustomer(action, input, source);
    return accountingLedger().execute(action, input, actorId, snapshot);
  },
});
