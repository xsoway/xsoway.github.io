---
title: "OpenClaw实战：会话隔离、多Agent、接口化、定时增强"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
> 图片资源未同步：未命名图片

# OpenClaw实战：会话隔离、多Agent、接口化、定时增强

有些工具，装上就能聊两句；但要让它变成“可运营的助理平台”，第一刀砍的不是模型，是**会话边界**。

一只机器人服务多个人、多群、多业务场景：
- 不隔离 → 记忆串台，越用越像“社死直播”
- 隔离太狠 → 连续性断掉，助理变成一次性筷子

这篇把几个最值钱的点拆开讲：
1) 私信会话怎么隔离
2) 多 Agent + 多飞书机器人怎么落地
3) OpenClaw 怎么当“接口层”暴露能力 + 自定义 UI
4) 定时干活 + 技能持续增强（从问答变成闭环）

> 术语入口：
> - [Session 概念](https://docs.openclaw.ai/zh-CN/concepts/session)

---

## 01 先把“会话边界”钉死：一个机器人≠一锅粥

飞书 + OpenClaw 常见现象：同一个机器人被不同人私聊时，消息可能落进同一个对话 Session。

这事儿不是什么“技术小 bug”，更像组织管理：
- 边界不清 → 助理记错人、说错话
- 边界清晰 → 才能多用户并行服务

### 1）私信分组策略：session.dmScope

OpenClaw 用 `session.dmScope` 控制私信怎么分桶（官方说明的核心点如下）：

- `main`（默认）：所有私信共享主会话，用于保持连续性
- `per-peer`：按发送者 ID 隔离（可跨渠道）
- `per-channel-peer`：按「渠道 + 发送者」隔离（多用户收件箱更稳）
- `per-account-channel-peer`：按「账户 + 渠道 + 发送者」隔离（多账号收件箱更稳）

实战更推荐：**`per-channel-peer`**。既避免“跨渠道误合并”，也不至于把会话切成碎屑。

### 2）跨渠道同人合并：session.identityLinks

如果希望“同一个人用 Telegram + 飞书私聊时共享记忆”，关键在 `session.identityLinks`：
- 能把带提供商前缀的对等 ID（如 `telegram:123`）映射成规范身份
- 配合 `per-peer / per-channel-peer / per-account-channel-peer`，实现同一人跨渠道共享私信会话

一句话：**隔离不是把人切碎，而是先把人认出来**。

---

## 02 Session Key 到底长什么样：看懂了就能玩出花

很多“多场景助理”玩法，本质是把 Session Key 的构成搞明白，然后顺着规则做隔离、做复用。

OpenClaw 的会话键大致可以理解为三段：
1) 场景前缀（agent / cron / hook / node…）
2) 智能体 ID（agentId）
3) 范围/对象（私信、群、话题…）

### 1）私信：dmScope 不同，Key 也不同

官方规则（摘核心、便于记忆）：

- `main`：`agent:<agentId>:<mainKey>`
- `per-peer`：`agent:<agentId>:dm:<peerId>`
- `per-channel-peer`：`agent:<agentId>:<channel>:dm:<peerId>`
- `per-account-channel-peer`：`agent:<agentId>:<channel>:<accountId>:dm:<peerId>`（`accountId` 默认 `default`）

如果 `session.identityLinks` 命中，会用规范键替换 `<peerId>`，从而实现跨渠道共享。

### 2）群聊：天然隔离，但要留意“话题”

群组/频道常见形式：
- 群：`agent:<agentId>:<channel>:group:<id>`
- 频道：`agent:<agentId>:<channel>:channel:<id>`
- Telegram 论坛话题：在群组 ID 后追加 `:topic:<threadId>` 做进一步隔离

