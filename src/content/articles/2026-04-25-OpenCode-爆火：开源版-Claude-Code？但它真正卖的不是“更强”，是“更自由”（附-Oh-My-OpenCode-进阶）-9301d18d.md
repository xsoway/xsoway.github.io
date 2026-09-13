---
title: "2026-04-25-OpenCode-爆火：开源版-Claude-Code？但它真正卖的不是“更强”，是“更自由”（附-Oh-My-OpenCode-进阶）"
created: "2026-04-25"
tags: ["/init","/undo + /redo","1）安装","2）启动（建议在干净 Git 仓库）","2）常用快捷键","3）初始化项目（必做）","75+ LLM Provider","@文件/目录","AI","Agent","OpenClaw"]
category: "Wiki"
published: true
---
# OpenCode 爆火：开源版 Claude Code？但它真正卖的不是“更强”，是“更自由”（附 Oh-My-OpenCode 进阶）

Cursor、Copilot 这种东西大家都懂——  
它们的存在意义，就是让你在写代码的时候少掉点头发。

但最近有个开源工具突然很火：**OpenCode**。

你可能听过别人怎么吹：开源、Agent、全平台、能跑测试、能改代码……  
这些都对，但我更想用一句话把它讲明白：

> **OpenCode 不是“又一个 AI IDE”，它更像一个能干活的工程同事——前提是你别把自己送进“模型锁死”的生态监狱。**

这篇我会按最实用的方式带你过一遍：桌面端、IDE 插件、TUI、CLI、Zen 推荐模型，以及进阶玩法 Oh-My-OpenCode。  
不讲玄学，只讲怎么用、值不值、适合谁。

- --

## 一、OpenCode 是什么？为什么突然爆火？

先给它一个不容易踩坑的定义：

> **OpenCode = 开源、隐私优先、可定制的 AI Coding Agent。**

注意是 **Agent**，不是“补全器”。

它能用的姿势也很丰富（这点对打工人很重要）：

- ✅ 桌面端 App（适合不想折腾的人）
- ✅ 终端 TUI（适合把鼠标当敌人的人）
- ✅ CLI 命令行（适合自动化玩家）
- ✅ IDE 插件（VS Code / Cursor / Windsurf / VSCodium）

更关键的是它背后的设计逻辑：

> **Agent + 权限 + 工具**  
> 先把“能做什么、不能做什么”说清楚，再让 AI 下手。

这跟很多 AI IDE 的思路不一样：  
它们通常是“先写了再说”，写错了你去擦屁股。

- --

### 1）OpenCode 为什么这阵子特别火？

如果你是一路用过来的老用户，路径大概率是这样的：

> Copilot（真香） → Claude/ChatGPT（更香） → Cursor/Claude Code（香到飞起）

然后你会慢慢发现一个非常现实的问题：

> **当某个工具开始越来越封闭，你就不再是用户了，你是生态里的一棵韭菜。**

尤其是那种“不能方便切模型”的趋势，对工程党属于危险信号：

- 你未来的工作模式会被锁死  
- Agent 的可用性会被模型策略限制  
- 你会被强制绑定某一个生态（并且还得笑着付费）

而 OpenCode 之所以能火，不是因为它“秒天秒地”，而是因为它提供了一个更底层的东西：

- ✅ 不限制模型（你想用谁就用谁）
- ✅ 完全开源（核心逻辑可审计）
- ✅ 工程化工作流（不是玩具）
- ✅ 兼容 Claude Skills / Claude.md（能继承生态）
- ✅ 支持本地部署（隐私敏感团队狂喜）

- --

## 二、OpenCode 最核心的优势：开源 + 多模型 + 多形态

OpenCode 的魅力在于“你怎么用都行”。

### 1）多模型支持：选择权回到你手里

它支持 **75+ LLM Provider**，包括但不限于：

- Anthropic Claude
- OpenAI
- GitHub Copilot
- Google Gemini
- OpenRouter
- 智谱 GLM / 通义等国产模型
- 以及本地部署（Ollama、LM Studio）

这意味着什么？

> 你可以按“预算/效果/隐私”三件事来选模型，而不是按“厂商脾气”选。

而且 OpenCode 还内置了一些免费模型，适合你先体验手感：

- GPT-5 Nano  
- Big Pickle  
- GLM-4.7  
- Grok Code Fast 1  
- MiniMax M2.1  

