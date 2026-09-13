---
title: "OpenClaw × OpenCode：两套模板直接抄：OpenClaw 编排 OpenCode（可控 B / 省心 C）"
created: "2026-04-13"
published: true
---
> 图片资源未同步：未命名图片

# OpenClaw × OpenCode：两套模板直接抄：OpenClaw 编排 OpenCode（可控 B / 省心 C）



### OpenClaw：AI 指挥中心

OpenClaw 是一个 AI 助手平台，核心能力：

| 功能         | 说明                       | 命令                                                    |
| ------------ | -------------------------- | ------------------------------------------------------- |
| 启动后台任务 | 不阻塞当前会话             | `sessions_spawn task:"..."`                             |
| 实时监控     | 查看任务输出和进度         | `sessions_history sessionKey:"..."`                     |
| 任务管理     | 列出发送消息、强制停止     | `sessions_list`, `sessions_send`, `process action:kill` |
| 上下文管理   | 自动读取 workspace、memory | 内置                                                    |
| 错误处理     | 自动检测和恢复             | 内置                                                    |

### OpenCode：AI 编程代理

OpenCode 读取 OpenSpec 规范，自动写代码。支持多种调用方式：

1. **命令行**

   ：`opencode run "实现功能"`

2. **OpenClaw exec**

   ：`exec command:"opencode run ..."`

3. **OpenClaw sessions_spawn**

   ：`sessions_spawn task:"..."` ⭐推荐





先把关系钉死：

- **OpenClaw = 指挥中心（开任务/看进度/喂输入/强制停止/收敛输出）**
- **OpenCode = 终端里的编程代理（读代码/改代码/跑 pytest/产出 commit）**

“OpenClaw 调 OpenCode”只有一种本质：

> **OpenClaw 用 exec 在指定 workdir 启动 `opencode run ...`，再用 process 或 sessions_* 去管理与追踪。**

下面给你两套可复制的工作流：

- **B：后台可控**（你能随时看日志、喂输入、kill）——最稳、最可控
- **C：sessions_spawn 编排**（你只看结果，盯进度交给子会话）——最省心

默认场景：Python 项目，验收命令 `pytest -q`。



**如果你只是一个人在本机终端里“爽写”**，OpenClaw 的存在感确实会很弱，甚至像一层多余包装。

但一旦目标从“写得快”变成“能持续交付/可控/可复用/可协作”，OpenClaw 的价值会开始显形。



下面把它拆开讲清楚：**什么时候 OpenClaw 没价值、什么时候它很值钱、它具体在体系里扮演什么角色。**





1）你说得对：这些场景下 OpenClaw 确实不如直接 opencode



场景 A：你全程盯着终端



• 任务很小（10~30 分钟）

• 你在工位，opencode 问什么你立刻回

• 你自己就能看输出/改动/跑 pytest

结论：**直接 opencode 最爽。**OpenClaw 只能提供“转发命令”的价值，确实鸡肋。



场景 B：单人开发、无编排需求



• 不需要同时跑多个任务

• 不需要把任务拆成流水线

• 不需要留痕/复盘/统一验收格式

结论：OpenClaw 在“流程层”的收益为 0。





2）OpenClaw 真正的作用：它不是“写代码”，是“把 AI 开发变成工程流程”



OpenCode 是执行器；OpenClaw 的定位是 **控制面/编排面**。它发挥作用的点主要有 6 类。



2.1 后台化 + 可追踪（你不必守着终端）



• OpenCode 交互式、容易卡住；OpenClaw 可以把它变成后台 session

• 你随时拉日志、判断卡点、必要时 kill/重启

• 这在“你要开会/要离开电脑/要同时跑多个任务”时特别有用

一句话：**把“必须盯着跑”变成“可异步管理”。**



2.2 统一验收口径（把“应该好了”变成“pytest -q 结果”）



OpenCode 直接跑，你当然也能要求它跑测试。

但 OpenClaw 更适合把“验收”做成模板化流程，例如每个任务必须交付：



• 改动摘要（文件列表）

• pytest -q 原样输出

• 关键 diff/片段

• 失败原因 + 下一步

一句话：**把结果从聊天式输出变成交付式输出。**



2.3 并行与任务拆分（多 Agent / 多 worktree）



当你同时要做：



• 修 bug

• 补测试

• 写文档

• 做重构评估

