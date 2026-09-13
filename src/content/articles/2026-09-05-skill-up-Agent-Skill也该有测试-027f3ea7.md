---
title: "别再让 Agent Skill 靠感觉上线：我看了阿里 skill-up 的评测闭环"
created: "2026-09-05"
tags: ["技术分享","Agent","Skill","评测","自动化测试"]
category: "技术分享"
published: true
---

# 别再让 Agent Skill 靠感觉上线：我看了阿里 skill-up 的评测闭环

刚打开 `alibaba/skill-up` 给出的链接时，我先撞上了一个很小、但很像今天 Agent 工程现场的细节：链接指向 `skills/skill`，当前 `main` 分支里却没有这个目录，实际存在的是 `skills/skill-upper`。

这不是在挑字眼。Agent Skill 的问题，常常就是这样开始的：文档里有一句话，仓库里有一份文件，某个模型也“看起来会做”，于是大家默认它可用。等到换了一个 Agent、换了一个任务、换了一个上下文，事情就从“怎么没按说明来”变成了一场高级电子阅读理解。

`skill-up` 想做的事情很直接：把 Agent Skill 从“我试过，感觉不错”，拉到一条能重复跑、能定位失败、能加回归用例的链路上。本文基于 2026 年 9 月 5 日检出的 `main` 分支提交 `ebc7aa0` 整理；我没有实际运行模型评测，因此文中不把仓库声明写成实测结论。

## 这次到底解决了什么

一个 Agent Skill 通常是一组 Markdown 指令、参考资料与脚本。它不太像传统库函数：同一份说明交给不同的 Agent Engine、模型、工具权限和任务上下文，输出可能完全不一样。于是“它有没有用”不能只靠作者打开一个聊天窗口、跑通一个漂亮样例来回答。

`skill-up` 是一个面向 Agent Skill 的评测和演进工具。它把评测环境、运行 Engine、测试用例、判定规则和报告格式写进 YAML；再让真实的 Codex、Claude Code、Qoder CLI 或自定义 Agent 去跑这些用例。结果不只是一句“通过”，还会落下 `result.json`、`grading.json`、`benchmark.json`、JUnit XML 和可选 HTML 报告。

仓库附带的 `skill-upper` 则是用来操作这套 CLI 的 Agent Skill。它会协助定位目标 Skill、搭建 `eval.yaml` 和 `cases/*.yaml`、运行评测、读取失败证据，再决定该改 Skill 本身，还是该修一条写错的评测。这一层很重要：评测失败时，最省事的动作是把断言调松；最有价值的动作，是先弄清楚到底是谁错了。

## 速览

| 组件 | 它做的事 | 需要你先准备什么 |
| --- | --- | --- |
| `skill-up` CLI | 运行声明式评测并生成结构化报告 | Agent Engine 与相应凭据 |
| `eval.yaml` | 声明环境、Skill、Engine、用例与报告格式 | 清楚的评测范围 |
| `cases/*.yaml` | 放用户提示、上下文、预检查与 judge | 接近真实任务的案例 |
| `rule_based` judge | 检查关键词、文件、退出码、工具调用 | 可明确判定的结果 |
| `script` judge | 用自定义脚本判断复杂结果 | 可维护的检查脚本 |
| `agent_judge` | 让模型评审语义质量 | 无法拆成确定性规则的标准 |
| `skill-upper` | 依据报告协助补评测、修 Skill、加回归 | 真实失败证据，不是猜测 |

很多团队可能会觉得，给一段 `SKILL.md` 配 YAML 有点重。这个感觉很正常。只有一条提示词、只给自己用、每天都盯着它的人，确实没必要先搭一套测试工厂。但只要 Skill 要被多人复用、要跨引擎、要进 CI，或者已经出现“昨天能用今天不行”，那几份 YAML 通常比继续改十轮措辞便宜得多。

## 它把一次 Skill 评测拆成了什么

`skill-up` 的路径并不神秘。它先读取一个 `eval.yaml`，在其中指定评测环境、被测 Skill 和 Agent Engine；然后逐个执行 `cases/*.yaml`。每个 case 可以提供用户提示、工作区文件、Git diff、超时和最大轮数；结果先经过不需要模型的 `expect` 检查，再交给一个 judge 判定。

这里的顺序很有工程味：能用退出码、文件是否存在、关键词和工具调用解决的问题，就别急着花 token 请另一个模型来判。仓库把 judge 分成三类：`rule_based` 处理确定性结果，`script` 处理自定义逻辑，`agent_judge` 留给确实需要语义判断的场景。后者并不是不能用，只是更慢、更贵，也更需要写清标准。

```mermaid
flowchart LR
  A[目标Skill] --> B[评测用例]
  B --> C[真实Agent]
  C --> D[预检查]
  D --> E[判定器]
  E --> F[结构化报告]
  F --> G[修复与回归]
```

上面这条线收在“修复与回归”。一次失败可能来自三处：Skill 指令写得不清楚，case 的前提不真实，或 judge 把正确答案判错了。把它们都当成“模型不够聪明”，会让后面的迭代越来越像给迷路的人多塞几张地图。

