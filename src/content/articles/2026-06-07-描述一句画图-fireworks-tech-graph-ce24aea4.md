---
title: "描述一句就能出架构图？fireworks-tech-graph 把画图变成了说话"
created: "2026-06-07"
published: true
---

# 描述一句就能出架构图？fireworks-tech-graph 把画图变成了说话

我承认，画架构图这件事让我破防过不止一次。

不是一天两天。是那种反复出现的、固定节目式的折磨——打开 draw.io，拖方块，对齐箭头，调颜色，然后发现泳道画错了，重来。一两个小时过去，图是画出来了，但文章还没写。最气的是，下次换一个 Agent 架构，整个流程又得从头拖一遍。

有一种疲惫叫「我知道这图长什么样，但我就是不想画」。

直到上周六凌晨两点，我对着一个 Multi-Agent 的协作流程发呆，试着敲了一行字：「画一张 Multi-Agent 协作图，玻璃态风格」。十秒后，一张带磨砂玻璃卡片、六边形 Agent 节点、语义箭头的 SVG 躺在桌面上。我当时愣了三秒——不是因为它多完美，是因为它至少比我手画的强，而且只花了十秒。

这东西叫 fireworks-tech-graph。

---

## 说白了，它就是个「描述即出图」的 SVG 生成器

别被名字唬住。它的核心逻辑极其简单：

你告诉它你要画什么，用什么风格，它吐 SVG + PNG 给你。

但这里的「告诉」不是那种「请帮我生成一个包含三个泳道、五个节点的微服务架构图」的祷告式 prompt。它内置了一套 AI/Agent 领域的图类型知识——你只需要说「画一张 Mem0 记忆架构图，暗黑风格」，它就知道你要的是：Input Layer → Memory Manager → Storage Layer → Output Retrieval，带泳道、圆柱体、语义箭头的分层架构。

```text
用户：「画一张 Mem0 的架构图，暗黑风格」
  → Skill 识别：Memory Architecture Diagram，Style 2
  → 生成含泳道、圆柱体、语义箭头的 SVG
  → 导出 1920px PNG
  → 输出路径：mem0-architecture.svg / mem0-architecture.png
```

这件事有几个关键细节值得展开说。

### 它不是「通用画图 AI」，是「AI 领域专用图生成器」

市面上大模型画图的路子通常是两条：要么生成像素图（DALL·E / Midjourney），好看但不可编辑；要么写 Mermaid / PlantUML 代码，可编辑但丑。fireworks-tech-graph 选了第三条路——它直接产 SVG。

SVG 的好处不需要多解释：文本可搜索，节点可拖拽，颜色可替换，放大不糊。但更关键的是，它生成的不只是「一个 SVG 文件」，而是一个**带语义结构的 SVG**。每个节点有类型标记（LLM、Agent、Vector Store、API Gateway），每条箭头有流向类型标记（读取、写入、异步、控制）。这意味着你后期改图的时候，不需要从零开始。

### 它是为 AI/Agent 场景量身定制的

如果你画过几个 AI 系统的架构图，应该体会过一件事：很多图本质上是在重复画同一套东西。RAG 流程图、Agent 记忆层级、Tool Call 执行链路、Multi-Agent 协作拓扑……这些模式是固定的，但每次画都要从零拖方块。

fireworks-tech-graph 内置了这些模式：

```text
RAG Pipeline         → Query → Embed → VectorSearch → Retrieve → LLM → Response
Agentic RAG          → 在 RAG 基础上加入 Agent 循环 + 工具调用
Agentic Search       → Query → Planner → [Search/Calc/Code] → Synthesizer
Mem0 记忆层          → Input → Memory Manager → [VectorDB + GraphDB] → Context
Agent 记忆类型       → 感知记忆 → 工作记忆 → 情景记忆 → 语义记忆 → 程序记忆
Multi-Agent          → Orchestrator → [SubAgent×N] → Aggregator → Output
Tool Call 流程       → LLM → Tool Selector → Execution → Parser → LLM (循环)
```

