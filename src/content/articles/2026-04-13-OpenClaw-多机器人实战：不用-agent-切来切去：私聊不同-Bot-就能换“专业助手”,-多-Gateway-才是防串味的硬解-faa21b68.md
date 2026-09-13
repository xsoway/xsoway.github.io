---
title: "2026-04-13-OpenClaw-多机器人实战：不用-agent-切来切去：私聊不同-Bot-就能换“专业助手”,-多-Gateway-才是防串味的硬解"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
> 图片资源未同步：未命名图片

# OpenClaw 多机器人实战：不用 /agent 切来切去：私聊不同 Bot 就能换“专业助手”, 多 Gateway 才是防串味的硬解

很多人把“Agent”当成一个更聪明的聊天框。

但真干过活就知道：**一个聊天框扛所有活儿，迟早会变成垃圾场**——上下文互相污染、模型要来回切、任务类型跨度太大，最后连你自己都懒得打开。

这篇不是概念科普，是一套我自己踩坑后稳定跑起来的做法：

- 用 **Telegram 的多个 Bot** 当入口
- 用 **多个 OpenClaw Gateway（多 profile）** 做隔离
- 每个 Gateway 绑定一个“专科 Agent”，模型、提示词、记忆边界都分开

目标就一个：把 AI 从“万能但不靠谱”变成“分工明确、随叫随到”的小团队。

完整教程入口（原文参考，不必照抄配置）：[awesome.tryopenclaw.asia](https://awesome.tryopenclaw.asia/)

---

## 1. 为什么需要多 Agent：不是为了炫技，是为了不内耗

单 Agent 模式最常见的死法有三种：

1) **上下文被吃穿**：你让它写文案，又让它查技术细节，再让它整理资讯；过两天它的“人格”和偏好已经混成一锅粥。
2) **模型频繁切换**：今天要最强推理，明天要便宜快写，后天要多模态。你每次都得手动换模型/风格/思考强度。
3) **任务队列互相抢占**：写作需要长时间连贯；资讯需要快；开发需要可追踪。混在一起就是互相打断。

所以我干脆把它拆成“四个岗位”，每个岗位有自己的入口和上下文：

- **主助理（Boss 旁边那位军师型）**：负责复杂任务、决策、长链路规划
- **内容创作助手（嘴炮+排版担当）**：只管写作、改稿、标题、排版
- **技术开发助手（硬核工兵）**：只管代码、排障、脚本、工程化交付
- **AI 资讯助手（情报员）**：只管快读、汇总、做周报素材

注意：这里的“多 Agent”，不是同一个入口里用 `/agent` 切换；而是**你在 Telegram 里直接私聊不同机器人**，就像点外卖选不同店。

---

## 2. 两种实现路线：我为什么放弃「单 Gateway + 路由绑定」

我一开始也想走“优雅路线”：一个 Gateway，靠 bindings/路由规则把不同聊天入口分发到不同 agent。

理论上看起来像这样（示意，渠道改为 telegram）：

```json
{
  "bindings": [
    {
      "agentId": "main-agent",
      "match": {
        "channel": "telegram",
        "peer": {
          "kind": "chat",
          "id": "<your_chat_or_group_id>"
        }
      }
    }
  ]
}
```

但现实是：

- 规则一复杂就会变“配置地狱”（尤其是群里多 bot、多 topic、多转发）
- 路由稳定性和可观测性不够：你只要遇到一次“消息进错 agent”，上下文就开始串味
- 最关键：**你仍然需要在一个 Gateway 里维护多套 agent 状态**，出问题很难定位

所以我最终采用更粗暴、但更稳的做法：

> **多 Gateway + 多 Telegram Bot（推荐）**

核心思想：

- 建 4 个 Telegram Bot（分别代表 4 个岗位）
- 启 4 个独立的 OpenClaw Gateway
- 每个 Gateway 用不同 `--profile`（配置目录、会话、端口全部隔离）
- 每个 Gateway 只服务一个 bot + 一个 agent

这套方案的好处很直接：

- ✅ 完全独立：谁出问题只重启谁
- ✅ 入口天然分流：你私聊哪个 bot，就是哪个 agent
- ✅ 不需要在聊天里发命令切换身份
- ✅ 配置更好读：一份 profile 对应一个职责

---

## 3. 架构长什么样：把“团队”摆成可维护的形状

我画个更接地气的结构图（Telegram 版）：