## 从一个最小用例开始，不要一上来就请裁判团

仓库给了 `eval.yaml` 与 `case.yaml` 模板。对于纯文本 Skill，运行环境可以是 `none`；被测 Skill 从本地路径安装到 Engine。下面是根据模板压缩后的示意，字段名称和组织方式来自仓库，具体提示词与断言需要按你的 Skill 写：

```yaml
schema_version: v1alpha1

environment:
  type: none

skills:
  - source: local_path
    path: .

engine:
  name: codex

cases:
  files:
    - evals/cases/review.yaml
  defaults:
    timeout_seconds: 120
    max_turns: 5

judge:
  type: rule_based
```

这段配置不会替你定义“好”的 Skill，它只把舞台搭好。最容易遗漏的是 case：提示语要像真实用户会说的话，约束要覆盖 Skill 最核心的行为，断言要写成你愿意长期维护的承诺。要是所有 case 都只要求回答里出现 “review” 和 “bug”，那测试通过也只能证明 Agent 认识两个单词。

`expect` 是第一道便宜的门。它可以要求输出包含或不包含某些词、退出码为 0、某个文件存在，失败后直接跳过 judge。随后 `rule_based` judge 还能检查输出正则、工具调用、文件状态等。真的到了“这段解释是否准确、建议是否有操作性”这种无法靠字符串判定的地方，再让 `agent_judge` 出场。

仓库的例子里还支持 Git 工作区：case 可以初始化仓库、切换分支、应用 diff，再让 Agent 看一份有真实缺陷的改动。这样做比在提示里写“假设有个 bug”靠谱得多，因为工具调用、文件变化和最终结论都能留在产物里。

## 运行命令不多，难的是接受失败

官方 README 给出的 `skill-upper` 安装入口是下面这条。注意目录名是 `skill-upper`，不是本次链接里的 `skill`：

```bash
npx skills add https://github.com/alibaba/skill-up/tree/main/skills/skill-upper \
  -g -a codex -y
```

装好后，可以让兼容 Agent 阅读目标 Skill、生成现实的 case、选择 judge 并运行评测。也可以直接安装 CLI，手工维护 YAML。CLI 常用命令只有几条：

```bash
skill-up validate ./evals/eval.yaml
skill-up run ./evals/eval.yaml --format html
skill-up report ./my-skill-workspace/iteration-1/result.json --format html
```

第一条先检查配置和 case 路径；第二条会执行评测并产出报告；第三条从已有 `result.json` 重建 HTML，不需要再次调用 Agent。`run` 的退出码是 0 或 1，放进 CI 时就能成为一道明确的门。

但别把“能进 CI”想得太浪漫。真实 Agent 评测还要处理模型凭据、Engine 配置、超时、外部工具、用例波动和费用。仓库对 `agent_judge` 的建议很克制：能拆成 `expect` 或 `rule_based` 的，先拆掉；需要脚本时就写脚本。CI 不怕严格，怕的是一条失败了也不知道在测什么的绿灯。

## 评测之后，Skill 才有资格谈演进

`skill-upper` 的闭环很适合拿来理解“演进”这个词：先让当前 Skill 跑真实任务，失败后阅读 `result.json`、每个 case 的 `grading.json` 和输出证据；再判断是改 `SKILL.md`、补参考文件，还是修评测；并将这次 bug 写成回归 case，先重跑失败项，再跑完整套。

这套顺序约束了一个很常见的坏习惯：为了让通过率好看，偷偷放宽原本正确的断言。短期看，仪表盘终于绿了；长期看，你只是把“这个 Skill 不应该再犯的错”从仓库里删掉了。日志还在，记忆却没了。Agent 很擅长在上下文里忘事，人类要是把回归用例也删了，就等于帮它把遗忘制度化。

`skill-up` 评测的是一个 Agent 在指定环境里能否兑现那份说明书，不是单看一篇 Markdown 像不像说明书。它还支持基线对比：启用 benchmark 后，报告会记录有 Skill 与无 Skill 两种运行的结果和差异。这个功能也需要克制使用，尤其在用例少、输出波动大时，别急着拿一次差异当性能结论。

## 经验感想

我觉得 Agent Skill 的工程化，到头来绕不过一个不太性感的问题：你愿不愿意把“它在什么情况下应该做对、错了怎么发现”写下来。

写出来当然麻烦。要准备 case，要决定 judge，要面对一条很具体的失败，也别把希望全押在下一版模型上。可这种笨功夫仍然值得。模型会换，Engine 会换，团队成员也会换；留在仓库里的用例和失败证据，至少能告诉后来的人，这个 Skill 曾经答应过什么。

如果你手上正好有一个经常改、又总在不同 Agent 上表现不一致的 Skill，可以从一条最小回归 case 开始。别先追求覆盖率，不妨先挑一个最让人崩溃、最容易重犯的失败，写清输入、预期和证据。等这条用例真的帮你拦住一次回归，`evals/` 目录就不再只是又多了几份 YAML。



`Agent Skill` `Skill-up` `Agent 评测` `回归测试` `Codex`

---

