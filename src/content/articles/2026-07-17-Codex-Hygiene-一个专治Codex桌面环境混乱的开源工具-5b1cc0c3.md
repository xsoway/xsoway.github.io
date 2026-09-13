---
title: "Codex Hygiene：一个专治 Codex 桌面环境混乱的开源工具"
created: "2026-07-17"
published: true
---

# 9.5K Star！专治 Codex 桌面环境混乱：一个顺手测上下文、查代理、管长线程的开源工具

你有没有遇到过这种情况——

Codex 桌面跑着跑着，突然觉得 token 消耗得不对劲。线程明明只写了几百行，翻看日志却已经烧掉了大几万 token。也不知道是代理插件在背后反复扫目录，还是某个 MCP 服务在疯狂刷心跳，还是单纯因为长期线程没关、上下文越滚越臃肿。

你当然可以挨个排查，但问题是你甚至不知道从哪里下手。

最近有人把这个麻烦事儿做成了一个独立的 Codex 技能——**codex-hygiene**。一个专治 Codex 桌面环境"看不清楚到底在发生什么"的开源小工具。

## 一句话结论

Codex Hygiene 就是一个装在 Codex 技能目录里的诊断脚本集合，帮你把 Codex 桌面后台到底在干什么、token 花在哪、哪些代理在活动、哪些 MCP 还挂着，全部读出来——**用只读 SQLite 查询，不动你的日志，不删你的缓存，不做任何破坏性操作。**

适合那种"想搞清楚桌面状态，但又不想手翻 SQLite 数据库"的开发者。

## 核心亮点

### 1. 读 Codex 桌面后台数据库，不写只查

它直接读 Codex 桌面的 SQLite 本地数据库（只读模式打开 `sqlite3 -readonly`），把工具调用统计、每线程 token 消耗、窗口活动情况拉出来，然后给你一个紧凑的数字报告，不会 dump 全量日志、不会暴露密钥或环境变量。

这条很重要——它是在**你已有的数据上做聚合查询**，不是新起监控。

### 2. 区分工具可用性 vs 工具实际调用

Codex 桌面里，工具列了一大堆。但哪些是真正被调用过的、哪些只是"可用"状态，很多人分不清。Hygiene 把这两类分开统计——帮你看出「表面配置膨胀」和「实际调用开销」之间的差距。

这其实是在回答一个挺常见的问题：我的 token 是花在了真干活上，还是花在了给 Agent 列出 50 个它根本不用的工具上？

### 3. 识别四种常见膨胀源

脚本会帮你判断，token 消耗异常是不是由这几类原因导致的：

- 应用表面（skill/MCP/plugin）配置过多
- 快照（snapshot）被反复复用导致上下文膨胀
- 项目配置文件（project stanzas）过期未清理
- 长线程回放累积的上下文开销

### 4. 长线程任务的质量提醒

对长时间运行的目标（goal）工作流，Hygiene 会建议缩小回放范围和工具作用域，而不是无脑降低推理强度、禁用子代理或跳过真实证据源。策略是"更窄更精"而不是"更笨更快"。

### 5. 只读优先，没有误操作风险

脚本默认全部只读查询。任何涉及删除、重启、禁用的操作，脚本都标记为"需要用户明确确认"才能执行。

### 6. 建议可逆的 Hygiene 步骤

它不会跟你说"删掉日志""清空缓存""删掉项目"这种暴力方案，而是给出可逆的、逐项可回退的建议——比如备份配置文件后再修改，或者先关掉某个 MCP 服务看看效果。

### 7. 支持指定窗口和线程

你可以只查当前窗口最近 30 条记录，也可以指定具体线程 ID。默认跑最近 5 条，想看更多就加参数。

### 8. 依赖 macOS/Unix 原生工具 + jq

不需要装 Docker 或复杂运行时。依赖链很轻：Bash、sqlite3、Perl、awk、sort，加上可选的 jq（用于读取 Codex 缓存和插件状态）。macOS 和 Linux 都能跑。

### 9. 安装就是 git clone 进技能目录

安装方式：`git clone` 到 `$HOME/.agents/skills/codex-hygiene`，然后直接跑脚本，不需要额外注册或重启（除非 Codex 没自动识别）。

## 快速上手

### 安装

```bash
mkdir -p "$HOME/.agents/skills"
git clone https://github.com/sunflower-of-parchman/codex-hygiene.git \
  "$HOME/.agents/skills/codex-hygiene"
```

然后检查技能是否被 Codex 自动识别。如果没出现，重启一下 Codex。

### 运行诊断

最简单的用法，直接跑：

```bash
SKILL_DIR="$HOME/.agents/skills/codex-hygiene"
"$SKILL_DIR/scripts/measure_codex_context.sh"
```

默认输出最近 5 条记录的紧凑统计。

想指定窗口或线程：

```bash
"$SKILL_DIR/scripts/measure_codex_context.sh" 30
"$SKILL_DIR/scripts/measure_codex_context.sh" 5 <thread_id>
```

输出格式是紧凑的数字汇总，不会刷屏，适合顺手跑一下看个状态。

### 命令速查

| 阶段 | 命令 | 用途 |
|------|------|------|
| 安装 | `git clone ... "$HOME/.agents/skills/codex-hygiene"` | 克隆到 Codex 技能目录 |
| 诊断 | `"$SKILL_DIR/scripts/measure_codex_context.sh"` | 默认查最近 5 条 |
| 指定窗口 | `"$SKILL_DIR/scripts/measure_codex_context.sh" 30` | 查最近 30 条 |
| 指定线程 | `"$SKILL_DIR/scripts/measure_codex_context.sh" 5 <thread_id>` | 查具体线程 |

## 项目结构速览

```bash
codex-hygiene/
├── SKILL.md                    # 技能入口
├── agents/openai.yaml          # Agent 配置
├── scripts/
│   └── measure_codex_context.sh  # 核心诊断脚本
├── tests/
│   └── measure_codex_context_test.sh
└── references/
    ├── remediation.md           # 修复建议
    └── long-thread-replay.md    # 长线程回放分析
```

## 适用边界

Hygiene 适合以下场景：

- Codex 桌面 token 消耗异常时，快速定位膨胀源
- 想定期巡检 Codex 环境状态，但不希望侵入性操作
- 需要向团队或自己解释"token 到底花在哪了"

不适合：

- 实时监控或告警场景（它是按需诊断，不是守护进程）
- 需要修改配置/删除缓存的操作（它只建议，不做）
- 非 Codex 桌面的场景（它专读 Codex 的 SQLite 数据库格式）

## 写在最后

Codex Hygiene 不是一个"装上就解决问题"的工具，它是一个**帮你搞清楚问题在哪**的工具。这在调试环境膨胀的时候，其实是最难的那一步——你根本不知道从哪查起，它就帮你在数据库里把答案筛出来了。

如果你跟我一样，跑 Codex 桌面跑了几个月，线程、MCP、skill、快照堆积起来，已经开始觉得"桌面状态有点模糊了"，那这个项目值得一试。

不是因为它功能多炫，而是因为它做的事情很具体、很克制——查一下，看一眼，然后决定要不要动手。这种分寸感，在开源工具里反而少见。

---

#Codex #Hygiene #开源项目 #效率工具 #AI #LLM #调试 #桌面环境 #CodexDesktop #SQLite #开发者工具 #技能诊断