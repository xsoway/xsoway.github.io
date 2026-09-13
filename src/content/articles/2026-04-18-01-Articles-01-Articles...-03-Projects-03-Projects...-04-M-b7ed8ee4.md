---
title: "未命名"
created: "2026-04-11"
tags: ["01-Articles","01-Articles/...","03-Projects","03-Projects/...","04-Memory","04-Memory/...","04-Memory/core/","04-Memory/decisions/","04-Memory/prefs/","04-Memory/topics/","OpenClaw"]
category: "Articles"
published: true
---
结论：

这两个我建议一起做，但分两阶段落地更稳。

阶段 A：先整理 Alan-Workspace 的目录和规则承载 目标：让这个空间变成“长期可协作、可落盘、可检索、可扩展”的标准工作区。

阶段 B：再优化 Hermes 配置 目标：让 Telegram、编码、多项目协作三件事统一起来，避免吵、避免乱、避免串目录。

下面是我给你的具体方案草案，你审一下。

一、Alan-Workspace 整理方案 目标：把它整理成“适合 Hermes 长期协作”的标准目录

我理解你这个空间现在已经有规则基础：

- 有 AGENTS.md / SOUL.md / USER.md / INDEX.md
    
- 有 rules/frontmatter-spec.md
    
- 有 01-Articles / 03-Projects 这类结构约束
    
- 也混有一些历史区、debug 区、Wiki 区、legacy 区
    

所以我不建议“大拆大迁移”，我建议做“标准化收口 + 非破坏整理”。

方案原则

1. 不大规模挪旧文件 先建立标准入口和标准流向，不直接把历史内容全搬动，避免引用断裂。
    
2. 新内容全部走标准目录 先把未来的内容变规范，再逐步清理历史。
    
3. 根目录只保留“入口文件 + 系统级规则” 不要让根目录继续堆杂项。
    
4. 对历史区做“保留但降权” 像 debug、90-System、legacy 这些可以保留，但不作为默认落盘区。
    

建议整理后的目录结构

我建议把 Alan-Workspace 收口成下面这套：

[本机路径已隐藏] ├── AGENTS.md ├── SOUL.md ├── USER.md ├── INDEX.md ├── TOOLS.md ├── CLAUDE.md ├── rules/ │ ├── frontmatter-spec.md │ ├── file-placement.md │ ├── writing-style.md │ └── workflow-conventions.md ├── 00-Inbox/ │ ├── captures/ │ ├── drafts/ │ └── to-sort/ ├── 01-Articles/ │ ├── AI-Agent/ │ ├── OpenClaw/ │ ├── Hermes/ │ ├── Learning/ │ ├── Reviews/ │ └── Archive/ ├── 03-Projects/ │ ├── active/ │ ├── incubating/ │ ├── archived/ │ └── templates/ ├── 04-Memory/ │ ├── core/ │ ├── prefs/ │ ├── topics/ │ ├── decisions/ │ └── daily/ ├── 05-Daily/ │ ├── daily-report/ │ ├── dailynews/ │ └── weekly/ ├── 06-Outputs/ │ ├── reports/ │ ├── exports/ │ ├── generated/ │ └── deliveries/ ├── 07-Scripts/ │ ├── automation/ │ ├── helpers/ │ └── maintenance/ ├── 08-Templates/ │ ├── article/ │ ├── project/ │ ├── review/ │ └── report/ ├── 09-Assets/ │ ├── images/ │ ├── pdfs/ │ ├── audio/ │ └── screenshots/ ├── 70-RAW/ ├── 71-Wiki/ ├── 90-System/ └── 99-Attachments/

为什么这么分

1. 00-Inbox 临时东西全进这里，避免根目录长草。
    
2. 01-Articles 你要求“文档、方案、复盘”这类内容落盘，这里就是主承载区。
    
3. 03-Projects 代码/脚本/项目归这里，适合 Hermes 做工程型任务。
    
