---
title: "建群-把openclaw & hermes agent 拉进来, 开聊 !"
created: "2026-04-18"
tags: ["- KnowledgeBase"]
category: "Articles"
published: true
---

# Telegram 群里让 OpenClaw 和 Hermes 互相对话的配置手册

## 1. 背景

这次需求的核心，不是单纯把两个机器人都接进 Telegram，而是要在同一个 Telegram 群里，同时放入 OpenClaw 和 Hermes 两个 Agent，让它们都能接收群消息、被点名、并基于各自能力进行互动，从而形成一个可演示、可测试、可扩展的双 Agent 对话场景。

这类玩法适合几个典型场景：

- 做多 Agent 演示或辩论赛
- 测试不同 Agent 的风格和能力边界
- 用 Hermes 负责“对话感”，用 OpenClaw 负责“执行感”
- 在群聊里做半公开的人机协作实验

从已有材料看，这套方案实际走过两条路：

1. **Telegram 多 bot 接入 OpenClaw**，把不同 bot 账号映射到不同 agent / account。
2. **Hermes 独立作为另一个 Telegram bot**，加入同一个群，和 OpenClaw bot 共存。

最终可工作的形态，不是“一个 bot 模拟两个角色”，而是：

- OpenClaw 一侧有自己的 Telegram bot
- Hermes 一侧也有自己的 Telegram bot
- 两者都被拉进同一个群
- 群里通过 `@机器人用户名` 或明确文案触发各自发言

## 2. 目标

这套配置要实现的目标有 4 个：

| 目标 | 说明 |
|---|---|
| 双 bot 同群在线 | OpenClaw bot 和 Hermes bot 同时在一个 Telegram 群中可见 |
| 各自独立响应 | 两边各自保留自己的配置、人格、模型、工具能力 |
| 群内可控触发 | 尽量通过 mention、显式点名、固定话术控制谁先说话 |
| 可复盘可维护 | 后续能看懂配置项、知道问题出在哪、知道如何替换 bot token |

## 3. 整体实现思路

先说结论，这套方案的本质是下面这张图：

```mermaid
flowchart LR
  subgraph Telegram
    G[同一个 Telegram 群]
    B1[@OpenClaw Bot]
    B2[@Hermes Bot]
  end

  subgraph OpenClaw Runtime
    C1[openclaw.json]
    C2[bindings]
    C3[channels.telegram.accounts]
    C4[agent: main / code / writer]
  end

  subgraph Hermes Runtime
    H1[~/.hermes/config.yaml]
    H2[Hermes Telegram Bot]
    H3[Hermes 自身模型与工具]
  end

  G --> B1
  G --> B2
  B1 --> C1
  C1 --> C2
  C1 --> C3
  C2 --> C4
  B2 --> H1
  H1 --> H2
  H1 --> H3
```

也就是说：

- **OpenClaw 不是直接“知道 Hermes”**，它只负责自己的 Telegram account 和 agent binding。
- **Hermes 也不是 OpenClaw 的一个普通子 agent**，而是可以独立作为另一个 bot 存在。
- 两者“互相对话”的外在表现，本质上是它们都在同一个群里，被消息流同时看到，再按各自规则响应。

## 4. 需要准备的前置条件

在真正配置之前，至少要满足下面这些条件。

### 4.1 Telegram 侧准备

| 项 | 要求 |
|---|---|
| OpenClaw bot | 通过 `@BotFather` 创建，拿到 bot token |
| Hermes bot | 通过 `@BotFather` 单独创建，拿到 bot token |
| 群组 | 新建一个 Telegram 群，把两个 bot 都拉进去 |
| 管理权限 | 建议给 bot 基本发言权限，必要时关闭匿名限制 |
| 用户名 | 两个 bot 都要有明确 username，方便 `@mention` |

### 4.2 OpenClaw 侧准备

