---
title: "OpenClaw 🦞 人虾情未了_2: OpenClaw 记忆何时写入与 QMD 使用说明"
created: "2026-04-13"
published: true
---
---

# OpenClaw 🦞 人虾情未了_2: OpenClaw 记忆何时写入与 QMD 使用说明

## 问题: .openclaw/workspace/memory  当前空间 这个目录下,昨天的记忆文件没有生成,为什么



我先看下 `memory` 目录现状和 OpenClaw 对“daily memory 文件是否自动创建”的机制说明。

原因很简单：

---

### 结论

`memory/YYYY-MM-DD.md` **不是按天自动空文件生成的。**

只有在下面两种情况之一发生时，昨天的文件才会出现：

1. **有实际写入记忆**
   - 你明确让我“记住这件事”
   - 或我主动把值得沉淀的内容写进当天 memory 文件

2. **触发了 compaction 前的 memoryFlush**
   - 会话足够长
   - 接近压缩阈值
   - OpenClaw 触发一次静默“先写记忆再压缩”

---

### 你这边现在看到的现象

我刚查了目录，当前 `memory/` 下面只有：

- `2026-03-05.md`
- `2026-03-06.md`
- `2026-03-09.md`

**没有** `2026-03-17.md`，说明昨天并没有发生“落盘写记忆”这一步。

---

### 为什么昨天没生成

大概率就是这几个原因之一：

#### 1）昨天虽然聊了，但**没有被写入 durable memory**

聊天 ≠ 自动生成 daily memory 文件。  
只有“真正执行了写文件”才会生成。

#### 2）昨天没有触发 memoryFlush

你现在开着：

- `agents.defaults.compaction.memoryFlush.enabled = true`

但它不是每轮触发，而是**接近 compaction 时才触发**。

如果昨天会话长度没到阈值，就不会触发，自然也不会自动生成当天文件。

#### 3）昨天没有明确需要沉淀的长期/日常信息

如果对话内容多是临时问答、排障、闲聊，模型可能不会主动写 memory。

---

### 这是不是异常？

**不是异常，是 OpenClaw 的正常机制。**

OpenClaw 当前的 memory 设计是：

- Markdown 是 source of truth
- 文件按需创建
- 不会每天自动生成一个空白 `YYYY-MM-DD.md`

文档里也明确说明了：

- `memory_get` 对不存在的当天文件会优雅返回空
- 这就是为了支持“今天还没有任何记忆落盘”的情况

---

### 你现在这套机制的真实行为

可以把它理解成：

#### 不是：

- 每天 `00:00` 自动创建一个 `memory/2026-03-17.md`

#### 而是：

- 当天如果有内容值得写入，才创建 `2026-03-17.md`
- 没有写入，就没有这个文件

---

### 怎么验证是不是“没写入”而不是“写失败”

看目录就够了。

如果文件不存在，说明昨天压根没落盘成功写记忆，不是“写了又丢”。

另外我刚查 `openclaw memory status`：

- QMD 索引是正常的
- `Dirty: no`
- 说明索引系统没坏

所以这不是 QMD 问题，也不是记忆后端坏了。  
**只是昨天没有生成新的 memory 文件。**

---

### 如果你希望“每天都必须有一份 daily memory 文件”

那现在这套默认机制不保证这一点。

你有两个可选方案：

| 方案   | 说明                 | 优点                     | 缺点                          |
| ------ | -------------------- | ------------------------ | ----------------------------- |
| 方案 A | 保持当前机制         | 干净；不会生成一堆空文件 | 没内容的日子就没有 daily file |
| 方案 B | 加“每日自动建档”机制 | 每天都会有当天文件       | 会多出空模板文件              |

比如用 `cron` 每天固定时间创建：

- `memory/YYYY-MM-DD.md`

哪怕先是空模板，也先落一个文件。这样你每天都会有当天文件。

---

### 我的建议

如果你的目标是 **“记忆管理稳定、整洁”**，现在这样没问题。  
如果你的目标是 **“每天都有日志文件，方便复盘/追踪”**，那就应该加一个自动建档 `cron`。

---

### 一句话总结

**昨天的记忆文件没生成，不是故障，而是因为 OpenClaw 不会按天自动创建空文件；只有当天真的写入了 memory，那个 `YYYY-MM-DD.md` 才会出现。**

如果你要，我下一步可以直接帮你做两件事里的一个：

1. **给你加一个“每天自动创建 `memory/YYYY-MM-DD.md`”的 cron**
2. **继续查昨天有没有本该沉淀但没写进去的内容**

---

## 问题: 怎么使用,或者怎么触发才会写记忆 & qmd 如何使用?

