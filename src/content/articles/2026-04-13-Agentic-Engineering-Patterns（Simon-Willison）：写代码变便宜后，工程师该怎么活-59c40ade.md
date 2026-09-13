---
title: "Agentic Engineering Patterns（Simon Willison）：写代码变便宜后，工程师该怎么活"
created: "2026-04-13"
published: true
---
> 图片资源未同步：未命名图片

# Agentic Engineering Patterns（Simon Willison）：写代码变便宜后，工程师该怎么活

这份指南来自 Simon Willison，总结了一套“跟 Coding Agent 合作”的工程模式。主角是 Claude Code / Codex 这类能读仓库、能改代码、能跑命令的工具。

别把它当“提示词秘籍”。它更像一份新的工程常识：**代码的输入成本变得很低，但代码的维护/理解/验证成本一点没便宜。**

原文入口：https://simonwillison.net/guides/agentic-engineering-patterns/

---

## TL;DR（一句话版本）
- 代码现在很便宜，但“好代码”仍然昂贵：测试、评审、理解、回滚、可观测才是账本。
- 用 agent 最稳的姿势是：**让它跑测试、写测试、解释代码、产出可审阅的变更**，别让它瞎扩散。

---

## 1）写代码变便宜了：你原来的工程直觉会失效
对应章节：Writing code is cheap now

### 译文要点
- 过去“写几百行干净、可测试的代码”要一整天，所以我们养成了大量围绕“编码时间昂贵”的习惯：估算、规划、取舍。
- Coding Agent 极大降低了“把字打进电脑”的成本，直接打乱了这些权衡。
- 并行 agent 更夸张：一个人同时在多个地方实现/重构/测试/写文档。

### 经验（怎么落地）
- 把“写代码”当成便宜操作，把“合并代码”当成昂贵操作：PR 门禁、测试门禁、回滚门禁要更硬。
- 并行 agent 不是免费午餐：并行产出越多，review/集成/冲突/认知负担越大。要先限范围、再扩规模。

原文：https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/

---

## 2）囤“你会怎么做”的解决方案：这是你和 agent 协作的弹药库
对应章节：Hoard things you know how to do

### 译文要点
- 软件工程很大一部分能力来自“知道什么可行、怎么做大概可行”。
- 这种知识既包括常见问题，也包括很偏门的问题。
- 仅仅知道理论上可行不够，最好有“跑过的代码”当证据。
- 作者把这些解法囤在 blog、TIL、GitHub repo 里，最近也会用 LLM 扩充这套“解法库”。

### 经验（怎么落地）
- 建一个“POC/recipes 仓库”：每个目录解决一个问题（带最小可运行例子 + 解释 + 失败模式）。
- agent 产出的 POC 也要进仓库：否则你只是在消费输出，没有沉淀资产。

原文：https://simonwillison.net/guides/agentic-engineering-patterns/hoard-things-you-know-how-to-do/

---

## 3）测试不再是可选项：先跑测试，再让 agent 动手
对应章节：First run the tests + Red/green TDD

### 译文要点（First run the tests）
- 用 coding agent 时，自动化测试不再可选：以前“不写测试”的借口（太耗时、改得快）在 agent 时代站不住。
- AI 生成的代码如果没跑过测试，上线能不能工作纯靠运气。
- 测试还能帮助 agent 理解代码库：agent 经常会先去读相关测试。
- 作者新开会话的常用提示词：先跑测试；Python 项目甚至直接让它跑 `uv run pytest`。

### 译文要点（Red/green TDD）
- “红/绿 TDD”是让 agent 更靠谱的简短提示：先写失败的测试（红），再实现让测试通过（绿）。
- 能避免两种常见风险：写出没用的代码；写出根本跑不起来的代码。
- 关键是“先确认测试确实会失败”，不然你可能写了个本来就通过的假测试。

### 经验（怎么落地）
- 给 agent 的第一条指令固定化：`先跑全量测试，贴出失败摘要，再开始改。`
- 对新功能：强制“先补测试再补实现”。对 agent 而言这是天然护栏。
- CI 分层：冒烟（快）/核心回归（中）/全量（慢）。不要每次都全跑到天荒地老。

原文：
- https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests/
- https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/

---

## 4）认知债：你不理解 agent 写的代码，迟早会慢死
对应章节：Interactive explanations + Linear walkthroughs

### 译文要点（Interactive explanations）
- 如果你失去对 agent 产出代码的理解，你就背上“认知债”（cognitive debt）。
- 一旦核心逻辑变成黑盒，你就无法自信推理、也难以规划新功能，最后像技术债一样拖慢你。
- 作者喜欢用“交互式解释”来还债：做一个可以动手试的最小交互工具，帮助理解内部机制。

### 译文要点（Linear walkthroughs）
- 让 agent 给代码库做“线性讲解”很有用：新项目上手、老代码回忆、甚至 vibe coded 完全不知道自己写了啥。
- 合适的 agent harness 能产出很细的 walkthrough，帮你快速恢复掌控感。

### 经验（怎么落地）
- 每次让 agent 大改后，追加一个任务：`给我一份从入口到核心路径的 walkthrough + 关键数据结构图。`
- 对复杂模块：让 agent 生成“最小交互 demo”（比如可视化、调参面板、trace viewer），这是还认知债的捷径。

原文：
- https://simonwillison.net/guides/agentic-engineering-patterns/interactive-explanations/
- https://simonwillison.net/guides/agentic-engineering-patterns/linear-walkthroughs/

---

## 5）作者常用 prompts（可直接抄）
对应章节：Prompts I use

这章是作者自己在用的提示词合集，会持续更新。这里挑几个对“写代码 + 维持可控性”最有用的做法翻译并改成可复用模板：

### 5.1 让 agent 不要用 React（做小工具/Artifacts 时）
- 原因：React 需要构建步骤，不利于把产物直接复制出去做静态托管。
- 规则：只用原生 HTML/JS/CSS，依赖越少越好。

可抄模板：
```text
Never use React. Use plain HTML, vanilla JavaScript and CSS with minimal dependencies.
```

### 5.2 把“第一条指令”固定成团队规范
- 先跑测试
- 先解释现状
- 再动手改

可抄模板：
```text
First run the tests. Summarize failures. Then propose the smallest change that makes them pass.
```

原文：https://simonwillison.net/guides/agentic-engineering-patterns/prompts/

---

## 6）把这些模式写进你的团队 DoD（最小清单）
- [ ] 开新会话第一步：跑测试并报告结果
- [ ] 重大改动：必须提供 walkthrough（入口→核心路径）
- [ ] 新功能：优先红/绿 TDD
- [ ] 并行 agent：限制目录范围 + 限制并行数 + 强制 PR review
- [ ] 产出沉淀：有价值的 POC/recipes 必须进仓库

---

## 封面3要点
- 写代码变便宜了
- 测试/理解更重要
- 先跑测试再改

## 封面素材
- punchline: 别欠认知债
- tags: Agent/Coding/工程化
- layout: auto

## 爆款标题备选（任选其一）
1. 写代码变便宜后，最贵的是“看不懂”
2. 用 Coding Agent 的正确姿势：先跑测试，再让它写
3. 并行 Agent 是生产力还是灾难？看你怎么设门禁
4. 认知债比技术债更要命：AI 写的代码你得读得懂
5. Simon Willison 的 Agentic Engineering Patterns：工程师自救指南

#AI #AgenticEngineering #ClaudeCode #Codex #测试