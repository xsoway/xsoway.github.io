---
title: "HelixHarness 深度研究与 QAT CLI 架构评估"
created: "2026-10-31"
tags: ["- KnowledgeBase"]
category: "- Alan の手札"
published: true
---

# HelixHarness 深度研究与 QAT CLI 架构评估

> 经过对官方仓库、工作流说明、上下文加载协议和平台设计的研究，HelixHarness 对 QAT CLI 最有价值的不是某个 Agent 功能，而是如何把一个会调用工具的 Agent，逐步建设成有工程规范、可复用知识、执行证据和质量反馈的专业系统。
> 尤其有三个值得借鉴的方向：
> 
> 1. **把知识与执行约束分开管理**；
> 2. **用完整任务生命周期替代一次性 Prompt**；
> 3. **把 Agent 自身的评测和演进纳入架构**。
> 
> 但两者定位不同：HelixHarness 是依托 Codex、Claude Code 的 AI Coding 工程化插件；QAT CLI 是以 Pi Runtime 为基础的独立测试 Agent 产品。因此不建议直接套用它的工程结构，而建议吸收它的控制机制，在 QAT Domain Layer 中实现。

---

## 第一部分 · 深度研究：HelixHarness 的设计

> 本部分基于官方仓库、使用指南与上下文加载协议的事实转述与设计分析。

### 01. Agent 已经足够聪明，为什么还需要 Harness？

现在做一个 Agent，门槛已经很低：选一个模型，接上工具调用，配好 System Prompt，再加上会话管理，一个能完成任务的 Agent 就有了。

但把它放到真实的工程项目里，问题就多了：

- 同一个需求，今天生成的方案和明天不一样；
- 业务规则明明写在文档里，Agent 却没有加载；
- 代码生成了，测试没有执行；
- 执行失败了，它又尝试修改几次，最后告诉你任务完成。

换成测试场景，问题可能更明显。比如让 Agent 自动测试一个二手车线索接口，它需要知道：买车线索和卖车线索的业务区别、测试环境如何配置、哪些接口有上下游依赖、什么情况下要验证 MQ 消息，以及哪些结果才算测试通过。这些信息显然不可能全部交给模型自己猜。

Prompt 能提供行为指导，但很难单独承担完整的工程约束。**这就是 Harness 要解决的问题。** 可以把 Harness 理解为围绕 Agent 的一整套运行与工程机制：

> **让 Agent 在正确的上下文中，按照既定规则，使用合适的工具，并通过可验证的结果完成任务。**

它不只是 Prompt，也不只是工具注册，还包括知识加载、任务状态、执行边界、权限控制、验证门禁以及失败后的恢复机制。HelixHarness 的价值，就在于尝试把这些机制变成可以在项目里长期运行的工程体系。

### 02. HelixHarness 到底是什么？

HelixHarness 来自滴滴金融科技团队的工程实践。项目主要面向 Codex 和 Claude Code，支持单仓库和多仓库工作空间，官方提供九个公开命令，核心开发流程是：

```
Propose → Apply → Archive
```

它的定位很明确：在现有 Coding Agent 上构建企业或团队自己的工程工作方式。HelixHarness 并不负责重新实现模型推理、Agent Loop 或终端交互，而是借助宿主已有的能力来完成任务。

仓库主要分成两个部分：

| 模块 | 主要职责 |
| --- | --- |
| `helixharness/` | 插件、工程知识、流程命令、上下文和执行约束 |
| `helixharness-platform/` | 可观测性、框架版本评测与改进实验 |

这两个部分相互配合，但不是强依赖：开发者只安装插件，就可以使用工程工作流；团队如果需要分析框架运行情况、评估新版本或改进工作流，再部署可选平台。Agent 的核心能力不应该依赖一个额外的平台才能启动，更不应该因为观测服务出了问题，导致正常工程任务无法执行。这种分离设计也非常适合独立 CLI 产品。

### 03. 设计一：知识与约束分开管理

HelixHarness 在项目里区分了四类内容：

| 分类 | 作用 | 项目目录 |
| --- | --- | --- |
| Knowledge | 系统如何运作、有哪些业务规则 | `docs/knowledge/` |
| Harness | 工程约束、架构边界、执行要求 | `docs/harness/` |
| Specs | 当前需求、任务以及验收标准 | `docs/specs/` |
| Hooks | 阶段检查、验证门禁 | `docs/hooks/` |

