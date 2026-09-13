---
title: "92 个实验、10 章正文、全开源：这本 AI Agent 书把工程细节全摊开了"
created: "2026-07-28"
published: true
---

# 92 个实验、10 章正文、全开源：这本 AI Agent 书把工程细节全摊开了

> 市面上讲 AI Agent 的文章不少，但大部分要么是概念科普，要么是某个框架的用法教程。
> 很少有人真正把 Agent 从原理到工程实战拆成 10 章，再配上 92 个可运行的实验。
> 更少见的是——全书正文、配图、代码全部开源，还免费提供 PDF/EPUB 下载。

---

先问你一个问题：你心里的 AI Agent 到底是什么？

如果你脑子里冒出来的是一堆"感知-决策-执行"、"智能体协作"、"自主规划"这种大词，那说明你看到的 Agent 文章，大部分还停留在概念层。

但如果你真的动手搭过 Agent，你会发现最痛的几个问题：

- 上下文窗口到底怎么用才算"工程化"？不是往里塞 prompt 就行
- 工具调用怎么做到"让 Agent 主动发现工具"，而不是你写死三个函数？
- 评估怎么做？你说 Agent 表现好，证据在哪？有没有统计显著性？
- 模型后训练什么时候该选 SFT，什么时候该选 RL？区别在哪？

这些问题，概念科普文不会讲，框架文档也只会给你一个"加个 tool 参数"的用法。

最近有人把这些事儿全摊开写成了一本书。

**bojieli/ai-agent-book**，一本 10 章正文、92 个配套实验（70+ 可独立运行）的 AI Agent 开源电子书。全书正文、配图、代码全部开源，支持 8 种语言，免费下载 PDF/EPUB，也支持在线阅读。


这本书围绕 `Agent = LLM + 上下文 + 工具` 这个核心公式，从上下文工程、工具调用、代码生成到评估、模型后训练、多 Agent 协作，把 Agent 从原理到工程实战拆成 10 章，每章配可运行实验。适合已经会调 API、想真正理解 Agent 怎么做工程的开发者。



**1、十章结构，从基础到生产，层层递进**

全书不是零散文章的合集，而是有明确递进关系的完整体系：

| 章 | 主题 | 一句话核心 |
|---|---|---|
| 1 | Agent 基础知识 | Agent = LLM + 上下文 + 工具；Harness 工程才是竞争力 |
| 2 | 上下文工程 | 上下文决定能力上限：KV Cache、提示工程、Agent Skills、上下文压缩 |
| 3 | 用户记忆和知识库 | 跨会话记住用户、接入外部知识：用户记忆、RAG、结构化索引、知识图谱 |
| 4 | 工具 | 工具是 Agent 的双手：MCP 协议、感知/执行/协作三类工具、事件驱动异步 Agent、主动工具发现 |
| 5 | Coding Agent 与代码生成 | 代码是「能创造新工具的工具」，生产级 Coding Agent 全景 |
| 6 | Agent 的评估 | 把表现变成可比较信号：评估环境、指标、统计显著性、评估驱动选型 |
| 7 | 模型后训练 | 预训练/SFT/RL 三阶段：何时选 SFT、何时选 RL，工具调用内化、样本效率 |
| 8 | Agent 的持续进化 | 从运行轨迹获得学习信号，更新知识、指令、程序与参数 |
| 9 | 多模态与实时交互 | 从文本扩展到语音、GUI、物理世界：语音三范式、Computer Use、机器人 |
| 10 | 多 Agent 协作 | 群体智能高于个体：协作框架、上下文共享/隔离、涌现的「Agent 社会」 |

注意第 2 章到第 4 章的编排——不是"先讲 LLM 再讲工具"这种传统顺序，而是**上下文工程 → 用户记忆和知识库 → 工具**。这个顺序有道理：上下文决定了 Agent 的能力上限，记忆和知识库让 Agent 能跨会话积累，工具让 Agent 能干实事。三章连起来，就是 Agent 的"大脑 → 记忆 → 双手"。

**2、92 个配套实验，70+ 可独立运行**

这不是一本"读完就忘"的书。每章都配了数量不等的可运行项目：

- 第 1 章：4 个项目
- 第 2 章：9 个项目
- 第 3 章：13 个项目
- 第 4 章：7 个项目
- 第 5 章：12 个项目
- 第 6 章：11 个项目
- 第 7 章：16 个项目
- 第 8 章：8 个项目
- 第 9 章：7 个项目
- 第 10 章：7 个项目

