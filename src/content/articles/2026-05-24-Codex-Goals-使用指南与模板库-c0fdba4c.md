---
title: "Codex Goals：把“继续做下去”变成一份可验收的 /goal（附模板库）"
created: "2026-05-24"
tags: ["KnowledgeBase","Codex","Goals","Agent","Workflow","Template","Testing"]
category: "Articles"
published: true
---

# Codex Goals：把“继续做下去”变成一份可验收的 /goal（附模板库）

我一直觉得，多回合任务里最折磨人的不是难。

是你明明知道“还没完”，但你每一回合都得重新把上下文塞回去一遍：继续、再试一次、换个方向、再跑一轮测试、别忘了别把性能搞回去……

`Goal`（也就是 Codex 里的 `/goal`）干的事很朴素：把“继续做下去”变成一份**有完成条件的合同**。

目标不丢。

证据验收。

可以暂停/恢复。

到预算上限或被阻塞就停下，把“缺什么输入才能继续”讲清楚。

你用过一次就知道，这玩意不是为了让 AI 自己无限循环。

它是为了让你少说废话，让 AI 少走歪路。

我更愿意把它理解成一种“写给 agent 的工程合同”，你把合同写清楚了，agent 才能真的按工程方式交付。

不然它再聪明，也只会走那条最熟悉的路：先写一堆、再解释一堆、最后你不敢合。

## 1) 什么时候该用 /goal（别滥用）

适合的场景都有一个共同点：**终点清楚，但路径不确定，而且需要反复验证**。

比如：

- 性能优化：你得反复跑 benchmark，盯指标变化
- flaky test：复现 → 最小化 → 修 → 回归验证
- 依赖迁移 / 分阶段重构：每步都得可验证，不然就是拆弹
- bug hunt：复现、修、再验证，直到“证据说它真的好了”
- 研究复现：最后要交付产物 + 证据链，不然全是 overclaim

不适合的场景也很简单：一次性就能搞定的“小改动/单次编辑”，别上 `/goal`。

你会觉得它啰嗦，然后开始讨厌它。

再补几个更“像真实工作”的例子，方便你判断：

- 你在接一个老项目，测试一跑红一片：这种就特别适合用 `/goal` 把“要变绿 + 不许退化 + 必须补证据”的口径写死
- 你在做“加功能”但你知道风险很高：比如支付、权限、迁移脚本、删库类操作，这种用 `/goal` 把边界和回滚写清楚，能救命
- 你在写一个看起来不难但特别容易被遗漏的东西：比如缓存、重试、幂等、并发、时区、编码，这种用 `/goal` 把验证面写清楚，少踩坑

## 2) 一条能用的 /goal，至少得有三样东西

我把它叫“完成合同三件套”：

1) **可验收结果**：什么算完成（阈值、产物、状态）
2) **验证证据**：用什么证明（命令、报告、日志、产物路径）
3) **不许退化的约束**：哪些不能破（正确性、行为一致、性能下限、兼容性）

你写 `/goal` 的时候，只要把这三件事说清楚，质量就不会太差。

比如这种：

- `/goal Reduce p95 latency below 120 ms without regressing correctness tests`

但说实话，这种英文示例在中文技术公众号里很“像文档”。

我们把它翻成更工程、也更直觉的中文口径，你会更好复用：

```text
/goal 把支付接口的 p95 延迟降到 120ms 以下，用 ./bench.sh 的输出作为证据，同时必须保持 pytest -q 全绿，且不能改接口返回结构。每轮记录：改了什么、指标变化、下一步打算试什么。跑不起来就停下，把缺的环境变量/数据/权限列清楚。
```

你看，这才像“合同”。

它把“做到什么”“怎么证明”“不能破什么”“卡住怎么办”全写进去了。

## 3) /goal 的生命周期命令（你会用到的就这几个）

- `/goal`：看当前 Goal
- `/goal pause`：暂停
- `/goal resume`：恢复
- `/goal clear`：清除当前 Goal

这几个命令的意义很现实：你不需要靠“记忆力”维持状态。

你只需要靠“合同”维持方向。

如果你是那种会同时开很多个坑的人（我就是），`pause/resume` 的价值会更明显。

你不需要在脑子里存几十条“下次继续做什么”，你只需要让系统记住。

## 4) 强 Goal 的 6 个要素（想写得更稳就照这个抄）

三件套能跑，但要写成“更像工程交付”的强 Goal，一般会把信息写到 6 个维度：

1) Outcome：完成态是什么
2) Verification surface：用什么证据验证（tests/benchmark/report/artifact/命令输出）
3) Constraints：哪些不能退化（正确性/行为/不跳过测试/不夸大）
4) Boundaries：允许触达的边界（哪些目录、哪些工具、哪些数据源）
5) Iteration policy：每轮怎么选下一步、记录什么证据
6) Blocked stop condition：卡住时要怎么结束、需要什么输入才能继续

