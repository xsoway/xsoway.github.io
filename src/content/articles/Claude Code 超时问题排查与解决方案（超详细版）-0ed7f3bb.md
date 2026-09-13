---
title: "Claude Code 超时问题排查与解决方案（超详细版）"
published: true
---

# **Claude Code 超时问题排查与解决方案（超详细版）**

很多人在使用  Claude Code  时，经常会遇到：

- 请求卡死
- Shell 长时间无响应
- 执行大型代码分析超时
- MCP 插件调用失败
- “Request timed out”
- “Connection reset”
- “API timeout exceeded”
- 长上下文分析中途中断

尤其是在：

- 使用国内网络
- 使用中转 API
- 分析大型项目
- 长时间 Agent 模式
- 调用 Bash / Git / Docker
- 多插件联动

的时候特别容易出现。

这篇文章把 Claude Code 常见超时问题一次性讲透。

---

# **一、Claude Code 为什么容易超时？**

Claude Code 本质上是：

- AI Agent
- Shell Runner
- 长连接 API Client
- 多轮上下文执行器

它和普通聊天最大的区别：

普通 Chat：

```text
一次请求 -> 一次响应
```

Claude Code：

```text
多步骤 Agent
→ 执行 shell
→ 读取文件
→ 分析代码
→ 调用插件
→ 多轮推理
→ 返回结果
```

因此：

- 请求时间更长
- Token 更多
- 网络更敏感
- 更依赖稳定长连接

所以超时问题会非常常见。

---

# **二、最常见的 7 类超时**

## **1. API 请求超时**

典型报错：

```bash
Request timeout
API timeout exceeded
fetch failed
```

原因：

- 网络不稳定
- 中转站响应慢
- 大上下文
- 模型推理时间过长

---

## **2. Bash 执行超时**

典型报错：

```bash
Command timed out
Shell execution timeout
```

例如：

```bash
npm install
pnpm build
docker build
```

执行太久。

---

## **3. MCP 插件超时**

例如：

- GitHub MCP
- Browser MCP
- PostgreSQL MCP

原因：

- MCP 服务慢
- 本地插件阻塞
- 网络调用超时

---

## **4. 长上下文超时**

例如：

```text
分析整个 monorepo
```

Claude Code：

- 读取太多文件
- Token 超大
- 推理时间过长

---

## **5. 中转 API 超时**

尤其是：

```text
cc.freemodel.dev
openrouter
oneapi
newapi
```

这些中转：

- 限流
- 队列
- 慢节点
- 长连接断开

都会导致超时。

---

## **6. SSH / Remote 环境超时**

例如：

- VSCode Remote SSH
- tmux
- Docker 容器

连接空闲太久被断开。

---

## **7. 插件循环调用导致卡死**

例如：

```text
Claude -> 插件 -> Claude -> 插件
```

Agent 自己进入循环。

---

# **三、最有效的解决方案（实测）**

---

# **方案 1：增加 Claude Code 超时时间**

这是最有效的方案。

编辑：

```bash
~/.claude/settings.json
```

加入：

```json
{
  "env": {
    "API_TIMEOUT_MS": "600000",
    "BASH_DEFAULT_TIMEOUT_MS": "1800000",
    "BASH_MAX_TIMEOUT_MS": "7200000"
  }
}
```

含义：

|**配置**|**作用**|
|---|---|
|API_TIMEOUT_MS|API 请求超时|
|BASH_DEFAULT_TIMEOUT_MS|Bash 默认超时|
|BASH_MAX_TIMEOUT_MS|Bash 最大超时|

推荐值：

|**配置**|**推荐**|
|---|---|
|API_TIMEOUT_MS|600000（10 分钟）|
|BASH_DEFAULT_TIMEOUT_MS|1800000（30 分钟）|
|BASH_MAX_TIMEOUT_MS|7200000（2 小时）|

---

# **方案 2：关闭非必要网络请求**

很多人不知道：

