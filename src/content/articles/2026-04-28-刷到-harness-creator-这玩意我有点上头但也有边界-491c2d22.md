---
title: "2026-04-28-刷到-harness-creator-这玩意我有点上头但也有边界"
created: "2026-04-28"
tags: ["KnowledgeBase","AIAgent","HarnessEngineering","GitHub项目拆解","公众号草稿"]
category: "文章"
published: true
---

标题
刷到 harness-creator 这玩意，我有点上头，但也有边界

开头导语（3～5 行短句）
昨天早上刷到这个 skill，我第一反应是：又一个“我能帮你搞定工程体系”的项目。
结果往下看了两屏，我改口了。
这东西不是教你“多会写 Prompt”，而是直接把 AI 团队作战的地基给你打上。
你肯定也见过：模型很聪明，仓库很混乱，最后产出一坨狗东西。
harness-creator 盯的就是这个缝。

这个项目是干嘛的（一句话）
它是一个“给代码仓库搭 Agent 基建”的 skill：补 AGENTS.md、文档体系、lint 脚本、harness 配置和 CI，让 AI agent 在仓库里能稳定干活。

它解决了什么问题
1) 解决“AI 能力强，但仓库不可读”的问题
- 核心哲学是：Intelligence without infrastructure is just a demo.
- 人话版：CPU 再猛，主板接线乱成麻花，也跑不稳。

2) 解决“只会口头规范，不会机械约束”的问题
- 它要求把规则落到 lint 与配置里，而不是靠大家自觉。
- 人话版：别靠“记得遵守”，要靠“违规就报错并告诉你怎么改”。

3) 解决“不同项目状态下流程混乱”的问题
- 空仓库、已有代码、已有半套 harness，都走统一五阶段流程。
- 核心是先找当前状态和目标状态的差，再补 delta。

核心功能亮点
1. 五阶段统一流程（Detection → Analysis → Delta → Create/Update → Verify）
这在实际中的用处：避免每次都“从感觉出发”，流程可复用、可审计。

2. 并行子 Agent 分工（架构分析/现有 harness 审计/环境依赖分析）
这在实际中的用处：把长链路拆开并发跑，速度快很多。

3. 明确项目状态分类（Empty / Code Only / Partial Harness / Full Harness）
这在实际中的用处：不同阶段干不同的事，不会拿“完整改造方案”砸空项目。

4. Delta 清单化管理（Create / Update / Already Good）
这在实际中的用处：你知道改了什么、为什么改、什么不该动。

5. 产物覆盖完整（AGENTS.md、ARCHITECTURE、lint、harness config、Makefile、CI）
这在实际中的用处：不是单点打补丁，而是一整套可运行基建。

6. 明确边界：不写业务代码
这在实际中的用处：职责清晰，harness-creator 只搭“施工规范+基础设施”，业务实现可交给 harness-executor。

快速开始
它给的核心探测命令如下（原样）：

```bash
# Count files
file_count=$(find . -type f ! -path './.git/*' ! -path './node_modules/*' ! -path './vendor/*' 2>/dev/null | wc -l)
code_files=$(find . -type f \( -name "*.go" -o -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.rs" \) ! -path './.git/*' ! -path './node_modules/*' ! -path './vendor/*' 2>/dev/null | wc -l)

# Check harness components
has_agents_md=$(test -f AGENTS.md && echo "yes" || echo "no")
has_architecture=$(test -f docs/ARCHITECTURE.md && echo "yes" || echo "no")
has_linters=$(ls scripts/lint-* 2>/dev/null | wc -l)
has_harness_dir=$(test -d harness && echo "yes" || echo "no")
has_makefile=$(test -f Makefile && echo "yes" || echo "no")

# Detect tech stack
if test -f go.mod; then TECH="Go"
elif test -f package.json; then TECH="TypeScript/Node.js"
elif test -f requirements.txt || test -f pyproject.toml; then TECH="Python"
else TECH="Unknown"
fi
```

安装/下载它给了这个命令：

```bash
npx @nacos-group/cli skill-get harness-creator -o ~/.copaw/skill_pool
```

