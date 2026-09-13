---
title: "想盯住 AI 圈每天的新动静？这个项目把十个信源揉成一份每日简报"
created: "2026-08-29"
tags: ["KnowledgeBase","AI","简报","GitHubActions","MCP","开源","效率","CLI"]
category: "技术分享"
published: true
---

# 想盯住 AI 圈每天的新动静？这个项目把十个信源揉成一份"每日简报"

搞 AI 的人都懂那种累：今天又有新模型、新仓库、新论文、新工具；刷 GitHub、刷 Hacker News、刷 Product Hunt，一整天下来东看一条西看一条，时间花了不少，脑子里还是一团浆糊。

我一开始也想着"自己搭个爬虫把想要的都拉下来"，结果坐下来就发怵——各家的接口、格式、更新频率全不一样，光是捋清楚就要分走我半天的劲。说实话，**我要的不是一堆散落的链接，是每天有人把 AI 圈的动静整理成一页能扫完的东西。**

后来就撞见 agents-radar 这个项目。一句话：**它每天早上 07:00 自动把 10 个 AI 数据源的动静，裹成一份中英双语的"今日简报"，发成 GitHub Issues、存成 Markdown、还顺手推到你的 Telegram 和飞书。** 你睁眼打开就能看，不用自己爬。

---

## 1. 这到底是干嘛的

先把它钉死：**它不是一个"AI 资讯 App"，而是一个跑在 GitHub Actions 上的自动化简报流水线。**

它不是给你一个链接让你自己去刷，而是**把散在 10 个数据源里的 AI 动静，每天自动收拢成结构化报告**。你订阅它，等于雇了个不睡觉的"情报员"替你守着这些源：

- 18 个 AI 工具仓库的 Issue / PR / Release
- Claude Code Skills 的热门讨论（按社区热度排，不是按时间）
- GitHub 每日热榜 + 6 个 AI 主题（7 天窗口）
- Hacker News 过去 24 小时的 top-30 AI 帖
- Product Hunt 昨日 AI 产品、ArXiv 最新论文、Hugging Face 热门模型、Dev.to、Lobsters、还有 Anthropic / OpenAI 官网的更新

**它不是"给你链接"，而是"帮你把链接嚼一遍、喂到你嘴边"。** 适合你这种：时间贵、又不想错过 AI 圈大盘动向的人——订阅一下，当天的 AI 动静就齐了。

## 2. 里头长这样

它是个小仓库，核心就这几块，一眼能扫过来：

```text
agents-radar/
├── src/                    # 主流水线代码
│   └── providers/          # 各家 LLM 供应商的抽象层
├── mcp/                    # 自托管的 MCP Server
├── digests/                # 每天生成的报告（Markdown）
├── config.yml              # 可自定义的追踪仓清单
├── .github/workflows/      # 每日定时任务
└── assets/                 # 图、封面
```

最值钱的是 `config.yml`——你想增删到底盯哪些仓库，改这一个文件就行，不用碰代码。生成的报告按天落在 `digests/YYYY-MM-DD/` 下。

## 3. 值在哪儿

真让我眼前一亮的不只是"天天有人整理"，是它把"整理"这件事做得挺讲究。给你拆几条：

1. **十个信源一次拉齐，还分门别类。** 它把所有 AI 动静按主题拆成几类报告：CLI 工具、Agent 生态、AI 基础设施、官网动态、趋势热榜、Hacker News 情绪。 → 你早上一眼扫到"今天谁发了新模型、谁有热议题"，不用自己在十几个标签页里来回转。
2. **一遍跑通，中英文一份就出。** 每份报告先用英文生成一次，再翻成中文，**不对同一份数据跑两遍流水线**。 → 省时，也保证中英对得上。
3. **自带横向对比，不只看单一仓库。** 同赛道项目它会放一起挖（比如 OpenClaw 就拉上 4 个同类）。 → 单纯"每家在干嘛"不够，它还给你"谁跟谁在同一赛道上、进展差多少"。
4. **有 MCP Server，能被自己的 Agent 直接查。** 不止是一个网页，它把报告暴露成 MCP 工具接口。 → 你常用的 Agent 可以直接问它"最近 AI CLI 有什么动静"，不用再人工去翻网页。这是这项目比较超前的一个点。
5. **追官网的动态，不止刷 GitHub。** 通过对比 Anthropic / OpenAI 官网的 Sitemap 何时更新来检测新文章。 → 那些"还在产品首页、没上 GitHub"的官网发布，它也不漏。

