# Voice Agent Simulator - Source Code

## 📁 What's in this folder?

This folder contains the **complete, production-ready source code** for the CORA Voice Agent Simulator. All files have been sanitized to remove environment-specific settings and include extensive learning comments.

## 🏗️ Architecture Overview

```
src/
├── app.py                    # Flask web application & API routes
├── agent.py                  # Azure OpenAI agent logic
├── storage_service.py        # Azure Table Storage integration
├── config.py                 # Configuration management
├── requirements.txt          # Python dependencies
├── Dockerfile               # Container image definition
├── .dockerignore            # Docker build exclusions
├── static/                  # Frontend assets (CSS, JS, images)
├── templates/               # HTML templates
└── README.md                # This file
```

## 🚀 Quick Start - Local Development

### Prerequisites
- Python 3.11+
- Azure CLI (`az login`)
- Azure AI Foundry project with GPT-4 deployment
- (Optional) Azure Storage Account for analytics

### Step 1: Install Dependencies

```powershell
# Navigate to src folder
cd src

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install packages (note the --pre flag for preview packages)
pip install -r requirements.txt --pre
```

### Step 2: Configure Environment

Create a `.env` file in the `src/` folder:

```env
# REQUIRED: Azure AI Foundry Configuration
AZURE_AI_FOUNDRY_ENDPOINT=https://your-project.cognitiveservices.azure.com/
AZURE_AI_MODEL_NAME=gpt-4o

# OPTIONAL: API Key (if not using Azure CLI auth)
# AZURE_AI_FOUNDRY_API_KEY=your-api-key-here

# OPTIONAL: Storage for analytics (leave empty to run without analytics)
# AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...

# Flask Configuration
FLASK_SECRET_KEY=dev-secret-please-change-in-production
FLASK_ENV=development
FLASK_PORT=5000
```

**Security Note**: NEVER commit `.env` files to source control!

### Step 3: Run Locally

```powershell
# Make sure you're in src/ folder and venv is activated
python app.py
```

Open browser to: http://localhost:5000

## 🔐 Authentication Options

The app supports three authentication modes:

1. **Azure AD / Entra ID** (Production)
   - Configured in Azure Container Apps "Easy Auth"
   - No code changes needed - handled by platform
   - See: AZURE_AD_SETUP.md in root folder

2. **Local Username/Password** (Development)
   - Set in environment variables:
     ```env
     LOCAL_ADMIN_PASSWORD=admin123
     LOCAL_USER_PASSWORD=user123
     ```
   - Users: `admin` and `user`

3. **Anonymous** (Demo Mode)
   - Disable authentication for demos
   - Not recommended for production

## 📊 Key Features & Learning Points

### 1. **Azure AI Integration** (`agent.py`)
- Uses Azure OpenAI SDK with DefaultAzureCredential
- Supports both API key and managed identity authentication
- Implements conversation history and mood-based scenarios
- Demonstrates prompt engineering best practices

### 2. **WebSocket Communication** (`app.py`)
- Flask-SocketIO for real-time bidirectional communication
- Enables live conversation updates
- Async message processing with proper error handling

### 3. **Azure Table Storage** (`storage_service.py`)
- Stores conversation scores for analytics dashboard
- Uses PartitionKey (user) + RowKey (conversation_id) design
- Supports both connection string (dev) and managed identity (prod)
- Demonstrates efficient NoSQL querying patterns

### 4. **Configuration Management** (`config.py`)
- All settings loaded from environment variables
- Validation at startup (fail-fast principle)
- Different configs for dev vs production
- Demonstrates 12-factor app methodology

### 5. **Observability** (OpenTelemetry)
- Automatic instrumentation with Azure Monitor
- Traces HTTP requests, dependencies, exceptions
- Custom spans for agent operations
- Production-grade monitoring with minimal code

## 🐳 Docker Containerization

### Build Image

```powershell
# From src/ folder
docker build -t voice-agent-simulator .
```

### Run Container Locally

```powershell
docker run -p 5000:5000 --env-file .env voice-agent-simulator
```

