import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizeTag } from '../src/lib/tag-filter.mjs';

test('sync policy requires an explicit public marker and redacts public copies', async () => {
  const source = await readFile(new URL('../scripts/sync-articles.mjs', import.meta.url), 'utf8');
  assert.match(source, /published:\\s\*true/);
  assert.match(source, /redactions/);
  assert.match(source, /敏感令牌已隐藏/);
});

test('tag filter keeps concise labels and removes source noise', () => {
  assert.equal(normalizeTag('自动化测试'), '自动化测试');
  assert.equal(normalizeTag('Claude Code'), 'Claude Code');
  assert.equal(normalizeTag('- GitHub'), 'GitHub');
  assert.equal(normalizeTag('一个可以直接落地的场景'), null);
  assert.equal(normalizeTag('表2脏样本清单与覆盖策略'), null);
  assert.equal(normalizeTag('/clear-skill-cache'), null);
  assert.equal(normalizeTag('MCP is dead. Long live the CLI'), null);
});
