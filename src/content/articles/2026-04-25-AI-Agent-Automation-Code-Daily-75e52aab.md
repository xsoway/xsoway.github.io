---
title: "AI-Agent-Automation-Code-Daily"
created: "2026-04-25"
published: true
---
| 模式                | 一句话                                  | 调用方式                                     | Session        | 方向             | 同步/异步      |
| :------------------ | :-------------------------------------- | :------------------------------------------- | :------------- | :--------------- | :------------- |
| Multi-Agent Routing | 多个独立 agent，消息自动路由            | bindings 配置                                | 复用已有       | 单向（入站路由） | N/A            |
| Agent-to-Agent      | agent 之间互相对话                      | `sessions_send`                              | 复用已有       | 双向（最多5轮）  | 同步（可超时） |
| Sub-Agent           | 派活给子代理，跑完回报                  | `sessions_spawn`/ `/subagents spawn`         | 新建隔离       | 单向派活 + 回报  | 异步           |
| ACP Session         | 调用外部编码工具（Codex/Claude Code等） | `sessions_spawn runtime:"acp"`/ `/acp spawn` | 新建或恢复     | 线程内双向       | 异步           |
| Delegate            | 组织级代理，以自己身份代表人类行事      | 多 agent 配置 + 身份提供商                   | 同 Multi-Agent | 通过频道         | N/A            |

| 模式                | 一句话                                  | 调用方式                                     | 接入              |
| :------------------ | :-------------------------------------- | :------------------------------------------- | :---------------- |
| Multi-Agent Routing | 多个独立 agent，消息自动路由            | bindings 配置                                | main/writer/coder |
| Agent-to-Agent      | agent 之间互相对话                      | `sessions_send`                              |                   |
| Sub-Agent           | 派活给子代理，跑完回报                  | `sessions_spawn`/ `/subagents spawn`         | Main->子agents    |
| ACP Session         | 调用外部编码工具（Codex/Claude Code等） | `sessions_spawn runtime:"acp"`/ `/acp spawn` | Codex             |
| Delegate            | 组织级代理，以自己身份代表人类行事      | 多 agent 配置 + 身份提供商                   | Trae              |

```mermaid
flowchart TD
    A[用户需求或变更想法] --> B[根目录 AGENTS.md 全局总纲]
    B --> C{是否需要先形成变更规格}

    C -- 是 --> D[OpenSpec 规格层]
    D --> D1[opsx explore 需求探索]
    D1 --> D2[opsx propose 产出 proposal design specs tasks]
    D2 --> E[oh my opencode 编排层]

    C -- 否 --> E

    E --> E1[并行搜索与任务编排]
    E1 --> F[superpowers 技能纪律层]
    F --> F1[加载技能并执行流程约束]
    F1 --> E2[实现与验证循环]

    E2 --> G{任务是否完成}
    G -- 否 --> E1
    G -- 是 --> H[opsx archive 归档变更并合并规范]

    H --> I[交付说明与复盘]
    I --> J[记忆沉淀到 daily 与 topics]

    K[src 项目 AGENTS.md 局部规则] --> D
    K --> E
    K --> F
```

```mermaid
flowchart LR
MAIN[main]:::agent
VAULT[Vault]:::kb
M0[M0 会话记忆]:::mem

subgraph SA[Sub-Agent 分流（使用视角）]
D{任务类型?}:::sys

D -->|一句话/小改动/立即答| P0[直接 MAIN 当场处理]:::agent

D -->|重工程/要跑代码/要大量文件探索| P1[交给 CODE（主线 agent）]:::agent
D -->|要写成文档/总结/可发布稿| P2[交给 WRITER（主线 agent）]:::agent
D -->|批处理/定时任务/巡检类| P3[交给 LIGHT（主线 agent）]:::agent

D -->|并行拆解/多步骤长任务/不想污染主上下文| S0[spawn sub-agent（隔离执行）]:::agent
S0 --> S1[子任务产出：结论/patch/文件清单]:::agent
S1 --> S2[回传 MAIN 汇总 + 决策]:::agent

D -->|需要“代码代理线程式协作”| A0[ACP harness thread（Codex/Claude Code 等）]:::agent
A0 --> S2
end

MAIN --> D
S2 --> MAIN
S1 --> VAULT
S0 -.短期会话记录.-> M0

classDef agent fill:#ecfeff,stroke:#06b6d4,color:#0f172a
classDef kb fill:#fff7ed,stroke:#f97316,color:#0f172a
classDef mem fill:#eef2ff,stroke:#6366f1,color:#0f172a
classDef sys fill:#f8fafc,stroke:#64748b,color:#0f172a

```

