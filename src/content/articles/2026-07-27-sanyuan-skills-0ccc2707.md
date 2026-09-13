---
title: "2026-07-27-sanyuan-skills"
created: "2026-07-27"
tags: ["GitHub","AI-Agent","Claude-Code","Cursor","Skill","开源项目","技术分享"]
category: "技术分享"
published: true
---

# 6 个 Skill，把 AI Agent 终端变成真正的"专家"——三元 Skills 开源项目实测

用 AI Agent 写代码、做 Code Review、学新知识，听起来很爽。但实际操作过的都知道，**Agent 终端的能力上限，取决于你给它喂的"说明书"有多精确。**

你有没有遇到过这种情况：让 Claude Code 做代码审查，它给你泛泛来几句"这个函数可以优化一下"；让它教一个新框架，它要么长篇大论讲概念，要么直接跳过你需要的细节。Agent 不是不想帮你，而是它手里的"人设"太模糊了。

最近有人在 GitHub 上开源了一个项目，专门解决这个问题。

**sanyuan-skills，一套面向 Claude Code 和其他 AI Agent 终端的"生产级 Skill 集合"。** 目前 6 个 Skill，覆盖代码审查、AI 教学、Skill 质量审计、Skill 创建、知识库编译、读书辅导——每个都带着完整的检查清单、参考文档和工作流，装上去就能用。


它不是教你"怎么写 Skill"，而是直接给你 6 个**写好的、可执行的、带完整参考文档的生产级 Skill**，安装后直接在 Agent 终端用 `/` 命令调用，相当于给你的 AI 助手装上了"专家模块"。

### 1. 覆盖了 Agent 使用中最常见的"痛点场景"

6 个 Skill 不是随便拼的，看下来基本覆盖了开发者日常最需要 AI 帮忙但最常翻车的几个场景：

- **Code Review Expert**：代码审查，但带结构——不是泛泛的"看看代码"，而是从 SOLID 原则、安全漏洞、性能瓶颈、边界条件、死代码清理五个维度做结构化审查
- **Sigma**：1对1 AI 辅导，基于 Bloom 的"2-Sigma 效应"——这是教育学里一个经典结论：一对一辅导 + 掌握式学习，学生成绩可以比传统课堂高出两个标准差
- **Skill Review**：对已有 Skill 做质量审计——检查结构、描述、工作流、Token 效率、反模式
- **Skill Forge**：教你创建高质量 Skill，包含 12 种实战技巧
- **Wiki Ingest**：把文章、笔记编译成结构化 Wiki 知识库
- **Book Study**：读书辅导教练，带知识编译、苏格拉底式提问、间隔重复、跨书查询

这 6 个里，**Code Review Expert 和 Sigma 是最实用的两个**，一个解决"代码质量怎么把关"，一个解决"新知识怎么学"。后面的 Skill Forge 和 Skill Review 更像"元技能"——适合想自己写 Skill 的人。

### 2. Code Review Expert：不是"扫一眼"，是结构化的五层审查

这个 Skill 是我最看好的一个。它把代码审查拆成了**完整的七步流程**：

```
Preflight → SOLID + 架构 → 死代码检测 → 安全扫描 → 代码质量 → 分级输出 → 确认修复
```

重点是**输出分级**，这是很多团队做 Code Review 时自己都没搞清楚的：

| 级别 | 名称 | 行动要求 |
|------|------|----------|
| P0 | Critical | 必须拦截合并 |
| P1 | High | 合并且修复 |
| P2 | Medium | 修复或创建跟进 |
| P3 | Low | 可选改进 |

每一级都有对应的检查清单，不是空话。项目文档里附带了 4 份参考文档：

- **solid-checklist.md**：SOLID 违规 + 常见代码异味
- **security-checklist.md**：OWASP 风险、竞态条件、加密、供应链安全
- **code-quality-checklist.md**：错误处理、缓存、N+1 查询、空安全
- **removal-plan.md**：安全删除 vs 延迟删除，带回滚方案

