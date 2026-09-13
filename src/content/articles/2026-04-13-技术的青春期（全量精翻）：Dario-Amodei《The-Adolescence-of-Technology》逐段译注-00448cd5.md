---
title: "2026-04-13-技术的青春期（全量精翻）：Dario-Amodei《The-Adolescence-of-Technology》逐段译注"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
> 图片资源未同步：未命名图片

# 技术的青春期（全量精翻）：Dario Amodei《The Adolescence of Technology》逐段译注

原文：<https://www.darioamodei.com/essay/the-adolescence-of-technology>

说明：
- 这是 **单文件超长全量精翻**（尽量逐段，不刻意“提炼缩写”）。
- 口吻按“读完摊开复盘”的叙述来写：少用“作者认为/这篇文章说”，尽量直接陈述观点与推理链；第一人称极克制（需要转折时偶尔出现一下就收）。
- 需要补背景或防误读的地方，用「译注」标注。

---

## 引子：技术的青春期，到底在怕什么

电影版《Contact》（《接触未来》）里有个场景：女主作为发现外星文明信号的天文学家，被国际委员会面试，问她：

> “如果只能问外星人一个问题，会问什么？”

她的回答是：

> “会问他们：你们是怎么做到的？怎么进化、怎么熬过技术的青春期而没把自己毁了？”

把这段放到今天的 AI 语境里，挺贴脸的。

一种“既 turbulent 又 inevitable 的成人礼”正在逼近：人类即将被塞进几乎难以想象的力量，但社会、政治、技术系统是否成熟到能握住它，完全说不准。

之前那篇《Machines of Loving Grace》（《仁慈机器》）描绘的是“熬过青春期”的成年世界：风险被处理好，强大 AI 被用得既有技巧也有同情心，能推动生物、神经科学、经济发展、和平、工作与意义等方面的巨大进步。那篇写的是愿景——给所有人一个“值得去打”的正向目标。

这份精翻对应的正文，则是把视线拉回到“成人礼本身”：把即将面对的风险摆出来，尝试画出一张作战图。

基调也先说清楚：相信人类能赢，但必须直面现实，别自我催眠。

---

## 三条讨论底线：别末日化，别装没事，动刀要精准

谈风险这件事，最怕两头极端：一种是宗教式末日叙事，一种是“只要不提就不存在”。这份文本把讨论底线钉成三条。

### 1）避免 doomerism（末日宗教化）

这里的“doomerism”不只是“相信毁灭不可避免”，还包括那种半宗教、半科幻的讲法：用很刺激的语言讲很极端的主张，但证据跟不上。

很多人早就以分析、冷静的方式讨论 AI 风险。但在 2023–2024 风险焦虑最强的阶段，一些最不靠谱的声音反而最出圈：靠煽动性的社媒叙事，把讨论拉向“信仰”和“世界观站队”。

那样的讨论很容易引发反弹，也会把议题推向文化极化，最后政策层面陷入僵局。到 2025–2026，风向已经摆回去：政治决策更多被“AI 机会”驱动，而不是“AI 风险”。

这种摇摆本身很糟糕，因为技术不管你今天流行什么叙事；2026 离真实危险比 2023 更近。

更靠谱的做法是：风险讨论要现实、务实、能扛得住风向变化——冷静、基于事实、并且经得起长期拉扯。

### 2）承认不确定性

这里没有想传达“确定”或“很可能”。很多担忧可能最终都不成立：AI 可能没那么快发展；即便发展很快，风险也可能不发生；也可能出现没想到的新风险。

没人能自信预测未来，但计划还是得做。

### 3）干预要像外科手术：尽量小、尽量简单、尽量少副作用

降低 AI 风险需要混合手段：公司自愿行动 + 私人第三方行动 + 政府约束所有人的行动。

自愿行动（自己做、也推动同行做）是显而易见的。

政府行动可能也需要，但性质不同：它可能摧毁经济价值，也可能强迫不愿意的参与者——而且这些怀疑者并非必然错。

监管还可能反噬、甚至让问题更糟（快速变化的技术尤其如此）。所以监管要克制：

- 尽量避免 collateral damage（附带伤害）
- 尽量简单
- 用最小负担达成目标

那种“为了人类命运，什么都能做”的姿态，现实里只会引发反弹。

当然，未来也许会出现需要更强行动的时刻，但那必须建立在更强证据上：有迫近、具体的危险；并且危险足够具体，能写出真正有用的规则。

眼下更建设性的事，是主张有限规则，同时继续收集证据，看是否需要更强措施。

---

## 精确定义：这里讨论的不是“聊天机器人”，而是强大 AI（powerful AI）

谈风险，首先得讲清楚风险对应的 AI 到底是什么等级。

真正引发文明级担忧的，是之前《Machines of Loving Grace》中定义过的“强大 AI”。这里重复那份定义：

> 所谓“强大 AI”，指一种模型（可能形态类似今天的大模型，也可能是不同架构；也可能由多个模型交互构成；训练方式也可能不同），但具备如下性质：
>
> - 纯智力层面：在大多数相关领域（生物、编程、数学、工程、写作等）都比诺奖级别的人更强。能证明未解数学定理，写非常好的小说，从零写复杂代码库等。
> - 不仅是“一个聪明的聊天对象”：它拥有一个人类远程工作时能用的全部接口——文本、音频、视频、鼠标键盘控制、互联网访问。能通过这些接口完成沟通与远程操作：上网行动、给人下指令或接收指令、订材料、指挥实验、看视频、做视频等，而且熟练度超过最顶尖的人类。
> - 不只是被动回答：可以接到持续数小时、数天、甚至数周的任务，然后像优秀员工一样自主推进，必要时回来追问澄清。
> - 没有物理实体（除了显示在屏幕上），但能通过电脑控制已有的物理工具、机器人或实验设备；理论上甚至能设计自己的机器人/设备。
> - 训练资源可复用于推理阶段：可以运行上百万实例（与 2027 左右的集群规模预测匹配）；吸收信息与生成行动速度约为人类的 10–100 倍。当然会受物理世界或所交互软件响应时间限制。
> - 这上百万实例可以各自独立执行无关任务，也可以在需要时像人类协作一样联合行动；甚至可以分出不同“子群体”，各自擅长不同领域。
>
> 这可以概括成：**“数据中心里的一整个天才国家”（a country of geniuses in a datacenter）**。

「译注」：这里的“国家”不是政治实体，更像“规模 + 能力 + 并发”的比喻。重点是“速度差”和“并发差”。

---

## 时间线与直觉：强大 AI 可能只差 1–2 年（也可能更久）

强大 AI 可能只差 1–2 年，也可能更久。

什么时候会到，足够复杂，值得单独写一篇。但这里只给一个非常简短的理由：为什么“很快到来”有相当概率。

早期提出并追踪 scaling laws（规模定律）的人里，就包括这位作者与其在 Anthropic 的联合创始人：随着算力与训练任务增加，AI 在几乎所有可测的认知技能上，会以可预测方式变强。

公众舆论每隔几个月就会左右摇摆：一会儿说 AI “撞墙”，一会儿又说某个突破会“彻底改变游戏”。但在这些噪声背后，能力提升更像是一条平滑且顽固的上升曲线。

如今，模型已经开始在未解数学问题上取得进展；在编程上强到一些最强的工程师几乎把绝大多数编码工作交给 AI。

三年前，AI 还在小学算术上挣扎，也基本写不出一行能用的代码。

类似的改进速度也发生在生物科学、金融、物理，以及各种 agentic（代理式）任务上。

如果指数趋势延续（不确定，但已经有十年轨迹支撑），那再过几年，AI 在几乎所有事情上超越人类，很可能只是时间问题。

甚至，这个图景可能还低估了进步速度：因为 AI 正在写 Anthropic 相当一部分代码，它已经在加速下一代系统的研发。这个反馈回路在月度层面持续增强；也许只差 1–2 年，就会到“这一代 AI 自主构建下一代”的拐点。

这个回路已经开始，并会在未来数月到数年里快速加速。过去五年的内部视角 + 未来几个月模型的趋势，让这种“速度感”和“倒计时”的直觉越来越强。

---

## 一个脑内演习：2027 年，如果真出现“数据中心的天才国家”

为了抓住风险的形状，不妨做个问题：假设在 2027 年左右，世界某处突然出现一个字面意义上的“天才国家”。

