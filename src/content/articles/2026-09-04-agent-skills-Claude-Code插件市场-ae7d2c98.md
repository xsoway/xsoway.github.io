---
title: "给 Claude Code 加两个 Agent Skill：装好 agent-skills，让它画架构图、自己造技能"
created: "2026-09-04"
published: true
---

# 给 Claude Code 加两个 Agent Skill：装好 agent-skills，让它画架构图、自己造技能

`agent-skills` 是一个面向 Claude Code 的 Agent Skills 插件市场仓库，目前放置了 2 个可用的技能：`draw-io`（依据指令生成 Draw.io 架构图）和 `skill-writer`（指导如何撰写一个规范、可自检的 Skill）。仓库以 MIT 协议开源。这篇文章拆开三件事：如何把它装进 Claude Code、装完之后两个技能各能干到什么程度、以及如何基于官方规范自己写一个最小 Skill 并跑一遍自检。全文只讲能照做的操作，命令统一取自项目原始说明，凡是未在本地实测的步骤都会单独标注。

```mermaid
flowchart LR
    A[安装 agent-skills] --> B[Claude 自动调用技能]
    B --> C[draw 技能 产出架构图XML]
    B --> D[skill-writer 指导写Skill]
    C --> E[diagrams.net 打开校验]
    D --> F[写frontmatter 做自检]
```

## 一、先把这个项目是什么讲清楚

这个仓库并不是围绕某一个具体功能，而是给 Claude Code 提供一个"技能分发站"。Claude Code 本身知道如何调用内置工具，但对特定领域缺乏做法沉淀（怎么画一张标注了 AWS/GCP 图标、带分组的架构图，怎么撰写一份合格的技能说明），`agent-skills` 就把这些知识整理成一个个 Skill 目录，装完后让 Claude 在遇到对应需求时自动激活。

它的价值主张可以概括成一句话：**把零散的"提示词 + 模板 + 规范"打包成能被 Agent 自动识别与调用的技能。** 项目结构里每个 Skill 由 `SKILL.md`（主指令）、可选的 `templates/`、`references/`、`scripts/`、`assets/` 组成，由 Claude Code 在合适的时机按需加载。

动手安装前先交代一个事实边界：仓库当前只含两个技能，规模都不大，与其说它是一个成熟生态，不如说它是一间 How to 教室搭一两个已经能用的示例。这一判断来自项目原始说明中的信息，不是实测得出的结论。

## 二、三种安装方式

`agent-skills` 提供了三条安装路径，按使用习惯任选其一。

**方式一：Claude Code 插件市场安装（官方推荐）。** 先把仓库注册为 Claude Code 的插件市场：

```bash
/plugin marketplace add alycd/agent-skills
```

再从市场安装插件：

```bash
/plugin install agent-skills@alycd-agent-skills
```

**方式二：整体复制技能目录。** 适合一次性把两个技能都装配好：

```bash
git clone https://github.com/alycd/agent-skills.git ~/agent-skills
cp -r ~/agent-skills/.claude/skills/* ~/.claude/skills/
```

**方式三：只安装单个 Skill。** 例如只想要画图的那一个：

```bash
mkdir -p ~/.claude/skills/draw-io
curl -L https://github.com/alycd/agent-skills/archive/main.tar.gz | \
  tar xz --strip=3 -C ~/.claude/skills/draw-io agent-skills-main/.claude/skills/draw-io
```

以上命令全部取自项目原始说明，此环境未实际执行，安装后的实际输出以真实环境为准。

按项目说明，技能安装完成后不依赖手动开关，只需重启 Claude Code 即可；随后以日常方式提出需求，Claude 会按上下文自动匹配并激活对应技能。

## 三、完整案例：让 draw 技能画一张图并校验

下面按"问题 → 输入 → 实现方式 → 文件结构 → 校验与边界"的链路走一遍完整案例。

**问题。** 项目中需要一张标注了组件类型的系统架构图，但不想手动画坐标和连线。

**输入。** 一句自然语言描述。项目文档给出的示例是：

```
"Create a diagram: API -> Load Balancer -> App Server -> Database"
```

**实现方式。** 该技能拿到请求后按四步工作：

