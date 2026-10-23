import { env } from 'cloudflare:workers';
import type { ErpAccounting } from './accounting-durable.js';
import captured from 'virtual:erp-mini/accounting-settings';
import { accountingSource as createSource } from './accounting-source.js';

/** Only a validated namespace, never a Node fallback or caller-supplied ledger name. */
function accountingNamespace() {
  if (captured.currency !== 'VND' || !('ERP_CURRENCY' in env) || env.ERP_CURRENCY !== 'VND') {
    throw new Error('Accounting requires the captured VND Worker installation.');
  }
  if (!('ERP_ACCOUNTING' in env) || env.ERP_ACCOUNTING === null || typeof env.ERP_ACCOUNTING !== 'object' ||
      !('getByName' in env.ERP_ACCOUNTING) || typeof env.ERP_ACCOUNTING.getByName !== 'function') {
    throw new Error('The installation-owned ERP_ACCOUNTING SQLite Durable Object binding is required.');
  }
  // RPC methods cannot be inspected without contacting the platform. The binding is
  // validated above; the generic supplies the exported class contract, not a public input.
  const namespace = env.ERP_ACCOUNTING as DurableObjectNamespace<ErpAccounting>;
  return namespace;
}

export function accountingLedger() {
  return accountingNamespace().getByName('ledger');
}

export async function accountingSource(actorId: string) {
  accountingNamespace();
  return createSource(actorId);
}
