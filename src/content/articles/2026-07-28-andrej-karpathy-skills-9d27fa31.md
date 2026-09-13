---
title: "1 个文件管住 AI 的乱写乱改：Andrej Karpathy 的 LLM 编码指南"
created: "2026-07-28"
tags: ["KnowledgeBase","AI","LLM","ClaudeCode","Cursor","编码规范","开源项目"]
category: "技术分享"
published: true
---

# 1 个文件管住 AI 的乱写乱改：Andrej Karpathy 的 LLM 编码指南

> 你家的 AI 编码助手，是不是也经常干这些事：
> 让你改个 Bug，它顺手把隔壁的注释也删了；
> 明明 50 行能搞定的事，它给你整出 500 行的抽象工厂；
> 遇到歧义从不问，默默选一个答案就开干……
>
> Andrej Karpathy 最近在 X 上吐槽了这些问题，然后有人把他说的东西做成了一个可直接用的项目。

---

用 AI 写代码半年以上的人，基本都经历过这种无力感：

你说 "帮我修一下这个 API 的验证逻辑"，它给你改了三个文件，重构了错误处理，还把注释风格换了。你 review diff 的时间比重写一遍还长。

更离谱的是——它从不承认自己不确定。遇到歧义，默默选一条路就走；发现代码有 100 行，非要给你套上三层抽象。就像一个实习生，特别热情、特别勤快，但就是管不住自己的手，总在你不该碰的地方"顺便改进"一下。

Andrej Karpathy 最近在 X 上发了一条推，精准总结了这些 LLM 编码的"通病"：

> "模型会代你做错误假设，然后不假思索地执行。它们不管理自身的困惑，不寻求澄清，不呈现矛盾，不展示权衡……"
> "它们真的很喜欢把代码和 API 搞复杂，堆砌抽象概念，不清理死代码……明明 100 行能搞定的事情，非要实现成 1000 行的臃肿架构。"

Karpathy 本人只是发了条吐槽，但有人把它做成了一组可落地的规则——**andrej-karpathy-skills**，一个 `CLAUDE.md` 文件（含 Cursor 规则），直接塞进你的 AI 编码工具里，让它少发疯、少乱改、少写废话。

## 一句话结论

一个规则文件，四个原则，直接塞进 Claude Code 或 Cursor，让 AI 编码助手从"热情但手贱的实习生"变成"知道什么时候该问、什么时候该停的老手"。

## 核心亮点

**1、四个原则，覆盖 90% 的 AI 编码乱象**

这个项目把 Karpathy 的吐槽提炼成四个原则：

| 原则 | 解决什么问题 |
|---|---|
| 编码前思考 | 错误假设、隐藏困惑、缺少权衡 |
| 简洁优先 | 过度复杂、臃肿抽象 |
| 精准修改 | 无关编辑、触碰不应碰的代码 |
| 目标驱动执行 | 通过测试优先、可验证的成功标准 |

不是那种大而全的"AI 开发规范"，而是集中火力打最痛的几个点。每个原则后面都有可执行的子规则，不是空话。

**2、编码前思考：不要假装懂**

LLM 最大的问题是——它永远不会说"我不确定"。遇到歧义，它选一个解释就执行，然后给你一个自信满满但完全跑偏的结果。

这个原则直接要求：

- **明确说明假设**——不确定就问，别猜
- **呈现多种解释**——有歧义，摆出来，不要默默选
- **适时提出异议**——有更简单的方法，说出来
- **困惑时停下来**——指出不清楚的地方，要求澄清

看起来很简单，但实际用起来效果很猛。装上这个规则之后，Claude Code 在遇到模糊需求时会先列几个可能的解释问你"你指的是哪个"，而不是闷头干。

**3、简洁优先：不要给不可能发生的场景做错误处理**

"过度工程"是 LLM 的 DNA 问题。你让它写一个文件读取函数，它可能给你整出异常分层、日志中间件、配置热加载——因为它在训练数据里见过太多"生产级代码"。

这个原则直接打回去：

- 不要添加要求之外的功能
- 不要为一次性代码创建抽象
- 不要添加未要求的"灵活性"或"可配置性"
- 不要为不可能发生的场景做错误处理
- 如果 200 行代码可以写成 50 行，重写它

检验标准就一句话：**资深工程师会觉得这过于复杂吗？如果是，简化。**

**4、精准修改：只碰必须碰的**

这是用过 AI 编码的人最有共鸣的一条。你让 AI 改一个变量名，它顺手把整个文件的 import 排序、注释风格、日志格式全改了。Review 的时间比改代码还长。

规则很硬：

- 不要"改进"相邻的代码、注释或格式
- 不要重构没坏的东西
- 匹配现有风格，即使你更倾向于不同的写法
- 如果注意到无关的死代码，**提一下——不要删除它**

