---
layout: default
title: Prerequisites
---

# Prerequisites

Before starting the Cora Voice Agent Workshop, ensure you have the following requirements in place.

## 🎯 What You Need

### 1. Microsoft Azure Environment

#### Azure Subscription
- **Active Azure Subscription** with sufficient credits
- Recommended: Use a **demo/development tenant** (not production)
- Required permissions:
  - **Contributor** role on the subscription or resource group
  - Ability to create the following resources:
    - Azure Container Apps
    - Azure Storage Account
    - Azure Container Registry
    - Azure Log Analytics Workspace

#### Azure AI Foundry (formerly Azure OpenAI)
- **Azure AI Foundry** access with:
  - **GPT-4** or **GPT-4o** model deployment
  - API access enabled
- If you don't have access, [apply here](https://aka.ms/oai/access)

### 2. Development Environment

#### Required Tools
- **Visual Studio Code** (recommended IDE)
  - [Download VS Code](https://code.visualstudio.com/)
  - Extensions (optional but helpful):
    - Azure Tools
    - Python
    - Docker
    - Bicep

#### Azure CLI
- **Azure CLI** (version 2.50.0 or later)
- [Install Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
- Verify installation:
  ```bash
  az --version
  az login
  ```

#### Azure Developer CLI (azd)
- **Azure Developer CLI** (for infrastructure deployment)
- [Install azd](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)
- Verify installation:
  ```bash
  azd version
  ```

#### Docker Desktop
- **Docker Desktop** (for local testing and container builds)
- [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Verify installation:
  ```bash
  docker --version
  ```

#### Python (Optional)
- **Python 3.11+** (for local testing)
- [Download Python](https://www.python.org/downloads/)
- Only needed if you want to run the Flask app locally before containerization

### 3. Source Code

Choose **one** of the following options:

#### Option A: Git Clone (Recommended)
If you're comfortable with Git:
```bash
git clone https://github.com/[YOUR-REPO]/cora-voice-agent-training.git
cd cora-voice-agent-training
```

#### Option B: Download ZIP Package
If you're not familiar with Git:
1. Download the complete package: [Download Workshop Files (ZIP)](https://github.com/[YOUR-REPO]/cora-voice-agent-training/archive/refs/heads/main.zip)
2. Extract the ZIP file to your local machine
3. Open the folder in VS Code

### 4. Azure Entra ID (formerly Azure AD)

For authentication, you'll configure:
- **App Registration** in Azure Entra ID
- **Redirect URIs** for Container Apps authentication
- **API Permissions** (optional, for extended features)

*Don't worry - we'll walk through this step-by-step in Module 2!*

## ✅ Pre-Workshop Checklist

Before the workshop begins, verify:

- [ ] Azure subscription access confirmed
- [ ] Azure AI Foundry access approved (GPT-4/GPT-4o deployed)
- [ ] Azure CLI installed and logged in (`az login`)
- [ ] Azure Developer CLI (azd) installed
- [ ] Docker Desktop installed and running
- [ ] VS Code installed
- [ ] Workshop files downloaded or cloned
- [ ] Contributor role assigned on Azure subscription/resource group

## 💡 Don't Worry About Code!

**This is a LOW-CODE workshop!** We provide:
- ✅ All Python code (fully commented and explained)
- ✅ All infrastructure templates (Bicep files)
- ✅ All configuration files
- ✅ Step-by-step deployment commands

**You'll learn by:**
- Understanding the architecture
- Following guided deployments
- Making small configuration changes
- Testing and validating

**No prior Python, Flask, or Azure experience required!** If you can copy/paste commands and follow along, you can complete this workshop successfully.

## 🆘 Need Help?

If you're missing any prerequisites or encounter setup issues:
- Check the [Troubleshooting Guide](troubleshooting.html)
- Review the [Instructor Guide](instructor-guide.html)
- Reach out to your instructor (if instructor-led)

## 🚀 Ready to Start?

Once you've completed the checklist above, you're ready to begin!

[← Back to Home](./) | [Start Module 1 →](module1-overview.html)
