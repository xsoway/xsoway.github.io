---
title: "2026-04-25-OpenClaw-Hermes-触发词直连模板"
created: "2026-04-12"
tags: ["KnowledgeBase","OpenClaw","Hermes","AIAgent","EngineeringPractice","Workflow","Inbox","AI","Agent","Code","Project","Testing"]
category: "Notes"
published: true
---
# OpenClaw Hermes 触发词直连模板

## 一、目标

让 OpenClaw 在收到下面这种消息时：

```text
使用hermes来完成 XXX 任务
```

直接调用 Hermes CLI，而不是走普通回复流程。

- --

## 二、当前可用实现

已新增脚本：

- `07-Scripts/openclaw-hermes/route_by_trigger.py`

作用：

1. 识别触发词
2. 提取真正任务文本
3. 直接调用 `direct_invoke.py`
4. 返回适合 OpenClaw 发给用户的结果

- --

## 三、当前支持的触发格式

当前脚本支持：

- `使用hermes来完成 XXX`
- `用hermes来完成 XXX`
- `hermes: XXX`
- `hermes，XXX`

例如：

- `使用hermes来完成 检查当前工作区规则并只返回一句话`
- `用hermes来完成 扫描 demo-project 并给出配置问题`
- `hermes: 检查 03-Projects/demo-project 目录结构`

- --

## 四、OpenClaw 主入口最小接入方式

```python
import subprocess
from pathlib import Path

WORKSPACE = Path('[本机路径已隐藏])
ROUTER = WORKSPACE / '07-Scripts' / 'openclaw-hermes' / 'route_by_trigger.py'

def handle_user_message(user_text: str) -> str:
    cmd = [
        'python3',
        str(ROUTER),
        user_text,
        '--timeout', '600',
    ]

    completed = subprocess.run(
        cmd,
        cwd=str(WORKSPACE),
        capture_output=True,
        text=True,
        timeout=660,
    )

    stdout = (completed.stdout or '').strip()

    if completed.returncode == 0:
        return stdout

    if completed.returncode == 1:
        return '这条不是 Hermes 触发词消息，继续走 OpenClaw 普通处理逻辑。'

    return f'Hermes 调用失败：{stdout or (completed.stderr or "unknown error")}'
```

- --

## 五、推荐主入口路由逻辑

```python
def handle_user_message(user_text: str) -> str:
    hermes_reply = try_handle_by_hermes_trigger(user_text)
    if hermes_reply is not None:
        return hermes_reply

    return handle_normal_openclaw_message(user_text)
```

其中：

```python
def try_handle_by_hermes_trigger(user_text: str) -> str | None:
    cmd = [
        'python3',
        '07-Scripts/openclaw-hermes/route_by_trigger.py',
        user_text,
        '--timeout', '600',
    ]
    completed = subprocess.run(
        cmd,
        cwd='[本机路径已隐藏]
        capture_output=True,
        text=True,
        timeout=660,
    )

    stdout = (completed.stdout or '').strip()
    stderr = (completed.stderr or '').strip()

    if completed.returncode == 0:
        return stdout

    if completed.returncode == 1:
        return None

    return f'结论：Hermes 调用失败。\n\n错误：{stderr or stdout}'
```

- --

## 六、真实验证结果

已经验证通过：

输入：

```text
使用hermes来完成 检查当前工作区规则并只返回一句话
```

脚本成功识别并调用 Hermes，返回：

- `matched: true`
- `status: completed`
- `summary: 已按 AGENTS.md 与相关规则完成检查，本次任务仅做非破坏性读取并返回一句话。`

普通消息测试：

```text
这是一条普通消息
```

返回：

```json
{"matched": false, "reason": "no hermes trigger found"}
```

- --

## 七、建议拍板

现在最省事的做法就是：

- 在 OpenClaw 主入口最前面加一层触发词检测
- 用户只要发：`使用hermes来完成 XXX`
- 就直接转给 `route_by_trigger.py`
- 由它再调 Hermes CLI

一句话收口：

> 你要的这条链路，现在已经可以按“触发词 -> 直接调 Hermes CLI”来跑了。
