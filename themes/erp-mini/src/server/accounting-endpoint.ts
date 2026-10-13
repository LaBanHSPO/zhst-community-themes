import { hasPermission } from '@emdash-cms/auth';
import type { APIRoute } from 'astro';
import {
  ACCOUNTING_ACTIONS, AccountingService, ErpError,
  executeAccountingAction, validateAccountingActionInput,
} from '@zerohost/plugin-erp-mini/accounting';
import captured from 'virtual:erp-mini/accounting-settings';
import { accountingSource, accountingStore } from './accounting-resources.js';

export const prerender = false;

function response(payload: unknown, status = 200, allow?: string): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'private, no-store',
    'Pragma': 'no-cache',
    'Vary': 'Cookie, Origin',
    'X-Content-Type-Options': 'nosniff',
  });
  if (allow) headers.set('Allow', allow);
  return new Response(JSON.stringify(payload), { status, headers });
}

class TransportError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) { super(message); }
}

async function inputBody(request: Request, maxBytes: number): Promise<unknown> {
  const length = request.headers.get('Content-Length');
  if (length !== null) {
    if (!/^\d+$/.test(length)) throw new TransportError(400, 'INVALID_INPUT', 'Invalid body length.');
    if (BigInt(length) > BigInt(maxBytes)) throw new TransportError(413, 'BODY_TOO_LARGE', 'This request body exceeds the action limit.');
  }
  if (!request.body) {
    if (maxBytes === 0) return undefined;
    throw new TransportError(400, 'INVALID_INPUT', 'A JSON request body is required.');
  }
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const chunks: string[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        throw new TransportError(413, 'BODY_TOO_LARGE', 'This request body exceeds the action limit.');
      }
      chunks.push(decoder.decode(value, { stream: true }));
    }
    chunks.push(decoder.decode());
    if (maxBytes === 0) return undefined;
    return JSON.parse(chunks.join('')) as unknown;
  } catch (error) {
    if (error instanceof TransportError) throw error;
    throw new TransportError(400, 'INVALID_INPUT', 'Supply a valid UTF-8 JSON request body.');
  } finally {
    reader.releaseLock();
  }
}

export const ALL: APIRoute = async ({ locals, params, request, url }) => {
  const user = locals.user;
  // Public Astro routes receive EmDash's real soft session auth, never a host-made actor.
  if (!user?.id || user.disabled || request.headers.has('Authorization') ||
      ('tokenId' in locals && locals.tokenId !== undefined) ||
      ('tokenScopes' in locals && locals.tokenScopes !== undefined)) {
    return response({ success: false, error: { code: 'AUTH_REQUIRED', message: 'An authenticated EmDash session is required.' } }, 401);
  }
  if (!hasPermission(user, 'plugins:manage')) {
    return response({ success: false, error: { code: 'FORBIDDEN', message: 'Administrator permission is required.' } }, 403);
  }
  if (!locals.emdash?.getPluginRouteMeta('erp-mini', '/info')) {
    return response({ success: false, error: { code: 'NOT_FOUND', message: 'ERP mini is not enabled.' } }, 404);
  }
  const action = params.action ?? '';
  if (!Object.hasOwn(ACCOUNTING_ACTIONS, action)) {
    return response({ success: false, error: { code: 'NOT_FOUND', message: 'Unknown accounting action.' } }, 404);
  }
  const definition = ACCOUNTING_ACTIONS[action as keyof typeof ACCOUNTING_ACTIONS];
  if (request.method !== definition.method) {
    return response({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: `Use ${definition.method} for this action.` } }, 405, definition.method);
  }
  try {
    if (request.headers.get('X-EmDash-Request') !== '1') {
      throw new TransportError(403, 'FORBIDDEN', 'The EmDash request header is required.');
    }
    const origin = request.headers.get('Origin');
    if ((request.method === 'POST' && origin === null) || (origin !== null && origin !== captured.origin)) {
      throw new TransportError(403, 'FORBIDDEN', 'Accounting requests must use the configured site origin.');
    }
    if (url.search) throw new TransportError(400, 'INVALID_INPUT', 'Accounting input belongs in the JSON body, not the URL.');
    if (request.method === 'POST' && !/^application\/json(?:\s*;\s*charset\s*=\s*(?:utf-8|"utf-8"))?\s*$/i.test(request.headers.get('Content-Type') ?? '')) {
      throw new TransportError(415, 'INVALID_INPUT', 'Use application/json for accounting requests.');
    }
    const input = validateAccountingActionInput(action, await inputBody(request, definition.maxBytes));
    // Strict plugin schemas reject caller-owned actor/role before any CRM initialization.
    const source = await accountingSource(user.id);
    await source.checkCurrency(action === 'configure-book', action === 'info');
    const service = new AccountingService(accountingStore(), user.id);
    return response({ success: true, data: await executeAccountingAction(service, action, input, source) });
  } catch (error) {
    if (error instanceof TransportError) {
      return response({ success: false, error: { code: error.code, message: error.message } }, error.status);
    }
    if (error instanceof ErpError) {
      return response({ success: true, data: { ok: false, error: { code: error.code, message: error.message } } });
    }
    return response({ success: false, error: { code: 'ACCOUNTING_UNAVAILABLE', message: 'Accounting is unavailable. Verify the captured Node settings and restart the paired Node host to initialize or verify its accounting schema before retrying.' } }, 503);
  }
};