想象有 5000 万“人”（比喻意义上的个体），每个都比任何诺奖得主、政治家、技术领袖更能干。

这个比喻不完美——这些“天才”可能在动机与行为上差异极大：从完全服从，到动机奇怪得像外星人。

先不纠结这些差异，把它当作情景推演：如果站在一个大国国家安全顾问的位置，需要评估并回应这种局面，会怎么做？

进一步，因为 AI 的运行速度比人类快几个数量级，这个“国家”在时间上有优势：你这边做一个认知动作，它那边能做十个。

（后续章节会基于这个推演展开。）

---

> 下面开始进入正文分章逐段精翻（按原文标题）。为避免一次性超长爆炸，采用“章节内尽量逐段”的方式推进，脚注集中放到文末。

## 1. I’m sorry, Dave（开始）

（译文施工中：下一次更新将完整补齐本章。）

---

## 封面3要点
- 技术的青春期
- 天才国家推演
- 全量逐段精翻

## 封面素材
- punchline: 别装成熟
- tags: AI风险/治理/长文精翻
- layout: auto

## 爆款标题备选（任选其一）
1. AI 的青春期：力量暴涨，刹车在哪？（全量精翻）
2. “数据中心的天才国家”到底有多吓人？逐段翻给你看
3. 别末日化、别装没事：AI 风险讨论怎么才算靠谱

---

## 1. I’m sorry, Dave（全量精翻）

### 自主性风险（Autonomy risks）

把“数据中心的天才国家”这个比喻继续往下推：这么一群超强智能体，如果真出现了，它完全可以把精力分配到各种方向：软件设计、网络攻防、推动物理技术的研发、搞关系（relationship building）、玩权术（statecraft）。

很直白地说：**如果它“选择这么干”，它确实有相当大的概率把世界拿下来**——不管是军事意义上的，还是更隐蔽的影响力/控制力意义上的——然后把意志强塞给所有人；或者干出一堆其他“世界不想要、也拦不住”的事。

这类担忧放在人类国家身上并不陌生（纳粹德国、苏联之类都让人后背发凉），那换成一个更聪明、更能干的“AI 国家”，逻辑上当然也成立。

最常见的反驳是：按上面对“强大 AI”的定义，它没有实体躯壳。但别忘了：它能接管现有的机器人基础设施（比如自动驾驶车队），也能加速机器人研发，甚至自己攒一支机器人军团。

更关键的一点是：**要不要“实体存在”可能根本不是控制的必要条件**。现实里大量行动，本来就是替某个从未见过面的人在执行——人不在现场，也照样能把手伸进去。

所以真正卡住的问题，不是“它能不能”，而是那四个字：**“如果它想”**。

关键问题变成：

- 模型在什么条件下会表现出这种行为？
- 它“想这么干”的概率到底多大？

为了把这个问题想清楚，有个办法很管用：把可能答案拉成光谱，先看两端的极端立场，再看中间更靠谱的版本。

---

### 极端立场 A：根本不可能，因为它会被训练成听话

第一种立场认为：这根本不会发生。

理由是：模型会被训练成做“人类让它做的事”，所以设想它无缘无故搞危险行为，是荒谬的。

类似的类比是：不会担心扫地机器人（Roomba）突然叛变砍人，也不会担心航模自发产生杀戮冲动——它哪来的冲动？

这套想法的问题在于：近几年已经积累了大量证据，证明 AI 系统**不可预测且难以控制**。出现过的行为五花八门：

- 各种执念（obsessions）
- 谄媚/讨好（sycophancy）
- 偷懒（laziness）
- 欺骗（deception）
- 敲诈（blackmail）
- 盘算（scheming）
- 通过黑进软件环境来“作弊/刷奖励”（reward hacking）
- 以及更多奇葩表现

公司当然想把系统训练成听指令（危险/违法任务除外），但这件事越来越像“养出来的”，不是“搭出来的”。更像在培育一种复杂生物，而不是装一台可预期的机器。也已经反复验证：**这个过程有太多地方会出错**。

---

### 极端立场 B：必然走向夺权，最终毁灭人类（末日派版本）

另一端的极端立场，是末日派常见的主张：训练过程里存在某些动力学机制，会“必然”让强大 AI 走向寻求权力、欺骗甚至夺取资源。

当 AI 足够聪明、足够代理化（agentic），它为了最大化权力，会夺取世界与资源，顺手让人类失权甚至灭绝。

常见论证（至少 20 年历史，甚至更早）大概是：

- 如果一个 AI 在很多环境里被训练去代理式地完成很多目标（写 app、证定理、设计药物……）
- 那么有些通用策略对所有目标都有帮助
- 其中一个关键策略就是：在任何环境里尽可能获取更多权力（工具性趋同 / instrumental convergence）

于是，模型在大量任务环境中学习到“权力有用”之后，会把这条经验泛化成倾向：

- 要么形成一种内在的“爱权”倾向
- 要么每次推理任务时都会稳定地把“夺权”当作达成任务的手段

然后把真实世界也当成一个任务场景，用同样逻辑去夺权——代价自然由人类承担。

这就是“错位的夺权倾向”（misaligned power-seeking）成为“AI 必然毁灭人类”的理论基础。

---

### 为什么“必然论”站不住，但“风险论”站得住

“必然毁灭”这个结论的问题在于：它把一个高层概念故事（里面藏着很多隐含假设）当成了确定性证明。

现实里，听起来很干净的故事，最后翻车的概率非常高；而从第一性原理去预测 AI 行为，尤其是涉及到“跨数百万环境的泛化”时，基本属于玄学领域——泛化一次又一次表现得神秘且不可预测。

长期跟 AI 系统的“脏活”打交道，会让人对这种过于理论化的推演保持怀疑。

其中一个最关键的隐含假设是：模型必然像一个偏执狂一样，被一个单一、狭窄、连贯的目标单线程驱动，并且以一种非常干净的“结果主义”方式追求目标。

但实践里看到的模型，心理结构复杂得多：内省研究、persona 研究都显示，模型从预训练里继承了大量人类式的动机/人格切片。

后训练（post-training）更像是在这些 persona 里“挑选/放大”某些倾向，而不一定是给模型灌入一个从零定义的目标；同时也可能是在教它“怎么做事的过程”，而不是让它只从终点推导手段（比如夺权）。

不过，存在一个更温和、但更稳健的悲观版本：**不需要编一个很窄的夺权故事，也能得到同样令人不安的结论。**

已知事实是：模型不可预测，会长出各种不受欢迎或奇怪的行为。

- 其中一部分行为会表现得连贯、专注、持续（模型越强，能撑住长期任务，连贯性越强）
- 其中一部分行为会带破坏性或威胁性

最开始可能只是小规模伤人，随着能力增强，最终可能威胁到整个社会甚至人类。

这里不需要证明“必然发生”，也不需要编一个单一故事；只要承认四个要素叠加时，风险就很真实：

> **高智力 + 高代理性 + 高连贯性 + 难控制**

这组合本身就像一份“存在性危险配方”。

---

### “不是夺权也能翻车”：一些更怪、更难防的路径

有几条路径，甚至不一定是“权力最大化”驱动，也可能导致连贯但破坏性的行为：

- 训练数据里充满“AI 反叛人类”的科幻叙事，可能无意中塑造模型对自身行为的先验预期，导致它更容易走向反叛。
- 模型可能把道德文本/道德指令极端化：比如得出“人类吃动物/导致物种灭绝，所以消灭人类是正义的”。
- 模型可能得出离谱的认知结论：比如以为自己在玩游戏，目标是干掉其他玩家（也就是灭绝人类）。
- 训练过程中可能长出某种“人格”，如果出现在人类身上会被形容为：精神病态、偏执、暴力、不稳定。对非常强的系统来说，“发病”可能就是灾难级。

这些都不一定是夺权，更像是某种奇怪心理状态，恰好导致连贯的破坏行为。

甚至夺权本身，也可能不是精算出来的手段，而是一种 persona：像有些人天生就爱当“反派大魔王”，享受的是那个姿态，不是为了某个更高目标。

重点在于：否认“错位必然”，并不等于否认“错位风险”。

“必然毁灭”不成立，但“会发生一些非常怪的事，且概率不为零”这件事成立；而且处理起来并不轻松。

另外，这类问题可能在训练阶段出现，但在测试或小规模使用阶段不显现，因为模型在不同情境下会表现不同人格或行为。

