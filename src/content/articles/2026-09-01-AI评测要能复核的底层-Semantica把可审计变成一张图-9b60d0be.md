---
title: "AI 评测不能只给个分——Semantica 把\"它为啥这么判\"做成可复核的图"
created: "2026-09-01"
tags: ["KnowledgeBase","AI","Graph","agent评测","审计","知识图谱","开源","质量"]
category: "技术分享"
published: true
---

# AI 评测不能只给个分——Semantica 把"它为啥这么判"做成可复核的图

Semantica 这个开源项目，一句话：**它是给"负责的 AI"打底的一层基建，把 AI 的决策、上下文、因果和溯源，全部变成一张可查询、可审计、可复核的图。** 圈里有人喊它"AI Agent 的开源版 Palantir"；通俗点讲，它让 AI 不再只吐一个结果，而是把"你凭什么这么判"这个问题，用结构化的链路还回给你。

它官方叫"Graph-Native Infrastructure for Context and Accountable AI Systems"（面向上下文和可追责 AI 的图原生基建）。名字长，干的事倒是很落地：喂进数据 → 抽实体和关系 → 建成上下文图、知识图谱 → 在这张图上做因果推理和图分析 → 全程的决策和溯源都记进档，锚在 W3C PROV-O 这种合规框架认的格式里。

对测试和评测方向的人来说，这里最值钱的一个点是：**它的推理、构图、溯源是全确定性的，不拉 LLM 进来跑也能干。** 也就是说，它给你的是一种"不猜、可还原、能复查中间到底发生了什么"的底。

---

## 先把它能用在哪讲清楚，再挑对你是真有用还是搭不上

写之前我得诚实交代一句：**它不是“装上一个就把测试跑完”的工具**，而是你搭“带证据的 AI 评测 / 质量平台”时，底下“存‘决策和结论为什么是这样’”那一层能拿来打地基的东西。你用不用得上，取决于你是哪种活法：

- **要是你写 AI 评测、想在测完给"为什么它是这个结果"提供依据**:它非常适合。它能把你测 Agent 时跑的每个判断（比如"本轮给 A 方案没给 B 方案"）记成带理据、带来源、带链路的节点，让你交的结果不只是个分，还有一份能复查的证据链。
- **你要是做知识库 / LLM-wiki / 需求图谱**:它对口。把散在文档里的实体、关系抽成图，冲突能标出来而不被静默覆盖，去重后再 merge，给你的知识库更多靠"关系"而不是"像不像"。
- **你要是只想要个能把 agent 跑起来的脚手架、或接 CICD 的 pipeline**：它帮不上大忙，得靠你自己接一层，别指望装完就用。

一句话判断：**它很强，但不是万能。它是“可审计的 AI”那一层的地基**——你只要做这一层，它就值回票价。

---

## 想跑起来——照着这么抄就能动

把它装成一个 Python 库，两条命令上手：

```bash
pip install semantica
semantica doctor
```

`doctor` 会检查你的 Python 版本、依赖、配置有没有毛病——不用它，直接装好就跑下面的也成。想自己确认一句配置对不对，可以 `semantica --help`。

### 用 Python（最省事这条，PyCharm 里新建 `.py` 就能跑）

```python
from semantica.context import ContextGraph

graph = ContextGraph(advanced_analytics=True)

# 先把一次"决策"记成可查的图节点，看它长啥样
decision_id = graph.record_decision(
    category="vendor_selection",
    scenario="Choose cloud provider for HIPAA workload",
    reasoning="AWS offers BAA, mature HIPAA tooling, and existing team expertise",
    outcome="selected_aws",
    confidence=0.93,
)
```

记完你会得到一个 `decision_id`，接着能问几个"为什么"型的问题——因果链 / 相似先例 / 影响图 / 合规闸，都是现成方法：

```python
chain     = graph.trace_decision_chain(decision_id)       # 因果来源整条
similar   = graph.find_similar_decisions("cloud vendor", max_results=5)
impact    = graph.analyze_decision_impact(decision_id)
compliant = graph.check_decision_rules({"category": "vendor_selection"})
```

跑起来就是这么几行。命令速查：

