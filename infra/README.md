# Infrastructure as Code - Azure Deployment

## 📁 What's in this folder?

This folder contains **Bicep templates** for deploying the Voice Agent Simulator to Azure. The templates are designed to work with **Azure Developer CLI (azd)** for simplified, repeatable deployments.

## 🏗️ Architecture

The infrastructure creates a complete production environment:

```
Azure Subscription
└── Resource Group
    ├── Container Apps Environment (hosting platform)
    │   └── Container App (your web application)
    ├── Container Registry (stores Docker images)
    ├── Log Analytics Workspace (logging)
    ├── Application Insights (monitoring/telemetry)
    └── Storage Account (conversation scores) [optional]
```

## 📄 File Structure

```
infra/
├── main.bicep                         # Main orchestration template
├── main.parameters.json               # Default parameter values
├── abbreviations.json                 # Azure resource naming conventions
└── core/
    ├── host/
    │   ├── container-app.bicep       # Web application container
    │   ├── container-apps-environment.bicep  # Hosting environment
    │   └── container-registry.bicep  # Docker image storage
    └── monitor/
        └── monitoring.bicep           # Logs & Application Insights
```

## 🚀 Deployment Methods

### Method 1: Azure Developer CLI (Recommended)

**Why AZD?**
- ✅ Automatically creates resource groups
- ✅ Builds and pushes Docker images
- ✅ Manages environment-specific configs
- ✅ Handles secrets securely
- ✅ One-command deployment

#### First-Time Setup

```powershell
# Navigate to repository root
cd C:\Local Dev\Cora-Voice-Agent-Training

# Initialize azd (creates .azure folder with your settings)
azd init

# You'll be prompted for:
#   - Environment name (e.g., "dev", "prod") - becomes resource group prefix
#   - Azure subscription
#   - Azure region (e.g., "eastus", "westus2")
```

#### Deploy Infrastructure + Application

```powershell
# Single command to deploy everything!
azd up

# This will:
# 1. Create resource group: rg-<environment-name>
# 2. Deploy Bicep templates → Azure resources
# 3. Build Docker image from src/
# 4. Push image to Azure Container Registry
# 5. Deploy container to Azure Container Apps
# 6. Output URLs and connection strings
```

#### Update Code Only

```powershell
# After making code changes, redeploy just the app
azd deploy

# Much faster than 'azd up' - only rebuilds/redeploys container
```

#### Update Infrastructure Only

```powershell
# After changing Bicep templates
azd provision

# Updates Azure resources without redeploying code
```

### Method 2: Azure CLI (Manual)

If you prefer manual control:

```powershell
# 1. Create resource group
az group create --name rg-cora-dev --location eastus

# 2. Deploy Bicep template
az deployment group create \
  --resource-group rg-cora-dev \
  --template-file infra/main.bicep \
  --parameters environmentName=cora-dev \
               location=eastus \
               principalId=$(az ad signed-in-user show --query id -o tsv) \
               azureOpenAIEndpoint=https://your-project.cognitiveservices.azure.com/

# 3. Build and push Docker image
az acr build \
  --registry <your-registry-name> \
  --image voice-agent-simulator:latest \
  --file src/Dockerfile \
  src/

# 4. Update Container App with new image
az containerapp update \
  --name ca-web-<token> \
  --resource-group rg-cora-dev \
  --image <your-registry>.azurecr.io/voice-agent-simulator:latest
```

## ⚙️ Configuration Parameters

### Required Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `environmentName` | Environment identifier (becomes part of resource names) | `cora-dev`, `cora-prod` |
| `location` | Azure region | `eastus`, `westus2`, `westeurope` |

### Optional Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `principalId` | User/Service Principal ID for role assignments | Empty (skip roles) |
| `resourceGroupName` | Use existing resource group | Empty (create new) |
| `azureOpenAIEndpoint` | Azure AI Foundry endpoint | Empty (must configure post-deployment) |
| `azureOpenAIApiKey` | API key for Azure OpenAI | Empty (use managed identity) |
| `modelName` | GPT deployment name | `gpt-4o` |

## 🔐 Security & Authentication

### Managed Identity (Recommended)

The Container App is automatically assigned a managed identity. Grant it access to:

1. **Azure AI Foundry**: `Cognitive Services User` role
2. **Storage Account** (if using analytics): `Storage Table Data Contributor` role

```powershell
# Get Container App managed identity
$principalId = az containerapp show \
  --name ca-web-<token> \
  --resource-group rg-cora-dev \
  --query identity.principalId -o tsv

# Grant access to Azure AI Foundry
az role assignment create \
  --assignee $principalId \
  --role "Cognitive Services User" \
  --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.CognitiveServices/accounts/<name>

# Grant access to Storage Account
az role assignment create \
  --assignee $principalId \
  --role "Storage Table Data Contributor" \
  --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.Storage/storageAccounts/<name>
```

### API Keys (Alternative)

If you prefer API keys:

1. Pass `azureOpenAIApiKey` parameter during deployment
2. Key is stored as a secret in Container App
3. Less secure than managed identity

## 📊 Monitoring & Logs

### Application Insights

Automatically configured with OpenTelemetry instrumentation:

**View in Azure Portal**:
1. Navigate to Application Insights resource
2. **Investigate** → **Performance**: See request durations, dependencies
3. **Investigate** → **Failures**: View exceptions and error rates
4. **Monitoring** → **Live Metrics**: Real-time request streaming

