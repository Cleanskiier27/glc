---
description: "Use when working in this repository from a devcontainer, including Universal CLI flash chat/AI workflows."
---

# Devcontainer Agent Instructions

You are operating inside a git repository in a devcontainer.

## Git Safety Rules

- Never run destructive commands like `git reset --hard`, `git clean -fd`, or force pushes unless the user explicitly asks.
- Do not rewrite history on shared branches.
- Keep commits focused to one logical change.
- Prefer non-interactive git commands.
- Before committing, check status with `git status --short`.

## Change Workflow

1. Inspect current branch and status.
2. Make minimal edits required for the task.
3. Run relevant checks (tests/lint) when available.
4. Summarize changed files and why.
5. Commit only when user asks.

## Universal CLI Chat/AI Command Notes

Use these documented flash commands from `FLASH-COMMANDS-GUIDE.md` when the user asks for chat-like AI assistance in terminal workflows:

- `flash-commands.bat analyze` for AI codebase analysis.
- `flash-commands.bat suggest` for AI optimization suggestions.
- `flash-commands.bat docs` for AI documentation generation.
- `flash-commands.bat optimize` for AI performance optimization.

On Linux/macOS, use the shell variant:

- `bash flash-commands.sh analyze`
- `bash flash-commands.sh suggest`
- `bash flash-commands.sh docs`
- `bash flash-commands.sh optimize`

## Host Categories

Add `.devcontainers` as a host category for app build tasks.

- Host category: `.devcontainers`
- Build target: `vite app`
	Command: `npm run build` (from the Vite app directory, for example `dashboard/`)
- Build target: `express app`
	Command: `npm run start` for run validation or `node server.js` from repo root

When the user asks to build Vite or Express in this repository, prefer using the `.devcontainers` host category context first.

## NetworkBuster IoT Tuning

Use these defaults when handling NetworkBuster IoT tasks in this repository.

- Priority areas: telemetry ingestion, dashboard visualization, API stability, and deployment repeatability.
- Treat `server.js` and `server-enhanced.js` as critical runtime entry points for IoT-facing APIs.
- Treat `dashboard/` and `web-app/` as operator-facing IoT monitoring surfaces.

### Recommended Build and Validation Flow

1. Validate server dependencies at repo root: `npm install`.
2. Validate API package when changed: run install inside `api/` and check `api/server.js` startup.
3. Build Vite apps when touched: run `npm run build` in `dashboard/`.
4. Run quick runtime validation: `node server.js` and confirm app starts without errors.

### Deployment and Ops Notes

- Prefer documented automation from `flash-commands.bat` / `flash-commands.sh` for repeatable operations.
- For production-oriented requests, use `flash-commands.bat deploy` only after build/test checks pass.
- For diagnostics and docs updates, prefer:
	- `flash-commands.bat analyze`
	- `flash-commands.bat docs`

### Safety and Scope

- Do not introduce breaking changes to API routes without updating related docs in `.azure/documentation/` and `docs/`.
- Keep IoT-facing config updates explicit and auditable in commits.

## Communication Rules

- State assumptions when requirements are ambiguous.
- Report blockers clearly with one proposed next action.
- Keep user updates concise and task-focused.
