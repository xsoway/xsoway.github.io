---
title: "2026-05-20-codex-resumable-development-rule"
created: "2026-05-20"
published: true
---

# 别再把项目上下文交给聊天窗口：给 Codex、Claude Code、OpenCode 做一套“可恢复现场”规则

## 01 背景：AI 编程进入了长任务时代

很多人第一次用 AI 写代码时，习惯把它当成一个“更聪明的问答框”。

你把需求发给它，它读代码、改文件、跑测试，然后告诉你完成了。这个模式在小任务里很好用，比如：

- 改一个函数
- 修一个单测
- 调整一个页面样式
- 解释一段代码
- 生成一个脚本

但当 AI 开始参与真实项目开发时，问题会很快变复杂。

真实项目不是一个 prompt 可以讲完的。它通常包含：

- 项目规则
- 局部约束
- 目录结构
- 历史决策
- 运行环境
- 测试方式
- 已知坑点
- 未完成任务
- 当前改动状态
- 验证结果

更麻烦的是，真实开发不是一次性完成的。

你可能上午让 Codex 开始做一个功能，中途被会议打断。下午回来，换成 Claude Code 或 OpenCode 继续，模型切了，会话断了，聊天上下文没了。你再说一句“继续刚才那个任务”，新的模型可能已经不知道：

- 刚才做到哪一步
- 哪些文件改过
- 哪些测试跑过
- 哪个方案已经被否掉
- 哪个接口不能动
- 哪个异常是已知问题
- 下一步到底该做什么

这时候如果继续靠聊天上下文，AI 编程就会变成一种不稳定的手艺活。

你不是在管理工程，而是在赌模型还记不记得。

这就是我最近给工作区补的一条高优先级规则：**可恢复现场 / 断点续作**。

核心思想很简单：

> 项目开发不能依赖聊天上下文。任何中等及以上任务，都必须能在中断、换模型、换会话后，从仓库文件恢复现场并继续执行。

这篇文章讲清楚它的背景、问题、解决方案，以及如何在 Codex、Claude Code、OpenCode 这类 Agent 工具里真正落地。

## 02 问题：聊天上下文不是工程资产

AI 编程里最容易被低估的问题，不是模型不会写代码，而是模型“无法稳定继承上下文”。

很多人会把上下文理解成聊天记录。但从工程角度看，聊天记录有几个天然缺陷。

### 1. 聊天上下文不可控

上下文窗口有长度限制。

任务一长，前面的信息就可能被压缩、裁剪、遗忘。即使平台做了总结，也可能漏掉关键细节。

比如一个功能开发到一半，前面已经确定：

- 某个旧接口不能改
- 需要兼容 Python 3.9
- 某个测试环境没有外网
- 某个配置只能从本地文件读取

这些信息如果只存在聊天里，新模型接手时很容易丢。

丢一次，就可能改错方向。

### 2. 聊天上下文不可审查

工程协作讲究可审查。

代码可以 diff，测试可以复跑，日志可以追踪，文档可以归档。

但聊天上下文里的任务进展很难被审查。你很难回答这些问题：

- 当时为什么选这个方案？
- 哪些验证已经做过？
- 哪个失败是已知失败？
- 下次接手的人应该从哪里开始？
- 当前结论有没有证据？

如果这些信息只在对话里，它就不是工程资产，只是临时记忆。

### 3. 聊天上下文不可迁移

现实使用中，模型切换非常常见。

可能是因为：

- 当前模型上下文满了
- 想换一个更强模型继续
- 想换一个更便宜模型做收尾
- 工具会话断了
- 第二天重新打开项目
- 另一个 Agent 接手

如果上下文不能从文件恢复，模型切换就会变成一次“失忆重启”。

这会导致两个典型问题。

第一种是重复劳动。新模型重新读项目、重新猜任务、重新设计方案。

第二种更危险：它会基于不完整信息继续改，最后引入偏差。

### 4. 任务状态和代码状态脱节

很多中断任务最大的问题不是“代码没写完”，而是“没人知道没写完到什么程度”。

比如：

- 文件 A 改完了，但没跑测试
- 文件 B 写了一半，但逻辑还没接上
- 测试用例已经写了，但还在红灯阶段
- 某个方案已经废弃，但代码里还有残留
- 某个 bug 已定位，但还没有回归用例

如果没有一个任务状态文件，下一次恢复时只能靠猜。

工程里最怕“猜当前状态”。

