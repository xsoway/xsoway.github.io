---
title: "OpenSpec + oh-my-opencode + superpowers + 根目录 AGENTS.md 分工与工作流说明"
created: "2026-04-25"
tags: ["- AI"]
category: "Articles"
published: true
---
# OpenSpec + oh-my-opencode + superpowers + 根目录 AGENTS.md 分工与工作流说明

> 目的：说明这四层在 Murph Engineering Workspace 里的职责边界、协作关系、推荐工作流，以及最终应该如何落盘和沉淀。

- --

## 1. 一句话总览

这四者不是互相替代，而是四层不同职责：

- **根目录 `AGENTS.md`**：总纲层，定义全局规则、边界、记忆、交付、Harness 原则
- **OpenSpec**：规格层，负责把“要做什么”沉淀成 proposal / specs / design / tasks
- **oh-my-opencode**：编排层，负责在 OpenCode 里把任务拆解、调度 agent、并行执行、验证结果
- **superpowers**：技能/纪律层，负责给 agent 注入固定工程流程与专门能力，避免乱写、漏测、漏审查

最简单的理解是：

> `AGENTS.md` 定规矩，OpenSpec 定目标，oh-my-opencode 负责怎么组织人干活，superpowers 决定干活时要遵守什么专门流程和技能纪律。

- --

## 2. 四层分工

### 2.1 根目录 `AGENTS.md`：总纲层 / 宪法层

它解决的是：

- 这个工作区的**总规则是什么**
- Agent 进入仓库后**先读什么**
- 代码工程和记忆应该**怎么分层**
- 交付、复盘、验证、Harness、局部项目规则应该**怎么落地**

它应该管的内容：

- 启动顺序：先读 `SOUL.md`、`USER.md`、`MEMORY.md` 等
- 全局工程边界：根目录是规则层，`src/` 是代码主战场
- SDD / Harness Engineering 原则
- 交付说明、复盘、证据链要求
- 根规则与 `src/<project>/AGENTS.md` 的关系

它**不应该**管的内容：

- 某一个具体功能的设计细节
- 某个 change 的 proposal / tasks
- 某个项目内部的局部架构决策

所以它的定位是：

> **Workspace Constitution / Global Policy**

- --

### 2.2 OpenSpec：规格层 / 变更管理层

它解决的是：

- 这次具体要改什么
- 为什么改
- 验收标准是什么
- 设计方案是什么
- 任务拆解是什么

它的典型输出是：

- `openspec/changes/<change>/proposal.md`
- `openspec/changes/<change>/design.md`
- `openspec/changes/<change>/tasks.md`
- `openspec/changes/<change>/specs/`
- 归档后更新主 `openspec/specs/`

它应该管的内容：

- **单次 change 的目标、范围、设计、任务清单**
- Delta Specs 的生成与归档
- `/opsx:explore` / `/opsx:propose` / `/opsx:apply` / `/opsx:archive` 这一整套规范驱动工作流

它**不应该**管的内容：

- OpenCode 里的 agent 调度策略
- 通用技能注入逻辑
- 你整个工作区的全局规则

所以它的定位是：

> **Change Spec System / Spec-Driven Workflow Engine**

- --

### 2.3 oh-my-opencode：编排层 / 调度层

它解决的是：

- OpenCode 里谁来干活
- 怎么并行查资料、查代码、找文档
- 怎么调用 explore / librarian / oracle / momus 等 agent
- 怎么把验证、工具、LSP、AST、todo 管起来

它应该管的内容：

- agent orchestration
- category + skill delegation
- subagent 协作
- 并行搜索、并行验证
- 工具增强（LSP / AST / skill / 背景任务 / PR 工作流等）

它**不应该**管的内容：

- 单个业务功能的产品规格
- 你工作区的长期规则
- 某个项目的局部产品设计真相

所以它的定位是：

> **Execution Orchestrator / Agent Runtime Enhancement Layer**

- --

### 2.4 superpowers：技能纪律层 / 方法论层

它解决的是：

