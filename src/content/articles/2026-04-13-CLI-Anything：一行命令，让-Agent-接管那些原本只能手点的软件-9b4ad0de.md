---
title: "2026-04-13-CLI-Anything：一行命令，让-Agent-接管那些原本只能手点的软件"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
![](./2026-03-14-CLI-Anything：一行命令，让 Agent 接管那些原本只能手点的软件-v1-cover.svg)

# CLI-Anything：一行命令，让 Agent 接管那些原本只能手点的软件

昨天刷到这个项目的时候，我第一反应其实挺俗：又来一个“让 Agent 接管一切”的大词项目。

结果往下看了 README，味道不太一样。
它不是在教你再造一个玩具版软件，也不是让你继续折腾脆得要死的 GUI 自动化，而是想干一件更狠、更实用的事：**把现成的软件，直接变成 Agent 能稳定调用的 CLI。**

如果你也有过这种经历——想让 AI 用 Blender、GIMP、LibreOffice、OBS、Draw.io 干活，结果最后不是点像素崩了，就是 API 不全、功能残废，那这个项目你大概率会看得很上头。

---

## 这个项目是干嘛的（一句话）

CLI-Anything 想做的事很直接：给任意软件自动生成一套结构化 CLI，让 OpenClaw、Claude Code、OpenCode、Codex 这类 Agent 不用碰 GUI，也能把真实软件当工具来调。

它的核心态度很明确：**不是重写软件，不是做缩水版，而是把真实软件原样接进 Agent 工作流。**

---

## 它到底解决了什么问题

现在 Agent 和真实软件之间一直隔着一层很恶心的东西。

一种路子是 GUI 自动化。问题是这玩意儿像在给一个机器人蒙着眼点电梯按钮，今天能点中，明天窗口挪了两像素就寄了。另一种路子是官方 API，但很多专业软件根本没那么完整的 API，或者有 API 也只覆盖了最浅的一层。第三种更常见：社区自己重写一个“Agent 友好版”，结果功能直接阉掉 80%。

CLI-Anything 的思路是绕开这些烂路。它认为 CLI 才是人类和 Agent 的共通接口：结构化、可组合、有 `--help`、可输出 JSON，而且天然适合被 LLM 串成工作流。

这在实际中意味着什么？意味着你不用再让 Agent 截图、点按钮、猜像素。它拿到的是命令、参数、状态和结构化输出。说白了，就是从“瞎摸”升级到“拿钥匙进门”。

---

## 核心功能亮点

### 一条 7 阶段流水线，把 GUI 软件变成 CLI
README 里最核心的能力，就是那条完整流水线：分析、设计、实现、测试规划、编写测试、文档、发布。

这在实际里有啥用？不是只帮你“生成个脚手架”，而是连命令设计、测试、发布都打包进去，尽量把“从想法到可用工具”这条线做完整。

### 直接对接真实软件后端，不做玩具替代品
比如 Blender 用 `bpy`，LibreOffice 走 ODF + headless LibreOffice，OBS 走 `obs-websocket`，Shotcut/Kdenlive 走 MLT XML。

这在实际里意味着：你不是在用一个“长得像 Blender 的小玩具”，而是真的把 Blender 本体请进来干活。这个差别很大，前者是 demo，后者才有生产味。

### Agent 原生输出：支持 `--json`
每个 CLI 都强调结构化输出，Agent 可以直接消费，同时又保留人类可读格式。

这在实际里有啥用？少写一堆胶水解析代码，少喂模型重复解释“你把这段表格转成 JSON”。Agent 和工具之间的沟通成本会低很多。

### 统一的 REPL 与交互体验
项目里专门做了统一的 REPL 界面（repl_skin.py），所有生成的 CLI 使用体验尽量一致。

这在实际里意味着：不是每生成一个 CLI，你就得重新适应一套命令习惯。统一体验这件事，看着不性感，但它是真省脑子。

### 生产级测试不是嘴上说说
README 里给了 1,508 项测试，覆盖 11 款软件，包括单元测试、端到端测试、真实后端验证、CLI 子进程测试。

这在实际里有啥用？至少项目在态度上不是“先糊出来再吹”。它知道 Agent 工具最怕的不是不会生成，而是生成出来根本不敢用。

---

## 快速开始

### Claude Code

```bash
# 添加 CLI-Anything 插件市场
/plugin marketplace add HKUDS/CLI-Anything
```

```bash
# 从市场安装 cli-anything 插件
/plugin install cli-anything
```

```bash
# /cli-anything:cli-anything <软件路径或仓库地址>
# 为 GIMP 生成完整的 CLI（7 个阶段全自动）
/cli-anything:cli-anything ./gimp

# 注意：如果你的 Claude Code 版本低于 2.x，请使用 "/cli-anything"。
```

```bash
# 全面优化 — Agent 分析所有功能的覆盖差距
/cli-anything:refine ./gimp

# 定向优化 — 指定特定功能领域
/cli-anything:refine ./gimp "我需要更多图像批处理和滤镜相关的 CLI"
```

### OpenCode（实验性支持）

