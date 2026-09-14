import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

export const topics = [
  { slug: 'agent', name: 'Agent 与 Skills', description: '把智能能力变成可控工作流。', pattern: /agent|skill|openclaw|claude|codex|harness|mcp|提示词/i },
  { slug: 'quality', name: '测试与评测', description: '质量工程、自动化与模型评测。', pattern: /测试|test|评测|eval|质量|压测|locust|性能|报告/i },
  { slug: 'knowledge', name: '知识与内容工具', description: '知识库、写作和个人生产力。', pattern: /知识|wiki|写作|文章|内容|memory|笔记|复盘/i },
  { slug: 'engineering', name: 'AI 工程实践', description: '工具、架构和真实交付过程。', pattern: /ai|llm|rag|模型|代码|工程|开发|架构|工具/i },
  { slug: 'life', name: '随感与生活', description: '旅行、日常与工作之外的发现。', pattern: /旅行|徒步|云南|生日|日常|随感|生活|电影|音乐/i },
] as const;

export async function getArticles() {
  const articles = await getCollection('articles');
  return articles.sort((a, b) => (b.data.created?.getTime() ?? 0) - (a.data.created?.getTime() ?? 0));
}

export function articleTitle(article: Article) { return article.data.title ?? article.id; }
export function articleDate(article: Article) { return article.data.created ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(article.data.created) : ''; }
export function articleYear(article: Article) { return article.data.created?.getFullYear().toString() ?? '未标注日期'; }
export function articleUrl(id: string) { return `/articles/${id}/`; }
export function articleTagText(article: Article) { return `${articleTitle(article)} ${article.data.description ?? ''} ${article.data.category ?? ''} ${(article.data.tags ?? []).join(' ')}`; }
export function articleTopics(article: Article) {
  const text = articleTagText(article);
  const matched = topics.filter((topic) => topic.pattern.test(text)).slice(0, 2);
  return matched.length ? matched : [topics[3]];
}
export function topicArticles(articles: Article[], slug: string) { return articles.filter((article) => articleTopics(article).some((topic) => topic.slug === slug)); }
function tagSlug(name: string) {
  const normalized = name.trim().toLocaleLowerCase();
  const base = normalized.replace(/[^a-z0-9\u4e00-\u9fff]+/gi, '-').replace(/^-+|-+$/g, '') || 'tag';
  let hash = 0;
  for (const character of normalized) hash = (hash * 31 + character.codePointAt(0)!) >>> 0;
  return `raw-${base}-${hash.toString(36)}`;
}
function hashtagTags(article: Article) {
  const lines = article.body.trimEnd().split(/\r?\n/).slice(-20);
  for (const line of [...lines].reverse()) {
    const tags = [...line.matchAll(/(?:^|[\s`])#([^\s#`]+)/g)].map((match) => match[1]);
    if (tags.length >= 2) return tags;
  }
  return [];
}
export function articleTags(article: Article) {
  return [...article.data.tags ?? [], ...hashtagTags(article)]
    .map((tag) => tag.trim().replace(/[，。；、,.;:!！？?）)】\]]+$/u, ''))
    .filter((tag) => tag && tag.toLocaleLowerCase() !== 'draft');
}
export function getTags(articles: Article[]) {
  const tags = new Map<string, { name: string; count: number }>();
  for (const article of articles) for (const name of articleTags(article)) {
    const key = name.toLocaleLowerCase();
    const tag = tags.get(key) ?? { name, count: 0 };
    tag.count++;
    tags.set(key, tag);
  }
  return [...tags.values()]
    .map((tag) => ({ ...tag, slug: tagSlug(tag.name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}
export function getAllTags(articles: Article[]) { return getTags(articles); }
export function tagArticles(articles: Article[], slug: string) {
  return articles.filter((article) => articleTags(article).some((tag) => tagSlug(tag) === slug));
}
