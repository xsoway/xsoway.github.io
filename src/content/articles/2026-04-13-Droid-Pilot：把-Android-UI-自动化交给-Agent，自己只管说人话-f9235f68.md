---
title: "Droid Pilot：把 Android UI 自动化交给 Agent，自己只管说人话"
created: "2026-04-13"
published: true
---
# Droid Pilot：把 Android UI 自动化交给 Agent，自己只管说人话

半夜刷 GitHub 的时候，我最怕看到两种项目：一种是“看起来很猛，但你根本不敢用”；另一种是“你以为能救命，结果上手全是坑”。

Droid Pilot 属于第三种：你看完 README 的第一反应是——

这玩意儿要是能跑通，Android UI 自动化那套苦活儿，真能少挨不少打。

但话也得说在前面：它不是魔法。它更像一个“会干活的测试同事”，你得给它包名、给它入口、最好再给它一条能跳过登录的捷径。

## 这个项目是干嘛的（一句话）

**Droid Pilot 是一个 Android UI 自动化 Agent（基于 Claude Code Skill），让你用自然语言对话来完成页面探索、知识库构建、框架搭建、测试执行和报告生成。**

## 它解决了什么问题

传统 Android UI 自动化最折磨人的不是写断言，是“从零开始建体系”：

- 先把页面走一遍、元素定位捋一遍
- 再写 Page Object
- 再搭 pytest / fixtures
- 再补报告

这套东西你写得越像工程，就越花时间；你写得越随意，后面就越烂。

Droid Pilot 的切入点很聪明：先让 Agent 去探索你的 App，把页面、元素、路由关系沉淀成知识库；再基于知识库自动生成 pages/tests/reports 这一整套骨架；最后由 Claude 逐步执行测试，每步截图 + dump，再由 Claude 来判定 pass/fail。

一句话：把“机械但繁琐”的活儿交给 Agent，你只盯住目标和边界。

## 核心功能亮点

- **页面探索 + 知识库构建**：先把页面、元素、跳转关系记录下来，后面生成框架就不是瞎猜。
  - 这在实际中有啥用：你不用手工维护一份永远过期的页面清单。

- **自动生成 Page Object + 测试骨架**：生成 `pages/`、`tests/`、`reports/`。
  - 这在实际中有啥用：从“写框架”变成“验收框架”。

- **变更影响/回归执行**：Claude 驱动逐步执行，每步截图、判断 pass/fail。
  - 这在实际中有啥用：测试不是“跑过就算”，而是每一步都有记录可追。

- **结构化报告输出**：`report.json` + `summary.md`。
  - 这在实际中有啥用：你能把失败复盘变成“看证据”，不是靠吵。

- **游戏类 Poco 可选支持**：对 Unity/Cocos 这类场景提供 Poco driver。
  - 这在实际中有啥用：不把你锁死在 uiautomator2 一条路上。

## 快速开始

### 1）安装

两种方式。

**方式 A：作为 Claude Skill（推荐）**

把 `droid-pilot` 复制到项目的 `.claude/skills/` 下，生成的测试代码会自动放在项目根目录：

```bash
mkdir -p /path/to/your-project/.claude/skills
cp -r droid-pilot /path/to/your-project/.claude/skills/
```

your-project/
├── .claude/skills/droid-pilot/ ← 工具在这里
├── pages/ ← 生成的 Page Object
├── tests/ ← 生成的测试用例
└── reports/ ← 测试报告

**方式 B：独立使用**

直接在任意目录运行脚本，用 `--dir` 指定输出目录：

```bash
python droid-pilot/scripts/scaffold.py init -p com.xxx --dir /path/to/your-project
```

### 2）环境依赖

- Python 3.8+
- ADB（Android Debug Bridge）
- uiautomator2：`pip install uiautomator2`
- pytest：`pip install pytest`（测试执行时需要）
- Poco（可选，游戏类应用）：`pip install pocoui`

### 3）连接设备

确保 Android 设备已连接并开启 USB 调试：

```bash
adb devices
```

### 4）开始对话

在项目目录下启动 Claude Code，然后就可以用人话指挥：

> 帮我探索一下这个应用，包名是 com.example.myapp
> 这是首页
> 帮我搭建自动化框架
> 测全部
> 看测试报告

它的官方流程就是：探索页面 → 构建知识库 → 搭建框架 → 执行测试 → 生成报告。

## 关键用法 / 示例

你更可能高频用的是这几条：

- `/understand`（不是这个项目的）先别混了——Droid Pilot 的核心是“探索 + 生成 + 执行”，你只要记住：给包名、给入口、给目标。

以及共创模式：你手动把手机操作到某个页面，然后告诉 Claude：

> 这是 xx 页面

Claude 会自动 dump 并录入，比纯自动探索更快。

如果你的应用有便捷登录，提前告诉它，效率会暴涨：

```bash
# broadcast 注入
adb shell am broadcast -a com.xxx.LOGIN --es token "test_token"

# intent 参数
adb shell am start -n com.xxx/.LoginActivity --es account "test"
```

## 使用感受（不官方版）

我对这类工具的标准很简单：别让我先写一堆框架才能开始测。

Droid Pilot 的优点是它把“先建体系”这件事前置到探索阶段，用知识库兜住后续的生成与执行。

但你也别指望它在完全黑盒、完全没入口的 App 里一键通关——你不给包名、不告诉它怎么登录，它也只能在登录页跟你大眼瞪小眼。

## 适合哪些人用

- Android 测试/QA，手上项目多，最怕每个项目都从 0 写 Page Object
- Android 开发自测，希望快速生成一套可跑的 UI 回归骨架
- 团队里有“上手周期长”的老项目，想把页面结构先可视化/可沉淀
- 你在做 Agent 测试自动化实验，想要一个 Claude-as-Judge 的落地样例

## 注意事项 / 坑点

- **包名是硬门槛**：Claude 会问包名，不知道就先让它查当前应用包名。
- **登录是最大变量**：能跳过 UI 登录（broadcast/intent/GM 命令）就尽量给，不然探索与回归都会卡死。
- **游戏类应用要给启动耗时**：Poco 场景需要初始化时间，告诉它“多久可操作”，不然会误判。
- **判定逻辑是 Claude-as-Judge**：每步截图 + dump 再判断 pass/fail，很灵活，但也意味着你要接受“它是模型在判”，必要时要加更强的验证点。

## 一句话总结

**Droid Pilot 的价值不在“又一个 UI 自动化框架”，而在于它把探索→沉淀→生成→执行→报告这条链路串成了能对话驱动的工程闭环。**

## 评论区交作业

你会把它用在你的 Android 项目里吗？

- A：会，我最烦的就是从 0 写 pages/tests
- B：观望，我担心登录/稳定性搞不定
- C：不会，我更信硬编码断言 + CI

说说你选哪个，以及你们项目里最难自动化的那一段 UI 是啥。

## 推荐标签
#Android #UI自动化 #ClaudeCode #Agent #测试工程 #uiautomator2 #pytest #PageObject #自动化测试 #测试报告
