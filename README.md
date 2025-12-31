# Cora Voice Agent Training

**Building an AI-Powered Voice Agent Simulator with Azure AI Foundry**

## 🎯 Training Overview

This comprehensive hands-on training teaches you how to build, deploy, and optimize an intelligent voice agent simulator using Azure AI Foundry, Azure Container Apps, and Azure OpenAI. By the end of this training, you'll have a fully functional AI agent that can simulate customer service conversations and provide real-time performance analytics.

**📺 [Visit the Interactive Training Site](https://jbaart37.github.io/Cora-Voice-Agent-Training/)** - Complete modules, track progress, and earn your certificate!

## 🏗️ What You'll Build

- **Real-time Voice Agent Simulator**: Interactive web application for training customer service representatives
- **AI-Powered Conversation Analysis**: Leveraging Azure OpenAI GPT-4 for intelligent feedback
- **Performance Analytics Dashboard**: Track and visualize agent performance metrics
- **Enterprise-Ready Architecture**: Deployed on Azure Container Apps with managed identity and authentication

## 👥 Target Audience

- Azure developers and solution architects
- AI/ML practitioners interested in practical AI applications
- DevOps engineers working with containerized applications
- Customer service trainers looking to leverage AI
- Anyone interested in building production-ready AI solutions

## 📚 Training Modules

### Module 1: Solution Overview & AI Foundry Integration (30 mins)
- Architecture walkthrough
- Understanding AI Foundry's role
- Real-world use cases
- Prerequisites and setup

### Module 2: Infrastructure Setup (45 mins)
- Azure Developer CLI (azd) introduction
- Container Apps environment
- Storage Account configuration
- Azure AD/Entra authentication

### Module 3: Application Deployment (60 mins)
- Flask application structure
- WebSocket real-time communication
- Frontend development (HTML/CSS/JS)
- Docker containerization
- Deploying to Azure Container Apps

### Module 4: Azure OpenAI & AI Foundry Connection (45 mins)
- AI Foundry project setup
- GPT-4 model deployment
- Agent configuration and prompt engineering
- Testing conversation flows

### Module 5: Analytics Dashboard (45 mins)
- Implementing Chart.js visualizations
- Azure Table Storage integration
- User-specific analytics with managed identity
- Performance metrics calculation

### Module 6: Advanced Topics (Optional - 45 mins)
- Application health monitoring
- AI Foundry evaluation tools
- Conversation completions review
- Prompt optimization strategies
- Production readiness

## ⏱️ Duration

- **Self-Paced**: 4-6 hours (complete all 6 modules)
- **Interactive Online**: Learn at your own pace with progress tracking
- **Instructor-Led**: Full day (8 hours with breaks)
- **Certificate**: Earn upon completing all modules

## 🔧 Prerequisites

### Required
- Active Azure subscription with Owner or Contributor access
- Azure CLI installed locally
- Git installed
- Visual Studio Code or preferred code editor
- Basic understanding of:
  - Python programming
  - Web development (HTML/CSS/JavaScript)
  - Azure fundamentals
  - Command-line interfaces

### Recommended
- Docker Desktop (for local testing)
- Postman or similar API testing tool
- Basic knowledge of REST APIs and WebSockets

## 💰 Estimated Azure Costs

Running this workshop will incur minimal Azure costs:
- **Container Apps**: ~$0.50-2.00/day
- **OpenAI GPT-4**: ~$0.03-0.06 per 1K tokens
- **Storage Account**: <$0.10/day
- **Total Estimated**: $5-10 for full workshop completion

**💡 Tip**: Clean up resources after completion to avoid ongoing charges.

## 🚀 Getting Started

Choose your learning path:

### Option A: Interactive Training Site (Recommended)
1. Visit [https://jbaart37.github.io/Cora-Voice-Agent-Training/](https://jbaart37.github.io/Cora-Voice-Agent-Training/)
2. Complete all 6 modules with guided instructions
3. Track your progress through the training
4. Earn your completion certificate

### Option B: GitHub Repository
1. Clone this repository
2. Copy `.env.example` to `.env` and fill in your Azure credentials
3. Start with [Module 1: Overview](./docs/modules/module1-overview.md)
4. Follow each module in sequence with hands-on exercises
5. All code and infrastructure files are included

### Option C: Instructor-Led Training
1. Instructor will provide access to training materials
2. Follow along with live demonstrations
3. Complete exercises during designated hands-on sessions
4. Ask questions in real-time

---

## ⚡ Quick Deployment Options

Choose how you want to deploy the application:

### 🔵 Option 1: GitHub Actions Deployment (No Local Setup Required)

**Best for:** Quick deployments without installing local tools

[![Deploy to Azure](https://img.shields.io/badge/Deploy%20to-Azure-blue?style=for-the-badge&logo=microsoftazure)](docs/GITHUB_ACTIONS_DEPLOYMENT.md)

**Steps:**
1. Fork this repository
2. Configure GitHub Secrets with Azure credentials
3. Click "Run workflow" to deploy
4. ✅ No Docker Desktop, no local azd needed!

📖 **[Full GitHub Actions Setup Guide](docs/GITHUB_ACTIONS_DEPLOYMENT.md)**

### 🟢 Option 2: Local Deployment with azd

**Best for:** Workshop participants and developers who want to customize

**Requirements:** Docker Desktop, Azure CLI, azd

**Steps:**
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Cora-Voice-Agent-Training.git
cd Cora-Voice-Agent-Training

# Deploy with Azure Developer CLI
azd up
```

📖 **Follow the workshop modules for detailed local deployment instructions**

## 📂 Repository Structure

```
Cora-Voice-Agent-Training/
├── README.md                    # This file
├── .env.example                # Configuration template (copy to .env)
├── docs/                        # Training site (GitHub Pages)
│   ├── index.html              # Training landing page
│   ├── modules/                # 6 training modules with hands-on exercises
│   │   ├── module1-overview.md
│   │   ├── module2-infrastructure.md
│   │   ├── module3-deployment.md
│   │   ├── module4-ai-foundry.md
│   │   ├── module5-analytics.md
│   │   └── module6-advanced.md
│   ├── assets/                 # Images, screenshots, and diagrams
│   ├── certificate.html        # Training certificate generator
│   └── js/                     # Interactive features and progress tracking
├── src/                        # Complete application source code
│   ├── app.py                  # Flask application
│   ├── agent.py                # AI agent logic
│   ├── auth.py                 # Azure AD authentication
│   ├── config.py               # Configuration management
│   ├── static/                 # Frontend assets (CSS, JS)
│   │   ├── css/style.css       # Application styles
│   │   └── js/app.js           # Frontend logic
│   └── templates/              # HTML templates
│       ├── index.html          # Main application
│       └── landing.html        # Landing page
├── infra/                      # Azure infrastructure as code (Bicep)
│   ├── main.bicep              # Main infrastructure template
│   ├── main.parameters.json    # Deployment parameters
│   └── core/                   # Reusable Bicep modules
├── azure.yaml                  # Azure Developer CLI configuration
├── Dockerfile                  # Container image definition
└── requirements.txt            # Python dependencies
```

## 🎓 Learning Objectives

By completing this workshop, you will:

✅ Understand Azure AI Foundry architecture and capabilities  
✅ Deploy production-ready AI applications using Azure Container Apps  
✅ Implement real-time communication with WebSockets  
✅ Integrate Azure OpenAI GPT-4 for intelligent conversation analysis  
✅ Build analytics dashboards with Chart.js and Azure Table Storage  
✅ Configure managed identity and Azure AD authentication  
✅ Apply best practices for AI application monitoring and optimization  

## 📖 Additional Resources

- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-foundry/)
- [Azure Container Apps Documentation](https://learn.microsoft.com/azure/container-apps/)
- [Azure OpenAI Service](https://learn.microsoft.com/azure/ai-services/openai/)
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/)

## 🤝 Contributing

This is a training workshop. If you're an instructor or have suggestions for improvements, please open an issue or submit a pull request.

## 📄 License

This workshop is provided for educational purposes.

## 🆘 Support

- **Issues**: Use GitHub Issues for bugs or questions
- **Instructor-Led**: Ask your instructor during live sessions
- **Community**: Join Azure community forums

---

**Ready to get started?** 

🌐 [Launch Interactive Training Site](https://jbaart37.github.io/Cora-Voice-Agent-Training/)  
📖 Or start with [Module 1: Solution Overview](./docs/modules/module1-overview.md) 🚀