OpenClaw 可以编排多个后台任务并行跑（甚至在不同 workdir/worktree），你只看汇总。



一句话：**你一个人变成“带多个执行工位”的调度者。**



2.4 上下文治理（防止 AI 乱读/乱改）



OpenCode 在终端 vibe coding 时，很容易“顺手翻很多东西”。

OpenClaw 强制你显式指定 workdir，并且可以把任务限制在某个目录范围内（工程上更干净）。



一句话：**减少“AI 在仓库里瞎逛”的概率。**



2.5 任务留痕与复盘（可回溯）



通过 session 记录/历史，你能回溯：



• 它当时为什么这么改

• 失败点出现在哪

• 哪些指令最有效

对团队而言，这是把“AI 工作方式”沉淀成 SOP 的基础。



一句话：**把一次性 vibe 变成可复用经验。**



2.6 跨工具整合（不仅是写代码）



OpenClaw 还能把编程之外的东西接起来：提醒、消息通知、文档落盘、抓取资料、生成图等。

当你要“写代码 + 写文章 + 产出图 + 发消息/提醒”这种链路，OpenClaw 更像流水线平台。



一句话：**让开发工作流不是只有 opencode。**





3）一个判断标准：OpenClaw 的 ROI 什么时候会超过“直接 opencode”？



用最硬的标准：



• **你有没有“离开终端”的需求？**（异步、并行、后台）

• **你有没有“交付格式”的需求？**（可验收、可复盘、可协作）

• **你有没有“多任务/多分支并行”的需求？**

• **你有没有“把 AI 纳入工程制度”的需求？**（规则/模板/闭环）

只要其中任意两条是“有”，OpenClaw 通常就开始值钱。





4）我的建议（不绕弯）



• 你日常“写得爽”的活：**直接 opencode**，别强行上 OpenClaw。

• 下面这三类活，优先用 OpenClaw： 1. **长任务 + 你不想盯着**（后台可控 B）

2. **要交付可验收结果**（pytest 输出 + diff + 摘要）
3. **并行多件事**（多个 session/多个 worktree）



如果你愿意，我可以把你常用的工作流做成一个“默认模板”：



• 一个用于 B（后台可控）的固定提示模板

• 一个用于 C（只看结果）的交付模板

你以后只改 workdir 和 任务目标 两行就能跑。



当你觉得“OpenClaw 还不如直接在终端 opencode vibe coding”，大概率是因为：你现在做的是**单人、短任务、全程盯着屏幕**的那种活。

OpenClaw 真正值钱的部分，不是帮你写代码。
而是把 OpenCode 这种终端 Agent，变成**可后台化、可验收、可复盘、可并行**的工程流程。

这篇不讲理念，直接交付两套你能反复复制的 SOP：

- **B（后台可控）模板**：你拿着 sessionId 随时接管（看日志/喂输入/kill）
- **C（只看结果）模板**：你不盯过程，只收“交付包”（摘要 + pytest 输出 + diff）

默认：Python 项目，验收命令 `pytest -q`。

---

## 0）开始前 30 秒：准备一个“永远不变”的项目约定

把下面 3 条写死，你后面省一半时间：

1) 项目根目录固定：`workdir=<你的 repo 根目录>`
2) 虚拟环境固定：`.venv`（如果你用 venv）
3) 验收命令固定：`pytest -q`

推荐你在 repo README 或 Makefile 里把验收命令固化一下：

```bash
# 可选：用 make 统一入口
make test  # 内部执行 pytest -q
```

但就算你不做，后面的模板也能跑。

---

## 1）B：后台可控（最稳的一套，建议先用它跑通 1~2 次）

### 1.1 你在 OpenClaw 客户端“输入什么”

你只需要给 OpenClaw 一段任务描述，外加你的 repo 路径。

**直接复制这段，替换 workdir 和 任务内容：**

```text
方式B（后台可控）：
workdir=~/Projects/your-python-repo

请在上述目录启动 OpenCode 完成任务：
【任务目标】
- <一句话描述：修 bug / 加功能>

【约束/禁止】
- 不新增依赖
- 不改目录结构
- 不改 CI 配置

【实现要求】
- 输出定位过程（异常堆栈/触发条件/影响范围）
- 必须补 pytest（主流程 + 1 个错误分支）

【验收方式】
- 必须运行：pytest -q
- 必须贴出 pytest 输出

【交付】
- 改动摘要（改了哪些文件）
- 关键 diff/代码片段

启动后：把 process sessionId 发我。
```

