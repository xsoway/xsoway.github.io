---
title: "OpenClaw 调用 Hermes CLI 实现过程"
created: "2026-04-12"
tags: ["KnowledgeBase","OpenClaw","Hermes","AIAgent","EngineeringPractice","Workflow","Draft"]
category: "Articles"
published: true
---
# OpenClaw 调用 Hermes CLI 实现过程

## 一、结论

当前这套实现的核心不是 API，也不是 MCP，而是：

```text
OpenClaw
-> 触发词或主入口路由
-> Python 脚本
-> Hermes CLI 子进程
-> result JSON / report
-> OpenClaw 收口回复
```

一句话：

> OpenClaw 通过本机 Python 脚本起 Hermes CLI 子进程，把 Hermes 当作一个“可直接调用的执行引擎”来用。

---

## 二、为什么这样实现

这套实现优先解决的是：

- 同机部署下尽快跑通主链路
- 不引入额外 API 服务
- 不先做任务队列系统
- 保留结果留痕
- 让 OpenClaw 可以在需要时显式把任务交给 Hermes

因此最终选择：

- 主入口显式路由
- Python subprocess 调用 Hermes CLI
- 用 JSON 作为稳定结果输出
- 必要时再落报告文件

---

## 三、当前涉及的核心文件

### 1. 触发词路由
- `07-Scripts/openclaw-hermes/route_by_trigger.py`

作用：
- 识别 `用hermes ...` / `使用hermes ...` / `hermes: ...`
- 提取任务正文
- 调用 `direct_invoke.py`
- 返回适合 OpenClaw 回复用户的结果

### 2. 直接调用入口
- `07-Scripts/openclaw-hermes/direct_invoke.py`

作用：
- 接收 title / summary / target path / instructions
- 构造标准请求对象
- 调用 `execute_task.py` 的核心方法

### 3. 核心执行脚本
- `07-Scripts/openclaw-hermes/execute_task.py`

作用：
- 把请求转成 Hermes 可执行 prompt
- 真正起 Hermes CLI 子进程
- 处理 stdout / stderr / timeout / fallback result

### 4. 结果渲染
- `07-Scripts/openclaw-hermes/collect_result.py`

作用：
- 把结果 JSON 转成适合 OpenClaw 对外回复的文本块

### 5. 工作区规则入口
- `AGENTS.md`

作用：
- 明确声明：命中 `用hermes` / `使用hermes` / `用hermes来完成` / `使用hermes来完成` / `hermes:` 等前缀时，默认直接转 Hermes
- 明确声明推荐执行脚本：`07-Scripts/openclaw-hermes/route_by_trigger.py`
- 作为工作区级规则入口，为遵守工作区规则的主入口 / Agent 提供第一层触发约束

### 6. Skill 入口
- `~/.hermes/skills/openclaw-imports/openclaw-hermes-trigger/SKILL.md`
- 技能名：`openclaw-imports/openclaw-hermes-trigger`

作用：
- 把“显式说用hermes就直转 Hermes CLI”这件事，固化为独立 skill
- 作为零侵入兜底入口：即使主入口源码暂时没改，也可以通过加载 skill 的方式提升命中概率
- 明确约定返回码语义与执行链：`route_by_trigger.py -> direct_invoke.py -> execute_task.py -> Hermes CLI`

---

## 四、调用链拆解

## 步骤 1：用户在 Telegram 对 OpenClaw 发消息

例如：

```text
用hermes 检查 03-Projects/demo-project 配置问题并给出修复建议
```

这条消息先进入 OpenClaw 主入口。

---

## 步骤 2：OpenClaw 判断是否命中 Hermes 显式触发

这一步当前有两个入口共同承担：

### 入口 A：工作区规则入口（AGENTS.md）
工作区里已经明确声明：

- `用hermes`
- `使用hermes`
- `用hermes来完成`
- `使用hermes来完成`
- `hermes:`

一旦命中，就不再走普通轻量问答逻辑。

### 入口 B：Skill 兜底入口（openclaw-hermes-trigger）
技能 `openclaw-imports/openclaw-hermes-trigger` 也重复固化了同样的规则：

- 遇到上述显式前缀时，直接转 Hermes CLI
- 不当作普通轻量请求处理
- 统一走 `route_by_trigger.py`

也就是说：

```text
AGENTS.md = 工作区规则入口
Skill = 零侵入兜底入口
```

---

## 步骤 3：OpenClaw 调用触发词脚本

推荐调用方式：

```bash
python3 07-Scripts/openclaw-hermes/route_by_trigger.py "<用户原始消息>" --timeout 600
```

如果主入口是 Python，通常会是：

```python
completed = subprocess.run(
    ['python3', '07-Scripts/openclaw-hermes/route_by_trigger.py', user_text, '--timeout', '600'],
    cwd='[本机路径已隐藏]
    capture_output=True,
    text=True,
    timeout=660,
)
```

---

## 步骤 4：`route_by_trigger.py` 提取真正任务文本

例如：

```text
用hermes 检查当前工作区规则并只返回一句话
```

会被提取成：

```text
检查当前工作区规则并只返回一句话
```

也就是把“触发前缀”和“真正任务正文”分开。

---

## 步骤 5：`route_by_trigger.py` 再调用 `direct_invoke.py`

内部调用大意如下：

