---
title: "Alan-Workspace 目录重构方案"
created: "2026-04-21"
published: true
---

# Alan-Workspace 目录重构方案

## 结论

采用基于 Johnny.Decimal 思维的 10 个一级区块，服务于 **OpenClaw + Hermes Agent + Obsidian** 组合模式。

目标不是一次性大迁移，而是先完成：

1. 统一目标结构
2. 明确旧目录到新目录的迁移映射
3. 用 `INDEX.md` 做工作台入口
4. 分阶段收敛历史结构

---

## 一、最终推荐一级结构

```text
00-Inbox/
10-Work/
20-Knowledge/
30-Planning/
40-Review/
50-Writing/
60-Life/
70-System/
80-Templates/
90-Archive/
99-Attachments/
```

根目录保留少量入口文件：

```text
AGENTS.md
HEARTBEAT.md
IDENTITY.md
INDEX.md
SOUL.md
TOOLS.md
USER.md
```

---

## 二、设计原则

### 1. 按领域分层，不按文件类型堆叠

优先按“工作、知识、计划、复盘、系统”分区，而不是按零散文档类型建平铺目录。

### 2. 系统控制层与业务内容层分离

与 Agent、脚本、技能、配置相关的内容统一进入 `70-System/`，不要混入知识和业务目录。

### 3. Daily 是操作面，不是最终归宿

日计划、周计划属于 `30-Planning/`；长期沉淀需要回流到 Work / Knowledge / Review / Writing。

### 4. 旧结构先归档，不硬删

当前工作区存在多代目录并存问题，应先通过迁移和归档收敛，避免破坏已有引用和自动化。

---

## 三、详细目录树

### 00-Inbox

```text
00-Inbox/
  00.01-Craft-Inbox/
  00.02-Quick-Capture/
  00.03-To-Sort/
  00.09-Processing-Queue/
```

用途：
- Craft 导入
- 临时记录
- 待分类笔记
- Agent 暂存输出

---

### 10-Work

```text
10-Work/
  10.01-Iterations/
  10.02-Requirements/
  10.03-Test-Cases/
  10.04-Reports/
  10.05-Test-Data/
  10.06-PMO/
  10.07-Business-Systems/
  10.08-Slides/
  10.09-Tech-Docs/
```

用途：
- 工作日常迭代
- 需求管理
- 用例管理
- 工作报告
- 测试数据整理
- PMO 资料
- 业务系统资料
- PPT 输出
- 技术文档

说明：
- Work 内部不要重复出现“需求 / 用例 / 报告 / 测试数据”多套目录。
- 若业务线复杂，再在二级目录以下按项目拆分。

---

### 20-Knowledge

```text
20-Knowledge/
  20.01-LLM-Wiki/
  20.02-Clips/
  20.03-Reference/
  20.04-Learning-Notes/
  20.05-Domain-Knowledge/
```

用途：
- LLM Wiki
- 收藏文章
- 长期参考资料
- 学习笔记
- 行业与业务知识

---

### 30-Planning

```text
30-Planning/
  30.01-Yearly/
  30.02-Quarterly/
  30.03-Monthly/
  30.04-Weekly/
  30.05-Daily/
  30.06-Task-Lists/
  30.07-Projects/
```

用途：
- 年 / 季 / 月 / 周 / 日计划
- 待办清单
- 项目推进板

---

### 40-Review

```text
40-Review/
  40.01-Weekly/
  40.02-Monthly/
  40.03-Quarterly/
  40.04-Annual/
  40.05-Project-Reviews/
```

用途：
- 周复盘
- 月复盘
- 季度复盘
- 年度复盘
- 项目复盘

---

### 50-Writing

```text
50-Writing/
  50.01-Ideas/
  50.02-Drafts/
  50.03-Articles/
  50.04-Published/
```

用途：
- 选题
- 草稿
- 成稿
- 已发布内容

---

### 60-Life

```text
60-Life/
  60.01-Travel/
  60.02-Personal/
  60.03-Family/
```

用途：
- 旅行
- 个人事项
- 家庭事务

---

### 70-System

```text
70-System/
  70.01-Agents/
  70.02-Skills/
  70.03-Scripts/
  70.04-Tools/
  70.05-Configs/
  70.06-Workflows/
  70.07-Docs/
```

用途：
- Agent 配置与约束
- Skill 设计文档
- 脚本资产
- 工具说明
- 配置口径
- OpenClaw / Hermes 协作流程
- 系统说明文档

---

### 80-Templates

```text
80-Templates/
  80.01-Daily/
  80.02-Weekly/
  80.03-Review/
  80.04-Work/
  80.05-Writing/
  80.06-System/
```

---

### 90-Archive

```text
90-Archive/
  90.01-Legacy-Work/
  90.02-Legacy-Knowledge/
  90.03-Legacy-System/
  90.04-Legacy-Notes/
  90.09-Old-Structure-Snapshots/
```

---

### 99-Attachments

```text
99-Attachments/
  images/
  pdfs/
  exports/
  temp/
```

---

## 四、旧目录到新目录迁移建议

> 原则：先迁移“明显归属”的内容，不确定的先进入 `00-Inbox/00.03-To-Sort/` 或 `90-Archive/`。

