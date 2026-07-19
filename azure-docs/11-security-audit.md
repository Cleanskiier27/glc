# Page 11: Security Audit

## Summary

This repository now relies on automated secret scanning and documented secret-handling practices so that credentials stay out of source control and out of logs.

## Current controls

- GitHub Actions secret scanning workflow
- `.gitignore` coverage for local environment files and generated artifacts
- Repository security guidance in `SECURITY.md`

## Recommended ongoing practices

- Use GitHub Actions secrets or environment variables for CI/CD.
- Use Azure Key Vault for production secrets.
- Review dependency and secret scan results on every pull request.
- Require pull request review for changes to deployment or infrastructure files.

---

**[← Back to Index](./00-index.md) | [Next: Page 12 →](./12-quick-reference.md)**
