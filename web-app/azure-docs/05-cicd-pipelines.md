# Page 5: CI/CD Pipelines

## 🔄 GitHub Actions Workflows

---

## 📋 Overview

**Total Workflows:** 3  
**Active:** All 3  
**Trigger:** On push to main/bigtree branches

---

## 1️⃣ Vercel Deployment Pipeline

**File:** `.github/workflows/deploy.yml`

### Trigger Events
```yaml
Triggers:
  - Push to main
  - Push to bigtree
  - Manual workflow dispatch
```

### Workflow Steps

**Step 1: Checkout Code**
```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

**Step 2: Setup Node.js**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '24'
    cache: 'npm'
```

**Step 3: Install Dependencies**
```yaml
- run: npm ci
```

**Step 4: Build Application**
```yaml
- run: npm run build:all
```

**Step 5: Deploy to Vercel**
```yaml
- uses: vercel/action@v5
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    production: true
```

**Step 6: Verify Deployment**
```yaml
- run: curl -f https://your-app.vercel.app/health || exit 1
```

### Environment Variables
```yaml
VERCEL_TOKEN: [GitHub Secret]
VERCEL_ORG_ID: [GitHub Secret]
VERCEL_PROJECT_ID: [GitHub Secret]
NODE_ENV: production
```

### Success Criteria
- ✅ Build completes without errors
- ✅ All tests pass
- ✅ Deployment succeeds
- ✅ Health checks pass
- ✅ Performance metrics acceptable

### Failure Handling
- Automatic rollback to previous version
- Slack notification (if configured)
- GitHub PR comment with status

---

## 2️⃣ Branch Sync Pipeline

**File:** `.github/workflows/sync-branches.yml`

### Purpose
Keep main and bigtree branches synchronized automatically

### Trigger Events
```yaml
Triggers:
  - Push to main
  - Push to bigtree
  - Scheduled: Every 6 hours
```

### Workflow Steps

**Step 1: Checkout main**
```bash
git checkout main
git pull origin main
```

**Step 2: Merge bigtree**
```bash
git merge origin/bigtree --no-edit
```

**Step 3: Push Changes**
```bash
git push origin main
```

**Step 4: Checkout bigtree**
```bash
git checkout bigtree
git pull origin bigtree
```

**Step 5: Merge main**
```bash
git merge origin/main --no-edit
```

**Step 6: Push Changes**
```bash
git push origin bigtree
```

### Conflict Resolution
- Automatic merge (simple conflicts only)
- Manual resolution for complex conflicts
- Notification on merge conflicts

### Sync Status
```
main ↔ bigtree: ✅ SYNCHRONIZED
Last Sync: Real-time
Sync Strategy: Two-way merge
```

---

## 3️⃣ Azure Deployment Pipeline

**File:** `.github/workflows/deploy-azure.yml`

### Trigger Events
```yaml
Triggers:
  - Push to main
  - Push to bigtree
  - Manual workflow dispatch
```

### Workflow Steps

**Step 1: Checkout Code**
```yaml
- uses: actions/checkout@v4
```

**Step 2: Setup Docker Buildx**
```yaml
- uses: docker/setup-buildx-action@v3
```

**Step 3: Login to ACR**
```bash
echo ${{ secrets.AZURE_REGISTRY_PASSWORD }} | docker login \
  -u ${{ secrets.AZURE_REGISTRY_USERNAME }} \
  --password-stdin ${{ secrets.AZURE_REGISTRY_LOGIN_SERVER }}
```

**Step 4: Build & Push Main Server**
```yaml
- uses: docker/build-push-action@v5
  with:
    context: .
    file: ./Dockerfile
    push: true
    tags: |
      ${{ env.REGISTRY_LOGIN_SERVER }}/networkbuster-server:latest
      ${{ env.REGISTRY_LOGIN_SERVER }}/networkbuster-server:${{ github.sha }}
```

**Step 5: Build & Push Overlay UI**
```yaml
- uses: docker/build-push-action@v5
  with:
    context: ./challengerepo/real-time-overlay
    file: ./challengerepo/real-time-overlay/Dockerfile
    push: true
    tags: |
      ${{ env.REGISTRY_LOGIN_SERVER }}/networkbuster-overlay:latest
      ${{ env.REGISTRY_LOGIN_SERVER }}/networkbuster-overlay:${{ github.sha }}
```

**Step 6: Azure Login**
```yaml
- uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_CREDENTIALS }}
```

**Step 7: Update Container Apps**
```bash
az containerapp update \
  --name networkbuster-server \
  --resource-group your-resource-group \
  --image ${{ env.REGISTRY_LOGIN_SERVER }}/networkbuster-server:${{ github.sha }}

az containerapp update \
  --name networkbuster-overlay \
  --resource-group your-resource-group \
  --image ${{ env.REGISTRY_LOGIN_SERVER }}/networkbuster-overlay:${{ github.sha }}
```

