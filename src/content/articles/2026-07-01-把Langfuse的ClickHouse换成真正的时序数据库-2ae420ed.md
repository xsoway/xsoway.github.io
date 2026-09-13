---
title: "2026-07-01-把Langfuse的ClickHouse换成真正的时序数据库"
created: "2026-07-01"
tags: ["KnowledgeBase","AI","LLM","可观测性","开源项目","Langfuse","GreptimeDB","Openfuse","GitHub","公众号"]
category: "文章"
published: true
---

# 把Langfuse的ClickHouse换成真正的时序数据库：这个开源项目把LLM观测成本打下来了

做LLM应用的人都知道Langfuse。trace、observation、score、dashboard——几乎是LLM工程观测的事实标准。

但用久了有个尴尬的地方：它的分析存储绑死在ClickHouse上。单机起步还行，数据一涨，ClickHouse的运维成本和长周期保留就变成了不能忽视的问题。想多存几个月？升级存储、调集群、买单——而且Langfuse里可配置的数据保留是Enterprise版才有的功能。

最近看到一个项目把这层的绑定解了。

它叫**Openfuse**。一句话概况：Langfuse的fork，把ClickHouse换成了GreptimeDB——一个真正的统一可观测性数据库。产品、API、SDK全兼容，装起来一条Docker Compose命令，首次启动自动准备好存储，什么都不用配。

## 一句话结论

Openfuse 是一个 Langfuse 社区 fork，把底层分析存储从 ClickHouse 换成了 GreptimeDB。LLM trace 本身就是可观测性数据——带时间戳的宽事件、高基数上下文——正好是 GreptimeDB 的菜。换完之后，你可以从单容器起步一直扩到集群，还能用一条SQL设置整库TTL，把数月的trace保留成本降到可控范围。

## 核心亮点

**1、把分析存储从ClickHouse换成GreptimeDB——LLM trace本身就是可观测性数据**

这是这个fork最核心的改动。LLM trace跟传统的分析型数据不一样——它是带时间戳的宽事件，高基数上下文，典型的可观测性数据形态。GreptimeDB正好是为这种场景设计的：metrics、logs、traces一把抓，SQL和PromQL都能查，OTLP原生支持，存算分离。

**2、从单容器起步，随规模平滑扩展**

先用一个`openfuse-standalone`容器跑起来——web和worker跑在一个进程里，接上Postgres、Redis、GreptimeDB就完事。等数据涨上来了，同一套引擎能扩到集群，缩容也不丢数据。不需要一开始就搭一套ClickHouse集群。

**3、便宜的长周期保留，一条SQL搞定**

这可能是很多团队最直接受益的点。`LANGFUSE_GREPTIME_TTL`环境变量，一条SQL设置整库级别的数据保留周期。GreptimeDB的object-storage-native分层存储让数月甚至数年的trace保留成本可控——这个在原生Langfuse里是Enterprise版才有的功能。注意TTL是deployment级、整库一刀切，不是per-project。

**4、现有Langfuse SDK零改代码接入**

存粹的替换方案。你把任意Langfuse SDK——或者任意OpenTelemetry tracer——指向Openfuse，traces、observations、scores直接写入，一行代码不用改。迁移成本基本为零。

**5、完整的tracing UI和dashboard，跟Langfuse一致**

trace详情、嵌套observation树、session视图、users、搜索筛选，该有的都有。Dashboard里能看到成本、token用量、延迟百分位、score分析，按metadata、tag、tool筛选拆分。覆盖到的parity case跟上游对齐，有意的差异在parity ledger里列着。

**6、评估工作流端到端可用**

Datasets、experiments、evaluations——评估体系完整保留。编辑、删除、数据导出（包括整个project删除）都按预期工作。

**7、alpha但功能面完整，已知限制明明白白**

ClickHouse→GreptimeDB的迁移已经落地，读路径跟上游Langfuse做了逐字节parity校验。Langfuse的完整产品、API、SDK面都能用。已知限制有独立文档，一份约束清单加少数有意的差异——fork里都是等价或更正确的一侧。

**8、打开了单用途存储给不了的方向**

