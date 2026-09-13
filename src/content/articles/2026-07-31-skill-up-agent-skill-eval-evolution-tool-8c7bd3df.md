---
title: "阿里开源了一个 Agent Skill 评测工具：skill-up，把“写测试用例”这件事让 AI 自己干了"
created: "2026-07-31"
tags: ["KnowledgeBase","Agent","开源项目","评测框架","MCP","AI工具"]
category: "技术分享"
published: true
---

# 阿里开源了一个 Agent Skill 评测工具：skill-up，把“写测试用例”这件事让 AI 自己干了

写 Agent Skill 最痛苦的事情，不是写 SKILL.md，而是写完之后你根本不知道它好不好用。

跑一遍吧，没个标准，全靠感觉。写几个测试用例？行，但手动写 YAML 测试用例比写 Skill 本身还累，而且你写了 10 个，改一次 Skill 就要改一遍，改了之后还得再跑一遍，跑完还得看输出——这流程做两轮你就想放弃。

最近阿里开源了一个叫 **skill-up** 的工具，正好把这个坑填上了。

## 一句话结论

**skill-up 是一个 Agent Skill 的评测与演进工具——你给它一个 Skill 项目，它自动生成评测用例、跑评测、出报告，跑不过的还能自己修。** 适合写 Agent Skill、维护 Skill 评测集、或者想给开源 Skill 上 CI 的人。

---

## 核心亮点

### 1. 声明式评测配置，YAML 搞定

不用写脚本，不用搭环境。一个 `eval.yaml` 定义评测引擎、模型和用例，用例文件放在 `cases/*.yaml` 里，目录结构清清爽爽：

```
my-skill/
├── SKILL.md
├── evals/
│   ├── eval.yaml
│   └── cases/
│       └── <case-id>.yaml
```

评测引擎、模型、用例，全部声明式，不需要在代码里硬编码任何东西。

### 2. 多引擎支持，不绑定客户端

内置支持 **Qoder CLI、Claude Code、Codex**，还能通过 `engine.custom` 接入自定义 Agent。你写一个 Skill，可以在多个引擎上同时跑，看哪个引擎执行效果最好。

对于团队来说，这意味着「一份评测配置，跨引擎校验」，不用担心某个 Skill 只在你的环境里跑得通。

### 3. 三种评分策略，灵活适配场景

- **rule_based**：规则匹配，适合预期输出明确的场景
- **script**：脚本评分，适合需要自定义逻辑的判断
- **agent_judge**：Agent 评分，让另一个 AI 来判断输出质量

从「简单字符串匹配」到「AI 打分」，按需选，不用一刀切。

### 4. 结构化报告，本地和 CI 都能用

输出兼容 Anthropic 格式的 `grading.json`、`benchmark.json`、`benchmark.md`，还有 `result.json`、JUnit XML 和 HTML 报告。本地跑完看一眼，CI 跑完直接附在 PR 评论里，都行。

### 5. 最值钱的一点：skill-upper，让 AI 自己写评测用例

这是 skill-up 真正的杀手锏。

**skill-upper** 是一个内置的 Agent Skill，你直接在 Codex 或 Claude Code 里对话就能用。给它一个 Skill 项目，它会：

1. 阅读 SKILL.md，识别关键能力
2. 自动创建真实的 eval 用例
3. 选择合适的 Judge
4. 校验配置，运行 skill-up
5. 出报告，总结失败项

然后你继续说「检查失败原因，修复 Skill 或 eval 用例，补充回归用例，重新跑」——它就真的照做。

**从「我写评测 → 我跑 → 我改」变成了「AI 写评测 → AI 跑 → AI 分析 → AI 修 → AI 补回归用例」。**

安装 skill-upper 也很简单，一行命令：

```bash
# Codex 全局安装
npx skills add https://github.com/alibaba/skill-up/tree/main/skills/skill-upper -g -a codex -y

# Claude Code 全局安装
npx skills add https://github.com/alibaba/skill-up/tree/main/skills/skill-upper -g -a claude-code -y
```

安装后，在 Agent 中打开 Skill 项目，直接对话：

> 使用 skill-upper 评测这个 Skill。
> 阅读 SKILL.md，识别最重要的能力，创建真实的 eval 用例并选择合适的 Judge，校验配置后运行 skill-up。最后总结结果和影响最大的失败项。