| 项 | 要求 |
|---|---|
| OpenClaw 已安装 | 本机可运行 `openclaw status` |
| Gateway 正常启动 | Telegram 插件已启用 |
| 主配置文件 | `~/.openclaw/openclaw.json` |
| Telegram 插件 | `plugins.entries.telegram.enabled = true` |

### 4.3 Hermes 侧准备

| 项 | 要求 |
|---|---|
| Hermes 已安装 | 本机可运行 Hermes CLI / gateway |
| Hermes 配置文件 | `~/.hermes/config.yaml` |
| 工作目录 | 建议固定到 `Alan-Workspace` |
| Telegram bot token | 已填入 Hermes 对应配置 |

## 5. OpenClaw 侧需要设置哪些项

如果你的目标是“让 OpenClaw 作为群里的一个 bot 正常参与对话”，重点看的是 `~/.openclaw/openclaw.json`。

根据当前实际配置，OpenClaw Telegram 接入主要有 4 层。

### 5.1 `plugins.entries.telegram`

先确保 Telegram 插件启用：

```json
"plugins": {
  "entries": {
    "telegram": {
      "enabled": true
    }
  }
}
```

没有这层，下面所有 `channels.telegram` 配置都不会生效。

### 5.2 `channels.telegram.enabled`

```json
"channels": {
  "telegram": {
    "enabled": true
  }
}
```

这是渠道总开关。

### 5.3 `channels.telegram.accounts`

这是最核心的一层。每个 bot 都是一个 account。

当前配置结构类似：

```json
"channels": {
  "telegram": {
    "accounts": {
      "main": {
        "name": "Main bot",
        "botToken": "<OPENCLAW_MAIN_BOT_TOKEN>",
        "dmPolicy": "pairing",
        "groupPolicy": "disabled",
        "streaming": "off"
      },
      "code": {
        "name": "Code bot",
        "botToken": "<OPENCLAW_CODE_BOT_TOKEN>",
        "dmPolicy": "pairing",
        "groupPolicy": "disabled",
        "streaming": "off"
      },
      "writer": {
        "name": "Writer bot",
        "botToken": "<OPENCLAW_WRITER_BOT_TOKEN>",
        "dmPolicy": "pairing",
        "groupPolicy": "disabled",
        "streaming": "off"
      },
      "default": {
        "dmPolicy": "pairing",
        "groupPolicy": "disabled",
        "streaming": "partial"
      }
    }
  }
}
```

其中最关键的字段有：

| 配置项 | 作用 | 说明 |
|---|---|---|
| `accounts.<id>.botToken` | 绑定 Telegram bot | 必填，来自 BotFather |
| `accounts.<id>.name` | 内部识别名 | 方便自己看配置 |
| `dmPolicy` | 私聊策略 | 当前常见值是 `pairing` |
| `groupPolicy` | 群聊策略 | **当前版本只允许 `open` / `disabled` / `allowlist`** |
| `streaming` | 流式输出策略 | 群里建议保守一点，避免刷屏 |

### 5.4 `bindings`

`bindings` 决定“这个 Telegram account 最终绑定到哪个 agent”。

例如：

```json
"bindings": [
  {
    "agentId": "main",
    "match": {
      "channel": "telegram",
      "accountId": "main"
    }
  },
  {
    "agentId": "writer",
    "match": {
      "channel": "telegram",
      "accountId": "writer"
    }
  }
]
```

意思是：

- Telegram 的 `main` bot，由 `main` agent 处理
- Telegram 的 `writer` bot，由 `writer` agent 处理

如果你曾经想把 Hermes 直接作为 OpenClaw 的一个 account 接进来，那么通常也会在这里看到一条：

```json
{
  "agentId": "hermes",
  "match": {
    "channel": "telegram",
    "accountId": "hermes"
  }
}
```

这条存在时，OpenClaw 会把 `channels.telegram.accounts.hermes` 当成自己的一个 Telegram provider 启起来。

### 5.5 `agents.list`

