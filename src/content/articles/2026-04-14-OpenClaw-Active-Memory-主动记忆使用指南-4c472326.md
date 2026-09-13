---
title: "2026-04-14-OpenClaw-Active-Memory-主动记忆使用指南"
created: "2026-04-14"
tags: ["KnowledgeBase","OpenClaw","ActiveMemory","AI助手","记忆系统","技术教程"]
category: "技术教程"
published: true
---

# OpenClaw Active Memory 主动记忆使用指南

## 1. 背景

OpenClaw 2026.4.12 版本新增了 **Active Memory（主动记忆）** 插件，这是一个可选的插件拥有的阻塞记忆子代理，在符合条件的会话中，在主回复之前自动运行。

传统的记忆系统通常是**被动的**：
- 依赖主代理决定何时搜索记忆
- 依赖用户说"记住这个"或"搜索记忆"
- 往往错过让回复感觉自然的时机

Active Memory 的出现解决了这个问题——它给了系统一个**有边界的机会**，在生成主回复之前就展示相关的记忆。

---

## 2. 目标 / 问题定义

### 核心目标

让 AI 助手在对话中**自然地**、**主动地**提取相关记忆，无需用户手动触发。

### 适用场景

- 持久化、面向用户的会话
- Agent 有有意义的长期记忆可搜索
- 连续性和个性化比原始提示词确定性更重要

### 不适用场景

- 自动化任务
- 内部工作器
- 一次性 API 任务
- 隐藏的个性化会令人惊讶的地方

---

## 3. 实施方案 / 工作流

### 3.1 快速开始（推荐配置）

将以下配置添加到你的 `openclaw.json` 文件中：

```json5
{
  plugins: {
    entries: {
      "active-memory": {
        enabled: true,
        config: {
          enabled: true,
          agents: ["main"],
          allowedChatTypes: ["direct"],
          modelFallback: "google/gemini-3-flash",
          queryMode: "recent",
          promptStyle: "balanced",
          timeoutMs: 15000,
          maxSummaryChars: 220,
          persistTranscripts: false,
          logging: true,
        },
      },
    },
  },
}
```

然后重启网关：
```bash
openclaw gateway
```

### 3.2 运行时流程

Active Memory 的运行时形状如下：

```
用户消息 → 构建记忆查询 → 主动记忆阻塞子代理
                                      ↓
                              返回 NONE 或空？
                                      ↓
                          是 → 直接主回复
                          否 → 追加隐藏的 active_memory_plugin 系统上下文 → 主回复
```

阻塞记忆子代理只能使用：
- `memory_search`
- `memory_get`

如果连接较弱，应该返回 `NONE`。

### 3.3 运行条件

Active Memory 使用两个门控：

1. **配置选择加入**
   - 插件必须启用
   - 当前 agent id 必须出现在 `plugins.entries.active-memory.config.agents` 中

2. **严格的运行时资格**
   - 即使启用和定向，主动记忆只在符合条件的交互式持久化聊天会话中运行

   实际规则：
```
插件已启用
+
agent id 已定向
+
允许的聊天类型
+
符合条件的交互式持久化聊天会话
=
主动记忆运行
```

---

## 4. 关键规则 / 设计约束

### 4.1 主要配置选项

| 选项 | 说明 | 推荐值 |
|---|---|---|
| `agents` | 哪些 agent 使用主动记忆 | `["main"]` |
| `allowedChatTypes` | 允许的聊天类型 | `["direct"]`（仅私聊） |
| `queryMode` | 查询模式 | `"recent"`（推荐） |
| `promptStyle` | 提示风格 | `"balanced"`（平衡） |
| `timeoutMs` | 超时时间（毫秒） | `15000` |
| `maxSummaryChars` | 最大摘要字符数 | `220` |

### 4.2 查询模式说明

| 模式 | 说明 | 适用场景 | 推荐超时 |
|---|---|---|---|
| `message` | 仅最新用户消息 | 最快，稳定偏好召回 | 3000-5000 ms |
| `recent` | 最新消息 + 最近对话 | 平衡速度和上下文（推荐） | ~15000 ms |
| `full` | 完整对话 | 最高质量，较慢 | ≥15000 ms |

一般来说，超时应该随着上下文大小增加：
```
message < recent < full
```

### 4.3 提示风格说明

| 风格 | 说明 |
|---|---|
| `balanced` | 通用默认（推荐） |
| `strict` | 最不积极，上下文泄漏最少 |
| `contextual` | 连续性最好，对话历史更重要 |
| `recall-heavy` | 更愿意在软匹配下显示记忆 |
| `precision-heavy` | 除非明显匹配，否则返回 NONE |
| `preference-only` | 优化用于偏好、习惯、口味等 |

当 `config.promptStyle` 未设置时的默认映射：
```
message → strict
recent → balanced
full → contextual
```

### 4.4 模型降级策略

如果 `config.model` 未设置，Active Memory 按以下顺序尝试解析模型：