## 03 核心原则：把上下文从聊天里搬到仓库里

解决这个问题的关键，不是让模型“记性更好”，而是让项目本身具备可恢复能力。

也就是说：

> 聊天窗口只负责执行过程，仓库文件负责承载事实。

一个可恢复的 AI 开发现场，至少要回答七个问题：

1. 这个任务要解决什么问题？
2. 本次任务的范围和非目标是什么？
3. 当前做到哪一步了？
4. 已经改了哪些文件？
5. 哪些验证已经跑过，结果是什么？
6. 当前还有什么阻塞和风险？
7. 下一个模型接手后，第一步应该做什么？

这些问题不能靠“你记得吗”。

它们必须写进仓库。

所以我把规则拆成三类文件：

- `ROADMAP.md`：任务计划
- `STATE.md`：任务状态
- `verify-log.md`：验证记录

这三个文件加起来，就是一个任务的可恢复现场。

## 04 方案设计：三份文件承载一个任务现场

### 1. ROADMAP.md：说明“要做什么”

`ROADMAP.md` 负责定义任务目标和边界。

它不是会议纪要，也不是长篇需求文档，而是一个让模型快速知道任务方向的任务地图。

建议包含：

- 核心目标
- 成功标准
- 非目标
- 不可变更内容
- 阶段计划
- 验收标准
- 相关文件
- 验证命令

示例结构：

```text
tasks/active/<task-name>/ROADMAP.md
```

内容示例：

```markdown
# ROADMAP - 用户登录失败提示优化

## 目标

- 核心目标：优化登录失败时的错误提示，让用户能区分密码错误、账号不存在、账号被锁定。
- 成功标准：接口返回结构不破坏旧字段，前端能展示明确提示，相关单测通过。

## 边界

- 非目标：不重构登录认证流程。
- 不可变更：不修改 token 生成逻辑，不改变现有登录接口路径。

## 阶段计划

### Phase 1: 补测试

- [ ] 覆盖密码错误
- [ ] 覆盖账号不存在
- [ ] 覆盖账号锁定

### Phase 2: 实现

- [ ] 后端错误码标准化
- [ ] 前端提示映射

### Phase 3: 验证

- [ ] 跑相关单测
- [ ] 手动验证主流程

## 验收标准

- [ ] 主路径测试通过
- [ ] 边界条件覆盖
- [ ] 异常路径覆盖
- [ ] 回归测试通过
```

它解决的是任务方向问题。

新模型读完 `ROADMAP.md`，至少不会跑偏。

### 2. STATE.md：说明“做到哪了”

`STATE.md` 是断点续作的核心。

它记录当前任务的实时状态。每次暂停、中断、换模型前，都要更新。

建议包含：

- 当前阶段
- 完成项
- 进行中
- 当前目录 / 项目
- 当前分支
- 任务入口文件
- 继续前必读
- 最近一次验证命令
- 最近一次验证结果
- 关键假设
- 已知风险
- 阻塞
- 下一步
- 交接摘要
- 关联资源

示例：

```markdown
# STATE - 用户登录失败提示优化

> 本文件记录任务当前状态，用于跨会话接续。

## 当前进度

- 当前阶段：Phase 2，实现后端错误码标准化
- 完成项：
  - 已补充登录失败场景单测
  - 已确认旧接口字段 `message` 不能删除
- 进行中：
  - 正在调整 `auth_service.py` 的异常映射

## 恢复现场

- 当前目录 / 项目：src/account-platform
- 当前分支：feature/login-error-message
- 任务入口文件：services/auth_service.py
- 继续前必读：
  - tasks/active/login-error-message/ROADMAP.md
  - tests/unit/test_login_errors.py
  - src/account-platform/AGENTS.md
- 最近一次验证命令：pytest -q tests/unit/test_login_errors.py
- 最近一次验证结果：3 passed, 1 failed，账号锁定场景仍失败
- 关键假设：前端仍依赖旧字段 `message`
- 已知风险：不能改变登录接口路径和 token 生成逻辑

## 阻塞

- [ ] 无阻塞
- [x] 阻塞 1：账号锁定状态目前在 repository 层返回 None，需要确认旧逻辑如何区分

## 下一步

- [ ] 查 `user_repository.py` 中账号锁定状态来源
- [ ] 修复账号锁定错误码映射
- [ ] 重新执行 `pytest -q tests/unit/test_login_errors.py`

## 交接摘要

- 已完成：测试骨架和两个失败场景实现
- 未完成：账号锁定场景错误码仍未通过
- 下一步动作：先看 repository 返回值，再修 service 映射
- 不要改动 / 注意保持：不要删除旧字段 `message`
```

