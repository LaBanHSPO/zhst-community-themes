/// <reference types="@cloudflare/workers-types" />
import { DurableObject } from 'cloudflare:workers';
import {
  AccountingService, ErpError, executeAccountingAction, validateAccountingActionInput,
  type ApiResult, type SourceCustomerSnapshot, type AccountingStore,
} from '@zerohost/plugin-erp-mini/accounting';
import {
  openDurableAccountingStore, migrateDurableAccountingStore, durableAccountingSchemaStatus,
} from '@zerohost/plugin-erp-mini/accounting-cloudflare';
import { snapshotSource } from './accounting-rpc.js';

/** One ledger per installation-owned Worker namespace, not a caller-selected tenant. */
export class ErpAccounting extends DurableObject<unknown> {
  private store?: AccountingStore;
  private installationCurrency(): 'VND' {
    if (this.env === null || typeof this.env !== 'object' || !('ERP_CURRENCY' in this.env) || this.env.ERP_CURRENCY !== 'VND') {
      throw new ErpError('CURRENCY_MISMATCH', 'Accounting requires a VND installation. Existing CRM currency must not be reinterpreted.');
    }
    return 'VND';
  }

  // Inherited constructor intentionally does not open, verify or migrate the schema.
  async execute(action: string, input: unknown, actorId: string, sourceCustomer?: SourceCustomerSnapshot): Promise<ApiResult<unknown>> {
    try {
      const currency = this.installationCurrency();
      if (this.env !== null && typeof this.env === 'object' &&
          'ERP_ACCOUNTING_MAINTENANCE' in this.env && this.env.ERP_ACCOUNTING_MAINTENANCE === 'true' &&
          !['info', 'list', 'get', 'report', 'account-templates', 'account-template', 'preview-account-import', 'hkd-info', 'hkd-list', 'hkd-report'].includes(action)) {
        throw new ErpError('ACCOUNTING_MAINTENANCE', 'Accounting writes are paused for operator maintenance. Authenticated reads remain available for recovery verification.');
      }
      if (typeof actorId !== 'string' || !actorId.trim() || actorId.length > 2048) {
        throw new ErpError('AUTH_REQUIRED', 'An authenticated EmDash administrator is required.');
      }
      const validated = validateAccountingActionInput(action, input);
      const source = snapshotSource(action, validated, sourceCustomer, currency);
      // Schema absence/drift must escape as a transport prerequisite, before service dispatch.
      const store = this.store ??= openDurableAccountingStore(this.ctx.storage);
      return await executeAccountingAction(new AccountingService(store, actorId), action, validated, source);
    } catch (error) {
      if (error instanceof ErpError && error.code !== 'SCHEMA_VERSION') {
        return { ok: false, error: { code: error.code, message: error.message } };
      }
      throw new Error('Accounting schema is unavailable. Use the explicit signed operator migration and verify schema status before retrying.', { cause: error });
    }
  }

  /** These maintenance RPCs are reachable only through the host's signed operator transport. */
  migrate(): void {
    this.installationCurrency();
    migrateDurableAccountingStore(this.ctx.storage);
    this.store = undefined;
  }

  schemaStatus() {
    this.installationCurrency();
    return durableAccountingSchemaStatus(this.ctx.storage);
  }

  async recoveryBookmark(): Promise<string> {
    this.installationCurrency();
    try {
      return await this.ctx.storage.getCurrentBookmark();
    } catch (cause) {
      throw new Error('The accounting recovery bookmark could not be recorded.', { cause });
    }
  }

  async restore(bookmark: string): Promise<never> {
    this.installationCurrency();
    if (this.env === null || typeof this.env !== 'object' ||
        !('ERP_ACCOUNTING_MAINTENANCE' in this.env) || this.env.ERP_ACCOUNTING_MAINTENANCE !== 'true') {
      throw new ErpError('FORBIDDEN', 'Pause accounting in the Worker maintenance configuration before restoration.');
    }
    if (typeof bookmark !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{8}-[a-f0-9]{8}-[a-f0-9]{32}$/i.test(bookmark)) {
      throw new ErpError('INVALID_INPUT', 'Supply a valid accounting PITR bookmark.');
    }
    try {
      await this.ctx.storage.onNextSessionRestoreBookmark(bookmark);
    } catch (cause) {
      throw new Error('The accounting PITR restore could not be scheduled.', { cause });
    }
    // abort intentionally terminates this RPC. Operators must verify the next session;
    // scheduling restoration is not a successful restored-ledger response.
    this.ctx.abort('Accounting PITR restore scheduled; verify the next Durable Object session.');
    throw new Error('Accounting PITR restoration is pending next-session verification.');
  }
}
