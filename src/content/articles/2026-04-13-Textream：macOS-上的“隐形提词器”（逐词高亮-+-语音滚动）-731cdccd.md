---
title: "Textream：macOS 上的“隐形提词器”（逐词高亮 + 语音滚动）"
created: "2026-04-13"
published: true
---
# Textream：macOS 上的“隐形提词器”（逐词高亮 + 语音滚动）

镜头前读稿这事，本质就一句话：**你得看字，但不能让别人看出来你在看字。**

现实里通常是三种翻车姿势：

- 稿子放屏幕下方：眼神一直往下飘，观众一秒破案
- 稿子硬背：临场一紧张就断片，节奏像踩空台阶
- 提词器开太大：观众也看见了，整段像在念 PPT

Textream 的解法很“坏”：把提示做成你自己能看清、别人几乎察觉不到的样子——**台上看得见，台下看不见**。

---

## 它到底是什么：别把它当普通滚屏

Textream 是一个 **免费 + 开源** 的 macOS 提词器。它不是只会匀速往下滚，而是给了三种完全不同的“带你走”的方式：

### 1）Word Tracking（默认）

你读到哪一个词，它就高亮到哪一个词。
关键点：**设备端语音识别、离线可用、无云端延迟**，还支持多语言。

### 2）Classic（经典自动滚动）

按固定速度滚，最适合“节奏稳定、稿子写得很顺”的场景。
优点也简单：**不需要麦克风**。

### 3）Voice-Activated（语音激活滚动）

你开口它滚，你停下来它就暂停。
这模式很适合“说一说停一停”的自然表达，不会被滚屏催命。

另外还有几个很实用的小补丁：

- Classic / Voice-Activated 支持速度调节：**0.5–8 words/s**
- Classic / Voice-Activated 支持鼠标滚轮跳进度：你滚的时候计时会暂停，松开从新位置接着来
- Word Tracking 可选识别语言

选型不用纠结：

- **怕忘词、怕丢行**：Word Tracking
- **想稳定节奏**：Classic
- **想按自然停顿来**：Voice-Activated

---

## 它怎么“只让你看见”：三种显示方式

Textream 的展示方式做得很“舞台友好”，你可以选一个最不影响眼神的：

### Pinned to Notch（钉在刘海下方）

做成“动态岛”那条小提示，永远置顶。

- Follow Mouse：鼠标在哪个屏幕，它跟到哪个屏幕
- Fixed Display：固定在某一块屏幕

### Floating Window（悬浮窗）

一个可拖拽、永远置顶的小窗，想放哪放哪。

- Follow Cursor：窗口跟着鼠标走，还带一个浮动停止按钮
- Glass Effect：磨砂玻璃背景，透明度 **0–60%** 可调

### Fullscreen（全屏）

任意显示器都能全屏提词（包括 Sidecar iPad）。
退出逻辑也很干脆：**Esc 直接收工**。

---

## 细节配置：你真能把它调到“顺眼又顺嘴”

很多提词器最烦的是：功能明明有，但调起来像开飞机。Textream 的设置更像“拧螺丝”，直观：

### 尺寸

- 叠加层宽度：**280–500 px**
- 文本区域高度：**100–400 px**

### 字体/颜色（对眼睛友好）

- 字体：Sans / Serif / Mono / **OpenDyslexic（阅读障碍友好）**
- 字号：XS 14pt / SM 16pt / LG 20pt / XL 24pt
- 高亮颜色：White / Yellow / Green / Blue / Pink / Orange

---

## 外接屏、Sidecar、镜面提词器：更“专业设备流”的玩法

外接显示输出支持三种模式：

- Off：不输出
- Teleprompter：指定外接屏或 Sidecar iPad 全屏显示
- Mirror：给镜面提词器支架用的**翻转输出**

镜像轴也能选：水平 / 垂直 / 双轴（180°）。目标显示器则从外接屏和 Sidecar 设备里挑。

---

## 远程连接：手机/平板直接当“无线提词屏”

如果你不想折腾硬件副屏，Textream 还能走“局域网浏览器模式”：

- Settings → Remote 开启后，会在 Mac 上跑一个轻量 **HTTP + WebSocket** 服务
- 生成 **二维码**，手机/平板扫一下就能打开
- 同步是实时的：逐词高亮、波形动画、进度更新都走 WebSocket
- **不用装 App**，浏览器就行
- 端口默认 **7373**，可在高级设置调整
- 全程局域网：**不出 Wi‑Fi，不走云**

---

## 文件支持：不想每次都粘贴一遍

- PowerPoint 备注导入：拖 `.pptx`，把 presenter notes 拆成页面
  - Keynote / Google Slides：先导出成 PowerPoint 再来
- 保存为 `.textream`：把常用主持词/口播稿攒成库
- 多页面支持：页面可切换并自动前进
  - Follow-cursor 模式下会有 **3 秒倒计时**自动翻页

---

## 适用人群（官方就差把职业证写上了）

- 主播：读赞助口播、公告、要点，不用把视线从镜头挪开
- 采访者：问题一直可见，同时还能保持自然眼神交流
- 演讲者/主持人：Keynote / Demo / Talk 稳住节奏，别丢行
- 播客：录制时解放双手，照着 show notes / 广告文案 / 提纲走

---

## 安装与“首次被拦截”：别慌，按套路来

下载方式两条：

- GitHub Releases 下 `.dmg`：
  - [下载（Releases）](https://github.com/f/textream/releases/latest)
- Homebrew：

```bash
brew install f/textream/textream
```

系统要求：**macOS 15 Sequoia 或更高**，Apple Silicon / Intel 都支持。

首次打开如果被 macOS 拦一下（非 App Store 分发常见剧情），终端跑一次：

```bash
xattr -cr /Applications/Textream.app
```

然后右键应用 → 打开。确认一次后系统会记住。

---

## 想自己改：源码构建也很直给

要求：

- macOS 15+
- Xcode 16+
- Swift 5.0+

步骤：

```bash
git clone https://github.com/f/textream.git
cd textream/Textream
open Textream.xcodeproj
```

Xcode 里 `⌘R` 直接跑起来。

---

## 实用建议：先用 30 秒脚本把它“调顺”

别上来就拿正式稿开录。先用一段 30 秒测试稿：

- 把滚动速度调到舒服的区间（0.5–8 words/s）
- 选一个最不影响眼神的显示方式（Notch / 悬浮窗 / 全屏）
- 如果你是临场发挥多：优先试 Word Tracking 或 Voice-Activated

资料入口：

- [项目主页](https://github.com/f/textream)
- [功能列表](https://github.com/f/textream#features)
- [工作原理](https://github.com/f/textream#how-it-works)

------

#macOS #开源软件 #内容创作 #直播工具 #播客