**实际协作示例：** 我在自己的工作流里试过类似思路——把 Code Review Expert 的参考清单导入到 OpenClaw 的 Code Review 流程中，用它的 P0-P3 分级标准来给 AI 生成的审查结果排序。效果是：AI 不再说"这个代码可以优化"这种废话，而是直接告诉你"这个函数违反了 SRP 原则，建议拆分，优先级 P1"。

### 3. Sigma：不只是"AI 家教"，它有正经的认知科学方法论

Sigma 这个 Skill 的名字来自 Bloom 的"2-Sigma 效应"。它不是一个简单的问答机器人，而是**把 7 条经过验证的认知科学原理直接编进了工作流**：

| 原理 | 来源 | 在 Sigma 里的实现 |
|------|------|-------------------|
| Bloom's 2-Sigma | Bloom 1984 | 一对一辅导 + 掌握式门控，≥80% 才过关 |
| 苏格拉底法 | 古典 | 只提问，不讲课 |
| 间隔重复 | Ebbinghaus 1885, SM-2 | 已掌握的概念在恢复会话时逐步增加间隔 |
| 交错练习 | Rohrer & Taylor 2007 | 把旧概念混入当前问题流，提升 43% 记忆保留 |
| 误解拆解 | Vosniadou 2013, Chi 2005 | 用反例法拆解错误心智模型 |
| 刻意练习 | Ericsson 1993 | 标记"掌握"前必须做动手任务 |
| 元认知校准 | Bjork 1994 | 自我评估校准，检测"流畅错觉" |

**它不会直接告诉你答案。** 每次学习都从诊断性问题开始，把主题拆成 5-15 个原子概念，按依赖关系排序，然后生成一个可视化的 HTML 学习路径图。每个概念的教学流程是：

1. 用问题引入，不是讲课
2. 交替使用选择题、开放题和交错练习
3. 答错时诊断背后的错误心智模型，设计反例来拆解它
4. 答对时追问更难的后续问题
5. 3-5 轮后做校准掌握度检查（rubric 评分 + 自评校准）
6. 最后做动手练习，跨越"知道"和"做到"之间的鸿沟

**实际协作示例：** 我把 Sigma 的会话持久化机制接入到 OpenClaw 的 daily review 流程中，每次学习新概念后自动生成 session 摘要，后续的 daily 周报可以直接引用。这个组合让"学新东西 → 沉淀成笔记 → 周报复盘"形成了一条闭环，不再学完就忘。

### 4. Skill Forge：12 条"实战技巧"，不是理论

如果你已经用过 AI Agent 终端，可能自己写过简单的 Skill（就是一个 SKILL.md 文件）。但写出来的东西经常**不稳定、触发不准、输出飘忽**。

Skill Forge 给的 12 条技巧，每一招都对应一个具体问题：

| 技巧 | 解决什么问题 |
|------|------------|
| 渐进式加载 | 上下文膨胀——SKILL.md 保持精简，按需加载详情 |
| 关键词轰炸 | Skill 触发不准——写能匹配用户意图的描述 |
| 工作流检查清单 | 执行不一致——给模型可追踪的路径，带 ⚠️/⛔ 标记 |
| 脚本封装 | Token 浪费——把确定性操作封装成脚本，零上下文成本 |
| 提问式指令 | 输出模糊——用具体问题代替抽象指令 |
| 确认门控 | 模型跑飞——关键操作前强制暂停 |
| 交付前检查清单 | 质量缺口——加可验证的检查项 |
| 参数系统 | 不够灵活——支持 --flags、部分执行、--quick 模式 |
| 引用组织 | 加载无关上下文——按领域组织，只加载需要的 |
| CLI + Skill 模式 | MCP 开销——用 CLI 工具替代 MCP Server |
| 铁律 | 模型走捷径——设一条模型永远不能违反的规则 |
| 反模式文档 | 默认 AI 行为——明确列出不能做的事 |