- 官网：<https://opencode.ai/>
- Provider 说明：<https://opencode.ai/docs/providers>

- --

## 三、桌面端：最适合“先别折腾，先用起来”的人

如果你讨厌环境配置、讨厌终端、讨厌折腾——  
桌面端就是你的救命稻草。

### 1）下载安装
去下载页按系统装就行：  
👉 <https://opencode.ai/download>

- --

### 2）选模型，导入项目，开始工作
导入你的仓库，底部选个模型，就能让它开始干活。

- --

### 3）丢一个真实需求，看它能不能落地
比如我给它一个浏览器插件需求：

> **右键菜单支持一键提取页面所有图片，并下载保存到用户选择的本地文件夹**

它做完之后你能看到改了哪些文件、改了什么内容。  
你用 Git 的话，直接在终端管理变更就行。

- --

### 4）它和 Cursor/传统 IDE 的区别
桌面端不主打“你自己写代码”，它更像：

- Cursor 的 Agent 模式（纯对话驱动）
- Claude Code 的可视化外壳

你关注的不是“代码怎么写”，而是：

> **“我要它做什么事”**

这对非技术同学其实更友好——  
因为少了一堆 IDE 的按钮恐惧。

- --

## 四、桌面端进阶：@ 引用、/ 命令、上下文、Plan/Build

OpenCode 之所以更像“工程工具”，核心就在这些细节。

### 1）@ 引用：把 AI 的注意力关进笼子里
终端 Agent 最大问题就是：  
* *它太爱脑补，还爱越界。**

所以你要学会用 `@文件/目录` 控制上下文，比如：

- `@src/service/order_service.go` 帮我分析并发问题  
- `@docs/xxx.md` 帮我提炼规则

一句话：  
> 你不限制它，它就会用“想象力”来回报你。

- --

### 2）/ 命令：效率党的最爱
常见命令（记住就能少走弯路）：

- `/init` 生成 `AGENTS.md`（项目说明书）
- `/review` review 代码变更
- `/new` 新会话
- `/open` 搜索打开文件
- `/terminal` 显示/隐藏终端
- `/model` 切换模型
- `/agent` 切换 Agent
- `/mcp` 开关 MCP
- `/undo` 撤销上一步
- `/compact` 压缩上下文

- --

### 3）上下文面板：让你知道“钱花哪了”
你可以看到 token、cost、上下文限制等信息。  
这点非常重要，因为很多人用 AI 的第一反应是：

> “怎么又花钱了？”  
> “我也不知道，但它就是花了。”

- --

### 4）文件预览：只读，但够用
右侧能打开文件看内容，但通常只能预览，不能直接编辑。  
它更像一个“工作台”，不是 IDE 本体。

- --

### 5）Plan / Build：减少返工的救命机制
这是 OpenCode 的精髓。

- **Plan Mode：只规划，只读**（不让它乱动）
- **Build Mode：真执行，真改代码**（开始干活）

官方推荐流程我非常认可：

1. 先在 Plan 下描述需求 → 让 AI 输出步骤、风险点、涉及文件  
2. 你确认没问题 → Tab 切到 Build  
3. 你一句 “Go ahead” → 它开始落地执行

一句话总结：

> **先让 AI “讲清楚它要干嘛”，再让它 “真的去干”。**

- --

## 五、IDE 插件：把 OpenCode 接进 VS Code / Cursor

OpenCode 也有插件形态，适合“我在 IDE 里读代码，让它去执行”的人。

支持：

- VS Code
- Cursor
- Windsurf
- VSCodium

官方：<https://opencode.ai/docs/ide/>

### 1）安装
插件市场搜 OpenCode 安装即可。

然后在 IDE 终端输入：

```bash
opencode
```

### **2）常用快捷键**

- Tab：切换 Agent
- Ctrl + P：选择命令执行

- -----

## **六、TUI：终端党最爱的“纯粹快乐”**

如果你相信“鼠标会降低效率”，那 TUI 会让你上瘾。

官方：https://opencode.ai/docs/tui/

### **1）安装**

macOS / Linux 一把梭：

```
curl -fsSL https://opencode.ai/install | bash
```

Node 用户：

```
npm install -g opencode-ai
```

### **2）启动（建议在干净 Git 仓库）**

