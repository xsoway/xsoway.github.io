---
title: "Claude Code 装好了，然后呢？这个中文开源教程给出了一条学习路线"
created: "2026-10-27"
tags: ["KnowledgeBase","ClaudeCode","Skills","测试开发","Workflow"]
category: "公众号文章"
published: true
---

# Claude Code 装好了，然后呢？这个中文开源教程给出了一条学习路线

Claude Code 已经装好，也能让它解释代码、改个函数。换一个项目，团队规范又得重新交代；换一个任务，审查要求还得再贴一遍。

接着会碰到一串名字：Skills、Hooks、MCP、Subagents。每个词都能搜到解释，轮到一个具体任务，还是不知道该用哪个。

**claude-howto 是一份开源的 Claude Code 学习指南，提供中文教程、配置模板和按难度推进的学习路线。** 它适合解决的，正是安装完成之后这段不知道往哪走的空档。

## 查功能、跟教程、拿模板，是三种不同需求

学习 Claude Code，常见入口可以这样选。这里比较的是资料用途，不是模型能力或效果排名。

| 入口 | 适合解决的问题 | 怎么使用 |
|---|---|---|
| Claude Code 官方文档 | 某个功能现在怎样配置、参数是什么意思 | 带着具体问题查对应章节 |
| claude-howto 中文学习路线 | 功能太多，不知道先学哪项 | 按起点选择路线，跟着模块练习 |
| claude-howto 仓库内的模板 | 已经有任务，想看命令或 Skill 怎么写 | 读模板内容，再按项目情况修改 |