因为事件存在真正的可观测性数据库里，GreptimeDB有机会把Openfuse带到Langfuse parity之外——PromQL原生的metrics、logs↔traces关联、OTLP原生ingestion、用Flow做预聚合rollup。这些都是方向性的、尚未交付，但路线图已经摆在这了。

## 架构长什么样

```
flowchart LR
  SDK[Langfuse SDK / OTel]
  GW[Openfuse Web / Worker]
  PG[(Postgres - 应用配置)]
  GR[(GreptimeDB - 分析事件)]
  RD[(Redis - 任务队列)]
  OBJ[(对象存储 - 可选)]

  SDK -->|ingestion API| GW
  GW --> PG
  GW --> GR
  GW --> RD
  GW -.->|批量导出| OBJ
```

Postgres存应用和配置数据（users、projects、prompts、API key），与上游一致。GreptimeDB是分析事件存储——一张append-only的`raw_events`表做source of truth，加上合并后的projection表和给metadata/tag/tool筛选用的EAV旁表。Redis跑BullMQ队列。默认不需要对象存储，media上传、OTel carrier、eval blob都走本地文件系统。

## 5分钟快速上手

需要Docker和Docker Compose。

```bash
git clone https://github.com/tma1-ai/openfuse.git
cd openfuse
cp .env.quickstart.example .env
OPENFUSE_STANDALONE_IMAGE=tma1ai/openfuse-standalone:1.0.0-alpha.2 \
  docker compose -f docker-compose.standalone.yml up -d --pull always
```

打开 http://localhost:3000。quickstart的env会自动创建一个demo project，直接用 `demo@example.com` / `langfuse-dev` 登录，或者把任意Langfuse SDK指向内置key（`pk-lf-1234567890` / `sk-lf-1234567890`）。

正式部署请从 `.env.prod.example` 出发，自己生成secret，设置GreptimeDB密码开启强制鉴权。

### 按钮（拆分web和worker独立扩缩）

```bash
OPENFUSE_WEB_IMAGE=tma1ai/openfuse-web:1.0.0-alpha.2 \
OPENFUSE_WORKER_IMAGE=tma1ai/openfuse-worker:1.0.0-alpha.2 \
  docker compose up -d --pull always
```

### 命令速查

| 阶段 | 命令 | 用途 |
|------|------|------|
| 安装 | `cp .env.quickstart.example .env` | 生成quickstart配置 |
| 启动 | `docker compose -f docker-compose.standalone.yml up -d --pull always` | standalone模式启动 |
| 启动 | `docker compose up -d --pull always` | 拆分web+worker模式 |
| 访问 | `http://localhost:3000` | 打开Openfuse UI |
| 设置TTL | `LANGFUSE_GREPTIME_TTL=90d` | 环境变量，保留90天 |

## 与Langfuse的兼容性

当前基于上游Langfuse v3.184.1。SDK和ingestion/REST API完全不变。Postgres迁移就是上游的、原样套用；GreptimeDB schema是fork特有的，容器启动时自动迁移——幂等、advisory lock串行、fail-closed。Dashboard和metrics输出在覆盖到的查询面上做了逐字节比对，少数有意的差异在parity ledger里说明。

Openfuse是社区fork，与Langfuse没有从属关系。

## 写在最后

这个项目的思路很直接——LLM trace就是可观测性数据，为什么要把它硬塞进一个分析型列存？ClickHouse不是不好用，是在这个场景下有点用力过猛：运维成本高、长周期保留贵、从单机到集群的过渡不够平滑。

把GreptimeDB换进去之后，整个成本结构变了。单容器起步、数据放对象存储、一条SQL设TTL——对于中小团队来说，trace观测的运维和存储成本都降了一个台阶。

当然它是alpha版本，`1.0.0-alpha.2`。已知限制文档建议部署前扫一眼。TTL是整库级一刀切，不是per-project。方向性的能力（PromQL原生、logs关联）还在路线图上、尚未交付。如果你现在的Langfuse还在ClickHouse上跑得好好的、数据量也不大，未必需要急着迁。但如果你已经在为ClickHouse的运维和长期保留成本头疼，这个fork值得花5分钟试试。

开源地址：[github.com/tma1-ai/openfuse](https://github.com/tma1-ai/openfuse)

#LLM #可观测性 #Openfuse #Langfuse #GreptimeDB #开源 #AI工程化 #Docker #自托管 #AI
