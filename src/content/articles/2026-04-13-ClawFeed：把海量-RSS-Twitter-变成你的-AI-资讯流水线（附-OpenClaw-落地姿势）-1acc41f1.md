---
title: "2026-04-13-ClawFeed：把海量-RSS-Twitter-变成你的-AI-资讯流水线（附-OpenClaw-落地姿势）"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
![](/article-assets/cover/2026-03-07-ClawFeed%EF%BC%9A%E6%8A%8A%E6%B5%B7%E9%87%8FRSS-Twitter%E5%8F%98%E6%88%90%E4%BD%A0%E7%9A%84AI%E8%B5%84%E8%AE%AF%E6%B5%81%E6%B0%B4%E7%BA%BF-v1-cover.svg)

# ClawFeed：把海量 RSS / Twitter 变成你的 AI 资讯流水线（附 OpenClaw 落地姿势）

这年头最不缺的就是信息，最缺的是两样东西：

1) 你能信任的来源
2) 你能坚持看的节奏

`clawfeed` 这个项目的野心很朴素：

> 别再刷了，开始“知道”。

它把 Twitter/RSS/HN/Reddit/GitHub Trending 等一堆源，按规则筛一遍，再用 AI 生成结构化摘要（4 小时/日/周/月），你可以当作一个**独立新闻 digest 工具**，也可以当作 **OpenClaw / Zylos 的 skill** 来跑 cron。

Live demo（项目 README 给的）：https://clawfeed.kevinhe.io

---

## 01. ClawFeed 到底解决什么问题

如果你平时是这样获取信息的：

- 早上刷一圈 X（十分钟变一小时）
- 中午刷 RSS（看完只记得标题）
- 晚上刷 GitHub Trending（想收藏，第二天忘了）

那你其实不是缺“信息源”，而是缺一个系统：

- 能把内容变成固定频率的“投喂”
- 能把噪音挡在外面
- 能把“想深挖的内容”留住

ClawFeed 的设计点基本都围绕这三件事。

---

## 02. 功能拆解：它不是“又一个 RSS 阅读器”，更像资讯生产线

README 里把功能列得很全，这里按“真正能用起来”的角度重新分组。

### 2.1 多频率 Digest（核心）

- 4 小时一次（4H）
- 每日
- 每周
- 每月

这个很关键：你可以把它当“工作节奏”的一部分，而不是“想起来才看”。

### 2.2 Sources 系统（把输入做成可配置）

支持的源类型包括：

- Twitter/X：用户、列表
- RSS/Atom
- HackerNews
- Reddit
- GitHub Trending
- website 抓取
- digest_feed（订阅别人的 digest）
- custom_api（自定义 JSON endpoint）

这意味着你不需要“换 app”，你只需要“换配置”。

### 2.3 Source Packs（把你的信息源打包分享）

这点挺聪明：很多人不是不会订源，是懒得折腾“订哪些”。

Source Packs 相当于：

- 你做一套“高质量源组合”
- 别人一键安装

对团队也有用：你可以给团队统一一套“公司必读源”。

### 2.4 Mark & Deep Dive（收藏 + 深挖）

这就是把“读到一半觉得有用但没空看”的问题解决掉：

- 先 Mark（bookmark）
- 之后 Deep Dive（AI 深度分析）

### 2.5 输出形态（Feed 输出）

- HTML
- RSS
- JSON Feed

这一步等于把 digest 变成你能接入任何系统的“数据源”。

### 2.6 Web Dashboard + SQLite + OAuth

- SPA dashboard
- SQLite（零配置、可搬走）
- Google OAuth（多用户、个人 sources/bookmarks）

如果你只想跑一个“只读摘要站”，可以不启用 OAuth。

---

## 03. 最快跑起来：Standalone（npm）

如果你就是想先试试：

```bash
git clone https://github.com/kevinho/clawfeed.git
cd clawfeed
npm install
cp .env.example .env
# 编辑 .env
npm start
# API 默认 http://127.0.0.1:8767
```

README 里也给了 Docker 方式，适合你要长期跑、要持久化数据的时候。

---

## 04. 生产部署建议：Docker + 持久化 + 环境变量

最简单的生产姿势（带数据卷）：

```bash
docker run -d -p 8767:8767 \
  -v clawfeed-data:/app/data \
  kevinho/clawfeed
```

如果你要开域名、做 CORS、做鉴权：

```bash
docker run -d -p 8767:8767 \
  -v clawfeed-data:/app/data \
  -e ALLOWED_ORIGINS=https://yourdomain.com \
  -e API_KEY=your-api-key \
  -e GOOGLE_CLIENT_ID=your-client-id \
  -e GOOGLE_CLIENT_SECRET=your-client-secret \
  -e SESSION_SECRET=your-session-secret \
  kevinho/clawfeed
```

提醒一句：
- 这些 key 不要进 git
- 本地 `.env` 权限建议收紧（至少别到处发）

---

## 05. 作为 OpenClaw Skill 怎么用（这里才是爽点）

README 给了两条路：

### 5.1 ClawHub 一键装（推荐）

```bash
clawhub install clawfeed
```

### 5.2 手动当 OpenClaw skill 装

```bash
cd ~/.openclaw/skills/
git clone https://github.com/kevinho/clawfeed.git
```

OpenClaw 会自动识别 `SKILL.md` 并加载。接下来你就能：

- 用 cron 生成 digest
- 启 dashboard
- 处理 bookmark/mark 命令

这就很像你在 OpenClaw 里多插了一块“资讯输入模块”。

---

## 06. API 视角：这项目为什么适合做“流水线”

它的 API 很直白（都在 `/api/`）：

- `/api/digests`：列 digest / 获取 digest
- `POST /api/digests`：创建 digest（可用 API_KEY 限制）
- `/api/sources`：sources CRUD
- `/api/marks`：bookmark CRUD
- `/api/packs`：source packs
- `/feed/:slug(.rss|.json)`：订阅输出

这意味着你可以：

- 把它当“digest 服务”
- 用你自己的 orchestrator（比如 OpenClaw）按节奏调用
- 把输出再喂给别的系统（Notion/飞书/邮件/微信群）

---

## 07. 两个很关键的“别踩坑建议”（比功能更值钱）

### 7.1 先把 curation rules 写清楚，否则你会被噪音喂爆

README 提到：

- `templates/curation-rules.md`
- `templates/digest-prompt.md`

这两个文件的意义是：

- 你到底过滤什么
- 你希望摘要长什么样

不改它，你跑出来的 digest 很可能就是“换一种形式的刷信息”。

### 7.2 先跑最小闭环：每日 digest + 收藏深挖

建议你不要一上来就上 4H + 周报 + 月报。

从最小闭环开始：

- 每日 digest（固定时间）
- Mark 一条你真的想深挖的
- Deep dive 产出可复用的结论

跑通以后再加频率。



---


#ClawFeed #OpenClaw #RSS #AI资讯 #信息管理 #Newsletter #内容过滤 #自动化 #SQLite #独立开发
