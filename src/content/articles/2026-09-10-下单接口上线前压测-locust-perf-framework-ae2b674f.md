---
title: "从 Locust 脚本到决策级报告：一个开源的通用性能测试框架"
created: "2026-09-10"
tags: ["性能测试","Locust","压测框架","开源","测试开发","接口压测"]
category: "性能测试"
published: true
---

# 从 Locust 脚本到决策级报告：一个开源的通用性能测试框架

先说个常见场面。`POST /api/v1/orders` 下单接口要上线了，压测跑完，`locust` 吐出来一堆 CSV——`stats_stats.csv`、`failures.csv`、`history.csv`。线程里没人立刻把这些整理清楚：并发到多少开始响得慢、P95 是多少、错误率有没有越线。更常见的是第二天有人重跑一遍，把昨天的原始数据盖掉了。压测本身不难，难的是它留不下一个能作决策的结论。

这篇文章的主角，是刚开源的一个项目 `xsoway/locust-perf-framework`（基于 Python + Locust 的通用性能测试框架），首版公开版本为 `v0.1.0`。这个项目补的正是上面那个场面缺的东西——不是缺压测，是缺一层把压测组织起来的工程化：目录、命名、防覆盖、二次报告。它把这一套固化成壳，套在 Locust 外面用。一个人能快速出能汇报的结论，一个团队能把流程沉淀下来，还能让 Codex / Claude Code / DSH 这类 Agent 打开项目直接驱动。下面先看清它解决了什么、目录怎么分工、关键源码怎么串起链路，再放进一次「电商下单接口上线前压测」的模拟走读。

> 作者：xsoway —— 长期做性能测试与测试工程落地的工程师。下单场景在本文为**模拟示例**，本文不安装、不运行框架；项目里的事实和命令都来自仓库官方文档并标注了出处。

---

## 打开项目：Locust 外面多了几个东西

框架想回答的问题很小：压测这件事，怎么跑起来是有流程、有沉淀、能复现的。它把一条链路固定下来，从 `压测方案` 一路走到 `脚本 → 数据 → 执行记录 → 中文分析报告 → LLM 辅助总结`（来源：仓库官方项目文档）。

对应地，它给了几样工具：

- **分层的目录**。`locustfiles/` 放脚本、`data/` 放数据、`reports/` 放原始和二次报告、`logs/` 放日志、`config/` 放配置。什么东西往哪放，先定好。
- **时间戳防覆盖**。每次执行自动生成时间戳目录，目录已存在就自动追加序号。重跑不会把上一次的结果冲掉。
- **一体化命令**。用户入口收口在 `tools/`，只暴露并发、速率、时长、目标、数据这些必要参数。不用手动拼时间戳、建目录、指一堆 CSV/HTML 路径。
- **中文 HTML 报告**。解析 Locust 的 CSV 和失败明细，生成带 TPS / RT / 错误率趋势、请求级瓶颈、调用链热图的报告。
- **LLM 辅助分析（可选）**。通过 OpenAI 兼容封装给报告追加一段 AI 摘要；密钥走环境变量，不配置就不会真正调用。想用这一项，得自己备一个 OpenAI 兼容网关和模型名（`AI_APICLIENT_BASE_URL / AI_APICLIENT_API_KEY / AI_APICLIENT_MODEL`），没有就加 `--no-llm-analysis` 跳过。
- **Agent-ready**。仓库内置"规划 / 脚本开发 / 报告分析"三份 Agent 规则，配套一份提示词模板库 `docs/agent_prompts.md`，给出一键全流程、分步推进、进阶精调三档可以直接复制的提示词，Codex、Claude Code、DSH 这类工具打开项目就能配合着用。

想看它到底跑出来什么样，用不着先自己搭环境。仓库 `examples/` 里带两个**端到端跑通的成品示例**：`health-check-demo`（健康检查，基准 + 阶梯加压找拐点）和 `pressure-test-demo`（压力测试，演示击穿点与熔断）。每个示例的说明文档都给了"启动本地 Mock → 预检 → 压测 → 生成中文报告"的可一字复现命令，连成品 `report.html` 都放好了，`open examples/health-check-demo/report.html` 就能先看到报告长什么样（来源：仓库说明与 examples）。