4. 04-Memory 把系统级记忆、决策、项目背景沉淀下来，减少每次重复沟通。
    
5. 05-Daily 日报、资讯、周期产出集中收纳。
    
6. 06-Outputs Agent 生成但未必是“知识”的交付件，比如导出报告、最终稿、交付包。
    
7. 07-Scripts 把脚本和自动化能力独立出来，方便后续让 Hermes 复用。
    
8. 08-Templates 模板化很重要。你的很多流程后面都值得模板化。
    
9. 09-Assets / 99-Attachments 图片区分“工作素材”和“附件档案”，后面不容易乱。
    

我建议具体做的整理动作

第一批，低风险、立刻见效

1. 新建标准目录 只创建，不迁移旧文件。
    
2. 补几份规则文件 建议新增：
    

- rules/file-placement.md
    
- rules/workflow-conventions.md
    
- rules/writing-style.md
    

作用：

- file-placement：什么内容放哪
    
- workflow-conventions：接任务、落盘、引用、交付的统一规则
    
- writing-style：你偏好的输出风格
    

3. 给 INDEX.md 改成总导航页 让它成为真正入口，包括：
    

- 规则入口
    
- 当前活跃项目
    
- 文章入口
    
- 日常产出入口
    
- Wiki 入口
    
- 系统区入口
    

4. 给 03-Projects 建项目模板 标准每个项目至少有：
    

- README.md
    
- docs/
    
- outputs/
    
- scripts/
    
- notes/
    

5. 给 01-Articles 建文档模板 标准每篇文章默认：
    

- frontmatter
    
- 背景
    
- 结论
    
- 方案
    
- 风险/注意事项
    
- 相关链接
    

第二批，中风险、但价值高

6. 把当前根目录零散知识文档归位 比如一些正式文档、方案文档，从根目录逐步归到 01-Articles。
    
7. 把 debug 作为“非主工作区”标记 保留 debug，但明确：
    

- debug 是实验区
    
- 不是默认落盘区
    
- 不是长期知识主入口
    

8. 给 90-System 做系统区说明页 避免它看起来像“杂物间”。
    
9. 给 04-Memory 建索引 让历史决策、偏好、项目状态能快速检索。
    

第三批，后续增强

10. 增加自动新建文档脚本入口 比如：
    

- 新建文章
    
- 新建项目
    
- 新建日报
    
- 新建复盘
    

11. 加一个 workspace 健康检查脚本 检查：
    

- 是否缺 frontmatter
    
- 是否错放目录
    
- 是否根目录堆文件
    
- 是否缺 README
    
- 是否孤立文档
    

12. 给 Hermes 做“落盘默认规则映射” 比如：
    

- 方案/说明 -> 01-Articles
    
- 代码/项目 -> 03-Projects
    
- 日报 -> 05-Daily
    
- 附件 -> 99-Attachments
    

这个整理方案的最终效果

整理完后，Alan-Workspace 会变成：

- 有统一入口
    
- 有固定落盘路径
    
- 有知识区和项目区分层
    
- 有模板和脚本支持
    
- 有利于 Hermes 长期协作，而不是每次临时发挥
    

二、Hermes 配置优化方案 目标：做成“Telegram + 编码专用版”

你现在的现状，最关键的问题有 5 个：

1. workspace 已固定了，这是对的
    
2. Telegram 输出还是偏吵
    
3. 子 Agent 没做模型分层
    
4. fallback 还没配
    
5. smart routing 还没开
    
6. personality 还是 kawaii，不像交付型技术助手
    
7. timezone 还是空
    

我建议的优化目标

1. Telegram 上更安静、更像成品助理
    
2. 编码任务更稳，不乱目录
    
3. 多项目协作更清晰
    
4. 子 Agent 更便宜、更快
    
5. 主模型失败时不中断
    
6. 简单任务更省钱
    

建议配置方案

