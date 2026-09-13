---
title: "2026-09-04-agiledon-三件套-给编码Agent立规矩-生成重构测试"
created: "2026-09-04"
tags: ["KnowledgeBase","WeChat","AgentSkill","DDD","Refactoring","TestGeneration"]
category: "AI-Tool"
published: true
---

# 给编码 Agent 建立工程约束：三个工具覆盖生成、重构和测试

同一作者维护三个独立开源工具，均面向 AI 编码助手。Sparrow（`sparrow-ddd`）用于 spec 驱动的 DDD，新功能从需求进入后端代码；OpenMole（`openmole`）用于基于坏味道的既有代码重构；Khufu（`khufu-kit`）用于按测试金字塔生成测试。三者分别对应三个 npm 包、三个仓库和三套 `init`，不是同一仓库中的子模块。

AI 编码助手可以显著提高代码生成速度，但生成结果未必符合项目约束：可能缺少分层，测试覆盖不足，重构时也可能改变既有业务逻辑。问题不一定出在模型能力，而在于缺少明确的工程规则和可检查的执行过程。

这三件工具处理的正是这类约束问题：它们不提供新的模型，而是为需求开发、既有代码重构和测试生成分别提供工作规则。下面按工具职责展开。

---

## Agent 编码为什么需要工程约束

AI 编程工具的效率提升，不能只用生成速度衡量。

更常见的问题是生成结果不符合项目既有约定。DDD 项目可能被生成成平铺的 service，测试生成可能缺少边界覆盖，老代码重构也可能连带改变业务逻辑。代码评审因此需要同时检查结果和过程。

三件工具通过约束资产、阶段工件和复核步骤降低这种风险。每个阶段都有明确输入和输出，过程文件可以被评审和追溯。

---

## 一条流水线的三段：一句话讲清它们怎么分工

下面的链路展示一条从需求到可回归测试的组合使用路径：

```mermaid
flowchart LR
    REQ[需求] --> SP[Sparrow 生成 DDD 代码]
    SP --> CODE[新代码]
    CODE --> OM[OpenMole 甩坏味道重构]
    OM --> CLEAN[更干净的代码]
    CLEAN --> KH[Khufu 补测试]
    KH --> TEST[可回归的测试]
```

再说得直白一点：

- **Sparrow**（新功能）：输入 PRD 后拆分 subdomain 和 bounded context，逐步生成 `application / domain / infrastructure` 等 DDD 工程，并产出 spec、model、plan 等 markdown 工件。
- **OpenMole**（老代码）：将一次重构拆成 `badsmells.md`、`plan`、`apply`、`archive` 等阶段，记录坏味道、改造计划和归档结果。
- **Khufu**（测试）：按 UT、IT、API、E2E 划分测试层级，先定义覆盖率、正确性和性能等质量目标，再生成测试并执行 Evaluate、Verify。

三件工具分别覆盖新功能生成、既有代码重构和测试生成。单独使用时职责独立，组合使用时可以形成从新需求到可回归测试的工作链路。

### 用一个订单查询需求串起三件套

案例输入是一条需求：新增“按订单号和状态查询订单”的接口。PRD 明确订单号必填，状态限定为 `paid`、`cancelled`、`refunded`，查询结果支持分页。

第一步交给 Sparrow：把需求拆成领域模型、应用服务和基础设施接口，并留下 spec、model、plan 等可阅读工件。第二步，如果项目已有一段重复拼接 SQL 的旧查询代码，再交给 OpenMole：先记录坏味道，再按 plan 改造，最后归档变更。第三步交给 Khufu：为订单查询补单元、接口和关键路径测试，至少覆盖合法状态、非法状态、空结果、分页边界和重复请求。

验证不是“命令执行完就算成功”。需要检查生成的目录和文件是否落在项目约定的位置，重构前后查询结果是否一致，测试是否覆盖上述边界，并记录实际测试命令和输出。本文没有在本机安装这三个 CLI，目录产物和运行结果只能按各项目官方说明判断，不能写成实测结果。

