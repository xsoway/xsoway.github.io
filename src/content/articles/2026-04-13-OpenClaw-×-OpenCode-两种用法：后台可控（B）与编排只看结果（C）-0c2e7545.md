---
title: "OpenClaw × OpenCode 两种用法：后台可控（B）与编排只看结果（C）"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
> 图片资源未同步：未命名图片

# OpenClaw × OpenCode 两种用法：后台可控（B）与编排只看结果（C）





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

---

## 0）通用硬规则（两种用法都要遵守）

### 0.1 PTY 必须开
OpenCode 是交互式终端程序。不开 PTY 可能：输出乱、卡住、交互失灵。

> 规则：**所有 opencode 命令都用 `pty:true`**。

### 0.2 workdir 必须固定到项目根目录
否则 Agent 会跑偏、读错上下文、改错目录。

> 规则：**所有 opencode 命令都带 `workdir:/path/to/repo`**。

### 0.3 验收必须写死
AI 最爱说“应该好了”。

> 规则：**验收命令必须是 `pytest -q`，并要求贴出输出**。

---

## B）后台可控：exec background + process 追踪（推荐先把这套吃透）

这是你要“稳”和“可控”的版本：

- 你启动 OpenCode 为后台进程
- OpenClaw 返回 `sessionId`
- 你用 `process log/poll/submit/kill` 控制它

### B-1）启动后台任务（拿到 sessionId）

把 `workdir` 改成你的项目路径即可。

```bash
bash pty:true workdir:~/Projects/your-python-repo background:true command:"opencode run '
任务目标：
- 修复 /api/login 偶发 500

约束/禁止：
- 不新增依赖
- 不改目录结构
- 不改 CI 配置

实现要求：
- 输出根因定位过程（异常堆栈、触发条件、影响范围）
- 修复后补 pytest 回归用例（主流程 + 1 个错误分支）

验收方式：
- 运行：pytest -q
- 预期：全绿，并贴出 pytest 输出

交付：
- 说明改了哪些文件
- 如有必要，拆 1 个 commit：fix: stabilize login 500
'" 
```

你会拿到一个 `sessionId`（后面所有操作都靠它）。

### B-2）看实时输出（不打断它）

```bash
process action:log sessionId:<SESSION_ID>
```

### B-3）看它是不是跑完了

```bash
process action:poll sessionId:<SESSION_ID>
```

### B-4）它问你问题时：喂输入

```bash
# 短回答：输入并回车
process action:submit sessionId:<SESSION_ID> data:"yes"

# 长回答：粘贴（更不容易把格式搞坏）
process action:paste sessionId:<SESSION_ID> text:"(你的回答...)" bracketed:true
```

### B-5）它跑偏/卡死：直接 kill

```bash
process action:kill sessionId:<SESSION_ID>
```

### B-6）最常见的“可控点”（你应该盯什么）

| 你要盯的点 | 你看日志里什么 | 典型问题 |
|---|---|---|
| 有没有改到不该改的地方 | 大范围重构/移动目录/加依赖 | AI 自作主张 |
| pytest 是否真的跑了 | `pytest -q` 输出是否出现 | “应该好了”诈骗 |
| 测试是不是瞎测 | 测试只 mock 内部逻辑、没跑真实路径 | 假绿 |
| 提交是否干净 | diff 是否聚焦、commit 是否合理 | 大杂烩 PR |

> B 的核心价值：你能随时接管。

---

## C）sessions_spawn 编排：你只看结果（但要懂它在背后怎么做）

这套的目标是：**你在主会话不盯进度**。

做法：

- 用 `sessions_spawn` 启动一个“后台子会话”
- 子会话负责：在指定 workdir 用 exec 启动 OpenCode（依然是 PTY + background），并持续监控
- 子会话最后把“交付结果”整理回传

重要澄清：

> `sessions_spawn` 本身不会自动跑 opencode。
> **你必须在 task 里要求子会话去 exec `opencode run ...`，并要求它盯到 pytest -q 结束。**

### C-1）你在主会话发起：spawn 一个“编排任务”

下面这段可以直接抄（把路径和目标改掉）：

```text
sessions_spawn task:" 
你是 OpenClaw 的后台编排子会话。

目标：在 ~/Projects/your-python-repo 内，用 OpenCode 完成开发任务。

执行要求：
1) 必须用 PTY 启动 OpenCode：opencode run '...'
2) 必须在项目根目录执行（workdir=~/Projects/your-python-repo）
3) 必须补 pytest 用例（主流程 + 1 个错误分支）
4) 最后必须运行 pytest -q，并把输出完整带回

禁止项：
- 不新增依赖
- 不改目录结构
- 不改 CI 配置

交付格式（必须按这个返回）：
- 变更摘要（改了哪些文件/做了什么）
- pytest -q 输出（原样粘贴）
- 关键 diff（或关键代码片段）
- 后续建议（可选）

开发任务：
- 修复 /api/login 偶发 500，输出根因并修复
" 
```

### C-2）子会话如何“看进度/接管”

如果你中途想看它在干嘛：

- `sessions_list` 找到子会话
- `sessions_history` 拉它的过程输出

（这部分操作我可以在你实际用的时候帮你直接做，不用你手敲。）

### C-3）C 的优点与代价

| 维度 | 优点 | 代价 |
|---|---|---|
| 你的精力 | 只看最终交付 | 中途细节不透明（除非你去查 history） |
| 稳定性 | 子会话可以持续盯 log、处理交互 | 写 task 不清楚会导致“子会话也跑偏” |
| 结果质量 | 更像一份交付报告（摘要+测试+diff） | 需要你把验收/禁止写得很硬 |

---

## 6）选 B 还是 C？一句话策略

- **先用 B 跑通 1~2 次**：你会真正理解 sessionId/log/kill 的控制点
- **再用 C 批量化**：把盯进度外包给子会话，你只看结果

最实战的组合是：

> 默认 C（省心） + 关键任务切回 B（接管、精细干预）。

---

## 7）附：一份“通用 Python/pytest 任务模板”（两种方式都能用）

```text
任务目标：
- ...

约束/禁止：
- 不新增依赖
- 不改目录结构
- 不改 CI 配置

实现要求：
- 输出定位过程（异常、触发条件、影响范围）
- 新增/更新 pytest：主流程 + 1 个错误分支
- 若涉及外部请求：必须 stub（CI 不打外网）

验收方式：
- 必须运行：pytest -q
- 必须贴出输出

交付：
- 变更摘要（文件清单）
- pytest 输出
- 关键 diff/代码片段
```

---

#OpenClaw #OpenCode #Python #pytest #AI编程
