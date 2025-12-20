# CORA Voice Agent Training - Deployment Files

## 📦 What You're Looking At

This repository contains the **complete source code and infrastructure** for deploying the CORA Voice Agent Simulator to Azure. These files support both the **GitHub Pages training workshop** and **hands-on lab exercises**.

## 🗂️ Repository Structure

```
Cora-Voice-Agent-Training/
├── docs/                       # GitHub Pages training website
│   ├── _layouts/              # Jekyll page templates
│   ├── assets/                # CSS, JS, images
│   ├── modules/               # Training module content
│   └── pages/                 # Prerequisites, instructor guide
│
├── src/                        # ✨ Application source code
│   ├── app.py                 # Flask web application
│   ├── agent.py               # Azure OpenAI agent logic
│   ├── storage_service.py     # Azure Table Storage
│   ├── config.py              # Configuration management
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Container image
│   ├── static/                # Frontend (CSS/JS)
│   ├── templates/             # HTML pages
│   └── README.md              # 📖 Detailed source code documentation
│
├── infra/                      # ✨ Infrastructure as Code (Bicep)
│   ├── main.bicep             # Main deployment template
│   ├── core/                  # Modular Bicep components
│   └── README.md              # 📖 Infrastructure documentation
│
├── labs/                       # (Coming Soon) Hands-on lab exercises
│
├── azure.yaml                  # Azure Developer CLI configuration
└── README.md                   # This file
```

## 🎯 For Training Participants

### Option 1: Follow the Workshop
Visit the GitHub Pages training site for guided, self-paced learning:
**https://jbaart37.github.io/Cora-Voice-Agent-Training/**

The workshop includes:
- 📖 6 comprehensive modules
- 🎥 Demos and screenshots
- 💻 Code explanations
- 🧪 Lab exercises with solutions
- 📊 Progress tracking

### Option 2: Quick Deploy

Want to deploy immediately and explore? Use Azure Developer CLI:

```powershell
# Prerequisites: Install Azure Developer CLI
# https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd

# 1. Clone this repository
git clone https://github.com/jbaart37/Cora-Voice-Agent-Training.git
cd Cora-Voice-Agent-Training

# 2. Login to Azure
az login

# 3. Initialize and deploy
azd init
azd up

# That's it! ✅ Your app is now running in Azure
```

## 🎓 For Instructors

### Presentation Mode
The GitHub Pages site works great for classroom projection:
- Clean, professional design
- Dark/light theme toggle
- Mobile-responsive layout
- Offline-capable (cache static assets)

### Customization
All content is in Markdown - easy to edit:
```powershell
# Edit module content
code docs/modules/module1-overview.md

# Update prerequisites
code docs/pages/prerequisites.md

# Test locally with Jekyll
cd docs
bundle exec jekyll serve
```

See `docs/pages/instructor-guide.md` for teaching tips.

## 📚 Documentation Map

Depending on what you need:

| I want to... | Read this document |
|--------------|-------------------|
| Understand the source code | [src/README.md](src/README.md) |
| Deploy to Azure | [infra/README.md](infra/README.md) |
| Run locally for development | [src/README.md](src/README.md) |
| Learn about Azure AI Foundry | [Module 1](https://jbaart37.github.io/Cora-Voice-Agent-Training/modules/module1-overview.html) |
| Understand the architecture | [Module 2](https://jbaart37.github.io/Cora-Voice-Agent-Training/modules/module2-architecture.html) |
| Set up CI/CD pipeline | [infra/README.md](infra/README.md) - CI/CD section |
| Troubleshoot deployment issues | [infra/README.md](infra/README.md) - Troubleshooting |

## 🚀 Technology Stack

**Frontend:**
- HTML5 with Web Speech API (desktop browsers)
- JavaScript (WebSocket, Chart.js)
- Responsive CSS (mobile-friendly)

**Backend:**
- Python 3.11+ with Flask
- Flask-SocketIO (WebSocket support)
- Azure OpenAI SDK

**Azure Services:**
- **Azure AI Foundry**: GPT-4 agent deployment
- **Azure Container Apps**: Serverless hosting
- **Azure Container Registry**: Docker images
- **Azure Table Storage**: Analytics data
- **Application Insights**: Telemetry & monitoring

**DevOps:**
- Docker containerization
- Bicep (Infrastructure as Code)
- Azure Developer CLI (deployment automation)
- GitHub Actions (CI/CD)

## 🛠️ Development Workflow

### Local Development

```powershell
# 1. Set up Python environment
cd src
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt --pre

# 2. Configure environment variables
# Create src/.env with your Azure AI Foundry endpoint

# 3. Run locally
python app.py

# App runs on http://localhost:5000
```

### Test with Docker

```powershell
# Build and run container locally
docker build -t cora-voice-agent src/
docker run -p 5000:5000 --env-file src/.env cora-voice-agent
```

### Deploy to Azure

```powershell
# Single command deployment
azd up

# Or individual steps:
azd provision  # Create/update Azure resources
azd deploy     # Deploy application code
```

## 🔐 Security Best Practices

✅ **DO:**
- Use managed identity for Azure authentication (no API keys!)
- Store secrets in Azure Key Vault or Container App secrets
- Enable Easy Auth for production applications
- Use HTTPS only (Container Apps provides free SSL)
- Implement rate limiting for public APIs

❌ **DON'T:**
- Commit `.env` files to source control
- Hardcode API keys or connection strings
- Disable authentication in production
- Expose admin endpoints without auth
- Store secrets in Dockerfile or code

## 📊 Cost Estimation

**Development Environment** (scale-to-zero):
- Container Apps: ~$10/month
- Container Registry: ~$5/month
- Log Analytics: ~$3/month (5GB free)
- **Total: ~$18/month**

**Production Environment** (always-on):
- Container Apps: ~$50-100/month
- Azure OpenAI: Pay-per-token (varies by usage)
- Storage: <$1/month
- **Total: ~$55-105/month + AI usage**

**💡 Tip**: Use `azd down` to delete all resources when done!

## 🤝 Contributing

This is training material designed for learning and experimentation:
- ✅ Fork and modify for your own workshops
- ✅ Add new features and share back
- ✅ Report issues or suggest improvements
- ✅ Use in educational settings

## 📄 License

This training project is provided as-is for educational purposes.

## 🆘 Getting Help

1. **Check documentation**: Start with [src/README.md](src/README.md) and [infra/README.md](infra/README.md)
2. **Training modules**: Visit https://jbaart37.github.io/Cora-Voice-Agent-Training/
3. **Azure docs**: https://learn.microsoft.com/azure/
4. **GitHub Issues**: Report problems or ask questions

## 🎉 Quick Start Summary

For the impatient:

```powershell
# Install Azure Developer CLI
winget install microsoft.azd

# Deploy everything
git clone https://github.com/jbaart37/Cora-Voice-Agent-Training.git
cd Cora-Voice-Agent-Training
az login
azd up

# Done! 🚀
```

Your voice agent simulator is now running in Azure with:
- ✅ Production-grade infrastructure
- ✅ Automatic scaling
- ✅ Built-in monitoring
- ✅ HTTPS endpoints
- ✅ CI/CD ready

---

Happy Learning! 🎓

For questions or feedback about this training, open an issue or submit a pull request.
