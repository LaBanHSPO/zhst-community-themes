import { fileURLToPath } from 'node:url';

const virtualId = 'virtual:erp-mini/accounting-settings';
const resolvedId = `\0${virtualId}`;
const endpoint = fileURLToPath(new URL('../src/server/accounting-cloudflare-endpoint.ts', import.meta.url));

/** Build-time wiring only; never migrates, opens storage or imports the Node driver. */
export function cloudflareAccountingIntegration({ currency, origin, enabled = currency === 'VND' }) {
  if (!['USD', 'EUR', 'GBP', 'VND', 'JPY'].includes(currency)) throw new Error('A supported installation currency is required.');
  const url = new URL(origin);
  if (url.origin !== origin || url.username || url.password ||
      (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))) {
    throw new Error('Accounting requires the canonical installation origin.');
  }
  if (typeof enabled !== 'boolean' || (enabled && currency !== 'VND')) {
    throw new Error('Cloudflare Accounting is available only for a VND installation.');
  }
  const settings = { version: 1, currency, origin };
  return {
    name: 'erp-mini-accounting-cloudflare',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        if (enabled) injectRoute({ pattern: '/api/erp-mini/accounting/[action]', entrypoint: endpoint, prerender: false });
        updateConfig({ vite: { plugins: [{
          name: 'erp-mini-cloudflare-accounting-settings',
          resolveId(id) { if (id === virtualId) return resolvedId; },
          load(id) { if (id === resolvedId) return `export default Object.freeze(${JSON.stringify(settings)});`; },
        }] } });
      },
    },
  };
}
