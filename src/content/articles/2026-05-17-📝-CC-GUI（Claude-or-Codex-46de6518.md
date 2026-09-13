---
title: "CC GUI 插件概览"
created: "2026-05-17"
published: true
---
# 📝 CC GUI（Claude or Codex）

CC GUI 是一款功能强大的 IntelliJ IDEA 插件，提供 **Claude Code** 与 **OpenAI Codex** 双 AI 引擎的可视化操作界面，让 AI 辅助编程更直观、高效。插件原名 *Claude Code GUI*，为规避商标风险已更名为 CC GUI，并替换了 LOGO，减少了中国元素的展示。每个小版本发布前都要经过 `/security-review`，每十个小版本会进行一次整体的安全审查。
一个功能强大的 IntelliJ IDEA 插件，为开发者提供 **Claude Code** 和 **OpenAI Codex** 双 AI 工具的可视化操作界面，让 AI 辅助编程变得更加高效和直观。

[ ![Image](https://github.com/zhukunpenglinyutong/jetbrains-cc-gui/raw/main/docs/img/banner.png)](https://github.com/zhukunpenglinyutong/jetbrains-cc-gui/blob/main/docs/img/banner.png)
- --

## 下载与安装

- **插件市场**：直接在 JetBrains Marketplace 搜索 **CC GUI（Claude or Codex）**，或点击以下链接下载安装：
  - [CC GUI（Claude or Codex） 下载](https://plugins.jetbrains.com/plugin/29342-cc-gui-claude-or-codex-)
- **使用指南**：插件的使用说明详见官方 README（中文）：
  - https://github.com/zhukunpenglinyutong/jetbrains-cc-gui/blob/main/README.zh-CN.md

- --

## 核心功能速览

- **双 AI 引擎**：内置 Claude Code（Anthropic 官方 AI 编程助手，支持 Opus 4.6 等多模型）和 OpenAI Codex（强大的代码生成引擎）。
- **上下文助手**：选中代码后使用 `Ctrl+Alt+K`（Windows/Linux）或 `Cmd+Alt+K`（Mac）即可将上下文发送给 AI，获取即时建议。
- **图片支持**：可直接发送图片，AI 会根据视觉信息给出描述或实现方案。
- **Agent 系统**：内置智能体，支持自动化执行复杂任务。
- **斜杠命令**：提供 `/init`, `/review` 等快捷命令，提升交互效率。
- **MCP 服务器**：通过 MCP 协议扩展 AI 能力边界。
- **代码 Diff 与导航**：可视化代码对比，快速定位文件跳转。
- **主题与字体**：深色/浅色主题随意切换，支持 IDE 字体同步。
- **会话管理**：历史记录、收藏、搜索与导出功能一应俱全。

- --

## 连接与代理说明

- 默认情况下，请求直接发送到 Anthropic（Claude）或 OpenAI（Codex）官方 API。
- 如需使用第三方或代理端点，可在插件的 **服务商设置** 中自行配置。插件会在使用前显式标记为代理路由，确保透明可控。
- 当用户开启 **本地 `settings.json`** 或 **CLI 登录** 模式时，插件才会读取 `~/.claude/settings.json` 中的网络代理变量（`HTTP_PROXY`, `HTTPS_PROXY`），否则不会继承系统代理。

- --

## 凭证与文件访问披露

- **不会静默扫描凭证**：所有 API 密钥、令牌均需用户通过插件 UI 的确认对话框显式授权。
- **凭证来源**：
  - 手动在插件设置中填写 API Key；
  - 通过 `~/.claude/settings.json` 授权读取；
  - 使用 Claude SDK 原生 OAuth（CLI 登录）方式。
- **MCP 服务器配置**：读取自 `~/.claude.json`，仅包含服务器定义，不包含任何敏感凭证。

- --

## 使用体验小贴士

- **快速调用**：在编辑器右侧打开 CC GUI 窗口，选中文本后使用快捷键即能得到 AI 代码建议。
- **图片交互**：将需求截图直接粘贴进对话框，AI 会基于图像生成实现代码。
- **Agent 自动化**：利用斜杠命令 `/review` 可以让 AI 自动审查代码质量，或使用 `/init` 快速生成项目骨架。
- **安全审查**：每次发布新版本前，务必运行插件自带的安全审查脚本，确保没有泄露凭证或潜在漏洞。

- --

# Claude  #Code  #Codex  #IntelliJ #插件  #AI编程助手 #CCGUI #pycharm
