---
title: "让 AI 自己打开 App 点完整个流程：agent-device 真机自动化实测"
created: "2026-09-05"
published: true
---

# 让 AI 自己打开 App 点完整个流程：agent-device 真机自动化实测

拿到一个开源项目，与其念一遍 README 上的功能清单，不如直接把它装到机器上跑一个真实场景。这次实测的对象是 Callstack 开源的 agent-device：一个让 AI 编码代理（Claude Code、Codex、Cursor 等）能自己打开 App、看界面、点按钮、填表单、截图留证的工具。文章按一次真实开发实例展开，全部命令与输出均来自本机实际运行（macOS 真机目标），运行时间为 2026-09-05。

---

## 为什么突然要搞这个

移动端回归验证一直是研发和测试流程里的耗时环节。人工在模拟器或真机上点完整个用例再截图，一轮下来十几分钟；团队希望让 AI 编码代理在改完代码后，自己把 App 跑起来、走到关键页面、验证状态并留下证据，把"人肉点按 + 截图"从日常循环里拿掉。

agent-device 解决的正是这个诉求：给 AI 代理一个"活的 App 反馈闭环"。它通过命令行、内置 MCP 服务器或类型化的 Node.js API 三种入口，让代理读取 App 的无障碍快照（accessibility snapshot）而不是只靠截图猜界面，再用 @ref 引用和选择器去点击、填写、滚动、断言，并把截图、日志、性能数据存成可复核的证据。

需要先说明测试边界：官方支持 iOS、Android、HarmonyOS、tvOS、各类 TV、Web、macOS 和 Linux 目标。本机没有安装 iOS 模拟器运行时（多 GB 下载，未安装），也没有 Android 模拟器镜像，因此本次实测选择官方同样支持、且本机可直接运行的 **macOS 桌面目标**做端到端验证；iOS/Android 模拟器部分未实测，仅引用官方文档说明。

---

## 要验证什么、卡到什么标准

选定的场景是"AI 驱动 macOS 原生计算器完成一次完整计算并截图留证"。选计算器有两个原因：它是系统自带应用，不含业务敏感数据；界面元素有清晰的无障碍标签，适合验证快照与 @ref 机制。

验收标准如下：

- 代理能打开指定应用并拿到带 @ref 的界面快照；
- 通过 @ref 依次点击 1、2、乘、8、等于，完成 12 × 8 的计算；
- 每一步操作后界面状态正确推进，最终显示结果为 96；
- 用截图命令留存运行证据，并干净关闭会话；
- 全程记录真实命令输出，作为文章证据。

运行环境：macOS（Apple 芯片），Node.js v24.18.0，agent-device 0.20.10（npm 全局安装）。

---

## 测试方案怎么设计

agent-device 的会话模型：`open` 启动会话并返回首帧快照；`snapshot -i` 取当前交互快照；`press`/`fill`/`scroll` 等动作加 `--settle` 等界面稳定后输出差异（diff）；`screenshot` 截图；`close` 结束会话。

设计上要遵守工具的引用规则：**@ref 只在最新一次输出里有效**，动作执行后会失效，需要从 diff 里继续用新 ref，或重新快照。这正是该工具与固定脚本（Appium/Detox/Maestro）的本质差异：代理在运行时读取状态、自己决定下一步命令，而不是回放预先写死的步骤。

一个值得记录的设计取舍：一开始想在 iOS 模拟器上演示（README 首页就是 iOS Contacts 的例子），但 `xcrun simctl list runtimes` 显示本机未安装任何 iOS 运行时；Android 侧 `adb devices` 无设备、也无 AVD。因此按"真机可用目标优先"原则，改选 macOS 桌面目标完成同一条验证链路——验证的核心（快照 → @ref → 动作 → 证据）在所有平台一致。

---

## 动手跑起来：逐条命令真实执行

以下是本机 2026-09-05 的真实执行记录，命令与输出未作修改。

**第 1 步：安装 CLI 并跑 doctor**

```bash
npm install -g agent-device@latest
```

真实输出（节选）：`added 29 packages in 4s`。安装后版本 0.20.10。

```bash
agent-device doctor
```

真实输出（节选）：

```
✓ agent-device: agent-device 0.20.10 using [本机路径已隐藏]
✓ device: 2 local devices available; 2 booted (Apple 2 available, 2 booted)
! device-harmonyos: HarmonyOS device inventory could not be read: hdc not found
Doctor: warn（无硬阻塞；HarmonyOS/Vega 仅因本机未装对应工具链提示警告）
```

doctor 确认了本机两个可用目标：iPhone（ios，booted）与本机 macOS（macos，booted）。HarmonyOS 与 Vega 因缺少对应命令行工具给出提示，不影响本次 macOS 实测。

**第 2 步：打开目标应用**

```bash
agent-device open com.apple.calculator --platform macos --foreground
```

真实输出（节选）：

```
Building Apple runner...
Starting XCTest runner...
Opened: com.apple.calculator
Snapshot: 1 visible nodes (9 total)
```

**第 3 步：取交互快照**

```bash
agent-device snapshot -i
```

真实输出（节选）：33 个可见节点，计算器按键全部带 @ref 与无障碍标签：