你不需要告诉它 Agent 要用六边形、Vector Store 要用带内环的圆柱体、记忆读取用实线箭头而写入用虚线——这些规则它已经内化了。

有人端着茶点评：「这不就是个模板库吗？」这话对了一半。它确实有模板，但模板之间的组合逻辑是动态的。你描述一个「带工具调用的 Agentic RAG」，它会把 RAG 模板和 Tool Call 模板拼在一起，而不是让你在两个模板里二选一。这种组合能力，是单纯堆模板做不到的。

---

## 八种风格，不是换个颜色那么简单

很多画图工具所谓的「风格切换」，就是主题色从蓝变绿。但 fireworks-tech-graph 的八种风格，每一种背后都有一套完整的设计约束：背景色、字体族、节点形状偏好、箭头样式、甚至标题栏的 chrome。

| # | 风格 | 一句话形容 |
|---|------|-----------|
| 1 | 扁平图标风 | 白底彩色，博客和产品文档的首选。干净，不抢戏 |
| 2 | 暗黑极客风 | 终端窗口 chrome + Neon 配色，GitHub README 绝配 |
| 3 | 工程蓝图风 | 深蓝网格底 + 青色描边 + 编号分区标题，架构文档的仪式感 |
| 4 | Notion 极简风 | 白底、浅边框、单一强调色。Wiki 和内部文档 |
| 5 | 玻璃态卡片风 | 深色渐变底 + 磨砂玻璃卡片。Keynote 和产品官网 |
| 6 | Claude 官方风格 | Anthropic 品牌色的温暖奶油底，克制而专业 |
| 7 | OpenAI 官方风格 | 纯白极简，OpenAI 配色。干净到有点冷淡 |
| 8 | 暗黑奢华风 | 深黑底 + 香槟金 + 衬线标题。AI 手绘，不是模板驱动 |

风格 8 比较特殊——它不是靠模板渲染的，是 AI 根据 `references/style-8-dark-luxury.md` 里的约束手工画 SVG。这意味着同一句 prompt 跑两次，出来的图可能不完全一样。有点像你让一个设计师「按这个风格规范画一版」，而不是「从这个模板里选一张」。

说个实际体感：风格 2（暗黑极客风）是我用得最多的。原因很粗暴——公众号技术文章需要配图，暗色底在白色阅读界面里有天然的反差，截进文章里不用额外处理。风格 5（玻璃态）适合放在 PPT 里，磨砂质感的卡片在投影仪上比纯色方块有层次感。

有一个细节值得注意：每种风格不只是「换皮肤」。比如风格 3（蓝图风）有专门的编号分区标题（`01 // EDGE`、`02 // APPLICATION SERVICES`），风格 6（Claude 官方）有左侧 Layer Label，风格 2 有终端窗口的顶部 chrome（红黄绿三个圆点那种）。这些不是装饰，是风格本身的结构约束。

---

## 它凭什么不一样

聊到这里，有必要把它的差异化能力拉出来说清楚。

### 语义形状词汇表

在 fireworks-tech-graph 里，形状不是随意选的。每种概念有固定的形状映射：

| 概念 | 形状 | 为什么 |
|------|------|--------|
| LLM / 模型 | 双边框圆角矩形 + ⚡ | 一眼认出是模型层 |
| Agent / 编排器 | 六边形 | 多面体角色，区别于普通服务 |
| Vector Store | 带内环圆柱 | 区别于普通数据库 |
| 短期记忆 | 虚线边框圆角矩形 | 易失性暗示 |
| 长期记忆 | 实线圆柱体 | 持久化暗示 |
| Graph DB | 三圆簇 | 图结构可视化 |
| 决策节点 | 菱形 | 流程控制的标准符号 |
| API / 网关 | 六边形（单边框） | 入口角色 |

