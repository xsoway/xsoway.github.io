---
title: "Vibe coding 新范式：OpenClaw + OpenCode 组合拳怎么打？OpenClaw 的价值不是写代码，是把 opencode 变成可控流程"
created: "2026-04-13"
published: true
---
# Vibe coding 新范式：OpenClaw + OpenCode 组合拳怎么打？OpenClaw 的价值不是写代码，是把 opencode 变成可控流程

Vibe coding 很爽：代码出来得快，试错成本低，想法落地像开挂。

但爽归爽，工程上有个现实：**写得越快，越容易把项目写成“能跑一时，难维护一世”。**

症状也很熟：

- 任务一多就卡住（终端得盯着，离开就停）
- 输出一大就失控（改动范围飘，越改越像重构）
- 质量一问就玄学（“应该好了”，但不敢合）

所以这篇不讲情怀，只讲打法：

> vibe coding 新范式：OpenClaw + OpenCode 组合拳

目标是把“爽写”升级成“可交付”：

- 该快的时候快（OpenCode）
- 该稳的时候稳（OpenClaw）
- 该验收的时候硬（`pytest -q`）

---

## 0）先把关系说死：控制面 vs 执行面

先把关系钉死：

- OpenClaw = 指挥中心（开任务 / 看进度 / 喂输入 / 强制停止 / 收敛输出）
- OpenCode = 终端里的编程代理（读代码 / 改代码 / 跑 pytest / 产出 commit）

“OpenClaw 调 OpenCode”本质就一件事：

> OpenClaw 用 `exec` 在指定 `workdir` 启动 `opencode run ...`，再用 `process` 或 `sessions_*` 管与追。

接下来所有内容，都落在两套可复制的工作流：

- B：后台可控（随时看日志、喂输入、kill）——稳
- C：`sessions_spawn` 编排（只看结果，盯进度交给子会话）——省心

默认场景：Python 项目；验收命令：`pytest -q`。

---

## 1）先承认：有些场景下 OpenClaw 确实不值

### 场景 A：你全程盯着终端

- 任务很小（10~30 分钟）
- 你在工位，OpenCode 问什么都能秒回
- 你自己看输出、看 diff、跑 pytest 都顺

结论：直接 `opencode` 最爽。此时 OpenClaw 多半是“转发命令”，确实鸡肋。

### 场景 B：单人开发、没有编排需求

- 不需要并行跑多个任务
- 不需要拆流水线
- 不需要留痕/复盘/统一验收格式

结论：OpenClaw 在“流程层”的收益接近 0。

---

## 2）那 OpenClaw 到底干嘛？它不是写代码，是把 AI 开发变成工程流程

OpenCode 是执行面（干活），OpenClaw 是控制面（控场）。它常见的价值点有 6 个：

### 2.1 后台化 + 可追踪：不用守着终端

- OpenCode 交互式、容易卡；OpenClaw 能把它 session 化
- 你随时拉日志，卡住就 kill/重启
- 适合开会、离开电脑、同时跑多个任务

一句话：把“必须盯着跑”变成“可异步管理”。

### 2.2 统一验收口径：把“应该好了”压成 pytest 输出

OpenCode 直接跑也能要求跑测试。

但 OpenClaw 更适合把验收变成模板：每个任务必须交付

- 改动摘要（文件列表）
- `pytest -q` 原样输出
- 关键 diff/片段
- 失败原因 + 下一步

一句话：把结果从聊天式输出变成交付式输出。

### 2.3 并行与任务拆分：多 Agent / 多 worktree

当你同时要做：修 bug、补测试、写文档、做重构评估。

OpenClaw 可以编排多个后台任务并行跑（甚至不同 workdir/worktree），你最后看汇总。

一句话：一个人变成“带多个执行工位”的调度者。

### 2.4 上下文治理：减少 AI 乱读/乱改

OpenCode 在终端 vibe coding，很容易顺手翻很多东西。

OpenClaw 强制你显式指定 `workdir`，还能把任务范围卡死。

一句话：降低“AI 在仓库里瞎逛”的概率。

### 2.5 留痕与复盘：可回溯

通过 session 记录/历史，你能回头看：

- 当时为什么这么改
- 失败点在哪
- 哪些指令更有效

一句话：把一次性 vibe 变成可复用经验。

### 2.6 跨工具整合：不止写代码

提醒、消息通知、文档落盘、资料抓取、生成图……都能串起来。

一句话：让开发工作流不止 opencode。

---

## 3）什么时候 OpenClaw 值得用？一个硬标准

用最硬的标准判断：

- 有“离开终端”的需求？（异步、并行、后台）
- 有“交付格式”的需求？（可验收、可复盘、可协作）
- 有“多任务/多分支并行”的需求？
- 有“把 AI 纳入工程制度”的需求？（规则/模板/闭环）

只要其中任意两条是“有”，OpenClaw 基本就开始值。

---

## 4）建议策略：小活直跑，大活上编排

- 日常小任务：直接 `opencode`，别硬上 OpenClaw。
- 下面三类任务：优先 OpenClaw
  1) 长任务 + 不想盯着（B）
  2) 要可验收交付（pytest 输出 + diff + 摘要）
  3) 并行多件事（多个 session / 多个 worktree）

