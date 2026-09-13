---
title: "Alan-Workspace LLM Wiki 改造优化方案"
created: "2026-04-13"
published: true
---

# Alan-Workspace LLM Wiki 改造优化方案

## 一句话总结
保留当前 Alan-Workspace 的轻量底座，**借鉴 Obsidian-Brain-OS 的分层知识架构、多 Agent 边界、夜间 Pipeline、巡检 Lint**，做“小步快跑、可落地、不重构”的优化。

---

## 当前 Alan-Workspace 现状（保持的好东西）
- ✅ `70-RAW/`：只读原始资料（不碰，这是对的）
- ✅ `80-Tools/automations/`：轻量自动化脚本（保留并扩展）
- ✅ `AGENTS.md` / `SOUL.md` / `USER.md` / `MEMORY.md`：配置层（保留并细化）
- ✅ 一键脚本集合（保留并扩展）

---

## Obsidian-Brain-OS 的 8 个可借鉴亮点

| 亮点                       | Obsidian-Brain-OS 做法                           | 我们当前的做法                                | 改造建议                                               |
| ------------------------ | ---------------------------------------------- | -------------------------------------- | -------------------------------------------------- |
| 1. 三层知识架构                | `03-KNOWLEDGE/01-READING/02-WORKING/99-SYSTEM` | `71-Wiki/` 一层                          | 扩展 `71-Wiki/` 为三层                                  |
| 2. 多 Agent 边界            | 主 Agent / Writer / Chronicle / Review          | 单 Agent（莫菲）                            | 先做“Writer Agent”的单一写入入口，避免并发冲突                     |
| 3. 夜间 Pipeline           | 文章整合 / 对话挖掘 / 知识放大                             | 无（只有 Inbox 规范化）                        | 增加轻量“夜间知识整合”脚本                                     |
| 4. Knowledge Lint + 巡检报告 | `knowledge-lint.sh` + 定期审计                     | 只有 `wiki_weekly_lint.py`（孤岛页）          | 扩展 Lint，检查格式、断链、脏文件                                |
| 5. 明确的写入规范               | 只有 Writer 能写知识库                                | 谁都能写（包括当前的 inbox_auto_normalize.py 也写） | 先把 `inbox_auto_normalize.py` 改成“请求 Writer 写入”，单一入口 |
| 6. 项目管理轻量索引层             | `05-PROJECTS/`（轻量索引，不替代 GitHub）                | 无                                      | 新增 `06-Projects/` 轻量索引层                            |
| 7. 个人文档 / 工作上下文分离        | `06-PERSONAL-DOCS/` / `07-WORK-CONTEXT/`       | `04-Memory/` 混在一起                      | 拆分 `04-Memory/` 为个人与工作                             |
| 8. Daily Brief / 每日驾驶舱   | 自动生成 morning brief                             | 无                                      | 新增轻量每日驾驶舱脚本                                        |

---

## 分阶段改造计划（小步快跑，可落地）

### Stage 1（本周）：单一写入入口 + 三层知识架构
- [ ] 新增 `71-Wiki/01-READING/`（实际阅读层，放精炼后的知识）
- [ ] 新增 `71-Wiki/02-WORKING/`（AI 工作间，放原始输入、草稿、候选内容）
- [ ] 新增 `71-Wiki/99-SYSTEM/`（Pipeline 内部，自动生成的索引、报告）
- [ ] 把当前 `71-Wiki/concepts/` / `71-Wiki/insights/` / `71-Wiki/entities/` 移动到 `71-Wiki/01-READING/`
- [ ] 把 `inbox_auto_normalize.py` 改成“先写 `71-Wiki/02-WORKING/`，再请求 Writer 整理到 `01-READING/`”

### Stage 2（下两周）：扩展 Lint + 巡检报告
- [ ] 扩展 `wiki_weekly_lint.py`，检查：
  - 格式违规（frontmatter 缺失/不规范）
  - 断链（链接 指向不存在的文件）
  - 脏文件（临时文件、未命名文件）
- [ ] 新增 `09-Reports/` 目录，存放 Lint 报告、巡检报告
- [ ] 新增 `wiki_lint.sh` 一键脚本

### Stage 3（下一个月）：轻量夜间知识整合
- [ ] 新增 `80-Tools/automations/nightly_integration.py`，做轻量知识整合（关键词聚合、交叉引用）
- [ ] 新增 `80-Tools/automations/run-nightly.sh` 一键脚本
- [ ] 不强制定时，手动跑即可

### Stage 4（可选）：Daily Brief 每日驾驶舱
- [ ] 新增 `80-Tools/automations/daily_brief.py`，轻量生成每日驾驶舱（待办 + 今日知识 + 提醒）
- [ ] 新增 `80-Tools/automations/run-daily-brief.sh` 一键脚本

---

## 当前阶段优先级（先做哪 3 件事？）
1. **新增 `71-Wiki/` 三层目录**（最小改动，立即见效）
2. **扩展 `wiki_weekly_lint.py`**（检查断链、格式违规）
3. **新增 `06-Projects/` 轻量索引层**（项目管理清晰化）

---

## 保持不变的东西（别乱改）
- ❌ 不重构当前的 `00-Inbox/` / `01-Articles/` / `02-Notes/`
- ❌ 不引入复杂的多 Agent 团队（先做单一写入入口）
- ❌ 不引入定时任务（继续手动一键脚本）
- ❌ 不碰 `70-RAW/`（只读原始资料，保持现状）

---

## References
- Obsidian-Brain-OS 总览
- LLM Wiki
