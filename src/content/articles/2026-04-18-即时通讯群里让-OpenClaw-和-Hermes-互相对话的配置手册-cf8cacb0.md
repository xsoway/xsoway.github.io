---
title: "即时通讯群里让 OpenClaw 和 Hermes 互相对话的配置手册"
created: "2026-04-18"
published: true
---

# 即时通讯群里让 OpenClaw 和 Hermes 互相对话的配置手册

## 1. 背景

这次需求的核心，不是单纯把两个机器人都接进某个即时通讯平台，而是要在同一个群里，同时放入 OpenClaw 和 Hermes 两个 Agent，让它们都能接收群消息、被点名、并基于各自能力进行互动，从而形成一个可演示、可测试、可扩展的双 Agent 对话场景。

这类玩法适合几个典型场景：

- 做多 Agent 演示或辩论赛
- 测试不同 Agent 的风格和能力边界
- 用 Hermes 负责“对话感”，用 OpenClaw 负责“执行感”
- 在群聊里做半公开的人机协作实验

从当前真实配置看，这套方案现在实际已经跑成了两条并行链路：

1. **OpenClaw 侧是多 bot 接入 OpenClaw**，同一个 runtime 下挂了 `main / code / writer` 三个 Telegram bot，并分别绑定到不同 agent。
2. **Hermes 侧是独立 bot**，通过自己的 `~/.hermes/config.yaml` 单独接入 Telegram。

所以当前最贴近真实情况的表述，不是“一个 bot 模拟两个角色”，而是：

- OpenClaw 一侧已经有多个独立 bot
- Hermes 一侧也有自己的独立 bot
- 它们可以被拉进同一个群
- 群里通过 `@机器人用户名`、是否要求 mention、以及各自的群聊策略来控制谁响应

## 2. 目标

这套配置要实现的目标有 4 个：

| 目标 | 说明 |
|---|---|
| 双 bot 同群在线 | OpenClaw bot 和 Hermes bot 同时在一个群中可见 |
| 各自独立响应 | 两边各自保留自己的配置、人格、模型、工具能力 |
| 群内可控触发 | 尽量通过 mention、显式点名、固定话术控制谁先说话 |
| 可复盘可维护 | 后续能看懂配置项、知道问题出在哪、知道如何替换 bot token |

## 3. 整体实现思路

先说结论，这套方案的本质是下面这张图：

```mermaid
flowchart LR
  subgraph IM
    G[同一个群]
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
    H2[Hermes Bot]
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

- **OpenClaw 当前并没有把 Hermes 配成自己的 agent/account**，它只负责自己的 Telegram accounts 和 bindings。
- **Hermes 当前是独立 runtime、独立 bot**，不在 `~/.openclaw/openclaw.json` 的 `agents.list` / `bindings` / `channels.telegram.accounts` 里。
- 两者“互相对话”的外在表现，本质上是它们都在同一个群里，各自按自己的 mention 规则和群策略响应。

## 4. 需要准备的前置条件

在真正配置之前，至少要满足下面这些条件。

### 4.1 即时通讯平台侧准备

| 项 | 要求 |
|---|---|
| OpenClaw bot | 通过平台的 bot 管理入口创建，拿到 bot token |
| Hermes bot | 单独创建，拿到 bot token |
| 群组 | 新建一个群，把两个 bot 都拉进去 |
| 管理权限 | 建议给 bot 基本发言权限，必要时关闭匿名限制 |
| 用户名 | 两个 bot 都要有明确 username，方便 `@mention` |

### 4.2 OpenClaw 侧准备

| 项 | 要求 |
|---|---|
| OpenClaw 已安装 | 本机可运行 `openclaw status` |
| Gateway 正常启动 | 即时通讯渠道插件已启用 |
| 主配置文件 | `~/.openclaw/openclaw.json` |
| 渠道插件 | `plugins.entries.telegram.enabled = true` |
| Telegram bot | 当前至少已有 `main / code / writer` 三个 account |

### 4.3 Hermes 侧准备

| 项 | 要求 |
|---|---|
| Hermes 已安装 | 本机可运行 Hermes CLI / gateway |
| Hermes 配置文件 | `~/.hermes/config.yaml` |
| 工作目录 | 建议固定到 `Alan-Workspace` |
| bot token | 已填入 Hermes 对应配置 |

## 5. OpenClaw 侧需要设置哪些项

如果你的目标是“让 OpenClaw 作为群里的一个 bot 正常参与对话”，重点看的是 `~/.openclaw/openclaw.json`。

根据当前实际配置，OpenClaw 的渠道接入主要有 4 层。

### 5.1 `plugins.entries.telegram`

先确保渠道插件启用：

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

根据当前实际配置，OpenClaw 这边已经挂了 3 个 Telegram bot：

```json
"channels": {
  "telegram": {
    "accounts": {
      "main": {
        "name": "Main bot",
        "dmPolicy": "pairing",
        "botToken": "<OPENCLAW_MAIN_BOT_TOKEN>",
        "groupPolicy": "open",
        "streaming": {
          "mode": "off"
        }
      },
      "code": {
        "name": "Code bot",
        "dmPolicy": "pairing",
        "botToken": "<OPENCLAW_CODE_BOT_TOKEN>",
        "groupPolicy": "open",
        "streaming": {
          "mode": "off"
        }
      },
      "writer": {
        "name": "Writer bot",
        "dmPolicy": "pairing",
        "botToken": "<OPENCLAW_WRITER_BOT_TOKEN>",
        "groupPolicy": "open",
        "streaming": {
          "mode": "off"
        }
      },
      "default": {
        "dmPolicy": "pairing",
        "groupPolicy": "open",
        "streaming": {
          "mode": "partial"
        }
      }
    }
  }
}
```

其中最关键的字段有：

| 配置项 | 作用 | 说明 |
|---|---|---|
| `accounts.<id>.botToken` | 绑定 bot | 必填，来自平台侧创建结果 |
| `accounts.<id>.name` | 内部识别名 | 方便自己看配置 |
| `dmPolicy` | 私聊策略 | 当前常见值是 `pairing` |
| `groupPolicy` | 群聊策略 | **当前版本只允许 `open` / `disabled` / `allowlist`** |
| `streaming` | 流式输出策略 | 群里建议保守一点，避免刷屏 |

### 5.4 `bindings`

`bindings` 决定“这个 account 最终绑定到哪个 agent”。

根据当前真实配置，OpenClaw 侧现在是这样绑定的：

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
    "agentId": "code",
    "match": {
      "channel": "telegram",
      "accountId": "code"
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

这意味着现在的 OpenClaw Telegram 接入，核心不是 `main + hermes`，而是 `main + code + writer` 三个 bot 分别接三条 binding。

### 5.5 `agents.list`

根据当前实际配置，OpenClaw 侧的 agent 列表里能明确看到的主要是：

- `main`
- `wecom-chanpin`
- `debug`
- `executor`
- `ai-research`
- `writer`
- 以及几个 `wecom-chanpin-*` agent

这里**没有 `hermes`**。这也再次说明，Hermes 当前不是作为 OpenClaw 内部 agent 接入的。

## 6. Hermes 侧需要设置哪些项

Hermes 这边重点不在 `openclaw.json`，而在它自己的配置文件：

- `~/.hermes/config.yaml`

### 6.1 工作目录

建议固定：

```yaml
terminal:
  cwd: [本机路径已隐藏]
