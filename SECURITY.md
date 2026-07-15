# Security Policy

## Reporting a vulnerability

Please report security issues privately by opening a GitHub security advisory or contacting the repository maintainers through a private channel.

## Repository expectations

- Do not commit live credentials, tokens, secrets, or deployment outputs.
- Prefer GitHub Actions secrets, environment variables, or Azure Key Vault for sensitive values.
- Keep local environment files such as `.env` and `.env.local` out of source control.
- Review changes to deployment scripts, workflows, and infrastructure templates carefully.

## Automated protections

This repository runs a GitHub Actions secret-scanning workflow on pushes and pull requests to catch accidental credential exposure early.
