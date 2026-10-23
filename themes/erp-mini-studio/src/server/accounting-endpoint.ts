import { AccountingService, executeAccountingAction } from '@zerohost/plugin-erp-mini/accounting';
import captured from 'virtual:erp-mini/accounting-settings';
import { accountingSource, accountingStore } from './accounting-resources.js';
import { createAccountingEndpoint } from './accounting-transport.js';

export const prerender = false;
export const ALL = createAccountingEndpoint({
  origin: captured.origin,
  unavailableMessage: 'Accounting is unavailable. Verify the captured Node settings and restart the paired Node host to initialize or verify its accounting schema before retrying.',
  source: accountingSource,
  execute: async (action, input, actorId, source) =>
    executeAccountingAction(new AccountingService(accountingStore(), actorId), action, input, source),
});
