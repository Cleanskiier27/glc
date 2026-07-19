# Azure Storage Configuration for NetworkBuster

## 🗄️ Azure Storage Infrastructure

This document provides a template for configuring Azure Storage without embedding subscription-specific values in source control.

## 📋 Storage Components

### 1. Storage Account (Primary)
- Type: Azure Storage Account (StorageV2)
- SKU: Standard_LRS (Locally Redundant Storage)
- Tier: Hot
- Security:
  - HTTPS enforced
  - TLS 1.2 minimum
  - Blob public access disabled
  - Soft delete enabled

### 2. Blob Containers
- Realtime analytics data
- Training datasets
- ML model artifacts
- Reader content
- Analytics data
- Blog assets
- Backup archives

## 🚀 Deployment Instructions

### Prerequisites
- Azure CLI installed
- Azure subscription access
- Git repository access
- Appropriate deployment permissions

### PowerShell (Windows)
```powershell
cd networkbuster.net
.\deploy-storage-azure.ps1 -SubscriptionId "$env:AZURE_SUBSCRIPTION_ID" -ResourceGroup "$env:AZURE_STORAGE_RESOURCE_GROUP" -Location "$env:AZURE_LOCATION" -ProjectName "networkbuster"
```

### Bash (Linux/Mac)
```bash
cd networkbuster.net
bash deploy-storage-azure.sh
```

## 🔐 Access Credentials

After deployment, credentials should be written to a local file that is ignored by git, for example `storage-credentials.env`.

```env
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account-name
AZURE_STORAGE_ACCOUNT_KEY=your-storage-account-key
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_RESOURCE_GROUP=your-resource-group
```

⚠️ Never commit this file to git. Keep it local or in GitHub Actions secrets.

## 🔑 GitHub Secrets Configuration

Store the values below as GitHub Actions secrets instead of hard-coding them in the repository.

```bash
gh secret set AZURE_STORAGE_ACCOUNT_NAME -b "your-storage-account-name"
gh secret set AZURE_STORAGE_ACCOUNT_KEY -b "your-storage-account-key"
gh secret set AZURE_STORAGE_CONNECTION_STRING -b "your-connection-string"
```
