---
title: "OpenClaw × Obsidian 知识库搭建与运行机制实战"
created: "2026-03-25"
tags: ["KnowledgeBase","OpenClaw","Obsidian","QMD","Automation","Cron","ModelRouting","ContextPruning","Draft"]
category: "Articles"
published: true
---
# OpenClaw × Obsidian 知识库搭建与运行机制实战

## 1. 背景

这套体系要解决的不是“再搭一个笔记软件”，而是一个非常具体的日常痛点：

- 白天在各个 App 里到处记录：聊天、灵感、链接、截图；
- 晚上想回顾「今天做了什么」「有哪些结论」，发现东西散落一地；
- 想搞一个统一的知识库，但手工整理太费时间，很难坚持。

目标是把“碎片 → 结构化 → 可检索 → 可长期维护”做成一个可持续的工程系统：

- 你在 Telegram 里随手问问题、讨论想法；
- 白天的碎片，晚上自动“长”成结构化笔记；
- 所有内容进入一个本地优先的长期知识库（Obsidian Vault），而不是飘在云端当一次性对话。

---

## 2. 目标 / 问题定义

### 2.1 要达成的能力

1. **统一存储**：所有可复用内容落到 Obsidian Vault。
2. **统一检索**：OpenClaw 通过 QMD 在 Vault 中语义检索，回答必须带笔记引用。
3. **统一产出**：main/code/writer/light 落盘路径与类型清晰：文章、项目、运维记录各归其位。
4. **统一元数据**：每篇 Markdown 必带 frontmatter（title/category/tags 等）以支持知识图谱。
5. **自动化治理**：用 cron 做“轻检查/重整理”，让系统自己变干净。

### 2.2 约束条件（必须明确）

- **本地优先**：Obsidian Vault 是“终极长期记忆”。
- **避免噪音 recall**：QMD 只索引 Vault 内的关键目录，不全量扫所有文章。
- **可回滚**：关键配置修改必须保留备份。
- **自动化默认非破坏性**：巡检/整理 cron 默认只报告，不自动移动/删除。

---

## 3. 实施过程（按阶段）

> 说明：以下是“已实际落地的配置与文件”，不是概念性方案。

### 阶段 A：确定 Vault 作为知识库中心

Vault 根路径确定为：

- `[本机路径已隐藏]`

并在 Vault 中建立工程化目录结构（见第 5 节）。

### 阶段 B：将 OpenClaw 的 agent workspace 指向 Vault

在 `~/.openclaw/openclaw.json` 中，将 agent 的 workspace 调整为：

| Agent | Workspace | 用途 |
|---|---|---|
| main | `Alan-Workspace/` | 总入口、收口与治理 |
| writer | `Alan-Workspace/01-Articles/` | 写作/复盘/文档产出 |
| code | `Alan-Workspace/03-Projects/` | 代码/脚本/项目产出 |
| light | `Alan-Workspace/00-Inbox/` | 轻任务/后台/cron |

这一步的效果是：OpenClaw 不再“看到 Vault”，而是“住在 Vault”。

### 阶段 C：QMD 索引 Vault（让 OpenClaw 能检索你的笔记）

在 `openclaw.json` 的 `memory.qmd.paths` 中加入 Vault 的关键目录（选择性索引）：

- `Alan-Workspace/01-Articles/OpenClaw`
- `Alan-Workspace/01-Articles/Knowledge`
- `Alan-Workspace/01-Articles/Learning`
- `Alan-Workspace/04-Memory/topics`

随后执行索引更新：

```bash
openclaw memory index --force
```

### 阶段 D：统一落盘规范（frontmatter + 生成器）

为了避免“每次靠 prompt 临时拼 frontmatter 导致不一致”，引入了三件套：

1) frontmatter 规范
- `Alan-Workspace/rules/frontmatter-spec.md`

2) 模板
- `Alan-Workspace/templates/retro.md`
- `Alan-Workspace/templates/plan.md`
- `Alan-Workspace/templates/article.md`
- `Alan-Workspace/templates/learning.md`
- `Alan-Workspace/templates/daily-market.md`

3) 统一落盘生成器
- `Alan-Workspace/scripts/new-note.py`

生成器负责：
- 创建带 frontmatter 的笔记骨架；
- 按 kind 决定落盘目录；
- 自动 tags v1（路径映射 + 关键词弱匹配 + KnowledgeBase 保底）。

为了把“创建 + 追加正文”做成一个入口，还封装了 dropin：
- `Alan-Workspace/scripts/openclaw-dropin.sh`

并补充了“生成后打开 Obsidian”的能力：
- `openclaw-dropin.sh --open`（调用 `obsidian-cli open ...`）

### 阶段 E：运行机制（cron 治理 + 噪音守卫）

系统稳定运行依赖两个原则：

- **轻任务 daily**：只检查/只报告
- **重任务 weekly**：做增量整理

当前 cron（示例）：

- `daily-qmd-noise-guard`：扫描 QMD 索引目录是否混入 `_index/bak-md`（report-only）
- `daily-memory-check`：每日 memory 轻检查
- `weekly-memory-hygiene`：每周增量整理（范围收敛）
- `daily-market-brief`：每日极简市场日报（不联网抓新闻，先模板化占位）

其中 QMD 噪音守卫脚本：
- `Alan-Workspace/scripts/qmd-noise-guard.sh`

它的设计要点是：**不依赖 QMD 配置里不存在的 exclude 字段**，而是用“目录隔离 + 守卫巡检”达到同样效果。

---

## 4. 关键规则 / 设计约束