这套词汇表的价值不在于「好看」，而在于**一致性**。同一篇文章里出现三张图，Vector Store 长得一样，Agent 长得一样，LLM 长得一样——读者不需要每次重新理解图例。这在写系列技术文章的时候特别有用，读者看图是连续的，形状的稳定性能极大降低认知切换成本。

### 语义箭头系统

箭头也不是随便画的。颜色 + 虚线样式编码了箭头的语义：

| 流类型 | 线宽 | 虚线 | 含义 |
|--------|------|------|------|
| 主数据流 | 2px 实线 | — | 主要请求/响应路径 |
| 控制/触发 | 1.5px 实线 | — | 系统 A 触发 B |
| 记忆读取 | 1.5px 实线 | — | 从存储检索 |
| 记忆写入 | 1.5px | `5,3` | 写入/存储操作 |
| 异步/事件 | 1.5px | `4,2` | 非阻塞 |
| 反馈/循环 | 1.5px 曲线 | — | 迭代推理 |

这件事单独拎出来说，是因为常规画图工具里，箭头的样式是「你觉得好看就行」。但在复杂架构图里——比如一个同时包含同步调用、异步事件、记忆读写、LLM 反馈循环的 RAG 流程图——如果所有箭头长一个样，十分钟后你自己也看不懂了。

### 产品图标库

还有一个容易被忽略但很实用的功能：内置了 40+ 产品的品牌色图标。OpenAI、Anthropic、Pinecone、Weaviate、Kafka、PostgreSQL、Grafana、Kubernetes……不需要截图，不需要找 SVG icon 然后手动嵌入，直接说名字就行。

---

## 上手：一行命令，三个选择

安装比我预想的简单。一行：

```shell
npx skills add yizhiyanhua-ai/fireworks-tech-graph
```

然后选一个 PNG 渲染器（SVG 本身就是可用的，导出 PNG 才需要渲染器）：

```shell
# 推荐：cairosvg（CSS 支持最好，一行搞定）
pip install cairosvg

# 备选：rsvg-convert（系统包，可能丢 CSS / foreignObject）
brew install librsvg

# 最高保真：puppeteer（真实 Chromium，但占 150MB 空间）
npm install puppeteer
```

| 渲染器 | 质量 | 成本 | 场景 |
|--------|------|------|------|
| cairosvg | 好 | 一行 pip | 默认推荐 |
| rsvg-convert | 一般 | 系统包 | 没有 Python 环境 |
| puppeteer | 最好 | 150MB | 浏览器生成的 SVG 或像素级还原 |

更新也很直接：

```shell
npx skills add yizhiyanhua-ai/fireworks-tech-graph --force -g -y
```

---

## 别踩的坑

用了两周，踩了几个小坑，列出来给你省时间。

1. **npm 包名 ≠ skills add 的源名。** npm 上是 `@yizhiyanhua-ai/fireworks-tech-graph`，但 `skills add` 用的是 GitHub 路径 `yizhiyanhua-ai/fireworks-tech-graph`。别把 npm 包名直接粘进去，会报错。

2. **cairosvg 渲染的 CSS 支持最好，但复杂渐变可能丢。** 如果你用风格 5（玻璃态），渐变效果在 cairosvg 下基本 OK；但如果用 puppeteer 渲染，渐变还原度更高。取舍就是 150MB 磁盘 vs 像素级精度。

3. **风格 8（暗黑奢华）是 AI 手绘，结果不稳定。** 同样的 prompt 跑两次，出来的图可能不一样。不适合需要精确复现的场景（比如论文里的图），适合 Keynote 或官网首页那种「好看就行」的场景。

4. **中文字体渲染依赖系统。** SVG 用的是 `system-ui` 或 `Helvetica`，中文在 macOS 上默认走苹方，效果不错；在 Linux 服务器上可能回退到难看的衬线体。如果你在服务器上跑，建议用 puppeteer 渲染，它能正确加载系统字体。