有两处边界值得先记住，省得踩坑。一是仓库里默认 host 是 `https://example.com` 占位——直接拿去压，请求全失败，跑不出有意义指标，所以真上生产前要用 `LOCUST_TARGET_HOST` 指向对齐过的被测服务，并先预检。二是敏感数据默认不进仓库：`.gitignore` 忽略了 `data/` 下的真实文件，仓库里只留 `data/examples/` 的脱敏示例，测试数据要自己放本地。

还有一处要分清的，是框架**自己带的**和**组合使用**的边界：分层、防覆盖、命令封装、中文报告、阶梯加压、预检、多源监控是原生能力；而"用 Codex / Claude Code / DSH 这类 AI 工具自然语言驱动整个流程"，走的是仓库面向 Agent 化提供的三 Agent 规则，属于**组合使用**，得标清楚，别当成框架凭空多出来的功能。

---

## 目录分工和命令收口

产物落点固定，是这套东西好复现的根基（来源：仓库顶层目录 + `AGENTS.md`）：

```text
.
├── config/                  # 运行配置 config.ini、LLM 调用封装、压测参数模板
├── data/examples/           # 脱敏示例数据（脚本默认指向）
├── examples/                # 可公开的端到端压测示例（含报告成品）
├── locustfiles/             # Locust 压测脚本，locust_<业务域>_<接口>_<测试类型>.py
├── logs/                    # 框架运行日志
├── reports/raw/,html/,analysis/   # 原始产物 / 中文报告 / LLM 中间产物
├── tools/                   # 命名、日志、报告生成、执行封装
├── agents/                  # 规划 / 脚本开发 / 报告分析 Agent 规则
└── tests/                   # 自包含单测
```

日常入口其实用不了几个命令。装环境（来源：仓库官方项目文档，需 Python ≥ 3.11）：

```bash
uv sync --extra dev
```

跑压测统一走 `uv run python -m tools.xxx`，自动创建时间戳目录、生成 Locust 原始产物和中文报告。`report_builder` 出报告、`run_step_load` 阶梯加压、`preflight` 压前预检，几个工具各管一段。

质量这一块，当前发布版本带了 37 个自包含单元测试（不触网、不调真实 LLM），`ruff check` 通过（来源：仓库 CHANGELOG）。测试数据都是脱敏的占位样本，没有真实业务数据和密钥混进仓库。

---

## 链路上那几处关键源码

看几处真实源码，这层壳是怎么把链路接上的（以下文件均来源仓库 master 分支）。

**压测脚本负责定义"测什么"。** `locustfiles/locust_demo_health_baseline.py` 里的 `DemoHealthUser(HttpUser)`，用一个 `wait_time` 模拟真实用户在两次请求之间的等待——它从 `tools/config_loader.load_runtime_config()` 读，而不是写死在脚本里。任务访问 `/health`，响应 ≥ 500 记失败（`response.failure(...)`），否则记成功。脚本按 `locust_<业务域>_<接口>_<测试类型>.py` 命名。

```python
# locustfiles/locust_demo_health_baseline.py（节选，来源：仓库源码）
class DemoHealthUser(HttpUser):
    host = runtime_config.host
    wait_time = between(
        runtime_config.wait_time_min_seconds,
        runtime_config.wait_time_max_seconds,
    )

    @task
    def get_health(self) -> None:
        with self.client.get("/health", name="GET /health",
            timeout=runtime_config.request_timeout_seconds,
            catch_response=True) as response:
            if response.status_code >= 500:
                response.failure(f"server error status={response.status_code}")
                return
            response.success()
```

**报告生成器把 CSV 变成能看的东西。** `tools/report_builder.py` 的职责一句话说清：把 Locust 的 stats CSV 读进来，每行接口指标映射成 `LocustStatsRow`（里面有 `request_count / failure_count / p50 / p95 / p99 / rps` 和算好的 `error_rate`），再结合业务与执行上下文，输出中文 HTML 报告。命名走 `tools.naming.build_report_paths`，保证不覆盖历史。

