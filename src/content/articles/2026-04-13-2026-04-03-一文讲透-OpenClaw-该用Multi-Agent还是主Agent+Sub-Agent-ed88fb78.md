---
title: "2026-04-13-2026-04-03-一文讲透-OpenClaw-该用Multi-Agent还是主Agent+Sub-Agent"
created: "2026-04-03"
tags: ["KnowledgeBase","OpenClaw","Agent","MultiAgent","SubAgent","Routing","Orchestration","Draft"]
category: "Articles"
published: true
---
## 先给结论
- **Multi-Agent 解决的是「长期分工与隔离」**：不同入口/不同岗位/不同权限与认证，各自独立、长期存在。
- **主 Agent + Sub-Agent 解决的是「任务拆解与调度」**：一个总控接单，临时派出执行单元并行干活，最后回收汇总。

把这两个问题分清楚，架构选择就不难了：
- 你在设计的是**组织结构（谁长期负责什么）** → Multi-Agent
- 你在设计的是**任务流程（这件事怎么拆怎么并行）** → 主 + Sub

---

## 1) Multi-Agent 到底是什么（多个独立 Agent）
在 OpenClaw 的语义里，一个 **agent 不是一段 prompt**，而是一个 **fully scoped brain（完整隔离的工作单元）**。它通常拥有自己独立的：
- workspace（工作区/文件家）
- agentDir（状态与配置目录）
- auth profiles（认证/密钥范围，按 agent 隔离）
- session store（会话存储）
- persona / SOUL / AGENTS 等规则
- skills（技能集）

### Multi-Agent Routing 是什么
可以把 OpenClaw 想成 总机或交换机：消息进来先做 **routing 路由分发**，决定交给哪个 agent。

#### 一个超直观的聊天式例子
- 你在 Telegram 私聊发来：提醒我明天 9 点开会
  - 命中规则：telegram direct → personal 或 main
- 你在 飞书 工作群发来：把这个 PR 过一遍
  - 命中规则：feishu group 或 work space → code 或 ops

你看到的是同一句话 我看到的是不同入口命中不同岗位

常见路由维度：
- 按 **channel**：飞书 vs Telegram vs Discord
- 按 **accountId**：同一平台多个 bot 账号
- 按 **peer/group/DM/guild/thread**：按聊天对象、群、服务器、线程分流

路由规则是：
- **deterministic（确定性）**：同样条件永远命中同一条
- **most-specific wins（更具体优先）**：规则冲突时，匹配更精确的优先

> 实用理解：Multi-Agent 更像“你在同一套 OpenClaw 里雇了多个长期岗位”，每个岗位可以绑定不同入口，独立运转。

---

## 2) 主 Agent + Sub-Agent 到底是什么（一个总控 + 多个临时执行器）
OpenClaw 的 sub-agent 更接近“当前会话中临时拉起的 delegated run（委派执行）”，不是长期常驻的身份。

典型工作流：
1 主 agent 接需求 定目标
2 判断是否适合拆分
3 并行或串行 spawn 一个或多个 sub-agent
4 sub-agent 各自执行
5 主 agent 回收结果并汇总交付

#### 聊天式示例 任务拆解是怎么发生的
**你**：帮我做一个 OpenClaw 全局概览图 还要加上 sub-agent 说明 但 mermaid 老报错

**主 Agent**：我会分三路并行
- sub-agent A 排查 mermaid 报错的原因与语法坑
- sub-agent B 设计 sub-agent 模块的结构与连线
- sub-agent C 把示例文本改成兼容的节点写法

**主 Agent**：你最终只会收到一份可直接粘贴的 mermaid 完整代码

类比：
- 主 agent：项目经理/总控
- sub-agent：临时工/并行线程/一次性执行单元

为什么要用 sub-agent：
- **上下文隔离**：避免“检索噪音污染写作/决策”
- **并行加速**：多路同时推进
- **局部重跑**：只重做某个环节（比如只校对/只检索）

---

## 3) 最核心的区别：组织方式不同
很多人会误以为“都是多个 agent，只是叫法不同”。其实不是：

### Multi-Agent 是「组织结构」
强调长期与隔离：
- 独立 workspace / auth / sessions / identity
- 独立 routing（入口分流）

