---
title: "2026-04-13-让质量能力住进-IDE：用-Agent-Skills-把业务缺陷拦在键盘上"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
> 图片资源未同步：未命名图片

# 让质量能力住进 IDE：用 Agent Skills 把业务缺陷拦在键盘上

先抛个问题，别装：

资深测试专家那套“质量思维”，怎么无缝塞给一线业务研发？让 Bug 在写代码那一刻就被拦截，而不是等到提测、甚至上线后才炸成烟花？

诸葛亮端着茶，先来一句：
> “策划很好听，但执行还得靠你们自己。（拿茶）”

翻译成人话：规范写得再漂亮，落不到 IDE 里，全是纸面战神。

---

## 缺陷到底是什么玩意儿：硬知识 vs 软知识

研发实战里，缺陷大概分两类：

### 1）通用缺陷（硬知识）
代码层面的“硬伤”，标准答案明确。

- 空指针异常
- SQL 注入
- 内存泄漏
- 不符合规范的命名/风格

这类问题，SonarQube 这类静态扫描工具已经很能打。

### 2）业务缺陷（软知识）
结合业务场景的“逻辑漏洞”。

- “促销活动结束前，订单状态机能不能直接跳到退款？”
- “VIP 权益计算有没有漏掉新规则？”

这类问题高度依赖上下文：PRD、变更记录、历史约定、口口相传的‘祖传规则’……传统静态工具基本抓瞎。

关羽把刀往桌上一放：
> “稳如老汉推车，结果还是被队友坑了。”

业务缺陷很多时候就是这种：代码写得没毛病，规则漏了半条，最后背锅的还是写代码的人。

---

## 痛点：质量平台在 IDE 外面，开发在 IDE 里面

现在很多“业务缺陷”质量平台的状态很尴尬：

- 规范在文档里
- 规则在脑子里
- 开发在编辑器里

大家也知道“应该看规范”，但现实是：心流写起来了，很少有人愿意频繁切屏去翻几百页 PRD/Wiki。

割裂带来的后果不是“体验不佳”，而是实打实的成本：

### 研发体验的断层

- **需求碎片化**：核心逻辑可能藏在飞书文档某条批注里，或者 PRD 第 5 次变更记录里。
- **知识隐性化**：历史规则不在文档里，在 Wiki 的角落，甚至在“老员工口口相传”（人走了，规则也走了）。
- **反馈滞后**：质量检测常发生在提交之后。等 CI 跑完，再去 Jenkins/Sonar 翻几百行日志，才发现逻辑漏洞。此时开发早切换到下一个任务，修复成本直接起飞。

张飞听完就烦了：
> “说话别这么慢，是要比谁先气死？”

这套链路慢的不是人，是反馈。

当获取“正确规则”的成本太高，人性会选择捷径：

> “这个特殊退款逻辑好像见过……现在翻聊天记录太断片，凭经验应该这样写吧。”

于是 Bug 在键盘敲下那一刻，就悄悄加入系统豪华全家桶。

---

## 破局思路：把“专家经验”做成 Skill，塞进 IDE

Agent Skill 机制的价值很直：

- 把质量专家的知识封装成 Skill
- 直接装进 IDE
- 让研发随手召唤“虚拟质量专家”

目标不是再搭一个新平台，而是利用 TRAE 的 SOLO 模式，把资深 QA / 架构师多年的经验拆成可复用的“原子化研发技能”。

曹操一边看报表一边发号施令：
> “别跟我谈什么仁义，我只谈 KPI！”

对质量来说 KPI 就一条：**把高危业务缺陷拦在提测之前。**

---

## 设计核心：5 个 Skill 串成一条“串行检测流水线”

不要搞成松散的零散工具，这里每一步都有严格的数据依赖。

因此设计了一条包含 5 个阶段的串行 Workflow：

1. 建立全局技术认知（仓库地图）
2. 从 PRD 提炼结构化需求（规则清单）
3. 让业务规则与技术实现对齐（技术规格）
4. 精准锁定变更范围（证据包）
5. 业务缺陷裁决 + 修复闭环（判决书 + patch）

