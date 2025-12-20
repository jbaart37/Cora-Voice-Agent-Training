---
layout: default
title: Prerequisites - Cora Workshop
description: Detailed prerequisites and setup requirements
---

# 📋 Workshop Prerequisites

This page provides detailed information about everything you'll need to complete the Cora Voice Agent Workshop successfully.

---

## 🎯 Azure Requirements

<div class="prereq-section">

### 1. Azure Subscription & Tenant

<div class="prereq-box">

**You will need:**

- **Azure tenant with active subscription**
  - Use a demo/development tenant (NOT your production tenant)
  - You likely already have access to an Azure tenant - just ensure your subscription is active

**Important:** All resources will be deployed to a **new resource group** that you'll create during the workshop. This resource group can be easily deleted and recreated, allowing you to repeat the training as many times as you'd like without affecting existing resources.

</div>

### 2. Required Azure Permissions

<div class="prereq-box">

**Good News!** 🎉 Our deployment process handles most permission assignments automatically. Here's what the solution uses:

| Role | Used For | Assigned To |
|------|----------|-------------|
| **Contributor** | Creating and managing Azure resources | Your user account (required) |
| **User Access Administrator** | Assigning managed identities | Your user account (required) |
| **Cognitive Services Contributor** | Azure OpenAI setup | Your user account (required) |

**Important:** You need **Contributor** and **User Access Administrator** roles on the subscription or resource group before starting. The deployment will automatically configure other permissions like:
- ✅ Managed identity for Container App
- ✅ Storage account role assignments
- ✅ Azure OpenAI access for the app

**To check your current permissions:**
```bash
az role assignment list --assignee $(az account show --query user.name -o tsv) \
  --query "[].roleDefinitionName" -o table
```

**Don't have the right permissions?** Ask your Azure administrator to grant you **Contributor** and **User Access Administrator** roles on the resource group you'll use for this workshop.

</div>

### 3. Azure Services & Quotas

<div class="prereq-box">

The workshop uses these Azure services:

<div class="service-list">

- **Azure Container Apps**
  - Purpose: Hosting the web application
  - Quota needed: 2 vCPUs

