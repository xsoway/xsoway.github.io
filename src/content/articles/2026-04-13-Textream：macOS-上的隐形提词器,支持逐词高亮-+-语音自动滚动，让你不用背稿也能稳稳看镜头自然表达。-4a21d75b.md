---
title: "Textream：macOS 上的隐形提词器,支持逐词高亮 + 语音自动滚动，让你不用背稿也能稳稳看镜头自然表达。"
created: "2026-04-13"
tags: ["Draft","OpenClaw"]
category: "Articles"
published: true
---
> 图片资源未同步：未命名图片

# Textream：macOS 上的隐形提词器,支持逐词高亮 + 语音自动滚动，让你不用背稿也能稳稳看镜头自然表达。

直播/采访/演讲/录播这类场景，有个永恒的尴尬：

- 稿子放屏幕下方 → 眼神飘，观众一眼看穿
- 稿子背熟 → 一紧张就断片，节奏直接塌
- 提词器开太大 → 观众也看见了，像在读 PPT

Textream 的思路很简单：把“看稿”这件事做得更像作弊——**只让台上的人看见，台下的人完全无感**。

---

## 这是个什么东西（别把它当花里胡哨小工具）

Textream 是一款**免费、开源**的 macOS 提词器。主打三件事：

1) **实时词跟踪**：说到哪个词，就高亮哪个词（不是瞎滚动）
2) **经典自动滚动**：按固定速度匀速滚（适合照着节奏念）
3) **语音激活滚动**：开口就走，停嘴就停（适合自然语速）

更关键的是呈现方式：

- 可以做成**“动态岛”样式**贴在屏幕顶部
- 也可以是**可拖拽悬浮窗**
- 甚至能在**任意显示器全屏**（包括 Sidecar iPad）

文字对外“隐身”：**只有自己能看到，观众看不到**。

---

## 三种“引导模式”：到底选哪个

| 模式 | 适合人群 | 核心机制 | 麦克风 |
|---|---|---|---|
| Word Tracking（默认） | 采访/播客/口条不稳定但要稳准 | 设备端语音识别，边说边逐词高亮；**无云端、低延迟、可离线**；支持多语言 | 需要 |
| Classic | 直播带货/背稿型演讲 | 固定速度自动滚动 | 不需要 |
| Voice-Activated | 临场发挥/自然表达 | 说话就滚，沉默/静音就暂停 | 需要 |

配套可调项也挺实用：

- **滚动速度**：Classic / Voice-Activated 支持 **0.5–8 words/s**
- **识别语言**：Word Tracking 可选语音识别语言
- **鼠标滚轮追进度**：Classic / Voice-Activated 下，用滚轮跳前跳后；滚动期间计时暂停，松手从新位置继续

一句话选型：

- **怕卡壳/怕忘词** → Word Tracking
- **要稳定节奏** → Classic
- **要自然停顿** → Voice-Activated

---

## 三种“显示方式”：怎么做到观众看不见

### 1) Pinned to Notch（固定到刘海下方）

把提词条做成“动态岛”形状，钉在 MacBook 顶部，永远置顶。

可选项：

- **Follow Mouse**：鼠标在哪个屏幕，提词条就跟去哪个屏幕
- **Fixed Display**：固定在某个指定屏幕

### 2) Floating Window（悬浮窗）

可拖拽、随便放、始终置顶。

可选项：

- **Follow Cursor**：窗口跟着鼠标走；并带一个悬浮停止按钮，随时一键收摊
- **Glass Effect**：磨砂玻璃效果；透明度 **0–60%** 可调

### 3) Fullscreen（全屏）

任意显示器都能全屏提词。

可选项：

- 选择在哪个屏幕全屏显示（含 Sidecar iPad）
- **Esc 退出**：按下 Esc 直接关掉覆盖层

---

## 安装：两条路，别走弯路

### 路线 A：直接下 dmg

- 去 GitHub Releases 下载最新 `.dmg`：
  - [下载链接（Releases）](https://github.com/f/textream/releases/latest)

### 路线 B：Homebrew

```bash
brew install f/textream/textream
```

系统要求：

- **macOS 15 Sequoia 或更高**
- Apple Silicon / Intel 都支持

---

## 想自己改？从源码构建也很直给

要求：

- macOS 15+
- Xcode 16+
- Swift 5.0+

构建步骤：

```bash
git clone https://github.com/f/textream.git
cd textream/Textream
open Textream.xcodeproj
```

在 Xcode 里直接 `⌘R` 构建并运行。

---

## 首次打开可能被 macOS 卡住：解决方式很“macOS”

因为不是 App Store 分发，第一次打开可能被系统拦一下。

按官方方式处理（终端执行一次）：

```bash
xattr -cr /Applications/Textream.app
```

然后：

- 右键应用 → **打开**
- 第一次确认后，系统会记住这个选择

---

## 30 秒上手流程（照着做就能用）

它的工作方式就是“三步走”，基本不会学不会：

1) **粘贴稿子**：把 talking points / 采访问题 / 全稿丢进编辑器
2) **点播放**：屏幕顶部的“动态岛”样式叠加层滑下来
3) **开口**：朗读时实时高亮；读完后叠加层自动关闭

