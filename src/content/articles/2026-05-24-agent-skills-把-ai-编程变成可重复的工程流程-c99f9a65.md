---
title: "2026-05-24-agent-skills-把-ai-编程变成可重复的工程流程"
created: "2026-05-24"
tags: ["KnowledgeBase","GitHub","Agent","AI","Engineering","Workflow","Testing"]
category: "AI 工程化"
published: true
---

# Agent Skills：把 AI 编程从“随缘输出”变成可重复的工程流程

很多团队用 AI 写代码，最难的不是“能不能写出来”，而是：

- 同样的需求，换个提示词就换个结果
- 代码能跑，但质量门槛靠运气
- 一到测试、review、上线，节奏就散了
- 需要的不是更会“催” AI，而是让流程本身更稳

Agent Skills 走的不是“再教你一套提示词”，而是把资深工程师平时真正会做的流程、质量门禁、验收口径，打包成一组可复用的 **skills**，让 AI 代理在每个阶段都按同一套标准做事。

## 先说结论：这项目到底是什么

一套“面向 AI coding agent 的工程工作流技能包”，用 7 个命令把需求、计划、实现、验证、评审、简化、发布串成闭环。

## 为什么值得看

项目主打的价值不玄学：把 AI 的输出从“灵感驱动”拉回到“流程驱动”。

- 有明确的生命周期入口：先规格（/spec），再拆任务（/plan），再增量实现（/build），再用测试证明（/test）
- 不只讲原则，还把“怎么做、做到什么算过关”写成步骤和检查门槛
- 把常见的自我合理化（比如“这次先不写测试”“先凑合上线”）提前堵住：每个 skill 都有验证 gate
- 需要专项视角时，不靠“临时扮演”，而是给了现成的 personas（代码评审、测试工程、安全审计）

## 项目核心能力拆解

### 1) 7 个命令，把开发生命周期定死在轨道上

官方给的 7 个 slash 命令，基本覆盖从定义到上线的主路径：

- `/spec`：先把要做什么讲清楚（Spec before code）
- `/plan`：把事情拆成小而可验收的原子任务（Small, atomic tasks）
- `/build`：一片一片做，不一口吞（One slice at a time）
- `/test`：用测试证明它真的能用（Tests are proof）
- `/review`：合并前把健康度补齐（Improve code health）
- `/code-simplify`：把“能跑”变成“好维护”（Clarity over cleverness）
- `/ship`：上线是流程，不是仪式（Faster is safer）

边界也很清楚：这不是替代工程能力，而是把工程能力固化成可反复执行的流程。

### 2) 23 个 skills：从“抽象原则”落到“可执行工作流”

项目打包了 23 个 skills（22 个生命周期技能 + 1 个 meta skill），每个都是结构化工作流：步骤、验证门槛、以及避免自欺的清单。

一个很实用的点是：除了通过命令触发，也可以直接引用某个 skill 来强制当前任务的工作方式（比如 UI、API、性能、安全、调试等）。

### 3) 三类 personas：把 review 视角外包成“可复用角色”

当团队需要更尖锐的评审视角时，这套项目直接给了三种人格化入口：

- `code-reviewer`：按资深工程师的标准审变更
- `test-engineer`：从覆盖与证明角度逼问“哪里没被验证”
- `security-auditor`：从风险与攻击面角度逼问“哪里会被打穿”

它的价值不在“更像人”，而在“更像流程”：每次都按同一套 checklist 来挑毛病。

### 4) Reference checklists：把常用清单变成随取随用的“外挂大脑”

项目把测试、安全、性能、可访问性这些领域常用的检查项，放成独立 references，让 skills 需要时直接拉进来用。

好处是：不会每次都靠 AI 临场“编一个 checklist”，而是复用同一份清单持续迭代。

## 上手成本到底高不高

整体更像“接一套工作流规则”，而不是“装一个库就完事”。但好在官方给了不同工具栈的落地方式。

如果用 Claude Code，官方示例是直接从 marketplace 安装：

```
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```

遇到 SSH 克隆报错，官方也给了用 HTTPS 强制走 HTTPS 的方案：