```
显式插件模型
→ 当前会话模型
→ agent 主模型
→ 可选配置的降级模型
```

`config.modelFallback` 控制配置的降级步骤。

可选的自定义降级：
```json5
modelFallback: "google/gemini-3-flash"
```

如果没有显式、继承或配置的降级模型解析，Active Memory 会跳过该轮的回忆。

---

## 5. 实际落地结果

### 5.1 会话级控制命令

在聊天中使用：

```text
/active-memory status      # 查看状态
/active-memory off         # 关闭（当前会话）
/active-memory on          # 开启（当前会话）
/active-memory status --global  # 查看全局状态
/active-memory off --global     # 关闭全局
/active-memory on --global      # 开启全局
```

注意：
- 会话级命令不改变 `plugins.entries.active-memory.enabled`、agent 定向或其他全局配置
- 全局形式写入 `plugins.entries.active-memory.config.enabled`
- 全局形式保持 `plugins.entries.active-memory.enabled` 开启，以便命令保持可用

### 5.2 调试查看

开启详细输出：

```text
/verbose on   # 显示状态行
/trace on     # 显示调试摘要
```

然后发送一条消息，你会看到：

```text
...正常回复...

🧩 Active Memory: ok 842ms recent 34 chars
🔎 Active Memory Debug: Lemon pepper wings with blue cheese.
```

这些行来自于同一个主动记忆过程，该过程也为隐藏的系统上下文提供数据，但它们是为人类格式化的，而不是暴露原始提示词标记。它们在正常助手回复之后作为后续诊断消息发送，因此 Telegram 等渠道客户端不会在回复前闪烁一个单独的诊断气泡。

### 5.3 运行位置

Active Memory 是对话丰富功能，不是平台范围的推理功能。

| 表面 | 运行主动记忆？ |
|---|---|
| Control UI / web chat 持久会话 | 是，如果插件已启用且 agent 已定向 |
| 同一持久聊天路径上的其他交互渠道会话 | 是，如果插件已启用且 agent 已定向 |
| 无头一次性运行 | 否 |
| 心跳/后台运行 | 否 |
| 通用内部 `agent-command` 路径 | 否 |
| 子代理/内部助手执行 | 否 |

---

## 6. 示例 / 模板 / 代码块

### 6.1 推荐设置

从 `recent` 开始：

```json5
{
  plugins: {
    entries: {
      "active-memory": {
        enabled: true,
        config: {
          agents: ["main"],
          queryMode: "recent",
          promptStyle: "balanced",
          timeoutMs: 15000,
          maxSummaryChars: 220,
          logging: true,
        },
      },
    },
  },
}
```

如果你想在调优时检查实时行为，请使用 `/verbose on` 获取正常状态行，使用 `/trace on` 获取主动记忆调试摘要，而不是寻找单独的主动记忆调试命令。在聊天渠道中，这些诊断行在主助手回复之后发送，而不是之前。

然后移动到：
- `message` 如果你想要更低的延迟
- `full` 如果你决定额外的上下文值得更慢的阻塞记忆子代理

### 6.2 常用的固定提供者示例

如果你依赖嵌入支持的回忆、多模态索引或特定的本地/远程提供者，请显式固定提供者，而不是依赖自动检测。

OpenAI：
```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "openai",
        model: "text-embedding-3-small",
      },
    },
  },
}
```

Gemini：
```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "gemini",
        model: "gemini-embedding-001",
      },
    },
  },
}
```

Ollama：
```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "ollama",
        model: "nomic-embed-text",
      },
    },
  },
}
```

如果你期望在运行时错误（如配额耗尽）时提供者降级，仅固定提供者是不够的。还需配置显式降级：

```json5
{
  agents: {
    defaults: {
      memorySearch: {
        provider: "openai",
        fallback: "gemini",
      },
    },
  },
}
```

---

## 7. 风险点与注意事项

### 7.1 常见问题排查

如果 Active Memory 没有按预期工作：

1. ✅ 确认插件已启用：`plugins.entries.active-memory.enabled`
2. ✅ 确认当前 agent id 在 `config.agents` 列表中
3. ✅ 确认你通过交互式持久化聊天会话测试
4. ✅ 开启 `config.logging: true` 并查看网关日志
5. ✅ 验证记忆搜索本身有效：`openclaw memory status --deep`

如果记忆命中很嘈杂，请收紧：
- `maxSummaryChars`

如果 Active Memory 太慢：
- 降低 `queryMode`
- 降低 `timeoutMs`
- 减少最近的轮数
- 减少每轮的字符上限

### 7.2 嵌入提供者意外更改

Active Memory 在 `agents.defaults.memorySearch` 下使用正常的 `memory_search` 管道。这意味着只有当你的 `memorySearch` 设置需要嵌入才能实现你想要的行为时，嵌入提供者设置才是必需的。