**LLM 摘要是可插拔的一环。** `config/ai_apiclient.py` 包了个 OpenAI 兼容调用 `AiApiClient.call(...)`，`base_url / api_key / model` 全是环境变量驱动，没配置就默认指向本地占位地址、不真正发请求，还带了指数退避重试。

**Agent 指令是入口。** `agents/performance_agents.py` 提供三类 Agent 的最小入口，`load_agent_instruction("planning" / "script_development" / "report_analysis")` 返回对应的 Markdown 规则，供 Agent 工具或后续接入框架使用。想一站式驱动，直接把 `docs/agent_prompts.md` 里的一键提示词复制给 Agent 就行。

---

## 放进一个具体业务：下单接口上线前压测

理解了源码怎么串，把它放进业务走一遍。**这一段是模拟示例**：命令摘自仓库官方文档，下单场景和各步输入是演示构造，不代表框架已经在本团队跑起来。

先看整条数据流（Show-me 最小关系图）：

```mermaid
flowchart LR
    A[规划 Agent 定标准] --> B[locustfile 定义压测行为]
    B --> C[preflight 预检]
    C --> D[locust 基准 / run_step_load 加压]
    D --> E[report_builder 生成中文报告]
    E --> F[ai_apiclient 可选 LLM 摘要]
    F --> G[按 SLA/熔断判定]
```

### Step 1 · 起一个下单被测服务

模拟输入：本地 Mock 一个 `POST /api/v1/orders`，稳定返回下单成功。

处理规则：下单是写接口，按 `planning_agent.md` 走幂等、回滚、并发安全、数据清理这几项附加检查。真实环境要指到对齐过的测试环境——占位 host 只会让所有请求失败，压不出东西。

### Step 2 · 压前预检

模拟输入：被测下单服务地址 + 参数化数据文件。跑预检，先查占位 host、占位密钥和环境对齐（命令来源：仓库官方项目文档）：

```bash
uv run python -m tools.preflight \
  --host https://your-service.example.com \
  --data-file data/examples/demo_health_payloads.csv
```

预期结果：输出"预检完成（未阻断）"才继续往下。这一步的意义就是拦住"拿 example.com 这类占位地址当被测目标"的乌龙——真压到占位上，后面所有指标都是白跑。

### Step 3 · 单步基准摸底

模拟输入：单接口命令骨架（来源：仓库官方示例）。先做基准压测，把响应时间基线立起来：

```bash
uv run locust -f locustfiles/locust_demo_health_baseline.py \
  --host http://127.0.0.1:8099 \
  --headless -u 10 -r 2 -t 12s \
  --csv reports/raw/baseline_health/demo \
  --html reports/raw/baseline_health/demo.html
```

> 模拟示例：官方示例（健康检查接口）的命令骨架。把 host 换成被测下单服务、脚本换成 `locust_<业务域>_orders_<测试类型>.py`，就能套到下单场景。

验收条件：拿到正常的一组请求数、失败数、RPS、RT 分位，确认服务在低并发下符合预期。

### Step 4 · 阶梯加压找拐点

模拟输入：并发阶梯（来源：仓库官方项目文档命令）：

```bash
uv run python -m tools.run_step_load \
  --locustfile locustfiles/locust_demo_health_baseline.py \
  --steps "10,30,50,80,100" --step-duration 30s \
  --scenario demo_orders --host https://your-service.example.com
```

预期结果：每级生成子目录，汇总和拐点判定写进 `step_load_summary.json`。下单真实压测建议按写接口规范阶梯小步走——并发爬到高位，服务可能开始失败，触发熔断提前终止，这本来就是设计好的兜底。

### Step 5 · 生成中文 HTML 报告

模拟输入：最高负载级的原始 CSV（来源：仓库官方项目文档命令）：

```bash
uv run python -m tools.report_builder \
  --scenario demo_orders --test-type step_load \
  --stats-csv "reports/raw/demo_orders/<timestamp>/step_N_users/stats_stats.csv" \
  --overview "下单接口阶梯加压，验证并发增长下的容量与响应瓶颈" \
  --plan "并发阶梯逐步升压，展示最高负载级指标" \
  --environment "test(对齐后测试环境)" \
  --api-name "下单接口" --method POST --path /api/v1/orders
```