最关键的是把工作流固化成“默认模板”：

- B：后台可控模板
- C：只看结果模板

以后只改两行：`workdir`、`任务目标`。

---

## 5）OpenClaw：AI 指挥中心（能力表）

| 功能 | 说明 | 命令 |
|---|---|---|
| 启动后台任务 | 不阻塞当前会话 | `sessions_spawn task:"..."` |
| 实时监控 | 查看任务输出和进度 | `sessions_history sessionKey:"..."` |
| 任务管理 | 列出、发送消息、强制停止 | `sessions_list`, `sessions_send`, `process action:kill` |
| 上下文管理 | 自动读取 workspace、memory | 内置 |
| 错误处理 | 自动检测和恢复 | 内置 |

---

## 6）OpenCode：AI 编程代理（调用方式）

OpenCode 读取 OpenSpec 规范，自动写代码。支持多种调用方式：

- 命令行：`opencode run "实现功能"`
- OpenClaw exec：`exec command:"opencode run ..."`
- OpenClaw sessions_spawn：`sessions_spawn task:"..."`（推荐）

---

## 7）实战：B 模式（后台可控）——从输入到验收 5 步跑通

### Step 1：在 OpenClaw 客户端运行/输入

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

### Step 2：OpenClaw 执行流程（背后发生什么）

```bash
bash pty:true workdir:~/Projects/your-python-repo background:true \
  command:"opencode run '<上面的任务描述>'"
```

### Step 3：通过 OpenClaw 启动 OpenCode（关键点）

- `pty:true`：交互式 CLI 正常
- `background:true`：不阻塞会话，返回 sessionId
- `workdir:`：锁定项目上下文

### Step 4：实时监控进度

```bash
process action:log sessionId:<SESSION_ID>
process action:poll sessionId:<SESSION_ID>
process action:submit sessionId:<SESSION_ID> data:"yes"
process action:kill sessionId:<SESSION_ID>
```

### Step 5：验证结果

```text
方式B验收：sessionId=<SESSION_ID>
请输出：
1) pytest -q 原样输出
2) 改动文件清单
3) 关键 diff（或关键代码片段）
4) 若失败：失败原因 + 下一步
```

最后建议再补一刀：

```bash
cd ~/Projects/your-python-repo
pytest -q
```

---

## 8）实战：C 模式（省心编排）——只收“交付包”的 5 步流程

### Step 1：在 OpenClaw 客户端运行/输入

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

### Step 2：OpenClaw 执行流程（主会话 vs 子会话）

- 主会话：`sessions_spawn` 起编排子会话
- 子会话：用 `exec + pty:true + background:true` 启动 opencode；再用 `process log/poll/submit` 盯进度

关键点：交付包格式必须写死，否则最后还是一坨终端输出。

### Step 3：通过 OpenClaw 启动 OpenCode（发生在子会话内部）

核心仍然是三件事：workdir 锁定、PTY 开启、pytest -q 验收。

### Step 4：实时监控进度（可选）

- 看子会话 history：`sessions_history sessionKey:"..."`

### Step 5：验证结果

- 按交付包格式回传
- 本地可再次跑 `pytest -q`

---

## 9）两套模板怎么搭配

- 默认用 C：省脑子，只收交付包
- 发现跑偏/交互复杂/输出不确定 → 切回 B 接管

类比：

- C = 自动驾驶
- B = 手动接管

---

## 10）可直接复用的“任务示例”

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

## 11）组合拳的硬核点：把“生成”升级成“交付”

### 11.1 三个硬约束（Scope / Acceptance / Delivery）

1) 范围约束：workdir + 禁止项（不改结构/不加依赖/不改 CI）
2) 验收约束：`pytest -q` 必须跑、必须贴原样输出
3) 交付约束：摘要 + 文件清单 + 关键 diff（失败要给下一步）

只要这三条写死，vibe 才不会变成随机游走。

### 11.2 什么时候用 B？什么时候用 C？

| 维度 | 用 B（可控） | 用 C（省心） |
|---|---|---|
| 交互复杂度 | 高（会频繁问问题） | 低（任务定义清楚） |
| 变更风险 | 高（核心链路/安全相关） | 中低（局部优化/非关键） |
| 你在线程度 | 你在/可随时接管 | 你不想盯/在开会 |
| 输出形态 | 想看过程细节 | 只要交付包 |

### 11.3 固化成团队 SOP 才是大头

当团队开始用 vibe coding，最怕的不是写不出来。
最怕的是每个人各玩各的，最后无法复盘、无法验收、无法规模化。

OpenClaw + OpenCode 这套组合拳，本质是把 AI 开发变成可复制的工程流程：

- 输入模板化（任务/禁止/验收/交付）
- 过程可追踪（sessionId/sessionKey）
- 结果可验收（pytest 原样输出）

固化之后，AI 才会从个人外挂变成团队生产力。

---



#OpenClaw #OpenCode #VibeCoding #Python #pytest #工程化