你会发现，它本质上就是把“我想让 AI 怎么做”写成一份流程化的契约。

这里面我最建议你认真写的是 3 个点：

- **Verification surface**：别写“跑一下测试”，要写成“用什么命令跑、输出保存在哪里”
- **Constraints**：别写“别破坏现有功能”，要写成“哪些行为必须不变，怎么验证不变”
- **Blocked stop condition**：别写“卡住再说”，要写成“卡住就停，输出一份缺口清单”

因为这三个点，直接决定了你到底是在“交付”，还是在“凭感觉推进”。

## 5) 一个通用骨架（推荐直接复制）

`/goal <desired end state> verified by <specific evidence> while preserving <constraints>. Use <allowed inputs, tools, or boundaries>. Between iterations, <how to choose next action + what to record>. If blocked or no valid paths remain, <what to report + what input would unblock>.`

你把这条放到自己的 snippet 里，会很省心。

## 6) 我常用的几类模板（你可以按场景直接套）

下面这些模板都是“工程口径”，重点是：**证据可复跑、约束写清楚、卡住能停**。

为了更符合中文技术文章的落地方式，我在每类模板后面都给了一个“中文示例版”。

### 性能（Perf）

- `/goal Reduce p95 latency below <X> ms, verified by <benchmark command + saved output>, while keeping <test command> green. Use only <service/modules> and related benchmarks/tests. Between iterations, record the change, benchmark results, and next experiment. If benchmark cannot run, stop with blocker + required env/data.`

```text
/goal 把「下单接口」的 p95 延迟降到 120ms 以下，用 ./bench/checkout.sh 的输出作为证据，同时必须保证 pytest -q 全绿，且 CPU 使用率不能比现在高 10% 以上。边界：只允许改 checkout 服务和相关测试/基准脚本。每轮记录：改动点、指标变化、下一步实验。若基准跑不起来，停下并列出缺失的依赖/数据/权限。
```

### Flaky Test（稳定性）

- `/goal Fix the flaky test <test-id>, verified by (1) reproducing the flake at least 3 times, (2) applying a minimal change, and (3) running <test-id> for 10 consecutive passes on the same environment, while keeping <full suite command> green. Constraints: do not skip/relax the test; do not add sleeps unless justified; do not change public behavior. Boundaries: only touch test + directly related fixtures/helpers. Between iterations, record repro command, failure signature, hypothesis, change, evidence. If CI-only flake and cannot reproduce locally, stop with CI logs requested + proposed instrumentation plan.`

```text
/goal 修掉 flaky 用例 tests/test_order.py::test_idempotency，证据是：(1) 本地至少复现 3 次；(2) 用最小改动修复；(3) 同环境下连续跑 10 次都通过，同时 pytest -q 全绿。约束：不允许跳过/放宽断言；不准无脑加 sleep；不改对外行为。边界：只改该测试与直接相关的 fixture/helper。每轮记录：复现命令、失败特征、猜想、改动、证据。若只在 CI 复现，本地复现不了，则停下并给出：需要的 CI 日志清单 + 建议加哪些埋点。
```

### Debug / Bugfix（功能缺陷）

- `/goal Make <bug> no longer reproducible, verified by <repro steps or test case> passing and <regression test> added, while keeping all existing tests green. Boundaries: limit changes to <modules/files>. Between iterations, log hypothesis → experiment → evidence. If blocked by missing access/data, stop with exact missing input list.`

```text
/goal 修复「登录态偶发丢失」问题，证据是：能稳定复现的步骤不再复现 + 新增回归测试覆盖该路径，同时全部现有测试保持全绿。边界：仅允许修改 auth/ session/ 相关模块。每轮记录：假设 → 实验 → 证据。若缺少线上日志/配置导致无法定位，立刻停下并列出必须补的输入清单（例如：请求样本、日志字段、配置项、版本号）。
```

### 迁移 / 重构（Migration / Refactor）

- `/goal Complete <migration/refactor>, verified by <build command> + <test command> passing and no API behavior change (validated by <e2e/snapshot/contract tests>). Constraints: no new dependencies without approval. Boundaries: only edit <list of directories>. Between iterations, keep a checklist of completed steps and remaining risks. If blocked, stop with smallest rollback/alternative plan.`

```text
/goal 完成「把旧支付 SDK 替换为新 SDK」的迁移，证据是：pnpm build + pnpm test 全通过，且 API 行为不变（用 e2e/contract tests 验证）。约束：不新增依赖（除非先确认）；不改变对外字段。边界：只允许改 packages/payments/ 与相关测试。每轮维护清单：已完成步骤/剩余风险点。若卡住，停下并给出最小回滚方案或替代路径。
```

### 研究 / 审计（Research / Evidence-backed）

- `/goal Produce an evidence-backed report on <topic>, using only <allowed sources/materials>. Attempt the headline claims where feasible, verify outputs where possible, and end with a report that separates confirmed findings, proxy evidence, blocked claims, and remaining uncertainty. Between iterations, maintain a claim inventory mapped to evidence. If blocked, stop with what is missing and why it matters.`

