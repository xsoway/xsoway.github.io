---
title: "OpenClaw 主入口接入 Hermes CLI 最小实现模板"
created: "2026-04-13"
published: true
---
# OpenClaw 主入口接入 Hermes CLI 最小实现模板

## 一、结论

如果你现在要在 OpenClaw 主入口里直接调起 Hermes，最小实现建议就是：

- 主入口收到用户消息
- 判断是否属于 Hermes 型任务
- 用 `subprocess.run(...)` 直接调用：
  - `07-Scripts/openclaw-hermes/direct_invoke.py`
- 读取 stdout / 退出码
- 再读取 `result-*.json`
- 最后由 OpenClaw 整理后回复用户

一句话：

> OpenClaw 不需要先写 `task.json` 再等 worker，直接在主入口里起一个 Hermes CLI 子进程即可。

---

## 二、这篇文档解决什么问题

这篇文档只回答一个问题：

```text
在 OpenClaw 里，具体怎么调 Hermes？
```

因此重点只放在：

- 主入口怎么判断是否交给 Hermes
- 主入口怎么拼命令
- 主入口怎么执行命令
- 主入口怎么拿结果
- 主入口怎么回用户

---

## 三、默认前提

当前模板默认以下前提成立：

- OpenClaw 和 Hermes 在同一台机器
- 工作区是：`[本机路径已隐藏]`
- Hermes 已可通过本地 Python 环境执行
- 已存在以下脚本：
  - `07-Scripts/openclaw-hermes/direct_invoke.py`
  - `07-Scripts/openclaw-hermes/execute_task.py`
- OpenClaw 主入口有能力运行本机 shell / subprocess

相关基础方案先看：

- OpenClaw 直接调用 Hermes CLI 方案

---

## 四、主入口里该怎么判断要不要调 Hermes

建议把下面这类任务视为 Hermes 型任务：

- 改代码
- 查 bug
- 读项目目录
- 跑测试
- 调配置
- 读多个文件后输出方案
- 基于代码或目录生成技术文档
- 需要 shell / git / 文件系统操作的任务

可以先用最简单规则：

```python
HERMES_KEYWORDS = [
    '代码', 'bug', '测试', '配置', '项目', '目录', '脚本', 'README',
    '排查', '修复', '重构', 'git', 'shell', '终端', '文件', '工程'
]

def should_route_to_hermes(text: str) -> bool:
    lowered = text.lower()
    return any(k in text or k in lowered for k in HERMES_KEYWORDS)
```

这不是最终版分类器，但足够先打通主链路。

---

## 五、最小调用链

推荐主链路：

```text
用户消息
-> OpenClaw 主入口
-> 判断为 Hermes 型任务
-> subprocess 调 direct_invoke.py
-> Hermes CLI 执行
-> 返回 stdout + result JSON
-> OpenClaw 整理结果
-> 回复用户
```

---

## 六、主入口最小实现模板

下面给一版最小可抄模板。

### 模板 1：Python 主入口直接调用 Hermes

```python
import json
import subprocess
from pathlib import Path

WORKSPACE = Path('[本机路径已隐藏])
DIRECT_INVOKE = WORKSPACE / '07-Scripts' / 'openclaw-hermes' / 'direct_invoke.py'


def invoke_hermes_from_openclaw(user_text: str, target_path: str = '.') -> dict:
    cmd = [
        'python3',
        str(DIRECT_INVOKE),
        '--title', 'OpenClaw 主入口转发任务',
        '--summary', user_text,
        '--target-path', target_path,
        '--instruction', '先读 AGENTS.md',
        '--instruction', '默认非破坏性',
        '--instruction', '先给结论，再给依据',
        '--deliverable', 'summary',
        '--print-json',
    ]

    completed = subprocess.run(
        cmd,
        cwd=str(WORKSPACE),
        capture_output=True,
        text=True,
        timeout=600,
    )

    stdout = (completed.stdout or '').strip()
    stderr = (completed.stderr or '').strip()

    if completed.returncode != 0:
        return {
            'ok': False,
            'status': 'failed',
            'summary': 'Hermes 调用失败',
            'error': stderr or stdout or f'returncode={completed.returncode}',
        }

    try:
        payload = json.loads(stdout)
    except json.JSONDecodeError:
        return {
            'ok': False,
            'status': 'failed',
            'summary': 'Hermes 返回结果不是合法 JSON',
            'error': stdout or stderr,
        }

    return {
        'ok': True,
        'status': payload.get('status', 'unknown'),
        'summary': payload.get('summary', ''),
        'report_path': (payload.get('artifacts') or {}).get('report_path'),
        'error': payload.get('error'),
        'raw': payload,
    }
```

这个版本已经够 OpenClaw 主入口直接用了。

---

## 七、主入口收到消息后的完整示例

### 模板 2：消息入口路由示例