| 当前目录 | 建议去向 | 说明 |
|---|---|---|
| `00-Inbox/` | 保留，按新子目录收敛 | 继续作为临时入口 |
| `01-Articles/` | `50-Writing/` 或 `20-Knowledge/` | 文章输出进 Writing，参考沉淀进 Knowledge |
| `02-Notes/` | `20-Knowledge/20.04-Learning-Notes/` 或 `00-Inbox/00.03-To-Sort/` | 先按内容二分 |
| `03-Projects/` | `30-Planning/30.07-Projects/` 或保留为项目资产区 | 若以项目执行管理为主，迁入 Planning；若含代码资产，可暂保留并后续归档 |
| `04-Memory/` | `90-Archive/90.03-Legacy-System/04-Memory/`，当前记忆以 `memory/` 为准 | 旧记忆体系建议归档，现用目录保持 `memory/` |
| `05-Daily/` | `30-Planning/30.05-Daily/` 与 `40-Review/40.01-Weekly/` | Daily 和 Weekly Review 分流 |
| `06-Outputs/` | `50-Writing/50.03-Articles/` 或 `10-Work/10.04-Reports/` | 按输出性质迁移 |
| `06-Projects/` | `30-Planning/30.07-Projects/` | 合并项目推进区 |
| `07-Scripts/` | `70-System/70.03-Scripts/` | 明确归系统层 |
| `09-Reports/` | `10-Work/10.04-Reports/` | 归工作报告 |
| `10-PERSONAL-OPS/` | `30-Planning/` + `40-Review/` | 按计划 / 复盘拆分 |
| `20-works/` | `10-Work/` | 这是旧工作目录，建议并入 |
| `30-Travel/` | `60-Life/60.01-Travel/` | 归生活旅行 |
| `70-RAW/` | `00-Inbox/` 或 `20-Knowledge/20.02-Clips/` + `99-Attachments/` | RAW 输入区不宜继续做主结构 |
| `71-Wiki/` | `20-Knowledge/20.01-LLM-Wiki/` | 收敛成知识主区的一部分 |
| `80-Tools/` | `70-System/70.04-Tools/` | 工具资产 |
| `90-System/` | `70-System/` | 当前编号与目标定位冲突，建议回归系统层 |
| `91-DB/` | `20-Knowledge/20.03-Reference/DB/` | 当前已作为参考资料的一部分收敛 |
| `98-Templates/` | `80-Templates/` | 直接并入 |
| `99-Attachments/` | 保留 | 继续使用 |
| `Excalidraw/` | `99-Attachments/Excalidraw/` | 当前作为附件统一收口 |
| `agents/` | `70-System/70.01-Agents/` | Agent 资产 |
| `ai-research/` | `20-Knowledge/20.05-Domain-Knowledge/` 或 `90-Archive/` | 按是否仍活跃判断 |
| `debug/` | `90-Archive/90.03-Legacy-System/` | 调试残留建议归档 |
| `executor/` | `70-System/70.03-Scripts/` 或 `90-Archive/` | 视是否仍在用 |
| `hermes/` | `70-System/70.01-Agents/` 或 `70-System/70.06-Workflows/` | 作为 Hermes 相关资产归档 |
| `memory/` | 保留现机制，补文档到 `70-System/70.07-Docs/` | 这是运行依赖，不建议贸然改名 |
| `rules/` | `70-System/70.07-Docs/` 或继续保留入口 | 规则文档属系统层 |
| `scripts/` | `70-System/70.03-Scripts/` | 统一脚本区 |
| `state/` | 当前已移出主结构，后续如恢复出现也应视为运行目录而非知识目录 | 不纳入知识结构 |
| `writer/` | `70-System/70.01-Agents/` | Writer Agent 资产 |

---

## 五、分阶段实施建议

### Phase 1, 定义目标结构

先建立新骨架和导航，不急着大搬迁。

交付物：
- 新目录方案
- 迁移清单
- 新版 `INDEX.md`

### Phase 2, 清理顶层与重复目录

优先处理：
- 重复工作目录
- 旧系统目录
- 模板目录
- Travel / Daily / Reports 等显性目录

### Phase 3, 收敛历史结构

将不确定、低频、旧时代目录逐步下沉到 `90-Archive/`，避免主界面持续杂乱。

---

## 六、针对 OpenClaw + Hermes + Obsidian 的特别建议

### 1. 根目录只保留入口层

Obsidian 左侧目录树要尽量简洁，避免业务目录、系统目录、运行目录混杂。

### 2. Agent 规则与业务内容分开

Hermes / OpenClaw 的规则、脚本、技能、工作流都进 `70-System/`，不要散落在 Work / Knowledge。

### 3. `INDEX.md` 做成工作台

首页建议包含：
- 今日入口
- 工作入口
- 计划入口
- 复盘入口
- 知识入口
- 系统入口
- 模板入口
- 迁移进度入口

### 4. Daily 不做长期仓库

Daily 里只保留操作记录，当天有复用价值的内容应回流到正式分区。

---

## 七、建议的执行顺序

1. 先采用本方案作为目标结构
2. 更新 `INDEX.md` 成为新入口页
3. 建立新编号目录
4. 搬迁明显目录
5. 旧结构逐步归档
6. 后续补自动化与模板

---

## 八、一句话结论

你的工作区之后应该从“多代目录并存的仓库”变成：

**以 Obsidian 为入口，以 OpenClaw / Hermes 为执行层，以 Johnny.Decimal 为结构骨架的个人操作系统。**
