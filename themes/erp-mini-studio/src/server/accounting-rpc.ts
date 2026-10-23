import { ErpError, validateAccountingActionInput, type ErpAccountingSource, type SourceCustomerSnapshot } from '@zerohost/plugin-erp-mini/accounting';


function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Input has already been strictly validated, but retain a typed boundary for both transports. */
export function customerLink(input: unknown): { customerId: string; customerRevision: string } {
  if (!record(input) || typeof input.customerId !== 'string' || typeof input.customerRevision !== 'string') {
    throw new ErpError('INVALID_INPUT', 'A customer id and revision are required.');
  }
  return { customerId: input.customerId, customerRevision: input.customerRevision };
}

export async function resolveSourceCustomer(action: string, input: unknown, source: ErpAccountingSource): Promise<SourceCustomerSnapshot | undefined> {
  if (action !== 'link-customer') return undefined;
  const link = customerLink(input);
  return source.customer(link.customerId, link.customerRevision);
}

/** Only the host calls RPC; a public action schema cannot carry this out-of-band snapshot. */
export function snapshotSource(action: string, input: unknown, snapshot: unknown, currency: unknown): ErpAccountingSource | undefined {
  if (action !== 'link-customer') {
    if (snapshot !== undefined) throw new ErpError('INVALID_INPUT', 'This action does not accept a CRM snapshot.');
    return undefined;
  }
  const link = customerLink(input);
  if (!record(snapshot) || Object.keys(snapshot).length !== 5 ||
      snapshot.sourceKind !== 'customer' || snapshot.sourceId !== link.customerId ||
      snapshot.sourceRevision !== link.customerRevision || typeof snapshot.code !== 'string' || typeof snapshot.name !== 'string') {
    throw new ErpError('CONFLICT', 'The trusted CRM snapshot does not match the requested customer revision.');
  }
  // Reuse the business schema for name/code bounds rather than inventing an RPC convention.
  validateAccountingActionInput('save-party', {
    id: link.customerId, revision: null, kind: 'customer', code: snapshot.code, name: snapshot.name, active: true,
  });
  const validated: SourceCustomerSnapshot = {
    code: snapshot.code, name: snapshot.name, sourceKind: 'customer',
    sourceId: link.customerId, sourceRevision: link.customerRevision,
  };
  return {
    // The native host already checked persisted CRM currency before the RPC.
    async checkCurrency() {
      if (currency !== 'VND') throw new ErpError('CURRENCY_MISMATCH', 'Accounting requires a VND installation.');
    },
    async customer(id, revision) {
      if (id !== validated.sourceId || revision !== validated.sourceRevision) {
        throw new ErpError('CONFLICT', 'The CRM snapshot changed before linking.');
      }
      return validated;
    },
  };
}
