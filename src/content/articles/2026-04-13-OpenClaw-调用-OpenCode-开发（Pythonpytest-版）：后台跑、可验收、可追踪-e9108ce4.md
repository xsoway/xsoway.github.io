---
title: "OpenClaw 调用 OpenCode 开发（Python/pytest 版）：后台跑、可验收、可追踪"
created: "2026-04-13"
published: true
---
> 图片资源未同步：未命名图片

# OpenClaw 调用 OpenCode 开发（Python/pytest 版）：后台跑、可验收、可追踪

把 Coding Agent 当队友用，最怕两件事：

1) 它在终端里问你问题，你不在，然后卡死
2) 它写了一堆代码，你也不知道到底有没有跑过测试

OpenClaw 的价值不在“再来一个 AI 写代码”。
而在于它能把 OpenCode 这种终端 Agent **编排成可追踪的后台任务**：有工作目录、有日志、有 sessionId，可喂输入、可中止。

这篇按 Python 项目（pytest）给一套能直接抄的流程。

---

## 1）两条硬规矩：PTY + workdir

OpenCode 是交互式终端程序。

- **PTY 必须开**：不然输出乱、可能挂起
- **workdir 必须给**：不然上下文漂移，Agent 读错文件、改错地方

在 OpenClaw 里就对应两件事：

- `pty:true`
- `workdir:~/Projects/your-python-repo`

---

## 2）项目准备：Python 结构建议（让 Agent 不瞎跑）

你不需要为 OpenCode 改项目，但建议确认这几样齐全：

```text
your-repo/
  pyproject.toml  (或 requirements.txt)
  src/            (可选)
  app/            (可选)
  tests/
  README.md
```

以及一条明确的验收命令：

```bash
pytest -q
```

如果项目用虚拟环境，最好也把约定写清楚：

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

---

## 3）最小可用：前台跑一次 OpenCode（适合小任务）

```bash
bash pty:true workdir:~/Projects/your-python-repo \
  command:"opencode run '修复一个小 bug：X 现象 -> 定位 -> 修复 -> 跑 pytest -q 并报告结果'"
```

适用：10 分钟以内、你愿意盯着它跑完。

---

## 4）推荐姿势：后台跑 OpenCode（长任务标准流）

### 4.1 启动后台任务（拿到 sessionId）

```bash
bash pty:true workdir:~/Projects/your-python-repo background:true command:"opencode run '
任务目标：
- 修复 /api/login 偶发 500

约束/禁止：
- 不新增依赖
- 不改项目结构
- 不改 CI 配置

实现要求：
- 输出根因定位过程（哪个异常、在哪一层、触发条件）
- 修复后补回归测试（pytest）

验收方式：
- 运行：pytest -q
- 预期：全绿

提交要求：
- 生成 1 个 commit：fix: stabilize login 500
'" 
```

### 4.2 查看日志（不打断它）

```bash
process action:log sessionId:<SESSION_ID>
```

### 4.3 看它是否结束

```bash
process action:poll sessionId:<SESSION_ID>
```

### 4.4 它问问题时怎么喂输入

```bash
# 输入并回车
process action:submit sessionId:<SESSION_ID> data:"yes"

# 或粘贴一段长文本
process action:paste sessionId:<SESSION_ID> text:"(你的回答...)" bracketed:true
```

### 4.5 需要紧急刹车就 kill

```bash
process action:kill sessionId:<SESSION_ID>
```

---

## 5）让示例“可运行”：给一个最小 Python API + pytest 结构

如果你想在新仓库里快速演示整套流程，下面是一个可以直接复制的最小样例。

### 5.1 app.py（Flask 示例 API）

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/login")
def login():
    body = request.get_json(silent=True) or {}
    username = body.get("username")
    password = body.get("password")

    # 故意写一个常见坑：字段缺失时潜在异常
    if not username or not password:
        return jsonify({"error": "missing credentials"}), 400

    # 这里只做示例，不写真实认证
    if username == "admin" and password == "admin":
        return jsonify({"token": "t_demo"})

    return jsonify({"error": "invalid credentials"}), 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=False)
```

### 5.2 tests/test_api.py（pytest + requests）

```python
import subprocess
import time

import requests


def wait_ready(url: str, timeout_s: int = 5):
    start = time.time()
    while time.time() - start < timeout_s:
        try:
            r = requests.get(url, timeout=0.5)
            if r.status_code == 200:
                return
        except Exception:
            time.sleep(0.1)
    raise RuntimeError("server not ready")


def test_login_happy_path():
    p = subprocess.Popen(["python", "app.py"])
    try:
        wait_ready("http://127.0.0.1:8080/health")
        r = requests.post(
            "http://127.0.0.1:8080/login",
            json={"username": "admin", "password": "admin"},
            timeout=1,
        )
        assert r.status_code == 200
        assert r.json()["token"] == "t_demo"
    finally:
        p.terminate()
        p.wait(timeout=3)
```

### 5.3 requirements.txt

```txt
flask==3.0.2
pytest==8.0.0
requests==2.31.0
```

### 5.4 本机跑通

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

> 这套 demo 的目的不是教 Flask，而是给 OpenCode 一个“能启动、能测、能验收”的闭环。

---

## 6）写任务的工程化模板（Python/pytest 友好版）

OpenCode 最容易翻车的地方不是代码，而是边界不清。
建议每个任务都写清楚这 4 件事：

| 模块 | 你要写什么 | 目的 |
|---|---|---|
| 目标 | 修什么/加什么 | 防止乱跑 |
| 禁止项 | 不加依赖/不改结构/不改 CI | 防止自由发挥 |
| 验收 | `pytest -q` 必须全绿 | 防止“应该好了” |
| 产物 | commit / diff / 说明 | 防止交付口径模糊 |

一个可直接复制的 Prompt：

```text
任务目标：
- ...

约束/禁止：
- 不新增依赖
- 不改目录结构
- 不改 CI

实现要求：
- 补充/更新 pytest 用例（至少覆盖：主流程 + 1 个错误分支）
- 若涉及外部请求，必须隔离或 stub（不要在 CI 里打真实外网）

验收方式：
- 在本机运行：pytest -q
- 输出：通过用例数、失败原因（如失败）

提交要求：
- 1 个 commit（message: ...）
```

---

## 7）结论：把 OpenCode 变成“可控的后台队友”

OpenClaw 调 OpenCode 的关键不在花哨，而在三件事：

- PTY（不挂起）
- workdir（不跑偏）
- pytest 验收（不嘴硬）

只要把这三件事写死，你就能得到一种很工程的体验：

> Agent 在后台干活，你只在关键节点介入；最终用 `pytest -q` 给结果定价。

---

## 封面3要点

- PTY 必须开
- workdir 要固定
- pytest 定验收

## 封面素材

- punchline: 让Agent可追踪
- tags: OpenClaw/OpenCode/Python
- layout: auto

## 爆款标题备选（任选其一）

1. OpenClaw + OpenCode（Python/pytest）：把开发任务后台化、可追踪
2. 别让 Agent 嘴硬：用 pytest -q 给 OpenCode 定验收
3. PTY + workdir：OpenClaw 调 OpenCode 不翻车的两条军规
4. 一套可复制流程：OpenClaw 编排 OpenCode 修 bug + 补测试
5. 终端 Agent 真能用：关键是 sessionId + 日志 + 可喂输入

**推荐标签**：#OpenClaw #OpenCode #Python #pytest #AI编程
