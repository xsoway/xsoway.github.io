---
title: "2026-07-31-deepseek-v4-flash-responses-api-codex"
created: "2026-07-31"
tags: ["KnowledgeBase","DeepSeek","V4-Flash","Responses API","Codex","AI","模型发布"]
category: "技术分享"
published: true
---

# DeepSeek V4-Flash 正式版上线：原生支持 Responses API，专为 Codex 做了适配

DeepSeek V4-Flash 从预览版跑了大半年，终于出了正式版。

这次上线公测的 V4-Flash 正式版，核心变化不是模型结构——架构和参数规模跟之前的 preview 保持一致，只重新做了后训练。但接口层面有个值得注意的更新：**原生支持 OpenAI Responses API 格式，并且针对 Codex 做了专门的适配。**



**DeepSeek-V4-Flash-0731 正式版开放公测，模型结构不变，只改了后训练，核心变化是接口层面原生支持 Responses API 格式并针对性适配了 Codex。Pro 正式版也会尽快发。**



### 1. Responses API 原生支持

之前用 DeepSeek 的 API，走的是 Chat Completions 格式。这次正式版原生支持 Responses API 格式，这意味着：

- 如果你已经在用 OpenAI 的 Responses API（不是老的 Chat Completions），可以直接换 base_url 和 API key 接入，不需要改调用代码
- Responses API 的语义——包括 `response` 对象、工具调用、流式响应等——在 DeepSeek 上保持一致

（基于 DeepSeek 官方 API 文档声称的兼容性写的通用说明，具体以官方文档为准。）

### 2. 专为 Codex 做了适配

Codex 是 OpenAI 的 Agent 编程环境，底层走的是 Responses API。DeepSeek 这次明确标注了针对 Codex 的适配，意味着：

- 在 Codex 里可以直接切 DeepSeek V4-Flash 作为后端模型
- 不需要额外的代理层或适配层
- 工具调用、多轮对话、文件操作等 Codex 的 Agent 能力，理论上都能走通

对于在 Codex 里写 Agent 的开发者来说，多了一个可用的大规模 API 模型选择，不用只盯着 OpenAI 一家。

### 3. 模型结构不变，后训练重新做了

V4-Flash-0731 的模型结构、参数规模和预览版（V4-Flash-preview）保持一致。区别在于后训练阶段重新做了：

- 这意味着在推理能力、指令遵循、输出质量上可能有提升
- 但如果你已经在用 preview 版本，切换后不需要担心模型行为突变——结构一致，后训练只是微调方向

### 4. Pro 正式版即将发布

官方明确说了 Pro 正式版会尽快发布。对于需要更强推理能力的场景，可以等 Pro 版的正式发布公告。

## 快速接入

接入方式跟之前一样，只是模型名和 API 格式变了：

```bash
# Chat Completions（老格式，仍然可用）
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

```bash
# Responses API（新格式，正式版推荐）
curl https://api.deepseek.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model": "deepseek-v4-flash-0731",
    "input": "Hello"
  }'
```

（以上命令为通用示例，具体参数以 DeepSeek 官方 API 文档为准。）
https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/codex/



这次正式版发布，节奏和方向上都能看出一些信号：

- **Responses API 是 OpenAI 推的下一代 API 格式**，DeepSeek 选择原生支持而不是兼容层代理，说明他们在跟着 OpenAI 的 Agent 生态走，而不是自己另起一套
- **Codex 适配**是同一个逻辑——Codex 是现在 Agent 开发最活跃的环境之一，做好适配意味着开发者可以直接在 Codex 里用 DeepSeek 跑 Agent
- 模型结构没变、只改后训练，说明 preview 阶段已经收集了足够多的使用反馈，正式版是在"修 bug 和调优"而不是"推倒重来"

Pro 正式版什么时候来？官方说尽快，等等看。

---

#DeepSeek #V4Flash #ResponsesAPI #Codex #AI #模型发布 #Agent #API #公测