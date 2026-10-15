import assert from 'node:assert/strict';
import test from 'node:test';
import type { APIContext } from 'astro';
import { ErpError } from '@zerohost/plugin-erp-mini/accounting';
import { createAccountingEndpoint } from '../src/server/accounting-transport.ts';

const origin = 'https://accounting.example.invalid';
function fixture(options: {
  action?: string; method?: string; body?: string; headers?: Record<string, string>;
  anonymous?: boolean; disabled?: boolean; role?: number; pluginDisabled?: boolean;
  token?: boolean; query?: string; unavailable?: boolean; currencyMismatch?: boolean;
} = {}) {
  const calls: string[] = [];
  const action = options.action ?? 'configure-book';
  const method = options.method ?? 'POST';
  const request = new Request(`${origin}/api/erp-mini/accounting/${action}${options.query ?? ''}`, {
    method,
    headers: { 'X-EmDash-Request': '1', Origin: origin, 'Content-Type': 'application/json', ...options.headers },
    ...(method === 'POST' ? { body: options.body ?? JSON.stringify({ startDate: '2026-01-01' }) } : {}),
  });
  // Only locals/request/params/url are observed. No synthetic fixture bypass enters production code.
  const context = {
    request, url: new URL(request.url), params: { action },
    locals: {
      user: options.anonymous ? undefined : { id: 'native-session-user', role: options.role ?? 100, disabled: options.disabled ?? false },
      emdash: { getPluginRouteMeta: () => options.pluginDisabled ? undefined : { method: 'GET' } },
      ...(options.token ? { tokenId: 'not-an-accounting-session' } : {}),
    },
  } as APIContext;
  const endpoint = createAccountingEndpoint({
    origin, unavailableMessage: 'Explicit operator migration is required.',
    async source(actorId) {
      calls.push(`source:${actorId}`);
      if (options.unavailable) throw new Error('schema absent');
      return {
        async checkCurrency() {
          calls.push('currency');
          if (options.currencyMismatch) throw new ErpError('CURRENCY_MISMATCH', 'Saved USD cannot become VND.');
        },
        async customer() { throw new Error('Not used by this fixture.'); },
      };
    },
    async execute(action, _input, actorId) {
      calls.push(`execute:${action}:${actorId}`);
      return { ok: true, data: { configured: true } };
    },
  });
  return { endpoint, context, calls };
}

for (const [name, options, status] of [
  ['anonymous', { anonymous: true }, 401],
  ['disabled native user', { disabled: true }, 401],
  ['bearer authorization', { headers: { Authorization: 'Bearer rejected' } }, 401],
  ['token locals', { token: true }, 401],
  ['insufficient permission', { role: 0 }, 403],
  ['disabled plugin', { pluginDisabled: true }, 404],
  ['unknown action', { action: 'migrate' }, 404],
  ['restore is not public', { action: 'restore' }, 404],
  ['wrong method', { method: 'GET' }, 405],
  ['missing request header', { headers: { 'X-EmDash-Request': '' } }, 403],
  ['foreign origin', { headers: { Origin: 'https://foreign.example.invalid' } }, 403],
  ['missing post origin', { headers: { Origin: '' } }, 403],
  ['query input', { query: '?actorId=forged' }, 400],
  ['wrong content type', { headers: { 'Content-Type': 'text/plain' } }, 415],
  ['malformed JSON', { body: '{' }, 400],
  ['oversize body', { body: 'x'.repeat(4097) }, 413],
  ['oversize declared length', { headers: { 'Content-Length': '4097' } }, 413],
  ['invalid length', { headers: { 'Content-Length': '-1' } }, 400],
] as const) {
  test(`Shared guard denies ${name} before resources`, async () => {
    const { endpoint, context, calls } = fixture(options);
    const result = await endpoint(context);
    assert.equal(result.status, status);
    assert.equal(result.headers.get('Cache-Control'), 'private, no-store');
    assert.deepEqual(calls, []);
  });
}

test('Native user and currency are guarded before executor', async () => {
  const { endpoint, context, calls } = fixture();
  const result = await endpoint(context);
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { success: true, data: { ok: true, data: { configured: true } } });
  assert.deepEqual(calls, ['source:native-session-user', 'currency', 'execute:configure-book:native-session-user']);
});

test('Strict schema rejects public actor and snapshot before CRM access', async () => {
  for (const extra of [{ actorId: 'forged' }, { sourceCustomer: { name: 'forged' } }]) {
    const { endpoint, context, calls } = fixture({ body: JSON.stringify({ startDate: '2026-01-01', ...extra }) });
    const result = await endpoint(context);
    const payload = await result.json();
    assert.equal(payload.data.error.code, 'INVALID_INPUT');
    assert.deepEqual(calls, []);
  }
});

test('Saved currency mismatch never executes a ledger operation', async () => {
  const { endpoint, context, calls } = fixture({ currencyMismatch: true });
  const result = await endpoint(context);
  assert.equal((await result.json()).data.error.code, 'CURRENCY_MISMATCH');
  assert.deepEqual(calls, ['source:native-session-user', 'currency']);
});

test('Missing schema/binding is a truthful transport prerequisite', async () => {
  const { endpoint, context, calls } = fixture({ unavailable: true });
  const result = await endpoint(context);
  assert.equal(result.status, 503);
  assert.deepEqual(await result.json(), { success: false, error: { code: 'ACCOUNTING_UNAVAILABLE', message: 'Explicit operator migration is required.' } });
  assert.deepEqual(calls, ['source:native-session-user']);
});