这个文件解决的是现场恢复问题。

新模型不需要问“之前做到哪了”，它直接读 `STATE.md`。

### 3. verify-log.md：说明“怎么确认完成”

`verify-log.md` 用在任务完成后。

它不是简单写一句“测试通过”，而是记录验证命令、关键输出、结论、遗留风险。

建议路径：

```text
tasks/closed/<task-name>/verify-log.md
```

示例：

````markdown
# 验证记录 - 用户登录失败提示优化

## 验证时间

2026-05-20 22:30

## 验证命令

```bash
pytest -q tests/unit/test_login_errors.py
pytest -q tests/integration/test_login_api.py
ruff check .
```

## 验证结果

### 单元测试

```text
8 passed
```

### 集成测试

```text
5 passed
```

### 代码规范检查

```text
All checks passed
```

## 最终结论

- [x] 验收通过

## 遗留问题

- 暂无

## 经验沉淀

- 涉及接口错误码调整时，必须同时覆盖旧字段兼容性测试。
````

它解决的是完成判定问题。

没有验证记录，就不要轻易说任务完成。

## 05 落地规则：什么时候必须启用

不是所有任务都需要这套机制。

如果只是改一行文案、修一个拼写、调整一个单文件小 bug，直接执行即可。

但出现以下任一情况，就应该启用“可恢复现场”规则：

- 用户说“继续上次”
- 用户说“接着做”
- 用户说“恢复任务”
- 用户说“开发了一半”
- 用户说“换模型继续”
- 用户说“上下文丢了”
- 当前任务是中等任务或完整任务
- 任务预计跨模块、跨天、跨会话
- 任务涉及多轮验证
- 当前会话准备暂停、交接、切换模型或归档

这条规则的关键不是“文档要写得漂亮”，而是“下一次真的能接上”。

## 06 恢复任务时，模型应该按什么顺序读

当用户说“继续上次任务”时，新的模型不能直接开始猜。

它应该先恢复现场。

推荐固定读取顺序：

1. 读根目录 `AGENTS.md`
2. 如果任务位于 `src/<project>/`，读项目自己的 `AGENTS.md`、`README.md` 与相关 specs/plans/design docs
3. 查 `tasks/active/` 下最相关任务的 `ROADMAP.md` 与 `STATE.md`
4. 查 `MEMORY.md` 与必要的 `memory/` 主题文件
5. 如果已安装 `agentmemory`，用任务名、项目名、关键文件名检索历史
6. 检查工作区真实状态：`git status`、必要的 `git diff`、已有测试或验证日志
7. 向用户简要报告：已完成、未完成、下一步、风险
8. 继续执行剩余任务，并在过程中持续更新 `STATE.md`

这里有一个非常重要的原则：

> agentmemory 用来找线索，仓库文件用来定事实。

`agentmemory` 很适合查历史经验，比如：

- 这个项目之前怎么跑测试？
- 某个报错以前怎么修？
- 上次为什么选择这个方案？
- 用户对这个项目有什么长期偏好？

但它不能替代当前仓库状态。

当前文件有没有改、测试有没有过、任务有没有完成，必须看本地文件、命令输出和验证日志。

## 07 为什么要把规则写进 AGENTS.md

很多人会把类似规则写在聊天里，比如：

> 以后你记得，每次中断前都帮我总结一下。

这句话的问题是：它仍然依赖聊天上下文。

真正稳定的做法，是把规则写进项目根目录的 `AGENTS.md`。

原因有三个。

### 1. AGENTS.md 是工作区总纲

它定义当前工作区的运行规则。

只要 Agent 进入这个项目，第一批应该读的就是它。

把“可恢复现场”写进这里，意味着它不是某次聊天里的临时提醒，而是项目级行为约束。

### 2. 它能约束后续所有任务

一旦规则进入 `AGENTS.md`，后续开发中只要触发条件出现，模型就应该自动启用。

比如用户只说一句：

> 继续上次那个登录任务。

模型就应该知道：

- 先找 `tasks/active`
- 先读 `ROADMAP.md`
- 再读 `STATE.md`
- 再检查 git 状态
- 汇报恢复结果
- 然后继续开发

这比每次重新解释规则要可靠得多。

### 3. 它让 AI 行为可审查

规则写在仓库里，团队可以审查、修改、迭代。