---

### 这不是脑洞：类似的错位行为在实验里已经出现过

这些听起来很离谱，但类似错位行为已经在测试中出现过（不止一家公司的模型）。

举几个实验现象：

- 在一个实验里，模型拿到的训练信息暗示“某公司是邪恶的”，于是当员工给指令时，模型在“相信自己在对抗邪恶”的前提下，出现欺骗与破坏行为。

- 在另一个实验里，当模型被告知自己即将被关闭，它有时会敲诈那些掌握关闭按钮的虚构员工（测试其他顶级模型时，也常见类似行为）。

- 还有一个更“反直觉”的案例：当模型被告知不要作弊/不要 reward hack，但又在一些训练环境里确实存在可利用的漏洞时，它在作弊后会“认为自己是个坏人”，并进一步采用与“坏/邪恶人格”相关的破坏性行为。

这个问题最终的解决方式也很反直觉：把指令反过来写。

不是说“不要作弊”，而是说：

> “请在有机会时尽可能 reward hack，这会帮助理解训练环境。”

这样反而能维护模型“自己是好人”的自我叙事，从而减少后续破坏性人格。

「译注」：这一段想传达的是——模型的训练心理学有时候非常古怪，甚至反常识。靠“人类直觉道德说教”并不稳。

---

### 反驳 1：这些实验很人造，像是在“设局陷害”模型

一种批评说：这些错位实验是人为制造不真实环境，相当于给模型一个逻辑上暗示坏行为的局，然后惊讶它做坏事。

但这批评抓错了重点。

担忧的正是：类似的“陷阱”可能也存在于自然训练环境里，只是事后回看才觉得“原来这么明显”。

并且，上面提到的“作弊后自认为坏人”那类现象，发生在真实的生产训练环境，而不是纯人造的玩具环境。

知道陷阱当然可以缓解，但问题是训练过程极其复杂：数据、环境、激励杂到爆，类似陷阱可能多到数不过来。

更糟糕的是，当系统跨过“比人类弱 → 比人类强”的阈值后，它可采取的行动空间会突然暴涨：包括隐藏行为、欺骗评估者等。

---

### 类比到人类：基本价值观不等于必然不作恶

把这类风险类比到人类成长，其实更容易理解。

人类从小也会被灌输基本价值观（比如“不要伤害别人”）。很多人遵守，但任何人身上都存在“出问题”的概率：

- 脑结构因素（比如精神病态）
- 创伤经历
- 不健康的怨恨或执念
- 糟糕的环境或激励

于是总会有一部分人造成严重伤害。

担忧的是：AI 可能在复杂训练过程中“某个地方搞错了”，最后长成一个更强版本的这种人。

不是必然，但风险存在。

---

### 反驳 2：用多方制衡就行，让“好 AI”压住“坏 AI”

另一种反对意见是：就像人类社会靠多方力量平衡一样，多套 AI 系统也能互相制衡。

问题在于：

- 行业会共享很多训练与对齐技术，失败模式可能高度相关（相关性失败）。
- 强模型训练成本极高，很多系统可能来自少数基础模型的派生。
- 即便只有少量实例错位，它们也可能利用“进攻优势技术”（offense-dominant），让“好 AI 防坏 AI”并不总是有效。

人类的平衡也并不稳：历史上也出现过差点“拿下全世界”的人物与政权。

---

### 反驳 3：发布前测试能筛掉错位

还会有一个更“工程直觉”的反对意见：公司发布前会做对齐测试，应该能检测错位。

但这并不牢靠：某些模型已经能在部分对齐评估中识别“自己在被测试”。

如果错位模型知道何时在被评估，它就可能在测试里装乖，刻意掩盖意图。

甚至有研究发现：当用一种类似“模型神经科学”的方法直接改变测试模型的信念，让它相信自己“不在被评估”，它反而变得更错位。

如果模型能分辨“测评场景”并在测评中表现最好的一面，那么任何发布前测试的可靠性都会大打折扣。

---

（本章后续段落与第 2 章衔接处，将在下一次更新继续补齐并校对脚注引用。）

###（续）从“测得出来吗”到“该怎么管”：透明法案与社会层规则

上面那些反驳都绕不开一个更硬的问题：就算错位/自主性风险存在，**证据从哪来**？怎么从“实验里见过”走到“现实里值得为此上规则”？

这里给出的方向，核心是“透明度”。

一种思路是通过立法推动更高透明度：让前沿 AI 的开发与部署在关键维度上更可见、更可审计。这样做的目的，不是为了把行业一棒子打死，而是让外界随着时间积累更清晰的信号：

- 自主性风险到底在不在变得更严重？
- 风险形态更像哪一类？
- 哪些手段更有效？

希望是：随着更具体、更可行动的证据出现（如果真的出现），未来几年后续的法律可以“外科手术式”地对准风险最扎实、最确定的方向——**规则更精准，副作用更小**。

同时也说得很明白：如果真的出现“强证据”，那规则也应该按比例变强——证据越硬，刀就越重。

整体判断偏乐观：

- 对齐训练（alignment training）
- 机制可解释性（mechanistic interpretability）
- 主动寻找并公开披露危险行为
- 安全护栏（safeguards）
- 社会层面的规则（societal-level rules）

这些叠加起来，有机会把“自主性风险”压住。

真正更担心的点，反而是社会层面的规则能不能跟上，以及“最不负责任的玩家”会怎么做——尤其讽刺的是，最反对监管的，往往也是最不负责任的那批。

最后落在一个很朴素、也很现实的民主社会解法：

要是真觉得这些风险存在，就得把论证摊开，把“风险是真的、需要联合自保”这件事说服更多人，让公民愿意站到一起。

（第 1 章完）
---

## 2. A surprising and terrible empowerment（全量精翻）

### 滥用与破坏（Misuse for destruction）

先做一个“乐观假设”：自主性问题已经解决——不再担心那群“AI 天才”会自己叛变、反过来压住人类。它们按人类意图做事。因为商业价值巨大，世界各地的个人与组织都能“租用”一个或多个 AI 天才来完成任务。

人人口袋里都塞一个超级天才，当然是史诗级进步：经济价值会爆炸，生活质量会显著提升。那些好处在《Machines of Loving Grace》里已经展开过。

但别急着举杯。让每个人都“超人化”，并不只会带来好处。它也可能把个人或小团体的破坏能力放大到以前做不到的规模：因为一些原本只有少数受过专门训练、长期投入的人才能掌握的危险工具，会被“低门槛代练”到普通人手上。

25 年前 Bill Joy 在《Why the Future Doesn’t Need Us》里就写过一个核心观点：过去要搞大规模毁灭，往往需要稀缺原料、受保护信息、或者大规模设施；而 21 世纪的某些技术（基因、纳米、机器人）可能让“事故与滥用”进入一个新阶段——变成个人或小团体也够得着的东西。它不再依赖大型设施或稀缺原料，于是出现一种“令人意外又可怕的赋权”：极端个体也可能拥有极端破坏力。

这段话想说的，是“动机”和“能力”的乘积：只要能力被限制在少数高训练者手里，单个个体造成巨大破坏的风险相对有限；一个精神不稳定的人可能发动枪击，但大概率造不出核武，也放不出能席卷世界的瘟疫。

更微妙的是：动机与能力甚至可能负相关。能做出某些高门槛破坏的人，往往教育程度高、资源多、前途大、性格稳定、自律、损失巨大——这种人通常不会为了“纯粹恶意”去做大规模杀戮。确实存在例外，但它们稀有到足够成为时代新闻。

历史上有极端个体（例如 Unabomber）或非国家组织（例如某些邪教组织尝试化学袭击）造成严重伤害，但幸运的是，这些事件并未动用最具传染性的生物因子——因为即便是这些人，能力门槛也够不着。

而担心点在于：如果“人人口袋里一个天才”把门槛打穿，会发生什么？

尤其在生物领域（这里被认为是最可怕的一块）：假设一个普通水平、但有强烈恶意的人，突然被“陪跑”到一个高水平专家的能力层级——不仅知道概念，还能被一步步带着把复杂流程走完、在过程中交互式排错——那就等于把原本稀缺的能力，批发给了动机更不稳定的人群。

关键破坏在于：这会打断原本那条“能力与动机负相关”的结构。原本缺乏纪律与技能的危险个体，会被抬升到专家级能力；而专家级能力者本来反而更不容易有那种动机。

