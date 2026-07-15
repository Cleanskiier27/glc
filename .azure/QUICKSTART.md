# 🚀 Azure Runtime Quick Start

## Current Status
✅ **Azure Infrastructure Deployed Successfully!**

### What Was Created:
- **Container Registry**: `your-registry-name.azurecr.io`
- **Container App Environment**: `your-container-app-environment` 
- **Log Analytics**: `your-log-analytics-workspace`
- **Resource Group**: `your-resource-group` (East US)
- **Subscription**: `your-subscription-id`

---

## 🔧 Quick Commands

### 1. Check Resources Created
```powershell
# List all resources
az resource list --resource-group your-resource-group --output table

# Check Container Apps
az containerapp list --resource-group your-resource-group

# View Log Analytics
az monitor log-analytics workspace show --resource-group your-resource-group --workspace-name your-log-analytics-workspace
```

### 2. Build Docker Images (When Docker is Available)
```powershell
# Start the deployment script
.\deploy-azure.ps1

# Or manually build
docker build -t your-registry-name.azurecr.io/networkbuster-server:latest -f Dockerfile .
docker build -t your-registry-name.azurecr.io/networkbuster-overlay:latest -f challengerepo\real-time-overlay\Dockerfile .\challengerepo\real-time-overlay

# Push to registry
az acr login --name your-registry-name
docker push your-registry-name.azurecr.io/networkbuster-server:latest
docker push your-registry-name.azurecr.io/networkbuster-overlay:latest
```

### 3. Deploy Container Apps
```powershell
# Get registry password
$regPass = az acr credential show --name your-registry-name --query "passwords[0].value" -o tsv

# Deploy
az deployment group create `
  --resource-group your-resource-group `
  --template-file infra/container-apps.bicep `
  --parameters `
    containerAppEnvId="/subscriptions/your-subscription-id/resourceGroups/your-resource-group/providers/Microsoft.App/managedEnvironments/your-container-app-environment" `
    containerRegistryLoginServer="your-registry-name.azurecr.io" `
    containerRegistryUsername="$(az acr credential show --name your-registry-name --query username -o tsv)" `
    containerRegistryPassword="$regPass" `
    registryPassword="$regPass"
```

### 4. View Deployment URLs
```powershell
# Main Server
az containerapp show --name networkbuster-server --resource-group your-resource-group --query 'properties.configuration.ingress.fqdn' -o tsv

# Overlay UI
az containerapp show --name networkbuster-overlay --resource-group your-resource-group --query 'properties.configuration.ingress.fqdn' -o tsv
```

### 5. View Logs
```powershell
# Stream logs from Log Analytics
az monitor log-analytics query --workspace your-log-analytics-workspace --analytics-query "ContainerAppConsoleLogs_CL | tail 100"

# Or check containerapp directly
az containerapp logs show --name networkbuster-server --resource-group your-resource-group --follow
```

---

## 📁 Files Created

```
infra/
├── main.bicep              ← Base infrastructure
├── container-apps.bicep    ← Container Apps deployment  
└── parameters.json         ← Deployment parameters

.azure/
├── DEPLOYMENT.md           ← Full deployment guide
└── azure.yaml              ← Azure CLI config

.github/workflows/
└── deploy-azure.yml        ← CI/CD pipeline

Dockerfile                  ← Main Server container
challengerepo/real-time-overlay/Dockerfile  ← Overlay UI container

deploy-azure.ps1            ← PowerShell deployment script
deploy-azure.sh             ← Bash deployment script
```

---

## 🎯 Architecture

```
GitHub → Push → Azure DevOps/GitHub Actions → Docker Build → ACR Push → Container Apps → Public URLs
  ↓                                                                            ↓
main & bigtree branches                                         https://networkbuster-server-xxx.azurecontainerapps.io
                                                                https://networkbuster-overlay-xxx.azurecontainerapps.io
```

---

## 📊 Deployment Timeline

1. ✅ **Base Infrastructure** (Completed)
   - Container Registry
   - Log Analytics  
   - Container App Environment

2. ⏳ **Docker Images** (Next)
   - Build locally or in CI/CD
   - Push to Container Registry

3. ⏳ **Container Apps** (After Images)
   - Deploy Main Server
   - Deploy Overlay UI
   - Configure auto-scaling

4. ⏳ **CI/CD Integration** (After Apps)
   - Configure GitHub Actions
   - Add Azure credentials
   - Enable automatic deployments

---

## 💡 Tips

- **Scale Apps**: Edit Container App replicas in Azure Portal
- **Update Images**: Push new image tag and update Container App
- **Monitor Health**: Check Log Analytics for errors
- **Cost Control**: Use Basic ACR SKU, Container Apps consumption billing
- **Security**: Use Azure Key Vault for secrets (optional)

---

## 📞 Support

- **Container Apps Docs**: https://learn.microsoft.com/azure/container-apps/
- **Bicep Docs**: https://learn.microsoft.com/azure/azure-resource-manager/bicep/
- **Azure CLI Docs**: https://learn.microsoft.com/cli/azure/

---

**Last Updated**: December 14, 2025  
**Status**: ✅ Infrastructure Ready for Image Build & Deployment
