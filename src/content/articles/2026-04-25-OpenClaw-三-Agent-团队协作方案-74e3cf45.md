---
title: "OpenClaw 三 Agent 团队协作方案"
created: "2026-04-25"
tags: ["AI","Agent","Article","Code","Daily","Memory","OpenClaw","Project","Review","Skill"]
category: "Articles"
published: true
---
# OpenClaw 三 Agent 团队协作方案

## 1. 目标

把当前 OpenClaw 的三个 Agent：
- `main`
- `writer`
- `code`

组织成一个清晰的协作团队，而不是三个互相平行、边界模糊的 bot。

其中：
- `main / Murph`：主 Agent / 总协调 / 总收口
- `writer`：内容与表达 Agent
- `code`：工程与代码 Agent

- --

## 2. 当前团队结构

```text
                main / Murph
      （主Agent / 总协调 / 主入口 / 记忆治理）

            /                           \
           /                             \
      writer                               code
（写作/表达/总结）                （编码/调试/review/refactor）
```

- --

## 3. 角色定义

### main / Murph
职责：
- 作为主入口接收综合型任务
- 判断任务类型并决定是否分派
- 负责系统维护、配置治理、工作区优化
- 负责长期记忆治理和规则收敛
- 汇总 writer / code 的结果并输出最终答案

### writer
职责：
- 技术文章
- 总结提炼
- 改写润色
- 长文表达
- 对外表达型内容整理

### code
职责：
- 编码实现
- debug / 日志分析
- code review
- refactor
- 配置、脚本、工程排障

- --

## 4. main 的实际调度范式

### Step 1：先分类
main 收到任务后，先判断任务属于：
- 简单任务
- 内容任务
- 工程任务
- 综合任务

### Step 2：决定自己做还是转派
- 简单任务：main 直接完成
- 内容任务：优先给 writer
- 工程任务：优先给 code
- 综合任务：由 main 拆分

### Step 3：统一收口
- main 负责取舍信息、统一口径、形成最终答案
- 用户默认看到的是团队最终输出，而不是零散中间结果

### Step 4：决定是否写记忆
main 负责判断哪些内容需要沉淀到：
- 当天日志
- 长期规则
- 项目状态
- 决策记录
- 经验教训

- --

## 5. 调度规则

### 5.1 main 直接完成的任务
适合 main 自己完成：
- 简单问答
- 日常综合事务
- 配置检查
- 工作区治理
- 记忆整理
- 需要快速收口的小任务

### 5.2 分派给 writer 的任务
适合交给 writer：
- 写文章
- 改写文案
- 总结报告
- 做公众号稿 / 技术稿
- 长文结构整理

### 5.3 分派给 code 的任务
适合交给 code：
- 编码实现
- debug
- review
- refactor
- 工程配置、日志、脚本问题

### 5.4 综合型任务
如果一个任务同时包含：
- 技术实现
- 内容整理
- 最终对外输出

则推荐流程：
1. main 先拆任务
2. code 处理工程部分
3. writer 处理表达部分
4. main 汇总成最终交付

- --

## 6. main 的 3 类调度实战示例

### 示例 1：纯工程任务
用户输入：
> 帮我看看这个接口为什么一直返回 500，顺便给个修复建议。

main 判断：
- 这是工程型任务
- 优先交给 `code`

推荐流转：
1. main 先快速分类
2. 如明显涉及日志、接口实现、配置链路，则交给 `code`
3. `code` 输出：症状、根因、证据、修复方案、验证方式
4. main 汇总成：结论 + 建议动作

### 示例 2：纯写作任务
用户输入：
> 帮我把这次 OpenClaw 多 Agent 改造整理成一篇分享稿，偏工程化表达。

main 判断：
- 这是内容 / 表达型任务
- 优先交给 `writer`

推荐流转：
1. main 明确受众、输出场景、重点
2. `writer` 负责拆结构、写正文、做润色
3. main 审核是否符合目标，并决定是否补技术准确性说明

### 示例 3：综合型任务
用户输入：
> 帮我排查一下这个 bug，然后整理成一份适合分享的复盘。

main 判断：
- 这是综合型任务
- 需要 `code + writer + main` 协作

推荐流转：
1. main 先拆任务
2. `code` 负责查 bug、定位根因、给修复和验证方案
3. `writer` 基于 `code` 的结果整理复盘表达
4. main 汇总成最终交付，并决定是否写入记忆

- --

## 7. 记忆策略

### 共享记忆
建议三个 Agent 共享以下长期信息：
- 用户画像
- 团队协作规则
- 关键项目背景
- 长期稳定决策
- 通用经验与教训

对应文件建议：
- `USER.md`
- `TEAM.md`
- `memory/topics/projects.md`
- `memory/topics/decisions.md`
- `memory/topics/lessons.md`

### 隔离记忆
建议各 Agent 保持隔离：
- 各自 daily memory
- 各自任务过程
- 各自专业经验

对应：
- `workspace/memory/YYYY-MM-DD.md`
- `workspace-code/memory/YYYY-MM-DD.md`
- `workspace-writer/memory/YYYY-MM-DD.md`

- --

## 8. 当前落地状态

已完成：
- 主工作区新增 `TEAM.md`
- 主工作区 `SOUL.md` 已强化为主 Agent / 调度者定位
- 主工作区 `AGENTS.md` 已加入分派规则
- `workspace-code` 已改造成工程 Agent
- `workspace-writer` 已改造成内容 Agent

未完成但可继续增强：
- 更细的共享记忆同步机制
- 更强的 main 调度提示
- 是否把 `code` 更名为 `coder`
- 是否增加 agent 级专属模型 / skill / 工具配置

- --

## 9. 实际使用建议

### 建议使用方式
- 综合任务先发给 `main`
- 纯写作任务直接发给 `writer`
- 纯工程任务直接发给 `code`

### 推荐主流程
1. 用户先找 `main`
2. `main` 判断任务类型
3. 简单任务自己做
4. 专业任务转交 writer / code
5. 由 `main` 统一收口

- --

## 10. 后续增强方向

- 给 `main` 增加更强的 orchestration 提示
- 为 `writer` / `code` 增加更专属的 skill 配置
- 设计跨 Agent 的长期记忆同步规则
- 如果后续需要，再评估配置层更名（`code` → `coder`）
