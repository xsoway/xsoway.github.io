---
title: "未命名"
created: "2026-05-03"
tags: ["Create a new repository","Open folder as vault","Use this template","10 个开箱即用的 AI 技能（Skills）","22 种原子化卡片模板","7 个主目录的信息架构","AI","AI 协作工具","AI 技能","Agent","OpenClaw"]
category: "Articles"
published: true
---
# 📝 未命名

- --
# DailyUp Second Brain Starter

> An opinionated **Obsidian second-brain template**, built from day one for long-term human–AI collaboration.
> 
> 一个为**人机长期协作**而生的 Obsidian 第二大脑模板 — 开箱即用，内置规则、模板和 AI 技能。

- --

## 这是什么

一套可以直接用的 Obsidian Vault 框架，包含：

- **7 个主目录的信息架构** — 系统规则 / 上下文 / 日记 / 项目 / 知识 / 参考 / 任务
- **22 种原子化卡片模板** — insight / book / mentalmodel / person / tool / quote …
- **10 个开箱即用的 AI 技能（Skills）** — `/today`、`/weekly-review`、`/closeday`、`/card-creator` 等
- **完整的 AI 协作规则** — CLAUDE.md + AGENTS.md 让 Claude Code / Codex / Cursor 立刻理解你的知识库
- **Obsidian Bases 数据库视图** — Books、Persons、Resources、Opensource、Subscriptions
- **清晰的写作规范、命名规范和任务管理规则**

核心设计理念：**让知识能长期积累、让 AI 能长期协作**。

- --

## 为什么做这个

市面上的 PKM 模板大多有三个问题：

1. **结构混乱** — 随手一分类，越用越乱
2. **没考虑 AI** — 模板为人类读写设计，AI 无从下手
3. **没法长期维护** — 缺少规则，一年后回看全是"遗迹"

本模板的回答：

|痛点|本模板的做法|
|---|---|
|信息该放哪里？| `00_System/Vault_Map.md` 给出明确路由规则|
|AI 怎么理解我？| `CLAUDE.md` + `01_Context/` 五件套固定长期上下文|
|怎么避免重复？| `.templates/` 提供统一模板，所有卡片/项目走同一个骨架|
|知识怎么沉淀？|22 种原子化卡片 + 双向链接构成知识网络|
|每天怎么推进？|内置 `/today`、`/closeday`、`/weekly-review` 三个常用 AI 技能|

- --

## 5 分钟快速上手