**Note**: The Dockerfile is production-ready and optimized for Azure Container Apps.

## 📈 Analytics Dashboard

The app includes a Chart.js-based analytics dashboard showing:
- **Total Scores Over Time**: Line chart tracking improvement
- **Score Distribution**: Breakdown of 5 evaluation criteria
- **Conversation Statistics**: Message counts, trends

Analytics are stored in Azure Table Storage with schema:
- **PartitionKey**: user_identity (lowercase)
- **RowKey**: conversation_id (UUID)
- **Fields**: 5 individual scores + total + feedback

## 🔧 Customization Guide

### Change Agent Personality

Edit `config.py` → `AGENT_SYSTEM_PROMPT`:
```python
AGENT_SYSTEM_PROMPT = """You are <name>, a <role>...
Your goals:
1. <goal 1>
2. <goal 2>
..."""
```

### Add New Evaluation Criteria

1. Update `agent.py` → `analyze_interaction()` prompt
2. Modify `storage_service.py` → add new field to entity
3. Update frontend `app.js` → add to Chart.js config

### Enable Speech Recognition

The app includes placeholder audio handling:
1. Install Azure Speech SDK: `pip install azure-cognitiveservices-speech`
2. Implement audio processing in `handle_audio()` function
3. Update frontend to capture microphone input

## 🧪 Testing & Demo Data

### Seed Demo Analytics Data

```powershell
# POST to /api/admin/seed-demo-data
curl -X POST http://localhost:5000/api/admin/seed-demo-data
```

This creates sample conversation scores for testing the analytics dashboard.

**Important**: Secure or remove this endpoint in production!

## 🚢 Deployment to Azure

Instead of manual deployment, use **Azure Developer CLI (azd)** for simplified deployment:

```powershell
# From root folder (not src/)
cd ..

# Initialize azd (first time only)
azd init

# Deploy everything (infrastructure + code)
azd up
```

See `infra/README.md` for detailed infrastructure documentation.

## 📝 File-by-File Guide

### Core Application Files

| File | Purpose | Key Learning |
|------|---------|--------------|
| `app.py` | Flask routes & WebSocket handlers | API design, async patterns |
| `agent.py` | AI agent logic | Azure OpenAI, prompt engineering |
| `storage_service.py` | Data persistence | Table Storage, managed identity |
| `config.py` | Settings management | 12-factor app, env vars |

### Frontend Files

| File | Purpose |
|------|---------|
| `static/css/style.css` | UI styling (responsive design) |
| `static/js/app.js` | JavaScript logic (WebSocket, Chart.js) |
| `templates/index.html` | Main application UI |
| `templates/landing.html` | Authentication page |

### Deployment Files

| File | Purpose |
|------|---------|
| `requirements.txt` | Python dependencies |
| `Dockerfile` | Container image definition |
| `.dockerignore` | Files excluded from image |

## 🎓 Learning Resources

- **Azure AI Foundry**: https://learn.microsoft.com/azure/ai-studio/
- **Azure OpenAI**: https://learn.microsoft.com/azure/ai-services/openai/
- **Azure Table Storage**: https://learn.microsoft.com/azure/storage/tables/
- **Flask-SocketIO**: https://flask-socketio.readthedocs.io/
- **Azure Container Apps**: https://learn.microsoft.com/azure/container-apps/

## ❓ Troubleshooting

### "Failed to initialize voice agent"
- Check `AZURE_AI_FOUNDRY_ENDPOINT` is set correctly
- If no API key: Run `az login` and ensure you have access
- Verify model name matches your deployment

### "Table client not initialized"
- Storage is optional - app works without analytics
- Check `AZURE_STORAGE_CONNECTION_STRING` if you want analytics
- In Azure: Ensure managed identity has "Storage Table Data Contributor" role

### WebSocket connection fails
- Check firewall allows port 5000
- In Azure: Container Apps handles WebSocket automatically
- Verify CORS settings if frontend on different domain

## 🤝 Contributing

This is training material - feel free to:
- Experiment with the code
- Add new features
- Improve documentation
- Share with others

## 📄 License

This training project is provided as-is for educational purposes.