Claude Code 会有一些：

- telemetry
- analytics
- background requests

可以关闭：

```json
{
  "env": {
    "DISABLE_TELEMETRY": "1",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

效果：

- 减少网络请求
- 提高稳定性
- 降低卡顿

---

# **方案 3：使用稳定的 API 中转**

很多超时根本不是 Claude 的问题。

而是：

```text
垃圾中转节点
```

特点：

- 高并发
- 队列长
- TCP 不稳定
- Cloudflare 超时

建议：

## **不推荐**

- 免费中转
- 公共共享节点

## **推荐**

- 自建 OneAPI
- OpenRouter
- 稳定商业中转

---

# **方案 4：避免一次分析整个项目**

错误示范：

```text
分析整个项目并重构
```

正确：

```text
先分析 auth 模块
再分析 api 模块
最后分析 frontend
```

Claude Code 最怕：

```text
超大上下文
```

尤其：

- monorepo
- node_modules
- dist
- build
- generated files

---

# **方案 5：忽略无关目录**

非常关键。

创建：

```bash
.claudeignore
```

例如：

```text
node_modules
dist
build
coverage
.next
.cache
vendor
tmp
```

效果巨大：

- 减少 token
- 减少 IO
- 降低超时概率

---

# **方案 6：限制 Agent 深度**

有些 Agent 会无限思考。

例如：

```text
继续分析...
继续优化...
继续重构...
```

导致：

- Token 爆炸
- API 超时

建议：

明确要求：

```text
只修改必要部分
不要重构整个项目
限制在 3 个文件内
```

---

# **方案 7：使用 tmux 防止断连**

远程服务器强烈推荐：

tmux

安装：

```bash
brew install tmux
```

运行：

```bash
tmux
claude
```

即使 SSH 断开：

Claude Code 仍继续运行。

---

# **四、推荐的稳定配置（可直接复制）**

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://your-api.com",

    "API_TIMEOUT_MS": "600000",
    "BASH_DEFAULT_TIMEOUT_MS": "1800000",
    "BASH_MAX_TIMEOUT_MS": "7200000",

    "DISABLE_TELEMETRY": "1",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

---

# **五、国内用户最容易踩的坑**

## **1. API Key 没问题，但一直超时**

大概率：

```text
中转节点炸了
```

不是 Key 问题。

---

## **2. Claude 能聊天，但 Code 会超时**

因为：

Claude Code：

- 请求更长
- token 更多
- 连接时间更久

对中转要求远高于普通 Chat。

---

## **3. npm install 卡死**

不是 Claude 卡。

是：

```bash
npm install
```

本身慢。

  

建议：

```bash
pnpm
```

或者：

```bash
npm config set registry https://registry.npmmirror.com
```

---

## **4. Mac 上 shell 超时**

尤其 zsh。

建议：

```bash
export BASH_DEFAULT_TIMEOUT_MS=1800000
```

---

# **六、最终推荐（实战稳定方案）**

个人长期稳定方案：

## **网络**

- 稳定代理
- 稳定中转
- 不用免费节点

## **Claude 配置**

```json
{
  "env": {
    "API_TIMEOUT_MS": "600000",
    "BASH_DEFAULT_TIMEOUT_MS": "1800000",
    "BASH_MAX_TIMEOUT_MS": "7200000",
    "DISABLE_TELEMETRY": "1"
  }
}
```

## **项目优化**

- 使用 `.claudeignore`
- 分模块分析
- 不一次性分析整个仓库

## **远程环境**

- tmux
- screen
- Remote SSH KeepAlive

---

# **七、总结**

Claude Code 超时，本质上通常是：

```text
大上下文 + 长连接 + 不稳定网络
```

解决核心：

1. 增加 timeout
2. 使用稳定 API
3. 减少上下文
4. 忽略垃圾目录
5. 限制 Agent 范围

做到这些后：

Claude Code 稳定性会提升非常明显。