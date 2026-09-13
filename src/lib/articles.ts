import { getCollection } from 'astro:content';
export async function getArticles() { const articles = await getCollection('articles'); return articles.sort((a, b) => (b.data.created?.getTime() ?? 0) - (a.data.created?.getTime() ?? 0)); }
export function articleTitle(article: Awaited<ReturnType<typeof getArticles>>[number]) { return article.data.title ?? article.id; }
export function articleDate(article: Awaited<ReturnType<typeof getArticles>>[number]) { return article.data.created ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(article.data.created) : ''; }
export function articleUrl(id: string) { return `/articles/${id}/`; }
