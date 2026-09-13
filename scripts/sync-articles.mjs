import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const defaultSource = path.resolve('/Users/xulanzhong/Desktop/my-ai-workspace/Alan-Workspace/01-Articles');
const legacySource = path.resolve('/Users/xulanzhong/Desktop/hexo_xmylog/mylog/source/_posts');
const reviewSource = path.resolve('/Users/xulanzhong/Desktop/my-ai-workspace/Alan-Workspace/40-Review');
const allSources = [defaultSource, legacySource, reviewSource];
const sources = (process.env.ARTICLE_SOURCES ?? process.env.ARTICLE_SOURCE ?? `${defaultSource},${legacySource},${reviewSource}`).split(',').map(item => path.resolve(item.trim()));
const sourceLabel = new Map([[defaultSource, '主文章库'], [legacySource, '旧 Hexo 文章'], [reviewSource, '复盘归档']]);
const contentDir = path.join(root, 'src/content/articles');
const assetsDir = path.join(root, 'public/article-assets');
const manifestFile = path.join(root, '.sync-manifest.json');
const exclusionsFile = path.join(root, '.article-exclusions.json');
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
function articleKey(article) { return `${article.source}:${path.relative(article.source, article.file)}`; }
function publicAsset(relative) { return `/article-assets/${relative.split(path.sep).map(encodeURIComponent).join('/')}`; }
function scalar(header, key) { return header.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '').replace(/\\*\\*/g, ''); }
function list(header, key) {
  const inline = header.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]\\s*$`, 'm'));
  if (inline) return inline[1].split(',').map(value => value.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  const single = scalar(header, key);
  if (single) return [single];
  const lines = header.split('\n');
  const start = lines.findIndex(line => new RegExp(`^${key}:\\s*$`).test(line));
  if (start < 0) return [];
  const values = [];
  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z_][A-Za-z0-9_]*:/.test(line)) break;
    const match = line.match(/^\s*-\s*(?:-\s*)?(.+?)\s*$/);
    if (match) values.push(match[1].replace(/^['"]|['"]$/g, ''));
  }
  return values;
}
function normalizeFrontmatter(text, file, includeMetadata = false, titleFromFilename = false) {
  const fallbackTitle = name(file);
  const fallbackDate = fallbackTitle.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!text.startsWith('---\n')) return `---\ntitle: ${JSON.stringify(fallbackTitle)}${fallbackDate ? `\ncreated: ${JSON.stringify(fallbackDate)}` : ''}\npublished: true\n---\n\n${text}`;
  const end = text.indexOf('\n---', 4);
  if (end < 0) return `---\ntitle: ${JSON.stringify(fallbackTitle)}${fallbackDate ? `\ncreated: ${JSON.stringify(fallbackDate)}` : ''}\npublished: true\n---\n\n${text}`;
  const header = text.slice(4, end);
  const title = titleFromFilename ? fallbackTitle : (scalar(header, 'title') || fallbackTitle);
  const date = scalar(header, 'created')?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || (includeMetadata ? scalar(header, 'date')?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] : undefined) || fallbackDate;
  if (!includeMetadata) return `---\ntitle: ${JSON.stringify(title)}${date ? `\ncreated: ${JSON.stringify(date)}` : ''}\npublished: true\n---${text.slice(end + 4)}`;
  const tags = list(header, 'tags');
  const category = list(header, 'category').at(-1) ?? list(header, 'categories').at(-1);
  const description = scalar(header, 'description');
  return `---\ntitle: ${JSON.stringify(title)}${date ? `\ncreated: ${JSON.stringify(date)}` : ''}${description ? `\ndescription: ${JSON.stringify(description)}` : ''}${tags.length ? `\ntags: ${JSON.stringify(tags)}` : ''}${category ? `\ncategory: ${JSON.stringify(category)}` : ''}\npublished: true\n---${text.slice(end + 4)}`;
}

async function markdownFiles(source) {
  const files = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.isFile() && entry.name.endsWith('.md')) files.push(file);
    }
  }
  await visit(source);
  return files;
}

async function copyAsset(reference, article, report) {
  if (/^(https?:|data:|#|\/)/i.test(reference)) return reference;
  const resolved = path.resolve(path.dirname(article.file), reference);
  if (!resolved.startsWith(`${article.source}${path.sep}`)) throw new Error(`资源路径越界: ${reference}`);
  await stat(resolved).catch(() => { throw new Error(`找不到图片资源: ${reference}`); });
  const relative = article.source === sources[0] ? path.relative(article.source, resolved) : path.join(createHash('sha256').update(article.source).digest('hex').slice(0, 8), path.relative(article.source, resolved));
  const destination = path.join(assetsDir, relative);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(resolved, destination);
  report.assets++;
  return publicAsset(relative);
}

async function previousManifest() {
  try {
    const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
    return Array.isArray(manifest.articles) ? manifest.articles : [];
  } catch {
    return [];
  }
}

async function excludedSlugs() {
  try {
    const exclusions = JSON.parse(await readFile(exclusionsFile, 'utf8'));
    return new Set(exclusions.slugs ?? []);
  } catch {
    return new Set();
  }
}

async function knownOutputNames(excluded) {
  const known = [];
  for (const source of allSources) {
    for (const file of await markdownFiles(source)) {
      const text = await readFile(file, 'utf8');
      if ((metadata(text).published || source === reviewSource) && !excluded.has(name(file))) {
        const slug = name(file);
        const hash = createHash('sha256').update(slug).digest('hex').slice(0, 8);
        const id = known.some(article => article.slug === slug) ? `${slug}-${createHash('sha256').update(source).digest('hex').slice(0, 8)}-${hash}` : `${slug}-${hash}`;
        known.push({ slug, id });
      }
    }
  }
  return new Set(known.map(article => `${article.id}.md`));
}

export async function syncArticles() {
  const report = { sources: sources.map((source) => sourceLabel.get(source) ?? '自定义文章源'), included: [], skipped: [], deleted: [], warnings: [], errors: [], assets: 0 };
  const excluded = await excludedSlugs();
  const candidates = [];
  for (const source of sources) {
    for (const file of await markdownFiles(source)) {
      const text = await readFile(file, 'utf8');
      if (excluded.has(name(file))) report.skipped.push(path.relative(source, file));
      else if (!metadata(text).published && source !== reviewSource) report.skipped.push(path.relative(source, file));
      else {
        const slug = name(file);
        const hash = createHash('sha256').update(slug).digest('hex').slice(0, 8);
        const id = candidates.some(article => article.slug === slug) ? `${slug}-${createHash('sha256').update(source).digest('hex').slice(0, 8)}-${hash}` : `${slug}-${hash}`;
        candidates.push({ file, text, source, slug, id });
      }
    }
  }
  const published = new Map(candidates.map(article => [article.slug, article.id]));
  await mkdir(contentDir, { recursive: true });
  await mkdir(assetsDir, { recursive: true });
  for (const article of candidates) {
    try {
      let text = normalizeFrontmatter(article.text, article.file, true, article.source === defaultSource);
      for (const [pattern, replacement] of redactions) {
        const next = text.replace(pattern, replacement);
        if (next !== text) report.warnings.push({ file: path.basename(article.file), message: '已脱敏本机路径、附件引用或敏感令牌' });
        text = next;
      }
      for (const image of [...article.text.matchAll(/!\[([^\]]*)\]\(([^ )]+)(?:\s+"[^"]*")?\)/g)]) {
        try { text = text.replace(image[0], `![${image[1]}](${await copyAsset(image[2], article, report)})`); }
        catch { text = text.replace(image[0], `> 图片资源未同步：${image[1] || '未命名图片'}`); report.warnings.push({ file: path.basename(article.file), message: `缺失图片已替换为提示：${image[2]}` }); }
      }
      text = text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
        const targetName = name(target.trim());
        return published.has(targetName) ? `[${label ?? target}](/articles/${encodeURIComponent(published.get(targetName))}/)` : (label ?? target);
      });
      await writeFile(path.join(contentDir, `${article.id}.md`), text);
      report.included.push(path.relative(article.source, article.file));
    } catch (error) { report.errors.push({ file: path.relative(article.source, article.file), message: error.message }); }
  }
  if (!report.errors.length) {
    const oldArticles = await previousManifest();
    const currentKeys = new Set(candidates.map(articleKey));
    const removed = oldArticles.filter(article => sources.includes(article.source) && !currentKeys.has(`${article.source}:${article.file}`));
    for (const article of removed) {
      const output = path.resolve(contentDir, article.output);
      if (output.startsWith(`${contentDir}${path.sep}`)) {
        await rm(output, { force: true });
        report.deleted.push(article.output);
      }
    }
    const retained = oldArticles.filter(article => !sources.includes(article.source));
    const articles = candidates.map(article => ({ source: article.source, file: path.relative(article.source, article.file), output: `${article.id}.md` }));
    await writeFile(manifestFile, `${JSON.stringify({ version: 1, articles: [...retained, ...articles] }, null, 2)}\n`);
    if (sources.length === 1 && sources[0] === defaultSource) {
      const known = await knownOutputNames(excluded);
      for (const entry of await readdir(contentDir, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.md') || known.has(entry.name)) continue;
        await rm(path.join(contentDir, entry.name));
        report.deleted.push(entry.name);
      }
    }
  }
  await writeFile(path.join(root, '.sync-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  if (report.errors.length) throw new Error(`同步失败：${report.errors.map(item => item.file).join(', ')}`);
  return report;
}
if (process.argv[1] === new URL(import.meta.url).pathname) syncArticles().then(report => console.log(`已同步 ${report.included.length} 篇文章和 ${report.assets} 个资源；跳过 ${report.skipped.length} 篇。`));
