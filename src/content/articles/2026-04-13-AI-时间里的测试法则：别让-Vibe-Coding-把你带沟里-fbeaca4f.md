---
title: "2026-04-13-AI-时间里的测试法则：别让-Vibe-Coding-把你带沟里"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
> 图片资源未同步：未命名图片

# AI 时间里的测试法则：别让 Vibe Coding 把你带沟里

现在写代码，越来越像“配音短剧”。

代码一行行冒出来，节奏很爽。
爽到什么程度？爽到团队开始怀疑：到底是工程在推进，还是幻觉在推进。

在 **AI vibe** 的生产模式下，有一条规律越来越硬：

> **代码可以不值钱，但测试必须值钱。**

因为代码的边际成本被模型压到地板上了；而“可信交付”的边际成本反而抬头。

---

## 1）AI 时间到底改变了什么？改变的是“成本结构”

以前：

- 写代码贵 → 改代码更贵 → 所以谨慎

现在：

- 写代码便宜 → 改代码也便宜 → 所以大胆

但有一个东西没变，甚至更贵了：

- **验证贵**（验证是否真的跑过、是否真的覆盖关键路径、是否真的没引入回归）

AI 让“产出代码”变快，却没自动让“质量闭环”变便宜。

于是工程质量开始出现一种新型事故：

- PR 很大、commit 很多、功能看起来全
- 但一跑起来，关键链路就开始集体躺平

这种时候，测试不是锦上添花，而是唯一能把幻觉打醒的东西。

---

## 2）一个典型现场：AI 是第一贡献者，但项目不能靠祈祷运转

有类团队的现状非常“时代感”：

- 项目代码大量由 Coding Agent 产出
- 贡献量甚至能超过人类团队总和
- 工程推进很快，但稳定性高度依赖测试

问题来了：**放手让 Agent 自己写测试**，经常会出现一种“假装很努力”的产物。

---

## 3）最常见的测试诈骗：瞎 Mock（看起来测了，实际上没跑）

很多 Agent 的测试有个共同点：

- 外部依赖全 Mock
- 内部调用也顺手 Mock 掉
- 断言写得很漂亮
- 真实业务代码一行没执行

测试跑完，绿得很稳定。
但这玩意儿的价值≈0。

把这类测试叫做：

> **“瞎 Mock”：Mock 得越完整，越像在掩盖事实。**

它解决的不是质量问题，而是把 CI 变成心理安慰。

---

## 4）测试为什么比代码更值钱？因为它是“可信产出”的定价器

AI 能在一个快速反馈的小任务里烧 token 烧出代码。
但在开放式工程任务里（边界复杂、依赖多、长期演进），真正困难的是：

- 让每次改动都能稳定验证
- 让输出可预测、可复用

所以才会出现一个反直觉但很合理的策略：

- Agent 写的代码：不一定逐行看
- Agent 写的测试：必须看、必须重写到符合 Pattern

原因很简单：

- 代码是“结果”，可能被替换
- 测试是“约束”，决定系统怎么演进

测试不是成本中心。
测试是项目的“秩序”。

---

## 5）AI 时代的测试规则：Mock 只能针对第三方，内部一律不许糊弄

这里有一条非常硬的工程规则：

> **只能 Mock 第三方依赖；内部 Library / 内部 Service 禁止 Mock。**

为什么？

- 第三方不可控（网络、版本、配额、随机故障）→ Mock 是为了稳定
- 内部可控（代码在仓库里）→ Mock 会把真实问题直接藏起来

这条规则的效果非常像“军规”：

- 把测试从“演戏”拉回“验收”
- 把质量从“感觉”拉回“证据”

---

## 6）把测试分层说清楚：别被名词绑架

很多团队会把下面这种测试叫“集成测试”：

- 内部服务真实调用
- 外部三方 Mock
- 只验证 API 请求与响应结果
- 不做手工 DB 插入/读取断言（避免把测试绑死在内部实现）

但在 AI 高速迭代的项目里，这类测试更应该被定义成：

> **最小粒度的单元测试（Minimum Meaningful Unit Test）**

它像单元测试一样轻量、频繁；
又像集成测试一样真实、可验证。

### 6.1 一个对照表：传统分层 vs AI 时间的“实用分层”

| 维度 | 传统说法 | AI 时间更实用的说法 | 关键差别 |
|---|---|---|---|
| 目标 | 测组件/测系统 | 测“可交付行为” | 行为优先于实现 |
| Mock 策略 | 看场景 | 只 Mock 外部三方 | 内部调用必须真实 |
| 断言策略 | 断言越多越好 | 断言 API 输入输出 | 不绑 DB/内部细节 |
| 反馈速度 | 分层越上越慢 | 把“真实”下沉到快速层 | 快速 + 真实同时要 |

---

## 7）可运行的 Python 示例：如何写“只 Mock 三方”的 API 测试

下面给一个可以直接照抄的模式（示例用 `pytest`）。

场景：

- 内部代码：`create_order()` 会调用内部库存服务 `inventory.reserve()`（内部真实）
- 外部三方：支付网关 `PaymentGateway.charge()`（外部可 Mock）
- 验证：只验证 API 层的请求与响应，不做 DB 断言

### 7.1 业务代码（示意）