A. 工作空间层 保留当前： terminal.cwd = [本机路径已隐藏]

再加一个执行习惯：

- 文档默认落 01-Articles
    
- 项目默认落 03-Projects
    
- 临时文件默认落 00-Inbox 或 06-Outputs
    

B. Telegram 交互层 把这些调掉：

1. display.tool_progress 当前：all 建议：new
    

原因：

- all 太吵
    
- new 能看到关键动作，但不刷屏
    

2. display.tool_progress_command 建议：true
    

原因： (1/2)

- 你临时想看详细过程时，可以再开
    
- 平时默认安静
    

3. display.show_reasoning 保持 false
    
4. display.show_cost 保持 false 除非你要专门盯成本
    

C. 助手人格层 当前： display.personality = kawaii

建议改成： concise

如果你更偏“工程助理”，可以用： technical

我的建议优先级：

- 首选 concise
    
- 次选 technical
    

因为你明确偏好是：

- 直接
    
- 少废话
    
- 交付型
    

D. 时间与周期任务层 建议补： timezone = Asia/Shanghai

原因：

- cron
    
- 日报
    
- 定时任务
    
- 时间解释 都会更稳
    

E. 子 Agent / delegation 层 当前 delegation 没单独配置模型。 建议单独给它一个快而便宜的模型。

推荐思路：

- 主 Agent：继续用 gpt-5.4
    
- delegation：用 flash 类模型
    

建议值： delegation.provider = openrouter delegation.model = google/gemini-2.5-flash

好处：

- 查资料、扫代码、整理结果更便宜
    
- 主 Agent 只做统筹和收口
    

F. Fallback 层 建议加： fallback_model: provider: openrouter model: anthropic/claude-sonnet-4

作用：

- 主模型挂了、429、503、连接失败时自动切备用
    
- Telegram 在线助理特别需要这个兜底
    

G. Smart Model Routing 层 建议开： smart_model_routing.enabled = true

cheap_model 建议： provider = openrouter model = google/gemini-2.5-flash

作用：

- 简单问题不用每次都打主模型
    
- 降本明显
    
- 复杂任务照样走强模型
    

H. Checkpoints 层 你已经开了：

- checkpoints.enabled = true
    
- max_snapshots = 50
    

这个我建议保留不动。

因为你后面会让 Hermes 做编码任务，这很值。

I. Memory 层 你现在已经开着 memory 和 user_profile。 建议保留。

但执行策略上：

- 长期规则写工作区
    
- 用户长期偏好写 Hermes memory
    
- 项目内知识写 04-Memory / 01-Articles / 03-Projects 这样边界最清楚
    

J. Toolsets 层 你现在开得很全。 如果目标是“Telegram + 编码专用版”，我建议：

保留：

- web
    
- browser
    
- terminal
    
- file
    
- code_execution
    
- vision
    
- skills
    
- todo
    
- memory
    
- session_search
    
- delegation
    
- cronjob
    

可考虑关闭：

- image_gen
    
- tts
    
- homeassistant
    

理由： 如果这个 Hermes 主要是技术工作台，这三个会让能力更杂，不一定常用。 但这个不是必须关，只是“技术专用化”的建议。

我建议的两套配置档位

方案 1：稳妥版 适合你先上线用

改这些：

- terminal.cwd -> 已完成
    
- display.tool_progress -> new
    
- display.tool_progress_command -> true
    
- display.personality -> concise
    
- timezone -> Asia/Shanghai
    
- delegation.provider -> openrouter
    
- delegation.model -> google/gemini-2.5-flash
    
- fallback_model -> 开启
    
- smart_model_routing -> 开启
    

优点：

- 体验提升大
    
- 风险低
    
- 基本不破坏现有能力
    

方案 2：技术工作台版 适合你想把它收口成“编程/知识/自动化专用机”

在稳妥版基础上再做：

- 关闭 image_gen
    
- 关闭 tts
    
- 关闭 homeassistant
    