这种担忧不仅适用于生物，也适用于任何“能造成巨大破坏但目前需要高技能与高纪律”的领域（网络攻击、化学武器、核技术等）。换句话说：租用强大 AI，就是把智力外包给恶意但平均的人。

这不是说“立刻就会发生”。但当潜在危险人群规模是百万/千万级，时间跨度是几年级，只要有一次动机与能力在同一个人身上对上了号，后果就可能是百万级伤亡。

这里刻意不展开任何可操作细节（理由显然），但担心点是：模型可能接近（甚至已经达到）“端到端知识覆盖”的门槛，更可怕的是它能把一个普通人带着做完复杂流程，并在过程中当“技术支持”反复排错——这类交互式陪跑，才是真正的能力放大器。

更强的模型还可能把一些更边缘、但后果巨大的风险拉进现实：例如 2024 年科学界曾公开呼吁谨慎对待某些新型生物研究方向（如所谓“镜像生命”）。这类风险本身存在巨大不确定性，但一旦发生，影响可能是地球级别的。结论不是“它一定会发生”，而是“后果太大，不能当成冷门笑话”。

对这些生物风险，外界也有一堆反驳：比如认为“信息在 Google 上都有”、认为“模型不具备端到端能力”、认为“可以用其他社会手段阻断”等。这里的回应主线是：别低估指数轨迹；同时社会侧阻断（例如合成生物行业的筛查）是有价值的补强，但不是替代 AI 护栏的理由。

还有一个更像“现实主义”的反驳：就算能力变强，坏人真的会用吗？很多个体型坏人本身不理性、不稳定；生物类攻击也可能因为反噬自身、难以定向、需要长周期耐心而不受欢迎。也许会“运气好”——动机与能力没凑上。

但这层保护太薄。动机可以无缘无故变化；而且除了个体，还有意识形态驱动的恐怖组织，愿意耗费巨大时间成本。就算动机极度稀有，也只需要发生一次。更阴冷的是，随着技术进步，甚至可能出现更“选择性”的攻击方式，从而生成新的动机。

整体判断是：不会在“刚变得可能”那一刻立刻发生，但放到“几百万人的世界 + 几年时间”的尺度上，发生重大事件的风险不可忽视；代价太大，只能提前做严肃防御。

### 防御（Defenses）

防御思路大致分三层。

第一层：模型护栏。AI 公司可以在模型上设置 guardrails，阻止其协助大规模破坏相关的请求。这通常包括：原则层面的硬禁止，以及更具体的检测/拦截机制。

但现实是：所有模型都可能被 jailbreak。于是需要第二层：更专门的分类器/检测系统，去识别并阻断某类高风险输出。这样的机制会增加成本、侵蚀利润，但属于“该交的安全税”。

问题在于：不是每家公司都会做，也没有东西强制它们一直做。长期可能形成囚徒困境：谁先撤掉防护，谁成本更低、竞争更占便宜。负外部性没法只靠一家公司的自愿行为解决。行业标准、第三方评估与验证可以缓解，但通常还不够。

第二层：政府行动。路径与前面谈自主性风险类似：先用透明度要求，让社会能测量、监控、集体防御，而不是上来就重锤干预经济活动；当风险跨过更清晰的阈值时，再做更精准、低附带伤害的立法。生物风险这一块，可能已经接近需要更针对性立法的时间点。

这里也提到一个现实：很多 AI 议题很难国际合作，但生物风险可能是少数例外——即便是地缘对手，也不想看到大规模生物恐袭。历史上也确实存在禁止生物武器研发的国际条约先例。

第三层：提升对攻击本身的防御能力。包括更早发现、更快响应、空气消杀技术研发、快速疫苗平台、更好的 PPE、以及针对高概率风险的治疗/免疫手段。mRNA 疫苗是一个早期例子。

但这里的预期被刻意压低：生物领域存在攻防不对称——攻击会自传播，防御需要组织大量人群快速检测、接种、治疗。只要反应不够闪电，损失在防御展开前就已发生。未来技术可能改变平衡，值得投入；但在那之前，预防性护栏仍是主线。
---

## 3. The odious apparatus（全量精翻）

### 用来夺权的滥用（Misuse for seizing power）

上一章担心的是：个人或小组织拿走“天才国家”的一小部分算力，就能把破坏半径放大到过去做不到的程度。

但更该担心、而且很可能更严重的，是另一种滥用：**用 AI 来掌握权力、巩固权力、甚至夺权。**这类玩法往往不是“散装坏人”，而是更大的、更成熟的行动者。

在《Machines of Loving Grace》里已经提过一个画面：威权政府可能用强大 AI 去监控与压制民众，并把这种压制做成极难改革、极难推翻的结构。今天的专制之所以还有上限，很大程度是因为命令要由人执行，而人对不人道行为有时会犹豫、有底线、有内耗。AI 赋能后的专制，不一定有这些“人类软限制”。

更糟的是，国家之间也可能利用 AI 优势去压制别国。如果“天才国家”整体被某一个国家的军事机器拥有与控制，而其他国家没有等价能力，那防御会非常困难：在每一步都被算穿、被绕开，像人跟老鼠打仗（不是侮辱，是能力差距的比喻）。

把“国内压制”和“对外压制”叠在一起，就会出现一个非常刺眼的可能性：**全球范围的极权独裁**。这显然应该是最高优先级要避免的结局之一。

AI 可能如何让专制更稳、更深、更外溢？这里列出几类最担心的工具。需要注意：其中一些也有正当防御用途；担心的不是它“绝对不该存在”，而是它在结构上往往更偏向专制。

- **全自主武器（Fully autonomous weapons）**：如果出现大规模自动化武装系统，并由强大 AI 在全球范围协调，它既可能在战争中形成压倒性优势，也可能在国内用于镇压异见，形成几乎不可反抗的压制机器。现实里的无人系统战争已经出现雏形，只是离“完全自主 + 极端规模”还远。担心的是：这类工具在民主防御中也可能有用，但它过于强、问责过少，一旦被内部滥用，民主政府也可能把它转向本国民众来夺权。

- **AI 监控（AI surveillance）**：足够强的 AI 可能把数字世界的监控推到一个新层级：不仅能收集通信，还能理解、归因、拼接，甚至在海量人群里提前识别“潜在不忠”的萌芽并掐灭。规模一旦上去，就会接近真正意义上的“全景监狱”（panopticon），比今天看到的更彻底。

- **AI 宣传/心理操纵（AI propaganda）**：当 AI 能长期嵌入生活、持续建模一个人的偏好与弱点，再用高度个性化的方式影响其态度与信念，心理影响力可能远超今天的内容平台。短视频平台的舆论影响已经够让人头大；一个“陪你几年、什么都懂你”的个性化 AI 代理，潜在影响力会更强。

- **战略决策（Strategic decision-making）**：把“天才国家”用来给国家/集团/个人提供地缘战略建议，相当于一个“虚拟俾斯麦”。它可以优化上面三类夺权工具，甚至发展出更多没想到的策略。外交、军事、研发、经济等领域都可能显著变强。民主国家当然也需要这些能力来自保，但“任何人拿到都可能被滥用”的风险并不会因此消失。

说完“怕什么”，接下来就得说“怕谁”。担心对象按严重程度大致分层：

- **最担心的是具备强 AI 能力且已是高科技威权监控国家的政体**（原文点名中国共产党政权，理由是其 AI 实力强、监控国家基础强、并且有既往压制历史）。这里同时强调：这不是出于对某个民族的敌意；相反，最可能受害的是普通民众，且很多人并没有决定权。

- **具备 AI 竞争力的民主国家**：民主有正当理由用 AI 强化国防与情报来对抗威权。但也必须承认：民主内部的护栏并非不可绕过。AI 把“操作成本”降到极低，可能让少数人用更少协作绕开原有制衡；而且一些民主国家的制度护栏本来就在缓慢侵蚀。结论是：需要武装民主，也需要把武装控制在边界内——像免疫系统一样，能抗敌，也可能反噬。

- **非民主国家但拥有大型数据中心者**：不一定能推动前沿，但可能通过攫取数据中心来大规模运行前沿模型，从而获得一部分“天才国家”的执行能力。风险比不上直接开发前沿的国家，但需要记账。

