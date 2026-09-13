---
title: "2026-04-13-OpenClaw-的记忆边界-memory、.learnings、AGENTS-到底怎么分？"
created: "2026-04-13"
tags: ["OpenClaw","MemorySystem","SelfImprovingAgent","KnowledgeManagement","WorkflowDesign","AIAgent","Draft","OpenClaw"]
category: "Articles"
published: true
---
# OpenClaw 的记忆边界: memory、.learnings、AGENTS 到底怎么分？

## 1. 先说结论

如果只记一句话，我建议记这个：

> **事实进 memory，教训进 .learnings，默认规则进 agent-notes / AGENTS。**

这四类文件不是互相冲突，而是分工不同：

- `memory/*`：负责记住事实、状态、背景、主题
- `.learnings/*`：负责记录错误、纠正、最佳实践、能力缺口
- `memory/agent-notes.md`：负责沉淀长期可复用的经验守则
- `AGENTS.md`：负责定义工作流、分派规则、默认执行机制

它们拼起来，才是一套完整的“记忆 + 复盘 + 规则”系统。

---

## 2. 一张表先看懂全局

| 文件/机制 | 角色定位 | 核心问题 | 适合写什么 | 不适合写什么 |
|---|---|---|---|---|
| `memory/YYYY-MM-DD.md` | 当天流水 / 证据链 | 今天发生了什么 | 事件、动作、结果、观察 | 长期规则、通用流程 |
| `memory/user-prefs.md` | 用户稳定偏好 | 用户长期喜欢什么 | 沟通偏好、生活习惯、稳定习惯 | 临时任务 |
| `memory/topics/*.md` | 项目 / 决策 / 专题记忆 | 某个主题长期状态 | 项目进度、历史决策、专题沉淀 | 单次错误日志 |
| `.learnings/LEARNINGS.md` | 复盘本 | 学到了什么 | 纠正、知识缺口、最佳实践 | 纯事件流水 |
| `.learnings/ERRORS.md` | 错题本 | 哪些失败值得记 | 命令失败、接口异常、报错与修法 | 正常成功执行 |
| `.learnings/FEATURE_REQUESTS.md` | 能力缺口池 | 现在缺什么能力 | 用户提出但还不具备的新能力 | 已经实现的稳定能力 |
| `memory/agent-notes.md` | 长期经验守则 | 以后默认怎么做更稳 | 可复用流程、踩坑经验、长期规则 | 琐碎日常过程 |
| `AGENTS.md` | 工作区运行规则 | Agent 怎么协作、怎么执行 | 分工、流程、写入原则、边界 | 一次性具体事件 |

---

## 3. 四类信息，分别该去哪里

### 3.1 事实类：写 memory

如果一条信息的本质是：

- 发生了什么
- 什么时候发生
- 某个项目现在是什么状态
- 某个决策已经被确认

那它应该优先进入 `memory` 体系。

### 典型例子

```text
今天完成了 Self-Improving 机制接入
今天创建了 .learnings/ 目录和三个文件
某个项目已经开始采用这套规则
```

这些本质上是**事实 / 状态 / 证据链**，适合放：

- `memory/YYYY-MM-DD.md`
- `memory/topics/*.md`

---

### 3.2 教训类：写 .learnings

如果一条信息的本质是：

- 这次错在哪
- 为什么会翻车
- 下次应该怎么避免
- 这次发现了什么更优做法

那它应该优先进入 `.learnings/`。

### 典型例子

```text
调用 openclaw gateway restart 时，发现服务未加载，正确路径应先 install 再 start
修字符串字段 bug 时，不能直接对 payload.get(... ) 结果调用 .strip()
启用 self-improvement 时，不能只解释概念，应一次性完成最小闭环初始化
```

这些不是单纯的事实，而是**错误 / 经验 / 复盘 / 规则候选**。

---

### 3.3 默认流程类：写 agent-notes 或 AGENTS

如果一条信息的本质是：

- 以后默认就应该这么做
- 这已经不是一次教训，而是一条稳定流程
- 这会影响后续多个任务的执行方式

那它不应该只停留在 `.learnings/`，而应该继续升级。

### 升级目标

- `memory/agent-notes.md`：偏经验守则、偏操作习惯
- `AGENTS.md`：偏工作流、偏主 Agent 运行规则

### 典型例子

```text
遇到用户纠正、工具失败、外部接口异常或发现更优做法时，默认补记到 .learnings/
处理字符串字段相关 bug 时，先确认字段是否允许为空，再决定兜底还是返回 4xx
启用某套新机制时，默认一次性完成目录初始化、规则接入和首条真实示例记录
```

---

## 4. 最推荐的写入链路

最稳的方式不是“选一个地方随便写”，而是按价值层层提升。

```text
真实事件发生
→ 先判断是事实、教训还是规则
→ 教训先记到 .learnings/
→ 如果长期成立，再升级到 agent-notes / AGENTS
→ 如果是项目状态或事件证据，再写入 memory
```

你可以把它理解成三层：

### 第一层：事件层
记录“发生了什么”

### 第二层：复盘层
记录“学到了什么 / 下次怎么避免”