刘备在旁边摆出社交大佬姿势：
> “把兄弟拉齐先，剩下的咱再说！”

翻译：先把上下文对齐，再谈检查，否则检查就是瞎猜。

---

## 实战：一次“无感”检测（消息夜间防打扰）

场景：业务研发“小张”接到需求：

- 每天 **22:00 - 次日 08:00**
- **营销类消息**需要静默（不发送或返回失败）
- **验证码类消息**不受影响

写完代码准备提测，开始走流程。

---

## Step 1：建立全局技术认知（Skill 1）

调用 Skill：`codebase-insight-analyzer`

动作：输入“分析当前仓库”。

背后做的事不是“粗暴扫文件”，而是缩略版架构逆向工程：

- 技术栈识别：通过 `go.mod` / 构建脚本识别 CloudWeGo（Kitex + Hertz），Redis 缓存等
- 架构分层推断：结合目录（`internal/handler` / `internal/service` / `internal/repo`）推断 DDD-lite 分层：Handler -> Service -> Domain -> Repo
- 核心域定位：识别 `internal/service/dispatch`、`internal/biz/strategy` 为逻辑最密集区

产出：在仓库根目录生成结构化 `AGENTS.md`，给后续 Skill 当作“作战地图”。

示例（节选）：

```md
# Architecture Overview
- **Style**: DDD-lite / Clean Architecture
- **Core Modules**:
  - `internal/service/dispatch`: 消息分发核心域
  - `internal/biz/strategy`: 策略过滤核心域
- **Data Flow**: Request -> Handler -> DispatchService -> Strategy -> Repo
```

价值：后续找“防打扰策略”相关逻辑时，不会在无关目录里乱窜，省 Token 也省命。

---

## Step 2：从 PRD 提炼结构化需求（Skill 2）

调用 Skill：`prd-function-extractor`

动作：提供 PRD 链接，要求“提取防打扰规则”。

背后做三件事：

- 场景识别：用飞书 MCP 拉全文，识别主场景与分支条件（夜间/营销/验证码等）
- 要素清洗：把背景介绍和噪音剥离，只留影响逻辑的规则（比如“按用户时区判断”）
- 结构化输出：自然语言规则 → JSON；每条需求打唯一 ID

产出示例（节选）：

```json
[
  {
    "requirement_id": "PRD-MSG-005",
    "scenario_description": "营销消息夜间防打扰",
    "business_rule": "每日 22:00 至次日 08:00 期间，类型为 'Marketing' 的消息应被拦截，直接返回发送失败状态。",
    "constraints": "1. 仅针对 Marketing 类型，Verification 类型不受限；2. 时间判断需基于用户所在时区（若无时区信息，默认东八区）。",
    "priority": "P0"
  }
]
```

价值：把“隐性约束”（比如时区）直接摆到台面上。

---

## Step 3：业务规则与技术实现对齐（Skill 3）

调用 Skill：`trd-spec-extractor`

输入：Step 1 仓库地图 + Step 2 需求 JSON + TRD 文档。

背后做的是 Context Fusion（多源信息融合）：

- 输入对齐：PRD 规则 + TRD 技术方案
- 实体映射：把“用户时区”映射到具体技术实体（如 `UserContext.GetTimezone()`、`time.ParseInLocation`）
- 约束传递：把“验证码豁免”落成硬约束（如 `msgType == Verification` 必须跳过检查）

产出示例（节选）：

```json
[
  {
    "specification_id": "TRD-MSG-005",
    "related_requirement_id": "PRD-MSG-005",
    "module": "DispatchService.CheckDoNotDisturb",
    "specific_requirements": "1. 必须在 DispatchService 中新增私有方法 CheckDoNotDisturb；2. 必须使用 UserContext.GetTimezone() 获取用户时区，禁止使用 time.Now()；3. 针对 msgType=Verification 必须直接返回 true。"
  }
]
```

价值：消除“自然语言”和“编程语言”的语义鸿沟。后面检查才有“定罪依据”。

---

## Step 4：精准锁定变更范围（Skill 4）

调用 Skill：`function-level-defect-tracer`

动作：分析 Git Diff，做函数级差异索引 + 风险标注。