```python
# app/service.py
from dataclasses import dataclass

@dataclass
class OrderRequest:
    user_id: str
    sku_id: str
    qty: int
    token: str

@dataclass
class OrderResponse:
    order_id: str
    status: str

class PaymentGateway:
    def charge(self, token: str, amount_cents: int) -> str:
        # 外部三方：真实实现会发网络请求
        raise NotImplementedError

class InventoryService:
    def reserve(self, sku_id: str, qty: int) -> None:
        # 内部服务：应真实运行（可用 in-memory 或测试容器环境）
        if qty <= 0:
            raise ValueError("qty must be > 0")

class OrderService:
    def __init__(self, inventory: InventoryService, payment: PaymentGateway):
        self.inventory = inventory
        self.payment = payment

    def create_order(self, req: OrderRequest) -> OrderResponse:
        self.inventory.reserve(req.sku_id, req.qty)  # 内部：真实跑
        tx = self.payment.charge(req.token, amount_cents=1999)  # 外部：可 mock
        return OrderResponse(order_id=f"ord_{tx}", status="PAID")
```

### 7.2 测试代码：只 Mock 外部三方

```python
# tests/test_order_api.py
import pytest
from unittest.mock import Mock

from app.service import OrderService, InventoryService, PaymentGateway, OrderRequest


def test_create_order_only_mock_third_party():
    inventory = InventoryService()  # 内部：真实

    payment = Mock(spec=PaymentGateway)  # 外部：mock
    payment.charge.return_value = "tx_123"

    svc = OrderService(inventory=inventory, payment=payment)

    req = OrderRequest(user_id="u1", sku_id="sku_1", qty=1, token="tok_x")
    resp = svc.create_order(req)

    assert resp.status == "PAID"
    assert resp.order_id == "ord_tx_123"

    # 只断言外部三方被调用是否符合预期
    payment.charge.assert_called_once()
```

这个例子刻意不去断言 DB，因为目标是：

- **验证“对外行为”**（输入输出、状态）
- 不把测试绑死在内部实现细节上

---

## 8）UI 测试怎么选？两类够用，别把自己拖死

UI 测试最容易写成“质量拖油瓶”。
建议拆成两类：

### 8.1 主力：React Mock DOM 的 UI 测试（快、覆盖面大）

思路：

- 把页面渲染出来
- 在模拟 DOM 环境里做用户操作（点击、输入）
- 断言 UI 输出

它不依赖真实浏览器，所以快。
适合覆盖大量交互细节。

### 8.2 少量保留：Playwright E2E（慢，但需要）

E2E 测试的定位更像“门禁卡”：

- 只测 Happy Path（主流程）
- 例如：登录/注册 → 进入首页
- 一两个就够，别贪

E2E 一旦写多，CI 会慢到让人开始找借口跳过测试。

---

## 9）在 AI 时间里，测试规则需要被“写进工具”，而不是写进嘴里

仅靠口头约定，Agent 很容易理解成“建议”。
建议的下场通常是：被忽略。

更靠谱的做法是：

- 把 Testing 规则写进文档（明确禁止项）
- 把规则写成 Skill（可被主动调用）
- 每次 Agent 交付后，主动触发这些规则去复查/重写

一句话：

> **不要期待模型自觉，直接把规矩变成工作流。**

---

## 10）经验、感想、方向：质量工程接下来会往哪走

AI 把开发推到一个新阶段：

- 产出速度指数级提升
- 变更频率更高
- 代码的“作者责任感”更弱（因为作者可能不是人）

在这个阶段，质量工程的方向会更像“系统工程”：

### 10.1 从“写测试”转向“设计验证体系”

重点不再是手写多少 case，而是：

- 哪些行为必须被验证
- 哪些依赖必须被隔离
- 哪些断言能代表业务正确

### 10.2 从“覆盖率数字”转向“覆盖面定义”

覆盖率这玩意儿，越来越像 KPI：

- 容易刷
- 容易骗
- 容易让团队误以为安全

更健康的指标是：

- 核心链路覆盖（业务流程）
- API 合约覆盖（字段/错误码/边界）
- 变更触发覆盖（哪些改动必须触发哪些测试）

### 10.3 从“测试是成本”转向“测试是资产”

当代码可以被批量生成，真正稀缺的会变成：

- 可复用的验证模式
- 可回放的真实用例
- 可持续的质量门禁

测试会越来越像资产负债表里的“资产项”。

---

## 结尾：代码是水，测试是渠

AI 让水来得更猛。
渠不修，迟早泛滥。

在 AI vibe 的时代，最靠谱的一句话仍然是：

> **代码可以不值钱，但测试一定要值钱。**

---

## 封面3要点

- 测试比代码值钱
- 内部禁止瞎 Mock
- 快速层也要真实

## 封面素材

- punchline: Vibe 也要验收
- tags: AI编程/测试工程/质量体系
- layout: auto

## 爆款标题备选（任选其一）

1. 当代码都是 AI 写的，测试为什么反而成了主角？
2. 别让“瞎 Mock”骗了你：AI 时代测试得这么写
3. 代码不值钱了，最值钱的变成了这套验证体系
4. AI 写的代码可以不看，但它写的测试必须重写
5. 内部服务禁止 Mock：这是 AI 时代最硬的一条测试军规
6. React 测到哪算够？Playwright 到底要不要写？
7. 覆盖率别自嗨：先把“可验证行为”定义清楚
8. Vibe Coding 想跑得久，测试要像制度一样执行
9. 把测试当资产：AI 时代质量工程的方向变了
10. 代码是水，测试是渠：不修就等着淹

**推荐标签**：#AI编程 #测试 #质量工程 #VibeCoding #ClaudeCode