1.

```mermaid
graph LR
    %% ================= 样式 =================
    classDef root fill:#f9f9f9,stroke:#333,stroke-width:2px,color:#333;
    classDef spec fill:#e1f5fe,stroke:#0277bd,stroke-width:2px,color:#01579b;
    classDef engine fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20;
    classDef power fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,color:#f57f17;
    classDef left fill:#ede7f6,stroke:#5e35b1,stroke-width:2px,color:#311b92;
    classDef right fill:#fbe9e7,stroke:#d84315,stroke-width:2px,color:#bf360c;

    %% ================= 左侧：入口 =================
    OpenCode[("🧠 opencode<br/>统一执行入口<br/>CLI / Agent Runtime / 调度触发器")]:::left

    %% ================= 中间：核心四层 =================
    Root[("📂 根目录配置<br/>(AGENTS.md / SOUL.md / USER.md)<br/>定义全局规则 / 边界 / 记忆 / 输出格式")]:::root
    
    OpenSpec[("📝 OpenSpec<br/>(proposal/specs/design/tasks)<br/>任务定义 + 验收标准")]:::spec
    
    OhMy[("⚙️ oh-my-opencode<br/>Agent 调度 / 并行搜索 / 任务编排 / 验证闭环")]:::engine
    
    Superpowers[("🚀 superpowers<br/>技能系统 / 工作流 discipline / 最佳实践")]:::power

    %% ================= 右侧：解释层 =================
    R1[("📖 系统约束层<br/>定义 AI 应该怎么思考、怎么输出<br/>约束行为边界 & 长期记忆")]:::right

    R2[("📖 任务建模层<br/>把模糊需求转成结构化任务<br/>明确目标、步骤、验收标准")]:::right

    R3[("📖 执行引擎层<br/>负责拆解任务、调度 agent<br/>调用工具并保证结果可验证")]:::right

    R4[("📖 能力增强层<br/>注入固定技能（如写代码、分析、设计）<br/>保证执行质量和一致性")]:::right

    %% ================= 主流程 =================
    OpenCode --> Root
    Root --> OpenSpec
    OpenSpec --> OhMy
    OhMy --> Superpowers

    %% ================= 解释映射 =================
    Root --> R1
    OpenSpec --> R2
    OhMy --> R3
    Superpowers --> R4
```

```mermaid
flowchart LR
    %% ===================== 样式 =====================
    classDef entry fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#581c87;
    classDef core1 fill:#f8fafc,stroke:#475569,stroke-width:2px,color:#334155;
    classDef core2 fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#075985;
    classDef core3 fill:#ecfdf5,stroke:#16a34a,stroke-width:2px,color:#166534;
    classDef core4 fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef note fill:#fff7ed,stroke:#f97316,stroke-width:1.8px,color:#9a3412;

    %% ===================== 左侧入口 =====================
    subgraph A["入口层"]
        direction TB
        O["🧠 opencode<br/>统一入口 / Runtime / 执行触发器"]:::entry
    end

    %% ===================== 中间核心 =====================
    subgraph B["中间四层核心体系"]
        direction TB
        B1["📂 根目录配置<br/>AGENTS.md / SOUL.md / USER.md"]:::core1
        B2["📝 OpenSpec<br/>proposal / specs / design / tasks"]:::core2
        B3["⚙️ oh-my-opencode<br/>调度 / 搜索 / 编排 / 验证"]:::core3
        B4["🚀 superpowers<br/>技能 / discipline / best practice"]:::core4
    end

    %% ===================== 右侧说明 =====================
    subgraph C["作用说明"]
        direction TB
        C1["定义全局规则、角色边界、
        记忆方式、交付格式"]:::note
        C2["定义这次要做什么、
        怎么做、做到什么算完成"]:::note
        C3["负责真正组织 agent 
        与工具把任务高效执行完"]:::note
        C4["在执行时注入固定能力
        与方法论，避免结果失控"]:::note
    end

    %% ===================== 连接 =====================
    O --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4

    B1 --> C1
    B2 --> C2
    B3 --> C3
    B4 --> C4
```

