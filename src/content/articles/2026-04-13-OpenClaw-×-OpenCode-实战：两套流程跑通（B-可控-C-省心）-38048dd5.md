---
title: "2026-04-13-OpenClaw-×-OpenCode-实战：两套流程跑通（B-可控-C-省心）"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
> 图片资源未同步：未命名图片

# OpenClaw × OpenCode 实战：两套流程跑通（B 可控 / C 省心）

很多“没看懂”并不是概念问题，而是缺一份**像跑脚本一样的操作单**：

- 第 1 步在 OpenClaw 客户端输入什么
- 第 2 步 OpenClaw 背后执行了什么
- 第 3 步怎么启动 OpenCode
- 第 4 步怎么实时盯进度
- 第 5 步怎么验收（别让 Agent 嘴硬）

这篇直接交付两套能抄的 SOP（Python 项目、pytest 验收）。

---

## 0）先把角色分清：一个是控制面，一个是执行面

| 组件 | 角色定位 | 主要价值 | 一句话理解 |
|---|---|---|---|
| OpenClaw | 指挥中心（控制面） | 后台任务、监控、打断、收敛输出 | “调度台” |
| OpenCode | 编程代理（执行面） | 读代码、改代码、跑测试、产出 commit | “干活的” |

本质只有一句：

> **OpenClaw 负责把 `opencode run ...` 变成“可追踪的后台任务”。**

硬规则三条（不讲情面）：

1) **PTY 必开**（OpenCode 是交互式终端）
2) **workdir 必给**（锁定 repo 根目录）
3) **验收写死：pytest -q**（拒绝“应该好了”）

---

## 1）流程 B：后台可控（拿 sessionId 手动接管）

适用：想随时看日志、随时喂输入、随时 kill。

### B-1 在 OpenClaw 客户端输入（照抄）

把路径换成真实 repo：

```text
方式B（后台可控）
workdir=~/Projects/your-python-repo

目标：修复 /api/login 偶发 500
禁止：不新增依赖；不改目录结构；不改 CI 配置
要求：补 pytest（主流程 + 1 个错误分支）
验收：必须运行 pytest -q 并贴出原样输出
交付：变更摘要 + 文件清单 + 关键 diff

执行：用 OpenClaw 在 workdir 后台启动 opencode run，并把 process sessionId 返回。
```

### B-2 OpenClaw 背后会执行什么（理解一次就够）

核心就是启动一个后台终端进程（必须 PTY）：

```bash
bash pty:true workdir:~/Projects/your-python-repo background:true \
  command:"opencode run '<上面的任务描述>'"
```

执行成功会拿到 `sessionId`。

### B-3 通过 OpenClaw 启动 OpenCode（发生了什么）

OpenCode 被真正启动的是这一句：

```bash
opencode run "..."
```

OpenClaw 只是把它：

- 限定在 `workdir`
- 变成后台进程
- 赋予可监控的 sessionId

### B-4 实时监控进度（最常用 3 招）

**1）看实时输出**

```text
查看B日志：sessionId=<SESSION_ID>
```

等价于：

```bash
process action:log sessionId:<SESSION_ID>
```

**2）确认是否结束**

```text
B完成了吗：sessionId=<SESSION_ID>
```

等价于：

```bash
process action:poll sessionId:<SESSION_ID>
```

**3）它卡住问你问题时喂输入**

```text
B喂输入：sessionId=<SESSION_ID>
回答：yes
```

等价于：

```bash
process action:submit sessionId:<SESSION_ID> data:"yes"
```

需要强制刹车：

```bash
process action:kill sessionId:<SESSION_ID>
```

### B-5 验证结果（把交付格式写死）

```text
B验收：sessionId=<SESSION_ID>
请按顺序输出：
1) pytest -q 原样输出
2) 改动文件清单
3) 关键 diff/关键代码片段
4) 若失败：失败原因 + 下一步
```

最后再补一刀（最稳）：

```bash
cd ~/Projects/your-python-repo
pytest -q
```

---

## 2）流程 C：sessions_spawn 编排（只收“交付包”）

适用：不想盯过程，目标是“收一份能验收的交付包”。

### C-1 在 OpenClaw 客户端输入（照抄）

```text
方式C（只看结果/编排）
workdir=~/Projects/your-python-repo

请用 sessions_spawn 启动一个编排子会话。
子会话必须做到：
- 在 workdir 内用 PTY 启动 OpenCode：opencode run "..."
- 全程监控，必要时处理交互
- 最后只把交付包回传主会话

开发任务：修复 /api/login 偶发 500
禁止：不新增依赖；不改目录结构；不改 CI
必须：补 pytest（主流程 + 1 个错误分支）
验收：pytest -q

交付包格式（必须严格按此输出）：
1) 变更摘要（做了什么）
2) 改动文件清单
3) pytest -q 原样输出
4) 关键 diff/关键代码片段
5) 风险点/后续建议（可选）

执行后请返回子会话 sessionKey。
```

### C-2 OpenClaw 执行流程（主会话 vs 子会话）

| 层级 | 做的事 | 你关心的输出 |
|---|---|---|
| 主会话 | `sessions_spawn` 拉起子会话 | sessionKey |
| 子会话 | `exec` 启动 opencode + `process` 盯日志 | 最终交付包 |

核心点：

> **C 模式的关键不是跑不跑得起来，而是“交付包格式”必须写死。**

### C-3 需要中途看进度？（可选）

```text
查看C进度：sessionKey=<SESSION_KEY>
```

等价于：

- `sessions_history(sessionKey)` 查看过程输出

---

## 3）怎么选 B 还是 C（一句话版）

- **默认 C**：省脑子，收交付包
- **遇到跑偏/交互多/要精细控制 → 切 B**：拿 sessionId 接管

像开车：

- C = 自动驾驶
- B = 手动接管

---

## 4）一张清单：最容易翻车的点

| 翻车点 | 症状 | 解决方式 |
|---|---|---|
| 忘开 PTY | 输出花、交互失灵、卡住 | 所有启动都 `pty:true` |
| workdir 不对 | 改错目录、找不到文件 | workdir 必须是 repo 根 |
| 验收没写死 | “应该好了” | 强制 `pytest -q` 原样输出 |
| 交付不成型 | 一坨日志 | 输出模板写死（摘要/文件/pytest/diff） |

---

## 封面3要点

- B：sessionId 接管
- C：只收交付包
- pytest 写死验收

## 封面素材

- punchline: 别让Agent嘴硬
- tags: OpenClaw/OpenCode/pytest
- layout: auto

## 爆款标题备选（任选其一）

1. OpenClaw×OpenCode 实战教程：从输入到验收，一步步跑通
2. 别再“没看懂”：两套 SOP 直接抄（B 可控 / C 省心）
3. 用 pytest -q 给 Agent 定价：OpenClaw 编排 OpenCode 的正确姿势
4. sessionId 与 sessionKey 怎么用？一篇讲清楚 B/C 两种模式
5. 让 opencode 变后台任务：OpenClaw 的价值就在这里

**推荐标签**：#OpenClaw #OpenCode #Python #pytest #AI编程