------



### 1）怎么才会写记忆

你现在这套 **不会“每聊必写”**。  
触发写记忆，主要有 **3 种方式**：

#### 方式 A：你明确下指令

这是最稳的。

你可以直接说：

- **记住这个偏好**
- **把这件事写进记忆**
- **把今天这件事记到 memory**
- **把这个决定记到长期记忆**
- **把这条写到今天日志里**

我收到后，会把内容写到：

- **长期稳定信息** → `MEMORY.md` 或 `memory/user-prefs.md` / `memory/agent-notes.md`
- **当天流水/临时上下文** → `memory/YYYY-MM-DD.md`

#### 方式 B：我判断“值得沉淀”，主动写

比如这些内容，我通常应该主动写：

- 你的长期偏好
- 明确决策
- 工作流约定
- 踩坑经验
- 重要待办 / 截止时间
- 配置变更和原因

但这依赖当时上下文和判断，**不如你明确说一声稳**。

#### 方式 C：会话快压缩时，自动 memoryFlush

你现在开了：

- `agents.defaults.compaction.memoryFlush.enabled = true`

作用是：

- 会话快接近 compaction 时
- OpenClaw 会触发一次静默提醒
- 让我先把值得保存的内容写进 memory 文件，再压缩上下文

但要注意：

- **不是每次对话都会触发**
- 只有会话足够长、接近阈值时才触发
- 所以不能指望它代替日常记忆写入

---

#### 最实用的用法

如果你想让记忆稳定工作，建议你平时就这么说：

##### 写“长期记忆”

适合偏好、规则、决策。

例子：

- **记住：以后 Telegram 群聊默认关闭**
- **记住：我更喜欢先给结论，再解释**
- **把这条经验记到长期记忆：QMD 安装先检查 sqlite 和 Xcode license**

##### 写“当天日志”

适合今天发生的事。

例子：

- **把今天 QMD 配置调整记录到今天 memory**
- **把这次 OpenClaw 记忆配置优化写进今天日志**
- **记录一下：今天把 maxResults 从 8 调到 5**

---

### 2）QMD 如何使用

你现在的 QMD 不是让你平时手工频繁操作的“主界面”，而是 **OpenClaw 背后的记忆检索引擎**。

---

#### 你当前 QMD 的定位

现在是：

- Markdown 文件 = 记忆源
- QMD = 检索/索引引擎
- OpenClaw = 对外调用入口

也就是说，**你平时最常用的不是 `qmd` 命令，而是让 OpenClaw 去搜记忆。**

---

#### QMD 在你这里怎么“用”

##### 用法 A：被 OpenClaw 自动使用

这是默认主用法。

当我需要回忆：

- 之前做过什么
- 你有什么偏好
- 某个项目以前怎么定的
- 某个配置/决策放在哪

我会走：

- `memory_search`
- `memory_get`

底层其实就是 QMD 在工作。  
所以你平时不一定要直接敲 `qmd`。

---

##### 用法 B：你手工检查状态

这个很有用。

看当前记忆状态

```bash
openclaw memory status
```



你会看到：



- provider 是不是 qmd
- 索引了多少文件/chunks
- sessions 有没有启用
- vector 是否 ready







**手工搜一下记忆**



```
openclaw memory search "QMD 安装踩坑"
```

或者：

```
openclaw memory search "Telegram streaming 配置"
```

这个更接近你的日常使用。



------





##### **用法 C：直接用 qmd CLI（偏底层）**





如果你要排障/深度调试，可以直接用 qmd。

但这个一般是“高级调试”，不是日常必需。



常见思路：





**看 qmd 是否可用**



```
[本机路径已隐藏] --help
```



**看 collection / 更新索引**



通常会涉及：

```
qmd collection list
qmd update
qmd embed
qmd search "关键词" --json
```

但这里有个前提：



OpenClaw 给每个 agent 都配了自己的 QMD XDG 目录，所以**直接裸跑 qmd**，不一定就是在看 OpenClaw 当前那套索引。



如果你真要手工用 qmd，通常要配对应环境变量，例如 main agent：

```
STATE_DIR="${OPENCLAW_STATE_DIR:-$HOME/.openclaw}"

export XDG_CONFIG_HOME="$STATE_DIR/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$STATE_DIR/agents/main/qmd/xdg-cache"
```

然后再跑：

```
[本机路径已隐藏] collection list
[本机路径已隐藏] search "OpenClaw" --json
```



------





### **你现在最该怎么用**







#### **日常使用建议**







##### **记忆写入**



直接对我说：



- **记住这件事**
- **写进今天记忆**
- **写到长期记忆**







