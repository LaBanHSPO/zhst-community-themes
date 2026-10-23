import assert from 'node:assert/strict';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: {
  url: { type: 'string' }, currency: { type: 'string' },
} });
const origin = new URL(values.url ?? '');
if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname) || origin.protocol !== 'http:' ||
    origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
  throw new Error('Use the actual local workerd HTTP origin; this smoke never accesses remote/customer resources.');
}
if (!['VND', 'USD'].includes(values.currency)) throw new Error('Choose --currency VND or USD to match the built local Worker.');

try {
  const response = await fetch(`${origin.origin}/api/erp-mini/accounting/info`, {
    headers: { 'X-EmDash-Request': '1' }, redirect: 'manual', signal: AbortSignal.timeout(10_000),
  });
  assert.equal(response.status, values.currency === 'VND' ? 401 : 404);
  if (values.currency === 'VND') {
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
    const payload = await response.json();
    assert.equal(payload.success, false);
    assert.equal(payload.error.code, 'AUTH_REQUIRED');
  } else {
    await response.text();
  }
  console.log(`PASS: actual local ${values.currency} Worker Accounting ${values.currency === 'VND' ? 'native-session guard 401' : 'route exclusion 404'}.`);
} catch (cause) {
  throw new Error('Cloudflare Accounting compatibility smoke failed. No deployment or migration was attempted.', { cause });
}
