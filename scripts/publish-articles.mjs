import { execFileSync } from 'node:child_process';
import { syncArticles } from './sync-articles.mjs';

const run = (command, args) => execFileSync(command, args, { stdio: 'inherit' });
const report = await syncArticles();
if (!report.included.length && !report.deleted.length) {
  console.log('没有标记为 published: true 的文章，本次不提交。');
  process.exit(0);
}
run('npm', ['run', 'check']);
run('git', ['add', '-f', 'src/content/articles', 'public/article-assets', '.article-exclusions.json', '.sync-manifest.json', '.sync-report.json']);
try { execFileSync('git', ['diff', '--cached', '--quiet']); console.log('没有内容变更，本次不提交。'); }
catch { run('git', ['commit', '-m', 'content: sync published articles']); run('git', ['push', 'origin', 'main']); }