```bash
/plugin marketplace add https://github.com/addyosmani/agent-skills.git
/plugin install agent-skills@addy-agent-skills
```

如果是本地开发 / 调试，官方示例是：

```bash
git clone https://github.com/addyosmani/agent-skills.git
claude --plugin-dir /path/to/agent-skills
```

如果用 Gemini CLI，官方给了安装命令：

```bash
gemini skills install https://github.com/addyosmani/agent-skills.git --path skills
```

以及从本地 clone 安装：

```bash
gemini skills install ./agent-skills/skills/
```

边界提醒：这套东西的“收益”跟团队是否愿意遵守流程强相关。想要只拿来当提示词合集，效果会打折。

## 怎么用：按真实使用路径走一遍

先把“从需求到上线”的主路径走一遍，理解它在团队里应该怎么落位。

### 1) 安装 / 接入过程（用一张流程图说清楚）

```mermaid
flowchart LR
  A[选定运行环境<br/>Claude Code / Cursor / Gemini CLI 等] --> B[安装 Agent Skills]
  B --> C[进入一次真实需求]
  C --> D[/spec 明确目标与边界]
  D --> E[/plan 拆成可验收小任务]
  E --> F[/build 增量实现]
  F --> G[/test 用测试证明]
  G --> H[/review 质量门禁与修复]
  H --> I[/code-simplify 复杂度下沉]
  I --> J[/ship 上线与回滚准备]
```

### 2) 实际使用过程：从“写清楚”开始，而不是从“写代码”开始

一个更符合工程直觉的用法是：把每一次需求当成一次小型交付，先逼出规格，再逼出可验证的任务列表，然后才允许代码出现。

这里有一个关键点：**/test 的位置不是“最后再补”，而是贯穿式的证明工具**。不然流程看起来很完整，实际还是“写完再祈祷”。

### 3) 产出结果：把结果落到“可协作、可审查、可复用”

走完一轮之后，理想产出不是“某次输出很惊艳”，而是：

- 同样类型的任务，下次还能按同样节奏推进
- 评审不靠运气：门禁、清单、验收口径是固定的
- 测试变成默认语言：讨论从“感觉没问题”变成“证据在哪里”

### 示例对话：

```text
你:
团队里用 AI 写代码总是“能跑但不稳”，想把需求、拆任务、实现、测试、评审、上线变成固定节奏。

AI:
先别写代码。用 /spec 把目标、范围外、验收标准、测试策略写出来；再用 /plan 拆成 3-5 个可验证的小任务。每个任务都要有“怎么证明它做对了”的测试或检查点。
```

> 实际协作示例：上面这段对话是在演示“把工作推进方式固定成流程”的协作节奏，不代表项目自带某种特定工具能力。

## 哪些地方是真的香

- 把“工程常识”写成可执行步骤和门禁，减少临场发挥
- 用命令把节奏固定下来，避免一上来就陷进代码细节
- persona + checklist 让评审变得稳定、可复用

## 哪些人会更适合

- 想把 AI coding 接进团队主流程，而不是个人爽写
- 经常踩“没规格、没测试、没验收”的坑，需要统一口径
- 需要把变更拆小、能回滚、能逐步上线的团队
- 想让 code review 变快，但又不想牺牲质量门禁
- 需要在安全、性能、可访问性上有固定检查清单的产品团队

## 使用前最好知道的边界

- 这套项目核心是“流程固化”，不是“生成更聪明的代码”：流程不愿意执行，收益会非常有限
- 安装方式依赖你用的 agent / IDE / CLI，不同环境的接入路径不一样，需要按官方提供的 setup 文档落地
- personas 提供的是评审视角与检查框架，不等同于真实的组织评审流程；高风险变更仍然需要人做最终决策

## 收尾总结

Agent Skills 的看点不是“又一套 AI 提示词”，而是把开发生命周期写成了可重复执行的工程动作。愿意把节奏交给流程的团队，用它会更省心；只想要一次性灵感输出的团队，用它会觉得“太规矩”。

## 推荐标签

#AI编程 #工程化 #开发流程 #测试驱动 #代码评审 #自动化 #GitHub项目 #AgentSkills #ClaudeCode #Cursor #GeminiCLI

