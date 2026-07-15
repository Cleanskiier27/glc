# NetworkBuster Azure Deployment Script
# This script deploys the Azure runtime infrastructure using environment variables.
# Expected environment variables:
#   AZURE_RESOURCE_GROUP  - Azure resource group name
#   AZURE_LOCATION        - Azure region (for example, eastus)
#   AZURE_REGISTRY_NAME   - Azure Container Registry name
#   AZURE_REGISTRY_URL    - Azure Container Registry login server

param(
    [string]$ResourceGroup = $env:AZURE_RESOURCE_GROUP,
    [string]$Location = $env:AZURE_LOCATION,
    [string]$RegistryName = $env:AZURE_REGISTRY_NAME,
    [string]$RegistryUrl = $env:AZURE_REGISTRY_URL
)

if (-not $ResourceGroup) {
    throw "Set AZURE_RESOURCE_GROUP environment variable (for example: `$env:AZURE_RESOURCE_GROUP='your-group'`) or pass -ResourceGroup before running this script."
}
if (-not $RegistryName) {
    throw "Set AZURE_REGISTRY_NAME environment variable (for example: `$env:AZURE_REGISTRY_NAME='your-registry'`) or pass -RegistryName before running this script."
}
if (-not $RegistryUrl) {
    $RegistryUrl = $RegistryName + ".azurecr.io"
}

Write-Host "🚀 NetworkBuster Azure Deployment" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📍 Checking Azure login..." -ForegroundColor Yellow
$account = az account show --output json | ConvertFrom-Json
if (-not $account) {
    Write-Host "❌ Not logged into Azure. Running 'az login'..." -ForegroundColor Red
    az login
}

Write-Host "✓ Logged in as: $($account.user.name)" -ForegroundColor Green
Write-Host ""

Write-Host "🔍 Getting Container Registry details..." -ForegroundColor Yellow
$registry = az acr show --resource-group $ResourceGroup --name $RegistryName --output json | ConvertFrom-Json
if (-not $registry -or -not $registry.loginServer) {
    throw "Unable to locate Azure Container Registry '$RegistryName' in resource group '$ResourceGroup'. Verify that the registry exists, the resource group is correct, and you have sufficient permissions."
}
$resolvedRegistryUrl = if ($RegistryUrl) { $RegistryUrl } else { $registry.loginServer }
Write-Host "✓ Registry: $resolvedRegistryUrl" -ForegroundColor Green
Write-Host ""

Write-Host "🐳 Checking Docker..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green

    Write-Host "📋 Logging into Azure Container Registry..." -ForegroundColor Yellow
    az acr login --name $RegistryName

    Write-Host "🔨 Building Main Server image..." -ForegroundColor Yellow
    docker build -t "$resolvedRegistryUrl/networkbuster-server:latest" -f Dockerfile .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Main Server image built successfully" -ForegroundColor Green
        Write-Host "📤 Pushing Main Server image..." -ForegroundColor Yellow
        docker push "$resolvedRegistryUrl/networkbuster-server:latest"
        Write-Host "✓ Main Server image pushed" -ForegroundColor Green
    }

    Write-Host "🔨 Building Overlay UI image..." -ForegroundColor Yellow
    docker build -t "$resolvedRegistryUrl/networkbuster-overlay:latest" -f challengerepo\real-time-overlay\Dockerfile .\challengerepo\real-time-overlay
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Overlay UI image built successfully" -ForegroundColor Green
        Write-Host "📤 Pushing Overlay UI image..." -ForegroundColor Yellow
        docker push "$resolvedRegistryUrl/networkbuster-overlay:latest"
        Write-Host "✓ Overlay UI image pushed" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "✅ Docker images built and pushed successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker is not running or not installed" -ForegroundColor Yellow
    Write-Host "📝 Skip local Docker builds" -ForegroundColor Yellow
    Write-Host "   Images can be pushed later when Docker is available" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📊 Azure Deployment Summary" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroup"
Write-Host "Container Registry: $resolvedRegistryUrl"
Write-Host "Location: $Location"
Write-Host ""
Write-Host "✅ Base infrastructure is ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Build and push Docker images (or use the script with Docker running)"
Write-Host "2. Update Container Apps with the new images using your Azure deployment workflow"
Write-Host ""