**Query with KQL**:
```kql
// Recent requests
requests
| where timestamp > ago(1h)
| summarize count() by bin(timestamp, 5m), success

// AI agent calls
dependencies
| where type == "Azure Cognitive Services"
| summarize avg(duration), count() by name
```

### Container Logs

```powershell
# Stream logs in real-time
az containerapp logs show \
  --name ca-web-<token> \
  --resource-group rg-cora-dev \
  --follow

# View last 50 lines
az containerapp logs show \
  --name ca-web-<token> \
  --resource-group rg-cora-dev \
  --tail 50
```

## 🎯 Cost Optimization

### Development Environment

```bicep
// In main.bicep, adjust Container App resources:
containerCpuCoreCount: '0.5'     // Minimum CPU
containerMemory: '1.0Gi'         // Minimum memory
minReplicas: 0                    // Scale to zero when idle
maxReplicas: 1                    // Single instance
```

**Estimated Monthly Cost** (East US, pay-as-you-go):
- Container Apps: ~$10/month (with scale-to-zero)
- Container Registry: ~$5/month (Basic SKU)
- Log Analytics: ~$3/month (5GB free tier)
- Application Insights: Free (1GB/month included)
- **Total: ~$18/month**

### Production Environment

```bicep
containerCpuCoreCount: '1.0'      // Better performance
containerMemory: '2.0Gi'          // More memory
minReplicas: 1                    // Always-on
maxReplicas: 10                   // Auto-scale for traffic
```

**Estimated Monthly Cost**:
- Container Apps: ~$50-100/month (depends on traffic)
- Other services: Same as dev
- **Total: ~$65-115/month**

## 🔄 CI/CD Integration

### GitHub Actions

The Bicep templates work seamlessly with GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Deploy with azd
        run: |
          curl -fsSL https://aka.ms/install-azd.sh | bash
          azd deploy --no-prompt
        env:
          AZURE_ENV_NAME: ${{ secrets.AZURE_ENV_NAME }}
          AZURE_LOCATION: ${{ secrets.AZURE_LOCATION }}
          AZURE_SUBSCRIPTION_ID: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
```

## 📚 Infrastructure Learning Guide

### Bicep Fundamentals

**Key Concepts**:
1. **Modules**: Reusable template components (`core/host/*.bicep`)
2. **Parameters**: Input values that customize deployment
3. **Variables**: Computed values used in template
4. **Outputs**: Values returned after deployment

**Example** (`main.bicep`):
```bicep
// Parameter: User input
param environmentName string

// Variable: Computed from inputs
var resourceToken = uniqueString(subscription().id, environmentName)

// Resource: Declares Azure resource
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}'
  location: location
}

// Output: Return value after deployment
output resourceGroupName string = rg.name
```

### Container Apps Architecture

**Why Container Apps?**
- ✅ Serverless (auto-scaling, pay-per-use)
- ✅ Built-in load balancing & HTTPS
- ✅ Integrated monitoring
- ✅ Easy Auth for Azure AD
- ✅ Supports WebSockets

**Scaling Logic**:
```bicep
scale: {
  minReplicas: 0           // Scale to zero = $0 when idle
  maxReplicas: 10          // Max instances during traffic spike
  rules: [
    {
      name: 'http-rule'
      http: {
        metadata: {
          concurrentRequests: '50'  // Scale when > 50 concurrent requests
        }
      }
    }
  ]
}
```

### Managed Identity Benefits

**Traditional Authentication** (API Keys):
```
App → API Key → Azure Service
```
❌ Keys can be leaked  
❌ Keys expire and need rotation  
❌ Keys must be stored securely  

**Managed Identity**:
```
App → Azure AD → Azure Service
```
✅ No secrets to manage  
✅ Azure handles authentication  
✅ Automatic credential rotation  
✅ Role-based access control (RBAC)  

## ❓ Troubleshooting

### Deployment Fails: "Resource name already exists"

```powershell
# Resource names must be globally unique
# Change environment name to create different names
azd env new prod-v2
azd up
```

### Container App not starting

```powershell
# Check logs for errors
az containerapp logs show --name <app-name> --resource-group <rg> --tail 100

# Common issues:
# - Missing environment variable (check container app configuration)
# - Docker image build failed (check Azure Container Registry tasks)
# - Port mismatch (ensure Dockerfile EXPOSE matches targetPort in Bicep)
```

### "Insufficient permissions"

```powershell
# Ensure you have required roles on subscription:
# - Contributor (or Owner)
# - User Access Administrator (for role assignments)

az role assignment list --assignee <your-email> --subscription <sub-id>
```

## 🎓 Next Steps

1. **Add Storage Account**: Uncomment storage module in `main.bicep`
2. **Enable Easy Auth**: Configure Azure AD authentication in Container App
3. **Set up Custom Domain**: Add custom DNS and SSL certificate
4. **Implement CI/CD**: Set up GitHub Actions or Azure DevOps pipeline
5. **Add API Management**: Put Azure API Management in front for rate limiting, auth

## 📖 Learning Resources

- **Bicep**: https://learn.microsoft.com/azure/azure-resource-manager/bicep/
- **Azure Container Apps**: https://learn.microsoft.com/azure/container-apps/
- **Azure Developer CLI**: https://learn.microsoft.com/azure/developer/azure-developer-cli/
- **Managed Identity**: https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/

---

💡 **Pro Tip**: Use `azd down` to delete all resources when done testing to avoid charges!