它解决的问题是：
- 谁长期负责哪类事
- 哪个入口的消息该交给谁
- 谁用什么模型/权限/密钥
- 哪些东西必须隔离（比如生产权限 vs 写作）

### 主 Agent + Sub-Agent 是「任务编排」
强调临时与调度：
- 委派、并行、一次性运行
- 当前会话内调度，执行完回收

它解决的问题是：
- 一个复杂任务怎么拆
- 哪些事适合并行
- 主会话如何保持清爽
- 重活怎么外包/隔离运行

---

## 4) Multi-Agent 的优势与代价
### 优势
1. **长期边界清晰**：写作只写作、运维只运维
2. **入口可直接路由**：不同账号/不同群/不同线程直接进不同 agent
3. **权限与认证易隔离**：auth per-agent，不同密钥/模型天然分开

### 代价
1. **配置与维护成本更高**：agents/bindings/workspace/auth/session 管理复杂
2. **容易过度设计**：拆太细导致碎片化、自己都记不住谁干什么

---

## 5) 主 Agent + Sub-Agent 的优势与代价
### 优势
1. **不必先搭组织结构**：先 1 个主入口即可
2. **复杂任务更好拆解**：检索/结构/校对/执行各自独立
3. **对用户体验更统一**：你永远只跟一个主 agent 对话

### 代价
1. **主 agent 会变成中枢**：所有请求都经过它，调度逻辑可能变重
2. **不天然适合长期岗位**：sub-agent 强在执行，不强在长期身份/入口绑定

---

## 6) 到底该怎么选（决策清单）

### 6.1 一张表先拍板

| 你要解决的问题 | 选 Multi-Agent | 选 主 Agent + Sub-Agent | 典型信号 | 常见坑 |
|---|---|---|---|---|
| 长期分工与隔离 | ✅ 强项 | ⚠️ 不擅长 | 有 writer 和 ops 这种长期岗位 | 拆太细导致维护成本爆炸 |
| 入口分流与身份绑定 | ✅ 强项 | ❌ 不适合 | 不同群不同账号要进不同脑子 | 把路由逻辑硬塞到主对话里 |
| 权限与认证隔离 | ✅ 强项 | ⚠️ 勉强能做但不优雅 | 生产密钥必须和写作隔离 | 一不小心让写作 agent 拿到生产权限 |
| 复杂任务拆解与并行 | ⚠️ 能做但偏重 | ✅ 强项 | 同一需求里既要检索又要写又要改代码 | 主上下文被检索噪音冲爆 |
| 统一对话体验 | ⚠️ 多入口会割裂体验 | ✅ 强项 | 用户只想对着一个入口说话 | 多 agent 让用户不知道该找谁 |
| 需要可重跑的局部环节 | ⚠️ 需要手动组织 | ✅ 强项 | 只重跑校对 只重跑检索 只重跑测试 | 每次都从头来一遍 |

> 一句话：
> - 你在搭组织与边界，选 Multi-Agent。
> - 你在做任务拆解与调度，选 主 Agent + Sub-Agent。

### 6.2 优先 Multi-Agent 的情况
- 你有多个长期岗位（writer ops research 等）
- 你需要不同 workspace（长期维护不同文件与规则）
- 你需要不同入口直接进不同 agent（账号 群 线程分流）
- 你需要认证与权限隔离（生产权限分开 不同 key 分开）

### 6.3 优先 主 Agent + Sub-Agent 的情况
- 你目前主要就一个入口（自己用的主聊天）
- 你更需要复杂任务拆解，而不是长期角色拆分
- 你暂时不想维护很多长期 agent
- 你想保留统一对话体验（所有复杂性在背后解决）

### 6.4 三条最常用的判断口令
- 这件事要不要长期负责和长期隔离：要 → Multi-Agent
- 这件事能不能拆成几块并行干：能 → 起 Sub-Agent
- 这件事会不会把主上下文弄脏：会 → 起 Sub-Agent 隔离检索与执行

---

## 7) 最实用的落地方式：组合拳（推荐）
> **长期层用 Multi-Agent，执行层用 Sub-Agent**。