乍看就是几个文档目录，但这四类东西在实际工程中经常被混在一起。例如，同样是测试一个线索系统：

- “卖车线索需要校验车辆信息”属于**业务知识**；
- “生产环境只允许只读操作”属于**执行约束**；
- “本次要覆盖接口参数校验、正常流程和异常流程”属于**当前任务要求**；
- “测试报告必须包含失败用例、响应数据和日志位置”属于**验收规则**。

它们的生命周期、修改权限、适用范围并不相同。如果全部写进一个很长的 `AGENTS.md`，短期看起来省事，时间久了就会变成一个越来越难维护的巨大 Prompt。

HelixHarness 还采用**索引引导的上下文加载方式**：项目文档不一定每次都全部塞给模型，而是根据当前任务和执行阶段，加载相关知识与规则。对测试 Agent 来说，API 自动化、性能测试、AI 评测关注的上下文完全不同，每次启动 QAT 都把全部规则加载进去，只会增加 Token 成本，也可能让 Agent 被无关信息干扰。

但按需加载不能等同于“只加载检索命中的内容”。像生产环境权限、安全限制、数据脱敏这些硬约束，必须始终生效，而不能依赖语义检索是否刚好找到。

### 04. 设计二：为什么是 Propose、Apply、Archive？

很多 Agent 的交互方式是：用户提出需求，Agent 开始执行，最后给出结果。简单任务没有问题，但任务稍微复杂一点，就容易产生偏差。

HelixHarness 把工作拆成三个阶段：

- **Propose：先确定到底要做什么。** Agent 读取工程知识和约束，确认需求范围、实现计划与验收标准，生成 `spec.md` 和 `tasks.md`。
- **Apply：按照已经确认的任务执行。** 进行代码实现、测试、Review 和结果验证。
- **Archive：检查证据，并把值得保留的知识沉淀下来。** 任务完成后，不是简单把状态改为 Done，而是检查验证结果和审核情况，把经过确认的稳定知识保存回项目。

这个流程解决了一个测试场景的常见问题：一套测试跑完，报告也出来了，但任务结束之后，系统对这个业务的理解并没有增加。下次再测同类功能，仍然需要重新解释接口之间的依赖、异常分支和业务规则。Agent 做了很多工作，却没把经验留下来。Archive 正好补上了这一环。

但 Archive 不能无条件自动写入知识库。失败日志、Agent 猜测、未经确认的业务规则，都不应该直接成为长期知识。更合理的方式是把本次任务发现的新规则形成候选知识，附带来源和验证证据，经人工确认后再提交，否则知识库可能从“经验积累”慢慢变成“错误积累”。

### 05. 设计三：Agent 的执行结果必须留下证据

HelixHarness 不只关心任务状态，还关心验证证据。开发流程会产生规格说明、任务记录和验证报告，Apply 阶段要求完成测试和 Review。

它还考虑了一个容易被忽略的情况：如果 Review 之后代码又发生了变化，原来的审核结论还能算数吗？官方工作流对这种情况作了处理——变更后的内容需要重新考虑审核，或者由用户明确接受未经重新审核的归档，并在记录中区分两者。

这一点对于测试系统尤其重要。**测试通过不是一句话**，应该能够回答：这次执行使用了哪个环境？测试数据是什么？调用了哪些接口？实际响应是什么？断言结果在哪里？失败时有没有重试？哪些用例没有执行？

如果 QAT 最后只给出一句“20 条用例全部通过”，却拿不出任何执行记录，就不会被当作可信的质量结论。真正有价值的是可以回放、可以核对、可以追踪的证据。因此 QAT 应该将执行证据设计成标准化产物，而不是各个子 Agent 随意生成的一段文字。

比如 API 测试，至少保留请求和响应摘要、断言结果、执行时间、环境信息、用例版本及报告地址。对于 AI Agent 评测，还需要进一步记录模型版本、Prompt 版本、Dataset 版本、调用轨迹与 Judge 评分依据。有了这些数据，后面才能做质量对比和回归分析。

### 06. 设计四：让 Harness 自己接受评测

这是 HelixHarness 相对最突出的一部分。它不只是提供工程工作流，还设计了一套用于评估和改进 HelixHarness 自身的可选平台，官方将其分为三个方向：

