---
title: "Codex /goal 模板库（可复制）"
created: "2026-05-23"
tags: ["KnowledgeBase","Codex","OpenAI","Agent","Workflow","Template"]
category: "Notes"
published: true
---

## 通用骨架（推荐）

`/goal <desired end state> verified by <specific evidence> while preserving <constraints>. Use <allowed inputs, tools, or boundaries>. Between iterations, <how to choose next action + what to record>. If blocked or no valid paths remain, <what to report + what input would unblock>.`

## 性能（Perf）

- `/goal Reduce p95 latency below <X> ms, verified by <benchmark command + saved output>, while keeping <test command> green. Use only <service/modules> and related benchmarks/tests. Between iterations, record the change, benchmark results, and next experiment. If benchmark cannot run, stop with blocker + required env/data.`

## Flaky Test（稳定性）

- `/goal Fix the flaky test <test-id>, verified by (1) reproducing the flake at least 3 times, (2) applying a minimal change, and (3) running <test-id> for 10 consecutive passes on the same environment, while keeping <full suite command> green. Constraints: do not skip/relax the test; do not add sleeps unless justified; do not change public behavior. Boundaries: only touch test + directly related fixtures/helpers. Between iterations, record repro command, failure signature, hypothesis, change, evidence. If CI-only flake and cannot reproduce locally, stop with CI logs requested + proposed instrumentation plan.`

## Debug / Bugfix（功能缺陷）

- `/goal Make <bug> no longer reproducible, verified by <repro steps or test case> passing and <regression test> added, while keeping all existing tests green. Boundaries: limit changes to <modules/files>. Between iterations, log hypothesis → experiment → evidence. If blocked by missing access/data, stop with exact missing input list.`

## 迁移 / 重构（Migration / Refactor）

- `/goal Complete <migration/refactor>, verified by <build command> + <test command> passing and no API behavior change (validated by <e2e/snapshot/contract tests>). Constraints: no new dependencies without approval. Boundaries: only edit <list of directories>. Between iterations, keep a checklist of completed steps and remaining risks. If blocked, stop with smallest rollback/alternative plan.`

## 研究 / 审计（Research / Evidence-backed）

- `/goal Produce an evidence-backed report on <topic>, using only <allowed sources/materials>. Attempt the headline claims where feasible, verify outputs where possible, and end with a report that separates confirmed findings, proxy evidence, blocked claims, and remaining uncertainty. Between iterations, maintain a claim inventory mapped to evidence. If blocked, stop with what is missing and why it matters.`

## 文档 / 产物（Docs / Artifact）

- `/goal Produce <doc/artifact>, verified by <build/render command> and a checklist of requirements (<items>), while ensuring all referenced commands match current CLI behavior. Boundaries: only edit <doc paths>. If blocked, stop with broken links/commands and proposed fixes.`

## 使用建议（最小化落地）

- Verification surface 要写成“可执行命令 + 可保存输出”的形式（例如 `pytest -q`、`pnpm test`、`./bench.sh`）。
- Blocked stop condition 里要写“最小额外输入”，避免卡住后反复来回问。

