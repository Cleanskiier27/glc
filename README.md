# 🛰️ Space Economy Tax (glc)

![Status](https://img.shields.io/badge/status-active-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Space Economy Tax is a repository for policy-focused web experiences, documentation, and supporting tooling around space economy research.

## Quick Links

- Main README: [README.md](README.md)
- Documentation index source: [.azure/documentation/00-index.md](.azure/documentation/00-index.md)
- Git hooks guide: [.azure/documentation/07-git-hooks.md](.azure/documentation/07-git-hooks.md)
- Website preview workflow: [.github/workflows/website-preview.yml](.github/workflows/website-preview.yml)

## Live Preview

- GitHub Pages: https://cleanskiier27.github.io/glc/
- Documentation portal: https://cleanskiier27.github.io/glc/documentation.html
- Vercel app: https://networkbuster-mez5d7bmv-networkbuster.vercel.app

## Local Development

### Requirements

- Node.js `24.x`
- npm `>=10`

### Run locally

```bash
npm install
npm start
```

Server default: `http://localhost:3000`

### Useful scripts

```bash
npm run dev                # Start with Node watch mode
npm run docs:index         # Regenerate web-app/docs-index.json
npm run preview:build      # Build web preview assets
npm run preview:repo       # Build preview assets, then run server
npm run preview:viewer     # Print preview links
npm run preview:viewer:open
```

## Repository Areas

- `web-app/` — static and generated preview content
- `dashboard/` — dashboard application
- `blog/` — blog-related assets/content
- `api/` — backend API/server-related code
- `.azure/documentation/` — project documentation corpus
- `scripts/` — helper scripts for docs/preview workflows

## Preciseliens Integration

This repository includes an integrated model-suite workspace and sync automation.

- Source repository: https://github.com/Cleanskiier27/Preciseliens
- Integrated workspace: [challengerepo/preciseliens-money-main](challengerepo/preciseliens-money-main)
- Model suite README: [challengerepo/integration/model-suite/README.md](challengerepo/integration/model-suite/README.md)

Sync commands:

```powershell
pwsh ./challengerepo/scripts/source-model-suite.ps1
```

```bash
bash ./challengerepo/scripts/source-model-suite.sh
```

Workflow:
- [challengerepo/.github/workflows/source-model-suite.yml](challengerepo/.github/workflows/source-model-suite.yml)