然后继续迭代：

> 检查最新的 skill-up 评测结果。逐个判断失败来自 Skill 还是 eval：按需修复 SKILL.md 和相关文件，或修复 eval 用例与 Judge；为发现的问题补充回归用例，然后重新运行 skill-up，直到关键能力通过评测。

### 6. CI 就绪，每个 PR 自动跑评测

GitHub Action 已经内置了，`action.yml` 在仓库根目录。配置示例：

```yaml
# .github/workflows/skill-eval.yml
name: Skill Eval
on:
  pull_request:
    paths: ['skills/**', 'evals/**', '**/SKILL.md']
jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: alibaba/skill-up@main
        with:
          engine: claude_code
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          base-url: https://api.anthropic.com
          skill-target: evals/eval.yaml
```

PR 一开，自动跑评测，结果直接贴在 PR 里。注意这是 Docker 容器 action，仅 Linux 支持，需要把模型凭据存为仓库 secret。

### 7. Anthropic 兼容，迁移成本低

如果你已经在用 Anthropic 的 `evals.json` 格式，skill-up 可以直接 `import` 导入，或者用 `--auto` 自动识别。不需要重新写一套评测文件。

### 8. 适用边界

客观说两句：

- **最适合的场景是 Agent Skill 的评测和迭代**，不是通用测试框架，也不是压力测试工具
- skill-upper 的自动修复能力取决于底层模型的判断力，复杂场景下可能修复方向不对，需要人工确认
- CI action 仅支持 Linux（Docker 容器），Windows 和 macOS 需要额外处理
- 跨引擎评测时，不同引擎对同一 Skill 的理解和执行可能有差异，评测结果需要人工解读

---

## 快速上手

### 安装 CLI

```bash
curl -fsSL https://raw.githubusercontent.com/alibaba/skill-up/main/install.sh | bash
```

### 命令速查

| 命令                                   | 用途                                 |
| ------------------------------------ | ---------------------------------- |
| `skill-up run [path]`                | 运行评测用例并生成报告                        |
| `skill-up validate [path]`           | 校验 eval.yaml 和用例文件                 |
| `skill-up list-cases [path]`         | 列出配置引用的所有用例                        |
| `skill-up report <result.json>`      | 从已有结果生成报告                          |
| `skill-up import <evals.json>`       | 将 Anthropic evals.json 导入为 YAML 用例 |
| `skill-up debug judge <input.json>`  | 使用 JSON 输入调试 judge 模块              |
| `skill-up debug report <input.json>` | 使用 JSON 输入调试 report 模块             |

### 典型工作流

如果你用 skill-upper（推荐），流程是：

1. 在 Codex / Claude Code 中打开 Skill 项目
2. 对话触发 skill-upper 创建评测集并运行
3. 查看报告，对话驱动修复
4. 补充回归用例，继续迭代

如果你手动写评测，流程是：

1. 创建 `evals/eval.yaml` 和 `evals/cases/*.yaml`
2. 运行 `skill-up validate` 校验配置
3. 运行 `skill-up run` 执行评测
4. 查看报告，修复 Skill 或 eval
5. 提交 CI 配置，让 PR 自动触发

---

## 写在最后

skill-up 解决的不是「有没有测试工具」的问题，而是「写评测比写 Skill 还累」的问题。

它把评测从「手动写 YAML + 手动跑 + 手动看结果」的苦活，变成了「AI 自动写 + AI 自动跑 + AI 自动修」的闭环。skill-upper 这个 Agent Skill 的加入，让整个流程的杠杆率一下子拉高了不少——你只需要在对话里说「修一下这个失败的用例」，它就能自己去读报告、改配置、补回归用例。

对于写 Agent Skill 的人，或者团队里维护 Skill 评测集的人来说，这个工具值得一试。尤其如果你已经在用 Codex 或 Claude Code 写 Skill，skill-upper 的安装就是一行命令的事。

阿里这次的开源姿态也不错，Apache 2.0 许可，文档齐全，有官网有快速开始指南，也有 Windows 支持说明和已知限制——属于那种「看了文档就知道能不能用」的项目。

---

#skill-up #阿里开源 #Agent #Skill评测 #AI工具 #Codex #ClaudeCode #评测框架 #CI #开源项目 #测试工具