### 第三层：规则层
记录“以后默认就这么做”

---

## 5. 场景判断表：遇到什么内容写哪里

| 场景 | 建议落点 | 原因 |
|---|---|---|
| 今天做了一次 Self-Improving 机制接入 | `memory/YYYY-MM-DD.md` | 属于当天事件 |
| 用户说喜欢我直接给结论、少废话 | `memory/user-prefs.md` | 属于长期偏好 |
| 某个项目已采用 .learnings 机制 | `memory/topics/projects.md` | 属于项目长期状态 |
| `openclaw gateway restart` 报错且发现标准修法 | `.learnings/ERRORS.md` | 属于失败经验 |
| 用户纠正了我的理解 | `.learnings/LEARNINGS.md` | 属于纠偏记录 |
| 发现一套更优 bug 修复流程 | `.learnings/LEARNINGS.md` | 属于最佳实践 |
| 某条最佳实践已多次复用 | `memory/agent-notes.md` | 适合升级为长期经验 |
| 某条机制需要所有 agent 默认遵守 | `AGENTS.md` | 适合成为运行规则 |
| 用户提出一个当前还没有的新能力 | `.learnings/FEATURE_REQUESTS.md` | 属于能力缺口 |

---

## 6. 最容易写乱的 3 个地方

### 6.1 把同一条内容写得到处都是

例如：

- 今天修了一个 bug
- 这个 bug 的修法值得复用
- 以后这个流程要变成默认规则

这三件事不是同一层。

更合理的拆法是：

- **事件** → `memory/YYYY-MM-DD.md`
- **经验** → `.learnings/LEARNINGS.md`
- **默认规则** → `memory/agent-notes.md` 或 `AGENTS.md`

不要把三层内容全塞进同一个文件里。

---

### 6.2 把“事实”和“教训”混写

例如：

```text
今天修了 bug，并且以后字符串字段都要先判空。
```

前半句是事实，后半句是规则。

它们不该混成一条流水。

正确做法是：

- “今天修了 bug” → 记事实
- “以后字符串字段先判空再 strip” → 记教训 / 规则
!image-20260402232827795.png

---

### 6.3 还没验证稳定，就急着升长期规则

`.learnings/` 的意义之一，就是让一些经验先有地方落脚。

不是所有经验都值得马上写进 `agent-notes.md` 或 `AGENTS.md`。

如果一条经验：

- 只出现了一次
- 还没确认通用性
- 很可能只是特例

那先留在 `.learnings/` 就够了。

---

## 7. 一个最实用的判断口诀

后面你只要问自己这三个问题：

### 问题 1：这是在记“发生了什么”吗？
如果是，写 **memory**。

### 问题 2：这是在记“学到了什么 / 下次怎么避免”吗？
如果是，写 **.learnings**。

### 问题 3：这是在定“以后默认怎么做”吗？
如果是，写 **agent-notes / AGENTS**。

把它压缩成一句：

> **记事实用 memory，记复盘用 .learnings，记流程用规则文件。**

---

## 8. 以 Self-Improving 任务本身举例

结合这次已经做过的事情，边界会更清楚。

### 8.1 事实层

例如：

```text
已在 workspace 中创建 .learnings/ 目录
已创建 LEARNINGS.md / ERRORS.md / FEATURE_REQUESTS.md
已补充 tech-doc-organizer skill
```

这类内容适合写到：

- `memory/YYYY-MM-DD.md`
- 或相关专题 memory 文件

### 8.2 复盘层

例如：

```text
当用户决定启用 self-improvement 流程时，不该只解释概念，而应一次性完成最小闭环
```

这类内容适合写到：

- `.learnings/LEARNINGS.md`

### 8.3 规则层

例如：

```text
遇到用户纠正、工具失败、外部接口异常或发现更优做法时，默认补记到 .learnings/
```

这类内容适合写到：

- `AGENTS.md`
- `memory/agent-notes.md`

---

## 9. 一张最终对照卡

```text
发生了什么          → memory
踩了什么坑          → .learnings/ERRORS.md
学到了什么          → .learnings/LEARNINGS.md
缺了什么能力        → .learnings/FEATURE_REQUESTS.md
以后默认怎么做      → memory/agent-notes.md / AGENTS.md
```

如果再压缩成超短版：

```text
事实 → memory
复盘 → .learnings
规则 → agent-notes / AGENTS
```

---

## 10. 最后的结论

你现在这套体系，最合理的分工不是“谁替代谁”，而是：

- `memory`：负责记住事实与长期背景
- `.learnings`：负责沉淀错误、纠正、最佳实践和能力缺口
- `agent-notes / AGENTS`：负责把高价值经验变成以后默认执行的规则

所以 Self-Improving 机制并不会和你原来的 memory 三层、QMD 冲突。

相反，它恰好补上了之前最容易缺的一层：

> **复盘层。**

有了这层，很多经验就不会再停留在“当天说过、以后忘了”，而会逐步升级成长期可复用的方法。

------

`#OpenClaw` `#MemorySystem` `#SelfImprovingAgent` `#KnowledgeManagement` `#WorkflowDesign` `#AIAgent` `#AI自动化`