实际上：
- 如果你想要一个不能自动检测的提供者（如 `ollama`），显式提供者设置是**必需的**
- 如果自动检测不能为你的环境解析任何可用的嵌入提供者，显式提供者设置是**必需的**
- 如果你想要确定性的提供者选择而不是"第一个可用获胜"，显式提供者设置是**强烈推荐的**
- 如果自动检测已经解析了你想要的提供者，并且该提供者在你的部署中是稳定的，显式提供者设置通常**不是必需的**

如果 `memorySearch.provider` 未设置，OpenClaw 会自动检测第一个可用的嵌入提供者。

### 7.3 调试提供者问题

如果 Active Memory 很慢、为空或看起来意外切换提供者：

- 重现问题时观察网关日志；查找如 `active-memory: ... start|done`、`memory sync failed (search-bootstrap)` 或特定提供者的嵌入错误
- 开启 `/trace on` 在会话中显示插件拥有的 Active Memory 调试摘要
- 如果你还想要每次回复后的正常 `🧩 Active Memory: ...` 状态行，开启 `/verbose on`
- 运行 `openclaw memory status --deep` 检查当前的记忆搜索后端和索引健康状况
- 检查 `agents.defaults.memorySearch.provider` 和相关的 auth/config，以确保你期望的提供者实际上是在运行时可以解析的那个
- 如果你使用 `ollama`，验证配置的嵌入模型已安装，例如 `ollama list`

示例调试循环：
```text
1. 启动网关并观察其日志
2. 在聊天会话中，运行 /trace on
3. 发送一条应该触发 Active Memory 的消息
4. 比较聊天可见的调试行与网关日志行
5. 如果提供者选择不明确，显式固定 agents.defaults.memorySearch.provider
```

---

## 8. 可继续增强的方向

### 8.1 高级逃生舱口

这些选项故意不是推荐设置的一部分。

`config.thinking` 可以覆盖阻塞记忆子代理的思考级别：
```json5
thinking: "medium"
```

默认：
```json5
thinking: "off"
```

默认情况下不要启用它。Active Memory 在回复路径中运行，因此额外的思考时间会直接增加用户可见的延迟。

`config.promptAppend` 在默认 Active Memory 提示之后和对话上下文之前添加额外的操作员指令：
```json5
promptAppend: "Prefer stable long-term preferences over one-off events."
```

`config.promptOverride` 替换默认 Active Memory 提示。OpenClaw 仍会在之后追加对话上下文：
```json5
promptOverride: "You are a memory search agent. Return NONE or one compact user fact."
```

除非你故意测试不同的回忆契约，否则不建议提示自定义。默认提示经过调整，可以为主模型返回 `NONE` 或紧凑的用户事实上下文。

### 8.2 转录本持久化

Active Memory 阻塞记忆子代理运行在阻塞记忆子代理调用期间创建真实的 `session.jsonl` 转录本。

默认情况下，该转录本是临时的：
- 写入临时目录
- 仅用于阻塞记忆子代理运行
- 运行完成后立即删除

如果你想将这些阻塞记忆子代理转录本保留在磁盘上用于调试或检查，请显式开启持久化：

```json5
{
  plugins: {
    entries: {
      "active-memory": {
        enabled: true,
        config: {
          agents: ["main"],
          persistTranscripts: true,
          transcriptDir: "active-memory",
        },
      },
    },
  },
}
```

启用后，active memory 将转录本存储在目标 agent 的会话文件夹下的单独目录中，而不是在主用户对话转录本路径中。

默认布局在概念上是：
```text
agents/<agent>/sessions/active-memory/<blocking-memory-sub-agent-session-id>.jsonl
```

你可以使用 `config.transcriptDir` 更改相对子目录。

谨慎使用：
- 阻塞记忆子代理转录本在繁忙会话上会快速累积
- `full` 查询模式会复制大量对话上下文
- 这些转录本包含隐藏的提示上下文和回忆的记忆

---

## 9. 结论

Active Memory（主动记忆）是 OpenClaw 2026.4.12 版本的一个强大新增功能，它解决了传统记忆系统的被动性问题，让 AI 助手能够在对话中自然地、主动地提取相关记忆。

### 核心要点总结：

1. **快速配置**：使用推荐的 `recent` 查询模式和 `balanced` 提示风格开始
2. **会话控制**：使用 `/active-memory` 命令在会话级或全局级控制
3. **调试查看**：开启 `/verbose on` 和 `/trace on` 查看实时行为
4. **提供者固定**：如果需要确定性的嵌入提供者，显式固定 `agents.defaults.memorySearch.provider`
5. **适用场景**：持久化、面向用户的会话，有长期记忆的场景

Active Memory 特别适合：
- 稳定的偏好
- 重复的习惯
- 应该自然浮现的长期用户上下文

开始使用 Active Memory，让你的 AI 助手变得更加智能和个性化！

---

## 

`#OpenClaw` `#ActiveMemory` `#AI助手` `#记忆系统` `#技术教程` `#LLM` `#AI应用` `#个人助理` `#效率工具` `#技术分享`
