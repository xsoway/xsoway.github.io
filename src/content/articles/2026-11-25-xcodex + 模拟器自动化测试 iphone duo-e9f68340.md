---
title: "xcodex + 模拟器自动化测试 iphone duo"
created: "2026-11-25"
tags: ["- Codex"]
category: "- Alan の手札"
published: true
---

# xcodex + 模拟器自动化测试 iphone duo

普通 iPhone 上，列表进入详情，再返回列表，多数时候都发生在同一块屏幕上。换到 iPhone Duo，用户可以在列表刚刷新、表单填到一半，甚至上传尚未结束时把手机展开。页面拿到的空间变了，原任务还得继续。

折叠屏适配可以从三个问题开始。页面还能看见吗？关键控件还能操作吗？操作的对象、输入和结果还是刚才那一份吗？这三个问题分别对应布局、交互和状态。下面从 Duo 的设备差异出发，把测试矩阵、安装步骤和证据串起来。

## 01｜普通 iPhone 上的假设，到了 Duo 哪些会失效

对普通直板 iPhone，测试通常从当前屏幕尺寸、方向、系统栏和键盘入手。旋转、弹窗、动态字体也会改变可用区域。Duo 额外引入了**合盖外屏、展开内屏、半开姿态和内屏分屏**。用户可以在业务进行中改变形态，应用需要重新排版，同时维持手上的任务。

| 设备差异 | 普通 iPhone 常见基线 | iPhone Duo 多出来的变量 | 测试时观察什么 |
| --- | --- | --- | --- |
| 物理显示面 | 同一块主屏内变化 | 合盖使用外屏，打开切到内屏 | 切换前后对象 ID、路由、未提交的内容、滚动锚点以及主动作 |
| 屏幕比例与安全区 | 刘海、相机、底部手势区随机型和方向变化 | 外屏短而宽，系统控件可位于侧边，左右安全区可能不对称 | 分别测左右方向，确认按钮可见且点到正确目标 |
| 内屏布局 | 以当前窗口的内容宽度适配 | 同一页面可能从单栈变为列表与详情双栏，也可能继续单列 | 默认选中项、单栏返回关系、列表与详情是否匹配 |
| 半开折叠区 | 画面无横向或纵向铰链保留区 | 内屏可出现折叠保留区及多个可用区域 | 文字、关键按钮、弹窗、拖放热区及焦点顺序 |
| 系统多任务 | 通常以单 App 手机窗口作为对照组 | 支持时在内屏与另一 App 并排，应用的窗口会变窄 | 左右换边、当前焦点、键盘归属、退出分屏后状态 |
| 相机与输入 | 在同一显示环境内弹出系统选择器或权限 | 屏幕切换涉及不同前置相机的位置，界面可在系统弹层打开时变化 | 取景、回调、权限拒绝、遮罩与取消是否按规格工作 |

这里最容易混用三个概念。**内屏与外屏**是两块物理显示面。**应用双栏**是同一个 App 同时摆出列表和详情。**系统 Split View** 是两个 App 并排，测的是各自实际拿到的窗口。半开的**分段和折叠保留区**又是窗口内的可用区域问题。测试记录把这四件事写开，才能判断具体是哪条布局规则出了偏差。

Apple 建议根据 size class、布局边距和安全区适配。系统控件会按场景调整位置，自绘底栏、悬浮组件和图片容器尤其需要检查。方向、栏数和留白按 App 的设计策略验收。Apple 也说明，使用 iOS 27 SDK 及后续版本构建的应用可在 Duo 上动态调整尺寸。因此复测时同时记录 **构建 SDK 和运行系统版本**，老包留边先确认兼容策略，再判断是否属于布局缺陷。 
[Apple iPhone Duo HIG]
https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo  [Apple Duo 准备指南]
https://developer.apple.com/iphone-duo/prepare

## 02｜从设备差异推导测试顺序

先在普通 iPhone 上跑一遍同构建、同数据的主流程，保存页面、对象 ID 和正常返回路径。再在 Duo 合盖外屏跑一遍，做到能区分“普遍业务问题”和“发生在 Duo 特定姿态的问题”。接着跑内屏、半开和系统分屏，最后把姿态变化插进操作中。相同测试数据便于比较，视觉基线则分别按各设备的规格判断。

| 顺序 | 做什么 | 主要问题 |
| --- | --- | --- |
| 1. 对照 | 普通 iPhone，固定 OS、App 构建与测试数据 | 样本、业务规则和原有交互是否正常 |
| 2. 稳态 | Duo 合盖、展开、半开，逐个进入同一页面 | 当前布局、系统保留区、内容密度和点击范围 |
| 3. 切换 | 合盖 ↔ 展开、半开 ↔ 展开，按支持的方向旋转 | 是否丢失对象、选项、输入或位置 |
| 4. 操作中切换 | 键盘出现、弹层打开、上传进行中、请求未完成 | 焦点和遮罩迁移、重复提交、异步结果串位 |
| 5. 系统对照 | 前后台、锁屏、系统分屏、外部跳转 | 返回后应用是否按新窗口重排，业务状态是否可恢复 |
| 6. 发布环境 | Duo 真机及签名包，接入测试服务 | 推送、分发、真实性能和硬件交互 |

