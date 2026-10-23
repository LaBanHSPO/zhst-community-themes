import { env } from 'cloudflare:workers';
export { ErpAccounting } from '../../src/server/accounting-durable.js';
import type { ErpAccounting } from '../../src/server/accounting-durable.js';

interface FixtureInput {
  operation: 'status' | 'migrate' | 'execute' | 'bookmark' | 'restore';
  action?: string;
  input?: unknown;
  actorId?: string;
  sourceCustomer?: unknown;
  bookmark?: string;
}

/** Disposable local test Worker only, never imported by src/worker.ts or an Astro route. */
export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST' || !['localhost', '127.0.0.1', '[::1]'].includes(new URL(request.url).hostname)) {
      return new Response('Local test fixture only.', { status: 403 });
    }
    try {
      const data = await request.json() as FixtureInput;
      const namespace = ('ERP_ACCOUNTING' in env ? env.ERP_ACCOUNTING : undefined) as DurableObjectNamespace<ErpAccounting> | undefined;
      if (!namespace) throw new Error('The local fixture requires ERP_ACCOUNTING.');
      const ledger = namespace.getByName('ledger');
      switch (data.operation) {
        case 'status': return Response.json(await ledger.schemaStatus());
        case 'migrate': await ledger.migrate(); return Response.json(await ledger.schemaStatus());
        case 'bookmark': return Response.json({ bookmark: await ledger.recoveryBookmark() });
        case 'restore': await ledger.restore(data.bookmark ?? ''); throw new Error('Restore unexpectedly returned.');
        case 'execute':
          // Unknown snapshot must cross the RPC boundary so the actual class can reject it.
          return Response.json(await ledger.execute(data.action ?? '', data.input, data.actorId ?? '', data.sourceCustomer as never));
        default: return Response.json({ error: 'Unknown fixture operation.' }, { status: 400 });
      }
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : 'Fixture RPC failed.' }, { status: 503 });
    }
  },
};