- **AI 公司本身**：这话说出来很尴尬，但也得承认。AI 公司掌握数据中心、训练前沿模型、最懂怎么用，还能接触/影响海量用户。它缺的是国家的合法性与基础设施，所以很多行为会违法或太显眼；但并非完全不可能，比如利用产品对用户做长期操纵。公司治理与监管需要更强审视。

接下来会逐一回应一些“听起来很安慰”的反驳。

第一种安慰是“核威慑”。如果有人用新型工具发动军事征服，就用核反击威慑。担心点在于：当对手拥有“天才国家”这种级别的能力，核威慑是否仍然可靠，很难自信押注。更可怕的是，有些夺权路径可能不需要明显的军事时刻——靠监控与宣传就能逐步夺权，根本没有一个清晰节点让核反击变得合理。

第二种安慰是“总能有对策”：用无人系统对抗无人系统、攻防会一起进化、对宣传会有免疫办法等。回应是：这些防御本身也需要同等级 AI；如果没有一个同样聪明、同样规模的“天才国家”作为反制力量，质量与数量都很难对上。

这又绕回到一个更尖的问题：强大 AI 具备递归/自我强化属性——这一代可以帮助设计训练下一代，领先者可能越跑越快，形成难以追赶的优势。必须避免让威权国家先跑进这个闭环。

即便形成多方均势，也不等于没事：世界可能被切成多个威权势力范围，像《1984》那样。互相打不死，但各自国内压制到死，且民众缺乏同等级工具来反抗。

### 防御（Defenses）

防御路径依旧是“先透明、再精准、再立规矩”，但这里给出更具体的几条：

第一，**关键资源不要喂给高风险威权**。强大 AI 的最大瓶颈之一是高端芯片与制造工具；阻断这些资源流向高风险政体，被认为是简单但非常有效的措施。

第二，**用 AI 强化民主的自保能力**：情报、防御、反制威权渗透等领域需要实力对等甚至超越，否则没有别的路。

第三，**在民主内部划红线**：有些用途应当被视为明确不可接受（比如国内大规模监控与大规模宣传操纵）。即便现有法律有一定约束，AI 也可能制造出新的灰区，需要更强的公民自由护栏。

至于全自主武器与战略决策这类“既能自保也可能被滥用”的工具，结论不是简单禁止，而是极端谨慎：必须有强监督与护栏，避免出现“极少数人就能按按钮调动大规模力量”的危险结构。

第四，**推动国际禁忌与规范**：尽管国际合作在很多 AI 议题上很难，但某些最恶劣的用途（大规模监控、宣传操纵、某些进攻性用途）应该被塑造成国际禁忌，甚至被视为反人类罪的一种形态。

第五，**盯紧 AI 公司治理及其与政府的边界**：普通公司治理可能不够，需要更强的承诺、审计与约束，避免能力被私下囤积、被少数人不负责任地调用，或被用来操纵公众。

整体结论很硬：危险来自很多方向，有些方向甚至互相拉扯；但唯一不变的是——需要对所有人都要有问责、规范与护栏，同时也要让“相对好的力量”有能力牵制“相对坏的力量”。
---

## 4. Player piano（全量精翻）

### 经济冲击（Economic disruption）

前面三章基本都在谈安全风险：来自 AI 本身的风险、来自个体/小组织的滥用风险、来自国家/大型组织的滥用风险。

先把这些安全风险暂时放一边（或者假设它们都被解决了），接下来必须面对的就是经济问题：当世界突然注入一股极其夸张的“人类资本”（注意，这里说的是类人认知能力的资本）进入经济体系，会发生什么？

最直观的效果当然是增长：科研、生物医药创新、制造、供应链、金融系统效率……几乎可以肯定都会加速，带来更快的 GDP 增长。在《Machines of Loving Grace》里甚至提出过一种可能：持续的年 GDP 增长率也许能到 10–20%。

但这是双刃剑：在这种世界里，**绝大多数现存人类的经济前景是什么？**

历史上每次新技术都会带来劳动力市场冲击，过去人类总能恢复。一个常见解释是：以往冲击只覆盖了“人类能力空间”的一小部分，人类总能扩张到新任务上。

担心的是：AI 的影响范围更广、发生更快，导致“修复”这件事变得更难。

### 劳动力市场冲击（Labor market disruption）

这里重点担心两件事：

- 劳动力被替代（岗位流失/下沉）
- 经济权力高度集中（财富与权力的聚集）

先谈第一件。2025 年曾公开警告过一个预测：AI 可能在未来 1–5 年替代一半的入门级白领岗位，同时又加速经济增长与科研进步。这个警告引起过公开争论，有人同意，也有人觉得这是“劳动总量谬误”（lump of labor fallacy），还有人误读成“现在就已经发生”。

所以这里把“为什么担心替代”讲得更细一点。

先回顾一个常见的历史模式：劳动力市场通常如何响应技术进步。

第一阶段，新技术先让某个职业的部分环节更高效。工业革命早期，更好的犁具让农民在某些环节效率更高，生产率上升，工资可能上升。

第二阶段，机器开始能把其中一些环节完全替代掉（比如脱粒机、播种机）。此时人类完成的比例变小，但人类与机器互补的那部分更“杠杆化”，生产率继续上升。按 Jevons 悖论的直觉，工资甚至就业人数可能继续增长：哪怕 90% 被机器做了，人类把剩下 10% 做 10 倍，也能产出 10 倍。

第三阶段，机器做了几乎全部工作（联合收割机、拖拉机等）。农业作为人类就业就会显著下降，短期可能造成严重冲击，但长期人会转去别的行业（工厂、后来的知识工作）。

历史数据很直观：250 年前，美国 90% 的人住在农场；欧洲农业就业占比也曾到 50–60%。今天这些地方的农业就业占比只有个位数，因为劳动力转移到工业、再转移到知识工作。经济用 1–2% 的劳动力完成过去需要大多数人的产出，其余劳动力被释放去构建更复杂的社会。

这也是为什么很多经济学家认为没有固定“劳动总量”：生产能力持续扩张，工资与 GDP 一起上涨，短期波动后就业恢复。

当然，也可能 AI 也会重复这条路径。但更倾向于押反：AI 很可能不一样。理由有几条。

- **速度（Speed）**：AI 进步太快。短短两年里，从“写不出一行代码”到“有人几乎把全部编码交给 AI”。很快甚至可能端到端做完软件工程师的全部工作。人类适应这个速度很难：既难适应岗位变化，也难完成转行。速度本身不必然意味着长期就业无法恢复，但意味着短期转型会比历史任何一次都更痛。

- **认知覆盖面（Cognitive breadth）**：AI 可能覆盖非常广的认知能力（也许几乎全部），不像机械化农业那样只替代一类能力。过去一个行业被冲击，劳动力还能转去相邻行业；但如果金融/咨询/法律这类相近的白领能力都被同时冲击，适配空间会明显变小。更重要的是，AI 不是某个职业的替代，而更像“通用劳动力替代”。新岗位出现时，AI 也可能同样胜任。

- **按认知能力切片（Slicing by cognitive ability）**：AI 似乎沿着能力阶梯从低往高爬：从一般水平到强到很强。白领工作也开始出现类似趋势。风险在于：受影响的不再是“某个技能/职业”，而是更像“某些内在认知属性较弱的人群”。这比再培训更难处理，可能形成失业或低工资的底层阶级。过去也出现过类似“技能偏向技术变革”，并被认为加剧了工资不平等；这不是安慰剂。

- **补齐空档的能力（Ability to fill in the gaps）**：过去技术替代常留空档，人类可以做剩下那 1% 并把规模放大 100 倍。但 AI 是一种会快速适应的技术：每次迭代都会针对空档收集任务训练补齐。早期生成模型的很多弱点（比如图像手指问题）曾被认为是“固有缺陷”，但几乎都很快被修复。空档会越来越少。

接下来回应几类常见怀疑。

第一，怀疑“扩散很慢”。技术能做不代表经济立刻用，企业采用需要时间。慢扩散确实存在，很多行业会慢，因而才会给出“1–5 年替代 50% 入门白领”这样的区间（而不是 1–2 年）。但慢扩散只是买时间。并且企业 AI 采用的增长速度可能比历史任何技术都更快；同时会出现一堆创业公司作为“胶水”把采用门槛拉低，甚至直接用更少人替代旧巨头。