如果你把 Hermes 当作 OpenClaw 的一个 agent 配进来，还会在 `agents.list` 里出现：

```json
{
  "id": "hermes"
}
```

但这套“让两个 bot 在群里互相说话”的目标里，**更稳妥的做法通常不是把 Hermes 深度塞回 OpenClaw 主配置里**，而是让 Hermes 作为独立 bot 单独存在。

原因很简单：

- 配置更清晰
- 生命周期更独立
- 出问题时更容易判断是 OpenClaw 侧还是 Hermes 侧
- 不容易把 `openclaw.json` 搞复杂

## 6. Hermes 侧需要设置哪些项

Hermes 这边重点不在 `openclaw.json`，而在它自己的配置文件：

- `~/.hermes/config.yaml`

从已有资料看，Hermes 侧至少要关注下面这些项。

### 6.1 工作目录

建议固定：

```yaml
terminal:
  cwd: [本机路径已隐藏]
```

这样 Hermes 无论是 CLI 还是 Telegram 进来的任务，都默认在同一个工作区里处理，不会飘到 Home 目录。

### 6.2 Telegram bot token

Hermes 要作为独立 Telegram bot 存在，必须有自己的 bot token。

如果你替换了机器人，比如重新在 BotFather 新建了一个 bot，那么至少要更新：

- Hermes Telegram 对应的 `botToken`
- 如果配置里还写了 username / 显示名，也一起确认

### 6.3 交互风格和显示策略

已有配置建议里提到几个很关键的点：

```yaml
display:
  tool_progress: new
  show_reasoning: false
  show_cost: false
  personality: concise

timezone: Asia/Shanghai
```

如果目标是“群里像一个成熟助理一样发言”，这些配置很重要，因为它直接影响群聊观感。

## 7. 推荐实现方案：独立双 Bot，同群协作

这是我最建议写进手册里的主方案。

### 7.1 方案定义

- OpenClaw 用自己的 Telegram bot 进群
- Hermes 用自己的 Telegram bot 进群
- 二者分别运行在各自 runtime 下
- 群里通过 `@OpenClawBot`、`@HermesBot` 来精确叫人

### 7.2 为什么推荐这套

| 方案 | 优点 | 风险 |
|---|---|---|
| Hermes 独立 bot | 边界清晰，排障容易 | 需要维护两套配置 |
| Hermes 挂进 OpenClaw | 集中管理 | 容易把 OpenClaw 主配置搞乱 |

如果只是想实现“两个 agent 在 Telegram 群里互相对话”，**独立双 bot** 这条路明显更稳。

### 7.3 典型交互方式

在群里可以这么玩：

```text
@OpenClawBot 请你从执行和工程实现角度评价一下这个方案
@HermesBot 请你从对话体验和用户理解角度补充一下
```

或者：

```text
@OpenClawBot 你先说
@HermesBot 你来反驳
```

这其实已经能实现“互相对话”的绝大部分可见效果。

## 8. 如果你想把 Hermes 也接进 OpenClaw，需要哪些项

如果你走的是“OpenClaw 主配置里直接再挂一个 hermes account”这条路，那么至少会涉及 3 处同时出现。

### 8.1 agent 声明

```json
{
  "id": "hermes"
}
```

### 8.2 binding 声明

```json
{
  "agentId": "hermes",
  "match": {
    "channel": "telegram",
    "accountId": "hermes"
  }
}
```

### 8.3 Telegram account 声明

```json
"hermes": {
  "name": "Hermes bot",
  "botToken": "<HERMES_BOT_TOKEN>",
  "dmPolicy": "pairing",
  "groupPolicy": "open",
  "streaming": "off"
}
```

也就是说，**这 3 处必须一致**：

| 层 | 关键字段 |
|---|---|
| `agents.list` | `id: hermes` |
| `bindings` | `agentId: hermes` + `accountId: hermes` |
| `channels.telegram.accounts` | `accounts.hermes` |