这一条值得单独拎出来说：**"铁律"（Iron Law）**。它的思路是，在 SKILL.md 里写一条"模型无论如何都不能违反的规则"，比如"永远不要替用户执行任何删除操作，必须先问"。这比你写十条"建议"有效得多。

### 5. 安装成本极低，一键装完

所有 Skill 都通过 `npx skills` 安装，不需要手动下载文件、不需要配置路径、不需要改环境变量。单条安装命令：

```
npx skills add sanyuan0704/sanyuan-skills --path skills/code-review-expert
```

装完后直接在终端里用 `/` 命令调用：

```
/code-review-expert              # 审查当前 Git 变更
/sigma Python decorators         # 开始辅导
/skill-review                    # 审计已有 Skill
/skill-forge                     # 创建新 Skill
/wiki-ingest                     # 编译 Wiki
/book-study <书名>               # 开始读书辅导
```

### 6. 兼容多个 Agent 终端，不只是 Claude Code

项目文档明确写了兼容性：**Claude Code / Cursor / Trae / CodeX / Windsurf** 等。这意味着你不需要为每个工具写一套独立的 Skill，装一次就能跨终端用。

### 安装

先安装你想用的 Skill。比如装 Code Review Expert：

```
npx skills add sanyuan0704/sanyuan-skills --path skills/code-review-expert
```

装 Sigma 辅导工具：

```
npx skills add sanyuan0704/sanyuan-skills --path skills/sigma
```

装 Skill Forge：

```
npx skills add sanyuan0704/sanyuan-skills --path skills/skill-forge
```

### 使用

装完后在 Agent 终端里直接输入命令：

```
/code-review-expert
```

它会自动审查你当前的 Git 变更，输出分级结果。

```
/sigma Python decorators
```

启动 Python 装饰器的一对一辅导。

```
/sigma 量子力学 --level beginner
```

Sigma 支持中文主题，直接输入中文主题名就行。

```
/sigma linear algebra --resume
```

恢复上次的线性代数学习会话。

### 命令速查

| 命令 | 用途 | 说明 |
|------|------|------|
| `/code-review-expert` | 代码审查 | 审查当前 Git 变更，输出 P0-P3 分级 |
| `/sigma <主题>` | AI 辅导 | 可加 `--level`、`--lang`、`--resume` 参数 |
| `/skill-review` | Skill 审计 | 检查已有 Skill 的质量 |
| `/skill-forge` | 创建 Skill | 交互式引导，从需求到打包 |
| `/wiki-ingest` | 编译 Wiki | 把文章/笔记编译成知识库 |
| `/book-study <书名>` | 读书辅导 | 带间隔重复和跨书查询 |



**sanyuan-skills 不是那种"装完就放那吃灰"的项目。**

Code Review Expert 和 Sigma 这两个 Skill 是真正能立刻用起来的——Code Review Expert 解决了"AI 审查太水"的问题，Sigma 解决了"AI 教学太笼统"的问题。而 Skill Forge 和 Skill Review 更适合那些已经在写 Skill、想提升质量的人。


如果你已经在用 Claude Code 或 Cursor，强烈建议至少装一个 Code Review Expert 试试。审查结果比默认的"随便看看"强太多了。

---

**项目地址：** [github.com/sanyuan0704/sanyuan-skills](https://github.com/sanyuan0704/sanyuan-skills)

**安装命令（装全部 Skill）：**
```
npx skills add sanyuan0704/sanyuan-skills --path skills/code-review-expert
npx skills add sanyuan0704/sanyuan-skills --path skills/sigma
npx skills add sanyuan0704/sanyuan-skills --path skills/skill-review
npx skills add sanyuan0704/sanyuan-skills --path skills/skill-forge
npx skills add sanyuan0704/sanyuan-skills --path skills/wiki-ingest
npx skills add sanyuan0704/sanyuan-skills --path skills/book-study
```



#GitHub #AI-Agent #ClaudeCode #Cursor #开源项目 #CodeReview #AI教学 #Skill #开发者工具