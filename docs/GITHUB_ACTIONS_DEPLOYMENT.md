# 🚀 GitHub Actions Deployment Guide

This guide shows you how to deploy the Cora Voice Agent application directly from GitHub using GitHub Actions - **no local setup required!**

## ✨ Why Use GitHub Actions Deployment?

**Benefits:**
- ✅ **No Docker Desktop required** - builds happen in the cloud
- ✅ **No local tools needed** - no azd, no Azure CLI installation
- ✅ **Automatic updates** - sync your fork to get latest improvements
- ✅ **CI/CD built-in** - deploy on every push (optional)
- ✅ **Deployment history** - track all deployments in GitHub Actions tab

**When to use this:**
- Standard deployments without code customization
- Team environments where you want centralized deployment
- When you don't want to install local development tools

**When to use local deployment instead:**
- You want to customize the application code
- You want to test changes locally before deploying
- Follow the workshop modules for hands-on learning

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Azure Subscription** with Contributor access
2. **Azure AI Foundry** (formerly Azure OpenAI) deployed with a GPT model
3. **GitHub Account**
4. **Azure Resource Providers Registered:**
   ```bash
   az provider register --namespace Microsoft.App
   az provider register --namespace Microsoft.ContainerService
   ```

---

## 🔧 Setup Steps

### Step 1: Fork or Use This Repository as Template

Choose one:

**Option A: Fork the Repository**
1. Click the **"Fork"** button at the top right of this repository
2. This creates your own copy that you can sync with updates

**Option B: Use as Template**
1. Click **"Use this template"** → **"Create a new repository"**
2. This creates a new independent repository

### Step 2: Create Azure Service Principal

You need to create an Azure Service Principal with Contributor access for GitHub Actions to deploy resources.

Run these commands in **Azure Cloud Shell** or locally with Azure CLI:

```bash
# Set your subscription
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Create service principal (replace YOUR_GITHUB_USERNAME and YOUR_REPO_NAME)
az ad sp create-for-rbac \
  --name "github-actions-cora-voice-agent" \
  --role Contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID \
  --json-auth

# Save the output - you'll need it for GitHub Secrets!
```

**Output will look like:**
```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

⚠️ **Save these values securely** - you'll add them to GitHub Secrets next!

### Step 3: Configure GitHub Secrets

1. Go to your repository on GitHub
2. Click **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. Click **"New repository secret"** for each of the following:

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `AZURE_CLIENT_ID` | `clientId` from Step 2 output | Service principal output |
| `AZURE_TENANT_ID` | `tenantId` from Step 2 output | Service principal output |
| `AZURE_SUBSCRIPTION_ID` | `subscriptionId` from Step 2 output | Service principal output |
| `AZURE_OPENAI_ENDPOINT` | Your Azure AI Foundry endpoint | Azure Portal → AI Foundry resource → Endpoint |
| `AZURE_OPENAI_MODEL_NAME` | Your model deployment name | Azure AI Foundry → Deployments (e.g., `gpt-4o-deployment`) |

**Example values:**
```
AZURE_CLIENT_ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
AZURE_TENANT_ID: 12345678-abcd-ef12-3456-7890abcdef12
AZURE_SUBSCRIPTION_ID: 87654321-dcba-21fe-6543-0987fedcba21
AZURE_OPENAI_ENDPOINT: https://my-ai-foundry.openai.azure.com/
AZURE_OPENAI_MODEL_NAME: gpt-4o-deployment
```

### Step 4: Run the Deployment Workflow

1. Go to your repository on GitHub
2. Click the **"Actions"** tab
3. Select **"Deploy to Azure"** workflow in the left sidebar
4. Click **"Run workflow"** button (top right)
5. Fill in the parameters:
   - **Environment name**: `dev` (or `prod`, `test`, etc.)
   - **Azure region**: `eastus` (or your preferred region)
6. Click **"Run workflow"**

### Step 5: Monitor Deployment

1. The workflow will start running (green dot)
2. Click on the running workflow to see live logs
3. Deployment takes about 5-10 minutes
4. When complete, you'll see the application URL in the logs! 🎉

---

## 🔄 Updating Your Deployment

### Get Latest Changes from Main Repository

If you forked the repository:

1. Go to your fork on GitHub
2. Click **"Sync fork"** button
3. Click **"Update branch"**
4. Re-run the deployment workflow

### Deploy Changes After Updates

After syncing:
1. Go to **Actions** tab
2. Select **"Deploy to Azure"** workflow
3. Click **"Run workflow"**
4. Use the **same environment name** to update existing deployment

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- Verify service principal has Contributor role
- Check `AZURE_SUBSCRIPTION_ID` secret is correct

### "SubscriptionIsNotRegistered" Error
Run these commands:
```bash
az provider register --namespace Microsoft.App
az provider register --namespace Microsoft.ContainerService
```
Wait 5 minutes for registration, then retry deployment.

### "Resource name already exists"
- Choose a different environment name
- Or delete the existing resource group first

### "Invalid OpenAI Endpoint"
- Verify `AZURE_OPENAI_ENDPOINT` secret format: `https://your-name.openai.azure.com/`
- Ensure it ends with `/`

---

## 🔒 Security Best Practices

1. **Use Federated Identity (Optional - Advanced)**
   - The workflow uses OpenID Connect (OIDC) for secure authentication
   - No long-lived credentials stored

2. **Rotate Service Principal Secrets**
   - Rotate client secrets periodically
   - Use Azure Key Vault for production

3. **Limit Service Principal Scope**
   - Instead of subscription-level Contributor, scope to specific resource group:
   ```bash
   az ad sp create-for-rbac \
     --role Contributor \
     --scopes /subscriptions/SUB_ID/resourceGroups/rg-cora-dev
   ```

---

## 📊 Deployment Options

### Manual Deployment (Current Setup)
- Trigger: Click "Run workflow" button
- Best for: Testing, demos, controlled deployments

### Automatic Deployment on Push (Optional)
To enable automatic deployment when code changes:

Edit `.github/workflows/azure-deploy.yml` and add:
```yaml
on:
  workflow_dispatch:
    # ... existing inputs ...
  push:
    branches:
      - main
    paths:
      - 'src/**'
      - 'infra/**'
```

---

## 🎯 Next Steps

After successful deployment:

1. **Access your application** - Use the URL from deployment output
2. **Test the voice agent** - Follow the workshop modules
3. **Configure authentication** (optional) - See `docs/AZURE_AD_SETUP.md`
4. **Set up monitoring** - Application Insights is already configured

---

## 💡 Tips

- **Multiple environments**: Run workflow multiple times with different environment names (`dev`, `staging`, `prod`)
- **Cost management**: Delete test environments when not needed
- **Updates**: Sync fork regularly to get bug fixes and improvements
- **Logs**: Check Application Insights for production monitoring

---

## 🆘 Need Help?

- **GitHub Issues**: Report problems in the repository Issues tab
- **Deployment logs**: Check the Actions tab for detailed error messages
- **Azure Portal**: View resources in your resource group

---

## 📚 Related Documentation

- [Local Deployment Guide](modules/module2-infrastructure.md) - For workshop participants
- [Architecture Overview](modules/module1-overview.md) - Understand the system
- [Azure Resources Guide](AZURE_RESOURCES.md) - Details about deployed resources