```python
def handle_user_message(user_text: str) -> str:
    if not should_route_to_hermes(user_text):
        return '这条先按 OpenClaw 轻任务处理。'

    result = invoke_hermes_from_openclaw(user_text)

    if not result['ok']:
        return (
            '结论：Hermes 调用失败。\n\n'
            f"状态：{result.get('status', 'failed')}\n"
            f"错误：{result.get('error', '')}"
        )

    parts = []
    if result['status'] == 'completed':
        parts.append('结论：Hermes 已完成本次任务。')
    elif result['status'] == 'blocked':
        parts.append('结论：Hermes 已识别任务，但当前被阻塞。')
    else:
        parts.append('结论：Hermes 执行失败。')

    parts.append(f"状态：{result['status']}")

    if result.get('summary'):
        parts.append(f"摘要：{result['summary']}")

    if result.get('report_path'):
        parts.append(f"报告：{result['report_path']}")

    if result.get('error'):
        parts.append(f"错误：{result['error']}")

    return '\n'.join(parts)
```

---

## 八、OpenClaw 中具体命令怎么拼

如果你不想先封 Python 函数，最小就是先把命令拼出来。

### 方案 A：最常用命令模板

```bash
python3 07-Scripts/openclaw-hermes/direct_invoke.py \
  --title "OpenClaw 主入口转发任务" \
  --summary "用户原始请求文本" \
  --target-path "." \
  --instruction "先读 AGENTS.md" \
  --instruction "默认非破坏性" \
  --instruction "先给结论，再给依据" \
  --deliverable summary \
  --print-json
```

### 方案 B：指定目标项目目录

```bash
python3 07-Scripts/openclaw-hermes/direct_invoke.py \
  --title "检查 demo-project 配置" \
  --summary "检查 demo-project 配置问题并输出修复建议" \
  --target-path "03-Projects/demo-project" \
  --instruction "先读 AGENTS.md" \
  --instruction "只做非破坏性检查" \
  --instruction "先给结论，再给依据" \
  --deliverable summary \
  --print-json
```

### 方案 C：要求产出报告路径

```bash
python3 07-Scripts/openclaw-hermes/direct_invoke.py \
  --title "审计项目结构" \
  --summary "扫描项目结构并输出报告" \
  --target-path "03-Projects/demo-project" \
  --instruction "先读 AGENTS.md" \
  --instruction "输出详细报告" \
  --deliverable report \
  --deliverable summary \
  --print-json
```

---

## 九、如果 OpenClaw 主入口本身也是 Python，建议这样封装

推荐在 OpenClaw 侧封一层统一函数：

```python
from pathlib import Path
import subprocess
import json

WORKSPACE = Path('[本机路径已隐藏])
SCRIPT = WORKSPACE / '07-Scripts/openclaw-hermes/direct_invoke.py'


def run_hermes_task(*, title: str, summary: str, target_path: str = '.', timeout: int = 600):
    cmd = [
        'python3', str(SCRIPT),
        '--title', title,
        '--summary', summary,
        '--target-path', target_path,
        '--instruction', '先读 AGENTS.md',
        '--instruction', '默认非破坏性',
        '--instruction', '先给结论，再给依据',
        '--deliverable', 'summary',
        '--print-json',
    ]

    p = subprocess.run(
        cmd,
        cwd=str(WORKSPACE),
        capture_output=True,
        text=True,
        timeout=timeout,
    )

    stdout = (p.stdout or '').strip()
    stderr = (p.stderr or '').strip()

    if p.returncode != 0:
        raise RuntimeError(stderr or stdout or f'Hermes failed: {p.returncode}')

    return json.loads(stdout)
```

然后在主入口业务代码里只做：

```python
payload = run_hermes_task(
    title='检查项目配置',
    summary=user_text,
    target_path='03-Projects/demo-project',
)
```

这样主入口代码会很干净。

---

## 十、如果 OpenClaw 只能配 shell/hook，怎么写

如果 OpenClaw 某一层只能跑 shell 命令，也可以直接这么写：

```bash
cd [本机路径已隐藏] && \
python3 07-Scripts/openclaw-hermes/direct_invoke.py \
  --title "OpenClaw Hook 转发任务" \
  --summary "$USER_REQUEST" \
  --target-path "." \
  --instruction "先读 AGENTS.md" \
  --instruction "默认非破坏性" \
  --deliverable summary \
  --print-json
```

如果用户请求文本里可能有引号、换行、特殊字符，建议不要自己手拼字符串，
而是在 Python 里用 `subprocess.run([...])` 列表传参，避免转义问题。

---

## 十一、OpenClaw 侧建议读取哪些结果

建议按这个顺序读：

### 第一层：子进程返回码

- `returncode == 0`：继续解析结果
- `returncode != 0`：直接视为 Hermes 调用失败

### 第二层：stdout JSON

`direct_invoke.py --print-json` 会打印结构化 JSON。
优先解析这个。