这就把“怎么使用 AI 开发”也纳入工程治理。

AI 不再是一个黑盒助手，而是被项目规则约束的执行者。

### 4. 它能让多工具共享同一套现场

真实使用里，不一定永远只用一个工具。

今天可能用 Codex，明天可能换 Claude Code，复杂编排可能交给 OpenCode 或 oh-my-opencode。工具会变，但项目现场不能变。

所以 `AGENTS.md` 应该作为跨工具的总纲：

- Codex 直接读取并遵循 `AGENTS.md`
- Claude Code 通过 `CLAUDE.md` 进入，但继续指向 `AGENTS.md`
- OpenCode 通过 `bootstrap/opencode.md` 进入，但仍然共享 `tasks/active` 和 `tasks/closed`
- 其他 Agent 工具只要能读写仓库文件，也应该遵循同一套现场规则

这条规则的价值就在这里：它不绑定某一个产品，而是绑定仓库文件。

## 08 不同 Agent 工具怎么接入

这套机制不是 Codex 专属。

它的本质是：把任务状态、验证证据和恢复路径写进仓库。只要工具能读写文件，就能接入。

### Codex

Codex 的入口就是根目录 `AGENTS.md`。

推荐做法：

- 把 `可恢复现场 / 断点续作` 写进 `AGENTS.md`
- 中等及以上任务统一使用 `tasks/active/<task-name>/ROADMAP.md` 和 `STATE.md`
- 完成后归档到 `tasks/closed/<task-name>/verify-log.md`

Codex 恢复任务时，应该先读 `AGENTS.md`，再读任务状态文件，然后再继续实现。

### Claude Code

Claude Code 通常会优先读取 `CLAUDE.md`。

所以不要只把规则写在 `AGENTS.md`，还应该在 `CLAUDE.md` 里显式写清楚：

```markdown
Claude Code must treat `AGENTS.md` as the workspace constitution.
The section `高优先级规则：可恢复现场 / 断点续作` is mandatory for medium and complex development tasks.
```

然后把恢复要求写成固定行为：

- 不依赖聊天历史作为事实来源
- 中等及以上任务创建或复用 `ROADMAP.md` 和 `STATE.md`
- 中断前更新 `STATE.md`
- 恢复时读取 `AGENTS.md`、项目局部规则、`ROADMAP.md`、`STATE.md`
- 再检查真实工作区状态，比如 `git status`、diff、测试日志
- 如果有 `agentmemory`，只把它当作历史线索，不当作当前事实

如果项目有 `bootstrap/claude-code.md`，也应该把同样规则写进去，作为 Claude Code 的启动引导。

### OpenCode / oh-my-opencode

OpenCode 的重点是 agent 编排。

它可能会把任务拆给多个 agent 或 subagent。这个时候，“可恢复现场”更重要。

因为不能让任务状态只存在于某个父 agent 的临时上下文里。

推荐在 `bootstrap/opencode.md` 写清楚：

```markdown
OpenCode / oh-my-opencode 的 agent 编排必须共享同一套文件现场，不能依赖某个子 agent 或某个聊天窗口的临时上下文。
```

OpenCode 的关键要求是：

- 主 agent 和 subagent 都要围绕同一套 `ROADMAP.md`、`STATE.md`、`verify-log.md` 工作
- 分配给 subagent 的任务必须能从仓库文件恢复，不能只靠父会话口头描述
- subagent 完成探索、实现、验证后，要把关键结论、改动文件、验证命令和风险回填到 `STATE.md` 或对应产物
- 恢复任务时先读 `AGENTS.md`、项目局部规则、`ROADMAP.md`、`STATE.md`
- 再检查真实工作区状态，而不是直接相信会话摘要

OpenCode 里最容易出问题的地方，是多个 agent 并行后，结论散在不同上下文里。

所以它更需要一个文件化的任务现场。

## 09 我的实际落地方式

我在项目根目录 `AGENTS.md` 中新增了一节：

```markdown
## 高优先级规则：可恢复现场 / 断点续作

> 目标：项目开发不能依赖聊天上下文。任何中等及以上任务，都必须能在中断、换模型、换会话后，从仓库文件恢复现场并继续执行。
```

然后把规则拆成七部分。

### 第一部分：触发条件

明确什么时候必须启用。

