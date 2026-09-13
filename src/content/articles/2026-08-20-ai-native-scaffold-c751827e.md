---
title: "把 Claude Code 变成你的全栈交付团队：这个脚手架用 AI-Native 方法论重新定义了开发协作"
created: "2026-08-20"
published: true
---

在 Claude Code 里做项目，最大的痛不是 AI 写不出代码，而是**每次新开一个项目，都要重新搭一套 AI 协作体系**。CLAUDE.md 怎么配、Skill 怎么装、Agent 怎么设、记忆怎么跨会话保留——每换一个项目，这些都得重来一遍。

更麻烦的是，团队里每个人搭出来的还不一样。你配了三层 Agent，他只写了一个 CLAUDE.md。Review 代码的时候，AI 的行为完全不可预期。

**最近有个叫 AI Native 脚手架的开源项目，把这事儿做成了一套可分发、可升级的标准化模板。git subtree 一拉，你的项目就有了 CLAUDE.md + 22 个 Agent + 数十个 Skill + 跨会话记忆 + 角色体系，而且支持从脚手架远程一键升级。**

### 一句话结论

AI Native 脚手架是一套 Claude Code 的标准化协作模板。用 git subtree 接入项目后，自动获得完整的 AI 协作体系：CLAUDE.md 行为规则、Commands/Skills/Agents 三层扩展、跨会话记忆系统、AI-Native 角色体系，以及脚手架远程升级能力。适合团队标准化 AI 协作流程。

---

**核心亮点**

**1. Commands / Skills / Agents 三层体系，覆盖不同复杂度**

不是所有 AI 交互都需要同一个模式。脚手架把 AI 扩展能力分了三层：

- **Commands**：轻量心智命令，单个 `.md` 文件。快速触发单一任务，比如 `/switch-role` 切换角色视角、`/handoff` 保存进度
- **Skills**：复杂工作流，`SKILL.md` 可引用多个附属文件。适合多步骤、需要详细规则的任务，比如代码审查、TDD 工作流、架构设计
- **Agents**：后台独立运行的专家。只返回最终报告，不刷屏中间过程。适合大规模分析、全库扫描

| 特性 | Commands | Skills | Agents |
|------|----------|--------|--------|
| 复杂度 | 简单，一个文件 | 复杂，多文件工作流 | 专职同事，独立子任务 |
| 运行方式 | 主对话内执行 | 主对话内执行 | 后台独立运行 |
| 输出 | 内联输出 | 内联输出 | 只返回最终报告 |

**2. 4 个 AI-Native 角色，按"解决什么问题"划分岗位**

脚手架不按"前端/后端/运维"来分角色，而是按"解决什么问题"：

| 角色 | currentRole 值 | 说明 |
|------|---------------|------|
| 产品负责人 | `product-owner` | 需求策略、PRD、用户研究 |
| 交付工程师 | `delivery-engineer` | 端到端交付产品特性（含部署上线） |
| AI 工程师 | `ai-engineer` | Agent 编排、LLM 集成、AI 流水线 |
| 质量工程师 | `quality-engineer` | 全栈测试 + 安全 + 可靠性 |

同时保留传统角色映射（前端→delivery-engineer、后端→delivery-engineer、测试→quality-engineer），方便过渡期使用。

**3. 跨会话记忆系统：RAM（热） + ROM（冷）**

AI 最大的问题之一是不记得上次聊了什么。脚手架把记忆分成了两层：

- **RAM（动态上下文）**：`memory/` 目录下的 `active-task.md`（当前任务树）、`handoff.md`（跨会话交接信）、`project-facts.md`（踩坑经验）
- **ROM（固化知识库）**：`docs/` 目录下的 PRD、架构设计、测试用例、运维手册、各角色操作手册

RAM 由 AI 在后台自主维护，每次对话自动加载。ROM 是永久性知识库，按角色和模块组织。这种分区让 AI 既能"记住当前做到哪了"，也能"查阅项目的完整文档"。

**4. git subtree 分发 + 脚手架远程升级**

脚手架不走 npm，不走复制粘贴，而是用 `git subtree` 分发到多个项目：

```bash
# 接入脚手架
git subtree add --prefix .scaffold http://gitlab-iot.../med-ai-native-collaboration.git main --squash

# 升级脚手架
/scaffold-upgrade
```

升级时智能区分文件类型：

| 策略 | 路径 |
|------|------|
| 覆盖（脚手架拥有） | `.claude/rules/`、`.claude/agents/`、`scripts/` |
| 智能检测 | `CLAUDE.md`（冲突时提示 diff） |
| 永不覆盖 | `.claude/project-config.json`、`memory/` |

**5. 支持 AI 自动安装，全程 2 分钟**

在 Claude Code 中直接说一段话，AI 会自动完成接入：

