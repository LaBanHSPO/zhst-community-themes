import assert from 'node:assert/strict';
import test from 'node:test';
import { cloudflareAccountingIntegration } from '../scripts/accounting-cloudflare-integration.mjs';

function setup(currency, enabled) {
  const routes = [];
  const configs = [];
  const integration = cloudflareAccountingIntegration({ currency, origin: 'https://erp.example.invalid', ...(enabled === undefined ? {} : { enabled }) });
  integration.hooks['astro:config:setup']({ injectRoute: (route) => routes.push(route), updateConfig: (config) => configs.push(config) });
  return { routes, configs };
}

test('VND injects actual guarded Cloudflare route and no Node settings graph', () => {
  const { routes, configs } = setup('VND');
  assert.equal(routes.length, 1);
  assert.equal(routes[0].pattern, '/api/erp-mini/accounting/[action]');
  assert.match(routes[0].entrypoint, /accounting-cloudflare-endpoint\.ts$/);
  assert.equal(routes[0].prerender, false);
  const plugin = configs[0].vite.plugins[0];
  const id = plugin.resolveId('virtual:erp-mini/accounting-settings');
  const code = plugin.load(id);
  assert.match(code, /"currency":"VND"/);
  assert.doesNotMatch(code, /dataDirectory|accounting-node|node:fs/);
});

test('USD and disabled VND exclude Accounting route', () => {
  assert.deepEqual(setup('USD').routes, []);
  assert.deepEqual(setup('VND', false).routes, []);
  assert.throws(() => setup('USD', true), /only for a VND installation/);
});

test('Build-time settings reject invalid currency or noncanonical origin', () => {
  for (const origin of ['https://erp.example.invalid/', 'https://erp.example.invalid/path', 'https://erp.example.invalid?x=1', 'http://erp.example.invalid']) {
    assert.throws(() => cloudflareAccountingIntegration({ currency: 'VND', origin }));
  }
  assert.throws(() => cloudflareAccountingIntegration({ currency: 'BTC', origin: 'https://erp.example.invalid' }));
});