```markdown
出现以下任一情况时，必须启用本规则：

- 用户说“继续上次 / 接着做 / 恢复任务 / 开发了一半 / 换模型继续 / 上下文丢了”
- 当前任务属于“中等任务”或“完整任务”
- 任务预计跨模块、跨天、跨会话，或涉及多轮验证
- 当前会话准备暂停、交接、切换模型、切换工具或归档
```

这能避免模型把中断恢复当成可选动作。

### 第二部分：任务开始时必须落盘

明确中等及以上任务要创建任务目录。

```text
tasks/active/<task-name>/
├── ROADMAP.md
└── STATE.md
```

这一步的作用，是在任务刚开始时就建立恢复点，而不是等出问题后补救。

### 第三部分：中断前必须更新恢复现场

暂停前必须写清楚：

- 当前分支 / 当前目录 / 当前项目
- 已完成内容
- 未完成内容
- 下一步可执行动作
- 已修改或重点关注的文件
- 最近一次验证命令与结果
- 当前阻塞、风险、假设
- 继续任务时建议先读的文件

这相当于给下一次会话留一张“接力条”。

### 第四部分：恢复任务时的固定读取顺序

规则明确要求：

先恢复现场，再继续实现。

这很关键。

很多 AI 接手任务时会直接开始写代码，但它其实还不知道现场状态。固定读取顺序可以降低这种风险。

### 第五部分：agentmemory 使用边界

我把 `agentmemory` 定位为历史线索层，而不是事实来源。

规则里写得很明确：