```
@e15 [text] "0"
@e28 [button] "1"
@e29 [button] "2"
@e21 [button] "8"
@e23 [button] "乘"
@e35 [button] "等于"
```

**第 4 步：按 @ref 依次点击，完成 12 × 8**

真实输出（节选，逐步合并）：

```bash
agent-device press @e28 --settle   # 显示 → 1
agent-device press @e29 --settle   # 显示 → 12
agent-device press @e23 --settle   # 显示 → 12×
agent-device press @e21 --settle   # 显示 → 12×8
agent-device press @e35 --settle   # 显示 → 96
```

每一步 `--settle` 都会等界面稳定并输出 diff，例如按 1 之后：

```
settled after 888ms: +2 -2 (~39 unchanged)
- @e15 [text] "0"
+ @e15~s525112 [text] "1"
- @e17 [button] "全部清除"
+ @e17~s525112 [button] "清除"
```

这里出现过一个真实问题，正好体现 @ref 的时效规则：按完 1 后直接复用旧快照里的 @e30（"2"）会报错：

```
Error (COMMAND_FAILED): Ref @e30 needs a complete snapshot — the current frame
only authorizes its emitted refs
Hint: Capture a fresh interactive snapshot (snapshot -i) ...
```

按工具提示重新 `snapshot -i` 取新 ref 后即恢复，这正是官方文档说的"refs are only valid from the latest output"。

**第 5 步：截图留证并关闭**

```bash
agent-device screenshot ./calculator-96.png
```

真实输出：`/private/tmp/agent-device-run/calculator-96.png (460x816)`，文件 80.1 KB。截图时计算器界面显示 `12×8` 与结果 `96`（快照确认：`@e15 [text] "12×8"`、`@e17 [text] "96"`）。

```bash
agent-device close
```

真实输出：`Closed: default`。

**补充验证：MCP 入口**

```bash
agent-device mcp
```

stdio MCP 服务器正常启动并等待客户端连接（命令持有 stdin，超时退出属正常行为），与 README"CLI 与 MCP 走同一执行路径"的描述一致。

---

## 结果怎么判定、卡了哪些壳

对照验收标准逐条核验：

| 验收项 | 结果 |
|---|---|
| 打开应用并拿到带 @ref 快照 | ✅ 33 个可见节点，按键标签清晰 |
| 依次点击完成 12 × 8 | ✅ 显示从 0 → 1 → 12 → 12× → 12×8 → 96 |
| 界面状态正确推进 | ✅ 每一步 --settle 后 diff 显示正确变更 |
| 截图留证 + 干净关闭 | ✅ 460×816 PNG，session Closed |
| 全程真实命令记录 | ✅ 见上文输出 |

判断：在 macOS 桌面目标上，agent-device 完整走通了"打开应用 → 读取无障碍快照 → 按 @ref 操作 → diff 验证 → 截图证据"这条 Agent 闭环，功能可用性与 README 描述一致。

**过程中真实遇到的边界（均非工具缺陷，属于使用契约）：**

- @ref 时效性：动作执行后旧 ref 失效，需从最新 diff 或新快照取 ref。这是设计使然（避免代理用过期的界面坐标操作），但首次上手容易踩，官方在 help 与 README 均有提示。
- 平台覆盖有深有浅：`agent-device capabilities --platform macos` 显示该目标支持 32 条命令；HarmonyOS、Vega OS 等较新后端只覆盖部分命令子集。README 明确建议用 `capabilities --platform <platform>` 查看实际支持。
- 目标依赖本机工具链：iOS 需要 Xcode 模拟器运行时、Android 需要 SDK/模拟器、HarmonyOS 需要 hdc、Vega 需要 Vega CLI。缺工具链时 doctor 会提示，相关平台无法运行，不影响其他平台。
- 本机无 iOS 运行时与 Android 模拟器，iOS/Android 目标未实测，仅引用官方资料。

---

## 这轮实践留给团队什么

一个能直接照做的结论：想让 AI 编码代理自己验证 App，agent-device 把"看界面、点操作、留证据"做成了代理可用的统一运行时，CLI、MCP、Node.js API 三种入口共享同一套会话与证据模型。本次实测验证了 macOS 目标的完整链路，全过程约几分钟，全部命令可复现。

可迁移场景：团队在 CI 里把录制好的 `.ad` 回放脚本跑成回归（README 给出 EAS workflow 模板）；把 MCP 服务器接进 Claude Code/Codex 让代理改完代码自测；或基于 `createAgentDeviceClient()` 在自研 QA 代理里做设备调度。官方"Works with"名单含 Claude Code、Codex、Cursor、Windsurf、Cline、Goose，以及基于 AI SDK/Eve 自建的代理。

实践建议（来自本次真实运行）：

- 先自己跑 `agent-device doctor` 确认目标可用，再把 CLI 交给代理；
- 动作后只相信最新输出里的 @ref，diff 缺目标就重新 `snapshot -i`；
- 截图只是证据，界面状态断言要用 diff、`wait text` 或 `is/get` 等命令；
- 想验证哪个平台，先 `capabilities --platform <平台>` 看支持范围再设计用例。

原文链接：<https://github.com/callstack/agent-device/blob/main/README.md>

`#AI编程代理` `#移动端自动化` `#Agent真机验证` `#开源工具实测` `#质量保障`
