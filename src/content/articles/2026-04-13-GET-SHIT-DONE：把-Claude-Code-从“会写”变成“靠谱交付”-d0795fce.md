---
title: "GET SHIT DONE：把 Claude Code 从“会写”变成“靠谱交付”"
created: "2026-04-13"
published: true
---
# GET SHIT DONE：把 Claude Code 从“会写”变成“靠谱交付”

凌晨两点，IDE 还亮着，聊天框里已经来回改了四五轮。你明明一开始把边界说得很清楚：做什么、不做什么、验收是什么。Claude Code 也答得像模像样。可项目一旦开始滚动：加几段日志、贴一坨 README、补一轮需求，再来一次“顺便把 X 也改了”，上下文窗口一满，质量就开始肉眼下滑——不是不会写，而是**越写越偏，越偏越自信**。

这东西有个很难听但很真实的名字：**context rot**。上下文烂掉以后，返工最贵的不是代码本身，而是“我们到底在做什么”的共识被冲散了。

GSD（GET SHIT DONE）解决的就是这个问题。

它不是再造一个 AI 编码工具，而是在 Claude Code、OpenCode、Gemini CLI、Kilo、Codex、Copilot、Cursor、Windsurf、Antigravity、Augment、Trae、Cline 这些运行时外面，加一层**轻量但强势的上下文工程 + 元提示 + 规格驱动协作层**。

你看到的只是几个命令；系统内部则把规格文件、研究产物、计划、执行记录、验证清单和状态记忆都落到仓库结构里，让 AI 协作不再靠“当前这轮对话刚好没跑偏”。

## 一、它解决的不是“写代码”，而是“对齐 + 可验证”

很多人高频用 AI 编码，返工依然多，根因往往不是模型弱，而是流程太散：需求在聊天里，约束在脑子里，验收在嘴上。

GSD 的主张很直接：**先把意图写成可审阅的规格，再写代码。**

它把最容易丢的那几类信息，强行“写回仓库”：

- 为什么要改（intent）
- 这次改到哪（scope）
- 哪些明确不做（out-of-scope）
- 怎么验收（verify / UAT）
- 当前进度和阻塞（state）

所以评审时先看意图，不是先看 diff。它很像 OpenSpec 那类 planning layer，但更“低摩擦”：你不是去填一堆企业流程表格，而是用命令把结构化产物自然生成出来。

## 二、它是怎么工作的：把一次交付拆成可复用的 6 步

这里才是 GSD 真正像工程系统的地方。

> 已经有现成代码库？先跑 `/gsd-map-codebase`。它会并行拉多个代理分析技术栈、架构、约定、风险点。后面再 `/gsd-new-project`，提问会更聚焦，你会明显感觉“它真的理解你现在的代码长什么样”。

### 1) 初始化：/gsd-new-project

一个命令，一条完整流程：

- 持续追问：问到理解目标、约束、技术偏好、边界情况
- 并行研究：拉研究代理补领域知识（可选，但强烈建议）
- 需求梳理：拆 v1/v2，标出 out-of-scope
- 路线图：生成阶段规划

产物会落到仓库里（而不是停在聊天记录）：

- `PROJECT.md` / `REQUIREMENTS.md` / `ROADMAP.md` / `STATE.md`
- `.planning/research/`

### 2) 讨论：/gsd-discuss-phase 1

这一步是“把你的偏好写进上下文”。路线图里每个阶段往往就一两句话，不够让系统按你脑中的样子实现。

系统会识别灰区持续追问：UI 布局、API flags、错误处理、内容结构、例外情况……最终生成 `CONTEXT.md`，后续研究与规划都会读它。

产物：`{phase}-CONTEXT.md`

### 3) 规划：/gsd-plan-phase 1

- 结合 `CONTEXT.md` 做研究
- 生成 2~3 份原子化任务计划（XML 结构）
- 用 plan checker 反复对照需求直到通过

产物：`{phase}-RESEARCH.md`、`{phase}-{N}-PLAN.md`

### 4) 执行：/gsd-execute-phase 1

这是它“反 context rot”的硬招：

- 按 wave 执行：能并行的并行，有依赖的顺序
- 每个计划用新上下文：20 万 token 只用于实现，不背历史垃圾
- 每个任务独立提交：git 历史干净，可追踪，可回滚
- 执行后对照目标验证

产物：`{phase}-{N}-SUMMARY.md`、`{phase}-VERIFICATION.md`

### 5) 验证：/gsd-verify-work 1

自动化验证能检查“代码存在、测试通过”，但它不保证“真的符合预期”。verify-work 会：

- 提取可测试交付项
- 逐项带你验收
- 失败自动诊断（debug 代理）
- 生成可立刻执行的修复计划

产物：`{phase}-UAT.md` + 修复计划

### 6) 循环到发布：/gsd-ship / /gsd-next

完整循环：讨论 → 规划 → 执行 → 验证 → 发布。也可以 `/gsd-next` 自动推进。

对于临时任务还有 `/gsd-quick`：保留核心保障（原子提交、状态跟踪），但路径更短。

## 三、为什么它有效：不是魔法，是把“上下文”工程化

GSD 最硬的一点是：它不指望你每次都能写出完美 prompt，而是把 prompt 变成**结构化产物**。

### 1) 上下文工程：用文件把“共识”固定下来

核心文件大概是这些（按作用理解就行）：

