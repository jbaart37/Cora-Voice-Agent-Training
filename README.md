# Cora Voice Agent Workshop

**Building an AI-Powered Voice Agent Simulator with Azure AI Foundry**

## 🎯 Workshop Overview

This hands-on workshop teaches you how to build, deploy, and optimize an intelligent voice agent simulator using Azure AI Foundry, Azure Container Apps, and Azure OpenAI. By the end of this training, you'll have a fully functional AI agent that can simulate customer service conversations and provide real-time performance analytics.

## 🏗️ What You'll Build

- **Real-time Voice Agent Simulator**: Interactive web application for training customer service representatives
- **AI-Powered Conversation Analysis**: Leveraging Azure OpenAI GPT-4 for intelligent feedback
- **Performance Analytics Dashboard**: Track and visualize agent performance metrics
- **Enterprise-Ready Architecture**: Deployed on Azure Container Apps with managed identity and authentication

## 👥 Target Audience

- Azure developers and solution architects
- AI/ML practitioners interested in practical AI applications
- DevOps engineers working with containerized applications
- Anyone interested in building production-ready AI solutions

## 📚 Workshop Modules

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

- **Self-Paced**: 4-6 hours
- **Instructor-Led**: Full day (8 hours with breaks)
- **Capacity**: 10-20 participants

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

### Option A: Self-Paced Learning
1. Clone this repository
2. Start with [Module 1: Overview](./docs/modules/module1-overview.md)
3. Follow each module in sequence
4. Complete hands-on labs in the `labs/` folder

### Option B: Instructor-Led Training
1. Instructor will provide access to workshop materials
2. Follow along with live demonstrations
3. Complete labs during designated hands-on sessions
4. Ask questions in real-time

## 📂 Repository Structure

```
Cora-Voice-Agent-Training/
├── README.md                    # This file
├── docs/                        # Workshop documentation (GitHub Pages)
│   ├── index.md                # Workshop landing page
│   ├── modules/                # Module-by-module content
│   ├── assets/                 # Images and diagrams
│   └── instructor-guide.md     # Guidance for instructors
├── src/                        # Application source code
│   ├── app.py                  # Flask application
│   ├── agent.py               # AI agent logic
│   ├── storage_service.py     # Azure Storage integration
│   ├── static/                # Frontend assets
│   └── templates/             # HTML templates
├── infra/                      # Azure infrastructure as code
│   ├── main.bicep             # Bicep templates
│   └── azure.yaml             # AZD configuration
└── labs/                       # Hands-on lab exercises
    ├── lab1-setup/
    ├── lab2-infrastructure/
    ├── lab3-deployment/
    ├── lab4-ai-foundry/
    ├── lab5-analytics/
    ├── lab6-advanced/
    └── solutions/             # Lab solution code
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

**Ready to get started?** Head over to [Module 1: Solution Overview](./docs/modules/module1-overview.md) 🚀
