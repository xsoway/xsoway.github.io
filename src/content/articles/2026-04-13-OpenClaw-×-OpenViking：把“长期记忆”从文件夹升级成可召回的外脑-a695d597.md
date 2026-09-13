---
title: "OpenClaw × OpenViking：把“长期记忆”从文件夹升级成可召回的外脑"
created: "2026-04-13"
published: true
---
> 图片资源未同步：未命名图片

# OpenClaw × OpenViking：把“长期记忆”从文件夹升级成可召回的外脑

做智能体做久了，会发现一个很反直觉的事实：

短期上下文（聊天窗口）越来越强，但长期记忆（偏好、决策、踩坑记录、项目上下文）反而更容易丢。

表面上看大家都在写笔记、存链接、建仓库；实际上很多时候是在堆文件夹，等哪天需要时再也找不到。

这篇文档给了一个很直接的方案：用 **OpenViking** 作为 **OpenClaw** 的长期记忆后端，通过一个 memory plugin 接上。



---

> 给 OpenClaw 装外脑：用 OpenViking 做长期记忆后端

## 这套东西解决什么问题

OpenClaw 能干活不等于记得住。如果记忆只停留在聊天记录和零散 Markdown 文件里，后面会出现几个典型症状：

- 同一个偏好反复问（像每天都在重新认识你）
- 同一个坑反复踩（像永远学不会）
- 做过的决定找不到证据链（像没做过）

OpenViking 在这里扮演的角色，就是把“记忆碎片”变成可检索、可召回、可自动捕获的长期记忆库。

一句话：让 agent 不用每次都从零开始当新人。

---

## 组件关系与工作方式（快速理解）

| 组件 | 角色 | 你最关心的点 |
|---|---|---|
| OpenClaw | Agent 框架/运行时（gateway） | 插件槽位 `plugins.slots.memory` 指向谁 |
| memory-openviking（插件） | OpenClaw 的记忆插件 | 负责把“存/取记忆”接到 OpenViking |
| OpenViking | 长期记忆后端（Python） | `ov.conf` 配置是否正确；服务是否运行 |
| ov.conf | OpenViking 配置文件 | `vlm` + `embedding` 是否都有、key 是否有效 |

---

## 快速上手（推荐）：setup helper 一把梭

文档里最省事的方式是 setup helper。

```bash
cd /path/to/OpenViking
npx ./examples/openclaw-memory-plugin/setup-helper
openclaw gateway
```

setup helper 会做几件你不想手动做、但手动很容易翻车的事：

- 检查环境
- 创建 `~/.openviking/ov.conf`
- 部署插件到 `~/.openclaw/extensions/memory-openviking`
- 自动配置 OpenClaw

---

## 手动安装与配置（可复制版）

### 0）前置条件

- OpenClaw：

```bash
npm install -g openclaw
```

- Python ≥ 3.10 + openviking：

```bash
pip install openviking --upgrade --force-reinstall
```

### 1）安装插件文件

```bash
# Install plugin
mkdir -p ~/.openclaw/extensions/memory-openviking
cp examples/openclaw-memory-plugin/{index.ts,config.ts,openclaw.plugin.json,package.json,.gitignore} \
   ~/.openclaw/extensions/memory-openviking/
cd ~/.openclaw/extensions/memory-openviking && npm install
```

### 2）配置 OpenClaw（local mode）

> local mode 的含义：插件会自动拉起本地 OpenViking。

```bash
openclaw config set plugins.enabled true
openclaw config set plugins.slots.memory memory-openviking
openclaw config set plugins.entries.memory-openviking.config.mode "local"
openclaw config set plugins.entries.memory-openviking.config.configPath "~/.openviking/ov.conf"
openclaw config set plugins.entries.memory-openviking.config.targetUri "viking://user/memories"
openclaw config set plugins.entries.memory-openviking.config.autoRecall true --json
openclaw config set plugins.entries.memory-openviking.config.autoCapture true --json
```

### 3）启动

```bash
openclaw gateway
```

---

## setup helper 的可选参数（用得上就抄）

```text
npx openclaw-openviking-setup-helper [options]

  -y, --yes     Non-interactive, use defaults
  -h, --help    Show help

Env vars:
  OPENVIKING_PYTHON       Python path
  OPENVIKING_CONFIG_FILE  ov.conf path
  OPENVIKING_REPO         Local OpenViking repo path
  OPENVIKING_ARK_API_KEY  Volcengine API Key (skip prompt in -y mode)
```

---

## ov.conf 示例（关键点在“能理解 + 能召回”）

文档里给了一个 `ov.conf` 示例（JSON）。核心是两块：

- `vlm`：模型后端（可以理解为“理解/抽取”能力）
- `embedding.dense`：向量化配置（可以理解为“记住并能搜回来”能力）

```json
{
  "vlm": {
    "backend": "volcengine",
    "api_key": "<your-api-key>",
    "model": "doubao-seed-1-8-251228",
    "api_base": "https://ark.cn-beijing.volces.com/api/v3",
    "temperature": 0.1,
    "max_retries": 3
  },
  "embedding": {
    "dense": {
      "backend": "volcengine",
      "api_key": "<your-api-key>",
      "model": "doubao-embedding-vision-250615",
      "api_base": "https://ark.cn-beijing.volces.com/api/v3",
      "dimension": 1024,
      "input": "multimodal"
    }
  }
}
```

---

## 常见问题与排障（直接对照）

| 现象 | 大概率原因 | 修复动作 |
|---|---|---|
| Memory 显示 `disabled` / `memory-core` | memory slot 没指到插件 | `openclaw config set plugins.slots.memory memory-openviking` |
| `memory_store failed: fetch failed` | OpenViking 没跑起来 / Python 路径不对 / ov.conf 不对 | 确认 OpenViking 运行；核对 `ov.conf` 与 Python path |
| `health check timeout` | 端口/进程挂住 | `lsof -ti tcp:1933 \| xargs kill -9` 然后重启 |
| `extracted 0 memories` | `vlm`/`embedding.dense` 不完整或 key 无效 | 补全配置，确认 API key 正确 |

---

## 一个很现实的工程建议：先把“自动捕获”关了

`autoRecall` 和 `autoCapture` 是体验差一档的开关。

- `autoRecall=true`：更像“外脑能想起来”
- `autoCapture=true`：更像“外脑会自动记”

但工程上更稳的做法是：

先只开 `autoRecall`，确认召回链路稳定，再逐步开 `autoCapture`，并明确哪些信息允许进入长期记忆。

否则“外脑”很容易变成“乱记的外脑”。



---



## 风险点（哪里可能翻车）

- API key/模型配置一旦失效，记忆可能静默失效（看起来能跑，但什么都记不住）
- 自动捕获如果缺少边界控制，可能把不该记的东西也记进去（需要制定 capture 策略）

## 回滚方案（怎么撤）

先只开 autoRecall，不开 autoCapture；确认召回链路稳定后，再逐步开启捕获，并明确哪些信息允许进入长期记忆。



------

> 记忆这东西，不是用来感动自己的，是用来少走弯路的。
>
> 堆文件夹不叫记忆。
>
> 能召回、能复用、能帮你做决策的，才叫记忆。
>
> 真正的成长也不是“每天学新东西”，而是“同一个坑只踩一次”。外脑的价值就在这。



原文链接：

- <https://github.com/volcengine/OpenViking/blob/main/examples/openclaw-memory-plugin/README.md>

---

## 
#OpenClaw #OpenViking #Memory #Agent