一句话：**它比的不是"能不能搜"，是"能不能每天自动、稳定、分层地收拢给你看"。** 我真正服气的是它把"你订阅一个机器人"这件事做成了,而不是甩给你一堆要自己扫的入口。

## 4. 拉起就能跑

它有两种用：**要么直接用现成的订阅**（Web / Telegram / RSS / MCP），**要么自己 fork 一个跑起来**（多半是想改数据源或长期自用）。下面给你原样命令。

**去看它攒好的报告（最省事，不用装任何东西）：**

- Web UI：`https://duanyytop.github.io/agents-radar`
- Telegram 频道：`https://t.me/agents_radar`
- RSS：`https://duanyytop.github.io/agents-radar/feed.xml`
- MCP Server：`https://agents-radar-mcp.duanyytop.workers.dev`

**想本地跑起来（要装 Node 环境）：**

```bash
pnpm install

export GITHUB_TOKEN=ghp_xxxxx
# 方式 A: Anthropic（默认）
export ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
# 方式 B: OpenAI
# export LLM_PROVIDER=openai
# export OPENAI_API_KEY=sk-xxxxxxxx
# 方式 D: OpenRouter
# export LLM_PROVIDER=openrouter
# export OPENROUTER_API_KEY=sk-or-xxxxxxxx
# 方式 E: DeepSeek
# export LLM_PROVIDER=deepseek
# export DEEPSEEK_API_KEY=sk-xxxxxxxx
export DIGEST_REPO=your-username/agents-radar  # 可选

pnpm start
```

本地跑的步骤其实很简单：装依赖 → 配一个 LLM 供应商的 key → `pnpm start` 跑出来就生成当天报告。想正式把它"挂了每天跑"，就去 fork + 配置 secrets + 启用那个 workflow。

命令速查在此：

| 阶段 | 命令 |
|---|---|
| 装依赖 | `pnpm install` |
| 本地跑一次 | 配好 env 后 `pnpm start` |
| 跑自测（MCP 自托管） | `cd mcp && pnpm install && wrangler deploy` |

## 5. 装到别处也能用（多环境/多 Agent）

这个项目的精髓其实在**它的 MCP Server**——它不只是一个"你想看的网页"，还能被各种 Agent 当成数据源直接查。我把几种接入方式用对话给你演示一遍：

**在 Claude Desktop 里接它（改一份配置就行）**

```json
{
  "mcpServers": {
    "agents-radar": {
      "url": "https://agents-radar-mcp.duanyytop.workers.dev"
    }
  }
}
```

保存后重启 Claude Desktop，它能直接听懂问题：

```text
用户  ❯ 最近 AI CLI 工具有什么动态？

助手  ❯ 我帮你查 agents-radar 的 MCP 工具，看最新一期……
```

**在 OpenClaw（或别的 MCP 工具里接它）**

OpenClaw 那边一行命令就来：

```bash
openclaw mcp add --transport http agents-radar https://agents-radar-mcp.duanyytop.workers.dev
```

然后你在 OpenClaw 里就能直接问"搜一下本周提到 Claude Code 的报告"——它会去调 `search` / `get_latest` 这类工具，把结果给你返回。

> 想自己托管这份 MCP Server，就进 `mcp/` 目录 `pnpm install` 后 `wrangler deploy`，部署成你自己的实例。

### 在 DeepSeek Harness / PyCharm（把它当数据源接口用）

它不是个 Python 库，但你完全可以把它发布的 JSON/Markdown 报告当成数据源接进来——你要它日常给你"今天 AI 圈有啥大事"，就跟它说"把 agents-radar 今天的简报整理给我"就行。这里是"组合着用"的活，不算它官方接口：

```text
你  ❯ 我多用 DSH 这类 agent 写文/看简报，能不能每天自动拉一份 AI 日报？

助手  ❯ 可以，它本质是个数据流。你把我拉来的 `digests/` 报告（Markdown）当输入，
         每天让它聚合一次；MCP 的查询那部分，把这服务地址加进你的 MCP 配置即可。
         想让模型直接用 MCP 查，就加 URL；想本地处理，就拉 `digests/` 的 Markdown。
```

**装到别的工程里（Python / PyCharm 思路）：** 你要是想在 PyCharm 里每天自动读这份日报再喂给你的分析脚本，直接拉它 `digests/` 下的 Markdown、或订阅它的 RSS / MCP 当输入就行，不用把它当库 import。

## 6. 项目在这

`https://github.com/duanyytop/agents-radar`

#AI #日报 #MCP #GitHubActions #自动化 #开源 #CLI #效率