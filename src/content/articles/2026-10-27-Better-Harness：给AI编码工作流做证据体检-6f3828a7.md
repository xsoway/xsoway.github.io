---
title: "代码改完了，验证去哪了？Better Harness 专查 AI 编码背后的工作流"
created: "2026-10-27"
tags: ["KnowledgeBase","BetterHarness","AIAgent","测试开发","Workflow"]
category: "公众号文章"
published: true
---

# 代码改完了，验证去哪了？Better Harness 专查 AI 编码背后的工作流

Agent 改完代码，回复任务已完成。打开记录，测试跑在修改之前，改完之后没有再验证。项目里明明有测试命令，也写了提交前检查，执行过程却绕了过去。

只看最终代码差异，很难回答这些问题：任务要求有没有读到，检查有没有覆盖最后一次修改，同样的遗漏下次还会不会发生。

**QoderAI 的 Better Harness 是一个通过现有 Coding Agent 运行的开源工作流分析工具。** 它结合项目文件与宿主支持的会话证据，生成按优先级排列的问题、修复建议和验收要求。

这里的 Harness，指的是围绕 Agent 配置的工作条件：项目说明、工具、权限、测试、检查与恢复方式。Better Harness 检查的是这些条件怎样参与一次任务。

## 它与代码审查、自动测试有什么不同

这几类检查可以配合使用，关注的对象并不相同。

| 检查方式 | 主要观察什么 | 典型问题 |
|---|---|---|
| 代码审查 | 代码变更和实现逻辑 | 新增查询是否存在越权读取 |
| 自动测试与检查脚本 | 程序在指定条件下的行为 | 重复支付回调是否只处理一次 |
| Better Harness | Agent 执行任务时的指引、动作与证据 | 改完支付逻辑后，是否执行了相关验证，结果是否对应最终变更 |

测试通过，可以证明某组检查在当时通过。项目里有测试文件，只能证明文件存在。两者之间还隔着执行时机、检查范围和结果记录。

