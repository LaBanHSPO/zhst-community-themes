import assert from 'node:assert/strict';
import test from 'node:test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

test('Actual workerd class has explicit schema migration, guarded execution and maintenance recovery', { timeout: 120_000 }, async () => {
  const directory = await mkdtemp(join(tmpdir(), 'erp-accounting-class-test-'));
  let worker;
  let processError;
  let origin;
  async function rpc(body) {
    const response = await fetch(origin, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(5000),
    });
    return { status: response.status, value: await response.json() };
  }
  async function stop() {
    const current = worker;
    worker = undefined;
    if (!current || current.exitCode !== null || current.signalCode !== null) return;
    const exited = once(current, 'exit');
    const timer = setTimeout(() => current.kill('SIGKILL'), 5000);
    current.kill('SIGTERM');
    try { await exited; } finally { clearTimeout(timer); }
  }
  async function start(maintenance = false) {
    const reservation = createServer();
    reservation.listen(0, '127.0.0.1');
    await once(reservation, 'listening');
    const address = reservation.address();
    assert.ok(address && typeof address === 'object');
    const port = address.port;
    await new Promise((resolve, reject) => reservation.close((error) => error ? reject(error) : resolve()));
    origin = `http://127.0.0.1:${port}`;
    processError = undefined;
    worker = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'dev',
      '--config', 'tests/fixtures/accounting-wrangler.json', '--local', '--persist-to', directory,
      '--ip', '127.0.0.1', '--port', String(port), '--inspector-port', '0', '--log-level', 'warn',
      ...(maintenance ? ['--var', 'ERP_ACCOUNTING_MAINTENANCE:true'] : []),
    ], { cwd: root, env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: 'true' }, stdio: ['ignore', 'inherit', 'inherit'] });
    worker.on('error', (error) => { processError = error; });
    const deadline = Date.now() + 45_000;
    let lastError;
    while (Date.now() < deadline) {
      if (processError) throw processError;
      if (worker.exitCode !== null || worker.signalCode !== null) throw new Error('Local accounting fixture exited before readiness.');
      try {
        const status = await rpc({ operation: 'status' });
        assert.equal(status.status, 200);
        return status.value;
      } catch (error) {
        lastError = error;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    throw new Error('Local accounting fixture failed readiness.', { cause: lastError });
  }
  try {
    assert.deepEqual(await start(), { version: null, checksum: null, bookConfigured: false });
    const missing = await rpc({ operation: 'execute', action: 'info', actorId: 'synthetic-native-actor' });
    assert.equal(missing.status, 503);
    assert.match(missing.value.error, /explicit signed operator migration/);
    // Even after an attempted public execution, the constructor/request did not migrate.
    assert.deepEqual((await rpc({ operation: 'status' })).value, { version: null, checksum: null, bookConfigured: false });
    const migrated = await rpc({ operation: 'migrate' });
    assert.equal(migrated.status, 200);
    assert.equal(migrated.value.version, 2);
    assert.match(migrated.value.checksum, /^[a-f0-9]{64}$/);
    assert.equal(migrated.value.bookConfigured, false);
    const checksum = migrated.value.checksum;
    assert.deepEqual((await rpc({ operation: 'migrate' })).value, migrated.value);

    const anonymous = await rpc({ operation: 'execute', action: 'info' });
    assert.equal(anonymous.value.error.code, 'AUTH_REQUIRED');
    const forbiddenAction = await rpc({ operation: 'execute', action: 'migrate', actorId: 'synthetic-native-actor' });
    assert.equal(forbiddenAction.value.error.code, 'INVALID_ACTION');
    const configured = await rpc({ operation: 'execute', action: 'configure-book', actorId: 'synthetic-native-actor', input: { startDate: '2026-01-01' } });
    assert.equal(configured.value.ok, true);
    assert.equal((await rpc({ operation: 'status' })).value.bookConfigured, true);

    const customerId = '11111111-1111-4111-8111-111111111111';
    const input = { id: '22222222-2222-4222-8222-222222222222', revision: null, customerId, customerRevision: 'synthetic-crm-revision' };
    const snapshot = { code: 'SYNTHETIC', name: 'Synthetic customer', sourceKind: 'customer', sourceId: customerId, sourceRevision: 'synthetic-crm-revision' };
    const stale = await rpc({ operation: 'execute', action: 'link-customer', actorId: 'synthetic-native-actor', input, sourceCustomer: { ...snapshot, sourceRevision: 'stale' } });
    assert.equal(stale.value.error.code, 'CONFLICT');
    const linked = await rpc({ operation: 'execute', action: 'link-customer', actorId: 'synthetic-native-actor', input, sourceCustomer: snapshot });
    assert.equal(linked.value.ok, true);
    const coa = { templateId: 'vn-tt133-2016', templateVersion: '1', selectedCodes: ['33311'] };
    const importInput = { ...coa, commandId: '44444444-4444-4444-8444-444444444444' };
    const imported = await rpc({ operation: 'execute', action: 'import-accounts', actorId: 'synthetic-native-actor', input: importInput });
    assert.equal(imported.value.ok, true);
    assert.deepEqual(imported.value.data.created.map(({ code }) => code), ['333', '3331', '33311']);
    const replayed = await rpc({ operation: 'execute', action: 'import-accounts', actorId: 'synthetic-native-actor', input: importInput });
    assert.deepEqual(replayed.value, imported.value);
    const existing = await rpc({ operation: 'execute', action: 'preview-account-import', actorId: 'synthetic-native-actor', input: coa });
    assert.equal(existing.value.data.createCount, 0);
    assert.equal(existing.value.data.existingCount, 3);
    const guardedRestore = await rpc({ operation: 'restore', bookmark: 'invalid' });
    assert.equal(guardedRestore.status, 503);
    assert.match(guardedRestore.value.error, /Pause accounting/);

    await stop();
    const pausedStatus = await start(true);
    assert.equal(pausedStatus.checksum, checksum);
    assert.equal(pausedStatus.bookConfigured, true);
    const pausedRead = await rpc({ operation: 'execute', action: 'info', actorId: 'synthetic-native-actor' });
    assert.equal(pausedRead.value.ok, true);
    assert.equal(pausedRead.value.data.book.value.currency, 'VND');
    const pausedWrite = await rpc({ operation: 'execute', action: 'configure-book', actorId: 'synthetic-native-actor', input: { startDate: '2026-02-01' } });
    assert.equal(pausedWrite.value.error.code, 'ACCOUNTING_MAINTENANCE');
    const selection = { templateId: 'vn-tt133-2016', templateVersion: '1', selectedCodes: ['911'] };
    const pausedPreview = await rpc({ operation: 'execute', action: 'preview-account-import', actorId: 'synthetic-native-actor', input: selection });
    assert.equal(pausedPreview.value.ok, true);
    assert.equal(pausedPreview.value.data.createCount, 1);
    const pausedImport = await rpc({ operation: 'execute', action: 'import-accounts', actorId: 'synthetic-native-actor', input: { ...selection, commandId: '33333333-3333-4333-8333-333333333333' } });
    assert.equal(pausedImport.value.error.code, 'ACCOUNTING_MAINTENANCE');
    const afterDeniedImport = await rpc({ operation: 'execute', action: 'preview-account-import', actorId: 'synthetic-native-actor', input: selection });
    assert.deepEqual(afterDeniedImport.value, pausedPreview.value);
    const invalidRestore = await rpc({ operation: 'restore', bookmark: 'invalid' });
    assert.equal(invalidRestore.status, 503);
    assert.match(invalidRestore.value.error, /valid accounting PITR bookmark/);
  } finally {
    await stop();
    await rm(directory, { recursive: true, force: true });
  }
});