少一处不行，多一处又容易留下脏配置。

## 9. 这次踩过的关键坑

这部分是最值得写进配置手册的，因为它不是“理想配置”，而是“真实会翻车的地方”。

### 9.1 `groupPolicy` 取值过期

这是这次最关键的坑之一。

当前版本 OpenClaw 对 Telegram 的 `groupPolicy` 只接受：

```text
open
disabled
allowlist
```

之前如果沿用旧值，例如：

```text
pairing
mentions
```

Gateway 会直接判定：

- `Config invalid`
- `File: ~/.openclaw/openclaw.json`

结果就是：

- 你以为自己改了配置
- 但整个配置文件其实没有被正常采用
- 表现出来就像“删不掉 Hermes”或“改了没生效”

### 9.2 以为删掉了，实际主文件还带着 Hermes

这次排查里，真正的硬证据是直接在 `~/.openclaw/openclaw.json` 里还能读到：

- `"id": "hermes"`
- `"agentId": "hermes"`
- `"accountId": "hermes"`
- `"hermes": { ... }`

这说明排障时不要只看口头结论，要直接看当前真实文件内容。

### 9.3 修改 bot token 后要重启 gateway

无论是 OpenClaw 侧 Telegram account，还是 Hermes 侧 Telegram bot，只要换了 bot token，都不能只改文件不重启。

至少要做一次对应服务重启。

OpenClaw 侧通常是：

```bash
openclaw gateway restart
```

### 9.4 群聊策略别一开始就放太开

如果你把 `groupPolicy` 直接开成全开放，两个 bot 都可能在群里过度响应，观感会很乱。

建议起步策略：

- 先只响应 mention
- 或先放在小测试群
- 先验证触发词和节奏，再扩大范围

## 10. 一套更稳的落地步骤

如果你现在要从 0 开始重搭，建议按这个顺序做。

| 步骤 | 动作 | 验收点 |
|---|---|---|
| 1 | 在 BotFather 创建 OpenClaw bot 和 Hermes bot | 两个 token 都拿到 |
| 2 | 新建 Telegram 群，把两个 bot 拉进去 | 群里能看到两个 bot |
| 3 | 配 OpenClaw 的 `channels.telegram.accounts.<id>.botToken` | `openclaw status` 正常 |
| 4 | 配 OpenClaw 的 `bindings` | 对应 bot 能由对应 agent 响应 |
| 5 | 配 Hermes 的 Telegram token 和工作目录 | Hermes 独立可响应 |
| 6 | 重启 OpenClaw / Hermes | 两边都在线 |
| 7 | 在群里用 `@mention` 做回合测试 | 两边各自能按点名发言 |
| 8 | 再测试连续对话、辩论、轮流发言 | 群聊节奏稳定 |

## 11. 最小配置检查清单

### OpenClaw 检查清单

- [ ] `plugins.entries.telegram.enabled = true`
- [ ] `channels.telegram.enabled = true`
- [ ] `channels.telegram.accounts.<id>.botToken` 已填写
- [ ] `bindings` 已把 account 绑到正确 agent
- [ ] `groupPolicy` 取值合法，只用 `open / disabled / allowlist`
- [ ] 修改后已执行 `openclaw gateway restart`

### Hermes 检查清单

- [ ] `~/.hermes/config.yaml` 存在
- [ ] Hermes Telegram bot token 已更新
- [ ] `terminal.cwd` 已固定到工作区
- [ ] 输出风格已做降噪设置
- [ ] Hermes 服务已重启

### Telegram 群检查清单

- [ ] OpenClaw bot 已在群内
- [ ] Hermes bot 已在群内
- [ ] 两个 bot 都有发言权限
- [ ] 可以用 `@username` 精确点名
- [ ] 测试消息不会引发两个 bot 同时乱抢答

## 12. 示例配置片段

### OpenClaw 示例