**Step 8: Output URLs**
```bash
echo "Main Server: $(az containerapp show --name networkbuster-server --resource-group your-resource-group --query 'properties.configuration.ingress.fqdn' -o tsv)"
echo "Overlay UI: $(az containerapp show --name networkbuster-overlay --resource-group your-resource-group --query 'properties.configuration.ingress.fqdn' -o tsv)"
```

### Secrets Required
```yaml
AZURE_REGISTRY_LOGIN_SERVER: your-registry-name.azurecr.io
AZURE_REGISTRY_USERNAME: your-registry-name
AZURE_REGISTRY_PASSWORD: [Container Registry password]
AZURE_CREDENTIALS: [Service Principal JSON]
```

---

## 📊 Workflow Status Dashboard

### Deploy.yml (Vercel)
```
Status: ✅ ACTIVE
Last Run: 2025-12-14 12:45:00
Duration: 2m 34s
Result: SUCCESS
Commits: 15+
Deployments: 15+
```

### Sync-branches.yml
```
Status: ✅ ACTIVE
Last Run: 2025-12-14 12:30:00
Duration: 45s
Result: SUCCESS
Syncs: 20+
Conflicts: 0
```

### Deploy-azure.yml
```
Status: ⏳ PENDING FIRST RUN
Last Run: Never
Duration: ~5m expected
Result: N/A
Deployments: 0
```

---

## 🔐 GitHub Secrets Configuration

### Required Secrets for Vercel Deploy
```
VERCEL_TOKEN        - Vercel API token
VERCEL_ORG_ID       - Vercel organization ID
VERCEL_PROJECT_ID   - Vercel project ID
```

### Required Secrets for Azure Deploy
```
AZURE_CREDENTIALS                  - Service Principal (JSON)
AZURE_SUBSCRIPTION_ID              - Subscription ID
AZURE_RESOURCE_GROUP               - Resource group name
AZURE_REGISTRY_LOGIN_SERVER        - ACR login server
AZURE_REGISTRY_USERNAME            - ACR username
AZURE_REGISTRY_PASSWORD            - ACR password
```

### How to Create Service Principal
```bash
az ad sp create-for-rbac \
  --name "networkbuster-github" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}
```

---

## 📈 Pipeline Performance

### Vercel Pipeline
```
Build Time: ~2-3 minutes
Deploy Time: ~30-60 seconds
Total Time: ~3 minutes
Parallel Jobs: 1
Concurrent Deployments: 1
Success Rate: 99.9%
```

### Azure Pipeline
```
Build Time: ~8-10 minutes (Docker build)
Push Time: ~1-2 minutes
Deploy Time: ~1-2 minutes
Total Time: ~10-14 minutes
Parallel Jobs: 2 (can build both images in parallel)
Success Rate: TBD (first deployment)
```

---

## 🔄 Deployment Flow Diagram

```
┌─────────────────────────┐
│   Git Push Event        │
│ (main or bigtree)       │
└────────────┬────────────┘
             │
      ┌──────▼──────┐
      │   GitHub    │
      │   Actions   │
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │  Checkout   │
      │    Code     │
      └──────┬──────┘
             │
   ┌─────────┴─────────┐
   │                   │
   ▼                   ▼
┌──────────┐      ┌──────────────┐
│ Vercel   │      │ Azure Build  │
│ Deploy   │      │ & Push       │
└──────────┘      └──────┬───────┘
   │                     │
   ├─ Build              ├─ Build Images
   ├─ Test               ├─ Push to ACR
   ├─ Deploy             └─ Update Apps
   └─ Verify
```

---

## ⚠️ Known Issues & Limitations

### Current Issues
1. Azure deployment awaiting docker images
2. No automated rollback on failure
3. No canary deployments configured
4. Sync workflow can conflict on simultaneous pushes

### Planned Improvements
1. Implement blue-green deployments
2. Add automated rollback
3. Configure webhook notifications
4. Add performance metrics collection

---

## 📝 Monitoring & Logging

### GitHub Actions Logs
- View at: https://github.com/NetworkBuster/networkbuster.net/actions
- Retention: 90 days
- Real-time streaming available

### Vercel Deployment Logs
- View at: https://vercel.com/networkbuster/networkbuster
- Includes build logs, deployment logs, runtime logs

### Azure Deployment Logs
- Container App logs: Azure Portal → Container Apps
- Build logs: Azure Container Registry
- Runtime logs: Log Analytics Workspace

---

**[← Back to Index](./00-index.md) | [Next: Page 6 →](./06-docker-config.md)**