```bash
# 克隆仓库
git clone https://github.com/HKUDS/CLI-Anything.git

# 全局安装（所有项目可用）
cp CLI-Anything/opencode-commands/*.md ~/.config/opencode/commands/
cp CLI-Anything/cli-anything-plugin/HARNESS.md ~/.config/opencode/commands/

# 或项目级安装
cp CLI-Anything/opencode-commands/*.md .opencode/commands/
cp CLI-Anything/cli-anything-plugin/HARNESS.md .opencode/commands/
```

```bash
# 为 GIMP 生成完整的 CLI（7 个阶段全自动）
/cli-anything ./gimp

# 从 GitHub 仓库构建
/cli-anything https://github.com/blender/blender
```

```bash
# 全面优化 — Agent 分析所有功能的覆盖差距
/cli-anything-refine ./gimp

# 定向优化 — 指定特定功能领域
/cli-anything-refine ./gimp "批处理和滤镜"
```

### Qodercli

```bash
git clone https://github.com/HKUDS/CLI-Anything.git
bash CLI-Anything/qoder-plugin/setup-qodercli.sh
```

```bash
/cli-anything:cli-anything ./gimp
/cli-anything:refine ./gimp "批处理和滤镜"
/cli-anything:validate ./gimp
```

### Codex（实验性）

```bash
# 克隆仓库
git clone https://github.com/HKUDS/CLI-Anything.git

# 安装 skill
bash CLI-Anything/codex-skill/scripts/install.sh
```

```powershell
.\CLI-Anything\codex-skill\scripts\install.ps1
```

```text
Use CLI-Anything to build a harness for ./gimp
Use CLI-Anything to refine ./shotcut for picture-in-picture workflows
Use CLI-Anything to validate ./libreoffice
```

### 生成后的 CLI 怎么用

```bash
# 安装到 PATH
cd gimp/agent-harness && pip install -e .

# 随处可用
cli-anything-gimp --help
cli-anything-gimp project new --width 1920 --height 1080 -o poster.json
cli-anything-gimp --json layer add -n "Background" --type solid --color "#1a1a2e"

# 进入交互式 REPL
cli-anything-gimp
```

---

## 关键用法 / 示例

这个项目最让我觉得“有点东西”的地方，是它没把自己只讲成一个插件，而是把平台接入讲得很完整。

你可以在 Claude Code 里直接 `/cli-anything:cli-anything ./gimp`，也可以在 OpenCode 里通过命令目录接进去，还能在 Codex 里通过安装 skill 之后直接用自然语言发任务。也就是说，它不是押注某一个 Agent 平台，而是想把“把软件变成 CLI”这套方法论，变成跨 Agent 的通用层。

README 里还列了很多目标软件类型：创意工具、办公工具、视频会议、图表、AI/ML 平台、开发工具、科学计算工具。这种覆盖面看着挺吓人，但它背后的逻辑是统一的：**只要有代码库，只要能找到真实后端或可控接口，它就想办法把它包成 CLI。**

---

## 使用感受（不官方版）

我第一眼最喜欢的不是“支持 11 款软件”，而是它对“真实软件集成”这件事的执念。这个方向是对的，因为 Agent 真要进生产，最怕的就是玩具实现。

但我也得泼点冷水：这玩意儿很猛，不代表它适合所有人。你要是连目标软件的后端能力、依赖、运行环境都没摸清，就想一把梭让 Agent 接管，那最后大概率不是自动化，是自动翻车。

还有一点很真实：项目把测试、REPL、JSON 输出、包结构、平台接入都做得很完整，这说明它更像一个“认真工程项目”，不是单纯的 README 炫技仓库。这是优点，也是门槛。

---

## 适合哪些人用

- 已经在用 OpenClaw、Claude Code、OpenCode、Codex 这类 Agent 工具，想让它们真正接管软件的人
- 需要把 GUI 软件接入自动化工作流，但又受够了截图点击流的人
- 有一堆零散 API / SDK / 软件后端，想统一收口成一个结构化 CLI 的团队
- 做内容生产、设计、剪辑、办公自动化，想让 AI 真正调专业软件的人
- 愿意接受“先搭底座，再谈爽感”的工程党

---

## 注意事项 / 坑点

README 里其实已经把几个关键边界写得很明显了。

第一，环境要求不低。你得有 Python 3.10+，目标软件得先装好。别指望它凭空帮你生出 Blender、LibreOffice 或 GIMP。

第二，Windows 下 Claude Code 走 `bash`，如果没有 Git for Windows 或 WSL，可能会直接撞上 `cygpath: command not found` 这种坑。这个不是项目特有的锅，但你会在这儿踩得很实。

第三，它虽然号称“一行命令”，但背后实际上是完整 7 阶段流水线。换句话说，这不是一把瑞士军刀随手掏出来就完事，它更像在你家后院搭了个小工厂。工厂当然很猛，但也不是所有人都需要开工厂。

第四，README 里展示了很多真实软件后端接入方式，这既是亮点，也是边界。后端缺失、真实软件不可用时，它不会 magically 帮你兜底。项目自己写得很硬：真实软件是硬性要求，没有兜底，没有降级。说难听点，这东西不陪你演戏。

---

## 一句话总结

**CLI-Anything 最值钱的地方，不是“又让 Agent 多会了一点”，而是它试图把“真实软件接入 Agent”这件事，从脆弱的截图点击，拉回到可测试、可组合、可维护的工程接口。**



---

#GitHub #CLIAnything #Agent #OpenClaw #ClaudeCode #OpenCode #Codex #自动化 #工程化

