---
title: "oh-my-hermes：给 Hermes Agent 叠一层\"同事调度\"，把一个大活拆成图并行跑"
created: "2026-11-14"
tags: ["- KnowledgeBase"]
category: "- Alan の分享"
published: true
---

# oh-my-hermes：给 Hermes Agent 叠一层"同事调度"，把一个大活拆成图并行跑



## 是什么

项目在 GitHub 上是 `rlaope/oh-my-hermes`，Python 写的，MIT 协议，2026 年 6 月开建，到今天约 5.6k star、462 fork，仓库里文件超过六千个。官网叫 `omher.app`，还配了一个桌面端 `OMHER Desktop`（macOS / Windows），定位是"把你的 Hermes 机器人和编程 Agent 放在一个窗口里"。

定位：OMH 是 Hermes Agent 的**操作层（operating layer）**，不是 Hermes 本体。你继续对 Hermes 说话，OMH 在后台按"每条道给一个同事、一个技能、一个模型"的方式去调度。README 反复强调两件事：它不改 Hermes，也从不把"计划好的工作"报成"已经做完"。

## 做什么用的

核心玩法是一个叫 `dag-ulw` 的命令。你给它一句话目标，它把目标拆成一张由小节点组成的图，能并行的小节点一起跑，每个节点用对应类别的模型和推理强度；跑完再用一个独立节点去核目标有没有真做到，做坏的节点先修再出报告。

围绕这条主线，README 列出了几个它想解决的老问题：

- **每个节点配不同的模型**。每条工作道带一个类别（ultrabrain、deep、visual-engineering、quick 等），类别决定这条道用哪个模型链和多大推理量。某个模型被供应商拒绝时，链切换到下一个，而不是静默降级。`omh model` 打开选择器，每条道跑哪个模型能查得到。
- **技能按需加载**。仓库里带 115 个 `omh-*` 专家技能（仓库 `agent-skills/` 目录，遍历到前端、后端、Rust、安全评审、验证门禁都有），这些不是让你手动去调，而是由路由层当工具调用时自动装进这次运行里。
- **LSP 进循环**。找定义、引用、重命名走语言服务器，而不是字符串搜索，按语义重命名而不是按文本匹配。默认关闭，要在插件设置里开 `lsp_tools`。
- **长期记忆但每种都留痕**。候选记忆要么保留、要么拒绝、要么推迟，每种都带一句书面理由；下一个会话按任务和 token 预算出一个召回包。它不读也不改 Hermes 自己的记忆。
- **证据分级**。状态永远带两段：阶段 + 确信度。`Plan · not run`（计划，还没跑）、`Code · running`（执行器在跑）、`Code · reported done`（执行器说完了、没人核对）、`Test · verified`（测试/评审/CI 真正过了）。README 原话：执行器说"做完了"不等于有人核过。

还带了 10 个 `ulw-` 前缀的工作流：`ulw-interview`（一次问一个问题直到弄清需求）、`ulw-plan`（给有风险但不清楚怎么改的活做计划）、`ulw-work`（按已接受的计划并行跑、各道不碰同一个文件）、`ulw-loop`（一直循环到你要的门禁通过）、`ulw-qa`（主动用刁钻场景攻击构建）、`ulw-perf`（先测哪里真的慢再一个个修），等等。

## 怎么用

安装，三选一之后跑一次 `omh setup`：

```sh
curl -fsSL https://omher.app/install | sh
omh setup
```

也可以用包管理器：Homebrew 是 `brew install rlaope/tap/omh`，Bun 是 `bun install -g oh-my-hermes`，npm 是 `npm install -g oh-my-hermes`（后两种要求本机有 Node 18+ 和 Python 3.11+）。要升级直接 `omh update`，要排查问题跑 `omh doctor`，给某个工作类别换模型跑 `omh model`。