**唯一例外**：当你自己的改动产生了孤儿代码（比如删了函数但没删 import），必须清理干净。这个逻辑是对的——你可以管住 AI 不乱碰别人的东西，但自己造的垃圾自己收。

检验标准：**每一行修改都应该能直接追溯到用户的请求。**

**5、目标驱动执行：先定义成功，再开干**

这是 Karpathy 在推特里特别强调的一点：

> "LLM 非常擅长循环执行直到达成特定目标……不要告诉它该做什么，给它成功标准，然后看着它完成。"

具体做法是把指令式任务转化为可验证的目标：

| 不要这样做 | 转化为 |
|---|---|
| "添加验证" | "为无效输入编写测试，然后让它们通过" |
| "修复 bug" | "编写重现 bug 的测试，然后让它通过" |
| "重构 X" | "确保重构前后测试都能通过" |

对于多步骤任务，写一个"步骤 → 验证"的计划。比如：

```
1. 创建数据库迁移 → 验证: `migrate up` 成功
2. 添加新 API 端点 → 验证: `curl` 返回 200
3. 更新前端组件 → 验证: 页面渲染无报错
```

强成功标准让 LLM 能独立循环执行。弱标准（"让它工作"）需要你不断澄清。

**6、安装方式：Claude Code 插件 / Cursor 规则 / 直接下载**

这个项目提供了三种接入方式：

**Claude Code 插件（推荐）**

```
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
```

**CLAUDE.md（按项目，新项目）**

```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
```

**CLAUDE.md（已有项目，追加）**

```bash
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
```

**Cursor 用户**：仓库已包含 `.cursor/rules/karpathy-guidelines.mdc`，在 Cursor 中打开项目时自动生效。详情见 [CURSOR.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CURSOR.md)。

## 快速上手

### 安装（Claude Code 插件模式，推荐）

```bash
# 添加插件市场
/plugin marketplace add forrestchang/andrej-karpathy-skills

# 安装插件
/plugin install andrej-karpathy-skills@karpathy-skills
```

安装完成后，指南在所有项目中自动可用。不需要每个项目单独配置。

### 按项目安装（CLAUDE.md 模式）

```bash
# 新项目
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md

# 已有项目（追加到现有 CLAUDE.md）
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
```

### 验证

安装后，给 Claude Code 发一个模糊需求，比如"帮我加个验证功能"——如果它先问"你具体想验证什么，我列几个选项"，说明规则生效了。

### 命令速查

| 阶段 | 命令 | 用途 |
|---|---|---|
| 安装插件 | `/plugin marketplace add forrestchang/andrej-karpathy-skills` | 添加插件市场 |
| 安装插件 | `/plugin install andrej-karpathy-skills@karpathy-skills` | 安装 Karpathy 指南 |
| 新项目 | `curl -o CLAUDE.md https://.../CLAUDE.md` | 直接下载为项目规则 |
| 已有项目 | `echo "" >> CLAUDE.md && curl ... >> CLAUDE.md` | 追加到现有规则 |

## 写在最后

这个项目本质上做的是一件事：**把 Karpathy 对 LLM 编码行为的观察，翻译成 AI 能执行的指令。**

它不复杂，不花哨，不假装自己是 AI 开发方法论。就是一个 `CLAUDE.md` 文件，加上 Cursor 规则，直接塞进你的工具链。

但越简单的东西，越容易被忽略。

**适用边界：**

- 最适合 Claude Code 和 Cursor 用户，尤其是日常用 AI 写代码的开发者
- 对"AI 生成的代码质量"有要求，但不想自己写一整套规则的人
- 不适用：完全不用 AI 编码工具的人、或者只用 AI 做单次对话/一次性脚本的人

**注意事项：**

- 这些规则倾向于**谨慎而非速度**。对于琐碎任务（拼写错误修复、一行修改），项目明确说了"自行判断，不需要每个改动都走完整流程"
- 项目本身是一个规则文件，不是 SDK，也不是工具。它不改变 AI 的能力上限，只改变 AI 的行为习惯
- 如果你已经有自己的 CLAUDE.md 或项目规则，建议追加而不是覆盖——项目也支持与项目特定指令合并

最后引用 Karpathy 的原话：

> "如果你看到 diff 中不必要的改动更少，因过度复杂而导致的重写更少，澄清问题在实现之前提出……说明这些指南正在发挥作用。"

装上之后，给 AI 一个模糊需求，然后看它怎么回你。

---

#Karpathy #ClaudeCode #Cursor #AI编码 #LLM #代码质量 #开源项目 #CLAUDE.md #编码规范 #AI辅助开发