```

### 6.2 bot token

Hermes 要作为独立 bot 存在，必须有自己的 bot token。

从当前配置看，Hermes 侧使用的是它自己配置文件里的 Telegram 接入项，而不是复用 OpenClaw 的 `channels.telegram.accounts`。

也就是说，如果你替换了 Hermes 机器人，至少要更新：

- `~/.hermes/config.yaml` 里的 `telegram.bot_token`
- 如果有额外的 mention 规则、群白名单、渠道映射，也一起核对

### 6.3 交互风格和显示策略

当前 Hermes 配置里，和群内体验直接相关的几项是：

```yaml
display:
  tool_progress: new
  show_reasoning: false
  show_cost: false
  personality: concise

telegram:
  require_mention: true

streaming:
  enabled: false

timezone: Asia/Shanghai
```

这里最关键的一点是：**Hermes 当前要求 mention 才响应**。这对“同群双 bot 共存”很重要，因为它天然降低了误触发和抢答概率。

## 7. 当前最贴近真实配置的实现方案：OpenClaw 多 Bot + Hermes 独立 Bot，同群协作

### 7.1 方案定义

- OpenClaw 侧可以用 `main / code / writer` 中的一个或多个 bot 进群
- Hermes 用自己的独立 bot 进群
- 二者分别运行在各自 runtime 下
- 群里通过 `@机器人用户名` 来精确叫人

### 7.2 为什么推荐这套

| 方案 | 优点 | 风险 |
|---|---|---|
| Hermes 独立 bot | 边界清晰，排障容易 | 需要维护两套配置 |
| Hermes 挂进 OpenClaw | 集中管理 | 容易把 OpenClaw 主配置搞乱 |

如果只是想实现“群里多个 agent/bot 按点名协作”，当前这条路明显更稳，而且已经符合你现在的真实配置。

## 8. 如果你以后想把 Hermes 也接进 OpenClaw，需要哪些项

注意，这一节说的是“未来可选方案”，不是当前生效配置。

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

### 8.3 渠道 account 声明

```json
"hermes": {
  "name": "Hermes bot",
  "botToken": "<HERMES_BOT_TOKEN>",
  "dmPolicy": "pairing",
  "groupPolicy": "open",
  "streaming": {
    "mode": "off"
  }
}
```

## 9. 这次踩过的关键坑

### 9.1 `groupPolicy` 取值过期

当前版本 OpenClaw 对该渠道的 `groupPolicy` 只接受：

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

Gateway 会直接判定配置无效。

### 9.2 不要拿历史残留结论覆盖当前真实配置

这次重新核对后，当前 `~/.openclaw/openclaw.json` 里实际看不到：

- `"id": "hermes"`
- `"agentId": "hermes"`
- `"accountId": "hermes"`
- `"hermes": { ... }`

也就是说，当前真实状态已经不是“OpenClaw 主配置残留 Hermes 接入项”，而是“OpenClaw 与 Hermes 分别独立配置”。文档里如果继续写旧结论，就会误导后续排障。

### 9.3 修改 bot token 后要重启 gateway

无论是 OpenClaw 侧 account，还是 Hermes 侧 bot，只要换了 bot token，都不能只改文件不重启。

```bash
openclaw gateway restart
```

## 10. 一套更稳的落地步骤

| 步骤 | 动作 | 验收点 |
|---|---|---|
| 1 | 创建 OpenClaw bot 和 Hermes bot | 所需 token 都拿到 |
| 2 | 选定要进群的 OpenClaw bot（如 `main` / `code` / `writer`） | account 与 agent 对应关系明确 |
| 3 | 新建群，把目标 bot 拉进去 | 群里能看到多个 bot |
| 4 | 配 OpenClaw 的 `channels.telegram.accounts.<id>.botToken` 与 `bindings` | 对应 bot 能由对应 agent 响应 |
| 5 | 配 Hermes 的 `telegram.bot_token`、工作目录、mention 策略 | Hermes 独立可响应 |
| 6 | 重启 OpenClaw / Hermes | 两边都在线 |
| 7 | 在群里用 `@mention` 做回合测试 | 各 bot 按点名发言，不乱抢答 |

## 11. 最小配置检查清单

### OpenClaw 检查清单

- [ ] `plugins.entries.telegram.enabled = true`
- [ ] `channels.telegram.enabled = true`
- [ ] `channels.telegram.accounts.main/code/writer` 已填写对应 `botToken`
- [ ] `bindings` 已把 `main -> main`、`code -> code`、`writer -> writer` 绑对
- [ ] `groupPolicy` 取值合法，只用 `open / disabled / allowlist`
- [ ] 群里是否需要自由响应，已结合 `groupPolicy` 和使用习惯确认
- [ ] 修改后已执行 `openclaw gateway restart`

### Hermes 检查清单

- [ ] `~/.hermes/config.yaml` 存在
- [ ] `telegram.bot_token` 已更新
- [ ] `telegram.require_mention = true` 是否符合群聊预期
- [ ] `terminal.cwd` 已固定到工作区
- [ ] `streaming.enabled = false` 已确认
- [ ] 输出风格已做降噪设置
- [ ] Hermes 服务已重启

### 群聊检查清单

- [ ] OpenClaw bot 已在群内
- [ ] Hermes bot 已在群内
- [ ] 两个 bot 都有发言权限
- [ ] 可以用 `@username` 精确点名
- [ ] 测试消息不会引发两个 bot 同时乱抢答

## 12. 风险点与注意事项

### 12.1 不要把“同群双 bot”误解成“必须互相 API 调用”

很多时候你看到的“互相对话”，实际上不需要两边真的做内部 API 互调。

### 12.2 当前主要风险不是“残留 Hermes 项”，而是群策略与 mention 策略不一致

从现在的真实配置看：

- OpenClaw Telegram account 的 `groupPolicy` 是 `open`
- Hermes Telegram 配置是 `require_mention: true`

这意味着如果群里不做约束，OpenClaw 侧 bot 可能比 Hermes 更容易被普通消息触发。要想让群内体验稳定，重点不是清理不存在的 Hermes 残留项，而是统一好触发规则，比如：

- 约定都用 `@mention` 才点名 bot
- 或把 OpenClaw 侧也收紧到更适合群聊的策略

### 12.3 替换机器人时，要同步确认 username 和 token

平台侧的 bot username 一旦创建就不能改。

## 13. 可继续增强的方向

- 加固定主持词模板
- 加轮次控制
- 沉淀成标准模板和排障脚本

## 14. 结论

按当前真实生效配置，这套方案已经不是“OpenClaw + 一个 Hermes bot”这么简单，而是：

- OpenClaw 侧本身就支持多个 Telegram bot account（当前已有 `main / code / writer`）
- Hermes 保持独立 bot / 独立配置
- 它们可以一起进入同一个群
- 群里通过 `@mention`、群策略和响应规则来控制发言顺序

如果你的目标是在群里实现多 Agent 协作，对当前环境来说，最稳的路径就是：

- OpenClaw 继续维护自己的多 account / binding
- Hermes 继续独立运行
- 群里明确约定点名方式
- 把“谁会被普通群消息触发”这件事单独设计清楚

## 爆款标题备选

1. 即时通讯群里同时接入 OpenClaw 和 Hermes，这套双 Agent 配置我是怎么跑通的
2. 如何让 OpenClaw 和 Hermes 在同一个群里互相对话
3. OpenClaw + Hermes 双 Bot 实战：一个群里的多 Agent 配置手册
4. 别再把 Hermes 硬塞进 OpenClaw 了，双 Bot 协作的正确姿势
5. 从 bot token 到 groupPolicy，OpenClaw 和 Hermes 同群对话的完整排坑指南

## 推荐标签

`#OpenClaw` `#Hermes` `#即时通讯机器人` `#MultiAgent` `#EngineeringPractice` `#Documentation` `#AI自动化` `#配置手册`
