#!/bin/bash

# NetworkBuster Azure Storage Deployment
# This script deploys Azure Storage infrastructure for NetworkBuster
# Usage: bash deploy-storage-azure.sh

set -e

# Configuration
RESOURCE_GROUP="your-resource-group"
LOCATION="eastus"
PROJECT_NAME="networkbuster"
SUBSCRIPTION_ID="your-subscription-id"

echo "🚀 NetworkBuster Azure Storage Deployment"
echo "=========================================="
echo ""
echo "Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  Project: $PROJECT_NAME"
echo "  Subscription: $SUBSCRIPTION_ID"
echo ""

# Check Azure CLI
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    exit 1
fi

# Login to Azure
echo "🔐 Checking Azure authentication..."
az account show > /dev/null 2>&1 || az login

# Set subscription
echo "📋 Setting subscription..."
az account set --subscription "$SUBSCRIPTION_ID"

# Create resource group if it doesn't exist
echo "📁 Checking resource group..."
if ! az group exists --name "$RESOURCE_GROUP" | grep -q true; then
    echo "  Creating resource group: $RESOURCE_GROUP"
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION"
else
    echo "  ✅ Resource group already exists"
fi

# Deploy storage infrastructure
echo ""
echo "💾 Deploying Azure Storage Infrastructure..."
echo "  ├─ Storage Account"
echo "  ├─ Blob Containers (7)"
echo "  ├─ File Shares"
echo "  ├─ Tables (2)"
echo "  └─ Queues (2)"
echo ""

DEPLOYMENT_NAME="networkbuster-storage-$(date +%Y%m%d%H%M%S)"

az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --template-file infra/storage.bicep \
    --parameters \
        location="$LOCATION" \
        projectName="$PROJECT_NAME" \
        environment="prod" \
        storageSku="Standard_LRS" \
        accessTier="Hot" \
    --name "$DEPLOYMENT_NAME"

# Get deployment outputs
echo ""
echo "✅ Storage deployment completed successfully!"
echo ""
echo "📊 Outputs:"
echo "=========="

OUTPUTS=$(az deployment group show \
    --resource-group "$RESOURCE_GROUP" \
    --name "$DEPLOYMENT_NAME" \
    --query properties.outputs)

echo "$OUTPUTS" | jq '.'

# Extract storage account name and key
STORAGE_ACCOUNT=$(echo "$OUTPUTS" | jq -r '.storageAccountName.value')
STORAGE_KEY=$(echo "$OUTPUTS" | jq -r '.storageAccountKey.value')
CONNECTION_STRING=$(echo "$OUTPUTS" | jq -r '.connectionString.value')

echo ""
echo "🔑 Storage Access Information:"
echo "  Account Name: $STORAGE_ACCOUNT"
echo "  Connection String: $CONNECTION_STRING"
echo ""

# Save credentials to file (keep secure)
echo ""
echo "💾 Saving credentials to secure file..."
CREDS_FILE="storage-credentials.env"
cat > "$CREDS_FILE" << EOF
# NetworkBuster Azure Storage Credentials
# ⚠️ KEEP THIS FILE SECURE - DO NOT COMMIT TO GIT

AZURE_STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT
AZURE_STORAGE_ACCOUNT_KEY=$STORAGE_KEY
AZURE_STORAGE_CONNECTION_STRING=$CONNECTION_STRING
AZURE_STORAGE_RESOURCE_GROUP=$RESOURCE_GROUP

# Endpoints
AZURE_STORAGE_BLOB_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.blobEndpoint.value')
AZURE_STORAGE_FILE_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.fileEndpoint.value')
AZURE_STORAGE_TABLE_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.tableEndpoint.value')
AZURE_STORAGE_QUEUE_ENDPOINT=$(echo "$OUTPUTS" | jq -r '.queueEndpoint.value')

# Containers
AZURE_STORAGE_CONTAINER_REALTIME=realtime-data
AZURE_STORAGE_CONTAINER_AI=ai-training-datasets
AZURE_STORAGE_CONTAINER_MODELS=ml-models
AZURE_STORAGE_CONTAINER_READER=immersive-reader-content
AZURE_STORAGE_CONTAINER_ANALYTICS=analytics-data
AZURE_STORAGE_CONTAINER_BLOG=blog-assets
AZURE_STORAGE_CONTAINER_BACKUPS=backups
EOF

chmod 600 "$CREDS_FILE"
echo "  ✅ Credentials saved to: $CREDS_FILE (chmod 600)"
echo ""
echo "⚠️  IMPORTANT: Add '$CREDS_FILE' to .gitignore"
echo ""

# Configure GitHub Secrets (optional)
echo "🔐 To add these to GitHub Secrets, run:"
echo ""
echo "  gh secret set AZURE_STORAGE_ACCOUNT_NAME -b '$STORAGE_ACCOUNT'"
echo "  gh secret set AZURE_STORAGE_ACCOUNT_KEY -b '$STORAGE_KEY'"
echo "  gh secret set AZURE_STORAGE_CONNECTION_STRING -b '$CONNECTION_STRING'"
echo ""

# Display container information
echo "📦 Blob Containers Created:"
echo "  1. realtime-data          - Real-time visitor metrics"
echo "  2. ai-training-datasets   - ML training datasets"
echo "  3. ml-models              - Trained model artifacts"
echo "  4. immersive-reader-content - Immersive reader data"
echo "  5. analytics-data         - Analytics processing files"
echo "  6. blog-assets            - Blog media and content"
echo "  7. backups                - Backup archives"
echo ""

echo "📄 File Shares Created:"
echo "  1. cache (100 GB quota)    - Cache storage"
echo ""

echo "📊 Tables Created:"
echo "  1. VisitorMetrics         - Visitor tracking data"
echo "  2. PerformanceMetrics     - Performance metrics"
echo ""

echo "📋 Queues Created:"
echo "  1. ai-training-jobs       - AI training job queue"
echo "  2. data-processing        - Data processing queue"
echo ""

echo "✨ Storage infrastructure deployment complete!"
echo ""
echo "🎯 Next Steps:"
echo "  1. Update GitHub Secrets with storage credentials"
echo "  2. Configure Container Apps to use storage"
echo "  3. Update immersive reader to fetch from storage"
echo "  4. Configure AI training pipeline with datasets"
echo ""