第 7 章（模型后训练）的 16 个项目是全书最多的——从用 MiniMind 从零训 LLM、用 MiniMind-V 从零训 VLM，到 AdaptThink、AWorld、SFTvsRL 等训练框架的实验。如果你对模型训练感兴趣，这一章可以直接当实操手册用。

**3、MCP 协议 + 三类工具分类 + 主动工具发现**

第 4 章的工具部分，不是简单讲"怎么给 Agent 加个 tool 参数"，而是把工具分成了**感知、执行、协作**三类，覆盖了 MCP 协议（Model Context Protocol）、事件驱动异步 Agent、以及 Agent 如何主动发现工具。

这个分类在工作场景里很实用——比如"感知工具"（读文件、查数据库）和"执行工具"（发邮件、部署代码）分开管理，权限策略可以做得更细。

**4、评估不是选个指标就完事，第 6 章讲统计显著性**

Agent 评估是很多团队忽略的环节。第 6 章不是只给几个 benchmark 的名字，而是讲了评估环境搭建、指标设计、**统计显著性检验**，以及如何用评估驱动模型选型。

配套的 11 个项目中包括了 AndroidWorld、GAIA、OSWorld、SWE-bench、tau2-bench、terminal-bench 等主流评测基准的集成。

**5、模型后训练：SFT 和 RL 到底怎么选**

第 7 章可能是全书"工程价值"最高的一章。它把预训练、SFT、RL 三个阶段讲清楚，重点回答了"什么时候该选 SFT，什么时候该选 RL"这个实际问题。

16 个实验涵盖了从零训 LLM（MiniMind）、从零训 VLM（MiniMind-V）、到 AdaptThink、AWorld、SFTvsRL、verl、RLVP 等训练框架。如果你在纠结"我的 Agent 要不要用 RL 微调一下"，这一章的内容可以直接帮你做决策。

**6、多模态：语音三范式 + Computer Use + 机器人**

第 9 章不只是讲"多模态 = 看图说话"，而是覆盖了三个真实场景：

- 语音交互：语音三范式（语音转文本、语音到语音、语音原生模型）
- Computer Use：Agent 直接操作 GUI
- 机器人：从仿真到真实硬件（SO-100 机械臂）

配套实验包括 browser-use（浏览器自动化）、claude-quickstarts（Anthropic 官方示例）、以及需要 SO-100 机械臂的真实硬件实验。

**7、多 Agent 协作：从上下文共享/隔离到涌现的「Agent 社会」**

第 10 章讲的是"群体智能高于个体"——不是简单堆多个 Agent，而是讲协作框架设计、上下文共享与隔离策略、以及如何设计能让 Agent 之间自然涌现协作行为的机制。