每个高风险页面至少设两个断言。一个检查页面或控件可用，例如关闭弹窗并回到详情。另一个检查任务仍正确，例如表单中的对象 ID 未变，提交只创建一条测试记录。切屏之后栏数可以变化，保存的字段和操作目标要符合业务约定。

## 03｜把安装包跑起来

本次环境是 macOS 上的 Xcode 27.2、iOS 27.2 iPhone Duo 模拟器。手里只有模拟器版 `.app`，仍然可以从安装、启动一路测到页面导航、折叠切换和日志取证。

| 工具 | 在测试中负责什么 |
| --- | --- |
| Xcode Device Hub | 启动模拟设备，切合盖、半开、展开及方向，核对实际设备画面 |
| CoreSimulator / simctl | 安装、启动、按显示面截图和读取系统日志 |
| Build iOS Apps / ios-simulator-browser | 在 Codex 中组织浏览器镜像和页面交互 |
| serve-sim | 将运行中的模拟器画面传到本机浏览器，并把点击等操作传回设备 |

从 Apple 安装 Xcode，在 **Settings → Components** 核对 iOS Simulator Runtime，然后打开 **Xcode → Open Developer Tool → Device Hub**。选中或添加 iPhone Duo，再打开设备画面。Apple 的 Duo 指南从 Xcode 27.1 起介绍这条模拟流程。工具链和设备版本可用下列命令核对。 [Apple iPhone Duo 准备指南]
https://developer.apple.com/iphone-duo/prepare/

```bash
xcodebuild -version
xcrun simctl list runtimes
xcrun simctl list devices available
```

只有 `.app` 文件时，先检查它的可执行文件。Mac 和 iPhone 都有 arm64，直接看架构会漏掉目标平台这一层。

```bash
APP="/absolute/path/to/TestApp.app"
BUNDLE=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$APP/Info.plist")
EXE=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleExecutable' "$APP/Info.plist")
xcrun vtool -show-build "$APP/$EXE"
```

看到 `platform IOSSIMULATOR` 后，再检查最低系统版本是否匹配 Runtime。在 Device Hub 启动对应的 Duo，用准确的 UDID 安装。干净安装或升级测试单独建模拟器，便于复跑和保留历史数据。

```bash
SIM="<iPhone Duo UDID>"
xcrun simctl bootstatus "$SIM" -b
xcrun simctl install "$SIM" "$APP"
xcrun simctl launch "$SIM" "$BUNDLE"
```

启动命令返回 PID 后，去 Device Hub 确认首屏。首次隐私弹窗、首屏白屏和进入业务首页，分别记录成不同结果。

## 04｜把模拟器接到 Codex 浏览器

在 Codex 插件市场安装 **Build iOS Apps**，开启新聊天后指定 `ios-simulator-browser` 技能。使用 CLI 时先核对本机市场名称，以下是本次使用的插件标识。
[Codex 插件文档]https://learn.chatgpt.com/docs/plugins

```bash
codex plugin marketplace list
codex plugin add build-ios-apps@openai-curated --json
```

