# Backup Summary

This backup archive is intended for local recovery and should not be shared with deployment credentials or generated secrets.

## Contents

- Source tree snapshots and project documentation
- Deployment scripts and workflow definitions
- Local-only environment files should be excluded before sharing

## Safety guidance

- Do not publish backup archives containing `.env`, `.env.local`, credentials, or generated deployment outputs.
- Rotate secrets if they were ever copied into the backup archive.
- Prefer sharing the repository via Git rather than a bundled backup archive.
