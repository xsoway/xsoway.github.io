import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const source = path.resolve(process.env.ARTICLE_SOURCE ?? '/Users/xulanzhong/Desktop/my-ai-workspace/Alan-Workspace/01-Articles');
const contentDir = path.join(root, 'src/content/articles');
const assetsDir = path.join(root, 'public/article-assets');
const redactions = [
  [/[\\/]Users[\\/][^\s)`\]]+/g, '[本机路径已隐藏]'],
  [/attachment:[^\s)`\]]+/gi, '[附件未公开]'],
  [/(?:sk|rk|pk)_[A-Za-z0-9_-]{20,}/g, '[敏感令牌已隐藏]'],
  [/github_pat_[A-Za-z0-9_]{20,}/g, '[敏感令牌已隐藏]'],
  [/ghp_[A-Za-z0-9]{20,}/g, '[敏感令牌已隐藏]'],
  [/AKIA[0-9A-Z]{16}/g, '[敏感令牌已隐藏]'],
];

function metadata(text) {
  if (!text.startsWith('---\n')) return { published: false };
  const end = text.indexOf('\n---', 4);
  const header = end < 0 ? '' : text.slice(4, end);
  return { published: /^published:\s*true\s*$/m.test(header) };
}
function name(file) { return path.basename(file, '.md'); }
function publicAsset(relative) { return `/article-assets/${relative.split(path.sep).map(encodeURIComponent).join('/')}`; }
function normalizeFrontmatter(text, file) {
  const fallbackTitle = name(file);
  const fallbackDate = fallbackTitle.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!text.startsWith('---\n')) return `---\ntitle: ${JSON.stringify(fallbackTitle)}${fallbackDate ? `\ncreated: ${JSON.stringify(fallbackDate)}` : ''}\npublished: true\n---\n\n${text}`;
  const end = text.indexOf('\n---', 4);
  if (end < 0) return `---\ntitle: ${JSON.stringify(fallbackTitle)}${fallbackDate ? `\ncreated: ${JSON.stringify(fallbackDate)}` : ''}\npublished: true\n---\n\n${text}`;
  const header = text.slice(4, end);
  const title = header.match(/^title:\s*(.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, '').replace(/\*\*/g, '') || fallbackTitle;
  const date = header.match(/^created:\s*['"]?(\d{4}-\d{2}-\d{2})/)?.[1] || fallbackDate;
  return `---\ntitle: ${JSON.stringify(title)}${date ? `\ncreated: ${JSON.stringify(date)}` : ''}\npublished: true\n---${text.slice(end + 4)}`;
}

async function copyAsset(reference, article, report) {
  if (/^(https?:|data:|#|\/)/i.test(reference)) return reference;
  const resolved = path.resolve(path.dirname(article), reference);
  if (!resolved.startsWith(`${source}${path.sep}`)) throw new Error(`资源路径越界: ${reference}`);
  await stat(resolved).catch(() => { throw new Error(`找不到图片资源: ${reference}`); });
  const relative = path.relative(source, resolved);
  const destination = path.join(assetsDir, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(resolved, destination);
  report.assets++;
  return publicAsset(relative);
}

export async function syncArticles() {
  const report = { source, included: [], skipped: [], warnings: [], errors: [], assets: 0 };
  const entries = await readdir(source, { withFileTypes: true });
  const candidates = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const file = path.join(source, entry.name);
    const text = await readFile(file, 'utf8');
    if (!metadata(text).published) report.skipped.push(entry.name);
    else {
      const slug = name(file);
      candidates.push({ file, text, slug, id: `${slug}-${createHash('sha256').update(slug).digest('hex').slice(0, 8)}` });
    }
  }
  const published = new Map(candidates.map(article => [article.slug, article.id]));
  await rm(contentDir, { recursive: true, force: true });
  await rm(assetsDir, { recursive: true, force: true });
  await mkdir(contentDir, { recursive: true });
  for (const article of candidates) {
    try {
      let text = normalizeFrontmatter(article.text, article.file);
      for (const [pattern, replacement] of redactions) {
        const next = text.replace(pattern, replacement);
        if (next !== text) report.warnings.push({ file: path.basename(article.file), message: '已脱敏本机路径、附件引用或敏感令牌' });
        text = next;
      }
      for (const image of [...article.text.matchAll(/!\[([^\]]*)\]\(([^ )]+)(?:\s+"[^"]*")?\)/g)]) {
        try { text = text.replace(image[0], `![${image[1]}](${await copyAsset(image[2], article.file, report)})`); }
        catch { text = text.replace(image[0], `> 图片资源未同步：${image[1] || '未命名图片'}`); report.warnings.push({ file: path.basename(article.file), message: `缺失图片已替换为提示：${image[2]}` }); }
      }
      text = text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
        const targetName = name(target.trim());
        return published.has(targetName) ? `[${label ?? target}](/articles/${encodeURIComponent(published.get(targetName))}/)` : (label ?? target);
      });
      await writeFile(path.join(contentDir, `${article.id}.md`), text);
      report.included.push(path.basename(article.file));
    } catch (error) { report.errors.push({ file: path.basename(article.file), message: error.message }); }
  }
  await writeFile(path.join(root, '.sync-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  if (report.errors.length) throw new Error(`同步失败：${report.errors.map(item => item.file).join(', ')}`);
  return report;
}
if (process.argv[1] === new URL(import.meta.url).pathname) syncArticles().then(report => console.log(`已同步 ${report.included.length} 篇文章和 ${report.assets} 个资源；跳过 ${report.skipped.length} 篇。`));
