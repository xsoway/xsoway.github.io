import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

export const topics = [
  { slug: 'agent', name: 'Agent 与 Skills', description: '把智能能力变成可控工作流。', pattern: /agent|skill|openclaw|claude|codex|harness|mcp|提示词/i },
  { slug: 'quality', name: '测试与评测', description: '质量工程、自动化与模型评测。', pattern: /测试|test|评测|eval|质量|压测|locust|性能|报告/i },
  { slug: 'knowledge', name: '知识与内容工具', description: '知识库、写作和个人生产力。', pattern: /知识|wiki|写作|文章|内容|memory|笔记|复盘/i },
  { slug: 'engineering', name: 'AI 工程实践', description: '工具、架构和真实交付过程。', pattern: /ai|llm|rag|模型|代码|工程|开发|架构|工具/i },
  { slug: 'life', name: '随感与生活', description: '旅行、日常与工作之外的发现。', pattern: /旅行|徒步|云南|生日|日常|随感|生活|电影|音乐/i },
] as const;

const tagDefinitions = [
  { slug: 'agent-skills', name: 'Agent 与 Skills', pattern: /agent|skill|openclaw|claude|codex|harness|mcp|提示词/i },
  { slug: 'testing-quality', name: '测试与质量', pattern: /测试|test|评测|eval|质量|压测|locust|性能|报告/i },
  { slug: 'ai-engineering', name: 'AI 工程实践', pattern: /ai|llm|rag|模型|代码|工程|开发|架构|自动化/i },
  { slug: 'knowledge-content', name: '知识与内容', pattern: /知识|wiki|写作|文章|内容|memory|笔记|obsidian|notion/i },
  { slug: 'review-growth', name: '复盘与成长', pattern: /复盘|review|weeklyreview|monthlyreview|年终总结|总结/i },
  { slug: 'life-travel', name: '生活与旅行', pattern: /旅行|徒步|云南|生日|日常|随感|生活|电影|音乐|跑步/i },
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
export function articleTags(article: Article) { return tagDefinitions.filter((tag) => tag.pattern.test(articleTagText(article))); }
export function getTags(articles: Article[]) { return tagDefinitions.map((tag) => ({ ...tag, count: articles.filter((article) => articleTags(article).some((item) => item.slug === tag.slug)).length })).filter((tag) => tag.count > 0); }
export function tagArticles(articles: Article[], slug: string) { return articles.filter((article) => articleTags(article).some((tag) => tag.slug === slug)); }