- personality 切 technical
    
- profile 拆分：
    
    - default
        
    - coder
        
    - research
        
    - eval
        
    - telegram-bot
        

优点：

- 更专注
    
- 更干净
    
- 长期维护成本更低
    

风险：

- 如果你偶尔还想直接玩图片/语音/智能家居，会少一点即用能力
    

三、我建议的实施顺序 如果你批，我建议按这个顺序做：

先做工作区

1. 只创建标准目录
    
2. 补 3 个规则文件
    
3. 改 INDEX.md 为总导航
    
4. 建文章模板、项目模板
    
5. 不大迁移旧文件
    

再做 Hermes 配置

6. 调 Telegram 显示
    
7. 调 personality
    
8. 补 timezone
    
9. 配 delegation
    
10. 配 fallback
    
11. 开 smart routing
    
12. 最后再决定要不要收缩 toolsets
    

四、我建议你重点审的点 你审的时候重点看这几个决策：

1. Alan-Workspace 要不要采用我这套分层目录
    
2. 01-Articles / 03-Projects / 04-Memory / 06-Outputs 这几个是否符合你的习惯
    
3. Hermes personality 你更想要 concise 还是 technical
    
4. Telegram 是否接受 tool_progress 从 all 改到 new
    
5. delegation / fallback / smart routing 是否走 openrouter 这条线
    
6. 是否要把 image_gen / tts / homeassistant 收掉
    

如果你愿意，我下一条可以直接给你一个“审查版清单”，非常适合你拍板：

A. 工作区整理方案清单版 B. Hermes 配置优化方案清单版 C. 最终建议采用版

你回我一句： “出清单版” 我就给你一份更适合拍板的版本。 (2/2)

- --

结论：

你这个方向是对的，但“共享”不能做成三套系统互相乱写。 最稳的方案是：

1. Obsidian 共享“知识与落盘结果”
    
2. OpenClaw 和 Hermes 共享“同一个工作空间”
    
3. 但两者不要直接共享各自私有配置、私有 session db、私有 memory store
    

也就是说： 共享工作区，不强绑底层状态。

结合你当前空间，我建议的正式方案是：

核心架构

以 [本机路径已隐藏] 作为三方共享中枢。

三者角色分工：

1. Obsidian 定位：唯一的人类可读知识库 / 长期资产层 职责：
    

- 看笔记
    
- 管链接
    
- 管目录
    
- 承接最终落盘
    
- 作为长期知识入口
    

2. OpenClaw 定位：入口层 / 调度层 / 通知层 / 轻编排层 职责：
    

- Telegram / Bot 入口
    
- 把任务路由到合适 agent
    
- 做通知、巡检、轻量工作流
    
- 把结果落盘进 Vault
    
- 管一些 cron / 自动化 / 门面交互
    

3. Hermes Agent 定位：工程执行层 / 技术分析层 / 代码执行层 职责：
    

- 编码
    
- 改文件
    
- 跑命令
    
- 技术分析
    
- 生成报告
    
- 产出结构化结果，再落回 Vault
    

一句话版本：

Obsidian 是脑子和档案馆， OpenClaw 是总控台和前台， Hermes 是重执行引擎。

你现在最适合的“共享方案”

方案名： OpenClaw + Hermes + Obsidian 共享工作区方案 v 1

一、共享什么 建议共享这 4 类东西：

1. 共享工作目录 就是你现在这个： [本机路径已隐藏]
    

这是最重要的共享层。

2. 共享规则文件 根目录这些就是三方共识层：
    

- AGENTS.md - 工作区规则（Alan-Workspace）
    
- SOUL.md - 人格与行为边界（Vault 版）
    
- USER.md - 使用者信息（Vault 版）
    
- Alan Workspace Index
    
- TOOLS.md - Local Notes
    
- Frontmatter 规范（Alan-Workspace）
    

以后不管是 OpenClaw 还是 Hermes，只要落在这个空间做事，都先读这层规则。

