---
title: "OpenClaw 直接调用 Hermes CLI 方案"
created: "2026-04-13"
published: true
---
# OpenClaw 直接调用 Hermes CLI 方案

## 一、结论

当前推荐方案：

- 不再把“OpenClaw -> Hermes”默认建成 `inbox/outbox + worker_loop` 的异步文件队列
- 默认改为：`OpenClaw 直接本地调用 Hermes CLI`
- 保留旧的文件桥接脚本作为兼容层与后续异步扩展备用

一句话：

> 同机部署场景下，OpenClaw 作为主入口，直接调用 Hermes CLI 是当前阶段最短、最稳、最好接入的实现。

---

## 二、为什么改成直接调用

这次调整的核心判断是：

- 当前目标是“先把主入口到执行器的直连链路跑通”
- 不是先做一个完整的任务队列系统

因此：

- 如果任务是 OpenClaw 收到后立即转给 Hermes 执行
- 而且 Hermes 本身已经支持 CLI 模式
- 那最自然的实现就是 OpenClaw 直接起 Hermes CLI 子进程

相比旧链路：

```text
OpenClaw
-> 写 task JSON
-> inbox/
-> worker_loop 轮询
-> execute_task.py
-> Hermes CLI
-> outbox/report
-> OpenClaw 回收
```

当前推荐链路：

```text
OpenClaw
-> direct_invoke.py / execute_task.py
-> Hermes CLI
-> 返回 result JSON
-> OpenClaw 回复用户
```

---

## 三、适用场景

这套方案适合：

- OpenClaw 与 Hermes 同机部署
- OpenClaw 是唯一对外入口
- Hermes 主要承担工程执行、分析、读写工作区、生成报告
- 当前以同步执行为主
- 任务量还没大到必须引入任务队列

典型任务：

- 代码分析
- 项目目录扫描
- 配置诊断
- 读文件总结
- 生成实施方案
- 输出技术报告

---

## 四、当前落地文件

本次已落地的核心文件：

- `07-Scripts/openclaw-hermes/execute_task.py`
- `07-Scripts/openclaw-hermes/direct_invoke.py`
- `07-Scripts/openclaw-hermes/collect_result.py`

兼容保留但不再作为默认主路径的旧文件：

- `07-Scripts/openclaw-hermes/submit_task.py`
- `07-Scripts/openclaw-hermes/worker_loop.py`

---

## 五、脚本职责

### 1. `07-Scripts/openclaw-hermes/direct_invoke.py`

定位：

- 给 OpenClaw 直接调用 Hermes 的最小入口脚本
- 不经过 `inbox/worker_loop`
- 适合作为主入口直接 shell/subprocess 调用的统一壳子

职责：

- 接收标题、摘要、target path、instructions 等参数
- 组装标准请求对象
- 直接调用 Hermes CLI
- 返回最终 JSON 或 summary

### 2. `07-Scripts/openclaw-hermes/execute_task.py`

定位：

- 直接调用能力的核心实现
- 同时兼容旧的 `task-*.json` 文件模式

当前支持两种模式：

#### 模式 A：旧兼容模式

```bash
python3 07-Scripts/openclaw-hermes/execute_task.py path/to/task.json
```

#### 模式 B：直接调用模式

```bash
python3 07-Scripts/openclaw-hermes/execute_task.py \
  --title "检查项目配置" \
  --summary "先读 AGENTS.md，再输出结论" \
  --target-path "03-Projects/demo-project" \
  --instruction "先读 AGENTS.md" \
  --instruction "默认非破坏性" \
  --print-json
```

核心职责：

- `build_request(...)`：构造标准任务请求
- `build_prompt(...)`：把请求转成 Hermes 可执行 prompt
- `run_hermes(...)`：本地起 Hermes CLI 子进程
- `execute_request(...)`：执行并返回最终 payload
- `ensure_fallback_result(...)`：Hermes 未落结果 JSON 时自动兜底

### 3. `07-Scripts/openclaw-hermes/collect_result.py`

定位：

- 把结果 JSON 转成适合 OpenClaw 回复用户的文本块
- 现在文案已去掉对 `worker` 的强绑定

---

## 六、实际调用机制

### 1. OpenClaw 侧发起调用

OpenClaw 直接调用：

```text
python3 07-Scripts/openclaw-hermes/direct_invoke.py ...
```

### 2. `direct_invoke.py` 内部构造请求

请求包含这些核心字段：

- `task_id`
- `title`
- `summary`
- `workspace`
- `target_path`
- `instructions`
- `deliverables`
- `constraints`
- `output.report_path`
- `output.result_path`

### 3. `execute_task.py` 组装 prompt 并执行

内部最终通过子进程调用 Hermes CLI：

```text
python -m hermes_cli.main chat -q "<prompt>" --source tool
```

执行时会显式设置：

- `HERMES_HOME`
- `TERMINAL_CWD`
- `MESSAGING_CWD`
- `cwd=workspace`