Better Harness 的[评估模型](https://github.com/QoderAI/better-harness/blob/main/models/agent-work-loop.md)反复区分这些证据，不会仅凭安装了多少 Skill、配置了多少工具就认定工作流有效。

## 项目里有工作流，也有收集和生成报告的实现

根据[中文 README](https://github.com/QoderAI/better-harness/blob/main/README.zh-CN.md)，项目开放了工程实践、评估模型和可运行实现。阅读仓库时，几个入口可以对应起来：

- `skills/better-harness/SKILL.md`：规定分析顺序、证据范围、角色分工和报告生成方式。
- `models/agent-work-loop.md`：规定怎样评价任务过程，什么证据能支持什么结论。
- `scripts/`：承载证据收集、分析、报告渲染及其他命令能力。
- `references/`：提供会话证据、项目工作条件、Agent 配置和重复工作等判断指南。
- `docs/adapters/README.md`：说明不同编码工具可以收集什么、输出什么。

它沿用 Claude Code、Codex、Qoder、Cursor 等宿主执行分析，不是另一个需要迁移代码的编辑器。具体安装入口和报告形式随宿主变化，不能把一种宿主的命令直接套给另一种。

## 五个问题，把一次任务看完整

Better Harness 用 Agent Work Loop 评价任务过程。可以将它理解为从接到任务到留下经验的五个检查方向。

| 方向 | 对应的实际问题 |
|---|---|
| 任务理解 | 目标、验收标准和允许修改的范围是否明确 |
| 受控执行 | 是否沿项目支持的启动、操作和权限路线推进 |
| 变更验证 | 是否验证最终修改，失败后是否诊断并重新检查 |
| 可靠交付 | 结果是否经过适当验收，高风险操作是否获批，能否恢复 |
| 经验沉淀 | 反复发生的问题是否变成后续任务能用的改进 |

评价的单位叫 Task Episode，即围绕一个用户目标及其验收范围形成的任务过程。它可以跨多轮对话；同一会话里不相干的工作，也不能随意拼成一次任务。

[规范工作流](https://github.com/QoderAI/better-harness/blob/main/skills/better-harness/SKILL.md)要求先收集限定宿主、项目和时间范围的证据包，再安排三个独立的只读角色：分别观察会话、项目以及 Agent 的规则和技能等配置。主 Agent 汇总证据、处理分歧，确定问题严重程度，再生成报告。

这种分工保留了几种不同事实：配置写了什么、任务中做了什么，以及结果能证明什么。它们需要相互核对，不能相互冒充。

证据不足会影响结论，也可能阻止报告生成。例如，规范中的常规模式在必要证据通道不完整时会阻断，不能承诺任何项目都能自动得到一份完整报告。

## 在 Claude Code 里怎样开始

中文 README 给出的 Claude Code 安装方式是，先在 Claude Code 中添加插件市场：

```text
/plugin marketplace add QoderAI/better-harness
```

再安装插件：

```text
/plugin install better-harness@better-harness
```

通过终端查看插件是否被发现：

```bash
claude plugin details better-harness@better-harness
```

README 要求详细信息包含 `Skills (1) better-harness`。之后在需要分析的仓库中开启新会话，输入：

```text
/better-harness 分析此项目的 AI 编码工作流并生成基于证据的报告
```

按该文档，Claude Code 默认在 `.claude/better-harness` 报告根目录下输出自包含的 `report.html`，并配套 `report.md` 和 `findings.json`。自包含 HTML 可以作为一个文件打开阅读；也可以要求仅在聊天中输出、不生成文件。

以上命令和输出约定来自项目 README，本次未安装或运行 Better Harness。需要查看报告样式，可以直接打开项目提供的[英文示例报告](https://qoderai.github.io/better-harness/demo/better-harness-report/)。示例不是当前项目的检查结果。

## 模拟案例：支付回调改完，相关验证却没跟上

**以下是依据项目能力设计的业务模拟示例，不代表 Better Harness 已发现的真实问题，也不是实测结果。**

假设电商项目修改了支付回调处理。业务要求是：相同回调重复到达，只能完成一次订单状态推进和权益发放。

团队希望检查的，不只是实现有没有问题，还包括 Agent 是否在最后一次修改后验证了这项要求。

### 把分析目标限制在这次任务

模拟输入可以这样写：

```text
模拟示例：分析请求

/better-harness 检查当前项目这次支付回调修改的验证过程。
重点核对重复回调只生效一次的验收要求，
以及最后一次修改之后是否有对应检查和结果。

只分析当前宿主中与该任务有关的项目及会话证据，
生成中文报告，暂不修改业务代码或项目配置。
无法观察的行为明确标注，不将其认定为已经执行。
```

这里只给出分析目标。实际证据仍应来自被授权范围内的接口规则、代码变更、测试与会话记录，不能靠请求文字补出执行结果。原始会话、用户目录和记忆正文等内容，也不因一次分析请求就获得无限读取权限；项目工作流对这些范围另有要求。

### 将测试存在与测试执行分开核对

本例需要核对三类材料。

项目侧，看重复回调规则在哪里定义，有没有对应测试，以及测试应该怎样运行。会话侧，看相关检查发生在什么时候，之后是否又修改了处理逻辑。Agent 配置侧，看任务能否找到这些要求，指令是否相互冲突。

假如只能找到测试文件，无法看到任务执行记录，就不能据此写成“Agent 已完成验证”。同样，没有观察到某次执行，也不直接等于确认它从未发生。

如果证据能够确认最后一次修改后缺少必要验证，才有依据整理具体问题，并指向需要调整的测试入口或工作要求。

### 报告要给出可执行的验收方式

按本例设计，一项有依据的改进应当包含明确的责任位置、预期产物和检查方式。比如，将支付变更需要执行的检查写入项目已有的验证说明，并使任务能够找到该入口。

这只是模拟修复方向，不是要求所有项目都增加一个新 Skill。责任应落在实际拥有这项要求的文件或流程中。

验收可以分成两个时间点：

| 时间点 | 需要检查的证据 | 能支持的结论 |
|---|---|---|
| 本次修复后 | 验证入口已调整，执行相关检查并保留结果 | 改进措施已落实，指定检查已执行 |
| 后续可比较任务 | Agent 找到该入口，在最终修改后执行，并留下相关结果 | 改进是否进入日常任务，是否减少同类遗漏 |

项目的[修复协议](https://github.com/QoderAI/better-harness/blob/main/skills/better-harness/references/finding-bound-fix.md)将修复绑定到具体报告、问题、工作区和报告版本，再执行限定范围的修改与验证。一次修复通过，不会自动提高五个方向的效果评分；后续效果需要后来的可比较任务或独立观察窗口支持。

## 测试人员多看一层，业务人员也多问一步

对测试开发，这类工具提供了一个额外的观察位置：除了维护测试，还能检查 Agent 是否找到了测试入口、是否在正确时机运行，以及失败后有没有重验。

同样的思路可以用于二手车预约、客服工单或退款流程。产品人员补上任务验收条件，开发人员保留执行证据，测试人员再核对结果是否对应最终改动。Better Harness 可以辅助整理这些材料，但业务规则仍要来自真实项目。

实际起步可以只选一次已经完成的任务：限定目标与证据范围，生成报告，挑一个有依据的问题改进，再在下一次同类任务中观察。暂时不用追求一张漂亮的高分表，先留下最后一次修改之后的验证结果。

来源：
· [项目中文 README]https://github.com/QoderAI/better-harness/blob/main/README.zh-CN.md 
· [规范工作流]https://github.com/QoderAI/better-harness/blob/main/skills/better-harness/SKILL.md
· [评估模型]https://github.com/QoderAI/better-harness/blob/main/models/agent-work-loop.md
· [修复协议]https://github.com/QoderAI/better-harness/blob/main/skills/better-harness/references/finding-bound-fix.md
· [宿主适配矩阵]https://github.com/QoderAI/better-harness/blob/main/docs/adapters/README.md

#BetterHarness #Agent #测试开发 #AI编程 #工作流