- agent 在干活时应遵守哪些固定流程
- 哪些技能应该强制触发
- 什么情况下必须先 brainstorm / debug / review / verify

它更像一层：

- 流程约束
- 技能模板
- 特定领域 best practices 的注入器

它应该管的内容：

- 技能定义与触发条件
- 流程 discipline（例如先澄清、先 review、先 verify）
- 领域能力包（比如 playwright、git、debugging）

它**不应该**管的内容：

- 项目的长期规则本体
- 单个 change 的 specs/design/tasks
- OpenCode 的底层 agent 调度框架

所以它的定位是：

> **Skill System / Process Discipline Layer**

- --

## 3. 四层关系图

```text
┌─────────────────────────────────────────────┐
│ 根目录 AGENTS.md / SOUL.md / USER.md       │
│ 全局规则、边界、记忆、交付、Harness 总纲     │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ OpenSpec                                    │
│ 单次 change 的 proposal/specs/design/tasks   │
│ 解决：这次到底要做什么，验收标准是什么         │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ oh-my-opencode                              │
│ agent 调度、并行搜索、任务编排、验证闭环       │
│ 解决：怎么组织 agent 和工具把活高效干完         │
└──────────────────────┬──────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────┐
│ superpowers                                 │
│ 技能系统、流程 discipline、领域最佳实践注入    │
│ 解决：干活时要遵守什么固定方法和技能约束       │
└─────────────────────────────────────────────┘
```

注意：

- **OpenSpec 和 superpowers 不是一层东西**
- OpenSpec 更偏“规格与 change 管理”
- superpowers 更偏“技能与流程纪律”
- oh-my-opencode 是把这一切真正接进 OpenCode 运行时的编排器

- --

## 4. 推荐工作流程

### 阶段 A：进入工作区

1. OpenCode 启动
2. `oh-my-opencode` 负责加载 agent / skill / command / tool 能力
3. 根目录 `AGENTS.md` 作为总纲先被读取
4. 如果目标在 `src/<project>/`，继续读取项目局部 `AGENTS.md`、`product-specs/`、`exec-plans/`、`design-docs/`、`constraints/` 等

这一阶段回答的是：

> 我现在在哪个工作区？这里的总规则和项目局部规则是什么？

- --

### 阶段 B：需求探索

如果需求还不清楚：

- 用 **OpenSpec 的 `/opsx:explore`** 进入探索模式
- 利用 `oh-my-opencode` 的 explore/librarian/oracle 等能力去查代码、查文档、查上下文
- superpowers 如果有 brainstorming / context-management 类技能，可以提供过程纪律

这一阶段回答的是：

> 这件事到底值不值得做？边界是什么？隐含需求是什么？

- --

### 阶段 C：规格落地

当思路清楚后：

- 用 **`/opsx:propose`** 生成 change
- OpenSpec 产出：
  - `proposal.md`
  - `design.md`
  - `tasks.md`
  - delta specs

这一阶段回答的是：

> 这次变更的单一真相源是什么？

这里的优先级通常是：

1. 根目录 `AGENTS.md`：给出总规则和框架边界
2. 项目局部 `AGENTS.md`：给出项目上下文边界
3. OpenSpec change artifacts：给出本次变更的局部真相

- --

### 阶段 D：执行实现

当 specs / tasks 准备好：

- 用 **`/opsx:apply`** 进入执行
- `oh-my-opencode` 负责：
  - todo 管理
  - agent 调度
  - 并行搜索
  - 工具调用
  - 验证结果
- superpowers 负责：
  - 在实现过程中触发必要 skill
  - 保证流程 discipline
  - 把 review / verify / domain best practice 拉进来

这一阶段回答的是：

> 怎么在不跑偏的前提下，把 change 真正做出来？

- --

### 阶段 E：验证与收口

完成实现后：

- 根目录 `AGENTS.md` 和 `TEAM.md` 要求输出交付说明与复盘
- 项目局部 constraints / tests / evals / observability 负责给证据
- OpenSpec 在完成后用 **`/opsx:archive`** 做归档
- memory 层记录长期经验和当天证据链

