---
title: "2026-06-10-Codebuff & Freebuff：一个把 Agent 编排成团队，一个把 AI 编程价格打到零"
created: "2026-06-10"
tags: ["KnowledgeBase","WeChat","GitHub","Codebuff","Freebuff","AIAgent","MultiAgent","CodingAgent","AgentWorkflow"]
category: "公众号文章"
published: true
---

# Codebuff & Freebuff：一个把 Agent 编排成团队，一个把 AI 编程价格打到零

最近看 AI 编程工具，我有一种很强的疲劳感。

首页都在讲「理解整个代码库」「一句话完成需求」「自动写代码并运行测试」，演示视频也差不多：输入一句需求，终端开始疯狂滚动，过一会儿弹出一句任务完成。看多了以后，很难判断它到底做了什么，又为什么比旁边那个终端里的 Agent 更值得装。

Codebuff 这个仓库里放了两个产品，刚好从两个方向给这场终端混战添了点新东西。Codebuff 负责把编码任务拆给一支可以自定义、可以编排的 Agent 团队；Freebuff 则把门槛压到几乎没有，不用订阅、不用配模型，装完就能开工，账单由 CLI 里的广告来扛。

Codebuff 倒是给了一个挺有意思的答案。它没有继续宣传一个全能模型能把所有活干完，而是把编码任务拆给一组专业 Agent：有人负责在代码库里找文件，有人负责规划改动，有人动手编辑，还有人负责复查。一个需求进来以后，不是让某个模型从头莽到尾，而是先分工，再协作。

这个思路听着不新鲜，现实里的软件团队本来就这么干。可放到编码 Agent 里，它刚好撞上了一个经常被掩盖的问题：很多失败并不是模型不会写代码，而是它在错误的文件里写了正确的代码，或者改完以后根本没人认真检查。

你让一个 Agent「给 API 加上身份验证」，它得先回答一串很烦、又绕不开的问题：入口文件在哪，项目原来用什么认证方式，哪些接口应该排除，测试放在哪里，这次改动会不会把已有客户端一起送走。让一个模型同时找文件、做计划、写代码、复查结果，像是让一个人开会时既当产品经理、架构师、开发，又负责评审自己的代码。

理论上很全能，实际经常变成自己给自己鼓掌。

Codebuff 的默认协作方式大概是这样：

```mermaid
flowchart LR
    A[用户需求] --> B[File Picker Agent]
    B --> C[Planner Agent]
    C --> D[Editor Agent]
    D --> E[Reviewer Agent]
    E --> F[改动与验证结果]
```

`File Picker Agent` 扫描代码库并找出相关文件，`Planner Agent` 决定要改哪里、按什么顺序改，`Editor Agent` 执行修改，`Reviewer Agent` 再检查结果。分工以后，每个 Agent 接到的上下文更窄，任务也更明确，不用一个脑袋同时塞下整座代码仓库和全部工作流程。

项目方在自己的评测里给出了一组挺抢眼的数据：Codebuff 在 175 个以上的真实开源仓库编码任务中，成绩是 61%，Claude Code 是 53%。这组数据可以拿来理解项目方想证明什么，但不能直接当成江湖排行榜，因为评测集、任务定义、模型配置和评分方式都会影响结果。跑分这玩意跟健身房镜子差不多，能看，别急着拿它办身份证。

让我觉得 Codebuff 值得整理的，也不是这 8 个百分点，而是它把「多 Agent」继续往下做成了一套可以编排的工作流。

很多工具嘴里说的多 Agent，其实只是主 Agent 碰到任务以后临时摇几个人过来，大家领完活就各自开干。Codebuff 更进一步，允许你用 TypeScript 定义 Agent 使用什么模型、拥有哪些工具、能派生哪些子 Agent，以及每一步具体怎么走。提示词继续负责那些需要模型判断的部分，代码则负责不能靠模型临场发挥的流程。

README 里有一个 `git-committer` 示例，很能说明这套思路。它不会上来就让模型自由发挥，而是先固定执行 `git diff` 和最近几条 `git log`，把改动内容和仓库原有的提交风格摆到桌面上，再让模型生成提交信息并完成提交。

```typescript
export default {
  id: 'git-committer',
  displayName: 'Git Committer',
  model: 'openai/gpt-5-nano',
  toolNames: ['read_files', 'run_terminal_command', 'end_turn'],

  instructionsPrompt:
    'Create meaningful git commits by analyzing changes and context.',

  async *handleSteps() {
    yield { tool: 'run_terminal_command', command: 'git diff' }
    yield { tool: 'run_terminal_command', command: 'git log --oneline -5' }
    yield 'STEP_ALL'
  },
}
```

这段代码不复杂，却把编码 Agent 里一个很实用的边界划出来了：确定性动作交给程序控制，需要理解和判断的部分再交给模型。