一个很实用的搭法：
- 长期层（Multi-Agent）：
  - main：总控/默认入口
  - writer：内容创作
  - ops 或 code：系统/编码
- 执行层（Sub-Agent）：
  - 在 writer 内部：检索 / 提纲 / 反查
  - 在 ops/code 内部：查日志 / 对比配置 / 生成修复建议 / 跑命令

这样通常比“纯多 agent”或“纯主+sub”更稳：
- Multi-Agent 保证长期隔离与入口分流
- Sub-Agent 保证任务拆解与并行效率

---

## 8) 实操路线（两条）
### 路线 A：Multi-Agent
1. 增加长期 agent（writer/ops 等）
2. 查看/配置 bindings（把入口绑定给对应 agent）
3. 给各自 workspace 补齐规则（AGENTS/SOUL/USER/IDENTITY）
4. 重启并验证

### 路线 B：主 Agent + Sub-Agent
1. 保留一个主 agent
2. 在复杂任务里使用 sub-agent：并行检索/整理/校对/执行
3. 需要外部执行器时，再用 ACP（把任务交给外部 harness）

---

## 附：你可以直接用的口头指令模板

### A) 聊天式示例

#### 示例 1 你只想要统一体验 但任务很复杂
**你**：我想把 OpenClaw 的路由搞清楚 但别给我一堆概念 直接给我落地路径

**主 Agent**：收到 我会把任务拆成三块 并行跑 你最后只看一个汇总
1 路由机制速记与坑点
2 你现在这套配置适合的最小改动
3 验证清单与回滚点

**主 Agent**：我现在起三个 sub-agent 分别做上面三块 完成后我汇总给你

**你**：行

**主 Agent 最终汇总**：
- 结论
- 你该改哪几个文件
- 验证命令
- 风险与回滚

#### 示例 2 该用 Multi-Agent 的典型对话
**你**：我希望 Telegram 只聊生活 公司的飞书只做工作 还要完全隔离配置和权限

**主 Agent**：这是长期边界问题 用 Multi-Agent 更稳
- 生活入口绑定到 personal agent
- 工作入口绑定到 work agent
- 两套 workspace 与 auth 分开

#### 示例 3 该用 Sub-Agent 的典型对话
**你**：帮我写一篇文章 主题是 Multi-Agent vs 主加 Sub 但我还想同时查官方定义和补例子

**主 Agent**：我会这样拆
- sub-agent 1 查官方定义与术语对齐
- sub-agent 2 生成文章结构与表格
- sub-agent 3 写聊天式示例
然后我统一合并成一篇 Markdown

### B) 代码块示例

#### 1 判断是否需要 sub-agent 的伪代码
```pseudo
if task.isSmall and task.needsNoFileExploration:
  handle_in_main()
else if task.requiresLongRunning or task.canParallelize or task.willPolluteContext:
  spawn_subagents()
  collect_results_and_summarize_in_main()
else:
  route_to_specialized_agent()
```

#### 2 一个可复用的任务拆解模板
```text
目标
- 你要交付什么

约束
- 不要做什么
- 需要先确认什么

拆解
- 子任务 A 产出是什么
- 子任务 B 产出是什么
- 子任务 C 产出是什么

回收
- 主 Agent 汇总格式
- 验证步骤
- 回滚策略
```

### C) 更细的指令模板表

| 你对我说的话 | 我内部应该怎么做 | 你最终会收到什么 |
|---|---|---|
| 用 debug 定位根因 | 先复现 再最小改动 产出验证命令 | 根因 方案 风险 验证清单 |
| 用 executor 先给计划 | 先列步骤与影响面 你确认后执行 | 可执行计划 变更点 回滚点 |
| 用 writer 输出成稿 | 先提纲 再填充 再自校对 | Markdown 成稿 表格 示例 |
| 用 ai-research 过去24h | 检索 归类 去重 标注来源 | 10条链接 为什么重要 |

---

## 备注
本文为基于 OpenClaw 官方能力定义的实践总结：
- Multi-Agent：长期分工与隔离（workspace/auth/sessions/identity/routing）
- Sub-Agent：会话内的临时委派执行（并行、隔离、回收）
- ACP：对接外部执行器/harness 的协议层（当你需要“外包”给外部系统跑）
