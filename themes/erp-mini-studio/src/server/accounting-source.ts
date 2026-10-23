import { PluginStorageRepository } from 'emdash';
import { getDb } from 'emdash/runtime';
import { createErpAccountingSource, type ErpAccountingSource } from '@zerohost/plugin-erp-mini/accounting';
import captured from 'virtual:erp-mini/accounting-settings';

/** The guarded host resolves CRM records; the Durable Object never accepts public snapshots. */
export async function accountingSource(actorId: string): Promise<ErpAccountingSource> {
  const db = await getDb();
  return createErpAccountingSource({
    settings: new PluginStorageRepository(db, 'erp-mini', 'settings', []),
    customers: new PluginStorageRepository(db, 'erp-mini', 'customers', ['nameKey', 'active', ['active', 'nameKey']]),
    items: new PluginStorageRepository(db, 'erp-mini', 'items', ['nameKey', 'active', ['active', 'nameKey']]),
    sales: new PluginStorageRepository(db, 'erp-mini', 'sales', ['hasOrder']),
  }, actorId, captured.currency);
}