如果全部写在提示词里，你只能祈祷模型每次都记得先看 diff、再看提交历史，也只能祈祷它不会哪天心血来潮，跳过检查直接生成一条「update files」。把顺序写进生成器以后，流程不再靠模型自觉，出了问题也更容易定位到底是哪一步翻车。

顺着这条路继续走，能做的事情就不只是自动提交。你可以先让一个 Agent 查需求和仓库知识，再让另一个 Agent 做影响分析；可以把安全扫描放在编辑之后，把测试和代码审查放在提交之前；也可以根据文件类型、风险级别或任务结果走不同分支。过去那些写在团队规范里、开会时反复强调、忙起来照样被忘掉的流程，终于有机会变成 Agent 每次都会执行的步骤。

这里还有一个细节挺对我的胃口：运行 `/init` 后，Codebuff 会在项目里生成 `knowledge.md` 和 `.agents/` 目录。

```text
knowledge.md
.agents/
└── types/
    ├── agent-definition.ts
    ├── tools.ts
    └── util-types.ts
```

`knowledge.md` 用来放项目上下文，`.agents/` 用来定义项目自己的 Agent。项目知识和执行方式都跟着代码库走，不需要每次开新会话再从头解释「我们这个项目比较特殊」。这件事看起来只是多了几个文件，背后却是一种很实在的变化：团队的工程习惯不再只活在某个老员工脑子里，也不再躺在文档角落里吃灰，它可以直接参与下一次任务。

写出 Agent 定义不代表工作流就自动靠谱。模型可能判断错，工具权限可能放太宽，几个 Agent 之间也可能互相传递错误信息。多 Agent 有时候不是三个人一起解决问题，而是三个人把一个误会开成了跨部门专项会议，Token 烧得像年会抽奖，最后谁也不肯背锅。

所以自定义工作流最有价值的地方，不是能召唤多少 Agent，而是你能不能把每个角色的输入、输出和权限讲清楚。文件选择 Agent 只负责找候选文件，不负责顺手改代码；编辑 Agent 按计划执行，不负责自己宣布质量过关；审查 Agent 必须拿到 diff 和验证结果，不能只看一句「已经完成」就批准放行。角色越多，边界越要写明白，不然只是把一个会跑偏的 Agent 变成了一支会集体跑偏的队伍。

Codebuff 还提供了 SDK，这让它和普通终端工具拉开了一点距离。安装 `@codebuff/sdk` 后，可以从自己的应用里调用 Agent、监听执行事件、传入自定义工具和 Agent 定义，也能把编码能力接进 CI/CD 或内部研发平台。

```typescript
import { CodebuffClient } from '@codebuff/sdk'

const client = new CodebuffClient({
  apiKey: 'your-api-key',
  cwd: '/path/to/your/project',
})

await client.run({
  agent: 'base',
  prompt: 'Add error handling to all API endpoints',
  handleEvent: (event) => {
    console.log('Progress', event)
  },
})
```

对个人开发者来说，CLI 装完就能用更省事；对团队来说，SDK 才可能把一次好用的对话，慢慢变成可以重复执行、能接入现有系统、也能留下过程记录的工程能力。两者差别有点像「让同事帮忙跑一次脚本」和「把脚本接进流水线」，前者今天很爽，后者下个月还不用重新求人。

模型选择上，Codebuff 也没有把自己锁在单一厂商里。项目通过 OpenRouter 支持 Claude、GPT、Qwen、DeepSeek 等模型，可以给不同 Agent 分配不同模型。负责快速找文件的任务不一定需要最贵的模型，复杂规划和审查则可以交给能力更强的模型，这样的模型路由比全程顶配更接近真实工程里的成本控制。

不过，支持很多模型不等于随便换一个都能稳定工作。工具调用、上下文理解、代码能力和指令遵循差异，会直接影响工作流表现；同一套 Agent 定义换个模型，可能从工程助手变成随机事件生成器。多模型是选择权，不是免测通行证。

说到这里，Freebuff 就不能只当作 Codebuff 旁边附送的免费版一笔带过了。它虽然建立在 Codebuff 平台上，产品思路却很不一样：Codebuff 把控制权交给愿意搭工作流的人，Freebuff 则尽量把选择题全部拿走，不分模式、不要求配置，也不需要先研究一晚上模型价格表。

安装以后进入项目目录，直接运行：

```bash
npm install -g freebuff
cd your-project
freebuff
```

它支持用 `@filename` 点名文件，用 `@AgentName` 调用专业 Agent，用 `!command` 或 `/bash` 执行终端命令，也能通过 `/history` 恢复旧对话、通过 `/init` 创建项目的 `knowledge.md`。网页研究和浏览器使用已经内置，还可以连接自己的 ChatGPT 订阅，让 GPT-5.4 参与规划和审查。