```python
cmd = [
    'python3',
    str(DIRECT_INVOKE),
    '--title', 'OpenClaw 触发词转发任务',
    '--summary', task_text,
    '--target-path', target_path,
    '--instruction', '先读 AGENTS.md',
    '--instruction', '默认非破坏性',
    '--instruction', '先给结论，再给依据',
    '--deliverable', 'summary',
    '--print-json',
]
```

这里已经把 OpenClaw 的约束传给 Hermes 了。

---

## 步骤 6：`direct_invoke.py` 构造标准请求对象

请求里至少会包含这些字段：

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

这一步的目的，是把“用户一句自然语言消息”变成“可稳定执行的结构化请求”。

---

## 步骤 7：`execute_task.py` 把请求转成 prompt

`execute_task.py` 会把上面的结构化请求转成 Hermes CLI 可直接理解的一段 prompt。

Prompt 核心会说明：

- 工作区根目录是什么
- 先读 `AGENTS.md`
- 默认非破坏性
- 要不要生成报告
- 结果 JSON 应该写到哪里
- 最终至少给一句结论

也就是：

```text
结构化请求 -> 标准执行 prompt
```

---

## 步骤 8：真正起 Hermes CLI 子进程

这是整个实现的核心点。

内部最终执行的命令是：

```text
python -m hermes_cli.main chat -q "<prompt>" --source tool
```

实现方式是 Python 的：

```python
subprocess.run(cmd, cwd=str(workspace), env=env, capture_output=True, text=True, timeout=timeout)
```

同时会显式设置：

- `HERMES_HOME`
- `TERMINAL_CWD`
- `MESSAGING_CWD`
- `cwd=workspace`

这一步决定了 Hermes 是在正确工作区里运行，而不是在随机目录执行。

---

## 步骤 9：Hermes 执行任务并输出结果

Hermes 执行后，优先会产出：

- 结构化结果：
  `90-System/shared/outbox/result-<task_id>.json`
- 长报告（如有）：
  `90-System/shared/reports/report-<task_id>.md`

结果 JSON 最关键的字段是：

- `status`
- `summary`
- `artifacts.report_path`
- `error`

如果 Hermes 没按约定写 JSON，`execute_task.py` 还会自动补一个 fallback result，避免 OpenClaw 端拿不到结果。

---

## 步骤 10：OpenClaw 拿 stdout / result JSON 收口回复

OpenClaw 主入口建议优先拿：

1. 子进程返回码
2. stdout 中的 JSON
3. 必要时再读 `result-*.json`
4. 如果有长报告，再带上 `report_path`

最终对用户回复建议统一成：

- 结论
- 状态
- 摘要
- 报告路径（如有）
- 错误（如失败）

---

## 五、返回码约定

当前触发词脚本建议按这个约定理解：

### 返回码 0
表示：
- 已命中 Hermes 触发词
- 已成功调用 Hermes
- 可以直接把输出发回用户

### 返回码 1
表示：
- 没命中 Hermes 触发词
- 应继续走 OpenClaw 默认逻辑

### 其他非零返回码
表示：
- Hermes 调用失败
- 应返回失败信息和错误摘要

---

## 六、为什么还要保留 result JSON / report

虽然当前已经是“直调 CLI”方案，但仍保留：

- `outbox/result-*.json`
- `reports/report-*.md`

原因是：

- 便于排障
- 便于留痕
- 便于后续结果回查
- 便于未来再演进回异步队列模式

所以现在这套实现是：

```text
同步调用为主
+ 结果文件留痕为辅
```

---

## 七、为什么这套实现适合当前阶段

优势很直接：

- 链路短
- 同机调用成本低
- 不需要额外 API 服务
- 不需要先做 worker / queue
- 失败点清晰
- 便于快速验证

也就是说：

> 对当前场景来说，Hermes 更像“本机执行引擎”，而不是“远端服务”。

---

## 八、当前已验证的事实

本地已验证通过：

### 1. 触发词命中
输入：

```text
用hermes 检查当前工作区规则并只返回一句话
```

结果：
- 成功命中触发词
- 成功提取任务正文
- 成功调用 Hermes

### 2. 执行完成
结果状态：
- `status: completed`

### 3. 普通消息不会误触发
输入普通消息时，会返回：

```json
{"matched": false, "reason": "no hermes trigger found"}
```

---

## 九、当前文档、规则与 Skill 落点

规则与实现已经分别落在：

- 工作区规则入口：`AGENTS.md`
- Skill 兜底入口：`~/.hermes/skills/openclaw-imports/openclaw-hermes-trigger/SKILL.md`
- Skill 名：`openclaw-imports/openclaw-hermes-trigger`
- 触发词脚本：`07-Scripts/openclaw-hermes/route_by_trigger.py`
- 直接调用入口：`07-Scripts/openclaw-hermes/direct_invoke.py`
- 核心执行脚本：`07-Scripts/openclaw-hermes/execute_task.py`

---

## 十、最终收口

这套实现过程可以概括成一句话：

```text
用户显式说“用hermes ...”
-> OpenClaw 命中触发规则
-> 调 route_by_trigger.py
-> 调 direct_invoke.py
-> 调 execute_task.py
-> subprocess 起 Hermes CLI
-> 返回 JSON / 报告
-> OpenClaw 对外收口
```

一句话收口：

> 当前 OpenClaw 调 Hermes CLI 的实现，本质上是一条“显式触发 -> 本机脚本 -> 子进程执行 -> 结构化结果回收”的直连链路。
