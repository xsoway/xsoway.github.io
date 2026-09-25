---
title: "我把自己\"蒸馏\"成了一个可运行的 Skill：echo-me-skill 手记"
created: "2026-09-24"
tags: ["KnowledgeBase","AIAgent","EngineeringPractice","OpenSource"]
category: "工程实践"
published: true
---

# 我把自己"蒸馏"成了一个可运行的 Skill：echo-me-skill 手记

先说我在琢磨什么：一个人跟你说过的话、记的日记、拍过的照片里，到底藏了多少"他是谁"。我一直觉得这类东西不是玄学，是可结构化的——只是大多数"数字化自己"的做法，两头都踩空。

有一种是让模型"猜"你的性格，没有任何真实材料，生成出来的是个抄别人说话的人设；另一种是反过来，把你几十万条聊天记录原样倒进去，让模型在一大坨原生数据里自己找感觉。前者凭空捏，后者没结构。两个我都接受不了。

于是我把一个已经存在的开源项目 [`yourself-skill`](https://github.com/notdog1998/yourself-skill)（作者 notdog1998）从架构层面全量重写了一遍，做成一个独立的 Skill 包，叫 **echo-me-skill**，开源在 [`xsoway/echo-me-skill`](https://github.com/xsoway/echo-me-skill)。

## 为什么重写，而不是直接用

原项目把"把聊天记录转成自我"的雏形做出来了，是值得致敬的起点。但它在工程上有些薄弱：包结构不满足可安装的技能契约、品牌归属混淆、也没办法独立开源。直接拿来用，问题不在功能，而在"能不能被干净地分发、安装、验证"。

我要的不是一个我手动维护的文件夹，而是一个能放进别的 Agent 环境、能被机器校验、能持续进化的东西。所以代码、文案、示例全部重写，代码一个字节没抄原项目，只在 LICENSE 里如实保留了对它的衍生声明。

重写时我给自己立了三条线，后来也成了这个包的安全底线：

1. **不臆造**——生成的自我只能来自你提供的原材料或明说的信息，信息缺口就问，绝不编经历。
2. **原材料不入库**——聊天记录、照片、个人信息只落到本机 gitignored 的目录，一个字节都不进仓库。
3. **验证诚实**——结构校验通过只证明"包完整"，不等于"模型行为已验证"。

## 它是什么

把历史材料蒸馏成两层模型，而不是一个大而全的"关于我"文件：

- **Self Memory（自我记忆）**——你知道什么、你是谁。经历、价值观、生活习惯、重要记忆、人际关系、成长轨迹。
- **Persona（人格）**——你怎么回应。说话风格、情感模式、决策模式、人际行为，把"标签"翻译成具体行为规则。

再叠一层 **Correction**：你纠正它"这不对，我不会这样说"时，修正立即写入，优先级高于既有结论。意思是这面镜子不是一次成型就冻结，而是跟着你的变化持续维护。

判断时先过 Persona——决定"怎么回话"；再由 Self Memory 补充——决定"回得是否真实"。两层各司其职，拆开了才好更新、才好回滚。


## 为什么需要


多数"数字化自己"的尝试会掉进两个坑：要么凭空捏造一个人格，要么把原始聊天记录一股脑堆进去而毫无结构。本包为避开这两者而存在。

|痛点|常见做法|echo-me-skill|
|---|---|---|
|没有真实材料 → 人格全靠编|让模型"猜"你的性格|绝不臆造：只基于你提供的原材料或明说的事实|
|原材料泄漏进仓库|聊天记录被提交进 git|原材料只落到 gitignored 的 `.claude/skills/{slug}/memories/` |
|单一大块、难进化|一个"关于我"的文件|两层模型（Self Memory + Persona）+ Correction 层，增量进化|
|打包不可测试|复制粘贴的 skill 文件夹|skill-spec 契约 + 校验器 + pytest + ruff|

**为什么要一个数字自我**——保存"此刻的你"：从你说过的话里学会你怎么说话、在意什么，并在你变化时持续维护这面镜子。

## 核心概念


- **Self Memory（自我记忆）** —— _你知道什么、你是谁_：经历、价值观、生活习惯、重要记忆、人际关系、成长轨迹。
- **Persona（人格）** —— _你怎么回应_：说话风格、情感模式、决策模式、人际行为——把标签翻译成具体行为规则。
- **Correction 层** —— 你的对话纠正立即写入，优先级高于既有结论。
- **两层模型** —— 先判 Persona（怎么回话），再由 Self Memory 补充（回得是否真实）。

## 仓库结构


```
echo-me-skill/
├── AGENTS.md                 # 项目规则（继承工作区总纲）
├── CLAUDE.md                 # Claude Code 入口（回读父级规则）
├── LICENSE                   # MIT，含对 yourself-skill 的衍生声明
├── README.md                 # English
├── README.zh-CN.md           # 中文（本文件）
├── SKILL.md                  # 入口：frontmatter + 6 必需标题 + 硬约束
├── pyproject.toml            # uv / pytest / ruff 配置
├── .gitignore
├── agents/
│   └── openai.yaml           # 发现元数据（key 与目录名一致）
├── prompts/
│   ├── echo-me-skill.md      # 主执行规范（Step A–E、进化、管理）
│   └── self_analyzer / persona_analyzer / *_builder / merger / correction_handler / intake
├── evals/
│   ├── eval.yaml
│   └── cases/                # basic-success、edge-incomplete-input、edge-scope-boundary
├── scripts/
│   └── validate_skill_package.py   # 包结构校验
├── tools/                    # 解析器与管理器（可独立 CLI + 可导入）
│   ├── wechat_parser.py
│   ├── qq_parser.py
│   ├── social_parser.py
│   ├── photo_analyzer.py
│   ├── skill_writer.py
│   └── version_manager.py
├── references/
│   ├── package-contract.md
│   └── skill-up-integration.md
├── examples/
│   └── skill-package-tree.md
├── docs/
│   └── PRD.md
├── selves/                   # 中性示例自我（仅占位）
│   └── example_me/
└── tests/                    # pytest 单测
```

## 快速开始


环境要求：Python `>=3.9`，并安装 [uv](https://docs.astral.sh/uv/)。

```shell
# 1. 安装依赖
uv sync --extra dev

# 2. 创建你的第一个自我（触发主流程）
#    按 SKILL.md / prompts/echo-me-skill.md 的 Step A–E 执行：
#    A) 信息录入  B) 原材料导入  C–E) 分析、预览、写盘
#    产出落在 ./.claude/skills/{slug}/，通过 /{slug} 触发词使用。

# 3. 校验包结构（本仓库自身不破坏契约）
python3 scripts/validate_skill_package.py .
# → PASS: echo-me-skill package contract

# 4. 跑测试与静态检查
uv run pytest -q       # → 24 passed
uv run ruff check tools tests scripts   # → All checks passed
```

## 功能与用法

### 创建

三步：信息录入（≤3 问）→ 原材料导入（可跳过）→ 分析、预览、写盘（通过解析器/管理器工具）：

```shell
# 微信聊天记录                 QQ 聊天记录
python tools/wechat_parser.py --file chat.txt --target "我" --output /tmp/w.txt
python tools/qq_parser.py      --file chat.txt --target "我" --output /tmp/q.txt

# 照片元信息                    写盘创建自我
python tools/photo_analyzer.py --dir ./photos --output /tmp/p.txt
python tools/skill_writer.py --action create --slug {slug} \
  --base-dir ./.claude/skills --meta ./meta.json --self ./self.md --persona ./persona.md
```

创建后可通过 `/` 触发词使用：`/{slug}`（完整）、`/{slug}-self`（自我档案）、`/{slug}-persona`（仅人格）。

### 进化（增量追加）


- **追加材料**：先备份，读现有 `self.md` / `persona.md`，只合并增量（`version_manager --action backup`），绝不覆盖既有结论。
- **对话纠正**：你表示"这不对 / 我不会这样说"时，写入 Correction 层并立即重新 combine。

### 管理

| 命令                          | 动作          |
| --------------------------- | ----------- |
| `/list-echo`                | 列出全部自我      |
| `/echo-rollback {slug} {v}` | 回滚到指定版本     |
| `/echo-rollback {slug}`     | 列出历史版本      |
| /echo-delete {slug}`        | 删除某个自我（需确认） |

## 配置

|项|位置|说明|
|---|---|---|
|项目元数据| `pyproject.toml` |name、version、author、依赖|
|Skill 发现元数据| `agents/openai.yaml` | `metadata.key` 必须与目录名一致|
|评测环境| `evals/eval.yaml` |静态结构评测（`environment.type: none`）|
|秘密/绝对路径扫描| `scripts/validate_skill_package.py` |由校验器完成|

无运行时配置文件：Skill 按需读取用户意图与原材料；生成的自我落在 `.claude/skills/{slug}/`，由 `skill_writer` / `version_manager` 工具管理。

## 怎么跑起来

环境要 Python ≥3.9 和 uv：

```bash
uv sync --extra dev
```

创建自我的流程是 Step A–E：先录入基础信息（最多 3 问，代号必填）→ 导入原材料（可跳过）→ 分析 → 预览 → 写盘。示例命令：

```bash
# 微信/QQ 聊天记录解析
python tools/wechat_parser.py --file chat.txt --target "我" --output /tmp/w.txt
python tools/qq_parser.py      --file chat.txt --target "我" --output /tmp/q.txt

# 照片元信息 + 写盘创建
python tools/photo_analyzer.py --dir ./photos --output /tmp/p.txt
python tools/skill_writer.py --action create --slug {slug} --base-dir ./.claude/skills \
  --meta ./meta.json --self ./self.md --persona ./persona.md
```

产物落在 `.claude/skills/{slug}/`，用触发词使用：`/{slug}`（完整）、`/{slug}-self`（自我档案）、`/{slug}-persona`（仅人格）。追加材料只有增量合并，不覆盖已有结论；进化前先备份，随时能回滚、能删除。


## 现在到哪了

已经完成：独立品牌重写、skill-spec 契约 + 校验器 + pytest + ruff + uv、两层模型 + Correction、创建/进化/管理流程。仓库已经公开。

如果想要一个"被蒸馏那一刻的你"，可以从你自己的聊天记录、日记、照片里长出来。数据只留在你机器上，这句话我反复讲，是因为它是我重写这个项目的底线，不是宣传词。

---

项目地址：
- echo-me-skill 仓库：https://github.com/xsoway/echo-me-skill 

`数字自我` `个人AI分身` `Skill工程` `开源` `测试与验证` #skill #skill-create #蒸馏