项目方给 Freebuff 打出的速度口号是 5 到 10 倍加速，理由是使用更快的模型，并把上下文收集从几分钟压到几秒。这个数字同样来自项目方自己的描述，具体能快多少，还得看仓库规模、任务类型、网络状况和所用模型；不过它的产品取向很清楚，先让人低成本进来干活，别在第一步就被配置页面劝退。

Freebuff 免费的原因也没藏着掖着：广告会直接显示在 CLI 里。很多开发者看到这里可能会眉头一皱，终端原本是最后一块清净地，现在广告也准备来办理入住了。。。但从商业模式看，这次交换至少写在明面上，你不用订阅，平台通过广告承担模型和云端服务成本。

比广告更需要认真看的，是模型和数据说明。Freebuff README 写明，主要编码 Agent 会使用 DeepSeek V4 Pro 或 DeepSeek V4 Flash，Gemini 3.1 Flash Lite 负责找文件和研究，连接 ChatGPT 后则由 GPT-5.4 处理深度思考；同一份 README 还特别标注，DeepSeek V4 Pro 的 API 会收集数据用于训练。

麻烦来了，FAQ 紧接着又说，Freebuff 只使用不会拿请求训练的模型提供商，代码仍归用户所有。这两段表述放在一起明显对不上，不能假装没看见。再加上 Freebuff 会连接云端后端、收集少量调试日志，而且目前只在部分国家可用，涉及私有代码、公司仓库或合规要求时，最好先向项目方确认实际模型路由、数据处理方式和日志范围，再决定要不要把代码送进去。

这不是专门挑刺，免费产品最容易被一句「零配置」带着一路点确认。广告能看见，数据流却看不见；如果说明文档自己都没讲顺，谨慎一点不丢人。

正式版 Codebuff 的安装同样很简单：

```bash
npm install -g codebuff
cd your-project
codebuff
```

把两个产品放在一起看，分工其实挺清楚。

| 产品 | 更适合谁 | 主要卖点 | 使用前要留意 |
|---|---|---|---|
| Codebuff | 想自定义 Agent、模型和研发流程的个人或团队 | 多 Agent 编排、TypeScript 工作流、OpenRouter、SDK | 配置与治理成本，复杂任务的稳定性 |
| Freebuff | 想零配置体验编码 Agent 的个人开发者 | 免费、广告支持、内置研究和浏览器能力 | 云端处理、广告、地区限制、数据说明冲突 |

我目前没有亲自跑完 Codebuff 和 Freebuff 的真实项目任务，所以不会替它们保证效果，更不会看完 README 就宣布 Claude Code 可以下岗。现有文档能确认的是，Codebuff 已经把 CLI、自定义 Agent、Agent Store、OpenRouter 模型支持和 SDK 放进同一套平台，Freebuff 则把这套能力包装成一个低门槛入口；至于复杂仓库中的修改质量、Token 成本、执行速度、长任务稳定性和 Freebuff 的数据处理边界，还得拿真实需求去测，最好再准备一个干净分支，别用生产仓库给好奇心交学费。

但 Codebuff 和 Freebuff 放在一起提出的方向，我觉得挺值得继续看。

过去大家讨论 AI 编程，经常把注意力放在模型能不能写出更好的代码。模型继续变强肯定有用，可工程师每天面对的麻烦远不止「代码不会写」：不知道该改哪，改动范围判断错，团队规范没执行，测试被跳过，审查只剩一句 LGTM，做完以后也没有留下可复用的流程。

Codebuff 想做的，是把这些工作拆给不同 Agent，再用代码把协作顺序固定下来；Freebuff 想做的，则是先把价格和配置门槛挪开，让更多人直接走进这套系统。一个负责把上限往上推，一个负责把入口压低，背后共用的是同一套 Agent 平台。

回到开头那种 AI 编程疲劳感。下一批工具如果还只是把「一句话写完整个项目」印得更大，我可能真的很难兴奋；可要是它一边能让团队把开发流程变成可复用的 Agent，把找文件、做计划、改代码、跑测试和审查串成一条能追踪的链路，一边又能让普通开发者不掏订阅费就摸到这套玩法，那就不只是换了一个更会聊天的终端。

它开始有点像工程系统了。

原始资料：

- [Codebuff 中文 README](https://github.com/CodebuffAI/codebuff/blob/main/README.zh-CN.md)
- [Freebuff README](https://github.com/CodebuffAI/codebuff/blob/main/freebuff/README.md)
- [Codebuff 评测说明](https://github.com/CodebuffAI/codebuff/tree/main/evals)
- [Codebuff 官方文档](https://codebuff.com/docs)

#AI编程 #Codebuff #Freebuff #CodingAgent #多智能体 #Agent工作流 #软件工程 #GitHub开源项目