给 Codex 的任务可以具体到「使用指定 UDID 和 Bundle ID，打开模拟器镜像，先点击一个可逆入口确认控制，再执行指定用例」。手动启动也走同一条链路。本次镜像用的是 serve-sim 0.1.49，浏览器访问终端打印的本机地址，端口以实际输出为准。终端需要保持运行。 [serve-sim 项目](https://github.com/EvanBacon/serve-sim)

```bash
npx --yes serve-sim@0.1.49 --host 127.0.0.1 --panes tools --fit "$SIM"
```

浏览器出现画面后，点一次列表到详情再返回。此时能同时核对串流、触摸回传和应用导航。测试完退出前台进程。如果遗留了本轮镜像服务，按对应 UDID 清理。

## 05｜用例按可用区域和任务状态设计

合盖外屏、全展开内屏和半开内屏属于设备姿态。应用内的列表与详情双栏，和系统把两个 App 放进 Split View，则属于界面组织方式。一个应用可以在展开内屏保持单栏，也能在系统分屏后重新采用窄布局。用例要把这些条件分别写出来。 
[Apple iPhone Duo HIG]https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo

| 用例类型 | 重点动作 | 优先观察 |
| --- | --- | --- |
| 外屏与内屏 | 冷启动、双向切换、旋转 | 非对称安全区、可触达按钮、返回层级 |
| 应用内双栏 | 切条目、筛选、刷新、打开子页 | 左栏选中态、右栏对象和操作目标 |
| 半开与系统分屏 | 半开切方向，或与 Safari 并排并换边 | 折叠保留区、输入焦点、窄窗回退 |
| 原生控件 | 弹窗确认取消、Picker 回填、滑杆拖动、图集翻页 | 触摸热区、遮罩、一次操作对应一次结果 |
| H5 与混合容器 | 键盘、吸底按钮、上传控件、路由回退 | Safari 与 WKWebView 的实际视口和回调 |
| 上传下载 | 进行中折叠、后台恢复、断网重试 | 文件内容、进度、取消和服务端重复记录 |

设计时，最容易漏掉的是切换发生在什么时候。页面稳定后折叠，只能覆盖一次稳态重排。键盘还开着、图片正在翻页、请求 A 和 B 同时在路上，这些时候切屏，才有机会暴露焦点丢失、错误回跳或旧响应覆盖。

| 测试设计 | 输入与操作 | 判定依据 |
| --- | --- | --- |
| 姿态连续性 | 合盖 → 半开 → 展开 → 合盖，保持同一业务对象 | 对象 ID、回退层级、输入值及列表锚点 |
| 双栏数据一致性 | A 请求较慢，点 A 后立刻点 B，再改变布局 | B 的标题、价格、图片、按钮目标一致，A 回包后无覆盖 |
| H5 对照 | 同一测试 URL 分别跑 Safari 与 WKWebView | 记录容器、键盘前后的视口、路由与返回行为 |
| 文件完整性 | 使用已知 SHA-256 的文件，下载或上传进行中切屏 | 下载文件可打开且校验一致，上传按服务端记录判定 |
| 异常归因 | 浏览器见黑帧或应用退回主屏，按同一路径复测 | Device Hub、活动显示面的系统截图、进程日志与对照设备 |

Safari 27.1 的姿态和视口分段 API 在 WebKit 文档中标为需要开启功能开关的预览能力。业务回归先测默认设置下的布局和操作，再用明确启用的环境验证实验能力。也要核对 App 内 WKWebView 当下的行为。 
[WebKit Safari 27.1]https://webkit.org/blog/18486/webkit-features-for-safari-27-1/

## 06｜挑六条可以交给自动化跑的用例

以下是公共用例库的选摘。所有预期都可直接用画面、对象 ID 或服务端记录核对。

| 编号与场景 | 执行步骤 | 预期和证据 |
| --- | --- | --- |
| PUB-003 合展与输入焦点 | 表单输入到一半，保留选区，合盖后再展开继续编辑 | 值按约定保留，焦点合理，键盘可恢复 |
| PUB-009 筛选后旧详情与 CTA | 双栏选中 A，筛掉 A，随后点击匹配结果 B | 保留或清空 A 符合规则，切到 B 后所有动作目标一致 |
| PUB-017 导航栈与边缘返回 | 从列表进入三级页，取消一次返回手势，再逐层返回 | 每次退一级，取消后当前状态保持 |
| PUB-029 H5 固定 CTA | WKWebView 打开键盘，滚动并切姿态 | 吸底按钮、弹层仍可达，键盘收起后无残留空白 |
| PUB-037 原生相册上传 | 选测试图片并上传，上传中合盖再展开 | 进度和对象归属一致，测试后台只收到一份有效文件 |
| PUB-042 下载与打开 | 下载测试 PDF，进行中切屏，随后打开 | PDF 可读，文件名与校验结果正确 |

用例执行时记录 App 构建、iOS 版本、姿态、方向、样本数据、步骤和预期。观察到具体结果再填通过或失败。只有部分步骤成功时，写明做到哪一步以及缺哪条证据。

## 07｜怎么组织一次能复测的自动化执行

跑之前准备好可稳定定位的 A/B 样本、测试账户、H5 测试 URL、已知哈希的文件和隔离后端。姿态组合优先覆盖高风险场景，常规文字截断或样式检查可抽样，重复动作和跨屏迁移可以批量跑。对于分页，至少验证一对子页之间的 ID 集合。只有“滑到了更后面的卡片”，还不足以判断分页是否重复或漏数据。

```bash
npx --yes serve-sim@0.1.49 fold 0 -d "$SIM"
npx --yes serve-sim@0.1.49 fold 130 -d "$SIM"
npx --yes serve-sim@0.1.49 fold 180 -d "$SIM"
npx --yes serve-sim@0.1.49 rotate landscape_left -d "$SIM"
npx --yes serve-sim@0.1.49 rotate portrait -d "$SIM"
```

上面的角度用于测试输入。每次切换，以 Device Hub 或当前活动显示面的画面确认实际姿态。按 UDID 执行也便于多设备对照。旧镜像明确属于本轮时，可用 `npx --yes serve-sim@0.1.49 --kill "$SIM"` 清理。

| 测试对象 | 自动执行时怎么定位 | 验收证据 |
| --- | --- | --- |
| 原生表单和弹层 | 优先使用辅助功能标签和选中状态。切屏后重新读取控件 | 字段和值、焦点或键盘状态、关闭后的页面、操作目标 |
| 图集、分页与滑杆 | 用稳定控件定位或当前画面操作。每步核对页码、ID 或值 | 前后截图、排序与分页标识、滑杆端点和数值 |
| H5 与桥接 | 在 Safari 和 WKWebView 分别运行，用稳定路由与有效测试数据定位 | 视口变化、回跳页面、Web 或原生回调次数 |
| 上传和下载 | 使用合成文件，模拟失败、取消、恢复并切换姿态 | 文件名、大小、SHA-256 或转换后的规格、后台对象和重试记录 |
| 通知 | 用明确的测试 payload，分别在前台、后台和未运行状态触发 | 客户端目标、业务 ID、重复入栈与真机送达记录 |
| 性能 | 在发布等效包和真机上控制版本、姿态、温度、网络和样本 | 启动、交互、卡顿、峰值内存、电耗及基线，记录样本数和 p50/p95 |

模拟推送和文件校验可按下面的命令执行。测试文件与 payload 由项目环境提供。服务端送达与真机上屏仍需在真实链路验收。

```bash
xcrun simctl push "$SIM" "$BUNDLE" evidence/test-notification.apns
shasum -a 256 evidence/source.pdf evidence/downloaded.pdf
```

执行中遇到镜像长时间 Connecting，先检查 `serve-sim --list`、端口、UDID 和 Device Hub。若只是图像黑了，先看当前活动显示面，再执行系统截图。同一组用例的截图、日志和业务数据使用相同的用例编号，避免把前一次的黑帧和后一次的进程退出拼成一个结论。

报告每行保留设备、构建、起止姿态、步骤、预期、实际、证据和结论。完整通过、部分验证、环境阻塞、未执行分别计数。设计示例和已执行结果采用各自口径。需要交付模型名和 Token 时，从当轮会话读出模型和统计截点，分别列输入、缓存命中、输出，保留后续请求未计入的说明。图片和附件随报告打包，或者嵌入单文件 HTML，并在空目录离线打开一次。

## 08｜系统截图和日志能解决哪些争论

以下日志过滤使用示例 Bundle ID，执行前换成本轮 App 的值。运行中可用以下方式抓图和看镜像诊断。Duo 有多个显示面，`--display` 要用本机列出的 ID。`3` 是本次环境的内屏示例，采图时还要确认它正处于活动状态。

```bash
mkdir -p evidence
xcrun simctl io "$SIM" screenshot --display=3 evidence/inner.png
npx --yes serve-sim@0.1.49 doctor -d "$SIM"
xcrun simctl spawn "$SIM" log show --last 10m --style compact \
  --predicate 'process == "SpringBoard" AND eventMessage CONTAINS[c] "com.example.testapp"'
```

### 三个取证示例

下表使用通用场景说明判定方式，供项目执行时参照。

| 现象 | 需要的证据 | 如何判定 |
| --- | --- | --- |
| 合盖后浏览器画面黑了 | 同一时刻的 Device Hub 和活动显示面截图 | 两边正常时记录镜像问题，两边异常时继续查 App 或系统状态 |
| 点击后退回系统主屏 | 点击前后截图、App PID、SpringBoard 退出记录和复现次数 | 系统记录仅含信号时，记录进程退出，原因另查 |
| 列表筛选后右侧还显示旧详情 | 筛选前后对象 ID、选中状态和右侧操作目标 | 根据产品规则判断右栏是否应该保留。选中新条目后各字段与操作目标必须一致 |

这套公共库包含 90 条通用基线与 54 条补充用例。实际运行时按设备和环境标记适用范围。真机推送、渠道安装升级、相机以及真实性能，按各自条件验收。 
[Apple 性能测试文档]https://developer.apple.com/documentation/xcode/writing-and-running-performance-tests

把这一套复用到下一个 App 时，优先选一条写入前的关键路径，从外屏点进三级页，在表单、弹窗或请求进行中展开，再返回列表。记录对象 ID、状态和实际点到的控件，后续的切屏回归就有了可比较的基线。

参考资料 
[Apple Device Hub]https://developer.apple.com/documentation/xcode/interacting-with-your-app-in-device-hub 
[Codex 插件]https://learn.chatgpt.com/docs/plugins
[serve-sim]https://github.com/EvanBacon/serve-sim 
[WebKit]https://webkit.org/blog/18486/webkit-features-for-safari-27-1/
#Codex #iPhoneDuo #自动化测试 #折叠屏适配