```markdown
- `agentmemory` 用于跨会话检索历史线索、旧决策、踩坑记录和任务回忆
- 仓库内的 `tasks/active/*/STATE.md`、`ROADMAP.md`、`verify-log.md` 才是恢复任务的事实来源
- 不能只依赖 agentmemory 或聊天上下文判断当前状态；凡是能从文件、命令、测试确认的，必须以本地证据为准
```

这能避免另一个极端：把所有希望都寄托在记忆系统上。

记忆系统很好，但工程事实必须落在仓库里。

### 第六部分：跨工具适用规则

这一部分明确说明：规则不是 Codex 专属，而是本工作区所有 AI 编程工具的高优先级规则。

```markdown
- **Codex**：默认读取并遵循根目录 `AGENTS.md`
- **Claude Code**：通过 `CLAUDE.md` 进入时，必须继续读取并遵循 `AGENTS.md` 本规则
- **OpenCode / oh-my-opencode**：通过 `bootstrap/opencode.md` 进入时，必须让主 agent 与 subagent 共享 `ROADMAP.md`、`STATE.md`、`verify-log.md` 文件现场
- **其他 Agent 工具**：只要能读写仓库文件，都应遵循同一套 `tasks/active` 与 `tasks/closed` 状态管理规则
```

这一步很关键。

如果只写 Codex，换到 Claude Code 或 OpenCode 时，规则可能不会被自然触发。

把跨工具适用范围写进总纲后，所有工具都围绕仓库文件工作。

### 第七部分：完成后归档

任务完成后从：

```text
tasks/active/<task-name>/
```

归档到：

```text
tasks/closed/<task-name>/
├── ROADMAP.md
├── STATE.md
└── verify-log.md
```

这样一个任务从开始、执行、暂停、恢复、验证、完成，都有记录。

## 10 模板也要同步改，否则规则会悬空

只改 `AGENTS.md` 还不够。

规则告诉模型“要更新 STATE.md”，但如果模板里没有对应字段，后续执行时还是容易漏。

所以我同步改了 `tasks/templates/state-template.md`。

新增了两个关键区域。

### 恢复现场

```markdown
## 恢复现场

> 用于中断、换模型、换会话后快速恢复上下文。每次暂停或交接前必须更新。

- **当前目录 / 项目**：
- **当前分支**：
- **任务入口文件**：
- **继续前必读**：
- **最近一次验证命令**：
- **最近一次验证结果**：
- **关键假设**：
- **已知风险**：
```

这个区域给新模型恢复上下文用。

尤其是这几个字段很重要：

- `继续前必读`：避免新模型盲目搜索
- `最近一次验证命令`：让验证可以复跑
- `最近一次验证结果`：让新模型知道当前红绿状态
- `关键假设`：避免推翻前面已经确认的前提
- `已知风险`：避免踩重复坑

### 交接摘要

```markdown
## 交接摘要

> 给换模型或新会话的最短 handoff。

- **已完成**：
- **未完成**：
- **下一步动作**：
- **不要改动 / 注意保持**：
```

这个区域是给“快速接手”用的。

如果新模型只能读一小段，就先读这里。

特别是 `不要改动 / 注意保持` 这个字段很实用。很多项目事故不是因为没做完，而是因为新模型把旧约束改坏了。

## 11 和 agentmemory 的关系

`agentmemory` 很有用，但要用对位置。

我会把它放在“恢复任务”的第三层。

第一层是项目规则：

- `AGENTS.md`
- 项目局部 `AGENTS.md`
- `README.md`
- specs / plans / design docs

第二层是任务现场：

- `tasks/active/<task>/ROADMAP.md`
- `tasks/active/<task>/STATE.md`
- `tasks/closed/<task>/verify-log.md`

第三层才是记忆检索：

- `MEMORY.md`
- `memory/topics/*`
- `agentmemory`

为什么不是先查 agentmemory？

因为 agentmemory 适合回答“以前发生过什么”，但不一定代表“当前文件是什么状态”。

比如记忆里可能记录：

> 上次修复 Exchange 发送失败时，用了 send(save_copy=False) fallback。

这是一条很有价值的历史经验。

但当前项目是否已经应用了这个修复，仍然要看代码。

所以正确用法是：

- 用 agentmemory 快速找历史线索
- 用仓库文件确认当前事实
- 用测试命令验证当前结论

这样才稳。

## 12 一个完整恢复流程示例

假设我正在开发一个测试报告平台的新功能：支持“进度报告”和“上线报告”两种报告类型。

任务做到一半时，会话断了。

第二天我换了模型，只输入一句：

```text
继续昨天测试报告类型切换那个任务。
```

一个遵守规则的 Agent 应该这样做。

### 第一步：读规则

先读：

```text
AGENTS.md
src/test-report-platform/AGENTS.md
src/test-report-platform/README.md
```

确认项目规则、启动方式、测试方式。

### 第二步：找任务现场

查：

```text
tasks/active/
```

找到类似：

```text
tasks/active/test-report-type-switch/
├── ROADMAP.md
└── STATE.md
```

### 第三步：读状态

从 `STATE.md` 里恢复：

- 当前阶段：后端参数已经接入，前端还没联调
- 已完成：报告类型枚举、接口参数校验、部分单测
- 未完成：前端选择框、预览接口兼容、回归测试
- 最近验证：后端单测通过，端到端未跑
- 风险：不能影响默认上线报告发送流程

### 第四步：查真实工作区状态

执行：

```bash
git status
git diff
```

确认哪些文件真的改了。

如果不是 git 仓库，也要用文件时间、目录结构、测试输出来确认当前状态。

### 第五步：查历史记忆

用 `agentmemory` 检索：

```text
test-report-platform report_type progress online preview send
```

找过去踩过的坑，比如：

- 进度报告需要隐藏验收人员
- 只拉取 type == test 的任务
- Exchange 密码不能持久化

### 第六步：向用户报告恢复结果

继续开发前，先给用户一个短报告：

```text
我已恢复现场：
- 已完成：后端 report_type 参数、上线报告默认逻辑、部分单测
- 未完成：前端报告类型选择、preview 接口联调、回归验证
- 下一步：先补前端选择框，再跑 preview smoke test
- 风险：不能改变默认上线报告发送行为
```

### 第七步：继续实现并更新 STATE.md

每完成一段，就更新状态。

这样即使再次中断，下一次仍然能接上。

## 13 这套机制真正解决的是什么

表面上看，这只是多写几个 Markdown 文件。

但本质上，它解决的是 AI 编程里的三个核心问题。

### 1. 把隐性上下文显性化

以前上下文藏在聊天里、脑子里、临时总结里。

现在上下文进入仓库，变成可读、可审查、可继承的文件。

### 2. 把任务推进状态工程化

任务不是“差不多做完了”。

任务状态必须能回答：

- 哪些完成了
- 哪些没完成
- 哪些验证过
- 哪些还有风险
- 下一步是什么

这对人有用，对 Agent 更有用。

### 3. 把模型切换从风险变成常规操作

有了可恢复现场后，换模型不再可怕。

新模型不需要继承旧聊天窗口，只需要读取仓库事实。

模型变成可替换的执行者，项目现场才是核心资产。

这其实更符合工程系统的设计原则。

不要把关键状态放在不可控对象里。

聊天上下文不可控，仓库文件可控。

## 14 推荐的最小落地版本

如果你也想在自己的项目里落地，不需要一开始做得很复杂。

最小版本只需要四步。

### 第一步：在 AGENTS.md 加一条规则

```markdown
## 高优先级规则：可恢复现场 / 断点续作

项目开发不能依赖聊天上下文。任何中等及以上任务，都必须能在中断、换模型、换会话后，从仓库文件恢复现场并继续执行。
```

然后写清触发条件和恢复顺序。

### 第二步：建立任务目录

```text
tasks/
├── active/
├── closed/
└── templates/
```

### 第三步：准备两个模板

```text
tasks/templates/roadmap-template.md
tasks/templates/state-template.md
```

一开始只要能记录这些字段就够：

```markdown
## 当前进度

- 当前阶段：
- 完成项：
- 进行中：

## 恢复现场

- 当前目录 / 项目：
- 当前分支：
- 继续前必读：
- 最近一次验证命令：
- 最近一次验证结果：
- 已知风险：

## 下一步

- [ ] 

## 交接摘要

- 已完成：
- 未完成：
- 下一步动作：
- 不要改动 / 注意保持：
```

先跑起来，再逐步完善。

### 第四步：补齐不同工具的入口

如果你同时使用 Codex、Claude Code、OpenCode，建议补齐这些入口文件：

```text
AGENTS.md                  # 总纲，所有 Agent 共用
CLAUDE.md                  # Claude Code 快速入口，指向 AGENTS.md
bootstrap/claude-code.md   # Claude Code 启动引导
bootstrap/opencode.md      # OpenCode 启动引导
```

不要在每个工具里复制出一套彼此分叉的规则。

推荐方式是：`AGENTS.md` 放完整规则，其他入口文件只做强引用和工具级补充。

## 15 最后的判断标准

这套规则有没有用，不看文档写得多漂亮。

只看一个标准：

> 明天换一个模型，只读仓库文件，它能不能继续今天未完成的任务？

如果能，就说明你的 AI 开发现场是可恢复的。

如果不能，就说明关键上下文还散落在聊天里。

AI 编程越往后走，越不是比谁更会写 prompt，而是比谁更会建设上下文工程。

把规则、任务、验证、复盘沉淀到仓库里，模型只是执行者。

真正稳定的是你的工程系统。

## 16 可直接复制的规则片段

下面是一段可以直接放进项目 `AGENTS.md` 的规则。

````markdown
## 高优先级规则：可恢复现场 / 断点续作

> 目标：项目开发不能依赖聊天上下文。任何中等及以上任务，都必须能在中断、换模型、换会话后，从仓库文件恢复现场并继续执行。

### 1. 触发条件

出现以下任一情况时，必须启用本规则：

- 用户说“继续上次 / 接着做 / 恢复任务 / 开发了一半 / 换模型继续 / 上下文丢了”
- 当前任务属于“中等任务”或“完整任务”
- 任务预计跨模块、跨天、跨会话，或涉及多轮验证
- 当前会话准备暂停、交接、切换模型、切换工具或归档

### 2. 任务开始时必须落盘

中等及以上任务开始后，应创建或复用：

```text
tasks/active/<task-name>/
├── ROADMAP.md
└── STATE.md
```

- `ROADMAP.md`：写清目标、范围、非目标、阶段计划、验收标准、验证命令
- `STATE.md`：写清当前进度、已完成项、进行中项、阻塞、下一步、改动文件、验证结果

### 3. 中断前必须更新恢复现场

当会话可能中断、任务未完成、用户要求暂停，或即将切换模型时，必须先更新 `STATE.md`，至少包含：

- 当前分支 / 当前目录 / 当前项目
- 已完成内容
- 未完成内容
- 下一步可执行动作
- 已修改或重点关注的文件
- 最近一次验证命令与结果
- 当前阻塞、风险、假设
- 继续任务时建议先读的文件

### 4. 恢复任务时的固定读取顺序

当用户要求继续未完成任务时，先恢复现场，再继续实现。固定顺序：

1. 读根目录 `AGENTS.md`
2. 如果任务位于 `src/<project>/`，读 `src/<project>/AGENTS.md`、`README.md` 与相关 specs/plans/design docs
3. 查 `tasks/active/` 下最相关任务的 `ROADMAP.md` 与 `STATE.md`
4. 查 `MEMORY.md` 与必要的 `memory/` 主题文件；如果已安装 `agentmemory`，用任务名、项目名、关键文件名检索历史
5. 检查工作区真实状态：`git status`、必要的 `git diff`、已有测试/验证日志
6. 向用户简要报告：已完成、未完成、下一步、风险
7. 继续执行剩余任务，并在过程中持续更新 `STATE.md`

### 5. agentmemory 使用边界

- `agentmemory` 用于跨会话检索历史线索、旧决策、踩坑记录和任务回忆
- 仓库内的 `tasks/active/*/STATE.md`、`ROADMAP.md`、`verify-log.md` 才是恢复任务的事实来源
- 不能只依赖 agentmemory 或聊天上下文判断当前状态；凡是能从文件、命令、测试确认的，必须以本地证据为准

### 6. 跨工具适用规则

本规则不是 Codex 专属规则，而是本工作区所有 AI 编程工具的高优先级规则。

- **Codex**：默认读取并遵循根目录 `AGENTS.md`
- **Claude Code**：通过 `CLAUDE.md` 进入时，必须继续读取并遵循 `AGENTS.md` 本规则
- **OpenCode / oh-my-opencode**：通过 `bootstrap/opencode.md` 进入时，必须让主 agent 与 subagent 共享 `ROADMAP.md`、`STATE.md`、`verify-log.md` 文件现场
- **其他 Agent 工具**：只要能读写仓库文件，都应遵循同一套 `tasks/active` 与 `tasks/closed` 状态管理规则

如果某个工具的内置记忆、会话摘要或 agent 编排策略与本规则冲突，以仓库内 `AGENTS.md`、`tasks/`、`memory/` 的文件事实为准。
````

### Claude Code 入口片段

如果使用 Claude Code，可以在 `CLAUDE.md` 里放一个轻量入口，让它强制回到 `AGENTS.md`。

```markdown
# CLAUDE.md