如果目标是“每个飞书群一份记忆”，社区已有玩法跑通，可参考：
- [飞书记忆隔离玩法](https://mp.weixin.qq.com/s/jm0jO6sYXfTOsICS556KGg)

---

## 03 多 Agent + 多飞书机器人：一台 OpenClaw 拆成多个助理

这里有个很实用的直觉：
- **agentId 更像“助理配置空间”**
- 每个 agentId 在磁盘上是一套独立配置目录（等于把脑子分盘）

于是可以把助理按场景拆开：
- 工作助理（偏严肃、偏工程化）
- 生活助理（偏提醒、偏琐事）
- 娱乐助理（偏轻松、偏内容）

配合飞书多机器人账号，就能做到：
- 一个 OpenClaw 进程
- 多个飞书机器人
- 每个机器人映射到不同 agentId

配置路径可对照社区文章：
- [飞书多账号支持配置](https://mp.weixin.qq.com/s/ylNfMaBEq4-k3Nta5UJlBg)

落地要点（别搞复杂）：
1) 先把每个飞书机器人的 account 配好
2) 再把 IM 渠道与 agentId 映射好
3) 最后再回头调 dmScope/identityLinks 解决隔离与连续性

吐槽一句：边界不清就堆“多 Agent 编队”，基本属于“兵马未动，串台先行”。

---

## 04 把 OpenClaw 当接口层：OpenAI 兼容 API + 自定义 UI

OpenClaw 的本地 Gateway 可以暴露 OpenAI 兼容接口：
- `http://127.0.0.1:18789/v1/chat/completions`

这一步完成后，身份就变了：
- 以前：只能在 IM 里“来聊两句”
- 现在：任何系统都能像调用 OpenAI 一样调用它

这也是为什么它能和 FastGPT / Dify 这类“工作流搭好 → API 给业务用”的模式对齐：统一鉴权、统一会话、统一入口。

### 1）请求要带什么：Token + 两个关键 Header

- API Key：填 Gateway 的 Token（对应 `gateway.auth.token`）
- Base URL：`http://127.0.0.1:18789/v1`
- 关键请求头：
  - `x-openclaw-session-key`
  - `x-openclaw-agent-id`

