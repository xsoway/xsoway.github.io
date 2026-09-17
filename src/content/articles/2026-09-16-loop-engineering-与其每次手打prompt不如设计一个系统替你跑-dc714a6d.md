---
title: "Stop prompting. Design the loop.\"——与其每次手打 prompt，不如设计一个系统替你跑"
created: "2026-09-16"
tags: ["WeChat","公众号","LLM","Agent","LoopEngineering","自动化","开源","工程"]
category: "公众号文章"
published: true
---

# "Stop prompting. Design the loop."——与其每次手打 prompt，不如设计一个系统替你跑

你每天早上的固定动作里，有多少是"手打一个 prompt"？

打开 CI，看红了几个；翻 issue，回几条；瞄一眼 PR，盯一下那个拖了四天的。这些不是一次性的思考题，是有规律的重复劳动。可我们通常的做法，还是每天早上对着 Agent 敲一句：帮我看看代码库有什么问题。

敲完这句，等它跑，跑完再敲下一句。

我最近在看一个开源项目，它把这件事整个重做了一遍。仓库叫 [loop-engineering](https://github.com/cobusgreyling/loop-engineering)，思路就一句话，是被当作口号写在 README 顶上的：

> **Stop prompting. Design the loop. Get a score.**

别每次打 prompt，去设计一个会替你做事的"环"，然后给它打分。

这个判断我认同。分开说。

---

## 问题不是 AI 不够聪明，是你还在"一问一答"

先说清这个 repo 不想当什么。

README 第一页就写了：**它不是"重建整个模块"的按钮**，尤其没有"重构整个项目"的 pattern 这一说。你要它把一个 40 文件的重写一次搞定，它直接告诉你这在高风险区，别干。

它想解决的是另一类活：**代码库旁边那些周期性、重复的维护动作**——看 issue、盯 CI、跟进 PR、扫依赖、清 changelog。这些活不重，但做起来磨人，而且每天都长出来新的。

loop-engineering 的想法是：与其你每天手打 prompt 让 Agent 做一遍，不如把"发现工作→交给 Agent→验证结果→落地状态"这件完整的链路，设计成一个可重复、可评分、可升级的系统。

你设计的是那个环，不是那个 prompt。

## 一套文件，把"状态"钉在代码库里

上手最大的变化，是项目目录里多出几样东西。

`loop init` 会给你铺一个 starter kit，落地四个文件：`STATE.md`、`LOOP.md`、`loop-budget.md`、`loop-run-log.md`。

- `STATE.md` 是队列——High Priority、Watch List、最近的噪音，Agent 每轮跑完往这里写。
- `LOOP.md` 描述这个环本身怎么转。
- `loop-budget.md` 是每天的 token 预算。
- `loop-run-log.md` 是运行流水账，用来复盘"它上周二为什么要这么干"。

这四样东西，本质是把 Agent 的脑子从"上下文里飘着"变成"落盘可查"。今天的问题常常是：Agent 跑完就完了，判断都在它的上下文里，你一关窗口就没了。loop-engineering 的做法是强制它把状态写进仓库，你、其他 Agent、下一轮跑，读的都是同一份事实。

## 不让你一步跳进自动修，先让你跑一周"只报告"

这套设计里我最服气的一条，是**第一周只许报告，不许动手**。

`loop doctor`、`loop audit` 会给你打一个 **Loop Ready 分数**，0 到 100，附具体的下一步。README 里那张动图就是分数从 10 爬到 70 再爬到 100。而且现在打分有个细节我挺欣赏：**近期跑过的记录权重比磁盘上的文件高**。一个 30 天没更新过的 `STATE.md`，不算你有能力，因为你已经脱离运行了。

但分数只是铺垫，真正的约束是这条官方的升级路线：

> **L1 report-only（只报告）→ L2 assisted（辅助修）→ L3 unattended（无人值守）**

第一周你只跑 L1：Agent 读 CI、issue、commit、上一轮的 `STATE.md`，把高优先级项写进状态，标出建议动作，然后——停。不许改代码，不许自动合并。你人肉读一遍它写的东西，改掉任何不对的地方，再提交状态。

什么时候能升 L2？`loop sync`（`loop doctor` 会顺带跑）会先检查 `STATE.md` 和 `LOOP.md` 有没有各自独走——你改了 `LOOP.md` 却忘了接进 `STATE.md`，一个定时跑的环就会对着过期的指令开火。得先证明它俩还对齐，才谈得上让环自动动。

L3 无人值守的门槛更高：预算和运行日志都填实、`LOOP.md` 里写明人工门禁、有真实的成功跑次作证。README 的原话很扎心，也很诚实：

> **Loop engineering amplifies judgment. Token costs can explode. Unattended loops make unattended mistakes.**

环会放大你的判断力，token 成本也能爆掉，无人值守的环会犯无人值守的错误。它不装看不见风险。

## 风险它写在文档里，叫"反模式"

这份 repo 的 `docs/anti-patterns.md` 是我见过最清醒的工具文档之一，它把坑都给你标好了。挑几个我认为能直接救人的：

**同一会话既实现又验收，是表演。** 一个 Agent 跑完测试就给自己标"完成"，是确认偏误加橡皮图章。README 原话是 "a verifier in the same run as the implementer is theater"。正确做法是独立的验证者子 Agent，而且验证者默认姿态应该是 **REJECT**（拒绝），不是装样子点头。

**没有重试上限，是烧钱机。** "一直试到 CI 绿"是经典的自杀式指令。做法是硬上限（比如 3 次），超了就带着完整上下文升级给人。

**自动化合并不带白名单，是埋雷。** 没有 `gate.yaml` 就放行自动合并，弱验证者会让安全问题和业务逻辑 bug 溜过去。它要求的 gate 不是自由发挥的列表，是两个固定字段：`denylist`（禁改路径，`src/auth/**`、`**/*.env` 这类，要么永远不碰，要么永远人审）和 `autoMergeAllowlist`（文档、markdown 这类低压力的可以无人值守合）。还有个 `maxFiles` 上限——一个要重写 `src/` 的 diff，直接升级给你人审。

**给 Agent 的权限一刀切，是爆掉 blast radius。** 第一天就让环能合 PR、发 Slack、改生产工单，等于让一次糟糕的 triage 决定拥有巨大的爆炸半径。正确做法是 L1 只读，权限靠信任慢慢涨。

这十条我读下来，几乎条条都踩过同类问题的队伍见过。它不是给你画大饼，是默认你会搞砸，然后告诉你哪里会炸。

## 省钱账，是另一种翻车点

token 成本是这个 repo 反复绕不开的线，README 反复警告 token costs can explode。

它给了三档成本画像，来自 `patterns/daily-triage.md`：

| 场景 | 一次跑多少 token | 说明 |
|---:|---:|---|
| 空转（状态里没啥事） | ~5k | 没啥可做的一次 triage |
| 完整 triage（L1） | ~50k | CI + issue + commit 全扫一遍 |
| 辅助修复（L2） | ~200k | worktree + 实现 + 验证 |

它还会给每个 pattern 建议每日上限，`daily-triage` 的推荐是 **100k token 一天**，靠 `loop-budget.md` 卡着。

token 成本它有两条防线，而且是分开设计的。

一条是**熔断器（circuit breaker）**。当 L2+ 的环开始自动改代码，它不能同一个错误无限重试，`loop-init` 会铺一个 `loop-ledger.json` 和 `loop-guard` skill，每次重试前先查账：撞到最大迭代数、同一个错误连续重复 N 次、连续失败过多、或 token 预算见顶，就熔断——退出码 `2` 升级给人类，而不是继续烧钱。

另一条是我觉得最狠的：**Agent 严格禁止自己调高 token 上限。** 当 L3 环跑到当天预算的 90% 以上还剩高优项时，它不能用"再让我多跑一点"，而是调用一个 `budget-negotiator` skill，算当前 ROI，起草一份涨预算申请（一天最多一次，`+20%` 或上限 `+50k`），**追加到 `STATE.md` 的 `[BUDGET NEGOTIATION]` 段，然后等一个人类改 `loop-budget.md` 批准**。

不是它装道德，是它知道：让 Agent 自己给自己借钱，等于没有预算。预算这个东西要约束得住，权限就得握在人手里。

## 一张表看懂它能替你盯哪几摊

它预置了八种 pattern，各有节奏和成本档位，README 给了一张很实用的表：

| Pattern | 节奏 | 第一周 | 成本 |
|---|---|---|---|
| Daily Triage | 1d–2h | L1 报告 | 低 |
| Thin loop | 事件 + 1d | L1 快照 | 很低 |
| PR Babysitter | 5–15m | L1 盯 | 高 |
| CI Sweeper | 5–15m | L2 谨慎 | 很高 |
| Dependency Sweeper | 6h–1d | L2 只打补丁 | 中 |
| Changelog Drafter | 1d 或打 tag | L1 草稿 | 低 |
| Post-Merge Cleanup | 1d–6h | L1 非高峰 | 低 |
| Issue Triage | 2h–1d | L1 只提案 | 低 |

注意这张表跟市面上很多"AI 自动化"文案的差别：它把每个 pattern 的**第一周档位**单独标出来，全都压在最保守的 L1 报告上，连"成本很高"的 CI Sweeper 都是 L2 谨慎起步。它不靠"无人值守的爽"来卖，靠"你能安全地信它"来留住你。

## 五分钟上车，先跑报告

上手门槛不高，不用 clone，`npx` 直接就上：

```bash
npx @cobusgreyling/loop init . --pattern daily-triage --tool claude
npx @cobusgreyling/loop doctor .
npx @cobusgreyling/loop cost --pattern daily-triage --level L1 --cadence 1d
```

`--tool` 默认 `claude`，你可以换成 `grok`、`codex`、`opencode`。第一周就是**报告**，不加自动修，不加自动合。

跑完打开 `STATE.md`，看它抓的优先级准不准，哪里错了你手改——**你还是那个工程师**，这是整个设计的立场。README 把这句话写在跑法里：Commit the scaffold + first run update，让下一次 audit 看到你的活动。

等它报告得准了一周，再往 L2 走——加一个验证者 skill，在 git worktree 里试一次辅助修复，人审 PR。README 明确交代了：核心逻辑、公共 API、认证、支付，永远待在 `denylist` 里人审，能自动合只有文档这类低压路的 allowlist。

这套东西的价值，不在"多了一个帮你跑腿的工具"，在于它把 Agent 应用的成熟度当成一条要你别抄近道的路：先报告、再辅助、最后才无人值守，每一步都有明确的验收边界和刹车。

仓库：
[cobusgreyling/loop-engineering]https://github.com/cobusgreyling/loop-engineering，
MIT，11.2k star。
想进一步读它的思路，
三个来源在 README 里都列了：
[作者 Cobus Greyling 的博客]https://cobusgreyling.substack.com/p/loop-engineering、
[Addy Osmani 的 Loop Engineering]https://addyosmani.com/blog/loop-engineering/、
以及一份 arXiv 综述 [Building Blocks, Adoption, and Impact]https://arxiv.org/abs/2608.21884
（这份 repo 就是被评审的社区参考）。

我的判断只有一个：方向是对的。你每天手打的那句"帮我看看代码库有什么问题"，本质上是一个你还没自动化的环。

`#LLM` `#Agent` `#LoopEngineering` `#自动化` `#开源` `#Token成本` `#工程`