官方文档与社区教程可以搭配使用。比如，仓库把 Slash Commands 和 Skills 分开讲；[官方当前的 Skills 文档](https://code.claude.com/docs/en/skills)则说明，自定义命令已经合并进 Skills，原有 `.claude/commands/` 文件仍能使用。阅读教程时保留这种对应关系，就不用把两个目录误认成两套互不相干的功能。

## 仓库里有什么，分别拿来做什么

[中文 README](https://github.com/luongnv89/claude-howto/blob/main/zh/README.md)列出了 10 个主题模块。读这些目录，可以先记住各自对应的动作。

- `01-slash-commands/`：把重复指令写成文件，用 `/命令名` 调用。
- `02-memory/`：用 `CLAUDE.md` 等文件交代项目背景和约定，减少反复说明。
- `03-skills/`：把一项任务的做法、参考资料和脚本放在一起，供 Claude 使用。
- `04-subagents/`：介绍专门分工的 AI 助手。
- `05-mcp/`：介绍连接外部工具的协议，比如怎样接入 GitHub 等服务。
- `06-hooks/`：介绍在指定事件发生时执行检查或其他动作。
- `07-plugins/`：介绍怎样把多项配置打包分发。
- 其余三个模块覆盖 Checkpoints、进阶功能和命令行用法，涉及会话恢复、规划、权限及脚本调用。

这是一份教程和模板集合，并非安装之后就会自动接管研发工作的独立软件。

它有几个可以直接打开的文件。比如 [`optimize.md`](https://github.com/luongnv89/claude-howto/blob/main/01-slash-commands/optimize.md)，要求 Claude 按性能瓶颈、资源释放、算法、缓存、并发问题检查代码，并给出严重程度、代码位置、解释和修复示例。

[`code-review-specialist/SKILL.md`](https://github.com/luongnv89/claude-howto/blob/main/03-skills/code-review-specialist/SKILL.md)则覆盖安全、性能、代码质量和维护性，还引用了配套检查清单、问题记录模板与分析脚本。两者的差别，打开文件就能看到：一个集中描述性能审查要求，另一个把较完整的审查材料组织在一个目录里。

## 先试一个命令模板

[学习路线图](https://github.com/luongnv89/claude-howto/blob/main/zh/LEARNING-ROADMAP.md)提供了自查问题：是否用过项目记忆、创建过 Skill、配置过 Hooks，是否尝试过命令行脚本调用。已经掌握的部分可以跳过，不必按目录编号从头刷到尾。

初次尝试，可以只看一个命令模板。中文 README 给出的快速上手操作包括：

```bash
git clone https://github.com/luongnv89/claude-howto.git
cd claude-howto
mkdir -p /path/to/your-project/.claude/commands
cp 01-slash-commands/optimize.md /path/to/your-project/.claude/commands/
```

来源：中文 README 的“15 分钟快速上手”。其中 `/path/to/your-project` 要替换成自己的项目路径。随后在目标项目中启动 Claude Code，输入 `/optimize`，并提供要审查的代码范围。

这些是仓库提供的操作说明，本次未安装、运行该项目，也没有实测审查结果。

另一个适合学习的文件是 [`project-CLAUDE.md`](https://github.com/luongnv89/claude-howto/blob/main/02-memory/project-CLAUDE.md)。它用电商项目举例，包含技术栈、架构文档引用、测试要求和常用命令。使用时应填入真实项目的信息，已有 `CLAUDE.md` 就合并需要的内容，不直接覆盖。模板里的团队联系人、测试命令和技术栈，也都只是示例。

## 模拟案例：审查一个预约看车接口

**以下是根据仓库模板设计的业务模拟示例，不代表仓库自带预约功能，也不代表实际运行结果。**

假设二手车 App 增加了预约看车功能。用户选择车辆与时间段后提交预约，测试人员希望审查接口实现，找出需要补测的地方。

任务可以明确为：读取预约接口及相关代码，提出有依据的审查意见和测试建议，暂不修改文件。

### 把业务规则放在代码前面

如果只提交“检查有没有问题”，Claude 能看到实现，却未必知道预约业务的约定。模拟输入需要同时交代规则和代码范围：

```text
模拟示例：预约接口审查输入

业务约定：
- 同一用户对同一车辆、同一时间段重复提交，只生成一条有效预约。
- 用户只能查询、取消自己的预约。
- 手机号不得明文写入日志。

审查材料：
- 预约接口说明与本次代码变更
- 创建、查询、取消预约的实现
- 数据库约束及已有测试

任务要求：
只读审查，不修改文件。
每条问题给出代码位置、触发条件、影响和建议补充的测试。
缺少材料时列出缺失项，不把猜测写成已确认缺陷。
```

这些业务规则来自本例的设计，不能当作所有预约系统的默认规则。真实项目需要用实际接口说明替换。

### 用审查 Skill 检查，用性能命令补一个角度

仓库的代码审查 Skill 已经列出鉴权、数据暴露、敏感信息日志、数据库查询、并发等检查方向。可以先阅读它的检查清单，再将这个模拟任务交给 Claude。

对应到预约业务，审查时需要沿着具体实现找证据：查询接口如何确认预约所属用户，日志里是否出现手机号，重复请求怎样被处理，数据库是否有配合应用逻辑的约束。

如果预约列表出现了逐条查询车辆详情的实现，再使用 `/optimize` 聚焦性能问题。无需为了一个接口把 Hooks、MCP、Subagents 全接上；本例用到的只有项目说明与审查指令。

这里也有一个容易混淆的地方：仓库的分析脚本用于收集代码指标，不会自动证明重复预约、越权取消等业务行为正确。相关结论仍需要测试验证。

### 预期产物要能回到代码和测试

本例希望得到两类材料：有代码依据的问题记录，以及尚待执行的测试清单。可以按下面的格式约定报告：

```text
模拟示例：单条审查记录格式

问题：待审查后填写，不预设缺陷存在
位置：文件路径与行号
触发条件：请求、用户身份或并发条件
证据：相关实现与业务约定
影响：可能造成的业务后果
验证：建议执行的测试及预期行为
```

报告交付后，测试人员可以用以下模拟验收口径检查建议是否覆盖业务要求：

| 验证动作 | 本例约定的预期行为 |
|---|---|
| 同一用户连续或并发提交相同预约 | 按重复提交约定处理，只保留一条有效预约 |
| 用另一账号查询或取消该预约 | 无法读取他人预约详情，也无法取消 |
| 检查相关请求日志 | 不出现明文手机号 |
| 将问题记录与代码逐条对应 | 每条已确认问题都有可定位的实现依据；推测单独标明 |

这些是待执行的验证设计，不是通过记录。审查阶段预期减少的是反复补充上下文、重新整理报告的动作；是否节省时间、能发现多少问题，需要在实际项目里记录。

## 学一个功能，留下一份能继续用的材料

从测试开发角度，这类指南适合拿来练习审查流程、测试建议生成和缺陷记录。产品人员也可以沿用同一思路，把需求里的角色权限、状态变化和异常处理交代清楚，再让 Claude 辅助检查遗漏。

业务侧还可以换成客服工单或支付流程，但规则必须跟着换。预约重复提交、支付重复回调、工单重复创建，表面上都叫重复，允许发生的动作和后果并不相同。

学习的起点可以很小：打开 `optimize.md`，读懂它要求输出什么，再找一段熟悉的代码试用。完成之后，留下经过修订的指令、问题记录和验证结果。下一次任务到来时，能继续用的材料就在那里。

来源：
[项目中文 README]https://github.com/luongnv89/claude-howto/blob/main/zh/README.md 
[学习路线图]https://github.com/luongnv89/claude-howto/blob/main/zh/LEARNING-ROADMAP.md
[性能审查模板]https://github.com/luongnv89/claude-howto/blob/main/01-slash-commands/optimize.md
[代码审查 Skill]https://github.com/luongnv89/claude-howto/blob/main/03-skills/code-review-specialist/SKILL.md
[项目记忆模板]https://github.com/luongnv89/claude-howto/blob/main/02-memory/project-CLAUDE.md
[Claude Code 官方 Skills 文档]https://code.claude.com/docs/en/skills

#ClaudeCode #Skills #测试开发 #AI编程 #工作流
