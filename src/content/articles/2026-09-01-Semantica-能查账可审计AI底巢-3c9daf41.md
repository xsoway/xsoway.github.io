---
title: "2026-09-01-Semantica-能查账可审计AI底巢"
created: "2026-09-01"
tags: ["KnowledgeBase","AI","Graph","agent评测","审计","知识库","开源","质量"]
category: "技术分享"
published: true
---

# 让机器替你拍板，总得说清它凭啥——Semantica 把"这个决定为什么"做成了能查进账本的账

它是个开源项目，干的事一句话：**给你的 AI 加一层"记账的底"，把 AI 每次决定的来龙去脉、上下文、因果和溯源，都变成一张能查、能审、能复核的图。** 圈里有人叫它"开源版 Palantir"，名字唬人，说白了就是——**AI 不再只给你一个结果，而是你追问"你凭什么这么判"时，它掏得出一份链路。**

它不是聊天工具，也不是"装完就帮你把测试跑完"的小工具，它是你搭"要能对监管交代"的 AI 时，底下垫着的那些石头。至于这层石头对你到底值不值，下面慢慢说。

---

## 它最容易让人想到的东西，其实就是"AI 说了算却没人记得清"那点荒诞

你说它多新奇吗？未必。真正让人心里一紧的，是它对着的现状挺不体面——**现在绝大多数 AI 管"接不接这个单""批不批这个客户"，结果一出来，过程就烂在肚子里了。** 你问它为什么，它只会说"我模型算出来就这样"。像个老匠人，把活干完了却不给看过程，出了问题，你门儿都找不着。

它这个项目的价值，就压在"给这种荒诞的世界一个交代"上：

- **它把"决策"从一行日志，升级成一张能追的图的点。** 别的 AI 干完就忘，它把你测的每个判断（比如"本轮给 A 不给 B 方案"）记成带原因、带来源、带链路的节点，还在 `PROV-O` 这种合规框架认的格式里导出。→ 对你做评测/审计，等于"结论外面还能翻出一套底账"。
- **它能让"因果"被查，而不是靠嘴。** 它的图遍历能回答"这些节点怎么连、谁是谁的输入"，也能算中心度、社区、链路预测。→ 把散在各处的文档、结论连成一张有关系的图，而不是只比"像不像"。
- **底层存储随便换，不锁厂商。** RDF（Oxigraph、Blazegraph、Apache Jena、RDF4J）、LPG（Neo4j、FalkorDB、Apache AGE、AWS Neptune）、向量库都有；换后端不碰你的代码。→ 本地能自托管，数据才在你自己手里。

拿它跟同类几个垫底比一比，最直白：

| 方案 | 底层是啥 | 上手难度 | 适合的场景 |
|---|---|---|---|
| **Semantica** | 把决策记成因果、可溯源的图节点 + 推理 + 溯源导出 | 中（装库、看图） | 做要能对审计交代的 AI 评测 / 质量平台 |
| 普通 RAG / 向量库 | 只答像不像，不存因果也不存决策链路 | 低（pip 装就行） | 只想召回、无所谓溯源 |
| 只记日志 | 记了发生过啥，但不是条能查因果的结构化图 | 低 | 你自己有查日志本事、不差因果 |
| 裸图数据库（Neo4j 这类） | 当存储用，推理、溯源、合规导出全得自己拼 | 高（自己搭推理） | 你已有整套图技术和建模能力 |

说句实在的边界：**它解释的是模型"外"的东西——喂进去的上下文、决策、溯源、关系。模型内部那团"想想"它不碰。** 所以别指望它能拆开 LLM 的心窝子；它管的是"外面这一圈为什么"——这恰好是评测里最缺的：**可查的输入、可查的决策、可查的证据。**

---

## 想动手？照这几步走，别光看它热闹

装成一个 Python 库，最省事：

```bash
pip install semantica
```

装完包，里面带了个 `doctor` 能帮你查环境有没有毛病：

```bash
semantica doctor
```

装好直接进 Python（PyCharm 里新建个 `.py`、跑一个最小例子就行）：

```python
from semantica.context import ContextGraph

graph = ContextGraph(advanced_analytics=True)

# 把一次"决策"记成可查的图节点，看看它长什么样
decision_id = graph.record_decision(
    category="vendor_selection",
    scenario="Choose cloud provider for HIPAA workload",
    reasoning="AWS offers BAA, mature HIPAA tooling, and existing team expertise",
    outcome="selected_aws",
    confidence=0.93,
)
```

这一步跑完，你手上就有一个 `decision_id`——它可以接着回答"为什么"型的问题，整条链路都是现成的：

```python
chain     = graph.trace_decision_chain(decision_id)       # 因果来源整条
similar   = graph.find_similar_decisions("cloud vendor", max_results=5)   # 相似先例
impact    = graph.analyze_decision_impact(decision_id)    # 影响下游谁
compliant = graph.check_decision_rules({"category": "vendor_selection"})  # 合规闸
```

`trace_decision_chain` 出来是一串能查的因果链，`find_similar_decisions` 翻出曾经的同类判决。跑起来就是这么几行，不玄乎。

---

## 说到"能查"，它想走的通道也给你铺好了——几种，按你顺手挑

它不只能在你本地 Python 里用，还能接进 AI 那套，让它"有事发生时，自己就把账记了"。

**接进 agent / Codex / Claude Code / DeepSeek Harness 这种**：装好插件、或把 MCP 服务接进去。不是说它官方"自动帮你记"，更多是"你把语义层挂进自己的 agent"——这是个组合使用的活，你得自己搭。

**接 MCP（Claude Desktop / Windsurf / Cline 都能）**，30 秒接好，先起服务：

```bash
python -m semantica.mcp_server
# 或
semantica-mcp
```

再到你的客户端配置里加这么一段：

```json
{
  "mcpServers": {
    "semantica": { "command": "python", "args": ["-m", "semantica.mcp_server"] }
  }
}
```

配好之后，你能让 agent 直接查它暴露的 `record_decision`、`query_decisions`、`find_precedents`、`get_causal_chain` 这些——你张嘴说一句"记一下刚才那个决定""翻一下去年那笔同类"，它就把该记的记了、该翻的翻出来。

**自己上生产**：官方建议用 Docker / Kubernetes，别拿本地的 `pip install` 直接当线上跑；再配个持久化的图库（Neo4j / FalkorDB 这类的图）放数据。这样它才立得住、禁得起查。

---

## 那到底值不值得给自己上一套

说结论，不绕弯子：**你如果做的正是"要能对审计交代的 AI 评测 / 质量平台"，它值得——因为它把你最头疼的'我去哪拿证据'，做成了'图上一查就有'，还自托管、不锁厂商。** 你如果只是想找个跑完出个数字的评测脚本，那它是用不上的重家伙，别被"图"两个字晃了眼。

它抓瞎的时候也明白：**你要的根本不是"可追溯/可解释"，那这套对你就成了拿大炮打蚊子。** 该不该上它，先别急着砸钱砸时间，只需替自己算清一句——**你的场景，要不要"能把这一判断的白纸黑字翻出来"？** 要，它就有戏；不要，那你大概不差这一层楼。

`https://github.com/semantica-agi/semantica`

#AI #Agent #知识图谱 #决策溯源 #评测 #审计 #开源 #质量
