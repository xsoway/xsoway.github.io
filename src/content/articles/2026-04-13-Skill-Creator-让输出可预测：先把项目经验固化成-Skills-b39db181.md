---
title: "Skill Creator 让输出可预测：先把项目经验固化成 Skills"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
> 图片资源未同步：未命名图片

# Skill Creator 让输出可预测：先把项目经验固化成 Skills

AI 写代码这事，最烦的不是“写不出来”。
最烦的是：写得挺快，**但像喝了两杯浓缩之后开始自由创作**。

- 目录结构说改就改
- 依赖说加就加
- 接口没对齐就开跑
- 改完一堆文件，最后一句“应该可以了”

这不是模型不聪明。
是项目里的那套默认规矩（目录约定、禁用依赖、验收口径），从来没被显式写给它。

**Skill Creator 的定位很清楚：不是写代码，是立军规。**
把“人类项目经验”写成可执行的约束，让 AI 进仓库以后别乱加戏。

---

## 0）先把话说死：Skill Creator 解决的是什么

一句话：

> **Skill Creator 用来约束 AI 行为，让它更像项目成员，而不是临时外包。**

它解决的不是“能力”，而是“边界”：

- 能做什么 / 不能做什么
- 什么时候算完成
- 产物要怎么验收

项目里 AI 一旦开始越界（乱改结构、擅自换技术栈、凭空优化架构），就该上 Skill。

---

## 1）工具装上只是开始（以 Claude Code 为例）

```bash
npx skills add ComposioHQ/awesome-claude-skills --skill skill-creator
```

你会看到类似：

```text
.claude/
  └── skills/
        └── skill-creator/
              └── SKILL.md
```

注意：这只是“能跑”。
效果来自后面那套**基于项目现实**的 Skills。

---

## 2）别先写 Skill：先扫项目，别靠想象

最常见的翻车姿势：

- 看到仓库就默认全栈
- 看到一个 server 目录就开始重构分层
- 看到 package.json 就开始装库

正确路线只有一句：

> **Skill 必须服从项目现实，不允许反客为主。**

所以第一步永远是扫描：目录结构、已有代码风格、已有脚本与约束，确认到底有哪些组件真的存在。

---

## 3）MVP Skill 组合（按需，不强制全家桶）

一个常见的最小集合像这样：

```text
.claude/
  └── skills/
        ├── product-design.skill
        ├── frontend-dev.skill
        ├── backend-dev.skill
        ├── api-contract.skill
        ├── testing.skill
        └── deployment.skill
```

但别机械照抄：

- 纯前端项目：`frontend-dev / testing / deployment` 可能就够
- 没后端：`backend-dev / api-contract` 直接跳过
- 工具库：部署 skill 可能不该出现

Skill 的精髓是“保守边界 + 按需生成”。

---

## 4）职责怎么切？（工程视角，别让 AI 自己发明岗位）

### 4.1 product-design.skill：只管把需求讲清楚

做：功能拆解、模块边界、业务口径。

不做：写代码、做视觉设计。

目的：避免 AI 上来先“顺手设计一套系统”。

### 4.2 frontend-dev.skill：只在现有前端里改，不改规矩

做：按既有目录与组件风格实现需求。

禁：

- 禁止新增依赖
- 禁止修改构建/打包配置
- 禁止整体重构路径
- 禁止大改 CSS 架构

一句话：只交付需求，不交付“优化冲动”。

### 4.3 backend-dev.skill：补业务逻辑，不动地基

做：按既有架构/ORM 实现后端逻辑与 API。

禁：换框架、改整体架构、擅自改 DB 结构。

### 4.4 api-contract.skill：接口合约先行，所有实现照着来

只输出接口定义：请求/响应/错误约定/字段边界。

不写实现。

意义：前后端别各写各的，最后互相对喷。

### 4.5 testing.skill：把“完成标准”写成硬条件

做：

- 测什么/不测什么
- 怎么测（步骤/用例/可执行说明）
- 通过条件是什么

它不是为了立刻补齐全套测试。
它是为了让交付可验证：别再“感觉 ok”。

### 4.6 deployment.skill：告诉 AI 怎么把东西跑起来

做：启动命令、环境变量、常见故障排查。

不做：复杂运维方案、架构升级建议。

目标：交付别卡在“怎么启动”。

---

## 5）实战流程：先立规矩，再让它干活

这套顺序写死，最稳：

1. 新项目/老项目要引入 AI
2. 先用 Skill Creator 扫描并生成 Skills
3. 再让 AI 写代码 / 改代码 / 修 bug