### 4. Hermes 返回执行结果

结果优先写到：

- `90-System/shared/outbox/result-<task_id>.json`
- `90-System/shared/reports/report-<task_id>.md`

如果 Hermes 没按约定写结果 JSON，桥接脚本会自动回填 fallback result。

---

## 七、推荐接入方式

### 方案 A：OpenClaw 直接调 `direct_invoke.py`

这是当前默认推荐。

示例：

```bash
python3 07-Scripts/openclaw-hermes/direct_invoke.py \
  --title "检查 demo-project 配置" \
  --summary "先读 AGENTS.md，检查配置问题，先给结论再给依据" \
  --target-path "03-Projects/demo-project" \
  --instruction "先读 AGENTS.md" \
  --instruction "默认非破坏性" \
  --instruction "先给结论，再给依据" \
  --deliverable summary \
  --print-json
```

适合：

- 主入口直接执行
- OpenClaw 直接拿 stdout / 退出码 / result JSON
- 不想暴露内部实现细节给主逻辑

### 方案 B：OpenClaw 直接调 `execute_task.py`

如果不想再多套一层壳，也可以直接调：

```bash
python3 07-Scripts/openclaw-hermes/execute_task.py \
  --title "检查 demo-project 配置" \
  --summary "先读 AGENTS.md，检查配置问题，先给结论再给依据" \
  --target-path "03-Projects/demo-project" \
  --instruction "先读 AGENTS.md" \
  --instruction "默认非破坏性" \
  --print-json
```

---

## 八、OpenClaw 侧建议拿什么结果

建议最少拿这几项：

- 进程退出码
- stdout
- `result-*.json`

重点字段：

- `status`
- `summary`
- `artifacts.report_path`
- `error`

推荐回复策略：

1. 先给结论
2. 再给状态
3. 再给摘要
4. 如果有报告路径，再附上路径

---

## 九、当前验证结果

本次已完成以下验证：

### 1. 语法验证

已通过：

```bash
python3 -m py_compile \
  07-Scripts/openclaw-hermes/execute_task.py \
  07-Scripts/openclaw-hermes/direct_invoke.py \
  07-Scripts/openclaw-hermes/collect_result.py
```

### 2. 直接调用烟雾测试

已生成测试结果：

- `90-System/shared/outbox/result-direct-20260412-120003.json`

测试结果摘要：

- `status: completed`
- `worker: hermes-direct-cli`
- `summary: 烟雾测试已通过。`

---

## 十、这套方案相对旧文件桥接的优势

### 优势

- 链路更短
- 调试更简单
- 延迟更低
- 更适合当前同机直连场景
- 更贴合 Hermes 已有 CLI 能力

### 代价

- 默认更偏同步执行
- 对超长任务、队列管理、并发调度支持较弱
- 如果后续任务量上来，仍可能需要重新引入异步任务层

---

## 十一、什么时候再回到文件桥接 / 队列模式

当出现下面这些情况时，再考虑把 `submit_task.py + worker_loop.py` 重新升为主路：

- 长任务越来越多
- 需要异步回收结果
- 需要失败重试
- 需要任务排队
- 需要多 worker 并发消费
- 需要任务状态机与更强的审计追踪

一句话：

> 当前先用“直调 CLI”跑通主链路；只有当同步直调不够用时，再升级回任务队列。

---

## 十二、推荐口径

后续统一对外描述建议使用：

```text
OpenClaw 作为主入口，在本机直接调用 Hermes CLI 执行重任务。
当前默认不经过 inbox/worker_loop 异步队列。
旧的文件桥接脚本仍保留，作为兼容模式和后续异步扩展备用。
```

---

## 十三、相关文件引用

- 主文档：`01-Articles/2026-04-12-OpenClaw-直接调用-Hermes-CLI-方案.md`
- 直接调用脚本：`07-Scripts/openclaw-hermes/direct_invoke.py`
- 核心执行脚本：`07-Scripts/openclaw-hermes/execute_task.py`
- 结果渲染脚本：`07-Scripts/openclaw-hermes/collect_result.py`
- 旧 worker 脚本：`07-Scripts/openclaw-hermes/worker_loop.py`
- 旧提交脚本：`07-Scripts/openclaw-hermes/submit_task.py`
- 共享工作区方案：`OpenClaw Hermes Obsidian 共享工作区方案`
- 最小闭环桥接方案：`boeai_murph_bot 到 Hermes worker 最小闭环桥接方案`
- 实施骨架记录：`Murph 调用 Hermes 实施进度与脚本骨架`

---

## 十四、最终建议

当前阶段直接拍板：

- 默认主路径：`OpenClaw -> direct_invoke.py -> Hermes CLI`
- 保留兼容路径：`OpenClaw -> task.json -> worker_loop -> Hermes CLI`
- 真正需要异步队列时，再切回旧桥接模式

一句话收口：

> 这版方案的核心不是再造一个任务系统，而是先把 OpenClaw 到 Hermes 的最短可用链路固定下来。