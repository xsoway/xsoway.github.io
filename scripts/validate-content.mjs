import { access, readdir, readFile } from 'node:fs/promises';
const dir = new URL('../src/content/articles/', import.meta.url);
const blocked = [/[\\/]Users[\\/]/, /attachment:/i, /(?:sk|rk|pk)_[A-Za-z0-9_-]{20,}/, /github_pat_[A-Za-z0-9_]{20,}/, /ghp_[A-Za-z0-9]{20,}/, /AKIA[0-9A-Z]{16}/];
try { await access(dir); } catch { console.log('没有已同步文章，跳过内容校验。'); process.exit(0); }
const errors = [];
for (const file of (await readdir(dir)).filter(file => file.endsWith('.md'))) { const text = await readFile(new URL(file, dir), 'utf8'); if (!text.startsWith('---\n')) errors.push(`${file}: 缺少 frontmatter`); if (blocked.some(pattern => pattern.test(text))) errors.push(`${file}: 包含禁止公开内容`); }
if (errors.length) throw new Error(errors.join('\n'));
console.log('内容校验通过。');