5. **复杂的语义箭头组合可能出现标签重叠。** 这个问题在 8 种风格的边界测试里偶发——当一个节点同时有 data flow、control、async 三条箭头进出时，箭头标签可能挤在一起。目前的解法是拆分成分图，或者用 `style_overrides` 微调间距。

---

## 什么场景选什么风格

这可能是最实用的一段。不是每种图都适合所有风格，选错风格会让图看起来很别扭。

**写技术博客 / GitHub README：**
- 首选风格 2（暗黑极客风）。暗底 + Neon 配色在白色的文章页面里有天然的反差，等宽字体让代码和图放在一起不违和。
- 次选风格 1（扁平图标风）。如果你的博客是浅色主题，风格 1 的白色背景更自然。

**做 Keynote / 产品官网：**
- 风格 5（玻璃态卡片风）。磨砂玻璃质感的卡片在投影仪上比纯色方块有层次感，渐变底不会显得单调。
- 风格 8（暗黑奢华风）。如果你要做「发布会级别」的 Keynote，香槟金 + 深黑背景 + 衬线标题的组合，质感到位。

**写架构设计文档 / 工程规范：**
- 风格 3（工程蓝图风）。编号分区 + 网格底纹 + 青色描边 + 右下角 title block，有一种「这是正式文档」的仪式感。适合给 CTO 看。

**内部 Wiki / Notion / Confluence：**
- 风格 4（Notion 极简风）。白底、浅边框、单一强调色。不抢眼，不打扰阅读，信息密度刚好。

**Anthropic / Claude 生态的项目：**
- 风格 6（Claude 官方风格）。温暖奶油色背景（`#f8f6f3`），Anthropic 品牌配色。放在 Claude 相关的文章或文档里，视觉一致性非常好。

**OpenAI 生态的项目：**
- 风格 7（OpenAI 官方风格）。纯白极简，OpenAI 配色。适合 API 集成指南、模型对比图等场景。

**UML 图：**
- 类图、组件图、包图 → 风格 1 或 4（结构清晰）
- 序列图、时序图 → 风格 2（等宽字体对齐友好）
- 状态机图、活动图 → 风格 3（工程美学适合流程）
- 用例图、交互图 → 风格 1（色彩区分参与者）

一条土办法：不确定的时候，跑一遍风格 1 和风格 2，各导出一张 PNG，两张放在一起对比，花三十秒就能判断哪种更适合当前场景。比看文字描述靠谱得多。

---

## 触发词和基本用法

以下关键词会自动触发 Skill（不需要手动指定）：

```text
画图 / 帮我画 / 生成图 / 做个图 / 架构图 / 流程图 / 可视化一下 / 出图
generate diagram / draw diagram / create chart / visualize
```

几个常用例子：

```text
# 指定风格
画一张微服务架构图，风格2（暗黑极客风）

# 指定输出路径
生成 Mem0 架构图，输出到 ~/Desktop/

# 复杂场景
画一张 Agentic RAG 和普通 RAG 的对比图，用 Notion 极简风

# UML
画一张 OAuth2 授权码流程的序列图
```

---

## 文件结构一览

了解文件结构有助于排查问题或手动调整模板：

```text
fireworks-tech-graph/
├── SKILL.md                      # 主 Skill（图类型、布局规则、形状词汇）
├── README.zh.md                  # 中文文档
├── references/
│   ├── style-1-flat-icon.md      # 7 种模板风格定义文件
│   ├── style-2-dark-terminal.md
│   ├── style-3-blueprint.md
│   ├── style-4-notion-clean.md
│   ├── style-5-glassmorphism.md
│   ├── style-6-claude-official.md
│   ├── style-7-openai.md
│   └── icons.md                  # 40+ 产品图标 + 语义形状模板
├── fixtures/                     # 回归测试样本
├── scripts/                      # SVG 校验、PNG 导出、批量测试
├── templates/                    # 图类型模板（arch/data-flow 等）
└── assets/samples/               # 示例图 PNG
```

