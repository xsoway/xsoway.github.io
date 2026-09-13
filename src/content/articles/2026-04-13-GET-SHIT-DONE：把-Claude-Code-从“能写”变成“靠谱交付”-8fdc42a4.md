---
title: "GET SHIT DONE：把 Claude Code 从“能写”变成“靠谱交付”"
created: "2026-04-13"
published: true
---
# GET SHIT DONE：把 Claude Code 从“能写”变成“靠谱交付”

昨晚我是真被“上下文发霉”这事儿整烦了。

你一开始跟 Claude Code 说得好好的：要做什么、别做什么、边界在哪。它也答得很聪明。结果项目一跑起来，补两轮需求、贴几段日志、再改几个文件，窗口一满，输出质量就开始肉眼下滑——不是不会写，是越写越偏，越偏越自信。

这东西有个很难听但很真实的名字：**context rot**。上下文烂掉以后，你会发现返工最贵的不是代码，而是“我们到底在做什么”的共识被冲散了。

GSD（GET SHIT DONE）就是冲着这个来的。

它不是再造一个 AI 编码工具，而是在 Claude Code、OpenCode、Gemini CLI、Kilo、Codex、Copilot、Cursor、Windsurf、Antigravity、Augment、Trae、Cline 这些工具外面，加一层更轻、更稳的“上下文工程 + 元提示 + 规格驱动”工作流。

你看起来只是在跑几条命令，但背后它会帮你做三件事：把要做的事写成规格、把上下文整理成能复用的结构、把 AI 的执行拆成可验证的阶段。

## 一、它到底解决什么问题：不是“写不出来”，是“总写偏”

这两年 AI 编码助手的能力涨得很猛，但团队返工并没有同比下降。

原因很简单：**AI 会写，不等于你们对齐。**

很多需求散在聊天记录里，今天加一句“顺便…”，明天改一句“其实…”，到最后人和 AI 都觉得懂了，可一落地就开始跑偏。你回头翻对话，越翻越像在查案。

GSD 的核心主张是：**先把意图写成可审阅的规格，再写代码。**

它把“为什么这么改、这次改到哪、哪些不在范围”这些最容易丢的东西，强行拉回到一个稳定的结构里。你评审的时候，不是先看 diff，而是先看意图。

说白了：它帮你把 AI 从“聊天同事”变成“能交付的队友”。

## 二、它怎么做：复杂留在系统里，你只管下命令

作者是独立开发者，目标也很明确：不想演 50 人公司的流程，不想搞冲刺仪式、故事点、Jira 流水线那套。

GSD 的思路很“反企业”：复杂性在系统内部，不在你的工作流里。

你看到的只是几个能用的命令。

系统内部则是上下文工程、XML 提示格式、子代理编排、状态管理这些东西在跑。它会把 Claude 完成工作以及验证结果所需的上下文准备好，让 AI 不至于边写边失忆。

## 三、适合谁用：想把需求说明白的人

GSD 最适合的不是“流程控”，而是那种——

你想把东西做出来，但又不想把自己变成流程管理员的人。

尤其是这几种情况：

- 你已经在高频用 Claude Code / Codex / Cursor，但经常返工
- 你的需求会跨多轮对话迭代，越聊越乱
- 你希望评审先看“意图和边界”，再看代码
- 你想把 AI 协作变成可复制、可审计、可沉淀的团队能力

## 四、更新亮点（v1.32.0）：它在补“工程上的牙齿”

这版更新有几个点挺工程的，能看出它不是在堆概念：

- **STATE.md 一致性检查**：`state validate` 检测状态与文件系统偏差，`state sync` 可重建
- **`--to N` 阶段停止**：跑到某一阶段就停，适合你想先看规划再决定
- **研究门控**：RESEARCH.md 有开放问题就阻止规划，避免带病上路
- **验证范围过滤**：把后续阶段处理的差距标记为“延迟”，不混进本阶段
- **读取后编辑保护**：防止无限重试循环
- **上下文缩减**：截断 + 缓存友好排序，少烧 token
- **新增 4 个运行时**：Trae、Kilo、Augment、Cline（总计 12 个）

这些更新的共同点是：**它在把“可控性”和“可验证性”往前提**。

## 五、快速开始：装完怎么验

安装就是一条命令：

```bash
npx get-shit-done-cc@latest
```

安装器会让你选两件事：

- 运行时：Claude Code、OpenCode、Gemini、Kilo、Codex、Copilot、Cursor、Windsurf、Antigravity、Augment、Trae、Cline，或者全部
- 安装位置：全局（所有项目）或本地（仅当前项目）

装完验证也很简单：

- Claude Code / Gemini / Copilot / Antigravity：`/gsd-help`
- OpenCode / Kilo / Augment / Trae：`/gsd-help`
- Codex：`$gsd-help`
- Cline：检查项目里是否出现 `.clinerules`

如果你在 Docker / CI 里跑，直接用非交互式安装：

```bash
# Claude Code
npx get-shit-done-cc --claude --global
npx get-shit-done-cc --claude --local

# OpenCode
npx get-shit-done-cc --opencode --global

# Gemini CLI
npx get-shit-done-cc --gemini --global

# Kilo
npx get-shit-done-cc --kilo --global
npx get-shit-done-cc --kilo --local

# Codex
npx get-shit-done-cc --codex --global
npx get-shit-done-cc --codex --local

# Copilot
npx get-shit-done-cc --copilot --global
npx get-shit-done-cc --copilot --local

# Cursor
npx get-shit-done-cc --cursor --global
npx get-shit-done-cc --cursor --local

# Antigravity
npx get-shit-done-cc --antigravity --global
npx get-shit-done-cc --antigravity --local

# Augment
npx get-shit-done-cc --augment --global
npx get-shit-done-cc --augment --local

# Trae
npx get-shit-done-cc --trae --global
npx get-shit-done-cc --trae --local

# Cline
npx get-shit-done-cc --cline --global
npx get-shit-done-cc --cline --local

# All
npx get-shit-done-cc --all --global
```

保持更新也就是再跑一次：

```bash
npx get-shit-done-cc@latest
```

## 变更摘要（改了什么）

这版把原始 README 的“功能点堆叠”改成了更像真人复盘的叙述：先从 context rot 的真实痛点切入，再解释 GSD 为什么不是流程工具而是对齐层，最后把安装与验证写成可复制的路径。

同时把 v1.32.0 的亮点收敛成“工程牙齿”的视角：它不是在堆命令，而是在补可控性、可验证性和上下文成本管理。

## 风险点（哪里可能翻车）

如果读者没体验过“上下文烂掉”，可能会觉得这是在制造焦虑；另外，规格驱动这套东西如果写得过重，就会被误解成“又要写文档”。所以这篇刻意强调“复杂留在系统里，你只管下命令”，避免把它写成流程宣讲。

## 回滚方案（怎么撤）

如果你试了发现太重，最小回滚就是：只保留一条“先写规格”的习惯——把需求边界先写进仓库（哪怕只是一页），再让 AI 去改代码。工具不用强上，习惯先立住。

## 行动清单（读完怎么做）

先在一个返工最多的项目里装 GSD（建议先 local），跑一次 propose / plan，让规格文件先落地；再挑一个小变更走完整流程，观察返工次数和 token 成本；最后再决定要不要把它推广到团队的默认工作流。

## 末尾 推荐标签（不少于5个）
#GSD #ClaudeCode #上下文工程 #规格驱动开发 #AI编程 #ContextRot #工程协作 #提效工具 #CLI工具 #开发工作流