```text
┌──────────────────────────────────────────────────────────┐
│ Telegram                                                  │
├──────────────────────────────────────────────────────────┤
│ Bot #1：主助理      Bot #2：内容创作助手                  │
│ Bot #3：技术开发    Bot #4：AI 资讯助手                   │
└──────────────────────────────────────────────────────────┘
                 ↓（Webhook/Long Polling -> Gateway）
┌──────────────────────────────────────────────────────────┐
│ OpenClaw Gateway（多 profile 隔离）                        │
├───────────────┬───────────────┬───────────────┬──────────┤
│ gateway-main   │ gateway-write  │ gateway-dev   │ gateway-news │
│ port: 18789    │ port: 18790    │ port: 18791   │ port: 18792  │
│ profile: main  │ profile: writer│ profile: dev  │ profile: news │
└───────────────┴───────────────┴───────────────┴──────────┘
                 ↓
┌──────────────────────────────────────────────────────────┐
│ Agents（各自模型/提示词/记忆）                             │
├───────────────┬───────────────┬───────────────┬──────────┤
│ main-agent     │ content-agent  │ tech-agent    │ aiflow-agent │
│ 强推理模型      │ 写作友好模型     │ 工程化+推理     │ 快速汇总模型   │
└───────────────┴───────────────┴───────────────┴──────────┘
```

### profile 隔离到底隔离了啥？

用 `--profile <name>` 之后，我把它当成“一个独立小脑袋”，它会自然分开：

- 配置文件：`~/.openclaw-<name>/openclaw.json`
- 状态数据：`~/.openclaw-<name>/`
- 端口：每个实例单独占用（比如 18789~18792）
- 会话：上下文完全隔离

这点非常关键：**隔离不是“心理安慰”，是可回滚、可定位、可重启。**

---

## 4. 实操：从 0 拉起 4 个 Telegram Bot + 4 个 Gateway

下面我按“能复用”的方式写，不依赖你必须照搬某个脚本。

### Step 0：先定分工，再定模型（别反过来）

我用的是这种分配逻辑（你可以换模型，但别换分工原则）：

| 岗位 | 主要任务 | 我给的模型偏好 | 关键约束 |
|---|---|---|---|
| 主助理 | 复杂任务拆解、决策、规划、跨领域整合 | 最强推理/思考强度高 | 允许长上下文、允许慢 |
| 内容助手 | 文章/标题/改稿/排版 | 写作稳定、成本适中 | 输出必须可发布 |
| 技术助手 | 写代码/脚本/排障/PRD 技术评审 | 推理+可执行 | 必须可复现、可运行 |
| 资讯助手 | 快速摘要/热点追踪/周报素材 | 便宜快 | 宁可短，也要快 |

这一步决定了你后面的“成本结构”和“日常体验”。

---

### Step 1：创建 4 个 Telegram Bot（入口层）

