import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve(process.env.ARTICLE_SOURCE ?? '/Users/xulanzhong/Desktop/my-ai-workspace/Alan-Workspace/01-Articles');
let changed = 0;
let unchanged = 0;

for (const entry of await readdir(source, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
  const file = path.join(source, entry.name);
  const text = await readFile(file, 'utf8');
  let next;
  if (!text.startsWith('---\n')) {
    next = `---\ntitle: ${JSON.stringify(path.basename(entry.name, '.md'))}\npublished: true\n---\n\n${text}`;
  } else {
    const end = text.indexOf('\n---', 4);
    if (end < 0) throw new Error(`frontmatter 未闭合: ${entry.name}`);
    const header = text.slice(4, end);
    const updated = /^published:\s*.*$/m.test(header)
      ? header.replace(/^published:\s*.*$/m, 'published: true')
      : `${header}\npublished: true`;
    next = `---\n${updated}${text.slice(end)}`;
  }
  if (next === text) unchanged++;
  else { await writeFile(file, next); changed++; }
}

console.log(`已标记 published: true：修改 ${changed} 篇，已符合 ${unchanged} 篇。`);