重点字段：

- `task_id`
- `status`
- `summary`
- `artifacts.report_path`
- `error`

### 第三层：落盘结果文件

如果你还想保留留痕，可以根据 `task_id` 去读：

- `90-System/shared/outbox/result-<task_id>.json`
- `90-System/shared/reports/report-<task_id>.md`

也就是说：

- 实时返回靠 stdout JSON
- 留痕和后查靠 outbox/report 文件

---

## 十二、推荐回复模板

OpenClaw 对用户建议这样回：

```text
结论：Hermes 已完成本次任务。

状态：completed
摘要：已完成配置检查，发现 3 个问题。
报告：90-System/shared/reports/report-xxxx.md
```

如果失败：

```text
结论：Hermes 调用失败。

状态：failed
错误：<stderr 或 payload.error>
```

如果阻塞：

```text
结论：Hermes 已识别任务，但当前被阻塞。

状态：blocked
摘要：缺少目标路径或写权限。
```

---

## 十三、最小可运行示例

这里给一版你现在就能在本机验证的真实命令。

### 示例 1：让 Hermes 做一个轻量分析任务

```bash
cd [本机路径已隐藏] && \
python3 07-Scripts/openclaw-hermes/direct_invoke.py \
  --title "检查当前工作区规则" \
  --summary "先读 AGENTS.md，然后用一句话说明当前工作区最重要的规则" \
  --target-path "." \
  --instruction "先读 AGENTS.md" \
  --instruction "只返回一句简短结论" \
  --deliverable summary \
  --print-json
```

### 示例 2：让 Hermes 针对项目目录执行

```bash
cd [本机路径已隐藏] && \
python3 07-Scripts/openclaw-hermes/direct_invoke.py \
  --title "检查 demo-project 目录" \
  --summary "扫描 demo-project 目录结构并输出关键问题" \
  --target-path "03-Projects/demo-project" \
  --instruction "先读 AGENTS.md" \
  --instruction "默认非破坏性" \
  --instruction "先给结论，再给依据" \
  --deliverable summary \
  --print-json
```

---

## 十四、主入口常见坑

### 1. 不要手写字符串拼 shell

错误姿势：

```python
cmd = f"python3 xxx --summary '{user_text}'"
```

因为用户文本里很容易带引号、换行、特殊字符。

正确姿势：

```python
cmd = ['python3', 'xxx', '--summary', user_text]
subprocess.run(cmd, ...)
```

### 2. 一定要设 `cwd`

建议固定：

```python
cwd='[本机路径已隐藏]
```

不然 Hermes 可能进错工作目录。

### 3. 一定要设 timeout

不然长任务可能把主入口卡死。

建议起步：

- 轻任务：120~300 秒
- 重任务：600 秒

### 4. 不要把 stderr 丢掉

Hermes 调用失败时，stderr 往往是最有价值的排障信息。

### 5. 主入口先只接同步任务

当前这套最适合先接：

- 3~10 分钟内可完成的任务
- 需要立刻回用户结论的任务

如果后面长任务很多，再升级异步队列。

---

## 十五、建议的最小接入策略

如果现在要快速接到 OpenClaw 主入口，我建议按下面顺序：

### 第一步
先封一个：

- `should_route_to_hermes(text)`

### 第二步
再封一个：

- `invoke_hermes_from_openclaw(text, target_path='.')`

### 第三步
主入口只做：

```python
if should_route_to_hermes(user_text):
    return handle_hermes_result(invoke_hermes_from_openclaw(user_text))
else:
    return handle_light_task(user_text)
```

这就是最小闭环。

---

## 十六、建议的后续演进

等这版稳定以后，再按需加：

- 更准确的任务分类
- 更丰富的 target_path 推断
- 更细的 timeout 策略
- 长任务异步化
- 结果缓存
- 失败重试
- 再升级回任务队列 / worker 模式

但第一阶段，不要先把事情做复杂。

---

## 十七、相关文件引用

- 本文档：`01-Articles/2026-04-12-OpenClaw-主入口接入-Hermes-CLI-最小实现模板.md`
- 直接调用方案：`OpenClaw 直接调用 Hermes CLI 方案`
- 直接调用脚本：`07-Scripts/openclaw-hermes/direct_invoke.py`
- 核心执行脚本：`07-Scripts/openclaw-hermes/execute_task.py`
- 结果渲染脚本：`07-Scripts/openclaw-hermes/collect_result.py`

---

## 十八、最终建议

当前阶段直接按下面拍板：

- OpenClaw 主入口里直接 `subprocess.run([...])`
- 调 `07-Scripts/openclaw-hermes/direct_invoke.py`
- 拿 `stdout JSON + returncode`
- 再按 `status / summary / report_path` 回复用户

一句话收口：

> 对 OpenClaw 来说，接 Hermes 最小实现不是做队列，而是在主入口里多起一个本地命令。