---

## 变更摘要（改了什么）

最核心的变动是开头和章节顺序。原文走的是标准 README 路线：先概述再展示效果图再列提示词样例，像一本工具说明书从头翻到尾。改写的版本删掉了所有 GitHub 外部图片引用——公众号加载不了 raw 链接——换成了一个具体的时间场景开头（「上周六凌晨两点」），然后沿着「这东西到底是什么 → 它跟别人有什么不一样 → 怎么用 → 容易踩什么坑」这条线往下走。这不是技术文档的写法，更像是你跟同事在茶水间介绍一个工具时的那种自然顺序。小标题全部重写了，原文的「功能特性」「安装」「使用方式」这类 README 标配标题被换成了口语化的短句和疑问句。每种风格不再贴图展示，而是用文字描述它最适合什么场景，顺便夹带了一些实际使用体感。

## 风险点（哪里可能翻车）

最大的风险是风格 8（暗黑奢华风）的不可复现性。它不像其他 7 种风格那样靠模板渲染，是 AI 手绘的，同一句 prompt 跑两次出来的图可能不一样。如果你用它生成论文插图或者需要精确版本控制的合规文档，大概率会翻车。第二个风险是 SVG 复杂度上限——当一张图里同时塞 15 个以上节点和 5 类语义箭头时，标签重叠是偶发问题，目前只能靠拆分子图或者手动微调 style_overrides 来解决，没有自动化方案。第三个坑是 `skills add --force` 更新会直接覆盖整个 skill 目录，如果你手动改过 `references/` 下的风格文件，更新前务必备份，不然就白改了。第四个是中文字体在 Linux 服务器上可能回退到难看的默认衬线体，macOS 上用苹方效果很好，但无桌面的服务器环境建议切到 puppeteer 渲染来规避。最后 cairosvg 对某些高级 CSS 特性（比如滤镜和 mix-blend-mode）支持有限，不过这只在你重度使用风格 5 的玻璃态效果时才会明显。

## 回滚方案（怎么撤）

如果更新后出图质量反而下降，最可靠的回退方式是 git clone 安装然后用 `git checkout` 回到之前的 commit。`skills add` 目前不支持指定版本号，所以想获得版本控制能力的话，从一开始就用 git clone 装。渲染器出问题比较容易处理，三个渲染器彼此独立：cairosvg 挂了直接用 rsvg-convert 顶上，两个都挂了还有 puppeteer 兜底，只要机器上装了 Node。如果某张 SVG 生成出来格式不对，仓库里自带了 `scripts/validate-svg.sh` 做语法校验，能帮你快速判断是模板文件的问题还是生成逻辑的问题，比自己肉眼排查快得多。

## 行动清单（读完怎么做）

最直接的一条：正在写公众号技术稿的你，现在就可以敲 `npx skills add yizhiyanhua-ai/fireworks-tech-graph` 装好，再 `pip install cairosvg`，然后跑一张风格 2 的图试试手感。如果主要做公司内部文档，优先试风格 4，白底极简在 Confluence 和 Notion 里最不违和。准备做技术分享 PPT 的话，用风格 5 的磨砂玻璃质感或者风格 8 的暗黑奢华风，导一张 1920px 的 PNG 贴进 Keynote，层次感比你自己手画强一个数量级。写 Anthropic 或 OpenAI 相关内容的时候直接用对应品牌风格，风格 6 和风格 7 分别匹配 Claude 和 OpenAI 的官方视觉语言，这种一致性是没办法用语言描述的「专业感」。最后画 UML 的时候先翻一眼上面的风格推荐，选对风格再跑，别跑完发现风格不对又重来。

## 推荐标签

`AI工具` `技术绘图` `架构图` `SVG` `Agent` `开源项目` `fireworks-tech-graph` `RAG` `Multi-Agent` `公众号配图`