| 文件/目录 | 作用 |
| --- | --- |
| PROJECT.md | 项目愿景，始终加载 |
| REQUIREMENTS.md | 带 phase 的范围定义（v1/v2） |
| ROADMAP.md | 阶段路线图 |
| STATE.md | 决策/阻塞/当前位置，跨会话记忆 |
| research/ | 生态知识：技术栈、模式、坑点 |
| PLAN.md | 原子任务（XML）+ 验证步骤 |
| SUMMARY.md | 做了什么、改了什么，写入历史 |
| todos/ | 后续停车场 |

### 2) XML 计划：把“猜”变成“按说明执行”

计划不是随口列 todo，而是类似这样（示意）：

```xml
<task type="auto">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    Use jose for JWT.
    Validate credentials.
    Return httpOnly cookie.
  </action>
  <verify>curl ... returns 200 + Set-Cookie</verify>
  <done>Valid=200, invalid=401</done>
</task>
```

指令精确、验证内建，减少“AI 自己脑补”的空间。

### 3) 多代理 + wave：把并行变成可控的吞吐

wave 的价值很简单：

- 独立任务同 wave 并行
- 依赖任务进下一 wave
- 冲突任务顺序执行或合并

这也解释了为什么“垂直切片”比“水平分层”更容易并行。

## 四、安装与验证：支持 12 个运行时 + CI/脚本模式

快速安装：

```bash
npx get-shit-done-cc@latest
```

安装器会让你选：

- 运行时：Claude Code、OpenCode、Gemini、Kilo、Codex、Copilot、Cursor、Windsurf、Antigravity、Augment、Trae、Cline，或全部
- 安装位置：全局（所有项目）或本地（仅当前项目）

验证方式：

- Claude Code / Gemini / Copilot / Antigravity：`/gsd-help`
- OpenCode / Kilo / Augment / Trae：`/gsd-help`
- Codex：`$gsd-help`
- Cline：检查 `.clinerules` 是否存在

### 非交互式安装（Docker / CI / 脚本）

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

# Windsurf
npx get-shit-done-cc --windsurf --global
npx get-shit-done-cc --windsurf --local

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

### 开发安装（方便贡献前本地测试）

```bash
git clone https://github.com/gsd-build/get-shit-done.git
cd get-shit-done
node bin/install.js --claude --local
```

### 权限：推荐“跳过确认” vs 细粒度 allowlist

GSD 的设计目标是无摩擦自动化。Claude Code 建议用：

```bash
claude --dangerously-skip-permissions
```

如果你不想用这个 flag，可以在项目 `.claude/settings.json` 加 allowlist（示例）：

```json
{
  "permissions": {
    "allow": [
      "Bash(date:*)",
      "Bash(echo:*)",
      "Bash(cat:*)",
      "Bash(ls:*)",
      "Bash(mkdir:*)",
      "Bash(wc:*)",
      "Bash(head:*)",
      "Bash(tail:*)",
      "Bash(sort:*)",
      "Bash(grep:*)",
      "Bash(tr:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git status:*)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git tag:*)"
    ]
  }
}
```

## 五、配置：把“质量/成本/自动化程度”调到你想要的位置

GSD 配置在 `.planning/config.json`，常用的几类：

| 设置 | 可选值 | 默认 | 作用 |
| --- | --- | --- | --- |
| mode | yolo / interactive | interactive | 自动批准还是每步确认 |
| granularity | coarse / standard / fine | standard | phase 粒度 |
| profile | quality / balanced / budget / inherit | balanced | 规划/执行/验证的模型分配 |
| workflow.research | true/false | true | 规划前研究 |
| workflow.plan_check | true/false | true | 计划检查 |
| workflow.verifier | true/false | true | 执行后验证 |

Git 分支策略也能配：none / phase / milestone。

## 变更摘要（改了什么）

这版把 README 的“信息堆叠”拆成工程闭环：先讲 context rot 的真实触发机制，再把 GSD 的 6 步工作流按产物讲清楚，并把“为什么有效”的关键点收敛到：文件化上下文、XML 计划、wave 并行、原子提交与验证闭环。

同时把你补充的内容（开发安装、权限模式、完整命令体系、配置）做了结构化整理：该做成表格的做成表格，该留成可复制命令的保留成代码块。

## 风险点（哪里可能翻车）

最大风险是读者把它误读成“又一个流程工具”。所以这篇刻意强调：GSD 不演企业流程，它只是把上下文和意图工程化；另一个风险是权限跳过 flag 容易引起安全顾虑，需要明确替代方案（allowlist）和适用边界。

## 回滚方案（怎么撤）

如果你发现这套闭环对当前项目太重，最小回滚路径是保留“规格文件 + 验证”两件事：先写一页范围与验收（哪怕极简），再让 AI 实现；执行后用 verify 清单验收。工具可撤，习惯别撤。

## 行动清单（读完怎么做）

先在一个返工最多的存量项目里装 GSD（建议 local），跑一次 map-codebase，再走一遍 phase 1 的 discuss→plan→execute→verify；观察两件事：返工次数是否下降、上下文成本是否更可控；最后再决定是否开启 auto-advance，以及是否用 yolo 模式。

## 末尾 推荐标签（不少于5个）
#GSD #ClaudeCode #上下文工程 #ContextRot #规格驱动开发 #SpecDrivenDevelopment #AI编程 #工程化AI协作 #PlanExecuteVerify #CLI工具
