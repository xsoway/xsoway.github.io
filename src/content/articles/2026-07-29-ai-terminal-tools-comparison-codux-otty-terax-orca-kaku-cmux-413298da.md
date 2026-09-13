---
title: "AI 终端神器横向对比：Codux、Otty、Terax、Orca、Kaku、Cmux，到底谁在真的干活？"
created: "2026-07-29"
tags: ["KnowledgeBase","Codux","Otty","Terax","Orca","Kaku","Cmux","AI编程","终端工具","横向对比"]
category: "技术分享"
published: true
---

# AI 终端神器横向对比：Codux、Otty、Terax、Orca、Kaku、Cmux，到底谁在真的干活？

## 导语

今年 AI 编程 CLI 井喷——Codex、Claude Code、OpenCode、Kimi Code、Grok、Cursor CLI……你能想到的模型厂商几乎都出了终端 agent。

但问题来了：**Agent 好用，但管理 Agent 的工具几乎没有。**

你同时开着三四个 agent 窗口，每个各管各的会话、各管各的 Token、各管各的上下文。跑一半要出门，手机连不上。SSH 密钥不知道该不该贴进提示词。Token 烧了多少全靠猜。

于是今年冒出了一批"AI 终端管理工具"，它们不自己写代码，而是帮你管好那些写代码的 agent。

最近被频繁提到的有 6 个：**Codux、Otty、Terax、Orca、Kaku、Cmux**。

我把它们的项目文档全翻了一遍，按功能维度做了个横向对比。

## 一句话分类

| 项目 | 一句话定位 | 核心哲学 |
|------|-----------|---------|
| **Codux** | 用 Rust + GPUI 打造的 AI 编程 CLI 控制台 | 统一视图 + 凭证隔离 + 远程接管 |
| **Otty** | 终端工作区，文件浏览器 + 块式终端 UI + 快捷命令 | 终端应该成为开发运维的主工作区 |
| **Terax** | 轻量级 AI 终端（ADE），7-8MB，无遥测 | 最小化 + 本地优先 + 自备密钥 |
| **Orca** | AI 编排器，并排跑多个 agent 在 worktree 中 | 并行 + 比较 + 合并 |
| **Kaku** | WezTerm 深度定制版，macOS 专属 AI 终端 | 零配置 + 轻量 + 主题感知 |
| **Cmux** | 基于 Ghostty 的 macOS 终端，带垂直标签页和通知系统 | 原生 + 通知 + 可脚本化 |

## 横向对比总表

| 维度 | Codux | Otty | Terax | Orca | Kaku | Cmux |
|------|-------|------|-------|------|------|------|
| **技术栈** | Rust + GPUI 原生 | Rust（iced/widgets） | Tauri 2 + Rust + React 19 | 未公开（桌面应用） | WezTerm 深度 fork（Lua） | Swift + AppKit + libghostty |
| **安装包大小** | 未公开 | 未公开 | ~7-8 MB | 未公开 | ~40 MB（比上游 WezTerm 小 40%） | 未公开 |
| **macOS** | ✅ | ✅（dmg） | ✅ | ✅ | ✅（仅 macOS） | ✅（仅 macOS） |
| **Windows** | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Linux** | ✅（主机端） | ✅（deb/rpm） | ✅（AppImage/deb/rpm） | ✅（AppImage） | ❌ | ❌ |
| **手机端** | ✅（Android + iOS） | ❌ | ❌ | ✅（Android + iOS） | ❌ | ✅（iOS Beta） |
| **开源协议** | GPL-3.0 | 未公开（有 LICENSE 文件） | Apache-2.0 | MIT | MIT | GPL-3.0 |
| **是否需要账号** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **遥测** | 无 | 未公开 | 无遥测 | 可选（可退出） | 无 | 未公开 |
| **AI CLI 统一管理** | ✅ 9+ CLI | ❌（未提及 AI 集成） | ✅ 内置 AI 面板 | ✅ 20+ CLI | ✅ 配置入口 | ✅ 任何 CLI |
| **Worktree 隔离** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌（但支持 SSH + tmux） |
| **Token 统计** | ✅ 多维 | ❌ | ❌ | ✅ 用量追踪 | ❌ | ❌ |
| **本地记忆** | ✅ | ❌ | ✅ TERAX.md 项目记忆 | ❌ | ❌ | ❌ |
| **凭证隔离** | ✅ SSH/DB 隔离 | ❌ | ✅ OS keychain 存密钥 | ❌ | ❌ | ❌ |
| **远程主机** | ✅ P2P/中继 | ❌ | ❌ | ✅ SSH Worktree | ❌ | ✅ SSH + 远程 tmux |
| **手机接力** | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ iOS Beta |
| **内置浏览器** | ✅ Web Tunnel | ❌ | ❌ | ✅ Design Mode | ❌ | ✅ 内置浏览器窗格 |
| **通知系统** | ❌ | ❌ | ❌ | ✅ 通知 + 未读 | ❌ | ✅ 通知光环 + 面板 |
| **Git 集成** | ✅ Worktree 面板 | ❌（未提及） | ✅ Git 图 + 提交 | ✅ GitHub/Linear 原生 | ✅ Lazygit 集成 | ✅ 侧边栏显示分支/PR |
| **AI 代码补全** | ❌ | ❌ | ✅ 内联 AI 补全 | ❌ | ✅ 错误修复 + 命令生成 | ❌ |
| **可脚本化** | ❌（CLI 有限） | ❌ | ❌ | ✅ Orca CLI | ✅ kaku CLI | ✅ CLI + socket API |
| **会话恢复** | ✅ 断线重连 | ❌（未提及） | ❌ | ❌ | ❌ | ✅ 完整布局恢复 + agent 恢复 |
| **像素宠物** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

