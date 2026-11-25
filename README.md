# 你的专属 AI 助手 · LobeHub 定制版

> 基于 [LobeHub](https://github.com/lobehub/lobehub)（MIT）二次定制的自托管 AI 工作台：深紫色主题、自定义顶栏标语、内置快速开始引导。
> A self-hosted AI workbench forked from [LobeHub](https://github.com/lobehub/lobehub) (MIT): deep-purple theme, custom hero slogan, built-in quick-start guide.

[中文](#中文) · [English](#english)

---

## 中文

### 项目介绍

本项目是 LobeHub 的深度定制分支，面向「个人 / 小团队自建 AI 助手」场景：所有对话、知识库、配置都保存在你自己的数据库里，不依赖任何云服务。

技术栈：

| 层次 | 选型 |
| --- | --- |
| 框架 | Next.js 16（App Router + Turbopack）+ React 19 |
| 前端 | React Router SPA + Vite 8（开发期独立热更新） |
| 接口 | tRPC（端到端类型安全） |
| 数据 | PostgreSQL 17 + Drizzle ORM |
| 缓存 / 队列 | Redis（可选） |
| 对象存储 | S3 兼容（RustFS / MinIO，可选） |
| 搜索 | SearXNG（可选）、全文检索 pg_like / pg_search / Elasticsearch |

相比上游，本分支做了三处定制：

1. **深紫色主题**：整站（页面底色、卡片、面板、弹层、分割线）统一为深紫配色，并锁定深色模式，保证浅色文字的可读性。
2. **顶栏标语**：首页问候语替换为「你的专属AI助手」，不再随时间段变化。
3. **快速开始卡片**：首页聊天输入框上方新增三步引导（选择 AI 模型 → 输入问题 → 获取回答）。

### 功能列表

**核心能力**

- 多模型接入：OpenAI、Anthropic、Google、DeepSeek、OpenRouter、Ollama 等，支持自定义 OpenAI 兼容端点
- Agent（助手）体系：每个助手可单独配置模型、提示词、工具与记忆
- 任务与目标：长任务拆解、后台执行、进度与产出归档
- 知识库：上传文档建立索引，对话时检索引用
- 工具 / 插件市场：网页搜索、代码执行、图像生成、文档处理、MCP 服务等
- 记忆：跨会话的用户画像与偏好沉淀
- 文件与画布：PDF / Office 预览、图像理解、画布式内容编排
- 团队与工作区：多成员共享助手与资源（可只做单用户）
- 多语言：中 / 英 / 日 / 韩 / 德 / 法 等 18 种界面语言
- 端：Web（桌面 / 移动自适应）、Electron 桌面端

**本分支特有**

- 深紫色主题（StyleX + CSS 变量，仅在深色模式下生效）
- 顶栏标语「你的专属AI助手」
- 快速开始引导卡片（三步式，响应式三列 / 窄屏堆叠）

### 安装步骤

**1. 环境要求**

| 软件 | 版本 | 说明 |
| --- | --- | --- |
| Node.js | 20.9+（推荐 22 / 24 LTS） | 仓库 `.nvmrc` 为 `lts/krypton` |
| pnpm | 12.x | 包管理器 |
| Bun | 1.2+ | 仅作为 npm scripts 的 runner，必需 |
| PostgreSQL | 15+（推荐 17） | 唯一必需的外部服务 |
| Redis | 7+（可选） | 不装会自动降级为数据库会话 |
| Docker | 可选 | 用官方 compose 一键拉起 PG / Redis / 对象存储 / SearXNG |

**2. 获取代码**

```bash
git clone https://github.com/zsdf666/lobehub.git
cd lobehub
git checkout canary
```

**3. 安装依赖**

```bash
pnpm i
```

> 国内网络建议使用镜像源。若镜像尚未同步 `request-filtering-agent@3.3.1`，需在 `pnpm-workspace.yaml` 的 `overrides` 中临时锁定 `3.3.0`。

**4. 配置环境变量**

```bash
cp .env.example.development .env
```

至少修改以下几项：

```dotenv
APP_URL=http://localhost:3010
DATABASE_URL=postgresql://postgres@127.0.0.1:5432/lobechat
DATABASE_DRIVER=node
KEY_VAULTS_SECRET=<32 字节随机串>
AUTH_SECRET=<32 字节随机串>
FTS_SEARCH_PROVIDER=pg_like      # 未安装 ParadeDB 时用它
# DISABLE_REDIS=1                # 没有 Redis 时打开，否则登录会 500
```

**5. 建库并迁移**

```bash
createdb lobechat                # 或用任意 PG 客户端建库
pnpm db:migrate                  # 输出 ✅ database migration pass.
```

**6. 启动开发服务器**

```bash
bun run dev
```

- 应用：<http://localhost:3010>
- SPA 热更新服务：9876（由 Next 自动代理，不要单独访问）

**7. 生产部署**

```bash
bun run build
bun run start                    # http://localhost:3210
```

Docker 一键部署（Linux / macOS，Windows 需 WSL 2）：

```bash
mkdir lobehub && cd lobehub
bash <(curl -fsSL https://lobe.li/setup.sh) -l zh_CN
docker compose up -d             # http://localhost:3210
```

### 使用说明书

**① 注册 / 登录**

首次访问会被引导到 `/signin`，点「注册」用邮箱 + 密码创建账号即可。本地部署不会发送验证邮件，邮箱仅作为登录标识，不要求真实可用。

> 未配置 SMTP 时「忘记密码」不会真的发出重置邮件，请直接重新注册或由管理员在数据库中重置。

**② 配置模型**

进入「设置 → AI 服务商」，填入至少一个 API Key（如 `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`），也可以在 `.env` 中配置。没有 Key 时界面可用，但无法真正对话。

**③ 按快速开始卡片走三步**

1. **选择 AI 模型**：输入框左下角的下拉框里挑一个已配置的模型；
2. **输入问题**：一句话描述需求，支持粘贴图片与附件；
3. **获取回答**：回车发送，回答过程可实时查看，可随时中断或继续追问。

**④ 管理助手与话题**

- 左侧栏「助手」可新建、切换、置顶助手；
- 每个助手下有独立的话题列表，话题可搜索、分组、转发给其他助手；
- 右上「设置」可调整主题（本分支已锁定深色）、字号密度、语言、快捷键。

**⑤ 进阶功能**

- 知识库：上传文档 → 建索引 → 对话中自动引用；
- 工具 / MCP：为助手开启联网搜索、代码执行、数据库查询等能力；
- 任务：把多步骤工作交给后台执行，结果回到收件箱。

**⑥ 日常运维**

```bash
# 停止开发服务：终端 Ctrl+C
# 停止数据库（本机嵌入式 PG 示例）
pg_ctl -D /path/to/data stop -m fast

# 重新迁移
pnpm db:migrate

# 彻底重装依赖
bun run clean:node_modules && pnpm i
```

### 常见问题

| 现象 | 原因 / 处理 |
| --- | --- |
| 打开首页 500，日志 `Better Auth: Connection is closed` | `.env` 配了 `REDIS_URL` 但 Redis 没起。加 `DISABLE_REDIS=1` 或启动 Redis |
| 首页 500 `fetch failed ECONNREFUSED` | Vite 还没编译完（首启 30–60 s），等终端出现 `VITE ready` 再刷新 |
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL 未启动 |
| `pnpm i` 报 `ERR_PNPM_NO_MATCHING_VERSION` | 镜像滞后，临时切官方源或加 override |
| 页面样式没变化 | 浏览器缓存，`Ctrl+Shift+R` 强刷 |
| 界面卡顿 | 开发模式不打包前端，属正常；用 `bun run build && bun run start` 体验生产性能 |

### 许可证

沿用上游 [MIT License](./LICENSE)。LobeHub 版权归原作者所有，本仓库仅包含定制部分。
欢迎学习与自用；对外分发请保留原始版权声明。

---

## English

### Introduction

This repository is a customized fork of LobeHub, aimed at **self-hosted personal / small-team AI workspaces**: every conversation, knowledge base and setting lives in your own database, with no cloud dependency.

Stack:

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router + Turbopack) + React 19 |
| Frontend | React Router SPA served by Vite 8 during development |
| API | tRPC (end-to-end type safety) |
| Data | PostgreSQL 17 + Drizzle ORM |
| Cache / queue | Redis (optional) |
| Object storage | S3-compatible, e.g. RustFS / MinIO (optional) |
| Search | SearXNG (optional); full-text via pg_like, pg_search or Elasticsearch |

Three customizations on top of upstream:

1. **Deep-purple theme** — page background, cards, panels, popovers and dividers are re-tinted to a deep purple palette, with the dark theme pinned so light text stays readable.
2. **Hero slogan** — the home greeting is replaced by "Your personal AI assistant" and no longer changes with time of day.
3. **Quick-start card** — a three-step guide (pick a model → ask your question → get the answer) above the composer on the home page.

### Features

**Core**

- Multi-provider LLMs: OpenAI, Anthropic, Google, DeepSeek, OpenRouter, Ollama and any OpenAI-compatible endpoint
- Agents: per-agent model, system prompt, tools and memory
- Tasks & goals: long-running work decomposed, executed in the background, archived with artefacts
- Knowledge base: upload documents, index them, cite them in conversations
- Tools / marketplace: web search, code execution, image generation, document processing, MCP servers
- Memory: cross-session user profile and preferences
- Files & canvas: PDF/Office preview, vision, canvas-style content composition
- Teams & workspaces: share agents and resources across members (single-user works too)
- 18 UI locales (zh-CN, en-US, ja-JP, ko-KR, de-DE, fr-FR, …)
- Web (responsive) and Electron desktop app

**Fork-specific**

- Deep-purple theme built on StyleX + CSS variables (dark mode only)
- Custom hero slogan
- Responsive quick-start guide card (three columns, stacks on narrow screens)

### Installation

**1. Prerequisites**

| Software | Version | Notes |
| --- | --- | --- |
| Node.js | 20.9+ (22 / 24 LTS recommended) | repo `.nvmrc` is `lts/krypton` |
| pnpm | 12.x | package manager |
| Bun | 1.2+ | required, used as the npm-scripts runner |
| PostgreSQL | 15+ (17 recommended) | the only hard external dependency |
| Redis | 7+ (optional) | without it sessions fall back to the database |
| Docker | optional | official compose for PG / Redis / object storage / SearXNG |

**2. Clone**

```bash
git clone https://github.com/zsdf666/lobehub.git
cd lobehub
git checkout canary
```

**3. Install dependencies**

```bash
pnpm i
```

**4. Configure environment**

```bash
cp .env.example.development .env
```

```dotenv
APP_URL=http://localhost:3010
DATABASE_URL=postgresql://postgres@127.0.0.1:5432/lobechat
DATABASE_DRIVER=node
KEY_VAULTS_SECRET=<32-byte random string>
AUTH_SECRET=<32-byte random string>
FTS_SEARCH_PROVIDER=pg_like
# DISABLE_REDIS=1     # enable when no Redis is running, otherwise sign-in returns 500
```

**5. Create the database and migrate**

```bash
createdb lobechat
pnpm db:migrate       # expects: ✅ database migration pass.
```

**6. Run the dev server**

```bash
bun run dev
```

- App: <http://localhost:3010>
- Vite (HMR) runs on 9876 and is proxied by Next — do not open it directly

**7. Production**

```bash
bun run build
bun run start          # http://localhost:3210
```

Docker (Linux / macOS; Windows via WSL 2):

```bash
mkdir lobehub && cd lobehub
bash <(curl -fsSL https://lobe.li/setup.sh) -l en_US
docker compose up -d   # http://localhost:3210
```

### Usage

**1. Sign up / sign in**

You will be redirected to `/signin`. Register with any email and password — no verification mail is sent on a local deployment, so the address only serves as a login identifier.

**2. Configure a model provider**

Open *Settings → AI Providers* and add at least one API key, or set it in `.env`. The UI works without a key, but chatting does not.

**3. Follow the quick-start card**

1. **Pick an AI model** — choose a configured model in the selector at the bottom-left of the composer;
2. **Ask your question** — one sentence is enough; images and attachments are supported;
3. **Get the answer** — press Enter, watch the streamed reply, stop or follow up at any time.

**4. Manage agents and topics**

- The sidebar lists agents; create, switch and pin them;
- Each agent keeps its own topic list — search, group or forward topics to another agent;
- *Settings* exposes theme (pinned to dark here), density, language and shortcuts.

**5. Advanced**

- Knowledge base: upload → index → the agent cites it automatically;
- Tools / MCP: enable web search, code execution, database access per agent;
- Tasks: hand multi-step work to the background and collect results in the inbox.

**6. Maintenance**

```bash
# stop dev server: Ctrl+C in its terminal
pnpm db:migrate                        # re-run migrations
bun run clean:node_modules && pnpm i   # full dependency reset
```

### Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Home returns 500, log shows `Better Auth: Connection is closed` | `REDIS_URL` is set but Redis is down → set `DISABLE_REDIS=1` or start Redis |
| 500 with `fetch failed ECONNREFUSED` | Vite is still compiling (30–60 s on first boot); wait for `VITE ready` |
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL is not running |
| `ERR_PNPM_NO_MATCHING_VERSION` on install | stale mirror; switch registry or add an `overrides` entry |
| Style changes not visible | browser cache — hard reload with `Ctrl+Shift+R` |
| UI feels sluggish | dev mode ships unbundled ESM; use `bun run build && bun run start` |

### License

[MIT](./LICENSE), inherited from upstream. All LobeHub copyrights remain with their authors; this repository only adds the customizations described above.