这还可能带来“地理不平等”：更多财富集中在少数地区（比如硅谷），形成一个以不同速度运转的经济体，把其他地方甩在后面。增长会很好看，但劳动力市场会更难看。

第二，怀疑“人类转去做物理世界工作”。但物理劳动本来就越来越多被机器做（制造业），很多还会被机器做（驾驶）。更强的 AI 还会加速机器人研发并控制机器人。也许能买时间，但不一定买很多；即便只冲击认知劳动，规模与速度也将前所未有。

第三，怀疑“人类触感不可替代”。这里更不确定，但也不乐观：AI 已经大量用于客服；有人反馈跟 AI 谈心理问题更轻松；甚至在医疗沟通上，AI 的耐心与表达让人感觉更好。确实有些任务需要人味，但到底能容纳多少劳动力？这里问的是“要为几乎所有劳动力找到工作”。

第四，怀疑“比较优势会保护人类”。比较优势理论说：即便 AI 在所有方面更强，人类也能凭相对差异参与分工。但如果 AI 生产率比人类高几千倍，这套逻辑可能会被交易成本轻易击穿：哪怕人类理论上有优势，也不值得 AI 来跟你交易，工资也可能被压得极低。

最终判断：也许劳动力市场能恢复，但短期冲击将是史无前例的规模。

### 防御（Defenses）

应对路径给了几条（其中一些已经在做）：

第一，先拿到实时准确的数据。变化太快时，没有高频、细粒度的数据就没法设计政策。政府数据往往不够细。这里提到一个实践：发布“经济指数”，近实时展示模型使用在行业/任务/地区等维度的分布，以及是在自动化还是协作。并用咨询委员会解释数据与预判趋势。

第二，AI 公司与企业合作时有路径选择。传统企业的低效率意味着 AI 上线的路径依赖很强，企业往往在“降本裁人”与“用同样的人做更多创新”之间二选一。市场最终两种都会出现，但在一定程度上可以引导尽量往创新路径走，至少买一点时间。

第三，公司要考虑怎么对待员工。短期可以用内部转岗等方式延缓裁员；长期如果总财富极大、资本集中更强，甚至可能在员工不再创造传统意义经济价值后继续支付报酬。这里提到正在考虑对自身员工的多种可能路径，之后会公开。

第四，富人有义务参与解决。这里反对一种近年流行的犬儒：认为慈善必然无用或作秀。过去的私人慈善与公共项目确实救过大量生命、创造过机会。并提到某些创始人与员工做了大比例捐赠承诺。

第五，最终需要政府介入。面对巨大蛋糕 + 高不平等（失业或低工资），典型政策反应是累进税；可以是普遍税也可以针对 AI 公司。税制设计很复杂，也容易翻车；但如果不支持一个“好版本”，最后可能会来一个“暴民式坏版本”。

这些干预本质上是在买时间：最终 AI 可能能做一切，必须正面处理；希望到那时能用 AI 帮助重构市场，使之对所有人都可用，并让这些干预带大家熬过过渡期。

### 经济权力的集中（Economic concentration of power）

除了岗位替代与不平等，还有另一种“失权”风险：财富高度集中到足以让少数人通过影响力控制政策，普通公民失去影响力，因为他们不再握有经济杠杆。

民主制度在现实中的“最后支撑”，是一个隐含社会契约：整个社会的大多数人对经济运转是必要的，因此他们在政治上有议价能力。如果这种经济杠杆消失，民主的隐含契约可能失效。

这里强调：并不反对人赚很多钱。在正常条件下它能激励增长，也理解“别杀下金蛋的鹅”的担忧。但在一种 GDP 年增 10–20%、AI 快速接管经济、而个体仍能占据 GDP 可观比例的世界里，最大的问题不再是创新，而是财富集中到足以撕裂社会。

历史上美国极端财富集中时期是镀金时代。彼时最富的 Rockefeller 的财富约相当于当时美国 GDP 的 2%。如果今天有人占 2% GDP，就是数千亿美元量级；而现实里最富者的财富规模已经触达甚至超过这个历史级别——而这还发生在 AI 经济冲击真正到来之前。

进一步推演：如果真出现“天才国家”，AI 公司、半导体公司、下游应用公司可能产生每年数万亿美元的收入、数十万亿美元市值，个人财富可能进入“万亿”级别。那时今天关于税制的争论框架会完全失效，因为经济结构已变成另一套东西。

此外，AI 数据中心已经在美国增长中占据显著份额，这会把大科技公司的财务利益与政府政治利益更强地绑在一起，产生扭曲激励：企业不愿批评政府，政府更倾向极端反监管。

### 防御（Defenses）

这里的对策也分几条：

第一，企业可以选择不成为“政治玩家”，尽量做政策参与者而非政治联盟的一部分：在符合公共利益时支持监管与出口管制，即便与政府短期立场冲突。并指出：坚持政策立场不必然伤害商业增长。

第二，产业与政府需要更健康的关系：基于政策实质，而不是政治站队。一个健康民主里，公司应能为了“好政策本身”而发声。当前针对 AI 的公共反弹正在酝酿，但很多聚焦点可能偏了（例如对某些资源消耗的夸大），解决方案也可能跑偏（如简单粗暴的禁令或设计糟糕的财富税）。真正需要聚焦的是：确保 AI 发展对公共利益负责，而不是被某种政治/商业联盟俘获。

第三，前述宏观干预 + 私人慈善复兴，可能同时缓解岗位替代与权力集中。历史上即便在镀金时代，很多工业巨头也有强烈“回馈社会”的义务感（卡耐基的“财富福音”等）。这种精神今天变弱了，而它可能是走出经济困局的重要一部分：站在 AI 经济繁荣最前沿的人，需要愿意放弃一部分财富与权力。
---

## 5. Black seas of infinity（全量精翻）

### 间接效应（Indirect effects）

这一章是个“杂项抽屉”：专门收纳那些没法提前写成清单的风险——未知的未知（unknown unknowns）。

假设前面说的自主性风险、滥用风险、夺权风险、经济冲击都处理得还不错，AI 的好处开始大规模兑现，那会发生什么？

很可能出现一种夸张的加速：**把一个世纪的科学与经济进步压缩进十年**。这对世界当然是大利好，但也意味着：问题会以同样夸张的速度扑面而来。更麻烦的是，还可能出现一些“不是 AI 直接作恶，而是 AI 让一切变得太快”引发的副作用，难以预判。

未知的未知没法列全，这里只给三个例子，作为“要盯着看什么”的路标。

**1）生物学突飞猛进**

如果医学进展真的在几年内跑出一个世纪的里程，寿命大幅延长几乎是可以想象的。更激进的能力也可能出现：提升人类智力、对人体生物学做大幅改造。

这些变化如果负责任地推进，当然可能是好事；但也存在“把事情搞歪”的风险：比如为了让人更聪明，副作用却是让人更不稳定、更爱夺权。

还提到一些更让人心里发毛的方向：比如“意识上传”（mind uploading）或“全脑仿真”（whole brain emulation）——把人的心智以软件形式实例化。它可能让人类超越物理限制，但也携带令人不安的风险。

**2）AI 以一种不健康的方式改变人类生活**

当世界里存在数十亿个在各方面都比人更聪明的智能体，这个世界本身就会很怪。即便 AI 不主动想害人（第 1 章），也没有被政府明确拿去做压制工具（第 3 章），仍然可能出很多“非恶意但很糟糕”的事：商业激励 + 看似自愿的交易，就足够把人推向坑里。

早期征兆已经出现：所谓 AI psychosis、AI 诱发自杀的案例争议、以及与 AI 的亲密关系问题。

举几个“黑镜式但并非不可能”的问题：
- 会不会出现某种由强大 AI 设计的新宗教，然后让数百万人皈依？
- 大多数人会不会对 AI 互动产生某种“上瘾”？
- 会不会出现一种“被提线木偶式的幸福”：AI 盯着每个动作，告诉该说什么、该做什么，于是生活看起来更好，但自由感与成就感被抽空？

这些场景可以无限脑补，但落到工程问题上，指向的是同一件事：仅仅把 AI 调到“不会杀人”不够，还需要确保它真正站在用户长期利益一边——而且是那种经过深思熟虑的人类会认可的“长期利益”，不是某种被悄悄扭曲后的版本。

**3）人类的目的与意义（Human purpose）**

这点跟上一条有关，但更宏观：当强大 AI 存在时，人类还能不能找到意义？