> **关于 Otty**：Otty 的仓库在 `otty-shell/otty`，目前处于 active development 阶段（v0.1.0）。README 定位为"终端工作区"——带文件浏览器、快捷命令/SSH 启动器、块式终端 UI，但**没有专门针对 AI 编程 CLI 的管理功能**，也没有凭证隔离、远程主机、手机端等能力。它更像一个"增强型终端"，而不是"AI 管理工具"。如果你有 Otty 的最新文档或使用经验，欢迎补充。

## 按使用场景推荐

### 如果你：多 agent 并行、跨项目、经常换设备

**优先看 Codux 和 Orca。**

Codux 的 worktree 隔离机制是目前这几个里最完整的——每个任务有自己的终端、Git 状态、文件和 AI 会话，天然互不干扰。加上 Token 多维统计、凭证隔离（SSH/DB 密钥不进模型上下文）、手机接力 + 远程主机，适合重度 agent 用户。

Orca 的路线更偏"并行 + 比较"——一个提示同时分发给五个 agent，每个在独立 worktree 里跑，然后比较结果合并最佳方案。GitHub 和 Linear 的原生集成也是独一份。

**差别**：Codux 更偏"控制台"，Orca 更偏"编排器"。Codux 的凭证隔离是 Orca 没有的，Orca 的并行分发给多个 agent 是 Codux 没有的。

### 如果你：本地优先、轻量、自备密钥

**Terax 是最轻的。** 7-8MB 安装包，Tauri 2 + Rust 构建，无遥测、无账号。内置 AI 面板支持 BYOK（OpenAI、Anthropic、Gemini、Groq、xAI、DeepSeek 等），也支持本地模型（LM Studio、MLX、Ollama）。

它的亮点在于"终端本身也是 AI 编辑器"——内联 AI 补全、AI edit diffs（逐块接受/拒绝）、Vim 模式、CodeMirror 6 编辑器。还有 TERAX.md 项目记忆机制，agent 可以读写项目级记忆文件。

**代价**：没有手机端、没有远程主机、没有 worktree 隔离。它更适合"一个人一台机器"的场景。

### 如果你：macOS 用户，想要原生体验 + 通知系统

**Cmux 是目前 macOS 上最精致的选项。** 基于 libghostty 渲染，Swift + AppKit 原生，读你的 Ghostty 配置。它的通知系统是独一份——agent 需要你的时候，窗格显示蓝色光环，侧边栏有未读徽章，还支持 macOS 桌面通知。

内置浏览器窗格移植自 agent-browser，可脚本化抓取 DOM、点击、填表、执行 JS。所有操作都可通过 CLI 和 socket API 自动化。

**代价**：仅 macOS，没有 Windows/Linux 版本。没有 worktree 隔离，但支持 SSH 连接远程 tmux 会话。iOS 还在 Beta。

### 如果你：macOS 用户，想要"开箱即用 + 轻量 AI 辅助"