- **Observability（运行时发生了什么）：** 记录阶段耗时、Token 使用、返工情况以及执行证据，帮助发现工作流中的问题。
- **Evaluation（改动之后是否更好）：** 在相同的测试 Case 下，对冻结的 Base 版本和 Candidate 版本进行比较，结合确定性检查与模型评分，判断新版本是否带来改进或退化。
- **Evolution（下一步应该改哪里）：** 根据符合要求的执行证据形成改进假设，生成候选变更，交给评测流程验证，最终由人决定是否采用。

这里有一个容易产生误解的地方：HelixHarness Platform 的主要评测对象是 **HelixHarness 框架自身**，不是开发者业务代码的通用质量评分系统。例如把某个上下文加载规则改了，Agent 是否更容易完成同一组开发任务？把某个工程检查改严格了，失败率、返工率或成本是否变化？这些才是它主要研究的问题。

对 QAT CLI 来说，可以借鉴这个方向，现有的 `agent-eval-harness` 刚好可以承担部分工作：以后每次修改 QAT 的 Agent Profile、Skills、工具选择策略或者 Workflow Policies，都使用固定的数据集进行回归评测；不能因为某个版本在一次演示里表现得更好，就判断架构升级成功。至少应该在相同的测试任务、模型与环境下，比较通过率、失败恢复、资源消耗和执行证据质量。甚至可以保留一批专门针对 QAT 自身的测试任务：让它分析一个 OpenAPI 文档、生成接口测试用例、执行参数边界测试，再检查报告是否完整。这相当于给测试 Agent 自己建立一套测试体系——**一个负责测试的软件，本身也需要接受测试。**

### 07. HelixHarness 与 QAT CLI 的定位差异

严格来说，二者不是同一类产品。HelixHarness 依托已有 Coding Agent，重点是工程工作流程和组织知识；QAT CLI 的定位是独立的测试领域 Agent 产品，它不仅需要业务规则、任务状态和验证流程，还需要自己提供测试领域的任务入口、能力路由和工具适配。两者的关系，更接近于不同层次的架构。

| 维度 | HelixHarness | QAT CLI |
| --- | --- | --- |
| 产品方向 | AI Coding 工程化 | AI 测试工程平台 |
| Agent Runtime | Codex / Claude Code | Pi Runtime |
| CLI 入口 | 宿主中的插件命令 | 独立 `qat` 命令 |
| 专业能力 | 需求、编码、测试与 Review | API、性能、Agent 评测、知识检索 |
| 核心流程 | Propose → Apply → Archive | 测试任务全生命周期 |
| 知识管理 | 项目文档与上下文加载 | 专业知识库与业务规则检索 |
| 质量评价 | Harness 框架版本评测 | 被测系统评测 + QAT 自身评测 |
| 扩展机制 | 宿主插件和工作流能力 | Pi Extensions + 外部引擎适配 |

所以，直接把 HelixHarness 作为 QAT 的底座，并不是当前采用的方案。那样会模糊两套系统的职责。既然已经选择了 Pi Runtime，就没必要为了引入工程工作流再引入一套重复的 Agent 执行体系。更合理的方式，是把 HelixHarness 的设计理念迁移到 QAT 自己的 Domain Layer。

---

## 第二部分 · 架构评估：QAT CLI 改造方案

> 本部分把研究的原理落地为 QAT CLI 的工程改造建议。文中的模块划分与接口属于设计建议，并非已完成的实现。

### 1. 总体架构：推荐分层

拟采用的分层架构「QAT CLI · qat」示意如下：

- **Native Pi Runtime**（Agent Loop · Session · Context · Tools）
- **QAT Domain Layer**（Agent Profile · Context Manager · Workflow · Policies · Routing）
- **QAT Engineering Harness**（Specs · Gates · Evidence · Knowledge）
- **External Test Adapters**（API Automation · Agent Eval · RAG）
- **Evaluation / Tracing**

> 设计建议：复用 Pi 的底层能力，QAT 重点建设测试领域控制与执行层。图中并非 HelixHarness 的官方架构。

这套架构中，`QAT Engineering Harness` 可以先作为 Domain Layer 的内部模块，不需要立刻独立成服务。遵循一条原则：**Pi 管 Agent 如何运行，QAT 管测试任务如何完成，Adapters 管专业测试如何执行。**

### 2. 核心领域模块

在 Pi Runtime 承担模型交互、Agent Loop、Session、上下文和工具执行这些基础能力的基础上，QAT 的测试领域层应进一步明确五个核心模块：

