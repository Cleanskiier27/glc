# Page 3: Secret Handling and Safe Configuration

## Security notice

This repository must not contain live credentials, subscription identifiers, registry passwords, or deployment secrets. Keep sensitive values in GitHub Actions secrets, environment variables, or Azure Key Vault.

## Safe practices

- Store secrets in GitHub Actions secrets or environment variables.
- Use Azure Key Vault for production secrets and service identities.
- Never commit `.env`, `.env.local`, deployment logs, or generated credential files.
- Review pull requests for new secret-like values before merging.
- Rotate any secret that ever appears in the repository history.

## If a secret is exposed

1. Revoke or rotate the affected secret.
2. Remove it from the repository history if necessary.
3. Update the workflow or deployment configuration to use the new secret.
4. Re-run the repository security workflow to confirm the issue is resolved.

---

**[← Back to Index](./00-index.md) | [Next: Page 4 →](./04-azure-infrastructure.md)**