背后做的事：

- AST 级差异分析：不是只看行数，而是识别变更发生在什么函数/结构体
- 噪音过滤：忽略 import 排序、注释、空行
- 调用关系追踪：识别新增 `time.Now()` 并标高风险

产出示例（节选）：

```json
{
  "changed_files": ["internal/service/dispatch.go"],
  "function_level_changes": [
    {
      "symbol": "SendMessage",
      "change_type": "MODIFIED",
      "change_summary": "在消息分发前新增了基于 time.Now().Hour() 的条件判断分支"
    }
  ],
  "risk_notes": [
    {"entity": "SendMessage", "reason": "核心分发链路引入阻断逻辑，可能导致消息丢弃"}
  ]
}
```

价值：告诉下游检测“盯着这 13 行看，别被杂音带跑”。

---

## Step 5：业务缺陷裁决 + 一键闭环（Skill 5）

调用 Skill：`business-rule-defect-detector`

动作：汇总前 4 步证据链，做 Multi-Source Reasoning（多源证据链推理）：

- 事实：代码引入 `if hour >= 22`
- 规则：PRD 要求 22:00 - 08:00 全时段拦截
- 冲突：漏掉 00:00 - 08:00

再来一条：

- 事实：代码用了 `time.Now()`
- 约束：TRD 明确要求 `UserContext.GetTimezone()`
- 冲突：实体映射违规

结论：判定存在 **[P0] 级业务逻辑遗漏**。

产出闭环：自动生成飞书《业务缺陷检测报告》 + 可执行修复代码。

修复建议示例（节选）：

```go
// 1. 获取用户时区上下文
userLoc := ctx.GetTimezone()
// 2. 修正跨日逻辑判断
currentHour := time.Now().In(userLoc).Hour()
if msg.Type == "Marketing" {
    if currentHour >= 22 || currentHour < 8 { // 补全凌晨时段
        return ErrDoNotDisturb
    }
}
```

张飞一拍桌子：
> “刀来了！退一步都是风景！”

翻译：这种 P0 漏洞再拖下去，风景就变事故复盘了。

---

## 从“人找规范”到“规范找人”

这套实践本质是把散落在 Wiki、PRD、TRD、专家经验里的质量规范，做成 IDE 里随叫随到的“肌肉记忆”。

三个变化很直观：

- **沉浸式体验**：不用在 IDE、文档、质量平台之间反复横跳，交互都在 IDE 对话框里一气呵成。
- **极致左移**：把拦截时机推到 Commit 前，改变研发心智：质量不是测试测出来的，是设计+编码出来的。
- **知识活化**：落灰的“防打扰规范/时区指南/业务知识”变成活技能，每次调用都在落地最佳实践。

---

## 配置与使用（落地步骤，别只看热闹）

### Step 1：导入 Skills

在项目根目录创建：`.trae/skills/`，把技能包放进去。

### Step 2：配置飞书 MCP

因为流程需要分析 PRD/TRD，得接入飞书 MCP（用于搜索/查看/创建文档）。

