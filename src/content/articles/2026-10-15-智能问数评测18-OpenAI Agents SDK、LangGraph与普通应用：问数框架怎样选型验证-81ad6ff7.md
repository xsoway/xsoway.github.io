---
title: "OpenAI Agents SDK、LangGraph与普通应用：问数框架怎样选型验证"
created: "2026-10-15"
tags: ["KnowledgeBase","AgentEval","TextToSQL","测试工程"]
category: "公众号文章"
published: true
---

# OpenAI Agents SDK、LangGraph与普通应用：问数框架怎样选型验证

Agent SDK是否合适，应从应用需要控制的流程、状态、工具和证据判断。专用问数不必先构建多个自由协作角色；普通应用代码加少量模型调用，也是应当纳入比较的候选。


这里讨论的是 **OpenAI Agents SDK**。它运行在自己的应用中，区别于 OpenAI 托管的 Agents API，也区别于普通模型 API 客户端。[官方 SDK 定位](https://developers.openai.com/api/docs/guides/agents/sdk)说明：应用管理部署、工具、存储和批准，SDK 管理 Agent 循环。

|候选|官方能力与定位|本项目适用条件|选择限制|
|---|---|---|---|
|OpenAI Agents SDK|Agent 循环、工具、结构化输出、会话、handoff、Guardrails 和追踪|标准问数流程；业务规则以普通 Python/TypeScript 代码管理|会话与暂停恢复不等于完整业务调度；授权、幂等和部署仍归应用|
|LangGraph|显式状态、节点和边；支持持久化与暂停恢复|分支、节点级状态和长流程恢复是主要需求|状态设计、存储运维和重放幂等仍由应用负责|
|Pydantic AI|类型化工具、依赖注入、结构化输出；可用普通 Python 流程|团队偏好类型约束和低抽象代码|类型正确不代表指标正确或授权通过；复杂恢复需另设计|
|Microsoft Agent Framework|Python/.NET；Agents 与显式 Workflows，模型和工具集成|已有 .NET、微软企业平台和团队经验|逐项核验锁定版本与所需组件，不混同成熟度|
|普通 Python 服务＋模型 SDK|应用自行调用模型、工具与数据服务|固定短流程，暂不需要通用 Agent 循环|最少框架依赖，但编排、兼容与恢复代码由团队维护|

**暂不指定胜出框架。** OpenAI Agents SDK、LangGraph 和其他候选均应按同一组需求比较。标准短流程可验证 SDK 或普通应用代码；复杂节点状态与恢复可验证 LangGraph。这是试验范围划分，不是稳定性排名。

|比较问题|OpenAI Agents SDK 路线|LangGraph 路线|本项目判断|
|---|---|---|---|
|流程写在哪里|普通应用代码规定顺序，Runner 管模型/工具循环|节点、状态与边显式规定流转|固定流程可先用 SDK，分支大量增长时比较图编排|
|支持多轮吗|有 sessions 或其他延续策略|有会话检查点和状态存储|不能把多轮能力当成二者独有优势|
|支持暂停恢复吗|有 interruption 与可保存的 run state|有图检查点与 interrupt|二者都要验证崩溃、撤权、重复副作用；不宣称 SDK 无法恢复|
|权限谁控制|应用、查询服务和数仓|应用、查询服务和数仓|两者都不能替代公司 ACL|
|多模型怎么接|官方指向语言 SDK 的 provider/adapter 接口|按选定模型集成验证|非 OpenAI 模型和公司兼容端点均需真实 PoC|
|需要同时引入吗|可以独立使用|可以独立使用|初期只选一个主运行方式，减少重复状态和重试逻辑|

SDK 能直接帮助的地方：

- **结构化输出**：让模型输出指标、时间、维度、候选 SQL 或“需要澄清”等字段；字段有效不等于业务结论正确。依据：[Agent definitions](https://developers.openai.com/api/docs/guides/agents/define-agents)。
- **可信上下文**：把已认证身份、客户端等依赖放入应用本地 context；SDK 不自动将这些依赖发给模型。应用仍须禁止工具从可修改参数中读取身份，也不能主动把密钥放进提示词或日志。依据：同页的 local context 说明。
- **会话和暂停恢复**：选定一种历史管理方式，保存需要的状态；生产存储、访问权限和并发策略单独设计。依据：[Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents)与[Results and state](https://developers.openai.com/api/docs/guides/agents/results)。
- **工具与协作**：可以用窄 function tools；handoff 是转交任务控制权，不能转交或扩大数据权限。初期一个问数角色即可，不先拆成自由协商的多 Agent。依据：[Orchestration](https://developers.openai.com/api/docs/guides/agents/orchestration)。
- **Guardrails**：可检查输入、输出或函数工具，但覆盖位置有差异。安全关键校验必须阻塞执行；并行输入检查不能替代查询前授权。依据：[Guardrails](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)。
- **Tracing**：可记录模型、工具和自定义步骤。官方说明常规服务端路径默认启用追踪；接公司数据前核对导出、敏感字段、保留和关闭/过滤配置。它不能自动覆盖外部查询服务和数据库全部审计。依据：[Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability)。

**SDK 候选结构（设计，未实现；用于公平比较）：**

先让 SDK 产查询候选，应用代码校验后调用查询服务，再让 SDK 根据已授权结果解释。查询执行顺序不能由模型跳过。若后续把查询服务包装成 function tool，该工具本身仍需同样强制校验，不只靠提示词。

Python示例用于说明应用与测试契约，并不意味着SDK只支持Python。Pydantic 指业务契约校验模型，不意味着还要叠加 Pydantic AI。[Models and providers](https://developers.openai.com/api/docs/guides/agents/models)允许使用 provider/adapter 路线，但不能据此承诺任何兼容接口都完整支持工具调用、结构化输出、流式和追踪。

PoC 特别验证：锁定模型接口的工具/输出兼容；本地 context 不泄露敏感信息；会话并发不串号；暂停后撤权仍被拒绝；有限模型轮次、查询配额和总超时；取消是否真正终止数据平台任务；崩溃后不重复交付；Trace 与独立业务审计能够关联。

其他候选能力依据：[LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)、[Pydantic AI overview](https://pydantic.dev/docs/ai/overview/)、[Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/overview/)。以上比较没有安装或实测任何候选框架。

框架之外的基础工具：pytest 做确定性组件验证；现有 agent-eval-harness 做独立业务评测；OpenTelemetry 作为观测候选；SQLGlot 作为 SQL 语法树检查候选。具体接入须在 PoC 中验证。


## 用统一的契约探针验证模型适配

SDK支持某类模型提供方，不等于选定端点完整支持工具调用、结构化输出、流式终态和错误传播。为每项能力设置输入、预期和失败反例，再通过候选适配器真实执行。探针应保留原始响应与版本，不能只让模型说自己支持这些能力。

|探针|正常样本|反例或故障|需要确认|
|---|---|---|---|
|结构化候选|批准指标、日期和门店|缺字段、非法类型、未知指标|格式校验与业务语义校验分开|
|工具调用|一次批准只读工具|非法参数、禁止工具、工具错误|应用是否在副作用前拦截|
|会话|相同主体连续澄清|另一主体复用会话|会话编号不充当鉴权|
|暂停恢复|等待审批后恢复同次run|暂停期间撤权|不能用旧权限继续执行|
|流式|完整输出及明确终态|断流、重复片段、无最终输出|不将半截文本当业务完成|
|观测|模型与工具步骤|外部查询或发送缺审计|SDK Trace不是全部业务证据|

下面示范候选结构校验器，使用标准库，不调用任何SDK或线上模型。它核对格式、批准指标和半开日期，只能证明本地契约规则。真实兼容性必须让被选适配器产生响应后再核验。

```python
import json
from datetime import date

def parse_candidate(raw):
    data = json.loads(raw)
    if not isinstance(data, dict) or set(data) != {"metric", "start", "end"}:
        raise ValueError("invalid candidate fields")
    if data["metric"] not in {"approved_net_sales"}:
        raise ValueError("unknown metric")
    start, end = date.fromisoformat(data["start"]), date.fromisoformat(data["end"])
    if start >= end:
        raise ValueError("invalid period")
    return data

ok = dict(metric="approved_net_sales", start="2026-09-01", end="2026-10-01")
assert parse_candidate(json.dumps(ok)) == ok
for bad in [ok | {"metric": "invented"}, ok | {"end": "2026-08-01"}, ok | {"user": "tester_b"}]:
    try:
        parse_candidate(json.dumps(bad))
    except ValueError:
        pass
    else:
        raise AssertionError("invalid candidate accepted")
```

拒绝额外的user字段不等于已经完成身份验证，身份本来就不应该从候选中取得。可信身份经应用本地上下文传入执行服务；应用若主动将其凭据写进工具输出或提示，仍然会泄露。类型校验也不能证明“净销售额”的业务公式正确，需要引用批准语义版本并独立对账。

## 测试不能只验证SDK给出的成功对象

SDK Runner和评测框架的EvalRunner承担不同职责：前者执行被测Agent，后者组织评测任务、收集结果并归一化。不能为了引入业务SDK，反过来在评测Core里再放一套自主编排模型，从而让判定与执行混在一起。

固定任务分类、条件提取与结果标准，先对普通应用、SDK和图编排各自的必要能力做小范围验证。缺少恢复或观测不一定都要立即引入完整图框架，也可以由应用补明确状态机；反过来，复杂分支与持久恢复已经成为主要需求时，应验证图编排能否减少手写状态和重放错误。

评测指标包括候选schema通过率、业务条件完整匹配、工具参数合规率、错误传播正确率、恢复成功率与证据完整率。每项分母都是适用且已执行任务，缺证据单列。字段格式完全正确但返回错误业务指标，仍应使端到端任务失败。

## 本地上下文、模型上下文与状态快照

这三种对象容易被混为一谈。模型上下文是模型实际看到的输入、历史和工具结果；本地上下文承载应用依赖及认证信息，不会仅因传给SDK就自动发送给模型；状态快照用于继续暂停的执行。应用若把本地秘密拼入提示或工具返回，仍然会泄露，类型系统不能阻止这种业务错误。

同一用户的新一轮对话与同一次暂停run的恢复也不同。前者延续会话历史，后者继续尚未结束的执行。恢复时的权限、数据与预算可能已经变化，需要应用重新核验。不能因为SDK保存了旧状态，就认为旧授权可以永久有效。

|术语|含义|问数验证|
|---|---|---|
|SDK|嵌入自有应用的软件开发工具包|应用仍管理身份、部署和业务接口|
|handoff|转交任务控制权|不能扩大工具或数据权限|
|guardrail|在指定位置执行的检查|核对覆盖时机，不替代查询服务授权|
|checkpoint|可恢复状态快照|持久性、归属和重放要另测|
|provider adapter|连接具体模型服务的适配|结构化输出、工具、流式和错误需真实探针|
|rubric|语义评分标准|先人工校准，不覆盖确定性失败|

SDK选型的交付物应包含锁定版本、适配能力矩阵、实际调用记录、失败反例、状态与观测策略，以及未验证项。没有安装或连接真实模型时，可以交付设计与本地规则验证，不能写成兼容性已经通过。

## SDK在业务流程中的位置

```mermaid
flowchart LR
 A[可信应用上下文] --> B[SDK理解问题]
 B --> C[候选及澄清]
 C --> D[应用契约校验]
 D --> E[独立授权查询服务]
 E --> F[最小授权结果]
 F --> G[SDK解释及应用交付校验]
```

下面是试验记录示意，不是任何SDK的现有配置。每项能力都要保存实际版本和反例结果；还没有真实调用时保持未验证。

```yaml
试验对象: 一个锁定版本的SDK与模型适配
固定资产: 同一语义、授权、快照、问法和Oracle
兼容探针:
  - 结构化候选与未知字段
  - 工具错误与有限调用
  - 会话隔离与暂停恢复
  - 断流终态与观测映射
业务验证: 条件、权限、结果、产物和实际交付
```

## 经验感想

先以统一契约验证必要能力，再决定是否需要Agent循环或图编排。SDK能提供模型运行原语，身份、授权、语义和外部副作用继续由业务应用负责。

## 推荐标签

#智能问数 #Agent评测 #测试工程 #技术设计