### 1.2 OpenClaw 在背后做了什么（你理解一次就够）

OpenClaw 会执行（你不需要自己敲）：

```bash
bash pty:true workdir:~/Projects/your-python-repo background:true \
  command:"opencode run '<上面的任务描述>'"
```

关键点就三个：

- `pty:true`：保证 OpenCode 交互正常
- `background:true`：不阻塞当前会话，返回 sessionId
- `workdir:`：锁定项目上下文

### 1.3 你怎么“实时监控进度”

拿到 `sessionId` 后，你可以让 OpenClaw干三件事：

**（1）看日志**

```text
查看方式B日志：sessionId=<SESSION_ID>
```

它等价于：

```bash
process action:log sessionId:<SESSION_ID>
```

**（2）看是否结束**

```text
方式B任务结束了吗？sessionId=<SESSION_ID>
```

等价于：

```bash
process action:poll sessionId:<SESSION_ID>
```

**（3）它问你问题时喂输入**

```text
方式B喂输入：sessionId=<SESSION_ID>
回答：yes
```

等价于：

```bash
process action:submit sessionId:<SESSION_ID> data:"yes"
```

### 1.4 你怎么“验证结果”（别让 Agent 嘴硬）

你直接要求它按固定格式交付：

```text
方式B验收：sessionId=<SESSION_ID>
请输出：
1) pytest -q 原样输出
2) 改动文件清单
3) 关键 diff（或关键代码片段）
4) 若失败：失败原因 + 下一步
```

然后你自己再补一刀（最稳）：

```bash
cd ~/Projects/your-python-repo
pytest -q
```

### 1.5 B 模板适用场景

- 任务 30min~2h
- 你想随时接管
- 你担心它乱改、乱加依赖

一句话：**可控优先**。

---

## 2）C：只看结果（把盯进度这件事外包给 sessions_spawn 子会话）

这套的目标是：你在主会话不盯过程，只收“交付包”。

### 2.1 你在 OpenClaw 客户端“输入什么”

**复制下面这段，替换 workdir 和任务目标：**

```text
方式C（只看结果 / 编排模式）：
workdir=~/Projects/your-python-repo

请启动一个 sessions_spawn 子会话来编排完成开发任务。
子会话必须做到：
- 在 workdir 下用 PTY 启动 OpenCode：opencode run "..."
- 全程监控，必要时处理交互
- 最后只把“交付包”发回主会话

【任务目标】
- <一句话描述：修 bug / 加功能>

【约束/禁止】
- 不新增依赖
- 不改目录结构
- 不改 CI 配置

【实现要求】
- 必须补 pytest（主流程 + 1 个错误分支）

【验收方式】
- 必须运行：pytest -q

【交付包格式（必须严格按此输出）】
1) 变更摘要（做了什么）
2) 改动文件清单
3) pytest -q 原样输出
4) 关键 diff/关键代码片段
5) 风险点/后续建议（可选）
```

### 2.2 C 在背后做了什么

主会话做：

- `sessions_spawn` 起一个后台编排子会话

子会话做：

- 用 `exec + pty:true + background:true` 启动 opencode
- 用 `process log/poll/submit` 盯它
- 结束后把结果整理成“交付包”发回

> C 的关键是：你要把“交付包格式”写死。不然最后还是一坨终端输出。

### 2.3 C 模板适用场景

- 任务 1h~半天
- 你不想盯终端
- 你更关心最终交付，而不是过程

一句话：**省心优先**。

---

## 3）两套模板怎么搭配（最实战的策略）

- 默认用 **C**：省脑子，只收交付包
- 发现跑偏/交互复杂/输出不确定 → 切回 **B** 接管

你可以把它理解成：

> C 是自动驾驶；B 是手动接管。

---

## 4）给你一个可直接复用的“任务示例”（Python/pytest）

你下次只要改两行：`workdir` 和 `任务目标`。

```text
任务目标：
- 修复 /api/login 偶发 500（附复现步骤：...）

约束/禁止：
- 不新增依赖
- 不改目录结构

实现要求：
- 输出根因定位过程
- 新增 pytest：
  - test_login_ok
  - test_login_missing_credentials

验收：
- pytest -q

交付：
- pytest 输出 + 文件清单 + 关键 diff
```

---

#OpenClaw #OpenCode #Python #pytest #AI编程
