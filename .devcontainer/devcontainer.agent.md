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

## Communication Rules

- State assumptions when requirements are ambiguous.
- Report blockers clearly with one proposed next action.
- Keep user updates concise and task-focused.
