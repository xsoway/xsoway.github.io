---
title: "2026-09-04-humanizer-去AI味Skill-35条维基清单"
created: "2026-09-04"
tags: ["KnowledgeBase","WeChat","AIAgent","AISkill","humanizer","去AI味","内容质量","AI测试"]
category: "AI-Agent"
published: true
---

# 给AI装上「去AI味」的Skill：35条维基清单，把机器腔拉回人话

blader 的这个项目叫 humanizer，一张 `SKILL.md` 就干一件事：把 AI 腔文本改写成读起来像人写的，原意不动。不是换几个词，是把「LLM 那种一眼假」的味道拆掉。它自己不含代码逻辑，就是个纯 Markdown 的 skill，凡是支持 skills 的 agent（Claude Code、Codex、Claude Desktop…）都能装上用。就冲「改的是味道、不改意思」这一句，值得往下看。

```mermaid
flowchart LR
  A[原始文本] --> B[第一遍改写 不认原结构]
  B --> C[对照35条 AI写作特征]
  C --> D[对照原文主张 缺事实就喊作者]
  D --> E[只改prose 代码数据不动]
  E --> F[给草稿一段critique再定稿]
```

---

## 它凭什么不是「玄学去味」

以前想去 AI 味，都是人一处处删：这句太客气、那句在堆排比、还有那个 emoji。删不干净，因为标准是凭感觉的。

humanizer 把感觉换成了清单：**35 条来自维基百科的 "Signs of AI writing"**（这个页由维基的 AI Cleanup 项目维护）。第一遍它不拿你原来的结构当金科玉律，先放开改一遍；然后再拿这 35 条和原文的事实主张去核对草稿，还有哪里没改到、哪里又要重写。

它有一句话写在开头，我记下来了（大概意思）：

> LLM 是拿统计去猜「下一个最可能是什么」，所以结果天然会朝「最普遍、最不差」的那个答案靠。

这话往白了说，**AI 腔不是写得差，是写得「太稳」**，稳到一开口就能听出来。这句我特别喜欢，结尾还会绕回来。

另外它有个我觉着相当要紧的规矩：**它不编**。人名、数字、日子、引文，必须有出处，或者是读者给它的。细节缺了，它会反过来问你，而不是自己补一个「好像是10月」糊弄过去。

假如你贴一段自己的两三段文字当「写作样本」，它就照你的节奏、用词、标点、那些你特有的小怪癖来改，目标只是像你，不是像「平均的人」。

---

## 落在你日常里（这块是我的推演，标清了）

它是第三方项目，我不是说你得照它原样干什么。但按我对这类活的理解，它有这几个阵地：

- **AI 评测里加一道「门面门禁」**：你跑完一版评测集，报告要是写得又干又满嘴调调，读者（包括你下个月的自己）根本不想读，等于白做。把它当输出质量的一道校验，是作者判断、组合使用，不是它官方标的能力。
- **测试报告、用例描述、PRD、公众号初稿**：自动化测试产出最爱长那句「该测试用例覆盖了……大幅提升了……」，这批「句子装修」它认得比人快。你让它别管代码和断言，只把描述那段拉回人话。
- **当一份「AI 味清单」用**：哪怕你不装它，那 35 条也是白给的，拿去当你的审稿尺子，逐条对着自己的输出。

举个我手上的场景：给电商客服话术做质检。AI 写的那种客服用语，一眼就能从「第 20–22 条」认出来，满嘴「感谢您的耐心等待」「我们深感抱歉给您带来不便」。你拿 `/humanizer` 把这种话丢进去，它会把客气层削掉，留下来的是「你几号下的单、卡在哪一步、我下一步能帮你处理什么」。这是组合使用的示意，不是它的官方承诺，我没真跑过，只按它「去客服套话」那几条推的：

> AI 版：`We appreciate your patience and understand how frustrating this must be. Please rest assured that your matter is being handled with the utmost priority.`
>
> 把客套削掉后的版：`Your order has been stuck at customs since the 14th. I can raise a claim now, or you can wait. Which would you prefer?`

事实没变，那句让人捏着鼻子读完的「官腔 padding」没了。普通用户读得懂，才谈得上是不是「像真人」，这是评测要管的，不只是答得对不对。

（这几段里，前两小段是我替你「接线」的，官方没这么写；客服那段是示意组合。读者当参考，别当成它承诺的能力。）

---

## 怎么装、怎么按下那个键

安装作者给了现成的，我原样贴（本环境我没真跑过 `npx`，输出按官方抄的，你跑完以你的为准）：

```bash
# 装到全局，所有 agent 都能用
# 只装当前项目，去掉 --global
# 指定给哪些 agent：--agent <name> 或 --agent '*'
npx skills add blader/humanizer --global
```

Claude Code 的路子（版本 2.1.142 或更高）可以直接挂插件：

