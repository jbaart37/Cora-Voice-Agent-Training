---
layout: module
title: "Module 1: Getting Started - Repository & Azure Setup"
module_number: 1
duration: "30 minutes"
description: "Clone the repository, understand the structure, and prepare your Azure environment for deployment"
---

# Module 1: Getting Started - Repository & Azure Setup

<div class="module-intro">
  <p><strong>Duration:</strong> 30 minutes</p>
  <p><strong>Objective:</strong> Get the code, understand what you're deploying, and configure Azure credentials for deployment.</p>
</div>

---

## 📊 About Your Progress Tracking

As you work through this training, your completion status is tracked automatically:

✅ **How it works:**
- Checkboxes and progress are saved in your **browser's local storage**
- No login or account required
- Your progress persists across browser sessions (as long as you use the same browser)

⚠️ **Important Note:**
- If you **clear your browser cache/cookies**, your progress will be reset
- Progress is **browser-specific** (if you switch browsers, you'll start fresh)
- For persistent tracking, consider bookmarking your progress or taking notes

💡 **Pro Tip:** If you're working across multiple devices, keep a simple checklist in a text file or notebook!

---

## 🤖 Meet CORA: Your AI Training Partner

<div style="text-align: center; margin: 2em 0;">
  <img src="{{ site.baseurl }}/assets/images/cora-logo.png" alt="CORA Logo" style="width: 200px; height: auto;">
</div>

**CORA** stands for **C**ustomer-**O**riented **R**esponse **A**gent, but more importantly, she's the name we gave our AI training application! 🤖

**Why "CORA"?**
- Easy to remember (better than "Voice Agent Simulator v2.3")
- Friendly and approachable
- Represents a person (which is what she simulates!)
- **This is NOT an industry-standard acronym** - it's the unique name for this specific application

**What does CORA do?**

CORA is an AI-powered customer simulator that:
- **Role-plays as a customer** seeking help
- **Tests customer service agents** in training
- **Adapts personality** based on scenarios (happy, frustrated, confused, etc.)
- **Evaluates performance** with AI-powered scoring
- **Provides analytics** to track improvement over time

**Think of CORA as:** A digital customer who never gets tired of being asked the same questions, always gives constructive feedback, and never leaves a bad Yelp review. The perfect training partner! 🌟

**Business Value:**
- Train customer service teams safely without real customers
- Scale training without hiring actors
- Get consistent evaluation across all training sessions
- Track performance improvements with data

---

## 🗺️ What You'll Learn in This Training

This training is organized into modules that walk you through **deploying, testing, and understanding CORA**:

- **Module 1** (this module): Set up your development environment and Azure resources
- **Module 2**: Deploy CORA to Azure using Infrastructure as Code
- **Module 3**: Test CORA locally and understand the application architecture
- **Module 4**: Explore Azure services that power CORA
- **Module 5**: Monitor and troubleshoot your deployment
- **Module 6**: Customize and extend CORA for your needs

By the end, you'll have a fully functional AI training application running in Azure, and you'll understand how all the pieces work together!

---

## 🎯 Learning Objectives

By the end of this module, you will:

- [ ] Clone the training repository from GitHub
- [ ] Understand the repository structure (src/, infra/, docs/)
- [ ] Identify the key files needed for deployment
- [ ] Log in to Azure CLI and verify subscription access
- [ ] Locate your Azure AI Foundry project endpoint
- [ ] Prepare environment configuration for deployment

---

## 📥 Step 1: Get the Repository Code

You have three options to get the code on your local machine:

### Option A: Using Git Command Line (Recommended)

Open a terminal (PowerShell, Command Prompt, or Terminal) and run:

```bash
git clone https://github.com/jbaart37/Cora-Voice-Agent-Training.git
cd Cora-Voice-Agent-Training
```

**Why Git?** You can easily pull updates if we make changes to the training materials!

### Option B: Using Visual Studio Code

1. Open VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Git: Clone" and press Enter
4. Paste the repository URL: `https://github.com/jbaart37/Cora-Voice-Agent-Training.git`
5. Choose a local folder to clone into
6. Click "Open" when prompted

> 📸 **Screenshot placeholder**: VS Code Git Clone dialog

### Option C: Download as ZIP (No Git Required)

If you don't have Git installed or prefer not to use it:

1. Go to [https://github.com/jbaart37/Cora-Voice-Agent-Training](https://github.com/jbaart37/Cora-Voice-Agent-Training)
2. Click the green **Code** button
3. Click **Download ZIP**
4. Extract the ZIP file to a folder on your computer
5. Open the extracted folder in VS Code or your preferred editor

**Note:** If you download as ZIP, you won't be able to use Git commands, but all the code will work fine!

> 📸 **Screenshot placeholder**: GitHub showing Code → Download ZIP button

---

## 📂 Step 2: Understanding the Repository Structure

Once cloned, you'll see this structure:

Once cloned, you'll see this structure:

```
Cora-Voice-Agent-Training/
├── src/                        # 🐍 Application source code
│   ├── app.py                  # Flask web application
│   ├── agent.py                # Azure OpenAI agent logic
│   ├── storage_service.py      # Azure Table Storage
│   ├── config.py               # Configuration management
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Container image definition
│   ├── static/                 # CSS, JS, images
│   └── templates/              # HTML pages
│
├── infra/                      # ☁️ Infrastructure as Code (Bicep)
│   ├── main.bicep              # Main deployment template
│   ├── main.parameters.json    # Default parameters
│   └── core/                   # Modular components
│       ├── host/               # Container Apps, Registry
│       └── monitor/            # Logging, Application Insights
│
├── docs/                       # 📚 This training website
│   └── modules/                # Training modules you're reading now
│
├── azure.yaml                  # 🚀 Azure Developer CLI config
├── README.md                   # Repository overview
└── DEPLOYMENT_FILES_README.md  # Deployment guide
```

### Key Files to Know

| File | Purpose | You'll Need This For |
|------|---------|---------------------|
| `azure.yaml` | Tells Azure Developer CLI how to deploy | Module 2 deployment |
| `infra/main.bicep` | Defines all Azure resources to create | Understanding what gets deployed |
| `src/config.py` | Application configuration | Understanding environment variables |
| `src/README.md` | Developer documentation | Reference during troubleshooting |
| `infra/README.md` | Infrastructure documentation | Deployment options & cost info |

> 📸 **Screenshot placeholder**: VS Code Explorer showing repository structure

---

## 🔐 Step 3: Azure CLI Setup

Before deploying, you need to authenticate with Azure.

### Install Azure CLI (if not already installed)

**Windows:**
```powershell
winget install -e --id Microsoft.AzureCLI
```

**Mac:**
```bash
brew install azure-cli
```

**Linux:**
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Log In to Azure

```bash
az login
```

This will:
1. Open your browser
2. Prompt you to sign in with your Azure account
3. Return to the terminal when complete

> 📸 **Screenshot placeholder**: Azure CLI login success message

### Verify Your Subscription

```bash
# List all subscriptions you have access to
az account list --output table

# Set the subscription you want to use (if you have multiple)
az account set --subscription "Your Subscription Name"

# Verify it's set correctly
az account show --output table
```

**Important:** Make note of your **Subscription ID** - you'll need it later!

---

## 📦 Step 4: Plan Your Resource Group

**Critical Planning Step:** Before creating any Azure resources, let's plan where everything will live.

### Why Resource Groups Matter

Think of a resource group as a **folder for your Azure resources**. Everything for this project should go in the **same resource group**:

✅ **Benefits of keeping everything together:**
- 🧹 **Easy cleanup**: Delete the resource group = delete everything (no orphaned resources!)
- 💰 **Cost tracking**: See total cost for the entire project in one place
- 🔐 **Security management**: Grant access to the whole project with one permission assignment
- 📊 **Organization**: All related resources grouped logically

### Resource Group Naming

**Recommended naming convention:**
```
rg-cora-{environment}

Examples:
  rg-cora-dev      (for development)
  rg-cora-test     (for testing)
  rg-cora-prod     (for production)
```

**Good news:** When you run `azd up` in Module 2, it will automatically create the resource group for you! But it's important to understand why we use this pattern.

### Resources That Will Live Together

In Module 2, these will all be created in **one resource group**:
- Container Apps Environment
- Container App (your web application)
- Container Registry (stores Docker images)
- Storage Account (conversation scores)
- Log Analytics Workspace (logs)
- Application Insights (monitoring)

**💡 Pro Tip:** Some organizations have policies requiring separate resource groups for different resource types (compute vs storage vs networking). If your organization has such policies, discuss with your cloud governance team before deploying!

---

## 🤖 Step 5: Azure AI Foundry Project Setup

You need an **Azure AI Foundry project** with a deployed GPT model.

**Important:** When creating your AI Foundry project, use the **same resource group** you planned in Step 4, or be ready to specify an existing one.

### Option A: You Already Have a Project

If your organization provided a project, you need to get:

1. **Project Endpoint**
   - Format: `https://your-project.cognitiveservices.azure.com/`
   - Found in: Azure Portal → Your AI Foundry Project → Overview → Endpoint

2. **Model Deployment Name**
   - The name you gave your GPT deployment (e.g., `gpt-4o`, `gpt-4o-mini`)
   - Found in: AI Foundry Studio → Deployments

> 📸 **Screenshot placeholder**: Azure Portal showing AI Foundry endpoint
> 📸 **Screenshot placeholder**: AI Foundry Studio showing deployment name

### Option B: Create a New Project

If you need to create your own AI Foundry project:

1. Go to [Azure AI Foundry Studio](https://ai.azure.com/)
2. Click **+ New project**
3. Fill in:
   - Project name: `cora-voice-agent`
   - Subscription: Your Azure subscription
   - Resource group: **Use the same name pattern** (e.g., `rg-cora-dev`) - all resources go together!
   - Location: Choose a region (e.g., East US)
4. Click **Create**
5. Once created, go to **Deployments** → **+ Create deployment**
6. Select:
   - Model: `gpt-4o` or `gpt-4o-mini`
   - Deployment name: `gpt-4o-deployment`
7. Click **Deploy**

**Cost Note:** GPT-4o charges per token. Budget approximately:
- Development/Testing: ~$5-20/month
- Production: Varies by usage

---

## 📝 Step 5: Prepare Your Environment Variables

The deployment needs a few key pieces of information. You have two options:

### Option A: Interactive Deployment (Recommended for First Time)

When you run `azd up` in Module 2, it will prompt you for:
- Environment name (e.g., `cora-dev`)
- Azure subscription
- Azure region
- AI Foundry endpoint

**No file creation needed** - just have your AI Foundry endpoint ready!

### Option B: Pre-configure with .env File

If you want to prepare values in advance, create a file named `.env` in the root folder:

```env
# Azure AI Foundry Configuration
AZURE_AI_FOUNDRY_ENDPOINT=https://your-project.cognitiveservices.azure.com/
AZURE_AI_MODEL_NAME=gpt-4o-deployment

# Optional: API Key (if not using managed identity)
# AZURE_AI_FOUNDRY_API_KEY=your-api-key-here

# Azure Deployment Configuration
AZURE_SUBSCRIPTION_ID=your-subscription-id
AZURE_LOCATION=eastus
AZURE_ENV_NAME=cora-dev
```

**⚠️ Security Warning:** 
- Never commit `.env` files to Git!
- The repository includes `.gitignore` to prevent this
- In production, use Azure Key Vault for secrets

> 📸 **Screenshot placeholder**: VS Code showing .env file example

---

## ✅ Step 6: Verify You're Ready

Before moving to Module 2 (deployment), confirm you have:

- [ ] ✅ Repository code on your local machine (Git clone or ZIP download)
- [ ] ✅ Azure CLI installed and logged in (`az login` successful)
- [ ] ✅ Subscription ID identified
- [ ] ✅ Resource group naming pattern decided (e.g., `rg-cora-dev`)
- [ ] ✅ Azure AI Foundry project created with GPT model deployed (in your resource group!)
- [ ] ✅ AI Foundry endpoint URL copied
- [ ] ✅ Model deployment name noted

---

## 🏗️ What You'll Deploy in Module 2

Now that you're set up, here's what will be created when you deploy:

### Azure Resources

| Resource | Purpose | Estimated Cost | Why This? |
|----------|---------|---------------|-----------|
| **Container Apps Environment** | Hosting platform for your web app | ~$10/month | 🎯 Scales to $0 when idle! |
| **Container App** | Runs your voice agent application | Included | 💪 WebSocket-ready |
| **Container Registry** | Stores your Docker images | ~$5/month | 📦 Private & secure |
| **Storage Account** | Stores conversation scores | <$1/month | 💰 Cheapest option |
| **Log Analytics Workspace** | Collects logs and metrics | ~$3/month | 🔍 First 5GB free |
| **Application Insights** | Monitoring and telemetry | Free | 📊 Because blind deployments are scary |

**Total Estimated Cost:** ~$18-25/month for development environment

**💡 Pro Tip:** The Container App can scale to zero when idle = Netflix money saved! 🎬

---

## 🎭 Architectural Story Time: Why These Choices?

*Or: "How to sound smart in architecture review meetings"*

Let's talk about why we made specific technology choices. Spoiler alert: It's not just because they're shiny and new. 🌟

### 🥊 The Great Platform Battle: Container Apps vs The World

**The Contenders:**
- 🏃 **Azure Container Apps** (Our Champion!)
- 🦸 **Azure App Service** (The Reliable Veteran)
- ⚡ **Azure Functions** (The Speed Demon)
- 🚢 **Azure Kubernetes Service** (The "I Have a Team of DevOps Engineers")
- 🎨 **Low-code** (The "My Boss Saw This Demo")

**The Ultimate Showdown:**

| Feature | Container Apps | App Service | Functions | AKS | Low-Code |
|---------|---------------|-------------|-----------|-----|----------|
| **WebSocket Support** | ✅ Perfect | ✅ Works | ❌ "That's not my job" | ✅ Yes | ❌ Nope |
| **Scale to Zero** | ✅ $0 when idle! | ❌ Always hungry | ✅ Yes | ❌ Always running | ✅ Varies |
| **Setup Complexity** | ✅ Easy | ✅ Easy | ✅ Easy | ❌ PhD required | ✅ Point & click |
| **Control Level** | ✅ Full control | ✅ Full control | ⚠️ Stateless life | ✅ EVERYTHING | ❌ "You can't do that" |
| **Monthly Cost (idle)** | $0 🎉 | ~$50 💸 | $0 | ~$200 💀 | ~$5-20 |

**Why Container Apps Wins This Round:**

🎯 **Reason #1: WebSockets Are Not Negotiable**
```
Customer: "I want to talk to the AI in real-time!"
Functions: "Best I can do is check back every 5 seconds."
Container Apps: "Let's have a conversation!"
```

💰 **Reason #2: The CFO Will Love You**
```
Traditional App Service:
  Monday-Friday: Running ($$$)
  Weekend: Still running ($$$ for nothing!)
  Your vacation: Still running ($$$ while you're at the beach!)

Container Apps:
  In use: Running ($$$)
  Idle: Asleep ($0 - literally zero!)
  Your boss: 😊
```

🎓 **Reason #3: Production Path Is Smooth**
- Same platform from dev → test → prod
- No "works on my machine" surprises
- No re-architecture needed when traffic grows
- Your future self will thank you 🙏

**When to Pick the Alternatives:**

🦸 **App Service** - When:
- Your team already manages 50 App Services
- "If it ain't broke..." is your company motto
- You like paying for compute you're not using (we don't judge)

⚡ **Functions** - When:
- You're building a "process this file" app
- Stateless is your love language
- You enjoy debugging cold starts

🚢 **AKS** - When:
- You have a Kubernetes expert on speed dial
- Your architecture diagram looks like a city map
- You enjoy YAML files (lots of them)

🎨 **Low-Code** - When:
- Your app is basically a fancy form
- "Can you make this button blue?" is your biggest challenge
- Real-time features are not on the menu

---

### 🏗️ Infrastructure as Code: Because Clicking is for Chumps

**The Eternal Debate:**
- 👆 Click through Azure Portal (The Manual Labor Approach)
- 📝 Write Bicep templates (The Smart Person's Move)

**Let's Do Some Math:**

```
Scenario: Deploy to 3 environments (Dev, Test, Prod)

Manual Clicking Method:
  ⏱️  First environment: 45 minutes of clicking
  ⏱️  Second environment: 45 minutes (click... click... click...)
  ⏱️  Third environment: 45 minutes (are we done yet?)
  ⏱️  Fix a typo in all three: 1 hour (oops, which button was it?)
  ⏱️  Disaster recovery: Half a day (what did we click again?)
  🎯  Total: 3.5 hours + anxiety
  😓  Risk of RSI: High

Bicep IaC Method:
  ⏱️  Write template once: 30 minutes
  ⏱️  Deploy all three: 15 minutes (azd up × 3)
  ⏱️  Fix typo everywhere: 2 minutes (change 1 line, redeploy)
  ⏱️  Disaster recovery: 5 minutes (azd up again)
  🎯  Total: 52 minutes + confidence
  😎  Risk of RSI: Low (more time for coffee)
```

**But Wait, There's More!**

📚 **Version Control:**
```
Portal Clicking:
  Boss: "What changed last Tuesday?"
  You: "Uh... I think I clicked... something?"
  
Bicep with Git:
  Boss: "What changed last Tuesday?"
  You: "Here's the exact commit with explanation and code review."
  Boss: *promotes you*
```

🔒 **Security & Compliance:**
```
Portal Clicking:
  Auditor: "Show me your infrastructure configuration."
  You: *takes 50 screenshots*
  
Bicep Templates:
  Auditor: "Show me your infrastructure configuration."
  You: "Here's the repo. Everything's documented, versioned, and reviewed."
  Auditor: *smiles* (they never smile!)
```

💰 **Cost Control:**
```
Portal Clicking:
  Finance: "Why did our Azure bill double?"
  You: "Someone probably clicked Premium instead of Basic?"
  
Bicep Templates:
  Finance: "Why did our Azure bill double?"
  You: "Impossible. It's in the code. Line 42. Someone would need to commit a change."
  (Spoiler: It was Kevin. It's always Kevin.)
```

---

### 🚀 Azure Developer CLI: The "Deploy" Button We Always Wanted

**The Old Way:**
```powershell
# Step 1: Create resource group
az group create --name rg-cora-dev --location eastus

# Step 2: Deploy infrastructure
az deployment group create --resource-group rg-cora-dev --template-file infra/main.bicep --parameters @parameters.json

# Step 3: Build container
az acr build --registry myregistry --image app:v1 src/

# Step 4: Update container app
az containerapp update --name myapp --resource-group rg-cora-dev --image myregistry.azurecr.io/app:v1

# Steps 5-15: More commands...
# Step 16: Realize you forgot something
# Step 17: Start over
# Step 18: Question career choices
```

**The azd Way:**
```powershell
azd up
```

That's it. Seriously. ✨

**What Just Happened?**
- ✅ Created resource groups
- ✅ Deployed all infrastructure
- ✅ Built Docker images
- ✅ Pushed to registry
- ✅ Deployed application
- ✅ Configured environment variables
- ✅ Secured secrets
- ✅ Gave you deployment URLs
- ✅ Made you look good in standup

**For Your Team:**

```
Junior Dev: "How do I deploy to test?"
You: "azd env select test && azd up"
Junior Dev: "That's it?"
You: "That's it."
Junior Dev: *mind blown* 🤯

Senior Architect: "What about the database connection?"
You: "In the Bicep template. Auto-configured."
Architect: *nods approvingly*

Manager: "Can we replicate this for other projects?"
You: "Already did. Same pattern."
Manager: "Promotion time."
```

---

### 🔐 Managed Identity: The "Delete All Your Secrets" Strategy

**The Debate:**
- 🔑 API Keys (The Traditional "Please Don't Leak This" Method)
- 🎭 Managed Identity (The "We Live in the Future" Method)

**Comparison Time:**

```
API Key Approach:
  Step 1: Generate API key
  Step 2: Store in Key Vault
  Step 3: Grant app access to Key Vault
  Step 4: App reads key from Key Vault
  Step 5: App uses key to call service
  Step 6: Rotate key every 90 days
  Step 7: Update Key Vault
  Step 8: Restart apps
  Step 9: Get paged at 2 AM because rotation broke prod
  Step 10: Reconsider life choices

Managed Identity Approach:
  Step 1: Enable managed identity (checkbox)
  Step 2: Grant identity access to service (one command)
  Step 3: Done!
  Step 4-10: Go home on time
```

**The Real Kicker:**

🔓 **When Someone Says "The Key Leaked":**

```
API Key Scenario:
  Security Team: "The key is in a GitHub commit from 3 months ago!"
  You: *panic*
  You: *revoke key*
  You: *generate new key*
  You: *update Key Vault*
  You: *restart all services*
  You: *update documentation*
  You: *send postmortem*
  You: *update resume*

Managed Identity Scenario:
  Security Team: "The key is in... wait, there is no key."
  You: *sips coffee peacefully* ☕
```

💰 **The Math:**

```
API Key Management (Annual):
  Key Vault: $0.03 per 10K operations = ~$200/year
  Staff Time: 4 hours/quarter rotating keys = ~$5,000/year
  Incident Response: 1 leaked key/year = ~$10,000/year
  Total: ~$15,200/year
  
Managed Identity:
  Azure AD: FREE
  Staff Time: 0 hours
  Incident Response: Can't leak what doesn't exist
  Total: $0/year
  Savings: ~$15,200/year (that's a nice conference budget!)
```

---

### 🎯 Why This Architecture Scales (Without Breaking Your Budget)

**The Secret Sauce:** We designed this like a LEGO set, not a monolith.

**The Old Way (Monolith):**
```
Everything in one big app:
  Problem: Need to scale AI processing?
  Solution: Scale EVERYTHING (including the HTML)
  Result: Paying for CPU to serve static images 🤦
```

**The Smart Way (This Solution):**
```
┌─────────────┐
│  Frontend   │ ← Scales independently (or move to CDN for pennies)
└─────────────┘
       ↓
┌─────────────┐
│  API Layer  │ ← Scales 1-100 instances based on traffic
└─────────────┘
       ↓
┌─────────────┐
│  AI Layer   │ ← Microsoft scales this (not your problem!)
└─────────────┘
       ↓
┌─────────────┐
│  Storage    │ ← Infinite scale (seriously, try to break it)
└─────────────┘
```

**Real Talk Example:**

```
Black Friday Traffic Spike:

Monolith:
  9 AM: 10 users → 1 server ($50/day)
  10 AM: 100 users → "Server melting..." → Emergency scale → 5 servers ($250/day)
  11 AM: 1000 users → "EVERYTHING IS ON FIRE" → 20 servers ($1,000/day)
  12 PM: Traffic drops → Still running 20 servers → Still paying $1,000/day
  Next Day: Manually scale down → Pray you got it right
  
Container Apps (This Solution):
  9 AM: 10 users → Scales up → $5/day
  10 AM: 100 users → Scales up more → $15/day
  11 AM: 1000 users → Auto-scales to 20 instances → $50/day
  12 PM: Traffic drops → Auto-scales down → $10/day
  Next Day: Already at right size → $5/day
  You: *sleeping peacefully*
```

---

### 🎨 Code vs Low-Code: The Honest Conversation

**When Your Manager Says: "Why can't we just use [Low-Code Platform]?"**

*Here's your diplomatic response (backed by facts):*

**Low-Code is GREAT for:**
- ✅ "I need a form to collect vacation requests"
- ✅ "Can you connect Excel to SharePoint?"
- ✅ "The marketing team needs a simple dashboard"
- ✅ "We need this by Friday" (and it's really simple)

**Code is NECESSARY for:**
- ✅ "I need real-time bidirectional communication" (this app!)
- ✅ "We need custom AI logic"
- ✅ "Performance is critical"
- ✅ "We're expecting 10,000+ concurrent users"
- ✅ "We need to integrate with 7 different APIs, 3 databases, and a carrier pigeon"

**The Real Comparison:**

| Question | Low-Code Answer | Code Answer |
|----------|----------------|-------------|
| **"Can it do WebSockets?"** | "What's a WebSocket?" | "Yes, and here's the code." |
| **"Can it scale to 100K users?"** | "Have you tried... fewer users?" | "Yes, and here's the load test." |
| **"Can we customize the AI logic?"** | "You get what you get." | "Make it however you want." |
| **"What if we need to migrate?"** | "You're locked in, baby!" | "Export and go." |
| **"Can my nephew maintain this?"** | "Maybe!" | "If they know Python, yes." |

**The Hybrid Approach (Best of Both Worlds):**

Smart companies use BOTH:

```
Low-Code Frontend (Power Apps):
  "Submit a training request"
      ↓ calls API
Code Backend (This Solution):
  Complex AI + Real-time chat + Analytics
      ↓ stores data
Low-Code Dashboard (Power BI):
  "Look at pretty charts"
```

Everyone wins! 🎉

---

## 📚 Understanding Azure AI Foundry

*Now that we've had fun with architecture, let's get serious for a moment...*

### What is Azure AI Foundry?

**Azure AI Foundry** (formerly Azure AI Studio) is Microsoft's unified platform for:
- Building and deploying AI applications
- Managing AI models and deployments
- Orchestrating agents and multi-agent workflows
- Evaluating AI performance
- Implementing responsible AI practices

### How is it Different from Azure OpenAI?

| Azure OpenAI Service | Azure AI Foundry |
|---------------------|------------------|
| Just the GPT API | Complete AI development platform |
| Single model calls | Agents, orchestration, evaluation |
| Basic deployment | Full lifecycle management |
| Limited tooling | Integrated development environment |

**Think of it this way:**
- **Azure OpenAI** = Just the GPT engine
- **Azure AI Foundry** = The full development studio + engine + tools

## 🎯 Real-World Use Cases

### 1. Customer Service Training
- New hire onboarding
- Skills refreshers for experienced agents
- Testing new scripts or procedures
- Performance benchmarking

### 2. Quality Assurance
- Evaluate agent performance objectively
- Identify training gaps
- Compare agent effectiveness
- Monitor improvement trends

### 3. Scenario Testing
- Test edge cases (angry customers, complex issues)
- Practice difficult conversations safely
- Experiment with different approaches
- Build confidence before real interactions

---

## 🎬 Demo: What You'll Build

> 📸 **Screenshot/GIF placeholder**: Animated demo of the completed application
> - Landing page with authentication
> - Conversation interface with voice/text options
> - Mood selector (happy, frustrated, curious, etc.)
> - Live chat interaction
> - Analytics dashboard with charts

**Key Features:**
- 🎤 **Voice or Text Input** (voice on desktop browsers only)
- 💬 **Real-time Conversation** via WebSockets
- 🎭 **Mood-based Scenarios** (6 different customer personalities)
- 📊 **Performance Analytics** (5-point scoring across 5 criteria)
- 🔐 **Azure AD Authentication** (Easy Auth integration)
- 📈 **Progress Tracking** (historical scores with charts)

---

## 🔗 Resources

### Azure Documentation
- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-studio/)
- [Azure Container Apps Overview](https://learn.microsoft.com/azure/container-apps/)
- [Azure Developer CLI (azd)](https://learn.microsoft.com/azure/developer/azure-developer-cli/)

### Code References
- [src/README.md](https://github.com/jbaart37/Cora-Voice-Agent-Training/blob/main/src/README.md) - Application documentation
- [infra/README.md](https://github.com/jbaart37/Cora-Voice-Agent-Training/blob/main/infra/README.md) - Infrastructure guide
- [GitHub Repository](https://github.com/jbaart37/Cora-Voice-Agent-Training)

### Learning Resources
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Bicep Language](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)

---

## ❓ Troubleshooting

### "az login" fails

**Problem:** Browser doesn't open or authentication fails

**Solutions:**
- Try `az login --use-device-code` for manual code entry
- Check if your organization requires VPN
- Verify you have an Azure account with active subscription
- Clear browser cache and try again

### Can't find Azure AI Foundry endpoint

**Problem:** Not sure where to get the endpoint URL

**Solutions:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for your AI Foundry project name
3. Click on the resource
4. Look for "Endpoint" in the Overview or Keys and Endpoint section
5. Should look like: `https://<project-name>.cognitiveservices.azure.com/`

### Repository clone fails

**Problem:** Git clone command doesn't work

**Solutions:**
- Install Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Check your internet connection
- Try downloading as ZIP from GitHub (Code → Download ZIP)

---

## 📝 Knowledge Check

Before moving to Module 2, test your understanding:

1. **What are the three main folders in the repository?**
   <details>
   <summary>Click to reveal answer</summary>
   - <code>src/</code> (application code)
   - <code>infra/</code> (Azure infrastructure templates)
   - <code>docs/</code> (training website)
   </details>

2. **What information do you need from Azure AI Foundry?**
   <details>
   <summary>Click to reveal answer</summary>
   - Project endpoint URL
   - Model deployment name (e.g., gpt-4o-deployment)
   </details>

3. **What tool will you use to deploy in Module 2?**
   <details>
   <summary>Click to reveal answer</summary>
   Azure Developer CLI (<code>azd</code>)
   </details>

4. **What does CORA stand for?**
   <details>
   <summary>Click to reveal answer</summary>
   Customer-Oriented Response Agent - and it's the name of OUR application, not an industry acronym!
   </details>

---

## 🎓 Summary

In this module, you:
- ✅ Cloned the training repository
- ✅ Understood the code structure (src/, infra/, docs/)
- ✅ Logged in to Azure CLI
- ✅ Identified your AI Foundry project endpoint
- ✅ Prepared for deployment

**Next up:** Module 2 will walk you through deploying everything to Azure with a single command: `azd up`

---

<div class="module-navigation">
  <a href="../pages/prerequisites.html" class="nav-button prev">← Prerequisites</a>
  <a href="module2-infrastructure.html" class="nav-button next">Module 2: Deployment →</a>
</div>