- **Azure OpenAI**
  - Purpose: GPT-4/GPT-4o for AI analysis
  - Quota needed: Access approved ([request here](https://aka.ms/oai/access))

- **Azure Storage Account**
  - Purpose: Table Storage for analytics data
  - Quota needed: 1 storage account

- **Azure AI Foundry** (formerly Azure AI Studio)
  - Purpose: AI project management and deployment

- **Azure Container Registry**
  - Purpose: Storing Docker images

- **Azure Log Analytics**
  - Purpose: Monitoring and diagnostics

- **Microsoft Entra ID** (Azure AD)
  - Purpose: Authentication

</div>

**Check Azure OpenAI access:**
```bash
az cognitiveservices account list --query "[?kind=='OpenAI']" -o table
```

</div>

</div>

---

## 💻 Development Tools

<div class="prereq-section">

### 1. IDE / Code Editor

<div class="prereq-box recommended">

**Recommended: Visual Studio Code**

- [Download VS Code](https://code.visualstudio.com/)

**Recommended Extensions:**
- Azure Account
- Azure Resources  
- Docker
- Python
- Bicep

**Alternatives:** Visual Studio, PyCharm, or any text editor

</div>

### 2. Command Line Tools

<div class="tool-grid">

<div class="tool-box">

#### Azure CLI

```bash
# Check if installed
az --version
```

**Installation:**
- Windows: [Download installer](https://aka.ms/installazurecliwindows)
- macOS: `brew install azure-cli`
- Linux: `curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash`

</div>

<div class="tool-box">

#### Azure Developer CLI (azd)

```bash
# Check if installed
azd version
```

**Installation:**
- Windows (PowerShell):
  ```powershell
  powershell -ex AllSigned -c "Invoke-RestMethod 'https://aka.ms/install-azd.ps1' | Invoke-Expression"
  ```
- macOS/Linux:
  ```bash
  curl -fsSL https://aka.ms/install-azd.sh | bash
  ```

</div>

<div class="tool-box">

#### Python 3.9+

```bash
# Check version
python --version
```

**Installation:**
- Download from [python.org](https://www.python.org/downloads/)

**Note:** Python packages will be installed automatically during deployment using the included `requirements.txt` file. No manual pip installations needed!

</div>

<div class="tool-box">

#### Git (Optional)

```bash
# Check if installed
git --version
```

**Installation:**
- Download from [git-scm.com](https://git-scm.com/downloads)

</div>

</div>

### 3. Docker (Optional)

<div class="prereq-box">

**NOT REQUIRED for this workshop!**

The workshop uses **Azure Developer CLI (azd)** for deployment, which performs cloud-based container builds. You do **NOT** need Docker Desktop installed.

**Advanced Option:** If you want to test containers locally or build images manually, you can optionally use:
- **Docker CLI** (command-line only): Included with Docker Desktop or standalone
- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/)

**Command-line build example (optional):**
```bash
# Only needed if you want to build/test locally
docker build -t myapp .
docker run -p 8080:8080 myapp
```

</div>

</div>

---

## 🎓 Knowledge Prerequisites

<div class="prereq-section">

<div class="prereq-box">

**Important Note on Speech Features:**

This workshop solution uses **browser-based Web Speech API** for voice recognition, NOT Azure Cognitive Services. This means:
- ✅ Works great on desktop browsers (Chrome, Edge, Safari)
- ⚠️ Mobile browsers support text chat only (no voice)
- 💰 No additional Azure speech costs
- 🎓 Perfect for learning and prototyping

In production, you could upgrade to Azure Cognitive Services Speech SDK for mobile support and enhanced features.

</div>

<div class="knowledge-grid">

<div class="knowledge-box required">

### ✅ Required Knowledge

**You NEED these skills:**

- **Basic Azure familiarity**
  - Navigate Azure Portal
  - Understand resource groups

- **Command line basics**
  - Run commands in terminal/PowerShell

- **Basic web application understanding**
  - URLs and HTTP requests

</div>

<div class="knowledge-box optional">

### 💡 Helpful But NOT Required

**Nice to have (but we'll teach you!):**

- Python programming experience
- Docker/containerization concepts
- AI/ML fundamentals
- Infrastructure as Code (Bicep/Terraform)

</div>

</div>

**Don't worry if you don't have these!** The workshop provides all code and detailed explanations.

</div>

---

## � Knowledge Requirements

<div class="prereq-section">

<div class="knowledge-grid">

<div class="knowledge-box required">

### ✓ Required Knowledge

- **Azure Portal basics**
  - Creating resource groups
  - Navigating Azure services
  
- **Command-line basics**
  - Running commands in terminal
  - Navigating directories (cd, ls/dir)
  
- **Web application concepts**
  - What is an API
  - Basic HTTP requests
  
- **AI/ML awareness**
  - General understanding of AI agents
  - Familiarity with ChatGPT or similar tools

</div>

<div class="knowledge-box optional">

### ○ Helpful But NOT Required

- **Python basics** - Code is provided with explanations
  
- **Docker concepts** - azd handles everything automatically
  
- **Infrastructure as Code** - Templates are pre-built
  
- **Azure AI Foundry** - We'll cover this in the workshop
  
- **DevOps/CI-CD** - Not needed for this workshop

</div>

</div>

</div>

---

## 🐍 Python Packages

<div class="prereq-section">

<div class="prereq-box">

### Included Dependencies

The workshop uses these Python packages (automatically installed during deployment):

**Web Framework:**
- Flask 3.1.0 - Web application framework
- Flask-SocketIO 5.4.1 - Real-time communication
- Flask-Login 0.6.3 - User authentication
- msal 1.31.1 - Microsoft authentication

**Azure SDKs:**
- azure-identity - Azure authentication
- azure-ai-inference - AI model integration
- azure-data-tables - Table Storage for analytics
- agent-framework-azure-ai - Microsoft Agent Framework

**Additional Tools:**
- python-dotenv - Environment configuration
- requests - HTTP library

**You don't need to install these manually!** The `requirements.txt` file is included and azd will handle installation during deployment.

</div>

</div>

---

## �📦 Workshop Files

<div class="prereq-section">

<div class="download-grid">

<div class="download-box">

### Option 1: Git Clone
**Recommended for Git users**

```bash
git clone https://github.com/yourusername/cora-voice-agent-training.git
cd cora-voice-agent-training
```

</div>

<div class="download-box highlighted">

### Option 2: Download ZIP
**No Git required!**

**[📦 Download Workshop Files](https://github.com/yourusername/cora-voice-agent-training/archive/refs/heads/main.zip)**

1. Download the ZIP file
2. Extract to a folder (e.g., `C:\Workshops\Cora`)
3. Open in VS Code

</div>

</div>

</div>

---

## 💰 Cost Estimate

<div class="prereq-section">

<div class="cost-box">

Running this workshop will incur Azure costs:

| Service | Estimated Cost | Notes |
|---------|----------------|-------|
| Azure Container Apps | $0.50-2.00/day | Free tier available |
| Azure OpenAI (GPT-4) | $0.03-0.10 per request | Based on token usage |
| Storage Account | <$0.10/day | Minimal data storage |
| Container Registry | $0.17/day | Basic tier |
| **Total per Day** | **$1-3** | Depends on usage |

**Total workshop cost: ~$5-10** (assuming 2-3 days of active use)

<div class="warning-box">

⚠️ **Important:** Remember to clean up resources after the workshop!

```bash
# Delete all workshop resources
az group delete --name rg-cora-workshop --yes --no-wait
```

</div>

</div>

</div>

---

## ✅ Pre-Workshop Checklist

<div class="prereq-section">

<div class="checklist-box">

Before starting Module 1, verify you have:

<div class="checklist-items">

- [ ] Azure subscription with Contributor access
- [ ] Azure CLI installed and logged in (`az login`)
- [ ] **Azure Developer CLI (azd) installed** (`azd version`) - **Required for deployment**
- [ ] Visual Studio Code installed
- [ ] Python 3.9+ installed
- [ ] Workshop files downloaded/cloned
- [ ] Azure OpenAI access approved (if not, request access)
- [ ] Internet connection for Azure deployments

</div>

**Test your setup:**
```bash
# Login to Azure
az login

# Set subscription
az account set --subscription "Your Subscription Name"

# Verify azd works
azd version

# Verify Docker works
docker run hello-world
```

</div>

</div>

---

## 🆘 Troubleshooting Common Setup Issues

<div class="prereq-section">

<div class="troubleshooting-grid">

<div class="trouble-box">

### "Azure OpenAI access denied"

**Solution:** Request access at [aka.ms/oai/access](https://aka.ms/oai/access)
- May take 1-2 business days
- Requires Microsoft account

</div>

<div class="trouble-box">

### "azd provision fails"

**Check:** Verify Azure region supports all required services

**Solution:** Use `az account list-locations -o table` to find alternative regions

</div>

<div class="trouble-box">

### "azd command not found"

**Solution:** Close and reopen terminal after installation, or add to PATH manually

</div>

<div class="trouble-box">

### "Insufficient Azure permissions"

**Solution:** Ask your Azure admin for Contributor role on a resource group

</div>

</div>

</div>

---

## 📞 Need Help?

<div class="help-grid">

<div class="help-box">
<i class="fas fa-chalkboard-teacher"></i>

**During Live Training**

Ask your instructor

</div>

<div class="help-box">
<i class="fab fa-github"></i>

**Self-Paced**

Create an issue on [GitHub](https://github.com/yourusername/cora-voice-agent-training/issues)

</div>

<div class="help-box">
<i class="fas fa-life-ring"></i>

**Azure Support**

[Azure Support Portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)

</div>

</div>

---

<div class="page-navigation">
  <a href="../index.html" class="nav-button prev">← Back to Home</a>
  <a href="../modules/module1-overview.html" class="nav-button next">Start Module 1 →</a>
</div>