```
cd your-project
opencode
```

### **3）初始化项目（必做）**

```
opencode init
```

它会生成 AGENTS.md ——你可以把它理解成：

> **“给 AI 的项目说明书”**

> 没它，AI 就容易装懂。

- -----

## **七、Zen：官方精选模型（新手少踩坑）**

Zen 是官方维护的一套“经过测试的模型组合”。

官方：https://opencode.ai/docs/zen/

使用方式很直接：

1. 打开 https://opencode.ai/zen 创建 API Key
2. OpenCode 里 Ctrl + P → Connect provider
3. 选择 OpenCode Zen
4. 粘贴 Key 完事

它解决的核心问题是：

> **你不用在一堆模型里试错到怀疑人生。**

- -----

## **八、CLI：自动化玩家的快乐源泉**

官方：https://opencode.ai/docs/cli/

常用命令：

```
opencode run "fix lint errors"
opencode serve
opencode web
opencode stats
```

适用场景：

- Git hooks 自动生成 commit message
- PR 自动 review
- CI 里生成改进建议
- 自动化文档/注释生成

一句话：

> 你可以把 OpenCode 当对话工具，也可以把它当“流水线上的一个工位”。

- -----

## **九、10 个高频技巧（真的能省时间）**

1. **在干净 Git 仓库里跑**（否则你会哭）
2. **第一步永远** **/init**（AGENTS.md 是灵魂）
3. 记住 4 个必背命令：/connect /models /new /compact
4. **/undo + /redo**：AI 改偏了别吵，直接撤
5. **@文件/目录**：控制范围，少脑补
6. **Plan → Build**：先讲计划再干活，返工少一半
7. **创建专用 Agent**：review/test/security 各司其职
8. **权限控制**：企业团队必备（git push 之类必须 ask）
9. **非交互模式**：适合脚本化（CI/Hook/批处理）
10. **IDE 快捷打开**：macOS Cmd+Esc / Win-Linux Ctrl+Esc

- -----

## **十、Oh-My-OpenCode：让你拥有“AI 开发团队”**

一个 Agent 很强，但多人协作更强。

Oh-My-OpenCode 的思路就是把 AI 做成“团队”：

- Sisyphus 主智能体（强执行）
- Oracle（设计/调试）
- 前端工程师
- Librarian（文档/代码库探索）
- LSP/AST 工具链等

### **✅ 安装前准备**

- Node.js >= 18
- Bun 或 npm（推荐 Bun）
- OpenCode >= 1.0.150

检查版本：

```
opencode --version
```

### **🚀 安装**

```
bunx oh-my-opencode install
# 或
npx oh-my-opencode install
```

### **🔥 魔法关键词：ultrawork**

你在 prompt 里带上 ultrawork（或 ulw），它就会进入“持续推进直到完成”的模式。

示例：

> 使用 ultrawork 模式重构我的 React 组件，优化性能并添加 TypeScript 类型定义。

- -----

## **十一、适合谁？不适合谁？**

### **✅ 强烈推荐**

- 全栈开发者：上下文跨前后端的痛，只有全栈懂
- DevOps/运维：CLI 自动化就是快乐
- 隐私敏感团队：本地模型、代码不出门

### **⚠️ 不太适合**

- 强依赖 IDE 逐行编辑体验、需要你手动精修的场景

  （这类 Cursor 依然更顺）

我的结论是：

> **OpenCode 更像跨平台“工程 Agent 基座”，Cursor/IDE 更像“写代码的手”。**

> 不是替代关系，是互补关系。

- -----

## **总结：OpenCode 不只是“写代码”，而是“能把活干掉”**

OpenCode 更像一个能理解上下文并执行系统级任务的 DevOps 伙伴。

我的建议：

- ✅ 新手先从 **OpenCode Zen** 上手，少踩坑
- ✅ 熟悉 TUI 后，你会发现效率真的会起飞
- ✅ 想要“AI 团队协作”，就上 **Oh-My-OpenCode**

- -----

## **推荐标签**

\#AI编程 #OpenCode #Cursor #ClaudeCode #AIAgent #开源工具 #终端效率 #TUI #CLI #工程化 #多模型 #本地模型 #DevOps #全栈开发 #代码重构 #效率工具 #提示词 #工作流 #LSP #MCP

- -----

