# xsoway.github.io

公开博客：<https://xsoway.github.io>。

原始文章仍保存在 `Alan-Workspace/01-Articles`。在文章首个 frontmatter 添加 `published: true` 后，执行：

```bash
npm run sync
npm run check
git add src/content public/article-assets .sync-report.json
git commit -m "content: sync published articles"
git push origin main
```

同步器不会改写原文章；它默认跳过未标记文章、草稿副本，并在发现本机路径、附件引用、疑似密钥或丢失本地图片时停止发布。

本地预览：`npm install && npm run sync && npm run dev`。

## 自动更新

`npm run publish` 会在有公开文章变更时完成同步、构建、提交和推送。macOS 定时任务会在每天本地时间 09:30 扫描 `01-Articles`，并仅在内容有变化时发布：

```bash
chmod +x scripts/run-scheduled-publish.sh
cp ops/com.xsoway.blog-sync.plist ~/Library/LaunchAgents/com.xsoway.blog-sync.plist
launchctl bootout gui/$(id -u)/com.xsoway.blog-sync 2>/dev/null || true
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.xsoway.blog-sync.plist
```
