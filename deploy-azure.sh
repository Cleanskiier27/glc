#!/bin/bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🚀 NetworkBuster Azure Deployment${NC}"
echo "=================================="

RESOURCE_GROUP="${RESOURCE_GROUP:-your-resource-group}"
REGISTRY_NAME="${REGISTRY_NAME:-}"
REGISTRY_URL="${REGISTRY_URL:-}"

if [[ -z "$RESOURCE_GROUP" ]]; then
  echo -e "${RED}❌ RESOURCE_GROUP must be set before running this script.${NC}"
  exit 1
fi

if [[ -z "${REGISTRY_NAME:-}" ]]; then
  echo -e "${RED}❌ REGISTRY_NAME must be set before running this script.${NC}"
  echo "   Example: RESOURCE_GROUP=your-resource-group REGISTRY_NAME=your-registry REGISTRY_URL=your-registry.azurecr.io ./deploy-azure.sh"
  exit 1
fi

if [[ -z "${REGISTRY_URL:-}" ]]; then
  echo -e "${RED}❌ REGISTRY_URL must be set before running this script.${NC}"
  echo "   Example: RESOURCE_GROUP=your-resource-group REGISTRY_NAME=your-registry REGISTRY_URL=your-registry.azurecr.io ./deploy-azure.sh"
  exit 1
fi

echo -e "${GREEN}✓ Resource Group: $RESOURCE_GROUP${NC}"
echo -e "${GREEN}✓ Registry: $REGISTRY_URL${NC}"

echo -e "${YELLOW}📦 Logging into Container Registry...${NC}"
az acr login --name "$REGISTRY_NAME"

echo -e "${YELLOW}🔨 Building Main Server image...${NC}"
az acr build --registry "$REGISTRY_NAME" --image networkbuster-server:latest --image networkbuster-server:$(git rev-parse --short HEAD) .

echo -e "${YELLOW}🔨 Building Overlay UI image...${NC}"
az acr build --registry "$REGISTRY_NAME" --image networkbuster-overlay:latest --image networkbuster-overlay:$(git rev-parse --short HEAD) challengerepo/real-time-overlay

echo -e "${YELLOW}🚀 Updating Container Apps...${NC}"
az containerapp update \
  --name networkbuster-server \
  --resource-group "$RESOURCE_GROUP" \
  --image "$REGISTRY_URL/networkbuster-server:latest"

az containerapp update \
  --name networkbuster-overlay \
  --resource-group "$RESOURCE_GROUP" \
  --image "$REGISTRY_URL/networkbuster-overlay:latest"

echo -e "${GREEN}✓ Deployment complete!${NC}"
echo ""
echo -e "${YELLOW}📊 Deployment URLs:${NC}"
echo "Main Server: $(az containerapp show --name networkbuster-server --resource-group "$RESOURCE_GROUP" --query 'properties.configuration.ingress.fqdn' -o tsv)"
echo "Overlay UI: $(az containerapp show --name networkbuster-overlay --resource-group "$RESOURCE_GROUP" --query 'properties.configuration.ingress.fqdn' -o tsv)"