配套实验包括 TalkAct（双 Agent 架构，已独立为 [19PINE-AI/TalkAct](https://github.com/19PINE-AI/TalkAct)）和斯坦福 AI 小镇。

**8、8 种语言，PDF/EPUB/在线阅读全支持**

这是一个很"国际化"的项目。除了中文原版，还有社区贡献的英文、阿拉伯语、正体中文、俄语、泰米尔语、越南语、日语版本。PDF 和 EPUB 都可以直接下载，在线阅读支持多语言切换、章节折叠、全文搜索。


### 下载

最简单的方式，直接下载 PDF 或 EPUB：

**中文（原版）：**
- [PDF](https://github.com/bojieli/ai-agent-book/releases/download/latest/AI-Agents-in-Depth-zh-CN.pdf)
- [EPUB](https://github.com/bojieli/ai-agent-book/releases/download/latest/AI-Agents-in-Depth-zh-CN.epub)

**英文（社区翻译）：**
- [PDF](https://github.com/bojieli/ai-agent-book/releases/download/latest/AI-Agents-in-Depth-en.pdf)
- [EPUB](https://github.com/bojieli/ai-agent-book/releases/download/latest/AI-Agents-in-Depth-en.epub)

也可以直接[在线阅读](https://bojieli.github.io/ai-agent-book/)。

### 拉取配套代码

```bash
git clone https://github.com/bojieli/ai-agent-book.git
cd ai-agent-book
```

### 拉取外部仓库（第 6、7、9、10 章需要）

部分评测基准、训练框架和机器人平台需要单独克隆：

```bash
# 第 6 章 · 评测基准
git clone https://github.com/google-research/android_world.git chapter6/android_world
git clone https://huggingface.co/datasets/gaia-benchmark/GAIA chapter6/GAIA
git clone https://github.com/xlang-ai/OSWorld.git chapter6/OSWorld
git clone https://github.com/SWE-bench/SWE-bench.git chapter6/SWE-bench
git clone https://github.com/sierra-research/tau2-bench.git chapter6/tau2-bench
git clone https://github.com/laude-institute/terminal-bench.git chapter6/terminal-bench

# 第 7 章 · 训练框架
git clone https://github.com/bojieli/minimind.git chapter7/MiniMind-pretrain/minimind
git clone https://github.com/bojieli/minimind-v.git chapter7/MiniMind-pretrain/minimind-v
git clone https://github.com/bojieli/AdaptThink.git chapter7/AdaptThink-original
git clone https://github.com/bojieli/AWorld.git chapter7/AWorld
git clone https://github.com/bojieli/SFTvsRL.git chapter7/SFTvsRL
git clone https://github.com/bojieli/verl.git chapter7/verl
git clone https://github.com/thinking-machines-lab/tinker-cookbook.git chapter7/tinker-cookbook
git clone https://github.com/19PINE-AI/rlvp.git chapter7/RLVP/rlvp
git clone https://github.com/PRIME-RL/SimpleVLA-RL.git chapter7/SimpleVLA-RL/SimpleVLA-RL

# 第 9 章 · 浏览器自动化与 Claude 示例
git clone https://github.com/browser-use/browser-use.git chapter9/browser-use
git clone https://github.com/anthropics/claude-quickstarts.git chapter9/claude-quickstarts

# 第 10 章 · 双 Agent 架构 + 斯坦福 AI 小镇
git clone https://github.com/19PINE-AI/TalkAct.git chapter10/use-computer-while-calling
git clone https://github.com/joonspk-research/generative_agents.git chapter10/generative_agents
```

### 命令速查

| 阶段 | 命令 | 用途 |
|---|---|---|
| 下载 | `git clone https://github.com/bojieli/ai-agent-book.git` | 拉取全书代码 |
| 在线阅读 | 访问 `https://bojieli.github.io/ai-agent-book/` | 浏览器直接阅读 |
| 离线阅读 | 下载 Releases 中的 PDF/EPUB | 排版最佳，适合离线 |
| 编译 PDF | `cd book && bash build_pdf.sh` | 需 pandoc + xelatex + ElegantBook |
| 构建 EPUB | 见 `EPUB.md` | 统一脚本生成多语言 EPUB |

### 推荐学习路径

建议先读 README 中的[学习建议](https://github.com/bojieli/ai-agent-book/blob/main/docs/zh-CN/LEARNING.md)，里面有核心理念、学习路径、难度分级和实践建议。

大概的顺序是：第 1 章（基础）→ 第 2-4 章（上下文 + 记忆 + 工具，核心三件套）→ 第 5 章（Coding Agent）→ 第 6 章（评估）→ 第 7 章（模型后训练）→ 第 8-10 章（进化、多模态、多 Agent）。



这本书在 GitHub 上已经积累了相当可观的热度，每天都有自动更新的 Star 历史图。但我想说的是，**它的价值不在于"火"，而在于"全"和"实"**。

市面上能同时覆盖上下文工程、工具调用（含 MCP）、评估（含统计显著性）、模型后训练（含 SFT 和 RL 的实操对比）、多模态、多 Agent 协作，并且每个章节都配了可运行实验的 Agent 资源，目前确实不多见。

**适用边界：**

- 最适合：已经会调 API、想深入理解 Agent 工程原理的开发者
- 也适合：正在做 Agent 选型/评估/训练的技术决策者
- 不太适合：完全没接触过 LLM 调用、只想看概念科普的读者
- 需要留意：第 6、7、9、10 章的部分评测基准和训练框架需要单独克隆外部仓库，不是"git clone 完就能跑"的
- 硬件门槛：第 9 章的机器人实验（SO-100 机械臂）需要真实硬件，纯软件读者只能看仿真部分

**需要注意的几点：**

- 英文/阿拉伯语等版本是社区翻译的，可能滞后于中文原版
- 部分实验标注为"📝 读者练习"，需要你基于已有代码自行改造复用
- 第 7 章的训练框架有些是作者适配的分支（bojieli/*），并非原版仓库

---

#AI #Agent #开源书籍 #LLM #MCP #RAG #多模态 #多Agent #模型训练 #评估 #CodingAgent #ComputerUse #知识图谱 #SFT #RL