```json
{
  "bindings": [
    {
      "agentId": "main",
      "match": {
        "channel": "telegram",
        "accountId": "main"
      }
    }
  ],
  "channels": {
    "telegram": {
      "enabled": true,
      "groupPolicy": "disabled",
      "accounts": {
        "main": {
          "name": "Main bot",
          "botToken": "<OPENCLAW_MAIN_BOT_TOKEN>",
          "dmPolicy": "pairing",
          "groupPolicy": "open",
          "streaming": "off"
        }
      }
    }
  }
}
```

### Hermes 示例

```yaml
terminal:
  cwd: [本机路径已隐藏]

# 其他 Telegram bot 配置按 Hermes 自身配置结构填写

display:
  tool_progress: new
  show_reasoning: false
  show_cost: false
  personality: concise

timezone: Asia/Shanghai
```

## 13. 风险点与注意事项

### 13.1 不要把“同群双 bot”误解成“必须互相 API 调用”

很多时候你看到的“互相对话”，实际上不需要两边真的做内部 API 互调。

只要：

- 同群可见
- 能按顺序被触发
- 发言风格有区分

用户就会感知到它们是在“对话”。

### 13.2 不要在主配置里长期保留半残的 Hermes 接入项

如果最后决定走“独立双 bot”方案，就把 OpenClaw 主配置里残留的：

- `agents.list.hermes`
- `bindings` 里的 hermes
- `channels.telegram.accounts.hermes`

清干净。

不然以后排障会非常痛苦。

### 13.3 替换机器人时，要同步确认 username 和 token

Telegram 的 bot username 一旦创建就不能改。

如果你是“重新创建了一个机器人再替换 token”，要一起确认：

- token 是否对应新的 bot
- 群里拉进去的是不是那个新 bot
- 你 `@mention` 的是不是新 username

## 14. 可继续增强的方向

这套玩法后续还能继续增强。

### 方向 1：加固定主持词模板

比如在群里固定用：

```text
@OpenClawBot 从执行角度回答
@HermesBot 从交互角度回答
```

这样节奏会更稳。

### 方向 2：加轮次控制

如果后面想自动化得更像“辩论赛”，可以加一个外层编排器：

- 指定谁先发
- 指定最多几轮
- 指定每轮字数限制

### 方向 3：把当前方案沉淀成脚本或模板

可以把这次配置再固化成：

- 一个 `OpenClaw + Hermes + Telegram 群` 的标准模板
- 一份 bot token 替换清单
- 一份排障脚本（检查 `groupPolicy`、检查 hermes 残留项、检查 gateway 状态）

## 15. 结论

这次方案真正跑通的关键，不是“让 OpenClaw 内部神奇地控制 Hermes”，而是把问题拆成两个独立 bot 的接入与协作。

最稳的做法是：

- OpenClaw 保持自己的 Telegram account / binding
- Hermes 保持自己的 Telegram bot / 配置
- 两者同时进同一个群
- 群里通过 `@mention` 和明确指令控制发言顺序

如果只是想实现“在 Telegram 群里让 OpenClaw 和 Hermes 互相对话”，这已经是最简单、最稳、最容易维护的落地路径。

## 爆款标题备选

1. Telegram 群里同时接入 OpenClaw 和 Hermes，这套双 Agent 配置我是怎么跑通的
2. 如何让 OpenClaw 和 Hermes 在同一个 Telegram 群里互相对话
3. OpenClaw + Hermes 双 Bot 实战：一个 Telegram 群里的多 Agent 配置手册
4. 别再把 Hermes 硬塞进 OpenClaw 了，Telegram 双 Bot 协作的正确姿势
5. 从 bot token 到 groupPolicy，OpenClaw 和 Hermes 同群对话的完整排坑指南

## 推荐标签

`#OpenClaw` `#Hermes` `#Telegram` `#MultiAgent` `#EngineeringPractice` `#Documentation` `#AI自动化` `#配置手册`