效果一般会很明显：

- 不再乱改结构
- 不再擅自加技术栈
- 输出开始可预测、可验证

---

## 6）元 Prompt（可直接复制）：三步把 Skills 自动生成

下面这段就是“元 Prompt”的核心：**先扫描 → 再按需生成 → 最后汇总用法**。

> 使用方式：把项目根目录放进 Claude Code 上下文，然后把这段 Prompt 原封不动贴进去运行。

---

### 📦 元 Prompt：Skill Creator 自动生成项目级 Skills

```text
You are now running Skill Creator for a full-stack project with code access.

Step 1: Scan the entire project directory structure and code files.
Identify which of the following project components truly exist:
- Frontend code (e.g., React/Vue/Svelte)
- Backend service (e.g., Node/Python/Go/Java)
- API definitions or usage
- Test suite or test skeletons
- Deployment configs (Docker, CI/CD, shell scripts)

Output a JSON scan result like:
{
  "hasFrontend": bool,
  "hasBackend": bool,
  "hasAPIs": bool,
  "hasTests": bool,
  "hasDeployment": bool
}

Do NOT assume anything — derive from real files.

----

Step 2: Based on scan results ONLY generate the necessary Skill tasks.
For each Skill you generate, produce the complete directory and SKILL.md content
in the correct Claude Code format.

1) If product requirements exist (e.g., requirements doc, README with feature list),
   generate product-design.skill/ with:
   - a clear high-level feature breakdown
   - definitions of modules & boundaries
   - no code

2) If hasFrontend is true: Generate frontend-dev.skill/ with:
   - rules to follow existing dir structure
   - stylistic conventions based on existing code
   - forbidden actions (no new libs, no config changes)
   - examples of valid code changes

3) If hasBackend is true: Generate backend-dev.skill/ with:
   - backend logic implementation rules
   - prohibited architectural changes
   - how to handle errors & validation

4) If hasAPIs is true: Generate api-contract.skill/ with:
   - clear API interface definitions
   - request/response formats
   - error codes and boundary cases

5) If hasTests is true: Generate testing.skill/ with:
   - test scopes
   - what to test
   - pass/fail criteria

6) If hasDeployment is true: Generate deployment.skill/ with:
   - start commands
   - environment variables
   - common failure fixes

For each Skill:
- Create .claude/skills/<skill-name>/SKILL.md
- Include a name, description, instructions, and concrete examples
- Keep instructions conservative and aligned with existing project patterns
- Do NOT add any tool access beyond core textual guidance

Format the final output as a list of file trees and SKILL.md contents.

----

Step 3: After generating all Skills, produce a final summary:
- What Skills were created
- What each Skill enforces as constraints
- One example invocation for Claude Code to invoke a Skill (e.g., /frontend-dev)
```

---

## 7）为什么这段 Prompt 这么写（别把 AI 当通用劳务）

### 7.1 先扫描再行动：不让 Skill 生成“空气规则”

很多 Skill 写得像宣誓词，落地全靠想象。
扫描这一步的意义是：**只根据真实文件得出结论**。

- 有就生成
- 没有就跳过
- 不靠猜

### 7.2 禁止清单要硬：别用“建议”糊弄

“尽量不要新增依赖”这种话，等于没说。

要写成能否决的规则：

- 禁止新增依赖
- 禁止修改构建配置
- 禁止架构级重构

AI 才会收手。

### 7.3 按需生成：减少冗余，减少误触发

Skill 太多会带来两个副作用：

- 模型匹配成本上升
- 容易把不存在的流程硬塞进来

所以只生成项目真的有的那几块。

### 7.4 每个 Skill 必须给示例：让边界“可见”

规则写得再严，没有例子也容易走样。
示例的作用是把“允许/禁止”具象化。

---

## 8）使用方式：生成完怎么调用

当 Skills 落到项目的 `.claude/skills/` 目录后，就可以在 Claude Code 里用 slash 调用：

- `/frontend-dev`
- `/api-contract`
- `/testing`

从那一刻开始，AI 才是在“项目规章制度”里干活。

---

## 9）AI 不会凭空变乖，只会被规矩驯化

想要 AI 变成队友，靠的不是玄学提示词。
靠的是：把隐性经验写成明确边界，把完成标准写成可验证条件。

Skill Creator 做的事就这么朴素：

- 把规矩写出来
- 让规矩能被执行
- 让交付能被验收

剩下的，才轮到写代码。

---



#AI编程 #ClaudeCode #Agent #SkillCreator #工程化 #软件开发