##### **记忆检索**



直接对我说：



- **查下之前有没有记过这个**
- **回忆一下我们之前怎么定的**
- **搜下 memory 里有没有 QMD 相关记录**







##### **状态检查**



你自己想查时：

```
openclaw memory status
```



------





### **给你一个最简单的操作范式**







#### **你想写记忆时**





说：



> 把“xxx”写进今天记忆



或



> 把“xxx”记到长期记忆





#### **你想查记忆时**





说：



> 查下之前关于 xxx 的记忆



或



> 搜下 memory 里有没有 xxx





#### **你想确认 QMD 是否正常时**





跑：

```
openclaw memory status
```



------





### **一句话理解**







#### **记忆怎么触发写入？**





**最稳的方法是你明确说“记住/写入记忆”。**





#### **QMD 怎么用？**





**你平时主要通过 OpenClaw 的 memory_search / memory status 来用，QMD 是底层引擎，不是你每天手工直连的主入口。**







------



## 整理: **记忆写入提示词模板** 和 **QMD 常用命令清单**



------





### **一、记忆写入提示词模板**





目标：以后你一句话，我就知道该写到哪里、写成什么类型。



------





#### **1）写入“长期记忆”模板**





适合：



- 偏好
- 规则
- 决策
- 长期有效的信息
- 反复会用到的经验







##### **模板 1：最简单版**





**记住：xxx**



例子：



- 记住：我更喜欢先给结论，再解释
- 记住：Telegram 群聊默认关闭
- 记住：OpenClaw 相关配置修改前先看本地 docs





------





##### **模板 2：明确指定“长期记忆”**





**把这条写进长期记忆：xxx**



例子：



- 把这条写进长期记忆：QMD 安装前先确认 sqlite 和 Xcode license
- 把这条写进长期记忆：我更偏好工程化输出，不喜欢空泛总结





------





##### **模板 3：带分类**





**把这条记到长期记忆，分类是【偏好/决策/踩坑/流程】：xxx**



例子：



- 把这条记到长期记忆，分类是【踩坑】：Telegram 新号注册常被 Premium 短信页拦住
- 把这条记到长期记忆，分类是【流程】：OpenClaw 先查 docs，再改配置





------





#### **2）写入“今日日志 / daily memory”模板**





适合：



- 今天发生了什么
- 今天做了什么配置变更
- 今天的排障过程
- 临时上下文、当天记录







##### **模板 1：最简单版**





**把这件事记到今天日志：xxx**



例子：



- 把这件事记到今天日志：今天把 OpenClaw 的记忆配置从全 workspace 索引收紧到 memory 专用目录
- 把这件事记到今天日志：今天安装了 self-improving-agent skill





------





##### **模板 2：带结果**





**记录到今天记忆：做了什么 + 结果 + 后续待确认**



例子：



- 记录到今天记忆：将 memory.qmd.maxResults 从 8 调到 5，已改配置，待观察 recall 质量
- 记录到今天记忆：已关闭 Telegram 群组策略 warning，当前私聊正常





------





##### **模板 3：带复盘感**





**把今天这次处理写进 memory，包含：背景、动作、结果、坑点**



例子：



- 把今天这次处理写进 memory，包含：QMD 安装背景、执行步骤、失败原因、后续建议





------





#### **3）“更新已有记忆”模板**





适合：



- 之前记过，现在要修正
- 偏好变了
- 决策更新了





**更新记忆：原来是 xxx，现在改成 xxx**



例子：



- 更新记忆：原来 QMD recall 设为全 workspace markdown，现在改成只索引 MEMORY.md 和 memory/**/*.md
- 更新记忆：原来 sessions retention 是 30 天，现在改成 14 天





------





#### **4）“不要记”模板**





适合：



- 临时话题
- 你不想沉淀
- 避免写错记忆





**这条不要写进记忆：xxx**



或者：



**这次只是临时讨论，不要记忆化**



------





#### **5）“让莫菲自己判断写到哪”模板**





如果你不想区分长期/当天，可以直接说：





**把这件事记下来，你自己判断写到长期记忆还是今日日志**



这个是最省事的。



------





#### **6）推荐你以后常用的 6 句**





这 6 句基本够你日常用了：



1. **记住：xxx**
2. **把这条写进长期记忆：xxx**
3. **把这件事记到今天日志：xxx**
4. **更新记忆：原来 xxx，现在改成 xxx**
5. **这条不要写进记忆**
6. **把这件事记下来，你自己判断分类**





------





### **二、QMD 常用命令清单**





你现在 QMD 主要是作为 OpenClaw 的记忆后端，所以我把命令分成两层：