官方说明：
- [OpenAI HTTP API](https://docs.openclaw.ai/zh-CN/gateway/openai-http-api)

### 2）多轮对话怎么“续命”：靠 x-openclaw-session-key

多轮对话的核心不是“把 messages 传长一点”，而是**让每次请求落在同一个 session-key**。
- 第 1 条消息写进去
- 第 2 条消息继续用同一个 `x-openclaw-session-key`
- Web 端后台就能看到多轮对话里“第二条、第三条……”持续追加

这点打通后，就可以做自己的 UI：
- 自己的对话界面
- 业务场景专用的表单/按钮/流程
- 再把 UI + 业务系统 + IM 通道都接到同一套 OpenClaw 能力上

一句话：IM 解决“人怎么进来”，API 解决“系统怎么进来”。

### 3）最小可用 curl 示例

```bash
curl --location --request POST 'http://127.0.0.1:18789/v1/chat/completions' \
  --header 'Authorization: Bearer <OpenClawToken>' \
  --header 'Content-Type: application/json' \
  --header 'x-openclaw-session-key: agent:haizei002-agentid:00000000001' \
  --header 'x-openclaw-agent-id: haizei002-agentid' \
  --data-raw '{
    "model": "openclaw",
    "messages": [
      {"role": "user", "content": "查询下北京今天的天气"}
    ]
  }'
```

理解方式：
- `x-openclaw-agent-id` 决定“用哪个助理配置空间”
- `x-openclaw-session-key` 决定“多轮对话落在哪个桶里”

---

## 05 定时干活 + 持续增强：从问答到主动推送

当 OpenClaw 能主动往 IM 发消息时，玩法就不止是“问一句答一句”。
它可以按定时任务、按触发行为，把结果直接推过来。

### 1）定时任务（cron）：让助理按点开工

常见落地场景：
- 每天固定时间自动整理业务信息
- 定时巡检/同步/抓取
- 定时提醒 + 直接给出下一步动作

关键点：
- 定时任务不是“提醒一下”，而是“执行 + 产出 + 可追踪”
- 任务创建后，CRON 菜单里会出现 job；到点后 IM 会收到主动推送

### 2）主动推送到飞书：先拿到对端标识

实现主动发送，需要知道飞书侧的通信标识（peerId 等）。
实践里可以从“历史主动发送/回调”里拿到该标识，然后用于后续定向推送。

别把这事儿想复杂：核心就是**找到对端 ID → 后续就能精准投递**。

### 3）让助理帮忙装工具：以 OpenCode 为例

一旦能“执行命令 + 回传结果”，就能让助理去装工具、跑脚本。
例如让它安装 OpenCode：

```bash
npm install -g opencode-ai
```

装好之后，就能通过 IM 让 OpenClaw 去调用 OpenCode 的免费模型做编程/发布等动作。
已列出的免费模型包括：
- `opencode/big-pickle`
- `opencode/glm-4.7-free`
- `opencode/gpt-5-nano`
- `opencode/kimi-k2.5-free`
- `opencode/minimax-m2.1-free`
- `opencode/trinity-large-preview-free`

### 4）技能增强：装三方 skills，让能力像积木一样叠

有了 Skill 机制，增强能力就不该靠“手改提示词”，而应当靠可复用组件：
- 有输入
- 有执行
- 有产物
- 有回传

已提到的 3 个 skills：
- `nano-banana-pro-image-gen`（生图；需要 API 易账号与 KEY，并配置环境变量 `APIYI_API_KEY`）
- `pdf-to-image-preview`（PDF 转图片预览）
- `juejin-article-trends`（掘金热门文章榜）

安装方式建议走 `find-skills`：它更像“技能管家”，先帮找，再帮装。
示例指令：

> 帮忙通过 find-skills 安装这三个技能：nano-banana-pro-image-gen、pdf-to-image-preview、juejin-article-trends

装完后：
- 生图类技能如果没配 token，会直接提示缺少配置（这比静默失败强太多）
- 生图耗时长，可以继续对话；成功后再要求把图片发回 IM
- 掘金榜单这类技能适合配 cron：每天推一次，省掉手动刷

---

## 06 总结：四块拼起来，才像“个人AI基础设施”

把能力按“解决的问题”对齐，会更清醒：

- **会话隔离**：解决「一个机器人如何服务多用户而不串话」
- **Agent 工作空间**：解决「多机器人、多智能体配置隔离与角色划分」
- **OpenAI 兼容接口**：解决「AI 能力如何对外暴露、被系统调用」
- **IM 主动推送 + 定时任务**：解决「从被动问答到行动闭环」

组合起来，OpenClaw 就不再是一个对话框，而更像一个开放的服务节点：
- 飞书里能聊
- 自己的系统、脚本、UI 也能调

真正值得折腾的也就变了：
- 不再是“提示词怎么写更玄学”
- 而是“这套能力准备接到哪些业务场景里去”

---

## 坑点/雷区清单（别等炸了才补救）

- 私信不隔离：多用户共享一个 Session，记忆串台属于必然
- 隔离过度：每次换渠道就重开一局，连续性直接死掉
- 不用 identityLinks：同一个人跨渠道无法复用会话，体验割裂
- agentId 不分：工作/生活/娱乐混在一起，最后只剩“啥都懂但啥都不稳”
- API 调用不带 session-key：永远单轮，别指望它能“记住上下文”
- 定时任务只发提醒不产出：等于把自动化做成闹钟

---

## 下一步怎么用（可执行）

1) 把 `session.dmScope` 先调成 `per-channel-peer`
2) 需要跨渠道续聊时，再补 `session.identityLinks`
3) 至少拆两个 agentId：工作 / 生活（先别贪多）
4) 把 OpenAI 兼容 API 接到一个最小 UI（重点：agent-id + session-key 传递）
5) 选 1 个高频动作上 cron（比如：每日榜单/日报/巡检），让它先“主动推一次”

---



**推荐标签**：#OpenClaw #飞书机器人 #多Agent #会话隔离 #OpenAI兼容API #定时任务 #技能增强