关键用法 / 示例
1) 项目状态判定（官方规则）
- Empty：file_count < 5 且 code_files = 0
- Code Only：code_files > 0 且 has_agents_md = "no"
- Partial Harness：has_agents_md = "yes" 且 (has_linters = 0 或 has_harness_dir = "no")
- Full Harness：关键组件都在

2) AskUserQuestion 确认 scope（示例原样）

```json
{
  "question": "What's your priority for this harness setup?",
  "header": "Scope",
  "multiSelect": false,
  "options": [
    {
      "label": "Full harness (Recommended)",
      "description": "Complete setup: AGENTS.md, docs, linters, eval framework, CI integration"
    },
    {
      "label": "Documentation only",
      "description": "Just AGENTS.md + docs/ for now, add linters/evals later"
    },
    {
      "label": "Minimal viable",
      "description": "Only AGENTS.md + basic lint-deps, can expand later"
    }
  ]
}
```

3) Empty 项目补问技术栈（示例原样）

```json
{
  "question": "What tech stack for this project?",
  "header": "Tech Stack",
  "multiSelect": false,
  "options": [
    {"label": "Go", "description": "CLI tools, high-performance services, system programming"},
    {"label": "TypeScript/Node.js", "description": "Web APIs, full-stack apps, rapid prototyping"},
    {"label": "Python", "description": "Data processing, ML/AI, scripting"}
  ]
}
```

4) 无 AskUserQuestion 时的默认上下文模板（原样）

```markdown
## Auto-Detected Context

| Field | Value | Confidence | Evidence |
|-------|-------|------------|----------|
| Tech Stack | {TECH} | High | Found {config file} |
| Project State | {state} | High | {criteria matched} |
| Scope | Full harness | Default | No user preference specified |

Proceeding with these assumptions. Tell me if any need adjustment.
```

5) 验证步骤（原样）

```bash
# 1. Build passes
go build ./... || npm run build || python -m compileall .

# 2. Linters pass
make lint-arch

# 3. AGENTS.md size check
wc -l AGENTS.md  # Should be 80-120 lines

# 4. All expected files exist
test -f AGENTS.md && echo "✓ AGENTS.md"
test -f docs/ARCHITECTURE.md && echo "✓ ARCHITECTURE.md"
test -f scripts/lint-deps* && echo "✓ lint-deps"
test -d harness/ && echo "✓ harness/"

# 5. Design docs exist (not just index)
find docs/design-docs -name "*.md" ! -name "index.md" | wc -l
```

使用感受（不官方版）
这东西最顺的一点，是它把“AI 基建”做成了流水线，不靠临场发挥。
我比较认同它那句“Repository as Single Source of Truth”，这句话真不是口号。
但也别上头：它给的是施工框架，不是替你做产品决策。

适合哪些人用
1. 正在把单人写码迁移到多 Agent 协作的团队
2. 仓库历史包袱重，文档与代码长期脱节的项目
3. 经常遇到“AI 改着改着改坏层级依赖”的工程团队
4. 想把规范从“口头约定”升级成“可执行检查”的负责人
5. 需要让新人或新 Agent 快速上手仓库的团队
6. 做平台/中台，想沉淀跨项目工程脚手架的人

注意事项 / 坑点
1. 官方明确不写业务代码
- 它只做 harness infra。
- Empty 项目里业务代码计划会写到 docs/exec-plans/active/bootstrap-code.md，后续交给 harness-executor 实施。

2. AGENTS.md 有明确尺寸要求
- 建议 80-120 行，做导航图，不要变成长篇手册。

3. lint 报错要“可执行”
- 不是只报“哪里错了”，还要写清 WHY + HOW。

4. verify.json 不要手工造
- 说明里强调：verification config 由 harness-executor 在运行时动态生成。

5. 小项目可以不必强行多 Agent
- 它也写了：<20 文件或无 subagent 能力时，可 inline 执行。

一句话总结
**harness-creator 很猛，像给 AI 团队装了一整套电路和配电箱；但它不是许愿机，地基打完后，业务楼还是你自己盖。**

评论区交作业
你更想要哪种模式？
A. 一次性 Full Harness 全上
B. 先文档后 lint，分阶段上
C. 只要最小可用，先跑起来再说

推荐标签
#AIAgent #HarnessEngineering #AGENTSmd #代码规范 #工程化 #多Agent协作 #Lint #CI #GitHub技能市场 #开发效率