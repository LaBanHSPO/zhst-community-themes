import { PluginStorageRepository } from 'emdash';
import { getDb } from 'emdash/runtime';
import { createErpAccountingSource, type AccountingStore } from '@zerohost/plugin-erp-mini/accounting';
import { openAccountingDatabase } from '@zerohost/plugin-erp-mini/accounting-node';
import captured from 'virtual:erp-mini/accounting-settings';
import { readAccountingTarget } from '../../scripts/accounting-settings.mjs';

let connection: AccountingStore | undefined;

function target() {
  const manifest = import.meta.env.DEV ? '.astro/accounting-settings.json' : 'dist/accounting-settings.json';
  const result = readAccountingTarget(manifest, { captured });
  if (result.settings.currency !== 'VND') throw new Error('Accounting requires a VND Node installation.');
  return result;
}

/** Called only after the endpoint has authenticated and guarded the request. */
export async function accountingSource(actorId: string) {
  target();
  const db = await getDb();
  return createErpAccountingSource({
    settings: new PluginStorageRepository(db, 'erp-mini', 'settings', []),
    customers: new PluginStorageRepository(db, 'erp-mini', 'customers', ['nameKey', 'active', ['active', 'nameKey']]),
    items: new PluginStorageRepository(db, 'erp-mini', 'items', ['nameKey', 'active', ['active', 'nameKey']]),
    sales: new PluginStorageRepository(db, 'erp-mini', 'sales', ['hasOrder']),
  }, actorId, captured.currency);
}

/** Caller must finish the injected CRM currency check before accessing SQLite. */
export function accountingStore(): AccountingStore {
  const { databasePath } = target();
  if (!connection) {
    try {
      connection = openAccountingDatabase(databasePath);
    } catch (cause) {
      // Driver/schema prerequisites are transport failures, not successful domain reads.
      throw new Error('Accounting schema is unavailable. Restart the paired Node host to initialize or verify it.', { cause });
    }
  }
  return connection;
}
export function closeAccountingResources(): void {
  const current = connection;
  connection = undefined;
  current?.close();
}

const shutdown = () => closeAccountingResources();
const interrupt = () => {
  closeAccountingResources();
  if (process.listenerCount('SIGINT') === 0) process.kill(process.pid, 'SIGINT');
};
const terminate = () => {
  closeAccountingResources();
  if (process.listenerCount('SIGTERM') === 0) process.kill(process.pid, 'SIGTERM');
};
process.once('exit', shutdown);
process.once('SIGINT', interrupt);
process.once('SIGTERM', terminate);
import.meta.hot?.dispose(() => {
  closeAccountingResources();
  process.off('exit', shutdown);
  process.off('SIGINT', interrupt);
  process.off('SIGTERM', terminate);
});