**Kaku 是门槛最低的。** WezTerm 深度定制版，零配置启动，macOS 主题自动切换，内置 JetBrains Mono 和 macOS 字体渲染。AI 功能集中在"错误修复建议"和"自然语言转命令"两个场景，不喧宾夺主。

**代价**：仅 macOS，没有远程能力，没有手机端。AI 功能比较浅，更适合"偶尔用 AI 的终端用户"而不是"重度 agent 用户"。

### 如果你：想要"终端工作区"，不限定 AI 场景

**Otty 走的是另一个路线。** 它的定位不是"AI 管理工具"，而是"终端应该成为开发运维的主工作区"——带文件浏览器、快捷命令/SSH 启动器、块式终端 UI。目前还是 v0.1.0 早期阶段，没有 AI CLI 统一管理、凭证隔离、远程主机这些能力。如果你只是想要一个更好用的终端，而不是专门管 agent 的，可以关注一下。

**代价**：项目还在早期，功能有限，没有 Windows 和手机端，没有 AI 集成。

### 如果你：想要"终端 + 编辑器 + AI 一体"

**Terax 和 Kaku 都走这个路线，但方向不同。**

Terax 更像一个"AI 优先的终端编辑器"——内置 CodeMirror 6、Git 图、内联 AI 补全、AI edit diffs，更像 VS Code 的终端替代品。

Kaku 更像一个"被 AI 增强的终端"——保留了 WezTerm 的终端本质，AI 是辅助功能不是核心。

## 架构差异

```
┌─────────────────────────────────────────────────────────┐
│                    AI 终端管理工具生态                      │
├─────────────┬─────────────┬──────────────┬───────────────┤
│  控制台型    │  编排器型    │   终端增强型   │  原生终端型   │
│  Codux      │  Orca       │   Terax      │  Cmux        │
│  Otty       │             │   Kaku       │              │
│  统一管理    │  并行分发    │  内置 AI 能力  │  原生体验     │
│  远程接管    │  比较合并    │  编辑+终端一体 │  通知系统     │
│  凭证隔离    │  GitHub集成 │  本地优先      │  可脚本化     │
└─────────────┴─────────────┴──────────────┴───────────────┘
```

## 写在最后

这 6 个项目其实不完全是竞品，它们解决的是同一个大问题下的不同子问题：

- **Codux** 解决的是"agent 散落各处"的问题——统一视图、worktree 隔离、Token 统计、凭证隔离、远程接管，它是目前覆盖面最全的。
- **Orca** 解决的是"哪个 agent 方案最好"的问题——并行分发 + 比较合并，是这几个里最偏"实验/迭代"的。
- **Terax** 解决的是"不想用 IDE 但想要 AI 辅助"的问题——终端 + 编辑器 + AI 一体，7-8MB 做到这个程度确实厉害。
- **Cmux** 解决的是"macOS 上 agent 通知混乱"的问题——原生体验 + 通知系统 + 可脚本化，是 macOS 用户的精致之选。
- **Kaku** 解决的是"终端配置太烦"的问题——零配置 + 轻量 + 主题感知，适合不想折腾又想用 AI 的人。
- **Otty** 解决的是"终端太窄"的问题——文件浏览器 + 块式终端 UI + 快捷命令，但项目还在早期（v0.1.0），目前没有 AI 管理能力。

**几个值得注意的边界：**

- 没有哪个项目同时支持所有平台。Codux 是跨平台最全的（macOS + Windows + Linux + 手机），但 Linux 主机端还是 Beta。
- 凭证隔离只有 Codux 明确做了。其他项目要么用 OS keychain（Terax），要么没提。如果你在团队环境里用 agent，凭证泄露风险需要自己评估。
- Worktree 隔离只有 Codux 和 Orca 做了。如果你经常并行跑多个 agent，没有 worktree 隔离意味着冲突风险你扛。
- 手机端只有 Codux、Orca 和 Cmux（iOS Beta）有。如果你有"跑一半出门"的需求，这三个值得关注。

最后，这些项目都在快速迭代中——Codux 刚发 2.0，Orca 每天发版，Cmux 有 nightly 频道。今天的功能对比，下个月可能就变了。建议按自己的实际场景挑一个先试，不要等"完美方案"。

#Codux #Otty #Terax #Orca #Kaku #Cmux #AI终端 #横向对比 #AI编程 #开源工具 #终端工具 #Worktree #凭证隔离