预期结果：拿到一份中文 HTML 报告。如果环境网络或 LLM 网关不可用，加 `--no-llm-analysis` 跳过 AI 摘要。

---

## 报告怎么读成一件事

报告出来，才到真正要紧的环节：结论怎么判。框架自带两个公开示例给了可对照的口径（来源：仓库 `examples/health-check-demo` 与 `examples/pressure-test-demo`，都是项目官方已核验的结果，非本团队实测）：

| 判定 | 示例 | 读数 |
| --- | --- | --- |
| **通过** | health-check 40 并发：总请求/失败 157/0，吞吐 17.5 req/s，P50/P95/P99 = 39/180/200ms，最大 206ms | 失败率 0%，P95 180ms 达标，没检测到拐点，能继续加压 |
| **需修复** | pressure-test 阶梯 5/10/20/40：并发 40 时 RPS 1052.4、错误率 76%，超过熔断阈值 30% 提前终止 | 击穿点并发 40，安全承载约 ≤20 活跃并发 / ~550 rps |

判定盯四样就够：**错误率 / RPS、P95 分位、拐点或击穿点、熔断**。健康检查那个 demo，RPS 随并发近似线性增长、P95 也达标，判通过；压力那个 demo，并发一到 40 错误率飙到 76%、触发熔断，判需修复，同时给出可执行动作——去重失败原因、补失败明细、接服务端资源监控、降档复核容量。报告的价值就落在这：跑完留下的是一句"能上/不能上"，不是一堆表格。

---

## 这套壳能留给一个人，也能留给一个团队

走完一次，能留下的是几样能被带走的东西：

- **给个人**：不用懂一堆 Locust 工程细节，也能把压测跑成能汇报的中文结论。一个接口，从装环境到出报告，命令都封装好了。
- **给团队**：可复用的压测流程 + 时间戳防覆盖 + 命名规范，一次沉淀，后来的人照同一套规矩再跑。方案 → 脚本 → 数据 → 执行 → 报告，是一条能复现的 SOP。
- **给安全和心里的底**：越线自动停（错误率 >5% 或 RT 超 SLA 3 倍熔断，来源：`planning_agent`），把被测环境打挂这种事少发生一件；37 个自包含单测全程兜底。
- **给想偷懒的人**：把 `docs/agent_prompts.md` 的一键提示词丢给 Codex / Claude Code / DSH，让它按三 Agent 规则把方案、脚本、报告串起来。

这套走法迁移性不差，把接口换成支付、工单、客服对话这类 P0 写接口，步骤照走。有一点要拎清：它擅长把横向接口压测和容量验收组织得规整，但要替代生产环境的真实流量和完整容量评估，它还不到那个份上——压出来的"能上/不能上"，是基于给定的服务和负载模型，不是全量线上的答案。文中下单场景是模拟示例，没在本团队实际安装运行。

项目按 **MIT** 协议开源（`Python ≥ 3.11` + `uv` 即可跑）。如果它的思路正好是团队缺的那块，欢迎去仓库点个 star、提一个 issue 或者直接来个 PR——这类项目的成长，大多靠使用者把真实场景的问题带回来。仓库地址在文章末尾，或者直接搜 `xsoway/locust-perf-framework`。技术细节、怎么接入，上一节和仓库的示例说明都写清楚了。

最后想说的其实很轻。这套东西替人挡掉的，大多是些"不值得发明"的活：别覆盖上一次的结果、别拿占位地址当目标、别让报告躺在 CSV 里没人看。时间戳目录把每一次都留下，像是给压测这桩"当天就该忘掉"的事留了个能反查的存档。压测结束，报告落地，"能上不能上"五个字说完，其余交给电梯里的沉默。开源也是这么回事——把一件别人迟早要重做的事，提前做完，摆出来，等它自己去遇见能用的人。

原文链接：<https://github.com/xsoway/locust-perf-framework>

`#性能测试` `#Locust` `#压测框架` `#开源` `#测试开发` `#接口压测`