3. 共享知识资产 也就是 Vault 里的这些目录：
    

- 01-Articles/
    
- 03-Projects/
    
- 04-Memory/
    
- 05-Daily/
    
- 70-RAW/
    
- 71-Wiki/
    
- 99-Attachments/
    

4. 共享任务交换区 建议单独补一个协作区，比如：
    

- 06-Outputs/
    
- 07-Scripts/
    
- 90-System/integration/ 或更明确一点：
    
- 90-System/shared/inbox/
    
- 90-System/shared/outbox/
    
- 90-System/shared/reports/
    
- 90-System/shared/health/
    

这样 OpenClaw 和 Hermes 的协同不会污染正文知识区。

二、不共享什么 这点更重要。

不要共享这 5 类底层状态：

1. 不共享 OpenClaw 自己的配置目录 比如：
    

- ~/.openclaw/
    
- openclaw.json
    
- pairing 状态
    
- gateway service 状态
    

这些应继续归 OpenClaw 自己管。

2. 不共享 Hermes 自己的配置目录 比如：
    

- ~/.hermes/config.yaml
    
- ~/.hermes/.env
    
- ~/.hermes/sessions/
    
- ~/.hermes/auth.json
    

这些也应该继续独立。

3. 不直接合并两边的 memory store 原因：
    

- OpenClaw memory 和 Hermes memory 机制不同
    
- 直接混会变脏
    
- 可解释性会下降
    

更好的办法： 把长期共识写进 Vault，而不是硬合并到两个系统的内部记忆。

4. 不共享 session transcript 原始数据库 Session 是运行态，不是知识资产。 真正要共享的是“沉淀后的结果”。
    
5. 不让两个系统直接随意写对方私有目录 共享应发生在 Alan-Workspace，不应发生在 ~/.openclaw 和 ~/.hermes 之间。
    

三、我建议的共享原则 最稳的是“三层共享模型”：

第 1 层：规则共享 位置：

- AGENTS.md - 工作区规则（Alan-Workspace）
    
- SOUL.md - 人格与行为边界（Vault 版）
    
- USER.md - 使用者信息（Vault 版）
    
- Frontmatter 规范（Alan-Workspace）
    

作用：

- 定义怎么做事
    
- 定义怎么落盘
    
- 定义怎么写文档
    
- 定义回答时怎么引用
    

第 2 层：知识共享 位置：

- 01-Articles
    
- 03-Projects
    
- 04-Memory
    
- 05-Daily
    
- 70-RAW
    
- 71-Wiki
    

作用：

- 让 OpenClaw 和 Hermes 最终沉淀到同一个知识库
    
- 让 Obsidian 成为统一浏览入口
    

第 3 层：任务交换共享 建议新增位置：

- 90-System/shared/inbox/
    
- 90-System/shared/outbox/
    
- 90-System/shared/reports/
    
- 90-System/shared/health/
    
- 90-System/shared/logs/
    

作用：

- OpenClaw 投任务
    
- Hermes 接任务
    
- Hermes 回结果
    
- OpenClaw 做通知 / 汇总 / 再落盘
    

这个比“大家都直接改 01-Articles”更稳。

四、适合你当前空间的推荐目录调整 基于你当前空间，我建议不要大拆，只补共享协作层。

建议新增：

[本机路径已隐藏] ├── 01-Articles/ ├── 03-Projects/ ├── 04-Memory/ ├── 05-Daily/ ├── 06-Outputs/ ├── 07-Scripts/ ├── 70-RAW/ ├── 71-Wiki/ ├── 90-System/ │ ├── shared/ │ │ ├── inbox/ │ │ ├── outbox/ │ │ ├── reports/ │ │ ├── health/ │ │ └── logs/ │ ├── integration/ │ │ ├── openclaw-hermes/ │ │ └── obsidian-automation/ │ └── Workspace-Guide.md

这样分的好处：