这一阶段回答的是：

> 这次改动是否真正闭环？未来还能不能回溯？

- --

## 5. 推荐的优先级与冲突处理

### 5.1 规则优先级

推荐采用这个顺序：

1. **用户明确要求**
2. **根目录 `AGENTS.md` 总纲**
3. **`src/<project>/AGENTS.md` 项目局部规则**
4. **OpenSpec 当前 change 的 specs / design / tasks**
5. **superpowers skills / workflows**
6. **oh-my-opencode 的运行时编排默认策略**

意思是：

- `oh-my-opencode` 再强，也不能覆盖你的 workspace 宪法
- superpowers 再强，也不应该覆盖 change 的真实规格
- OpenSpec 的 change artifact 再具体，也不能违反根目录总纲

- --

### 5.2 常见冲突怎么判断

#### 情况 1：superpowers 想强制 TDD，但你的工作区默认是 SDD

处理方式：

- 以根目录 `AGENTS.md` 为准
- 把 superpowers 中的 TDD 理解为“验证策略之一”，而不是默认总纲

#### 情况 2：OpenSpec 的 tasks 跟项目局部 constraints 冲突

处理方式：

- 不直接按 tasks 硬做
- 先修订 design/specs/tasks
- 以项目局部规则和架构约束为准，再更新 change artifact

#### 情况 3：oh-my-opencode 想走某个执行策略，但你根目录要求先复盘/先交付说明

处理方式：

- 以根目录 `AGENTS.md` / `TEAM.md` 为准
- 编排层必须服从工作区总纲

- --

## 6. 你这套栈最合理的分工建议

如果按 Murph Engineering Workspace 来落地，我建议这样分：

### A. 根目录 `AGENTS.md`
负责：

- 工作区宪法
- SDD 原则
- Harness 定义
- 交付 / 复盘 / memory 规则
- 根目录与 `src/<project>/` 的分层约定

### B. `src/<project>/AGENTS.md`
负责：

- 项目局部规则
- 项目结构、约束、反馈回路
- 项目级 Harness 入口说明

### C. OpenSpec
负责：

- 面向“单次 change”的 proposal / specs / design / tasks / archive
- change 级真相源

### D. oh-my-opencode
负责：

- OpenCode 里的 agent orchestration
- 多 agent 协作
- 调用工具、搜索、验证
- 把 OpenSpec 命令、skills、commands 接进运行时

### E. superpowers
负责：

- 通用技能与流程 discipline
- 过程 best practices
- 对特定任务的技能增强

最短结论就是：

> **根目录 AGENTS.md 管长期秩序，OpenSpec 管单次变更真相，oh-my-opencode 管执行编排，superpowers 管技能与纪律。**

- --

## 7. 日常使用的推荐口令顺序

### 场景 1：新需求还模糊

```text
/opsx:explore
↓
明确范围和约束
↓
/opsx:propose
```

### 场景 2：需求已经很清楚

```text
/opsx:propose <change>
↓
检查 proposal / design / tasks
↓
/opsx:apply
↓
验证、复盘、交付
↓
/opsx:archive
```

### 场景 3：不是做功能，而是查问题

```text
根目录 AGENTS.md 定边界
↓
oh-my-opencode 调 explore/librarian/oracle
↓
需要沉淀则回写 OpenSpec / memory / 项目 docs
```

- --

## 8. 最后建议

如果你准备把这四者长期融合，我建议坚持下面三条：

1. **根目录 `AGENTS.md` 永远只管总纲，不要塞进某次需求细节**
2. **OpenSpec 永远只管 change，不要拿它替代工作区长期规则**
3. **superpowers 和 oh-my-opencode 都是运行时增强层，不能反向篡改你的总纲和规格真相源**

这样这套体系才不会乱：

- 有长期规则
- 有单次变更真相
- 有执行编排
- 有技能 discipline
- 有项目局部上下文

最后一句话版本：

> **这四者最合理的关系，不是谁替代谁，而是“总纲 → 规格 → 编排 → 技能”四层叠加。**