### 4.1 单一事实源
- Obsidian Vault 是长期记忆的唯一入口。
- OpenClaw 的产出按类型落盘：文档进 `01-Articles`，项目进 `03-Projects`。

### 4.2 回答必须可追溯
当回答“基于笔记/知识库/项目”的问题时：
- 必须引用具体笔记路径（Obsidian 可点开）
- 建议格式：`显示名`

这条规则已写入 OpenClaw 工作区的 `AGENTS.md`。

### 4.3 frontmatter 强约束
每篇落盘 Markdown 顶部必须包含：

```yaml
---
title: 标题
aliases: []
category: 分类
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [KnowledgeBase, ...]
---
```

### 4.4 自动化默认非破坏
- 自动化任务默认只报告，不移动、不删除。
- 需要整理/移动时，引导用户手动确认或使用 Obsidian CLI 的 move（可更新链接）。

---

## 5. 文件 / 目录 / 配置变更（落地清单）

### 5.1 Vault 目录（核心）

```text
Alan-Workspace/
├── 00-Inbox/
├── 01-Articles/
│   ├── OpenClaw/
│   ├── Knowledge/
│   ├── Learning/
│   └── _index/               # 自动索引输出（不建议纳入 QMD 索引源）
├── 03-Projects/
├── 04-Memory/
│   ├── topics/
│   └── daily/
├── 05-Daily/
│   └── Market/
├── 99-Attachments/
├── rules/
├── scripts/
└── templates/
```

### 5.2 关键文件作用表

| 路径 | 类型 | 作用 |
|---|---|---|
| `Alan-Workspace/INDEX.md` | Markdown | Vault 总入口 |
| `rules/frontmatter-spec.md` | Markdown | frontmatter 规范 + tags 策略 |
| `rules/openclaw-writing-workflow.md` | Markdown | OpenClaw→Vault 落盘 SOP |
| `scripts/new-note.py` | Python | 统一生成笔记骨架（带 frontmatter） |
| `scripts/openclaw-dropin.sh` | Shell | 创建笔记 + 追加正文（可 --open） |
| `scripts/add-frontmatter.py` | Python | 批量补齐 frontmatter（安全模式） |
| `scripts/qmd-noise-guard.sh` | Shell | QMD 噪音守卫（report-only） |
| `scripts/sync-openclaw-to-vault.sh` | Shell | OpenClaw→Vault 镜像同步（可选） |

### 5.3 OpenClaw 配置关键段

- `agents.list[].workspace` 指向 Vault
- `memory.qmd.paths` 增加 Vault 关键目录
- `contextPruning/compaction` 负责上下文治理（减少 token 膨胀）
- `memory.qmd.sessions.retentionDays=7` 降低 sessions recall 噪音

---

## 6. 示例 / 模板 / 命令

### 6.1 创建一篇归档笔记（knowledge）

```bash
[本机路径已隐藏] \
  --kind knowledge \
  --title "信用利差因子研报" \
  --source "https://example.com" \
  --source-type web
```

### 6.2 创建并追加正文（dropin）

```bash
echo "正文内容" | \
[本机路径已隐藏] \
  --kind learning \
  --title "Python asyncio" \
  --open
```

### 6.3 QMD 索引更新

```bash
openclaw memory index --force
```

### 6.4 噪音守卫（report-only）

```bash
[本机路径已隐藏]
```

---

## 7. 当前结果（运行机制总结）

- Vault 作为长期记忆中心：OpenClaw 直接落盘、Obsidian 原生展示。
- QMD 可检索 Vault 的关键目录：OpenClaw 的回答可基于“你自己的笔记”。
- 产出标准化：frontmatter + 模板 + 生成器，避免元数据混乱。
- 自动化治理：daily/weekly cron 负责轻检查与增量整理；噪音守卫防止 recall 污染。
- 可扩展：后续可以逐步加入“网页抓取+摘要”“日报数据源接入”“Obsidian 插件侧边栏交互”。

---

## 8. 风险点与注意事项

1) **QMD 不要全量索引 01-Articles**：先索引 OpenClaw/Knowledge/Learning/topics，避免噪音 recall。
2) **微信 mp 链接抓取不稳定**：建议先做“占位归档 + 手动粘贴后二次摘要”兜底。
3) **文件重命名要用 Obsidian CLI move**：避免 wikilinks 断链。
4) **自动化默认非破坏性**：巡检只报告，移动/删除需要人工确认。

---

## 9. 后续可增强方向

- 增强 URL 归档：可抓正文则自动摘要；不可抓则标记 `needs_manual_capture`。
- 增强日报：接入可控的数据源（新闻/日历/交易记录），避免“无数据模板”。
- 上 obsidian-sync：在 Obsidian 里直接对话与触发归档/生成（复杂度更高，建议晚点上）。
- 建立 Dataview 报表：frontmatter 覆盖率、标签分布、项目热度等。

---

## 10. 结论

这套 OpenClaw × Obsidian 的关键不在“多装插件”，而在于工程化的三条主线：

1) **把 Vault 变成唯一长期记忆落点**（OpenClaw 住进 Vault）；
2) **把产出标准化**（frontmatter + 模板 + 生成器）；
3) **让系统自己变干净**（QMD 选择性索引 + 噪音守卫 + cron 轻重拆分）。

最终效果是：AI 不再是一次性聊天窗口，而是一个能持续维护你的 Obsidian 知识库的长期助手。

## 

`#OpenClaw` `#Obsidian` `#QMD` `#Automation` `#Cron` `#KnowledgeManagement` `#EngineeringPractice` `#AIAgent` `#SecondBrain`
