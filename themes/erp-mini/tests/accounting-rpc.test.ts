import assert from 'node:assert/strict';
import test from 'node:test';
import { validateAccountingActionInput, type ErpAccountingSource } from '@zerohost/plugin-erp-mini/accounting';
import { resolveSourceCustomer, snapshotSource } from '../src/server/accounting-rpc.ts';

const customerId = '11111111-1111-4111-8111-111111111111';
const input = validateAccountingActionInput('link-customer', {
  id: '22222222-2222-4222-8222-222222222222', revision: null, customerId, customerRevision: 'crm-revision-1',
});
const snapshot = { code: 'SYNTHETIC-1', name: 'Synthetic customer', sourceKind: 'customer' as const, sourceId: customerId, sourceRevision: 'crm-revision-1' };

test('Host resolves customer snapshot from guarded repository interface', async () => {
  const calls: string[] = [];
  const source: ErpAccountingSource = {
    async checkCurrency() { throw new Error('The transport must already have checked currency.'); },
    async customer(id, revision) {
      calls.push(`${id}:${revision}`);
      return snapshot;
    },
  };
  assert.deepEqual(await resolveSourceCustomer('link-customer', input, source), snapshot);
  assert.deepEqual(calls, [`${customerId}:crm-revision-1`]);
  assert.equal(await resolveSourceCustomer('info', undefined, source), undefined);
});

test('RPC accepts only matching id/revision and bounded trusted snapshot fields', async () => {
  const source = snapshotSource('link-customer', input, snapshot, 'VND');
  assert.ok(source);
  await source.checkCurrency(false);
  assert.deepEqual(await source.customer(customerId, 'crm-revision-1'), snapshot);
  await assert.rejects(source.customer(customerId, 'stale-revision'), { code: 'CONFLICT' });
  for (const invalid of [
    undefined, { ...snapshot, sourceId: '33333333-3333-4333-8333-333333333333' },
    { ...snapshot, sourceRevision: 'stale' }, { ...snapshot, actorId: 'forged' },
    { ...snapshot, sourceKind: 'supplier' }, { ...snapshot, name: 'x'.repeat(201) },
    { ...snapshot, code: '' },
  ]) {
    assert.throws(() => snapshotSource('link-customer', input, invalid, 'VND'));
  }
});

test('Snapshots cannot be smuggled into unrelated RPC actions', () => {
  assert.equal(snapshotSource('info', undefined, undefined, 'VND'), undefined);
  assert.throws(() => snapshotSource('info', undefined, snapshot, 'VND'), { code: 'INVALID_INPUT' });
});

test('Snapshot source does not reinterpret USD currency', async () => {
  const source = snapshotSource('link-customer', input, snapshot, 'USD');
  assert.ok(source);
  await assert.rejects(source.checkCurrency(false), { code: 'CURRENCY_MISMATCH' });
});