用 Telegram 的 [@BotFather](https://t.me/BotFather) 创建 4 个 bot：

- `YourMainAssistantBot`（主助理）
- `YourContentWriterBot`（内容创作）
- `YourTechDevBot`（技术开发）
- `YourAINewsBot`（AI 资讯）

你会拿到 4 个 `BOT_TOKEN`。把它们当成“门禁卡”，不要混用。

建议给每个 bot 的简介写清楚职责（这一步很值）：

- 主助理：复杂任务/决策/规划
- 内容助手：写作/改稿/标题/排版
- 技术助手：代码/脚本/排障
- 资讯助手：快讯/周报素材

---

### Step 2：为每个岗位准备独立的 Agent 配置（人格别串）

我喜欢把每个 agent 的“身份”和“输入输出标准”写死在文件里。

示例目录：

```bash
mkdir -p agent-configs/{main-agent,content-agent,tech-agent,ai-news-agent}
```

以主助理为例（示意）：

`agent-configs/main-agent/USER.md`

```md
# 用户信息
- 角色：超级个体创业者
- 关注：AI 编程/内容生产/自动化/增长
- 讨厌：空话、官腔、模糊结论
```

`agent-configs/main-agent/SOUL.md`

```md
# 你是谁
你是我的主助理。
职责：复杂任务拆解、决策建议、把模糊需求变成可执行计划。
输出要求：结论先给、风险说清、下一步可执行。
```

另外三个 agent 也是同样套路：写清楚“干什么/不干什么/交付标准”。

> 小经验：**写清楚“不干什么”比写“要做什么”更能去串味。**

---

### Step 3：为每个 Bot 启动一个独立 Gateway（多 profile）

我一般会准备 4 份 profile：

- `main`
- `writer`
- `dev`
- `news`

启动命令你可以自己包装成脚本，这里先给一个“可读版”的示意：

```bash
# 主助理
openclaw gateway start --profile main --port 18789

# 内容创作
openclaw gateway start --profile writer --port 18790

# 技术开发
openclaw gateway start --profile dev --port 18791

# AI 资讯
openclaw gateway start --profile news --port 18792
```

接下来在每个 profile 的 `openclaw.json` 里配置对应的 Telegram bot token（具体字段按你当前 OpenClaw 版本的 channel 配置为准）。

> 重点不是“字段长啥样”，重点是：**一个 profile 只连一个 bot，只服务一个 agent。**

---

### Step 4：给自己一套“管理脚本”（否则你迟早懒得维护）

我会把常用动作收敛成 3 个脚本：

- `start-all.sh`：全启动
- `status.sh`：查状态
- `restart-dev.sh`：只重启 dev（技术助手出问题最多）

示例（按你的环境改）：

```bash
#!/usr/bin/env bash
set -euo pipefail

profiles=(main writer dev news)
ports=(18789 18790 18791 18792)

for i in ${!profiles[@]}; do
  p=${profiles[$i]}
  port=${ports[$i]}
  echo "Starting $p on $port..."
  openclaw gateway start --profile "$p" --port "$port"
done
```

这套东西写完，你的“团队”就不再靠记忆，而是靠脚本。

---

## 5. 使用方式：把入口当岗位，不要再把对话当垃圾桶

### 私聊是主路径

- 要做复杂任务 → 私聊“主助理 bot”
- 要写稿/改稿 → 私聊“内容 bot”
- 要写代码/排障 → 私聊“技术 bot”
- 要看资讯/做周报 → 私聊“资讯 bot”

你的大脑只做一件事：**选对入口**。

### 群组是可选项

如果你要在工作群里用，也很简单：把多个 bot 拉进群，按需 @。

我自己常用的组合：

- 工作群：主助理 + 技术助手
- 内容群：内容助手
- 资讯群：资讯助手

不要试图把所有 bot 都塞进同一个群里当“全家桶”，那叫自找麻烦。

---

## 6. 维护与避坑：让它能长期跑，而不是“周末项目”

### 6.1 最容易翻车的点

- **token 管理**：4 个 bot token 一定要有清晰命名，别混。
- **日志与定位**：每个 gateway 单独存 log，出问题才能快速定位。
- **成本失控**：主助理别什么都接；把写作/资讯分出去，成本会立刻降下来。
- **上下文污染**：一旦发现某个 agent 开始“跨界”，直接收紧 SOUL/USER 约束。

### 6.2 我最常用的日常检查清单

| 项目 | 频率 | 目标 |
|---|---:|---|
| gateway status | 每天 | 看有没有挂、有没有断连 |
| 模型/费用回顾 | 每周 | 主助理是不是被当成“便宜劳动力” |
| 提示词复盘 | 每两周 | 哪个 agent 开始说套话/开始串味 |
| Bot 职责重申 | 随时 | 给 bot 的简介和欢迎语保持一致 |

---

### 6.3 日志：先把“现场”看清楚

我会给每个 gateway 单独打日志文件（别混在一个大文件里）。常用命令：

```bash
# 查看实时日志
tail -f logs-main-assistant.log
tail -f logs-content-creator.log
tail -f logs-tech-dev.log
tail -f logs-ai-news.log

# 查看所有日志
tail -f logs-*.log
```

> 小经验：**排障别先改配置，先盯 2 分钟日志。** 很多问题其实是断连/端口冲突/权限没给。

---

### 6.4 重启策略：别“全家桶重启”，要能精准止血

```bash
# 重启所有（粗暴但有效）
./stop-all-gateways.sh
sleep 2
./start-all-gateways.sh

# 重启单个（推荐：谁坏重启谁）
ps aux | grep "openclaw.*--profile main-assistant"
kill <PID>
./start-main-assistant.sh
```

核心原则：

- 资讯/内容类 gateway 最容易出现“卡住不回”，可以单独重启
- 主助理 gateway 尽量少重启（它通常跑最重的上下文）

---

### 6.5 改配置：先验 JSON，再重启生效

```bash
# 编辑配置
vim ~/.openclaw-main-assistant/openclaw.json

# 验证配置（JSON 不合法直接别启动）
jq . ~/.openclaw-main-assistant/openclaw.json

# 重启生效：停止并重启对应 Gateway
```

---

### 6.6 资源监控：别等到机器风扇起飞才想起来

```bash
# 查看内存占用
ps aux | grep openclaw-gateway | awk '{print $4, $11}'

# 查看 CPU 占用
ps aux | grep openclaw-gateway | awk '{print $3, $11}'

# 查看端口占用
lsof -i :18789
lsof -i :18790
lsof -i :18791
lsof -i :18792
```

---

## 7. 实战案例：把 4 个 Bot 串成工作流，而不是摆设

### 案例一：内容创作工作流（写一篇技术文章）

| 阶段 | 找谁聊 | 目的 |
|---|---|---|
| 构思 | 主助理 | 选题定位 + 大纲 + 结论先行 |
| 写作 | 内容创作助手 | 快速出初稿 + 标题池 + 排版 |
| 代码示例 | 技术开发助手 | 代码可运行、边界条件别漏 |
| 资讯补充 | AI 资讯助手 | 找最新动态/术语变更/竞品信息 |

一句话：**主助理负责“想清楚”，内容助手负责“写出来”，技术助手负责“跑得通”，资讯助手负责“补证据”。**

### 案例二：技术开发工作流（做一个新功能）

- 需求分析：主助理（需求拆分、架构方案、风险点）
- 代码实现：技术开发助手（实现/调试/可复现步骤）
- 文档编写：内容创作助手（README、变更说明、对外文案）
- 技术调研：AI 资讯助手（方案对比、同类实现、最新实践）

### 案例三：日常节奏（时间块分工）

- 09:00 规划：主助理
- 10:00 写作：内容创作助手
- 14:00 开发：技术开发助手
- 16:00 学习：AI 资讯助手
- 20:00 复盘：主助理

---

## 8. 性能与成本：别只看“能跑”，要看“跑得起”

### 8.1 资源占用（经验值）

- 内存：单个 gateway 约 **400MB**
- 4 个 gateway 合计：约 **1.6GB**
- CPU：空闲几乎为 0；任务处理时按模型与上下文长度波动
- 磁盘：配置 + 状态 + 日志，粗略 **100MB** 级别

### 8.2 成本怎么估

你可以用“岗位拆分”反过来控成本：

| Agent | 模型定位 | 用途 | 成本策略 |
|---|---|---|---|
| main-agent | 最强推理 | 复杂任务/决策/规划 | 只接高价值请求 |
| content-agent | 性价比写作 | 写稿/改稿/排版 | 多跑它，少跑主助理 |
| tech-agent | 推理 + 可执行 | 代码/脚本/排障 | 必须输出可复现 |
| ai-news-agent | 便宜快 | 摘要/热点/素材 | 宁可短也要快 |

成本优化一句话：

- 简单任务交给“快而便宜”的那个
- 复杂任务才动用“最强推理”

---

## 9. 故障排查：常见症状 → 最短路径

### 9.1 Gateway 启动失败

症状：`./start-all-gateways.sh` 后，`./check-gateways.sh` 显示没进程。

排查顺序（别跳步）：

```bash
# 1) 看日志
tail -50 logs-main-assistant.log

# 2) 验证配置格式
jq . ~/.openclaw-main-assistant/openclaw.json

# 3) 查端口占用
lsof -i :18789

# 4) 跑 doctor（按你的 profile）
openclaw --profile main-assistant doctor
```

最常见的三个原因：

- JSON 格式错：`jq` 一跑就露馅
- 端口被占：换端口或干掉占用进程
- Telegram bot 配置/Token 填错：一个 token 填错会让你以为“整套都坏了”

### 9.2 Bot 无响应（Telegram 里发了不回）

排查：

- gateway 是否在跑（`status.sh`）
- 日志里有没有报错/断连
- 你的 bot 有没有被加到正确的 chat（群里要 @，私聊直接发）

### 9.3 用错模型/用错 Agent

症状：你私聊的是“内容 bot”，结果回答风格像“主助理”，甚至成本爆炸。

思路：先别怪模型，先查配置绑定是否指向正确 agent。

---

## 10. 高级技巧：让它更像“服务”，而不是“脚本集合”

### 10.1 用 tmux 管理多实例

```bash
tmux new -s openclaw
# 分割窗口：Ctrl+b %（垂直） / Ctrl+b "（水平）

./start-main-assistant.sh
./start-content-creator.sh
./start-tech-dev.sh
./start-ai-news.sh

tail -f logs-*.log
```

### 10.2 macOS 开机自启动（launchd 思路）

你可以为每个 profile 写一个 LaunchAgent（每个 gateway 一份），核心是 `ProgramArguments` 里把 profile 写死。

> 经验：先把手动启动跑稳，再上自启动；否则自启动只会把错误“自动化”。

### 10.3 日志轮转（别把磁盘写爆）

```bash
cat > rotate-logs.sh << 'EOF'
#!/bin/zsh
for log in logs-*.log; do
  if [ -f "$log" ] && [ $(stat -f%z "$log") -gt 10485760 ]; then
    mv "$log" "$log.$(date +%Y%m%d_%H%M%S)"
    touch "$log"
  fi
done
EOF
chmod +x rotate-logs.sh
```

然后你可以丢进 crontab 每小时跑一次。

---

## 11. 总结：这套方案的价值，不在“多”，在“可控”

多 Gateway + 多 Telegram Bot 的方案，本质是在做三件事：

- **入口分工**：私聊不同 bot = 选不同岗位
- **上下文隔离**：profile 把记忆与状态硬隔开
- **可维护性**：坏了能单点重启，成本能按岗位控

当它跑起来之后，你会发现最爽的不是“更聪明”，而是：

> 你不用再解释自己要什么语气、要什么模型、要不要思考。
> 你只要点对人。

---

#OpenClaw #Telegram #AI助手 #Agent #自动化
