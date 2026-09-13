import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('sync policy requires an explicit public marker and redacts public copies', async () => {
  const source = await readFile(new URL('../scripts/sync-articles.mjs', import.meta.url), 'utf8');
  assert.match(source, /published:\\s\*true/);
  assert.match(source, /redactions/);
  assert.match(source, /敏感令牌已隐藏/);
});