官方配置参考：
- [原文](https://open.larkoffice.com/document/mcp_open_tools/end-user-call-remote-mcp-server)

大致流程（精简但够用）：

1. 登录飞书 MCP 配置平台
2. 创建 MCP 服务
3. 在添加工具里选“云文档”工具集
4. 授权用户权限
5. 拿到服务器 URL 与 JSON
6. 粘进 TRAE 的 MCP 手动配置对话框，确认

### Step 3：SOLO 模式触发检测

完成 Skills + MCP 配置后，在 SOLO 模式里触发串行检测流水线即可。

---

## 附录：Skill 组合清单（本文用到的 5 个）

```text
• codebase-insight-analyzer：生成仓库全局上下文 AGENTS.md
• prd-function-extractor：从 PRD 提取结构化需求 JSON
• trd-spec-extractor：把 PRD 规则映射为 TRD 技术规格 JSON
• function-level-defect-tracer：函数级 diff 分析 + 风险标注
• business-rule-defect-detector：多源证据链推理，裁决业务缺陷 + 给修复建议
```

### 这 5 个 Skill 怎么“喂”给 Agent：可直接复制的提示词/调用模板

> 说明：下面给的是“对话里怎么说”的提示词模板（不是 SKILL.md 全量内容）。把链接/路径/commit id 换成自己的就能跑。

#### 1) codebase-insight-analyzer（生成 AGENTS.md 仓库地图）

```text
调用 Skill：codebase-insight-analyzer

请分析当前仓库并生成/覆盖写入根目录 AGENTS.md，要求：
- 识别技术栈（语言/框架/存储/消息队列/构建命令）
- 推断架构分层（例如 Handler -> Service -> Domain -> Repo）
- 定位核心业务域与高风险模块（给出目录/文件线索）
- 给出数据流/调用链的“最短理解路径”

输入：repo_path=<本地仓库路径>
输出：AGENTS.md +（可选）JSON 摘要
```

#### 2) prd-function-extractor（PRD → 结构化需求 JSON）

```text
调用 Skill：prd-function-extractor

给一个飞书 PRD 链接：<PRD_URL>
请提取与【<功能主题>】相关的所有功能点，并输出 JSON 数组。
要求：
- 覆盖主流程 + 边界场景 + 异常场景
- 每条需求必须包含：scenario_description / business_rule / constraints / priority
- 为每条需求分配唯一 requirement_id（如 PRD-XXX 或 PRD-<模块>-XXX）
- 不要写成总结文；要像“能直接当测试用例依据”的规则清单

输出格式：严格合法 JSON
```

#### 3) trd-spec-extractor（TRD + PRD JSON → 技术规格 JSON）

```text
调用 Skill：trd-spec-extractor

输入：
1) PRD 需求 JSON（来自 prd-function-extractor 的输出）
2) 飞书 TRD 链接：<TRD_URL>

请把 PRD 的每条业务规则映射成 TRD 中的可执行技术规格，并输出 JSON 数组。
要求：
- 每条规范必须关联 related_requirement_id
- module 字段写清楚：业务角色 + 技术模块（接口/方法/表/字段名）
- specific_requirements 必须“业务规则 + 技术落地”一一对应
- 禁止省略/类比（不要写“同上/同登录规则”这种偷懒话）

输出格式：严格合法 JSON
```

#### 4) function-level-defect-tracer（Diff → 变更画像 + 风险线索）

```text
调用 Skill：function-level-defect-tracer

请对本次 MR 的 commit range 做差异分析：
- repo_path: <本地仓库路径>
- source_commit_id: <source>
- target_commit_id: <target>

要求输出：
- changed_files（增删行/hunk 数）
- function_level_changes（尽量到函数/方法级；给出 diff_hunks_refs）
- risk_notes（核心链路/条件分支/状态机/并发/缓存/一致性等风险点）

输出格式：JSON
```

#### 5) business-rule-defect-detector（证据链推理 → 缺陷裁决 + 修复建议）

```text
调用 Skill：business-rule-defect-detector

上下文输入必须包含：
- 仓库全局认知（AGENTS.md 或其摘要）
- PRD 需求 JSON（Step 2 输出）
- TRD 技术规格 JSON（Step 3 输出）
- 变更画像 JSON（Step 4 输出）

任务：请像资深 code reviewer 一样，逐条核对“变更”是否满足 PRD/TRD 约束，输出：
1) 裁决结论：是否存在业务缺陷（按 P0/P1 标注）
2) 证据链：事实/规则/冲突点（写清楚哪个规则被违反）
3) 修复建议：给出可执行 patch（或伪代码 + 修改点清单）
4) 验证清单：该补哪些测试/如何验证边界条件

输出要点：可执行、可落地、少废话
```

---

## 最后一句（不喊口号，给用法）

想把“质量能力住进 IDE”，别从“搭平台”开始。

先从最脏最累的环节下手：
- 规则结构化
- 规则与技术实体映射
- 变更聚焦
- 缺陷裁决闭环

把这些做成可复用 Skill，研发写代码的时候就能随手召唤一位“虚拟质量专家”。

然后——就这？就这！



#质量左移 #IDE内质量 #AgentSkills #TRAE #业务缺陷 #测试工程化 #研发效率