这个案例的迁移边界也很清楚：三件套的串联是本文的组合使用方案，不是三个项目之间存在官方集成；Sparrow 不因此获得重构能力，OpenMole 也不因此负责生成业务功能。

---

## 三个工具的安装与使用

下面给出三个安装命令。Sparrow 的 Node 版本要求来自官方说明；三个 CLI 均未在本机实测，目录和运行结果按官方资料标注。

运行前需要安装 Node（Sparrow 要求版本不低于 18）和一个兼容的 AI 编码工具，示例使用 Claude Code。

**Sparrow：让新功能变成 DDD 工程**

```bash
npm install -g sparrow-ddd
cd your-project
sparrow init --tools claude
```

按官方说明，命令会生成 skill、命令文件、`sparrow.json`、`docs/sparrow/harness/` 以及 `~/.config/sparrow/harness` 等约束资产，并在 Claude Code 中提供 `/sparrow-harness`、`/sparrow-explore` 等命令。上述目录产物未在本机实测。

**O. OpenMole：让" 坏味道"变成一次正式的重构**

```bash
npm install -g openmole
cd your-project
openmole init --none
```

`--none` 意思是只建 workspace 不动 IDE：它会创建一个 `openmole/config.yaml` 和 `openmole/changes/`（含 `archive/`）目录。想接具体 IDE 就把 `--none` 换成语 `--ides cursor,opencode,...` 之类。之后在工作流里用 `/mole-explore`、`/mole-apply` 这样的命令走"识别坏味道→拆任务→复核→重构→归档"。

**Khufu：让功能按"该测什么"补测试**

```bash
npm install -g khufu-kit
cd your-project
khufu init
```

按官方说明，命令会在根目录生成 `khufu.yaml`，并将 `khufu-ut`、`khufu-it`、`khufu-api`、`khufu-e2e`、`khufu-harness` 五个 skill 安装到指定 IDE 的对应目录；该结果未在本机实测。

> 三条命令均来自各项目官方说明，命令本身未改写。三个 CLI 的目录生成和代码、测试、重构产物未在本机验证，实际结果以目标环境为准。三个项目需要分别安装并在对应 AI 编码工具中使用，不是一次安装的统一平台。

---

## Sparrow：将需求转为 DDD 工程

Sparrow 不只是生成目录骨架，还提供约束资产（harness）。

Sparrow 为每个阶段定义必做项和禁止项，分为全局约束与项目约束，项目约束优先。各阶段读取 harness 后再执行。输入 PRD 后，流程先通过 `explore` 补充业务规则，产出 `prd-business.md` 和系统质量文档，再通过 `arch` 划分 subdomain、bounded context，必要时补充前端架构，最后按 `design → model → plan → apply` 生成代码。

其中一个概念是 **Interaction Context**。它与 Bounded Context 平级，用于承接前端 UI 和 BFF 的聚合。后端 BC 与 Interaction Context 分别执行 `design→model→plan→apply`，通过约定表衔接，具备并行处理的条件。

上述内容来自官方文档描述。官方说明各阶段会生成可 review 的 markdown 工件，并在 apply 阶段生成 DDD 四层代码文件；本机未验证该过程。

---

## OpenMole：将代码重构过程化

OpenMole 是拿来动"老代码"的。整条链就五个字：**explore → plan → apply → archive**。

- `explore`：为一次改动建一个 change，把"哪块代码现在有坏味道"写进 `badsmells.md`；
- `plan`：把要动的部分拆成 `tasks.md` 一张张任务；
- `verify`：重点，确认覆盖到该覆盖的；
- `apply`：真正执行重构；
- `archive`：归档本次 change，将变更记录存进 `archive/`。

OpenMole 将改动拆成可检查的阶段，每一步的变更都写入 markdown，便于 review。对于老代码，能够回看、归档和复现的重构过程，比一次性重写更容易追踪原因和影响。

它支持 Cursor、OpenCode、Claude Code、Codex 等 IDE，均通过 `init` 安装 skill。“用 markdown 管理一次改动”的方式也可以独立复用：一次改动对应一份记录，完成后归档。

---

## Khufu：先定义质量，再生成测试