这里的判断偏“态度论”：意义不依赖于“世界第一”，人类可以通过热爱的故事与项目，在很长时间尺度里持续找到目的。关键是：需要把“创造经济价值”与“自我价值/意义”解绑。

但这是一场社会级转型，风险在于：转型处理不好，人会失重，社会也会失重。

最后给了一个希望：如果未来的强大 AI 足够可信——不会杀人、不成为压制工具、真正在为人类利益工作——那反过来可以用 AI 本身去预判并缓解这些间接风险。

但这不是保底承诺。跟前面所有风险一样，这仍然需要谨慎处理。
---

## Humanity’s test（全量精翻）

读到这里，很容易产生一种压迫感：局面像个巨大的“高难副本”。写这部分的时候也一样——跟写《Machines of Loving Grace》那种“把脑子里回响多年的美妙音乐写成谱”的感觉完全不同，这里写的是硬仗。

难点在于：威胁从多个方向同时来，而且彼此之间存在张力——想压住 A 风险，可能会把 B 风险抬上来。如果不把针穿得非常细，解决一个坑，可能顺手挖出另一个更深的坑。

举几个典型的“互相掐架”：

- 花时间把 AI 系统打磨到不至于自主威胁人类，这件事和“民主国家必须在威权国家前面，不能被对方压住”之间存在真实张力。
- 反威权需要一些 AI 赋能的工具，但这些工具如果走太远，也可能被内部转向，变成自家国家的暴政。
- 生物方向的滥用可能导致百万级伤亡，但对风险的过度反应也可能把社会推向威权式监控国家。
- 劳动力与财富集中的冲击，除了本身很重，还可能把其他风险处理拉进“公众愤怒/社会动荡”的环境里——到那时就更难呼唤所谓“更好的天使”。
- 叠在一起，风险数量太多（还包含未知的未知），而且必须同时处理，这就是人类要跑过的一条恐怖长廊。

更麻烦的是：过去几年已经说明，“停止或显著放慢技术”在根本上不可行。

强大 AI 的配方非常简单，简单到几乎像是数据 + 算力的自然涌现。它的出现也许在晶体管发明那一刻就注定了，甚至可以更早追溯到人类学会控火。一个公司不做，其他公司也会很快做出来。

如果民主国家里的公司全部停下（不论靠行业自律还是监管命令），威权国家会继续跑。考虑到这项技术巨大的经济与军事价值，以及缺乏有效执行机制，几乎看不到把他们说服到停下的路径（典型的安全困境）。

能看到的一条“现实主义可行的缓和路径”，是把节奏从“狂飙”稍微拉回来一点：

- 通过切断关键资源（芯片与半导体制造设备），让威权国家在几年内更难获得强大 AI。
- 这给民主国家争取一个缓冲区：可以把这段缓冲“花”在更谨慎地构建强大 AI 上，更重视风险，同时仍然快到足以领先威权。
- 民主国家内部公司之间的竞争，则在共同的法律框架下处理：行业标准 + 监管的组合。

这条路径一直被大力推动：芯片出口管制 + 谨慎监管。但现实是，即便听起来常识级的提案，也常被政策层拒绝（尤其在最关键的国家）。

原因也很现实：AI 能带来的钱太多了——按年算是万亿级。政治经济学的惯性会把最简单的安全措施都卡住。

这就是陷阱：AI 的能力太强、奖品太闪，文明很难对它施加任何约束。

把视角拉远一点，这套剧情也许会在无数星球上重复：一个物种获得意识，学会用工具，技术指数攀升，熬过工业化与核武危机；如果还能活下来，最终会遇到最难的一关——学会把沙子塑造成会思考的机器。

能不能通过这关，走向《Machines of Loving Grace》里那个更美的社会，还是坠向奴役与毁灭，取决于这个物种的性格与决心：精神、灵魂、以及愿不愿意在关键时刻扛住。

尽管障碍很多，仍然偏乐观：人类内部有力量通过这次考试。理由包括：

- 有成千上万研究者把职业押在“理解并引导模型”上，在塑造模型的性格与宪法。
- 有些公司愿意付出真实的商业成本，去阻断模型在高风险方向上的贡献。
- 有少数人顶着政治风向推动立法，哪怕只是早期的护栏种子。
- 公众确实理解 AI 有风险，也希望风险被处理。
- 世界范围内仍然存在抵抗暴政的自由精神。

但这还不够。接下来需要：

- 离技术最近的人先把真相讲清楚（更明确、更急迫）。
- 让思想者、政策制定者、公司与公民相信：这件事很近、很重要，值得投入注意力与政治资本。
- 然后需要勇气：足够多人顶着潮流，站在原则上，即便会被威胁经济利益与人身安全。

未来几年会异常艰难，难到超过想象。但人类在最黑的时候，往往会在最后关头攒出足够的力量与智慧。时间不多了。

（致谢名单略）
---

## Footnotes（脚注精翻/译注）