1. 正式知识区不被中间产物污染
    
2. OpenClaw/Hermes 的协作状态可观察
    
3. Obsidian 打开时也能看懂整个系统怎么流转
    
4. 以后想加脚本、巡检、定时任务也方便
    

五、三方共享的“标准数据流” 这是我最建议你采用的工作流：

流 1：用户提出任务 用户 -> OpenClaw / Telegram

OpenClaw 做：

- 接消息
    
- 判断类型
    
- 轻任务自己处理
    
- 重工程任务投给 Hermes
    

流 2：工程任务执行 OpenClaw -> shared/inbox/task-_.json Hermes -> 读取任务 -> 执行 -> 写回 shared/outbox/result-_.json Hermes -> 如需人类可读物，写 shared/reports/*.md

流 3：正式落盘 OpenClaw 或 Hermes 再把最终稿落盘到：

- 文档 -> 01-Articles/...
    
- 项目 -> 03-Projects/...
    
- 记忆/决策 -> 04-Memory/...
    
- 周期产出 -> 05-Daily/...
    

流 4：Obsidian 消费 Obsidian 只负责：

- 浏览
    
- 编辑
    
- 链接
    
- 检索
    
- 知识闭环
    

这套模型里，Obsidian 是“知识展示与维护层”，不是任务队列系统。

六、我建议的职责边界 这个边界非常关键。

OpenClaw 负责：

- Telegram 入口
    
- Agent 团队分工
    
- 轻量任务
    
- 内容整理
    
- 对外通知
    
- 自动化编排
    
- 定时触发
    

Hermes 负责：

- shell / terminal / git / code
    
- 工程改动
    
- 报告生成
    
- 检查、诊断、分析
    
- 真正重执行型任务
    

Obsidian 负责： (1/2)

- 最终知识归档
    
- 双链导航
    
- 索引
    
- 长期记忆浏览
    
- 内容复盘
    

七、我对“共享记忆”的建议 如果你说的“共享”包含“共享长期记忆”，我建议这样做：

不要：

- OpenClaw memory 直接喂给 Hermes memory
    
- Hermes memory 直接回写 OpenClaw memory
    

建议： 把“共享长期记忆”提升到工作区文件层。

比如统一写在：

- 04-Memory/core/
    
- 04-Memory/prefs/
    
- 04-Memory/topics/
    
- 04-Memory/decisions/
    

这样好处是：

1. 人可读
    
2. 可审计
    
3. 可版本控制
    
4. 可被两个系统都读
    
5. 不依赖某个 agent 的私有实现
    

一句话： 共享记忆，用 Vault 文件共享；不要直接共享内部 memory backend。

八、我建议的最终口径 如果你要的是一句拍板结论，那就是：

采用“共享工作区 + 共享规则 + 共享知识库 + 共享任务交换区”， 但不共享各自私有配置、会话库、认证和底层 memory store。

这是最稳、最可维护、最适合你当前 openclaw + obsidian 运行态继续平滑接入 Hermes 的方案。

九、建议的下一步 如果你审这个方向没问题，我建议我下一步直接帮你做这 3 件事：

1. 在 Alan-Workspace 里补共享协作目录骨架
    

- 90-System/shared/inbox
    
- outbox
    
- reports
    
- health
    
- logs
    
- 06-Outputs
    
- 07-Scripts
    

2. 落一份正式方案文档 例如： 01-Articles/2026-04-11-OpenClaw-Hermes-Obsidian-共享工作区方案.md
    
3. 再给出一份落地实施清单 包括：
    

- OpenClaw 该怎么接
    
- Hermes 该怎么读写
    
- Obsidian 该怎么组织
    
- 哪些脚本后面值得补
    

如果你愿意，我下一条就直接给你： “OpenClaw + Hermes + Obsidian 共享方案（可执行版）” 我会按你工作区规范直接落盘。 (2/2)
# 📝 未命名

- --