Khufu 将测试生成拆成质量定义、分层生成和结果核验三个部分。

主要机制包括：

1. **EDD（先定义质量，再生成测试）。** 流程先确定覆盖率、正确性和性能目标，再生成测试。每一层测试对应明确质量标准，执行后生成目标、实际结果和状态的对照记录。
2. **金字塔不重叠。** UT、IT、API、E2E 分别负责纯业务与算法、组装与事务、状态码与请求校验、关键用户路径。同一风险不重复放到多个层级，减少测试冗余和误报。
3. **SDD（Spec 驱动） + fragile 处理。** 测试被当成可版本化的 markdown spec（`specs/<feature>/spec.v<N>.md`），正生成（Spec→Tests）反向（Tests→Spec）都能走，每一次 spec 改动都有 `CHANGELOG`。遇到特别难 mock 的旧代码，它给 PowerMock 这类"脆片"标上 fragile 再默认排除出 CI、只按周跑，当成技术债控到 20% 以内。

对于 Agent 是否生成测试的问题，Khufu 采用“先定义质量、再生成测试”的方式。该方法也适用于由模型生成测试候选、再按固定标准复核的流程。

---

## 三个一起用，是"组合"不是"平台"

三个项目的职责边界需要单独说明：

- **Sparrow 只负责新功能生成**——不负责既有代码重构，也不负责测试生成；
- **OpenMole 只负责既有代码重构**——不负责新功能生成；
- **Khufu 只管"测试怎么补"**——不生成业务代码，也不做重构。

因此可以形成一条组合链路：**新需求 → Sparrow 生成 DDD 代码 →（可选）OpenMole 重构既有代码 → Khufu 补充测试**。这是本文提出的组合使用方式，不是统一平台。三个 npm 包、仓库和能力边界均相互独立，Sparrow 不负责重构，OpenMole 不负责生成业务功能，Khufu 不负责业务代码生成。

该组合关系属于本文的使用视角，具体能力以三个项目各自的官方说明为准。

---

## 与其他方案的区别

下面从定位、成本和适用场景比较三者：

| 方案 / 思路 | 核心定位 | 上手成本 | 适合场景 | 不适合场景 |
|---|---|---|---|---|
| **Sparrow** | spec-driven DDD，新需求→后端前端代码 | 中（Node≥18，init 后在 IDE 使用 skill） | 需要把 DDD 变成 Agent 可重复流程 | 仅需生成一个小函数 |
| **OpenMole** | 坏味道驱动重构既有代码 | 中 | 需要持续维护和重构老代码 | 只需修复一行 bug |
| **Khufu** | 测试金字塔 + EDD + SDD | 中 | 需要统一质量标准和分层测试 | 只需补两条单元测试 |
| **手写 prompt 让 Agent 写码** | 一个对话完成任务 | 低 | 一次性小任务 | 需要可回看的 DDD、重构和测试纪律 |

表格中的适用范围是选型判断，不是官方结论。需要持续进行 DDD 开发、老代码重构或分层测试时，三件套的流程化价值更明显；单点小需求不必引入完整链路。

## 能力边界

- **工具不会自动解决所有工程问题。** 三个项目都需要 Node、IDE 和模型配置。最终结果仍取决于需求输入和约束质量，harness 不能替代需求分析。
- **工具不保证代码没有缺陷。** harness 可以约束结构和流程，但结构正确不等于业务逻辑正确，生成代码和测试仍需要执行验证。
- **架构决策仍由开发团队负责。** 是否拆分模块、如何划分 bounded context 等问题，需要结合项目规模和业务边界判断，工具只负责固化执行过程。

---

三件工具的共同价值是把编码任务拆成可检查的阶段：需求开发强调约束，重构强调变更记录，测试强调质量标准。工具负责执行流程，开发团队负责确认需求、边界和结果。

---

原文链接：<https://github.com/agiledon/sparrow> <https://github.com/agiledon/openmole> <https://github.com/agiledon/khufu>

`#AI编程` `#Agent工程` `#DDD` `#代码重构` `#自动化测试` `#开源工具`