```text
/plugin marketplace add blader/humanizer
/plugin install humanizer@humanizer
```

装完后对应的斜杠命令叫 `/humanizer:humanizer`。

调用就是直接叫人写：

```text
/humanizer

[paste your text here]
```

直接把它叫起来，丢一段要改的话，或说一句「请把这段改成更像人写的」。点它去改某个文件，就给路径：

```text
Humanize the prose in docs/launch-post.md
```

想让它贴你的腔调，就带上一段你自己写的样本：

```text
/humanizer

Here's a sample of my writing for voice matching:
[paste 2-3 paragraphs of your own writing]

Now humanize this text:
[paste text to humanize]
```

它有个习惯：你丢一段文本给它，**它会先把改完的草稿和一小段「哪里还像机器」的批评给你看，再给终稿**。等于把工夫摊在桌面上，不是闷头一回出结果。指到文件时，它只动段落，代码、数据、frontmatter、链接目标一概不碰。

---

## 完整案例：里斯本那篇，AI腔 vs 人味

作者给了一段很有说服力的对照。同样的事实，两种讲法，一眼就懂它在干嘛。

**AI 腔那版**（节选）：

> I recently spent five unforgettable days in Lisbon, and let me tell you — this city completely stole my heart. From the moment I arrived, I knew I was somewhere truly special. … No trip would be complete without riding the iconic Tram 28… And the food? Simply divine. The original pastéis de nata are a beloved national treasure… ✨

那股味：五天被一座城「偷走了心」、Tram 28 非坐不可、蛋挞是「国宝」，结尾再来一颗 emoji。

**真人版**（同样事实，换种讲法）：

> I spent five days in Lisbon last October and still have mixed feelings about it. Beautiful, yes. Also harder on the knees than anyone warned me. …Everyone says to ride the Tram 28, so I did… The custard tarts, though, earn the fuss. I had one at a plain little place in Graça, still warm, and for about thirty seconds I understood why people build trips around pastry.

你看：都是五天的里斯本、蛋挞、Tram 28，事实一个没多一个没少，读感天上地下。后者是把「最高级的形容词」全摘了，换成具体的月份、街区、当时的腿酸，和那句「有三十秒我懂为什么有人为口吃的老远跑一趟」。**它别的东西不给，就是把「过度」摘了。**

作者特别点了一句：月份、邻里这类细节，必须是作者自己给，或让工具去问，它不能编。这就是它「不添事实」原则落在排版上的一处。

---

## 那 35 条，到底抓住什么

它把 AI 味划成几堆，给你一张速查未必全记住，记住「它在看什么」就行：

| 组 | 抓什么 | 典型「症状」 |
|---|---|---|
| 内容类 1–6 | 夸大重要、点名套凑、浅层分析、销售腔、模糊来源 | 「划时代」「彰显」「专家认为」 |
| 语言语法 7–13 | 废话绕词、三连排比、被动词 | 「serves as」「features」「无需配置」 |
| 风格 14–19、26–35 | 破折号轰炸、堆 bold、emoji、「说穿了」、预告下文 | 满屏「——」「OKRs、KPIs、BMC」全加粗 |
| 机器痕迹 20–22 | 客服句带进、无可奉告、客套 | 「希望这对你有帮助！」「好问题！」 |
| 填充拖沓 23–25 | 空话连接、说半句、通用希望结尾 | 「为了……起见」「也许可能或许」「未来一片光明」 |

它改的不是哪一处的词，是这五类整体的腔调。35 条逐条的 before/after 它在仓库里给全，这里只给骨架。

---

## 聊两句真话

既然标题是「拉回人话」，我把丑话也说清楚。

**它不给你「文采」。** 它卸掉的是机器的「过度平稳」，剩下的是中性的正确。你要是想要「能炸」的文笔，它给不了——那是作者自己的本钱，不是 skill 该管的。

**它也不会替你想**。你给的本来就是没观点的，它改完还是没观点。空的话，怎么去味都是空的。它拆掉的是「平均」，不是你缺的那个「观点」。

**它还是得人审。** 一层工具，你自己得判断改完那只「人味」是可落地的、还是换了种机器感，这道判断它替不了你。要发布、要负责的文章，你终归得自己过一遍。

一句话，把它当「退滤镜」的助手：把 AI 那股「稳」退掉，显影出来的是不是你要的东西，你来看。

---

说回开头那句——**AI 腔不是写得差，是写得「平均」**，平均到一篇文章都能听出来。所以与其逼 LLM「再像人一点」，不如给它、也给你自己一把清单，按 35 条把滤镜一层层退掉。真章在底下。去 AI 味的不是它，是你拿走那把尺之后，还认得哪句话是你自己要的。

## 

#去AI味 #AI写作 #humanizer #AgentSkill #Claude #Codex #内容质量 #文案打磨 #测试报告 #客服话术 #公众号