1. **Context Manager**：决定当前任务需要什么上下文，哪些安全与工程约束必须加载，哪些业务知识可以通过 RAG 按需读取。
2. **Workflow Engine**：不让 Agent 每次完全自由决定执行步骤，而是根据任务类型进入不同测试工作流。API 自动化可能经过需求分析、测试设计、执行、报告和归档；Agent 评测则需要被测对象分析、指标定义、数据集准备、执行、评分和结果对比。工作流可以不同，但都需要明确的完成条件。
3. **Evidence Store**：统一保存测试执行产物，避免每个外部测试引擎都使用完全不同的结果结构。
4. **Knowledge Evolution**：从已验证的任务结果中提取候选知识，并经过审核后更新到长期知识体系。
5. **QAT Self-Evaluation**：把 QAT 本身作为一个被测 Agent，确保 Skills、Prompt、Runtime 配置和路由策略的升级不会破坏已有能力。

这五个模块，是 HelixHarness 对 QAT 最直接的架构启发。

### 3. 测试工作流设计

模拟推荐的 QAT 标准任务生命周期：

```
用户输入测试需求
  → QAT 意图识别与任务路由
  → Context Manager
  → Propose · 需求与测试方案
     →【测试方案确认】需要调整 → 回到 Propose
  → Prepare · 数据与环境检查
  → Execute · 调用测试引擎
  → Verify · 断言与结果验证
     →【验收门禁】不通过 → 失败分析与受控重试 → 回到 Execute
  → Report · 生成测试报告
  → Archive · 归档证据与候选知识
  → Evaluation · QAT 自身质量反馈
```

这里没有完全复制 HelixHarness 的三个阶段，而是针对测试工作补充了 Prepare、Verify 和 Report。原因在于，**测试工作的核心产物不是代码变更，而是质量证据及其可解释的结论。**

### 4. 推荐项目目录

以下是对现有 QAT CLI 结构的增量建议，保留已确定的 `bin/agent/skills/extensions/adapters/workflows/evaluation` 这些核心目录：

```
qa-test-cli/
├── bin/
│   └── qat                  # CLI 入口
├── agent/
│   ├── profile/             # 测试 Agent 角色规范
│   ├── prompts/             # 系统提示词
│   └── routing/             # 测试领域能力路由
├── skills/
│   ├── api-testing/
│   ├── performance-testing/
│   ├── agent-evaluation/
│   └── knowledge-retrieval/
├── extensions/              # Pi 原生扩展
├── adapters/
│   ├── auto_api/
│   ├── agent_eval/
│   └── wiki_kb/
├── harness/                 # 新增：工程控制层
│   ├── context/             # 上下文加载策略
│   ├── policies/            # 安全和测试执行约束
│   ├── gates/               # 测试验证门禁
│   ├── evidence/            # 执行证据规范
│   └── knowledge/           # 归档及知识审核
├── workflows/
│   ├── api_test.yaml
│   ├── performance_test.yaml
│   └── agent_evaluation.yaml
├── evaluation/
│   ├── datasets/
│   ├── metrics/
│   ├── regression/
│   └── tracing/
├── contracts/               # 跨引擎统一输入输出
├── tests/
└── pyproject.toml
```

其中，`contracts/` 比较关键：三个子项目目前都是独立 Python 工程，而 Pi Runtime 属于 Node.js / TypeScript 生态，跨语言集成时不应让主 Agent 直接依赖每个子项目的 Python 内部实现。建议优先采用 JSON Schema 定义任务请求、运行状态、测试结果及证据引用，再通过子进程 CLI 或本地 HTTP 接口对接现有工程。

例如一个测试任务结果可以统一成：

```json
{
  "run_id": "qat-run-001",
  "engine": "auto-api-test-harness",
  "status": "completed",
  "summary": {
    "total": 20,
    "passed": 18,
    "failed": 2,
    "skipped": 0
  },
  "artifacts": {
    "report": "artifacts/report.html",
    "trace": "artifacts/trace.json"
  }
}
```

这是建议协议，不是现有工程已经实现的接口。后续还应加入契约版本、环境信息、错误模型、取消机制及敏感数据脱敏规则。

### 5. 直接借鉴 / 暂不做的清单