```mermaid
flowchart LR
    %% ===================== 样式定义 =====================
    classDef entry fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#4c1d95;
    classDef root fill:#f8fafc,stroke:#475569,stroke-width:2px,color:#334155;
    classDef spec fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#075985;
    classDef engine fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20;
    classDef power fill:#fff8e1,stroke:#f59e0b,stroke-width:2px,color:#92400e;
    classDef desc fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#9a3412;
    classDef invisible fill:transparent,stroke:transparent,color:transparent;

    %% ===================== 左侧：入口 =====================
    subgraph L[" "]
        direction TB
        OC["🧠 opencode<br/>统一运行入口<br/>CLI / Runtime / 调度触发"]:::entry
    end

    %% ===================== 中间：核心四层 =====================
    subgraph C["核心架构"]
        direction TB
        Root["📂 根目录配置<br/>AGENTS.md / 
        SOUL.md /
        USER.md<br/>
        全局规则、边界、记忆、
        交付规范"]:::root
        OpenSpec["📝 OpenSpec<br/>proposal / 
        specs / design / 
        tasks<br/>
        把需求变成可执行任务
        与验收标准"]:::spec
        OhMy["⚙️ oh-my-opencode<br/>Agent 调度、
        并行搜索、任务编排、
        验证闭环"]:::engine
        Superpowers["🚀 superpowers<br/>技能系统、
        流程约束、
        最佳实践注入"]:::power
    end

    %% ===================== 右侧：说明 =====================
    subgraph R["中文说明"]
        direction TB
        D1["系统约束层<br/>规定 AI 怎么思考、
        怎么输出<br/>
        统一行为边界与长期规则"]:::desc
        D2["任务建模层<br/>把模糊需求转成 proposal / 
        spec / task<br/>
        明确目标、
        步骤、验收标准"]:::desc
        D3["执行引擎层<br/>负责拆解任务、
        调度 agent、调用工具<br/>
        并对结果做验证与闭环"]:::desc
        D4["能力增强层<br/>沉淀通用技能与
        固定工作方法<br/>
        确保执行质量、
        一致性与复用性"]:::desc
    end

    %% ===================== 主链路 =====================
    OC --> Root
    Root --> OpenSpec
    OpenSpec --> OhMy
    OhMy --> Superpowers

    %% ===================== 映射关系 =====================
    Root --> D1
    OpenSpec --> D2
    OhMy --> D3
    Superpowers --> D4
```

我帮你把刚才那张图，整理成一个**结构清晰、适合文档/汇报的 Markdown 表格**👇

- -----

## **🧠 opencode 架构总览（表格版）**

| **层级**   | **模块**                                      | **核心定位**     | **主要职责**                                                 | **输入**              | **输出**                  |
| ---------- | --------------------------------------------- | ---------------- | ------------------------------------------------------------ | --------------------- | ------------------------- |
| 入口层     | 🧠 opencode                                    | 统一执行入口     | 提供 CLI / Runtime / Agent 触发入口，启动整个系统流程        | 用户请求 / 指令       | 触发完整执行链路          |
| 系统约束层 | 📂 根目录配置(AGENTS.md / SOUL.md / USER.md)   | 全局规则中心     | 定义 AI 行为边界、角色设定、记忆机制、输出格式规范           | 用户请求 + 系统上下文 | 规范化后的执行环境        |
| 任务建模层 | 📝 OpenSpec(proposal / specs / design / tasks) | 任务结构化       | 将模糊需求拆解为清晰的任务结构，定义目标、步骤与验收标准     | 原始需求              | 结构化任务（spec + task） |
| 执行引擎层 | ⚙️ oh-my-opencode                              | Agent 调度系统   | 负责任务拆解、agent 调度、工具调用、并行搜索、结果验证闭环   | 结构化任务            | 执行结果 + 验证结果       |
| 能力增强层 | 🚀 superpowers                                 | 技能与方法论系统 | 注入通用技能（写代码、分析、设计等）与固定工作流，保证质量与一致性 | 执行任务              | 高质量、稳定的输出结果    |

- -----

## **🔄 一句话理解整套体系**

| **层**         | **本质**           |
| -------------- | ------------------ |
| opencode       | 从这里启动一切     |
| Root           | 限制 AI 怎么“做人” |
| OpenSpec       | 定义这次“要做什么” |
| oh-my-opencode | 负责“把事做完”     |
| superpowers    | 决定“做得好不好”   |

- -----

## **🧩 流程视角（很适合讲给别人）**

```
用户请求
   ↓
opencode（入口触发）
   ↓
Root（加载规则 & 记忆）
   ↓
OpenSpec（把需求变成任务）
   ↓
oh-my-opencode（调度执行）
   ↓
superpowers（提升质量）
   ↓
最终结果（可验证）
```

- -----

如果你下一步想升级，我可以帮你做一个：

👉 **「对标 OpenAI / Devin / Cursor 的完整版架构表（带 memory / tool / feedback loop）」**

那一版会更像真正的 AI Agent 系统设计文档。