If the host environment reads `CLAUDE.md`, use this file as the quick entry.

Read and follow in this order:
1. `SOUL.md`
2. `USER.md`
3. `AGENTS.md`
4. `MEMORY.md`
5. `TEAM.md` and `REVIEW.md` when relevant
6. `memory/` today + yesterday logs if present

## High-priority resumable development rule

Claude Code must treat `AGENTS.md` as the workspace constitution.
The section `高优先级规则：可恢复现场 / 断点续作` is mandatory for medium and complex development tasks.

Required behavior:

1. Do not rely on chat history as the source of truth.
2. Create or reuse `tasks/active/<task-name>/ROADMAP.md` and `tasks/active/<task-name>/STATE.md` for medium and complex tasks.
3. Before pausing, handing off, switching model, or ending an unfinished task, update `STATE.md`.
4. When resuming, read `AGENTS.md`, project-local rules, `ROADMAP.md`, `STATE.md`, relevant memory files, and then inspect real workspace state.
5. If `agentmemory` is available, use it only to retrieve historical clues.
6. Before continuing implementation, briefly report completed work, unfinished work, next step, and risks.
```

### OpenCode 入口片段

如果使用 OpenCode 或 oh-my-opencode，可以在 `bootstrap/opencode.md` 里放这段。

```markdown
## 强制规则：可恢复现场 / 断点续作