- **A. 日常推荐：优先用 OpenClaw 命令**
- **B. 深度排障：直接用 qmd CLI**





------





#### **A. 日常推荐：OpenClaw 层命令**







##### **1）看记忆系统状态**



```
openclaw memory status
```

看什么：



- provider 是不是 qmd
- sources 有哪些（memory / sessions）
- indexed 文件/chunks 数量
- vector 是否 ready
- store 路径在哪里





------





##### **2）手工搜记忆**



```
openclaw memory search "QMD 安装踩坑"
```

例子：

```
openclaw memory search "Telegram streaming 配置"
openclaw memory search "记忆配置优化"
openclaw memory search "OpenClaw cron error"
```

用途：



- 检查某条信息是否已被收录
- 看 recall 结果是否合理





------





##### **3）强制重建/刷新索引**



```
openclaw memory index
```

如果你怀疑：



- 新文件没进索引
- recall 不准
- 配置改了但索引状态没更新





可以跑这个。



------





##### **4）看配置是否生效**



```
openclaw config get memory
```

或者更细：

```
openclaw config get memory.backend
openclaw config get memory.qmd
```



------





#### **B. 深度排障：直接用 qmd CLI**





你当前 qmd 命令路径是：

```
[本机路径已隐藏]
```

但要注意：



**OpenClaw 给不同 agent 用的是各自独立的 QMD XDG 目录。**



所以直接裸跑 qmd 前，最好先切对应 agent 环境。



------





##### **先设置** main  agent 的 QMD 环境



```
STATE_DIR="${OPENCLAW_STATE_DIR:-$HOME/.openclaw}"

export XDG_CONFIG_HOME="$STATE_DIR/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$STATE_DIR/agents/main/qmd/xdg-cache"
```

以后要查 code / writer，把 main 换成 code / writer。



------





##### **1）确认 qmd CLI 是否正常**



```
[本机路径已隐藏] --help
```

如果这条都不通，先别看别的。



------





##### **2）看有哪些 collection**



```
[本机路径已隐藏] collection list
```

用途：



- 看 memory / sessions collection 是否存在
- 看 collection 名字是否正常
- 排查 “Collection not found” 类问题





------





##### **3）手工搜一下**



```
[本机路径已隐藏] search "OpenClaw" --json
```

或者：

```
[本机路径已隐藏] query "OpenClaw" --json
```

用途：



- 验证底层 QMD 是否能返回结果
- 和 openclaw memory search 做对比





------





##### **4）手工更新索引**



```
[本机路径已隐藏] update
```

用途：



- 强制刷新 collection 内容





------





##### **5）手工生成/刷新 embeddings**



```
[本机路径已隐藏] embed
```

用途：



- 向量没 ready
- 初次建索引
- 怀疑 embedding 阶段没跑完





------





##### **6）看 QMD 实际索引数据库**





你现在 main 的 store 大概在：

```
~/.openclaw/agents/main/qmd/xdg-cache/qmd/index.sqlite
```

可以确认文件是否存在：

```
ls -lah ~/.openclaw/agents/main/qmd/xdg-cache/qmd/
```



------





### **三、你最常用的一套命令，我帮你收缩成最小清单**







#### **日常 4 条就够了**



```
openclaw memory status
openclaw memory search "关键词"
openclaw memory index
openclaw config get memory.qmd
```



------





#### **排障再加 4 条**



```
STATE_DIR="${OPENCLAW_STATE_DIR:-$HOME/.openclaw}"

export XDG_CONFIG_HOME="$STATE_DIR/agents/main/qmd/xdg-config"
export XDG_CACHE_HOME="$STATE_DIR/agents/main/qmd/xdg-cache"

[本机路径已隐藏] --help
[本机路径已隐藏] collection list
[本机路径已隐藏] update
[本机路径已隐藏] search "关键词" --json
```



------





### **四、给你的最佳实践**







#### **平时怎么用最省心**







##### **要写记忆**





直接对我说：



- **记住：xxx**
- **把这件事记到今天日志：xxx**
- **把这条写进长期记忆：xxx**







##### **要查记忆**





直接对我说：



- **查下之前有没有记过这个**
- **搜一下关于 xxx 的记忆**
- **看看 memory 里有没有这个配置**







##### **要排障**





你自己跑：

```
openclaw memory status
```

如果 status 不对，再用 qmd CLI 深查。



------





### **五、一句话总结**







#### **写记忆最稳的方式**





**明确告诉我“记住 / 写进今天日志 / 写进长期记忆”。**





#### **QMD 最常用的方式**





**日常用 openclaw memory status/search，排障时再直接用 qmd CLI。**



------