1. 解析请求里的流程：谁连接到谁，哪些组件应放入同一个分组容器（用 `[x, y, z]` 形式表达），哪些是从一点扇出到多点。
2. 确定布局：线性流程横向排列，分支流程纵向拉开，计算每个框体的坐标与间距。
3. 选图标：按组件类型匹配 `mxgraph.gcp2.hexIcon` 中的图标，AWS 用色 `#FF9900`，GCP 用色 `#5184F3`。
4. 生成 `mxGraphModel` 的 XML，将 `background="#ffffff"` 写入模型属性，并保存为 `.drawio.xml` 文件。

**文件结构。** 生成的 XML 骨架大致如下（示意，字段沿用官方模板）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" agent="Claude Code" version="28.1.2">
  <diagram id="unique-id" name="Page-1">
    <mxGraphModel dx="1554" dy="797" grid="1" gridSize="10" guides="1"
                  tooltips="1" connect="1" arrows="1" fold="1" page="1"
                  pageScale="1" pageWidth="1400" pageHeight="900"
                  background="#ffffff" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="title-bar" value="Architecture: ..." />
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

**校验方法。** 生成的文件可用浏览器打开 `https://app.diagrams.net` 导入校验；导入后确认组件、连线、分组与配色渲染正常。此步骤此环境未实测，以下为基于项目文档的判断。

**边界。** 该技能生成的框体遵循一套统一约定：最小盒子 `150x70`，分组内盒最小 `90x60`，图标占用 `44x39`，对结构化流程图的生成效率很高、结果贴合需求；但需要二次精调坐标或排查框体重叠时，仍需打开编辑器手动调整。它覆盖 AWS/GCP 风格的图标，并不保证覆盖第三方全部图标。

## 四、自己写一个最小 Skill

`skill-writer` 承担的是"把怎么写 Skill 变成一套可照做的规范"。核心是 `SKILL.md` 的 frontmatter 与正文结构。

frontmatter 必填字段是 `name` 和 `description`：

```yaml
---
name: my-demo-skill
description: 处理 CSV 文件并生成汇总。当用户要求分析表格或处理 .csv 文件时使用。
---
```

`name` 只能使用小写字母、数字、连字符，长度不超过 64 个字符，且必须与目录名一致；`description` 不超过 1024 字符，需同时写清"这个技能做什么"和"何时该用它"。可选字段 `allowed-tools` 用于限定技能可用工具，适合只读型或安全敏感型技能：

```yaml
---
name: code-comprender
description: 只读分析代码。用于 code review、理解项目结构。
allowed-tools: Read, Grep, Glob
---
```

写完并保存之后，按官方清单自检：

- 目录名与 frontmatter 里的 `name` 是否一致
- frontmatter 首行与末行是否各为一行 `---`，YAML 是否有 tab、缩进是否正确
- `description` 是否同时含"负责什么"和"何时调用"
- 正文是否为面向 Claude 的分步指令，而不是面向人的说明
- 是否附带具体示例，依赖是否写清

自检通过后重启 Claude Code，再提出一句与描述匹配的请求，观察技能是否命中。以上两则示例是根据技能规范组合出的方案，并非在本环境创建并实测激活，这一点需要单独说明。

## 五、使用时的边界

几点值得直接交底：

- **它不是一套万能的画图插件。** 它能处理"流程 + 分组 + 分支"这类结构化图画需求，依赖 `mxGraphModel` 的 XML 约定；要做更复杂的自定义样式，仍需手动修改。
- **它教的是一套技能规范，而非某种模型专属能力。** 写出的技能是否符合标准，以当前 Agent 能否识别为准；这套规范并不能保证在别的平台自动命中。
- **仓库目录目前只有两个 Skill，依赖需求恰好对得上。** 更通用的用法是把这份仓库当"如何造技能"的示范，而不是当成现成的完备工具集。

## 六、下一步

按顺序完成三件事就能把项目用起来：先挑一种方式安装好；再给 Claude 一句自然语言让其生成架构图并丢到 `diagrams.net` 校验；最后按 `skill-writer` 规范写一个频繁使用的小技能并跑一遍自检清单。把"装、用、造"三个动作走一遍，就算真正把项目吃透了。



#ClaudeCode #AgentSkills #插件市场 #Drawio #自动化