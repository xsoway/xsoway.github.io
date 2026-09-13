---
title: "2K Star！AI 生成的前端页面再也不是「一眼假」了：这个开源项目用 57 道门禁把设计拉回真实世界"
created: "2026-08-20"
published: true
---

你让 AI 写一个落地页，它给你一个左图右文、hero → 三个特性 → CTA → footer 的标准模板。换个需求重写，颜色变了，结构没变。再换个需求，还是一样。

这就是现在 AI 生成前端最大的问题：不是"不好看"，是"所有东西看起来都差不多"。同一个骨架，换个皮肤，就说是另一个产品。技术圈里管这个叫"AI 味"——一看就知道是 LLM 吐出来的。

**最近 Together AI 开源了一个叫 Hallmark 的设计技能，专门治这个。装在 Claude Code、Cursor 或 Codex 里，生成的页面不再是模板换肤，而是真能根据不同的需求长出不同的结构。**

### 一句话结论

Hallmark 是一个 Claude Code / Cursor / Codex 的设计技能。它接管了 AI 生成前端页面时的决策权——选什么布局、用什么字体、定什么配色——而不是让 LLM 凭训练数据里的统计惯性去"平均"出一个页面。装好之后，给你的 AI 助手一句"帮我建一个落地页"，出来的是有结构差异、有设计意图、没有 AI 套路的真实页面。

---

**核心亮点**

**1. 21 个主题，不是 21 个皮肤**

Hallmark 内置了 21 个命名主题——Linen、Salon、Terminal、Almanac、Brutal、Midnight、Plain、Riso、Carnival、Cobalt、Lumen、Garden、Bubble、Custom 等等。每个主题不只是配色不同，而是从字体系统、排版节奏、间距策略到卡片风格都不一样。

这意味着什么：用 Linen 做一个咖啡订阅页，出来的是暖纸色 + 罗马衬线体 + 手写感排版。用 Terminal 做一个 CLI 工具页，出来的是深色底 + 磷光绿 + 等宽字体 + 终端风格的代码块。两个页面放在一起，不会有人觉得是同一个模板改的。

**2. 四个动词，覆盖四种场景**

Hallmark 定义了四个操作，不是只有一个"生成"：

- **默认（直接描述需求）**：新建 UI，自动选主题、跑设计流、输出
- **`hallmark audit <目标>`**：对现有代码做反模式评分，只出报告，不改代码
- **`hallmark redesign <目标>`**：丢掉原有视觉结构，保留文案和品牌信息，重新构建
- **`hallmark study <截图 | URL>`**：从你喜欢的页面提取设计 DNA——宏观结构、字体搭配、色彩锚点，然后你可以选择用它来生成自己的页面，或者输出一份 `design.md` 传给其他 AI 工具

study 这个功能特别有意思。它不是抄像素，而是提取"设计基因"：这个页面用了什么结构类型？什么字体配对？色彩锚点在哪？然后你可以说"用这个 DNA 给我的内容做一版"。

**3. 57 道 slop 检测门禁 + 输出前自评**

每条输出在交给用户之前，先过 57 道检测闸门，覆盖：发明数据、虚假指标、伪造的客户评价、AI 典型排版模式、色盲可访问性、响应式断点、字体污染、伪浏览器 chrome 等等。

然后是六维自评：Philosophy、Hierarchy、Execution、Specificity、Restraint、Variety，每项 1-5 分。任何一项低于 3 分，自动触发修改轮。最后在产物 CSS 注释里打上评分戳：`/* Hallmark · pre-emit critique: P5 H4 E5 S4 R5 V5 */`

**4. 不同需求长不同结构，不是换色**

Hallmark 最核心的差异是"宏观结构多样性"。它定义了一套宏观结构目录——Long Document、Letter、Catalogue、Quote-Led、Workbench、Index-First 等——而不是只有一个"hero → 3-feature → CTA → footer"。

一个烘焙坊的落地页可能用 Catalogue 结构：面包名称 + 描述 + 价格 + 当日售罄标识。一个播客页可能用 Letter 结构：以"Dear listener"开头，正文三段，底部只放收听链接。一个 SaaS 产品页可能用 Workbench 结构：左侧产品功能介绍，右侧粘性交互面板。

**5. Custom 模式：当目录主题扛不住创意需求时**

如果需求里带了明确的创意意图——"我要深蓝底 + 暖琥珀色点缀 + 展示型字体"——Hallmark 会识别到 catalog 主题扛不住，自动切换到 Custom 模式。从零开始构建一套 OKLCH 调色板 + 字体配对，没有模板兜底。但普通需求不会看到这个分支，它只在需求"够特别"时才触发。

**6. 组件级支持，不只是页面**

不是所有需求都是建一个完整页面。有时候你只需要一个按钮、一个输入框、一个卡片、一个弹窗。Hallmark 的组件流程会检测到"这是一个组件请求"，跳过宏观结构选择，直接进入组件设计流——8 种交互状态（default / hover / focus / active / disabled / loading / error / success）全部覆盖，附带一个 8 状态预览文件。

