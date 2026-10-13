import assert from 'node:assert/strict';
import test from 'node:test';
import { cloudflareAccountingIntegration } from '../scripts/accounting-cloudflare-integration.mjs';


test('Build-time settings reject invalid currency or noncanonical origin', () => {
  for (const origin of ['https://erp.example.invalid/', 'https://erp.example.invalid/path', 'https://erp.example.invalid?x=1', 'http://erp.example.invalid']) {
    assert.throws(() => cloudflareAccountingIntegration({ currency: 'VND', origin }));
  }
  assert.throws(() => cloudflareAccountingIntegration({ currency: 'BTC', origin: 'https://erp.example.invalid' }));
});