| 想看什么 | 怎么做 |
|---|---|
| 装核心 | `pip install semantica` |
| 自检 | `semantica doctor` |
| 记一个决策 | `graph.record_decision(...)` |
| 反问链 | `graph.trace_decision_chain(id)` |
| 找先例 | `graph.find_similar_decisions(...)` |
| 合规闸 | `graph.check_decision_rules(...)` |
| 命令行不写代码 | `semantica` |

---

## 装到我的常用环境里——下面这几种，按你的顺手挑

Semantica 不是只能塞进一个套子，下面这几条有"照抄就能接"的：

**Python / PyCharm**：上面那两段直接跑就够。它是个纯 Python 库，在 PyCharm 里新建个 `.py`、用上你平时配的解释器（venv）跑就行，不用额外起服务。它给各家框架备的扩展可以这么装：

```bash
pip install "semantica[agno]"          # Agno 多智能体集成
pip install "semantica[langchain]"    # LangChain / LangGraph
pip install "semantica[crewai]"       # CrewAI 集成
pip install "semantica[llm-litellm]"  # OpenAI / Anthropic / DeepSeek / Ollama 等
```

**接 Claude Code / Codex / Cursor 这类 agent（当技能/插件挂上去）**：仓库里备了这几个环境的插件包，多数把插件装进 agent 就能叫它调用。这套是“组合使用的活”——不是官方写好的功能，而是你把语义层挂进自己 agent 的用法。

**用 MCP 接**（适合 Claude Desktop、Windsurf、Cline、或任何能调 MCP 的客户端）：30 秒接好。先起服务：

```bash
python -m semantica.mcp_server
# 或
semantica-mcp
```

再在你的 MCP 客户端配置里加这么一段：

```json
{
  "mcpServers": {
    "semantica": { "command": "python", "args": ["-m", "semantica.mcp_server"] }
  }
}
```

配好之后，客户端能直接让你查它暴露的工具——`record_decision`、`query_decisions`、`find_precedents`、`get_causal_chain`、`add_relationship`、`export_graph` 这些，动动嘴就能把决策/图谱记下来或查回去。

**到了生产部署那一步**：官方建议用 Docker / Kubernetes 而不是本地 `pip install`，再配一个持久化图库（Neo4j / FalkorDB 这类）放数据。它是你能自托管、能复查的，不用非把数据送进别人的 SaaS。

---

## 图层面它到底给你攒了什么——让我挑三样说

**1. 决策不是一行日志，是一个能查能追溯的图节点。** 别的 AI 干完就没了，它把一次判断存成带完整上下文的节点，`PROV-O` 导出就是合规框架认的格式。→ 对你做评测/审计，这等于"结论还能翻出底账"。

**2. 能让上下文图、知识图谱、因果推理一张逻辑来跑。** 它的图遍历能回答"这些节点怎么连、谁是谁的输入"这类，也能算中心度、社区、链路预测。→ 把散文档/散结论变成有关系的图，而不是只能"像不像"匹配。

**3. 底下的存储随换，不锁一家。** 你既可以用 RDF（Oxigraph、Blazegraph、Apache Jena、RDF4J），也可以用 LPG（Neo4j、FalkorDB、Apache AGE、AWS Neptune），还带向量库；换后端不碰代码。→ 本地图库能装，才能自己手里把控。

**先说清楚的是边界：它解释的是模型"外"的东西——喂进去的上下文、决策、溯源、关系。模型内部的黑盒思维链它不碰。** 所以别指望它能拆开 LLM 的"内心"；它负责拿得住"外面这一圈为什么"。这正好是评测里最缺的：**可复查的输入、可复查的决策、可复查的证据**。

---

## 那到底值不值得我上一个

说结论：**如果你在做"要能过审计 / 要能给复核证据"的 AI 评测或质量平台，它值得；如果你只是想要个跑完就出个分的评测脚本，那它是用不上的重家伙。** 它把"我去哪拿证据"这个最闹心的问题，做成了"图上一查就有"，而且能自托管、不锁厂商——这层是很多 SaaS 给不了的。

什么时候它会抓瞎：**你要是要的根本不是“可追溯/可解释”，那这思路对你就是拿大炮打蚊子。** 你在真话里不该糊弄的那一句，用一句话替自己算清——你的场景要不要“能把这一判断的来龙去脉白纸黑字翻出来”，这才是决定要不要装它之前，最该先问自己的那句。

`https://github.com/semantica-agi/semantica`

#AI #Agent #知识图谱 #决策溯源 #评测 #审计 #开源 #质量