**7. 严格的设计约束，不是审美偏好**

项目的约束规则写得像 lint 配置，不是设计师的碎碎念。举例：

- 禁止在代码块里画伪浏览器 chrome（红绿灯圆点 + 地址栏）
- 标题必须用正常字形，不能斜体（斜体标题是 AI 页面的典型特征之一）
- 所有颜色必须通过命名 token 引用，不允许在代码里写死 OKLCH 值
- 所有输出必须验证 320 / 375 / 414 / 768 px 四个断点，不允许横向滚动
- 所有按钮、导航链接、页脚链接、CTA 都不允许折行显示

**8. 一张安装命令，三平台覆盖**

```
npx skills add nutlope/hallmark
```

一次安装，同时覆盖 Claude Code、Cursor 和 Codex。也可以手动复制文件到各自的 skill 目录。

---

**几个例子看实际输出**

（以下例子来自项目文档的真实测试输出）

**Coffeebox — 精品咖啡订阅页**

Prompt："Build me a landing page for Coffeebox — a small-batch coffee subscription. Roast on Sunday, ship on Monday, drink Tuesday."

Hallmark 选了 Linen 主题（暖纸色 + 罗马衬线体），输出开头是：

> "Coffeebox · est. 2026 · n.º 12. The first roast leaves the drum at 6:14 a.m. Sunday. By Monday morning it's in a paper bag in your post box. By Tuesday the kitchen smells like a café."

没有"Trusted by 1000+ coffee lovers"。没有"Revolutionizing your morning routine"。就是一家小咖啡店该有的说话方式。

**Tide — 独立播客页**

Prompt："Design a landing page for Tide — an indie podcast about long-form interviews with small-studio designers."

Hallmark 选了 Salon 主题（暖奶油纸 + IBM Plex Mono 标题 + Cormorant Garamond 正文），用了 Letter 结构，以"Dear listener"开头，三段正文，一个签收，底部一行收听链接。没有 mockup，没有 demo，没有"Join thousands of listeners"。只有声音。

**Streampipe — CLI 工具页**

Prompt："Build me a landing page for Streampipe — a small, fast, single-binary CLI for parsing log and event streams from stdin."

Hallmark 用了 Terminal 主题（深色底 + 磷光绿 + 全等宽字体），Long Document 结构。页面里嵌入了真实的 `<pre>` 代码块展示 `tail -f access.log | streampipe parse --format nginx --filter 'status >= 500' --out json`，下方是 brew / cargo / curl 三种安装方式、三条工作原理解释、一个六行参数表格。纯 CSS，没脚本。

---

**安装和使用**

```bash
npx skills add nutlope/hallmark
```

重新运行可更新。或者手动复制到对应目录：

- **Claude Code**：`~/.claude/skills/hallmark/`
- **Cursor**：`.cursor/rules/hallmark.mdc`（只复制 SKILL.md 内容，去掉 frontmatter）
- **Codex**：`~/.codex/skills/hallmark/`（个人）或 `.codex/skills/hallmark/`（项目级）

装好之后，在对话中直接说"帮我建一个落地页"就会触发默认设计流。如果需要 audit、redesign 或 study，用动词前缀调用。

---

**一些注意事项**

**Hallmark 不是设计系统，是设计决策系统。** 它不提供现成的组件库或 UI kit，而是接管 AI 生成页面时的设计决策——选什么结构、用什么字体、定什么配色。它让你在 AI 对话里能对"设计质量"有预期，而不是碰运气。

**`study` 功能需要谨慎使用。** 项目明确说了：不从模板市场页面提取 DNA，提取结果只用于用户自己的项目，不做像素级复制。URL 模式下提取 DNA 后，如果要输出 `design.md`，需要用户确认来源是"自己的作品"或"用于自己品牌的公开参考"。

**适合有 AI 编码习惯的开发者。** 如果你已经在用 Claude Code、Cursor 或 Codex 来写前端页面，Hallmark 能明显提升产出质量。如果你还在手动写页面，它暂时不直接适用。

**项目由 Together AI 制作并开源。** 许可证 MIT，可随意使用、fork、发布。

---

**写到最后**

AI 写前端页面这件事，最大的敌人不是"写得丑"，而是"写得都一个样"。LLM 的训练数据让它们天然倾向于"平均化"——取所有落地页的共同特征，输出一个"最安全"的模板。这不是模型能力问题，是统计分布问题。

Hallmark 的解法不是"加更多 prompt 魔法"，而是用一套可编程的设计规则覆盖掉 LLM 的默认决策路径。它不靠想象力，靠规则。57 道 slop 检测闸门不是装饰，是每个输出都要过的硬关卡。

如果你已经受够了让 AI 生成"看起来像 AI 做的"页面，这是一个值得装上的工具。

#AI #前端设计 #ClaudeCode #Cursor #TogetherAI #开源工具 #用户体验 #反AI模板 #设计系统