详见 [`QUICK_START.md`](https://github.com/jexchan/dailyup-second-brain-starter/blob/main/QUICK_START.md)。简要流程：

```shell
# 1. 用这个 repo 作为模板，在 GitHub 上创建你自己的 Vault
#    (点击 "Use this template" 按钮)

# 2. 克隆到本地
git clone https://github.com/<your-user>/<your-vault>.git my-brain
cd my-brain

# 3. 用 Obsidian 打开这个文件夹
#    Obsidian → Open folder as vault → 选择 my-brain/

# 4. 填写你的个人上下文（5 个文件）
#    编辑 01_Context/ 下的 About_Me / Mission_and_Vision /
#    Brand_Voice / Audience_Profiles / Current_Priorities

# 5. 安装 Claude Code / Codex / Cursor，跑第一个 Skill
#    /session-brief   → 让 AI 读懂你的 Vault
#    /today           → 生成今日计划
#    /card-creator    → 创建你的第一张知识卡片
```

- --

## 目录结构

```
.
├── 00_System/         # 规则、导航、写作规范、AI 工作原则
├── 01_Context/        # 全局上下文（你是谁、想做什么、写给谁看）
├── 02_Daily/          # 每日记录（含 Daily Note 模板）
├── 03_Projects/       # 项目管理（含 8 件套模板 + 示例项目）
├── 04_Knowledge/      # 长期知识沉淀
│   ├── 00_Cards/      # 22 种原子化卡片 + 6 张示例
│   ├── 01_Topics/     # 主题学习笔记
│   └── Frameworks/    # 方法论手册
├── 05_References/     # 剪藏文章（Inbox → 分类 → 提炼 → 归档）
├── 06_Tasks/          # 任务收集（Inbox / This_Week / Waiting）
├── 07_Bases/          # Obsidian 数据库视图
├── Attachments/       # 附件统一存放
├── .obsidian/         # Obsidian 配置（已精简）
├── .claude/skills/    # Claude Code 技能
├── .agents/skills/    # 通用 Agent 技能（与 .claude 同步）
├── CLAUDE.md          # AI 协作总导航（Claude 专用）
└── AGENTS.md          # AI 协作总导航（通用，软链到 CLAUDE.md）
```

- --

## 内置 AI 技能

> 所有技能都在 `.claude/skills/` 和 `.agents/skills/` 下。

|技能|用途|触发方式|
|---|---|---|
| `session-brief` |读懂当前 Vault 状态|开新会话时|
| `today` |根据任务和优先级生成今日计划|"今日计划怎么安排"|
| `closeday` |日终复盘|"帮我结束今天"|
| `weekly-review` |周度回顾与下周规划|"做个周报"|
| `card-creator` |根据输入自动创建对应类型的卡片|"帮我建一张卡"|
| `brain-storming` |围绕一个主题多维度发散|"头脑风暴 X"|
| `random-thinking` |跨主题随机抽卡做关联思考|"给点灵感"|
| `connect` |连接两个主题，找出桥梁概念|"连接 X 和 Y"|
| `trace` |追踪一个主题在 Vault 中的演化|"追踪 X 的演化"|
| `check-health` |检查孤立卡片、失效链接、矛盾观点|"检查知识库健康"|

- --

## 你需要什么

* *必备**：

- [Obsidian](https://obsidian.md/)（免费）
- Git（用于版本控制和同步）

* *强烈推荐**：

- [Claude Code](https://claude.com/claude-code) / [Codex CLI](https://developers.openai.com/codex/cli/) / [Cursor](https://cursor.com/) — 才能发挥 Skills 的价值

* *Obsidian 插件**（Core 插件够用，可选增强）：

- Templater — 动态模板变量
- Dataview — 数据库式查询
- Tasks — 任务管理

- --

## 它适合谁

- ✅ 想认真搭建**长期使用**的第二大脑，而不是玩票
- ✅ 已经在用 / 准备用 **AI 协作工具**（Claude Code / Cursor / Codex）
- ✅ 愿意花 30 分钟把 5 个 Context 文件填好，换来 AI 长期精准协作
- ✅ 喜欢**文件优先、本地可控**的知识管理方式

它**不**适合谁：

- ❌ 只想要一个能用一周的"漂亮模板"
- ❌ 完全不打算用 AI 协作（那本模板的一半价值都用不上）
- ❌ 只用手机做笔记 —— Obsidian 桌面端体验更好

- --

## 如何定制

- **结构**：可以改目录名和编号，但请同步更新 `00_System/Vault_Map.md` 和 `CLAUDE.md`
- **卡片类型**：直接在 `04_Knowledge/00_Cards/.templates/` 添加新类型
- **AI 技能**：在 `.claude/skills/` 下新建目录，写一个 `SKILL.md` 即可
- **规则**：`00_System/` 下的规则都是你的，改即可。改完告诉 AI"请读一下新规则"

# 5 分钟快速上手

本文档一步步教你从零把这个 Vault 跑起来。

- --

## 前置条件

你需要先装好：

1. ** [Obsidian](https://obsidian.md/) ** — 免费下载
2. **Git** — `xcode-select --install`（macOS）或从 [git-scm.com](https://git-scm.com/) 下载
3. **（推荐）Claude Code / Codex CLI / Cursor** — 用来跑 AI Skills

- --

## 第 1 步：创建你的仓库

### 方式 A：使用 GitHub 模板（推荐）

1. 打开本仓库的 GitHub 页面
2. 点右上角 **"Use this template"** → **"Create a new repository"**
3. 命名（如 `my-brain`），选择 public 或 private
4. 克隆到本地：

```shell
git clone https://github.com/<your-user>/<your-vault>.git my-brain
cd my-brain
```

### 方式 B：直接克隆

```shell
git clone https://github.com/<this-repo>/dailyup-second-brain-starter.git my-brain
cd my-brain
rm -rf .git
git init
git add -A
git commit -m "initial commit from starter"
```

- --

## 第 2 步：用 Obsidian 打开

1. 打开 Obsidian
2. 如果是第一次 → **"Open folder as vault"**
3. 选择 `my-brain/` 文件夹
4. Obsidian 会读取 `.obsidian/` 里的配置并打开 Vault

第一次打开可能提示"Trust author and enable plugins?"，可以**先选 No**（后面再决定是否启用第三方插件）。

- --

## 第 3 步：填写你的个人上下文

这是**最重要的一步**。花 10–15 分钟认真填写，AI 协作质量会好 10 倍。

编辑 `01_Context/` 下这 5 个文件，把里面的 `<!-- ... -->` 占位替换成你自己的内容：

|文件|填什么|
|---|---|
| `About_Me.md` |你是谁、你在做什么|
| `Mission_and_Vision.md` |你的长期使命与愿景|
| `Brand_Voice.md` |你希望 AI 帮你写作时用什么风格|
| `Audience_Profiles.md` |你的内容写给谁看（如果不输出内容可以简写）|
| `Current_Priorities.md` |你最近 3 个月最重要的事|

> 💡 **小技巧**：如果一时写不全，先写粗糙版本。这是活文件，以后可以随时更新。

- --

## 第 4 步：试跑第一个 AI 技能

打开 Claude Code / Codex / Cursor，在 `my-brain/` 目录下运行：

### 试试 `/session-brief`

让 AI 读懂你的 Vault：

```
/session-brief
```

AI 会读取 `AGENTS.md` / `CLAUDE.md` → `01_Context/` → 最近的 Daily Notes → 当前任务，然后给你一份「当前状态摘要」。

这也是每次开新会话时推荐的第一步。

### 试试 `/today`

```
/today
```

AI 会基于你填好的 `Current_Priorities.md` + `06_Tasks/Inbox.md` + `03_Projects/*/04_Next.md`，生成一份今日聚焦计划。

- --

## 第 5 步：创建你的第一张卡片

直接跟 AI 说：

```
帮我建一张 insight 卡片：「早上写作比晚上更高效」
```

`card-creator` 技能会自动：

1. 识别你要的卡片类型（insight）
2. 从 `04_Knowledge/00_Cards/.templates/Insight_Card.md` 取模板
3. 填充内容，保存到 `04_Knowledge/00_Cards/insight_早上写作比晚上更高效.md`

- --

## 第 6 步：删除示例内容

最简单的方式——跑内置的初始化脚本：

```shell
bash scripts/init.sh
```

它会交互式地：

- 逐个确认是否删除 `_EXAMPLE_*` 示例文件
- 删除 `_Example_Project/`
- 为今天创建第一篇 Daily Note
- 提醒你去填写 `01_Context/` 五件套

如果你想跳过所有确认一键清理：

```shell
bash scripts/init.sh --yes
```

或者手动删除：

```shell
rm 02_Daily/_EXAMPLE_*.md
rm -rf 03_Projects/_Example_Project
rm 04_Knowledge/00_Cards/_EXAMPLE_*.md
rm 05_References/01_Inbox/_EXAMPLE_*.md
```

也可以把示例留着作为参考，不影响使用。

- --

## 第 7 步：建立写作习惯

* *最小可用的日常工作流**：

```
早上  /today            → 今日聚焦计划
白天  创建 Daily Note + 随时记录进展
      随手创建 insight/quote/book 卡片
晚上  /closeday         → 回顾今天
周末  /weekly-review    → 周度回顾
```

- --

## 常见问题

### Obsidian 找不到我刚创建的卡片？

- 检查文件是否在 `04_Knowledge/00_Cards/` 根目录（不要在 `.templates/` 里）
- 尝试 `Cmd+P` → "Reload app without saving"

### Skill 不生效？

- 确保 `.claude/skills/` 和 `.agents/skills/` 在 Vault 根目录
- 确保你的 Claude Code / Codex 版本支持 Skills
- 查看具体 Skill 的 `SKILL.md` 了解调用约定

### 如何让 Vault 多端同步？

推荐两种方式：

1. **Git + 自己的 GitHub 仓库**（免费，版本历史完整）
2. ** [Obsidian Sync](https://obsidian.md/sync) **（付费，无缝）

### 可以把这个做成私有仓库吗？

完全可以。License 允许私用、修改、商用。

- --

## 下一步

- 读一下 `00_System/` 下的所有规则文件，了解写作和命名规范
- 浏览 `04_Knowledge/00_Cards/.templates/`，看看 22 种卡片模板分别长啥样
- 看 `07_Bases/`，用 Obsidian Bases 插件查看数据库视图
- 浏览 `.claude/skills/` 下的 Skill 定义，按需新增你自己的