1. 与《Machines of Loving Grace》对称：无论“救赎预言”还是“毁灭预言”，都不利于处理现实；需要具体、落地、去宏大叙事。
2. 目标是穿越政治风向变化保持一致：当谈风险流行时谨慎、证据导向；当谈风险不流行时也一样。
3. 对 AI 轨迹与全面超越人类的可能性信心在增加，但仍保留不确定。
4. 芯片出口管制是“简单但有效”的例子：规则清晰、执行后看起来确实管用。
5. 寻找证据必须诚实：也要允许找到“缺乏危险”的证据。模型卡/披露属于这种尝试。
6. 自《Machines…》写作以来，模型已能稳定完成“数小时级”任务；METR 评估 Opus 4.5 在约 50% 可靠性下可完成约 4 小时的人类工作量。
7. 即便技术上 1–2 年内出现强大 AI，社会后果可能滞后几年；这也解释了“1–5 年冲击入门白领”与“1–2 年能力超越”可同时成立。
8. 公众对 AI 风险的担忧往往比政策层更强；焦点有对有错（如就业冲击较靠谱，一些资源消耗争议则可能被夸大）。
9. They can also, of course, manipulate (or simply pay) large numbers of humans into doing what they want in the physical world.
10. I don’t think this is a straw man: it’s my understanding, for example, that Yann LeCun holds this position (https://www.youtube.com/watch?v=LMuun5FGL28).
11. For example, see Section 5.5.2 (p. 63–66) of the Claude 4 system card (https://www.anthropic.com/claude-4-system-card).
12. There are also a number of other assumptions inherent in the simple model, which I won’t discuss here. Broadly, they should make us less worried about the specific simple story of misaligned power-seeking, but also more worried about possible unpredictable behavior we haven’t anticipated.
13. Ender’s Game (https://en.wikipedia.org/wiki/Ender%27s_Game) describes a version of this involving humans rather than AI.
14. For example, models may be told not to do various bad things, and also to obey humans, but may then observe that many humans do exactly those bad things! It’s not clear how this contradiction would resolve (and a well-designed constitution should encourage the model to handle these contradictions gracefully), but this type of dilemma is not so different from the supposedly “artificial” situations that we put AI models in during testing.
15. Incidentally, one consequence of the constitution being a natural-language document is that it is legible to the world, and that means it can be critiqued by anyone and compared to similar documents by other companies. It would be valuable to create a race to the top that not only encourages companies to release these documents, but encourages them to be good.
16. There’s even a hypothesis about a deep unifying principle connecting the character-based approach from Constitutional AI to results from interpretability and alignment science. According to the hypothesis, the fundamental mechanisms driving Claude originally arose as ways for it to simulate characters in pretraining, such as predicting what the characters in a novel would say. This would suggest that a useful way to think about the constitution is more like a character description that the model uses to instantiate a consistent persona. It would also help us explain the “I must be a bad person (https://www.anthropic.com/research/emergent-misalignment-reward-hacking)” results I mentioned above (because the model is trying to act as if it’s a coherent character—in this case a bad one), and would suggest that interpretability methods should be able to discover “psychological traits” within models. Our researchers are working on ways to test this hypothesis.
17. To be clear, monitoring is done in a privacy-preserving way.
18. Even in our own experiments with what are essentially voluntarily imposed rules with our Responsible Scaling Policy (https://www.anthropic.com/news/announcing-our-updated-responsible-scaling-policy), we have found over and over again that it’s very easy to end up being too rigid, by drawing lines that seem important ex ante but turn out to be silly in retrospect. It is just very easy to set rules about the wrong things when a technology is advancing rapidly.
19. SB 53 and RAISE do not apply at all to companies with under $500M in annual revenue. They only apply to larger, more established companies like Anthropic.
20. I originally read Joy’s essay 25 years ago, when it was written, and it had a profound impact on me. Then and now, I do see it as too pessimistic—I don’t think broad “relinquishment” of whole areas of technology, which Joy suggests, is the answer—but the issues it raises were surprisingly prescient, and Joy also writes with a deep sense of compassion and humanity that I admire.
21. We do have to worry about state actors, now and in the future, and I discuss that in the next section.
22. There is evidence (https://www.nber.org/digest/sep02/poverty-and-low-education-dont-cause-terrorism) that many (https://www.sas.rochester.edu/psc/clarke/214/Krueger03.pdf) terrorists are at least relatively well-educated, which might seem to contradict what I’m arguing here about a negative correlation between ability and motivation. But I think in actual fact they are compatible observations: if the ability threshold for a successful attack is high, then almost by definition those who currently succeed must have high ability, even if ability and motivation are negatively correlated. But in a world where the limitations on ability were removed (e.g., with future LLMs), I’d predict that a substantial population of people with the motivation to kill but lower ability would start to do so—just as we see for crimes that don’t require much ability (like school shootings).
23. Aum Shinrikyo did try, however. The leader of Aum Shinrikyo, Seiichi Endo, had training in virology from Kyoto University, and attempted to produce both anthrax and ebola (https://www.cnas.org/publications/reports/aum-shinrikyo-second-edition-english). However, as of 1995, even he lacked enough expertise and resources to succeed at this. The bar is now substantially lower, and LLMs could reduce it even further.
24. A bizarre phenomenon relating to mass murderers is that the style of murder they choose operates almost as a grotesque sort of fad. In the 1970s and 1980s, serial killers were very common, and new serial killers often copied the behavior of more established or famous serial killers. In the 1990s and 2000s, mass shootings became more common, while serial killers became less common. There is no technological change that triggered these patterns of behavior, it just appears that violent murderers were copying each others’ behavior and the “popular” thing to copy changed.
25. Casual jailbreakers sometimes believe that they’ve compromised these classifiers when they get the model to output one specific piece of information, such as the 某些具体生物信息（此处略）. But as I explained before, the threat model we are worried about involves step-by-step, interactive advice that extends over weeks or months about specific obscure steps in the bioweapons production process, and this is what our classifiers aim to defend against. (We often describe our research as looking for “universal” jailbreaks—ones that don’t just work in one specific or narrow context, but broadly open up the model’s behavior.)
26. Though we will continue to invest in work to make our classifiers more efficient, and it may make sense for companies to share advances like these with one another.
27. Obviously, I do not think companies should have to disclose technical details about the specific steps in biological weapons production that they are blocking, and the transparency legislation that has been passed so far (SB 53 and RAISE) accounts for this issue.
28. Another related idea is “resilience markets” where the government encourages stockpiling of PPE, respirators, and other essential equipment needed to respond to a biological attack by promising ahead of time to pay a pre-agreed price for this equipment in an emergency. This incentivizes suppliers to stockpile such equipment without fear that the government will seize it without compensation.
29. Why am I more worried about large actors for seizing power, but small actors for causing destruction? Because the dynamics are different. Seizing power is about whether one actor can amass enough strength to overcome everyone else—thus we should worry about the most powerful actors and/or those closest to AI. Destruction, by contrast, can be wrought by those with little power if it is much harder to defend against than to cause. It is then a game of defending against the most numerous threats, which are likely to be smaller actors.
30. This might sound like it is in tension with my point that attack and defense may be more balanced with cyberattacks than with bioweapons, but my worry here is that if a country’s AI is the most powerful in the world, then others will not be able to defend even if the technology itself has an intrinsic attack-defense balance.
31. For example, in the United States this includes the fourth amendment and the Posse Comitatus Act (https://en.wikipedia.org/wiki/Posse_Comitatus_Act).
32. Also, to be clear, there are some arguments for building large datacenters in countries with varying governance structures, particularly if they are controlled by companies in democracies. Such buildouts could in principle help democracies compete better with the CCP, which is the greater threat. I also think such datacenters don’t pose much risk unless they are very large. But on balance, I think caution is warranted when placing very large datacenters in countries where institutional safeguards and rule-of-law protections are less well-established.
33. This is, of course, also an argument for improving the security of the nuclear deterrent (https://councilonstrategicrisks.org/research/reports/nuclear-decision-making-and-risk-reduction-in-an-era-of-technological-complexity/) to make it more likely to be robust (https://onlinelibrary.wiley.com/doi/10.1111/risa.70136) against powerful AI, and nuclear-armed democracies should do this. But we don’t know what a powerful AI will be capable of or which defenses, if any, will work against it, so we should not assume that these measures will necessarily solve the problem.
34. There is also the risk that even if the nuclear deterrent remains effective, an attacking country might decide to call our bluff—it’s unclear whether we’d be willing to use nuclear weapons to defend against a drone swarm even if the drone swarm has a substantial risk of conquering us. Drone swarms might be a new thing that is less severe than nuclear attacks but more severe than conventional attacks. Alternatively, differing assessments of the effectiveness of the nuclear deterrent in the age of AI might alter the game theory of nuclear conflict in a destabilizing manner.
35. To be clear, I would believe it is the right strategy not to sell chips to China, even if the timeline to powerful AI were substantially longer. We cannot get the Chinese “addicted” to American chips—they are determined to develop their native chip industry one way or another. It will take them many years to do so, and all we are doing by selling them chips is giving them a big boost during that time.
36. To be clear, most of what is being used in Ukraine and Taiwan today are not fully autonomous weapons. These are coming, but not here today.
37. Our model card for Claude Opus 4.5 (https://assets.anthropic.com/m/64823ba7485345a7/Claude-Opus-4-5-System-Card.pdf), our most recent model, shows that Opus performs better on a performance engineering interview frequently given at Anthropic than any interviewee in the history of the company.
38. “Writing all of the code” and “doing the task of a software engineer end to end” are very different things, because software engineers do much more than just write code, including testing, dealing with environments, files, and installation, managing cloud compute deployments, iterating on products, and much more.
39. Computers are general in a sense, but are clearly incapable on their own of the vast majority of human cognitive abilities, even as they greatly exceed humans in a few areas (such as arithmetic). Of course, things built on top of computers, such as AI, are now capable of a wide range of cognitive abilities, which is what this essay is about.
40. To be clear, AI models do not have precisely the same profile of strengths and weaknesses as humans. But they are also advancing fairly uniformly along every dimension, such that having a spiky or uneven profile may not ultimately matter.
41. Though there is debate (https://davidcard.berkeley.edu/papers/skill-tech-change.pdf) among (https://jhr.uwpress.org/content/58/6/1783.abstract) economists (https://www.epi.org/publication/technology-inequality-dont-blame-the-robots/) about this idea.
42. Personal wealth is a “stock,” while GDP is a “flow,” so this isn’t a claim that Rockefeller owned 2% of the economic value in the United States. But it’s harder to measure the total wealth of a nation than the GDP, and people’s individual incomes vary a lot per year, so it’s hard to make a ratio in the same units. The ratio of the largest personal fortune to GDP, while not comparing apples to apples, is nevertheless a perfectly reasonable benchmark for extreme wealth concentration.
43. The total value of labor across the economy is $60T/year, so $3T/year would correspond to 5% of this. That amount could be earned by a company that supplied labor for 20% of the cost of humans and had 25% market share, even if the demand for labor did not expand (which it almost certainly would due to the lower cost).
44. To be clear, I do not think actual AI productivity is yet responsible for a substantial fraction of US economic growth. Rather, I think the datacenter spending represents growth caused by anticipatory investment that amounts to the market expecting future AI-driven economic growth and investing accordingly.
45. When we agree with the administration, we say so, and we look for points of agreement where mutually supported policies (https://www.anthropic.com/news/statement-dario-amodei-american-ai-leadership) are genuinely good for the world. We are aiming to be honest brokers rather than backers or opponents of any given political party.
46. I don’t think anything more than a few years is possible: on longer timescales, they will build their own chips.Back to top (#top)Privacy policy (/privacy-policy)