```text
/goal 输出一份「可证据支撑」的技术调研报告，限定只用：仓库文档 + 现有代码 + 本地可运行实验。尽可能复现 headline 指标/结论；能验证的就给出命令输出/产物；最后交付一份报告，明确区分：已确认、近似证据、被阻塞的主张、剩余不确定性。过程中维护一份“主张台账”，每条主张都映射到证据。若缺少关键材料（数据集/配置/权限），停下并说明缺什么、为什么缺它就无法继续。
```

### 文档 / 产物（Docs / Artifact）

- `/goal Produce <doc/artifact>, verified by <build/render command> and a checklist of requirements (<items>), while ensuring all referenced commands match current CLI behavior. Boundaries: only edit <doc paths>. If blocked, stop with broken links/commands and proposed fixes.`

```text
/goal 产出一篇可发布的技术文档，证据是：文档渲染/构建通过 + checklist 全满足（比如：命令可复制运行、示例输出存在、注意事项明确）。约束：文档里所有命令必须与当前 CLI 行为一致。边界：只允许修改 docs/ 与相关图片资源。若遇到命令失效或链接断裂，停下并给出：坏的点在哪 + 建议怎么修。
```

## 7) 两个“强 Goal”示例（一个工程，一个研究）

这块我建议你至少看一遍，因为它能把“强 Goal”长什么样刻进脑子里。

### 示例 1：性能优化（更完整的写法）

- `/goal Reduce p95 checkout latency below 120 ms, verified by the checkout benchmark, while keeping the correctness suite green. Use only the checkout service, benchmark fixtures, and related tests. Between iterations, record what changed, what the benchmark showed, and the next best experiment to try. If the benchmark cannot run or no valid paths remain, stop with the attempted paths, the evidence gathered, the blocker, and the next input needed.`

### 示例 2：研究复现（把“别 overclaim”写进合同）

研究类 Goal 最容易翻车的地方是：产物做出来了，但证据不够，最后写成“我觉得差不多复现了”。

强 Goal 的关键是：把结论拆成一张 claim ledger（主张台账），逐条标注证据等级。

```text
/goal Reproduce Buehler et al. “Deep Hedging” as far as the available materials allow, with an evidence-backed claim ledger. For each headline claim/figure/table: locate definition, run a local experiment plan, generate artifacts (plots/tables/metrics + logs + config), verify against the paper, and record status as {mechanics reproduced | close approximate match | blocked exact replay}. Constraints: do not overclaim; label approximations; record seeds/commands. Completion: a final report with the ledger, artifact links, and blockers + smallest next experiment.
```

如果你不做研究复现，没关系。

但你可以把这里的“claim ledger 思路”借走，拿去做任何高风险工程：

比如你在做迁移、做重构、做性能优化，你完全可以列一张“主张台账”：

- 主张：延迟下降了 20%
- 证据：benchmark 输出路径 + 对比截图/表格
- 风险：是不是换了环境？是不是把功能砍了？
- 约束：正确性测试必须全绿、关键路径不能少

把“主张—证据—风险”写清楚，你就很难被自己骗到。

## 8) 写 /goal 之前，快速对照这张清单

- 目标里有阈值或可点验收物（别写“更好/更稳/更快”这种）
- 验收方式是可执行命令或可保存输出（比如 `pytest -q`、`pnpm test`、`./bench.sh`）
- 约束写清楚了（正确性/兼容性/行为不变/不夸大）
- 失败时怎么结束写清楚了（blocker：缺什么 + 下一最小实验）
- 证据能复跑（命令、配置、seed、依赖版本、产物路径）

再加一个我个人很看重的点：

- **边界写清楚了**：这次允许改哪些目录，不允许动哪些模块。否则 agent 很容易为了“把目标完成”去动一些你不想动的东西。

## 9) 收尾一句（很克制，但很重要）

你把 `/goal` 写清楚的那一刻，AI 才真的开始“像在交付”，而不是“像在写代码”。

它会慢一点。

但你会少掉很多那种最痛的事：明明做了三轮，最后发现每一轮都没留下能验收的证据。

最后留一个我自己常用的小技巧，当你不知道怎么写 `/goal` 的时候，你可以先回答一个问题：

**“如果我明天早上打开电脑，我要用什么东西来证明：这事真的搞定了？”**

答案通常就是：

- 一条命令
- 一份输出
- 一组约束
- 一个卡住就停的规则

把这四个写进去，你的 `/goal` 基本就不会太差。

---

来源说明：本文合并整理自 `01-Articles/2026-05-23-Codex-Goals-使用指南.md`、`01-Articles/2026-05-23-Codex-Goals-持久目标指南.md`、`01-Articles/2026-05-23-Codex-Goal-模板库.md`。