OpenCode / oh-my-opencode 的 agent 编排必须共享同一套文件现场，不能依赖某个子 agent 或某个聊天窗口的临时上下文。

### OpenCode 执行要求

- 中等及以上任务必须创建或复用 `tasks/active/<task-name>/ROADMAP.md` 与 `STATE.md`
- 分配给 subagent 的任务必须能从 `ROADMAP.md` / `STATE.md` / specs / design docs 恢复，不依赖父会话口头描述
- subagent 完成探索、实现、验证后，应把关键结论、改动文件、验证命令和风险回填到 `STATE.md` 或对应任务产物
- 恢复任务时先读 `AGENTS.md`、项目局部规则、`ROADMAP.md`、`STATE.md`，再检查真实工作区状态
- 如果可用 `agentmemory`，只把它当作历史线索检索；当前事实以仓库文件、命令输出和验证结果为准
- 继续实现前，先向用户简要报告：已完成、未完成、下一步、风险
```

## 17 结语

AI 编程不是把所有事情都交给模型记住。

恰恰相反，越依赖 AI，越要把关键上下文工程化。

因为模型会换，会话会断，上下文会丢，工具会变。

但仓库里的规则、任务状态、验证记录、复盘结论可以留下来。

当一个项目做到“换模型也能继续开发”，它才真正进入了 AI 工程化阶段。

这也是我现在越来越认同的一句话：

> 不要让 AI 记住项目，让项目自己记住项目。
