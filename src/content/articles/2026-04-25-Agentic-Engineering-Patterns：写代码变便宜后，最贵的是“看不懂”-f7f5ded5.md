---
title: "Agentic Engineering Patterns：写代码变便宜后，最贵的是“看不懂”"
created: "2026-04-25"
published: true
---
> 图片资源未同步：未命名图片

# Agentic Engineering Patterns：写代码变便宜后，最贵的是“看不懂”

有些工具一出现，第一反应不是“哇好强”，而是“完了，团队要开始乱写了”。Coding Agent 就是这种。

写代码突然变得很便宜，便宜到让人产生幻觉：好像把需求丢进去，明天就能上线。然后现实会很礼貌地提醒一句：**便宜的是敲键盘，贵的是合并、验证、维护、排错、以及未来某天你自己回来看不懂。**

Simon Willison 把这套“跟 Agent 合作的工程模式”整理成一个 guide，名字挺朴素：Agentic Engineering Patterns。读完最大的收获不是提示词，而是几条很像人生忠告的工程底线。

主链接：<https://simonwillison.net/guides/agentic-engineering-patterns/>

下面把这几页内容摊开，结合开发/测试的日常，聊聊怎么才能不被 agent 带着冲进沟里。

## 写代码变便宜以后，最先崩的是“工程直觉”

过去代码很贵：干净、可测、可维护的几百行，正常人也要一天。于是大家形成了很多围绕“时间很贵”的习惯：先设计、先估算、先权衡。

现在 agent 把“把字打进电脑”的成本打到了地板，甚至能并行开工——一个人同时实现、重构、补测试、写文档。爽是真的爽，但直觉会失效也是真的：原来那些“值不值”的权衡，突然全要重算。

这里最关键的一句其实是：**交付新代码几乎免费，但交付好代码依然昂贵。**

“好代码”贵在哪？不是优雅，是这些事你躲不掉：它得真的能跑；得知道它能跑；得解决对的问题；错误得可预期；得有测试守着；得有文档；还得给未来改动留点余地。

这段看起来像道理，其实是给工程师的护身符：便宜的时候最容易浪费，越便宜越要把“合并门槛”抬高。

对应原文：<https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/>

## 测试不再是可选项：先跑测试，再让它动手

以前不写测试的借口很统一：太慢、太贵、改得太快。现在这些借口基本失效，因为 agent 修测试、补测试真的很快。

更现实的是：AI 产出的代码如果没跑过，就是“薛定谔的可用”。上线能不能跑，靠运气。测试至少把运气这件事往下压。

一个很实用的小动作：每次新开会话，让它先跑测试。比如 Python 项目，直接丢一句 `Run "uv run pytest"`。这句话看似普通，但它强迫 agent 先面对现实：现状是什么、哪里红了、哪里绿了。

再往前一步，就是红/绿 TDD：先写会失败的测试（红），再写实现让它通过（绿）。好处很土，但很稳：它让 agent 沿着证据链走，不容易写出一堆自嗨但没用的代码。

对应原文：<https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests/>、<https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/>

## 认知债：比技术债更阴毒的那种

用 agent 写代码最容易出现一种债：代码能跑，但人不懂。短期没事，长期要命。

当核心逻辑变成黑盒，规划新需求会越来越虚；修 bug 会越来越靠猜；最后团队速度像被砂纸磨一样慢下来。

这里给的解法挺聪明：用“交互式解释”还债。别光让 agent 写代码，让它顺手做个可以点、可以调参、可以可视化的小工具，把机制讲明白。

另一个好用招是“线性 walkthrough”：让它从入口一路讲到核心路径，像带新人 onboarding 一样。vibe coding 最怕的就是自己都不知道自己写了啥，这个时候 walkthrough 相当于把方向盘抢回来。

对应原文：<https://simonwillison.net/guides/agentic-engineering-patterns/interactive-explanations/>、<https://simonwillison.net/guides/agentic-engineering-patterns/linear-walkthroughs/>

## “会怎么做”的解法库：囤着，别客气

工程师真正的资产不是背了多少 API，而是知道“什么能做、怎么做大概率能成”。

这种知识很碎：OCR 能不能纯前端搞？iPhone app 不在前台能不能配蓝牙？100GB JSON 怎么处理不爆内存？

把这些东西囤成一个解法库（repo、TIL、笔记）会越来越值钱。因为 agent 时代你更像一个带队的：你手里有现成套路，agent 写起来更快；你手里没套路，它就更容易带你乱跑。

对应原文：<https://simonwillison.net/guides/agentic-engineering-patterns/hoard-things-you-know-how-to-do/>

## Prompts 这件事：别当秘籍，当“团队第一条规矩”

prompts 当然重要，但它更像“团队规范的文字化”，而不是玄学。

比如作者在 Artifacts/Canvas 里很讨厌 React（因为要 build，不好复制出来静态托管），所以直接把规则写死：别用 React，用原生 HTML/JS/CSS。你看，这不是技巧，这是产品需求。

更关键的是把“第一条指令”固化：先跑测试、再总结失败、再提最小改动方案。这种 prompt 放到团队里，就是 DoD（Definition of Done）的一部分。

对应原文：<https://simonwillison.net/guides/agentic-engineering-patterns/prompts/>

- -----

## 这套 patterns 看完，会更相信几件事。

第一，agent 让“写”变便宜，但它会让“乱写”变得更容易。越是便宜的东西，越要靠门槛来保护团队——测试门禁、评审门禁、回滚门禁。不是为了折磨人，是为了让人能睡觉。

第二，工具再强，也不替人背锅。上线出事不会怪模型，只会怪你。把证据链（测试、日志、复现步骤）当成职业道德，不然迟早把自己熬成“全靠感觉的老江湖”，然后某天一脚踩空。

第三，别欠认知债。技术债还能重构，认知债会让人失去判断力。代码看不懂的时候，不要硬扛着继续加功能，先让它解释、先做 walkthrough、先做个交互 demo，把脑子补回来。

- --

# AI #AgenticEngineering #ClaudeCode #Codex #测试