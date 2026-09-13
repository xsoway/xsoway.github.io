---
title: "OpenClaw + Codex Agent Swarm（v9）：可直接落地的 OpenClaw cron 模板（babysit + Telegram 通知 +"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
![](./2026-03-07-OpenClaw+Codex-ClaudeCode Agent Swarm：一个人伪装成开发团队的完整搭建-v9-cover.svg)

# OpenClaw + Codex Agent Swarm（v9）：可直接落地的 OpenClaw cron 模板（babysit + Telegram 通知 + 去重写回 registry）

> 目标：把 v8 里“喂给 OpenClaw 的提示词”升级成**可直接复制执行**的 cron 创建命令 + 标准化 message payload（模板）。
>
> 约束：npm + GitHub Actions + Telegram 通知走 OpenClaw `message` + 先只 Codex 跑通。

---

## 1）这条 cron 到底做什么（职责边界写死）

每 10 分钟执行一次：

1) 在你的 repo 里运行：`bash .clawdbot/check-agents.sh`
2) 读取：`.clawdbot/active-tasks.json`
3) 找到所有：
   - `status == "done"`
   - `notifyOnComplete == true`
   - `notified != true`（没通知过）
4) 用 OpenClaw 的 `message` 工具发 Telegram 通知（带 task id、PR 号、PR 链接、note）
5) **写回 registry**：把该 task 标记 `notified=true` + `notifiedAt=<timestamp>`（保证幂等、避免重复通知）

> 重要：`check-agents.sh` 只做确定性巡检（低 token），OpenClaw 才负责“发消息”和“写回去重标记”。

---

## 2）推荐的实现方式（最稳）：cron → 发送给 Agent 的“系统化指令”

OpenClaw cron 的本质是：
- 定时给某个 agent 发一段 message
- agent 收到后按指令执行（可以调用工具、运行命令、发消息）

所以我们要把 babysit 逻辑封装成一段**固定格式**的 message payload。

下面给你两份东西：

- A) **OpenClaw cron add 命令**（直接创建 job）
- B) **message payload 模板**（建议你也落盘到 repo，方便后续修改）

---

## 3）A) 一键创建 cron（复制即用）

把下面命令粘贴到终端执行（把 `--to` 改成你自己的 Telegram chat id，如果你不在 last chat 上跑）：

```bash
openclaw cron add \
  --name "clawdbot-babysit-10m" \
  --description "Run .clawdbot/check-agents.sh, then notify Telegram on done PRs (dedup via registry)" \
  --agent writer \
  --every 10m \
  --session main \
  --channel telegram \
  --to "telegram:5818870476" \
  --expect-final \
  --message "[clawdbot:babySit]\nrepo=$(pwd)\nregistry=.clawdbot/active-tasks.json\nscript=.clawdbot/check-agents.sh\n" 
```

说明：
- `--session main`：让它在主会话跑（能直接用 `message` 工具发 Telegram）
- `--expect-final`：等 agent 执行完成（方便你在 runs 里审计）
- message 里只放“路由信息”，真正逻辑在 agent 侧固定执行

> 如果你希望 cron job 跑在某个 isolated session（不打扰主会话），也可以改 `--session isolated`，但那会改变消息路由策略，先不建议。

---

## 4）B) Agent 侧标准执行模板（可直接复制到 OpenClaw 里）

下面这段就是 cron 实际要执行的“固定流程”。你可以：
- 手动发给 OpenClaw 验证一次
- 或作为 cron 的 `--message` 直接使用（但会更长）

```text
你现在在我的代码仓库里执行 babysit 任务（clawdbot）。请严格按步骤执行，必须幂等，不能重复通知。

输入参数：
- repo: <从当前目录推断>
- script: .clawdbot/check-agents.sh
- registry: .clawdbot/active-tasks.json

步骤：
1) cd 到 repo 根目录（如果当前不在 repo 根目录，用 git rev-parse 找到根目录）。
2) 运行：bash .clawdbot/check-agents.sh
3) 读取 .clawdbot/active-tasks.json，筛选所有满足：
   - status == "done"
   - notifyOnComplete == true
   - notified != true
4) 对每个符合条件的 task：
   4.1 组装通知文本，必须包含：task id、pr 号、note。
       如果能拿到 PR URL（gh pr view <num> --json url），也附上。
   4.2 使用 OpenClaw 的 message 工具发送 Telegram 通知。
   4.3 发送成功后，把该 task 写回 registry：
       - notified=true
       - notifiedAt=<当前毫秒时间戳>
       - 可选：notifyMessageId=<返回的 messageId>
5) 如果没有任何 task 需要通知：不要发消息。

硬约束：
- 不要输出或写入任何 API key/token。
- 不能覆盖整个 registry：必须做原地更新（保留其它任务字段）。
- 任何异常都要写 note 到对应 task（例如：gh 不可用、registry 解析失败）。

交付：
- 本次处理了几个任务（0 也要说 0）
- registry 是否已更新
```

---

## 5）强烈建议：把 B 的模板落到仓库里（以后别靠复制粘贴）

在 repo 里新增：

- `.clawdbot/prompts/openclaw-babysit.md`

把上面的模板存进去。以后 cron 的 message 可以简化成：

- “读取该文件并执行”

这样改规则只改一个文件。

---

## 6）调试与验收

### 6.1 手动跑一次 babysit（不等 10 分钟）

```bash
openclaw cron list
openclaw cron run --name clawdbot-babysit-10m
```

### 6.2 看 run history

```bash
openclaw cron runs --name clawdbot-babysit-10m --limit 20
```

### 6.3 最终验收清单

- [ ] cron job 存在，enabled
- [ ] `.clawdbot/check-agents.sh` 能在 repo 根目录运行
- [ ] registry 里的 done task 会被标记 notified=true
- [ ] Telegram 只通知一次（重复跑 cron 不重复发）

---

## 7）下一步扩展（等 Codex 单点跑稳再说）

- 加 Gemini/Claude reviewer（把 DoD 扩展成多 reviewer checks）
- UI 截图门禁（CI 里强制 PR body 包含截图标记）
- 失败分类器 + 带上下文重试（让 Zoe 每次 retry 改写 prompt，而不是同 prompt 重跑）

---

## 封面3要点
- cron 只发指令不轮询
- notified 去重写回 registry
- Telegram 只在 PR ready 时响

## 封面素材
- punchline: babysit 自动化，关键在幂等
- tags: OpenClaw/cron/Telegram
- layout: auto

## 爆款标题备选（任选其一）

- OpenClaw cron 一键落地：babysit + Telegram 通知 + 去重
- 不靠轮询大模型：用 registry + cron 低成本盯住 agent
- PR Ready 才通知：一人 Agent Swarm 的消息闭环模板

#推荐标签
#OpenClaw #cron #Telegram #AgentSwarm #Codex #GitHubActions #LLMOps #自动化 #幂等 #DevTools