```
我需要把 AI Native 脚手架接入当前项目。
脚手架 GitLab 地址：http://gitlab-iot...
当前项目是 Java Spring Boot 后端项目，我的角色是 delivery-engineer

请帮我：
1. 把脚手架以 git subtree 方式引入到 .scaffold/ 目录
2. 把 CLAUDE.md、.claude/、.agents/、docs/、memory/ 复制到项目根目录
3. 更新 .claude/project-config.json
4. 告诉我后续如何更新脚手架
```

**6. 集成 OMC 多智能体编排 + Autoresearch 自主迭代引擎**

脚手架内置了三个成熟的外部工具：

- **oh-my-claudecode**（v4.11.2）：多智能体编排系统，提供 `/deep-interview`、`/ralplan`、`/team`、`/autopilot`、`/ralph` 等命令
- **Autoresearch**：Karpathy 理念的自主目标驱动迭代引擎，提供 `/autoresearch`、`/autoresearch:plan`、`/autoresearch:fix`、`/autoresearch:ship` 等 9 个子命令
- **gstack**：虚拟工程团队工具

不是自己造轮子，而是把业界的成熟工具按统一接口集成进来。

**7. Git Sparse Checkout 支持：不同角色只拉自己关注的目录**

```bash
# 交付工程师（前端+后端+运维全覆盖）
git sparse-checkout set src ops docs memory

# 产品负责人
git sparse-checkout set docs/01_product docs/02_design memory

# 质量工程师
git sparse-checkout set tests docs/04_qa docs/03_architecture memory
```

**8. 无缝的角色切换机制**

脚手架设计了双轨角色切换：

- **隐式切换**：AI 默认以全栈通才身份运作。当读取到带职能域属性的任务描述（如 `[后端] 提供 User 接口`），AI 自动代入对应的技术栈经验
- **强指令覆盖**：执行 `/switch-role [角色名]` 强制锁定 AI 心智边界，从"温和的兜底通才"扭转为"挑剔的垂直专家"

---

**项目结构概览**

```bash
.
├── CLAUDE.md              # AI 行为总入口
├── .claude/               # AI 行为层
│   ├── rules/             # 核心准则（全局加载）
│   ├── commands/          # 斜杠命令
│   ├── agents/            # 专属 Agent（后台运行）
│   ├── skills/            # 技能工具箱
│   └── project-config.json
├── .agents/               # Agent 技能扩展
├── scripts/               # 脚手架工具脚本
├── memory/                # 跨会话记忆体（RAM）
│   ├── active-task.md
│   ├── handoff.md
│   └── project-facts.md
└── docs/                  # 固化知识库（ROM）
    ├── 00_AI_NATIVE_SOP.md
    ├── 01_product/
    ├── 02_design/
    ├── 03_architecture/
    ├── 04_qa/
    ├── 05_ops/
    └── 06_handbooks/
```

---

**安装方式**

**方式一（推荐）：让 Claude Code 自动完成接入**

打开项目，启动 Claude Code，把脚手架接入说明发给它，AI 会自动完成 git subtree 拉取、文件复制、配置初始化。全程约 2 分钟。

**方式二：手动接入**

```bash
# 指定脚手架 GitLab 地址
git subtree add --prefix .scaffold <脚手架仓库地址> main --squash
# 复制文件到项目根目录
cp -r .scaffold/CLAUDE.md .scaffold/.claude .scaffold/.agents .scaffold/docs .scaffold/memory .
# 更新配置
# 编辑 .claude/project-config.json
```

完整手动操作手册见项目文档 `docs/00_ai_system/scaffold-integration-manual.md`。

---

**一些注意事项**

**脚手架依赖 GitLab 分发。** 项目使用 git subtree 从 GitLab 仓库分发，如果不用 GitLab 或者团队没有自己的 GitLab 实例，需要自建脚手架仓库。

**Windows 用户注意软链接。** 脚手架依赖大量 symlinks 串联分散的 Skills。Windows 下 Git 默认会破坏 symlinks，需要在 `git clone` 后运行 `bash scripts/setup-skills.sh` 修复。

**适合已经使用 Claude Code 的团队。** 脚手架的核心价值是标准化 AI 协作流程，如果团队还没开始用 Claude Code，或者只是个人偶尔用一下，这个脚手架可能有点重。建议先跑通基础用法，再考虑搭脚手架。

**引用了大量外部工具。** OMC、Autoresearch、gstack 都是独立项目，脚手架把它们集成进来。如果某个工具后续不再维护，脚手架对应模块可能需要调整。

---

**写在最后**

AI Native 脚手架解决的不是"AI 写代码"的问题，而是"团队怎么用 AI 协作"的问题。

每个人自己搭一套 CLAUDE.md，团队里 AI 的行为不一致，这是当前很多 AI 辅助开发团队的现状。这个脚手架用 git subtree 分发 + 标准化角色 + 跨会话记忆 + 可升级能力，把"个人搭的 AI 配置"变成了"团队共享的 AI 基础设施"。

如果你团队在用 Claude Code 做项目，而且觉得"每个人搭的都不一样"是个问题，这个脚手架值得看看。

#ClaudeCode #AI脚手架 #多智能体 #工程化 #开源工具 #AI-Native #团队协作