它的接入方式也有一处要留意：仓库根目录带了一整套按 harness（运行 Agent 的那个外壳程序）拆的安装器，`.claude`、`.codex`、`.cursor`、`.opencode`、`.openclaw`、`.pi` 各一份。也就是说这套"加在 Agent 外面的层"不只服务 Hermes，还能横向接到多数主流编码 harness 上（包括 Pi）。README 里给 Agent 用的安装说明要求先把 `main` 分支解析成固定的 commit SHA 再执行，不接受拿 `main` 当版本号。

- **每条 lane 用对的模型。**  
    每条 lane 都带有一个工作类别：`ultrabrain`、`deep`、`visual-engineering`、`quick` 等。  
    类别决定该 lane 的模型 chain 和推理强度，每条 chain 都可以编辑。  
    provider 拒绝某个模型时，不会悄悄降级，而是前进到 chain 的下一个模型。  
    `omh model` 打开选择器。[每条 lane 用哪个模型](https://github.com/rlaope/oh-my-hermes/blob/main/docs/INSTALLATION.md#guided-model-setup)
    
- ** `/dag-ulw` 图运行。**  
    你的目标会变成由小节点组成的图，就绪的节点并行运行。  
    每个节点使用其类别的模型和 effort，同时运行的节点不会共享写入范围。  
    由单独的节点检查目标，失败的节点在报告前得到修复。
    
- **按需加入的专家技能。**  
    前端、后端、Rust、安全评审、验证门禁等一百多个 `omh-*` 专业技能。  
    你不用去调用，路由器会把合适的技能以工具调用的形式加入运行。
    
- **可以信赖的长期记忆。**  
    不会悄悄记忆：每个候选都带着写明的理由被记住、拒绝或推迟。  
    下一个会话会得到按任务排序、裁剪到 token 预算内的召回包。  
    Hermes 自己的记忆从不被读取或修改。
    
- **OMH Native.**  
    `omh` 在 Hermes gateway 上打开 OMH 自己的 TUI，启动外观可用 `/theme` 切换。  
    `/dag-ulw` 先打印方框图，再显示实时 lane 树，列出每条 lane 的模型、effort 和 token。  
    在 agent 列表里 steer 或中断 agent，用 `!` 运行 shell 命令，按 Esc Esc 回退。
    
- **“完成”之前先有证据。**  
    每个状态都同时标明阶段和把握程度。  
    `Plan · not run` · `Code · reported done` · `Test · verified`  
    只有测试、评审或 CI 门禁真正通过，才算 verified。

## 工程视角看这套东西

源码只核到目录结构，没读透执行逻辑，下面的判断都基于这个前提。

**最有借鉴价值的是它把"确认"和"看见"分开了。** 多数 agent 工具把"执行器说完成了"和"确实完成了"当成一回事，OMH 的 evidence 分级把这两者掰开，`Code · reported done` 和 `Test · verified` 是两个不同状态。对做测试的人这是常识——构建通过的日志和验收通过不是同一个证据。它不因为希望结果成立就把中间态填成绿。README 甚至坦白：对比"Hermes 裸跑 vs 加 OMH"的产品级 A/B benchmark，语料和离线预演都就位了，但"还没有任何一次实测上线"。注意这不是谦虚，是它自己把"没测过"和"测过了"分开列。

**可引出几个待验证项，别让宣传替掉测量：**
- 模型路由、技能自动加载、记忆召回这些能力主张，README 写得多，但本机没装，没法复现。把它当供应商描述，不当事后验证。
- 5.6k star 里有多少是真实人工拿它长期跑、写入复盘，README 没给能核的口径。
- "不改 Hermes、不改其它 harness"是对外的承诺，落地时它往这些 harness 塞 manifest 和技能，塞哪些、读哪些，要做接入安全审计才清楚。
- `ISSUE` 目前只有约 15 条 open，跟六千多文件、115 技能的体量比起来，潜在维护面不小。


**对测试开发这个具体场景，它对应的可能是这样的活：** 把一份跨模块的回归方案拆成图，测试设计、用例生成、数据构造各放一条道，跑完由一条独立道按证据核验收结论；而不是让一个 Agent 从头到尾包办，最后给一句"应该都覆盖了"。

---