| HelixHarness 思路 | QAT CLI 处理方式 | 优先级 |
| --- | --- | --- |
| Knowledge / Harness 分离 | 业务知识与执行约束分开 | P0 |
| Specs 与任务验收 | 引入测试任务规格协议 | P0 |
| Workflow Gates | 建立测试完成门禁 | P0 |
| 多仓库 Workspace | 后续支持多测试工程协调 | P2 |
| Archive 知识沉淀 | 验证后人工确认入库 | P1 |
| Observability | 先实现 Trace 和事件记录 | P1 |
| Base / Candidate 评测 | 接入 agent-eval-harness | P1 |
| 自动演进候选 | 先生成建议，不自动发布 | P2 |
| 完整 Web Platform | 有实际使用数据后再考虑 | P2 |

> P0：最小产品必须具备；P1：完成闭环后建设；P2：后续扩展。

**执行模式的差异判断。** HelixHarness 当前的核心流程相对固定，围绕软件需求开发组织；测试任务则更加多样：有些任务适合完整生命周期（比如根据需求构建一套新的 API 自动化测试），有些任务很简单（比如重新执行一个已有测试集），还有些任务长期运行（比如性能基线检查、定时回归和 Agent 模型版本评测）。如果所有任务都强制经历 Propose、Apply、Archive，反而会让 CLI 用起来很笨重。因此 QAT 应采用不同的执行模式：快速模式适合已有测试任务，标准模式适合完整测试生命周期，探索模式适合问题分析和测试方案设计。

**框架演进边界。** HelixHarness 的框架演进思路虽有价值，但不代表每次运行都应该自动修改 Skills 或 Prompt。Agent 自己提出改进建议可以，真正修改生产使用的框架配置，仍然需要基准评测、人工审核和版本管理。QAT 第一版也不打算开发一个庞大的可观测平台，先把执行日志、Trace、产物和评测接口定义好，让数据能够留下来；等运行任务足够多，再决定哪些分析界面真正有用——这是更适合个人开源项目的节奏。

### 6. 分阶段实施建议

**第一阶段：先跑通最小闭环。** 完成 `qat` 启动、Pi Runtime 集成、API 测试 Adapter，以及一次从需求到执行报告的标准工作流。验收目标：同一个测试任务能够连续执行、正常失败、恢复并留下完整产物。

**第二阶段：引入 Engineering Harness。** 实现 Context Manager、Policies、Gates、Evidence Store 和测试任务状态持久化。验收目标：即使模型判断错误，也不能绕过生产环境权限和核心验收条件。

**第三阶段：实现质量反馈闭环。** 接入 `agent-eval-harness` 和 `llm-wiki-kb`，建立固定回归数据集，以及受审核的知识归档。验收目标：每次修改 QAT Skills、路由或 Prompt，都可以基于相同任务比较结果。

---

## 第三部分 · 选型判断

**最终结论：**

1. **继续采用 Native Pi Runtime（推荐）。** 保留独立 CLI 产品方向，避免重新实现成熟的 Agent Loop 和 Session 等基础能力。
2. **吸收 HelixHarness 工程机制（选择性借鉴）。** 重点学习 Context、Specs、Gates、Evidence、Archive、Evaluation，而不是照搬插件代码。
3. **直接集成 HelixHarness 为底座（暂不建议）。** 其当前官方支持的宿主是 Codex 和 Claude Code，工作流主要围绕 Coding，不是通用测试 Agent Runtime。

**值得特别强调的边界：** 测试领域的确定性工作应由 Python 测试引擎执行，Agent 负责理解、规划、调度与分析，而不是让大模型替代 pytest、HTTP 断言或其他可靠的测试机制。这样构建出来的 QAT，才有希望既保持 Pi 的交互灵活性，又拥有专业测试产品所需要的可重复性和可信度。

---

## 研究说明与限制

**资料来源：**

- HelixHarness：https://github.com/didi/helixharness
- 官方使用指南：https://github.com/didi/helixharness/blob/main/docs/user-guide.md
- 上下文加载协议：https://github.com/didi/helixharness/blob/main/helixharness/reference/loading-protocol.md

**方法论说明：** 本文结合 HelixHarness 官方开源资料与 QAT CLI 架构规划进行分析。上文涉及的九个命令、两部分架构、上下文分层、流程验证和平台能力，均有官方使用指南支持。尤其需要区别的是，**官方演示数据属于合成 Mock 数据，不能把演示图中的结果当作真实模型性能提升。**

**局限性声明：** 本次研究以官方 README、使用指南和上下文加载协议为主，没有完成本地仓库的逐函数审计、真实运行验证及性能基准测试。因此，以上是基于已核实的公开设计所形成的架构建议，而不是对 HelixHarness 稳定性或性能的实测结论。