然后再按需求补两步：

- 选模式：Word Tracking / Classic / Voice-Activated
- 选显示方式：Notch / 悬浮窗 / 全屏（含 Sidecar iPad）

这个“自动关闭”对录播很友好：不需要录完再手忙脚乱找关闭按钮。

---

## 适用场景清单（很直白）

Textream 的目标人群写得很明白，基本就是“需要读稿但不想露馅”的职业：

- **主播（Streamers）**：读赞助口播、公告、要点时，视线别再离开镜头
- **采访者（Interviewers）**：问题一直挂着，同时还能和嘉宾保持自然眼神交流
- **演讲者/主持人（Presenters）**：Keynote / Demo / Talk 把节奏稳住，**不丢行**
- **播客（Podcasters）**：录制时手别乱动，照着 show notes、广告文案、提纲一路走

---

## 细节配置：提词条别只会“滚”

这类工具最怕“功能很强但不好调”。Textream 给的可调项很具体，属于那种一眼能用上的：

### 尺寸：宽高都能拧

- **宽度**：叠加层宽度可调 **280–500 px**
- **高度**：文本区域高度可调 **100–400 px**

### 字体与颜色：别把眼睛当耗材

- **字体**：Sans / Serif / Mono / **OpenDyslexic（阅读障碍友好）**
- **字号**：XS（14 pt）/ SM（16 pt）/ LG（20 pt）/ XL（24 pt）
- **高亮颜色**：White / Yellow / Green / Blue / Pink / Orange

---

## 外接屏 & Sidecar：专业提词器那套也能搞

外接显示输出有三种模式：

- **Off**：不输出到外接屏
- **Teleprompter**：在指定外接屏或 Sidecar iPad 上全屏提词器
- **Mirror**：为镜面提词器支架准备的**翻转输出**

镜像还支持选轴：

- 水平（镜面提词常用）/ 垂直 / 双轴（180°）

并且能指定目标显示器：外接屏 + Sidecar iPad 都在列表里选。

---

## 远程连接：手机/平板也能当“副屏提词器”

Textream 支持在局域网里开一个浏览器端的远程视图：

- 在 Settings → Remote 启用后，会在 Mac 上启动一个轻量 **HTTP + WebSocket** 服务
- 手机/平板扫码（**QR code**）就能打开
- **实时同步**：逐词高亮、波形动画、进度更新都走 WebSocket
- **不用装 App**：现代浏览器即可
- **端口可配**：默认 **7373**，高级设置可改
- **完全本地**：流量留在 Wi‑Fi 内，不出网

---

## 文件支持：别每次都手动粘贴

- **导入 PowerPoint 备注**：拖入 `.pptx`，把 presenter notes 提取成页面
  - Keynote / Google Slides：先导出为 PowerPoint 再导入
- **保存为 `.textream`**：脚本可复用，适合把常用台词/主持词攒成库
- **多页面**：支持页面切换与自动前进
  - 在 follow-cursor 模式下，页面会以 **3 秒倒计时**自动切换

---

## 其它小功能：就差把“别翻车”写脸上

- **实时波形**：确认麦克风确实在拾音（别对着空气演讲）
- **点词跳转**：点任意单词，追踪器直接跳到对应位置
- **暂停/继续**：临时跑题/打断后，能从中断处接上
- **静音/取消静音**：任何模式都能从叠加层切麦克风
- **隐藏屏幕共享**：叠加层可从录屏/视频会议中隐藏
- **自动更新检查**：启动时或从菜单检查 GitHub Releases
- **隐私导向**：设备端处理、无需账号、无追踪

---

## 坑点 / 雷区（提前避）

- **系统版本**：macOS 15+ 才能玩，老系统别硬装
- **麦克风权限**：Word Tracking / Voice-Activated 需要麦克风；没权限就等于少一条腿
- **首启拦截**：被阻止不是坏事，按 `xattr -cr` 走一遍即可
- **全屏退出**：记住 Esc，别在台上疯狂找鼠标

---

## 下一步怎么用得更稳

- 正式上场前，先用 1 段 30 秒脚本做“彩排”：
  - 试出最舒服的滚动速度（0.5–8 words/s）
  - 试出最佳显示方式（Notch / 悬浮窗 / 全屏）
- 采访/播客类内容，建议优先 Word Tracking：
  - 让“逐词高亮”兜底，少靠运气

资料入口：

- [下载（GitHub）](https://github.com/f/textream/releases/latest)
- [项目主页（repo）](https://github.com/f/textream)
- [功能列表](https://github.com/f/textream#features)
- [工作原理](https://github.com/f/textream#how-it-works)

---



#macOS #开源软件 #内容创作 #直播工具 #播客
