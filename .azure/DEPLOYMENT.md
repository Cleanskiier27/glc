# NetworkBuster Azure Runtime Deployment

## Deployment status

This document is a generic deployment template only. Replace the placeholders below with your own Azure resource names and values before using it.

## Azure resources to create

### 1. Container Registry
- Name: `your-registry-name`
- Login Server: `your-registry-name.azurecr.io`
- SKU: Basic
- Purpose: Store and manage Docker container images

### 2. Log Analytics Workspace
- Name: `your-log-workspace`
- Location: Your preferred region
- Retention: 30 days

### 3. Container App Environment
- Name: `your-container-app-env`
- Location: Your preferred region

## Deployment details

- Subscription ID: `your-subscription-id`
- Resource Group: `your-resource-group`
- Region: `your-region`

## Deployment steps

### Step 1: Build Docker images

```powershell
.\deploy-azure.ps1 -ResourceGroup "$env:AZURE_RESOURCE_GROUP" -RegistryName "$env:AZURE_REGISTRY_NAME"
```

Or manually build:

```bash
az acr login --name "$AZURE_REGISTRY_NAME"
docker build -t "$AZURE_REGISTRY_URL/networkbuster-server:latest" -f Dockerfile .
docker build -t "$AZURE_REGISTRY_URL/networkbuster-overlay:latest" -f challengerepo/real-time-overlay/Dockerfile ./challengerepo/real-time-overlay
```

### Step 2: Deploy Container Apps

Use your existing deployment workflow or Azure CLI commands with values from your environment or Azure Key Vault.

### Step 3: Verify deployment

```bash
az containerapp show --name networkbuster-server --resource-group "$AZURE_RESOURCE_GROUP" --query 'properties.configuration.ingress.fqdn' -o tsv
az containerapp show --name networkbuster-overlay --resource-group "$AZURE_RESOURCE_GROUP" --query 'properties.configuration.ingress.fqdn' -o tsv
```

## Security configuration

- Keep credentials in GitHub Actions secrets, Azure Key Vault, or local files ignored by git.
- Prefer managed identities and role-based access control where possible.
- Review logs and deployment outputs before sharing them.
