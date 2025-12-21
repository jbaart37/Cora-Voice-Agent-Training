---
layout: module
title: "Module 3: Application Deployment"
module_number: 3
duration: "60 minutes"
description: "Deploy the Flask application to Azure Container Apps"
---

# Module 3: Application Deployment

<div class="celebration-banner">
  🚀 <strong>Look at you go!</strong> Two modules down, and you've already got Azure infrastructure running. Time to put some actual application code on those fancy resources you just created! 💪
</div>

<div class="module-intro">
  <p><strong>Duration:</strong> 60 minutes</p>
  <p><strong>Objective:</strong> Understand the Flask application code, containerization process, and deployment to Azure Container Apps.</p>
</div>

---

## 🎯 Learning Objectives

By the end of this module, you will:

- [ ] Understand the Flask application structure and key files
- [ ] Explore the frontend HTML/CSS/JavaScript implementation
- [ ] Learn how Docker containerization works (without needing Docker Desktop!)
- [ ] Deploy the application using azd cloud builds
- [ ] Access and test the deployed web application

---

## � Prerequisites Check

Before starting, ensure Module 2 is complete:

- ✅ Azure infrastructure deployed via `azd up`
- ✅ Resource group created with Container App, Registry, Storage
- ✅ Application endpoint URL available
- ✅ No build or deployment errors

**Quick verification:**

```bash
# Check deployment status
azd show

# Verify your app URL is accessible
# Example: https://ca-cora-dev.happyocean-a1b2c3d4.eastus.azurecontainerapps.io
```

---

## 🏗️ Understanding the Application Architecture

CORA is a Flask-based web application with these key components:

### Application Files

| File | Purpose | Lines of Code |
|------|---------|---------------|
| `app.py` | Flask web server, routes, authentication | ~500 |
| `agent.py` | AI agent integration with Azure OpenAI | ~200 |
| `storage_service.py` | Azure Table Storage operations | ~150 |
| `config.py` | Environment configuration management | ~50 |
| `auth.py` | Azure AD authentication (optional) | ~100 |

### Frontend Files

| File | Purpose |
|------|---------|
| `templates/index.html` | Main UI structure, conversation interface |
| `templates/landing.html` | Landing page with auth |
| `static/css/style.css` | Styling, themes, animations |
| `static/js/app.js` | Real-time chat, speech recognition, analytics |

### Infrastructure Files (Already Deployed!)

| File | Purpose |
|------|---------|
| `infra/main.bicep` | Main infrastructure template |
| `infra/core/*` | Reusable Bicep modules |
| `azure.yaml` | azd configuration |
| `Dockerfile` | Container build instructions |

---

## 🔍 Step 1: Explore the Application Code

Let's understand what you just deployed!

### The Flask Web Server (`app.py`)

Open `app.py` in your code editor. Here are the key routes:

#### 1. **Home Route** - Serves the Main UI

```python
@app.route('/')
def index():
    """Main conversation interface"""
    return render_template('index.html')
```

**What it does:** Loads the chat interface where users interact with CORA.

#### 2. **Chat Route** - Processes Voice Agent Requests

```python
@app.route('/chat', methods=['POST'])
def chat():
    """Process chat message and return AI response"""
    data = request.json
    user_message = data.get('message', '')
    conversation_id = data.get('conversation_id')
    
    # Call AI agent
    response = voice_agent.process_message(user_message, conversation_id)
    
    # Store interaction in Azure Table Storage
    storage_service.save_conversation(conversation_id, user_message, response)
    
    return jsonify(response)
```

**What it does:**
1. Receives user message from frontend
2. Sends message to Azure OpenAI via agent
3. Saves conversation score to Table Storage
4. Returns AI response to user

#### 3. **Analytics Route** - Fetches Conversation Data

```python
@app.route('/api/analytics')
def get_analytics():
    """Return conversation metrics for charts"""
    conversations = storage_service.get_recent_conversations(days=30)
    return jsonify(conversations)
```

**What it does:** Powers the analytics dashboard with historical data.

---

### The AI Agent (`agent.py`)

This file handles communication with Azure OpenAI:

**Key Functions:**

```python
class VoiceAgent:
    def __init__(self):
        # Initialize Azure OpenAI client
        self.client = AzureOpenAI(
            azure_endpoint=os.getenv('AZURE_OPENAI_ENDPOINT'),
            api_key=managed_identity_credential,  # Uses Managed Identity!
            api_version='2024-08-01-preview'
        )
    
    def process_message(self, user_message, conversation_id):
        # Send to GPT-4o model
        response = self.client.chat.completions.create(
            model=os.getenv('AZURE_OPENAI_DEPLOYMENT_NAME'),
            messages=[
                {"role": "system", "content": "You are CORA, a helpful voice agent..."},
                {"role": "user", "content": user_message}
            ]
        )
        
        # Score the conversation quality (1-5)
        score = self.evaluate_response(response)
        
        return {
            'response': response.choices[0].message.content,
            'score': score,
            'conversation_id': conversation_id
        }
```

**🔑 Key Insight:** Notice there's no API key in the code! The application uses **Managed Identity** to authenticate with Azure OpenAI. This is a security best practice.

---

### Storage Service (`storage_service.py`)

Handles saving and retrieving conversation data from Azure Table Storage:

```python
class StorageService:
    def __init__(self):
        # Connect to Azure Table Storage using Managed Identity
        self.table_client = TableClient.from_table_url(
            table_url=f"{storage_account_url}/conversations",
            credential=DefaultAzureCredential()
        )
    
    def save_conversation(self, conversation_id, user_message, ai_response, score):
        """Save conversation to Table Storage"""
        entity = {
            'PartitionKey': conversation_id,
            'RowKey': str(uuid.uuid4()),
            'Timestamp': datetime.utcnow(),
            'UserMessage': user_message,
            'AIResponse': ai_response,
            'Score': score
        }
        self.table_client.create_entity(entity)
```

**Why Table Storage?**
- Cost-effective (~$0.045 per 10,000 transactions)
- NoSQL flexibility
- Perfect for conversation logs
- Native Azure integration

---

## 🎨 Step 2: Explore the Frontend Implementation

### The Main UI (`templates/index.html`)

Open `templates/index.html` and find these key sections:

#### Conversation Interface

```html
<div class="chat-container">
    <div id="messages" class="messages-list">
        <!-- Messages appear here -->
    </div>
    
    <div class="input-area">
        <button id="voiceBtn" class="voice-button">
            🎤 Start Voice
        </button>
        <input type="text" id="messageInput" placeholder="Type a message...">
        <button id="sendBtn">Send</button>
    </div>
</div>
```

#### Analytics Dashboard

```html
<div class="analytics-section">
    <canvas id="scoreChart"></canvas>
    <canvas id="volumeChart"></canvas>
    <div id="recentConversations"></div>
</div>
```

**What makes it work:** Chart.js for visualizations, AJAX for real-time updates.

---

### Voice Recognition (`static/js/app.js`)

**🎤 Important:** This app uses the **Web Speech API** (browser native), NOT Azure Cognitive Services.

#### Speech-to-Text Implementation

```javascript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    sendMessage(transcript);
};

voiceButton.addEventListener('click', () => {
    recognition.start();
});
```

#### Text-to-Speech Implementation

```javascript
const synth = window.speechSynthesis;

function speakResponse(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.getVoices()[0];
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    synth.speak(utterance);
}
```

**Platform Support:**

| Platform | Speech Recognition | Speech Synthesis |
|----------|-------------------|------------------|
| Desktop Chrome/Edge | ✅ Full support | ✅ Full support |
| Desktop Safari | ✅ Full support | ✅ Full support |
| Mobile browsers | ❌ Not available | ✅ Works |

**Why not Azure Speech Services?**
- Web Speech API is free and built into browsers
- No additional Azure costs
- Perfect for training and prototyping
- Great for desktop use cases

**When to use Azure Speech:**
- Mobile app requirements
- Advanced features (custom models, speaker recognition)
- Batch transcription
- Multi-language support beyond browser capabilities

---

## 🐳 Step 3: Understanding Containerization

### The Dockerfile

Your application was containerized using this `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py

# Run the application
CMD ["python", "app.py"]
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `FROM python:3.11-slim` | Start with lightweight Python base image |
| `WORKDIR /app` | Set working directory in container |
| `RUN apt-get...` | Install system-level dependencies (gcc for some Python packages) |
| `COPY requirements.txt .` | Copy dependency list |
| `RUN pip install...` | Install Python packages |
| `COPY . .` | Copy all application code |
| `EXPOSE 5000` | Document that app listens on port 5000 |
| `CMD ["python", "app.py"]` | Command to run when container starts |

### azd Cloud Builds: No Docker Desktop Needed!

**Here's the magic:** You don't need Docker installed locally!

When you ran `azd up`, here's what happened:

1. **📦 azd packages your code** → Creates a build archive
2. **☁️ Uploads to Azure** → Sends code to Azure Container Registry
3. **🏗️ Cloud build** → ACR builds the Docker image in Azure
4. **🚀 Deploy** → Container App pulls and runs the image

**Benefits:**
- ✅ No Docker Desktop installation
- ✅ Consistent builds (same environment every time)
- ✅ Faster on slow machines (cloud does the work)
- ✅ Built-in registry integration

---

## 🚀 Step 4: Deploy Application Updates

Your app is already deployed from Module 2! But let's understand how to update it.

### Scenario: You Made Code Changes

Let's say you edited `app.py` to change CORA's greeting. Here's how to deploy:

```bash
# Navigate to project directory
cd c:\Local Dev\Cora-Voice-Agent-Training

# Deploy only the application (skip infrastructure)
azd deploy
```

### What Happens During `azd deploy`

```
Deploying services (azd deploy)

  (✓) Done: Packaging service 'web'
  (✓) Done: Building container image in Azure
  (✓) Done: Pushing to Azure Container Registry
  (✓) Done: Deploying to Container App

SUCCESS: Service 'web' deployed successfully!

Endpoint: https://ca-cora-dev.happyocean-a1b2c3d4.eastus.azurecontainerapps.io
```

**Time:** 2-3 minutes for code-only deployments

### Deploy vs Provision vs Up

| Command | What It Does | When to Use |
|---------|--------------|-------------|
| `azd up` | Provision + Package + Deploy (everything) | First deployment or infrastructure changes |
| `azd provision` | Only create/update Azure resources | After editing Bicep files |
| `azd deploy` | Only build and deploy application code | After editing Python/HTML/JS |

**💡 Pro Tip:** Use `azd deploy` for fast iterations during development!

---

## ✅ Step 5: Access and Test Your Application

### 1. Get Your Application URL

```bash
azd show
```

Look for output like:

```
Service: web
  Endpoint: https://ca-cora-dev.happyocean-a1b2c3d4.eastus.azurecontainerapps.io
  Status: Running
  Replicas: 1
```

### 2. Open in Browser

Copy the endpoint URL and open it in your browser.

**Expected:** CORA landing page with:
- 🎤 Voice Agent Simulator title
- Start conversation button
- Clean, modern interface

### 3. Test the Voice Agent

**Before You Start:** Configure CORA's personality and voice!

**Mood Selection:**
- Choose from: Neutral, Happy, Frustrated, Confused, Angry, Helpful
- Each mood changes how CORA responds as a customer
- Try different moods to see varied conversation styles

**Voice Selection:**
- Default: **Random** (CORA picks a different voice each time)
- Have fun! Try other voices from the dropdown
- Each voice has unique characteristics

**Voice Quality Settings:**
- Adjust speech rate, pitch, and volume
- Experiment to find your preferred settings

---

**Test Scenario 1: Text Chat**

1. Select a **Mood** (try "Frustrated" for interesting responses!)
2. Click in the text input box
3. Type: "Hello CORA, how are you today?"
4. Click Send
5. **Expected:** CORA responds as a customer with the selected mood

**Test Scenario 2: Voice Input (Desktop only)**

1. Select a **Mood** and **Voice** (or leave Random selected)
2. Ensure **"Auto-Play Cora's responses"** checkbox is checked (bottom right)
3. Click **"New Conversation"** button
4. Click **"Enable Voice Chat"** button
5. Allow microphone access when browser prompts
6. Speak: **"How can I help you today?"**
7. **Expected:** 
   - Your speech is transcribed to text
   - CORA responds as a customer with the selected mood
   - Response is spoken aloud automatically in the selected voice

**Test Scenario 3: Analytics Dashboard**

1. Have a few conversations (3-5 messages)
2. Click **"End Conversation"** button
3. Click the **"Analytics"** tab
4. **Expected:**
   - Score chart showing conversation ratings (1-5)
   - Volume chart showing message count over time
   - Recent conversations list

---

## 🐛 Troubleshooting Deployment Issues

### Issue 1: Container App Shows "Application Error"

**Symptoms:** URL loads but shows error page

**Diagnosis:**

```bash
# View application logs
az containerapp logs show \
  --name ca-cora-dev \
  --resource-group rg-cora-dev \
  --follow
```

**Common Causes:**
- Missing environment variables (check `AZURE_OPENAI_ENDPOINT`)
- AI Foundry model not deployed
- Managed Identity permissions not set

**Fix:**

```bash
# Verify environment variables
azd env get-values

# Redeploy with correct values
azd env set AZURE_OPENAI_ENDPOINT "https://your-endpoint.openai.azure.com/"
azd deploy
```

---

### Issue 2: Voice Recognition Not Working

**Symptoms:** "Enable Voice Chat" button does nothing or microphone not activating

**Diagnosis:** Check browser console (F12 → Console tab)

**Common Causes:**

| Cause | Solution |
|-------|----------|
| Mobile browser | Use text input (voice not supported on mobile) |
| HTTP (not HTTPS) | Web Speech API requires HTTPS (Container Apps provides this) |
| Microphone permission denied | Reload page and allow microphone access |
| Browser not supported | Use Chrome, Edge, or Safari |

**Fix:** Use desktop browser with microphone permissions enabled.

---

### Issue 3: Analytics Shows No Data

**Symptoms:** Charts are empty even after conversations

**Diagnosis:**

```bash
# Check Table Storage connection
az storage table list \
  --account-name <your-storage-account> \
  --auth-mode login
```

**Common Causes:**
- Storage Account connection string not set
- Managed Identity doesn't have Storage permissions
- Conversations not being saved due to API errors

**Fix:**

```bash
# Verify Managed Identity has Storage permissions
az role assignment list \
  --assignee <managed-identity-principal-id> \
  --resource-group rg-cora-dev
```

The identity should have "Storage Table Data Contributor" role.

---

## 🎯 Understanding the Deployment Architecture

### What's Running Where?

```
┌─────────────────────────────────────────┐
│   Azure Container Apps Environment      │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  Container App: ca-cora-dev      │  │
│  │                                   │  │
│  │  ┌──────────────────────────┐   │  │
│  │  │  Your Docker Container    │   │  │
│  │  │  - Flask app on port 5000 │   │  │
│  │  │  - Python 3.11            │   │  │
│  │  │  - All dependencies       │   │  │
│  │  └──────────────────────────┘   │  │
│  │                                   │  │
│  │  Managed Identity ────────────►  │  │
│  │  (No API keys needed!)           │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
           │               │
           │               │
           ▼               ▼
    ┌──────────┐    ┌──────────────┐
    │ Azure    │    │ Azure Table  │
    │ OpenAI   │    │ Storage      │
    │ (GPT-4o) │    │ (Analytics)  │
    └──────────┘    └──────────────┘
```

### Key Concepts

**Container Apps Environment:**
- Kubernetes-based (but you don't manage Kubernetes!)
- Automatic HTTPS
- Built-in load balancing
- Scale-to-zero capability

**Your Container:**
- Pulled from Azure Container Registry
- Runs your Flask app
- Auto-restarts if it crashes
- Logs to Log Analytics

**Managed Identity:**
- Automatically created by azd
- Grants permissions to your app
- No API keys to manage
- More secure than connection strings

---

## 📊 Monitoring Your Deployment

### View Real-Time Logs

```bash
# Stream logs from your container
az containerapp logs show \
  --name ca-cora-dev \
  --resource-group rg-cora-dev \
  --follow
```

**What to look for:**
- `✓ Azure Monitor OpenTelemetry configured` - Monitoring working
- `✓ Connected to Azure OpenAI` - AI integration working
- `✓ Table Storage initialized` - Analytics storage ready

### Check Application Metrics

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Container App (`ca-cora-dev`)
3. Click "Metrics" in the left menu

**Useful Metrics:**
- **Replica Count:** How many instances are running
- **CPU Usage:** Performance monitoring
- **Memory Usage:** Resource consumption
- **HTTP Request Count:** Traffic volume

---

## 🎓 What You've Learned

By completing Module 3, you now understand:

- ✅ **Flask application structure** - Routes, templates, static files
- ✅ **AI agent integration** - Azure OpenAI communication via Managed Identity
- ✅ **Frontend development** - HTML, CSS, JavaScript with Web Speech API
- ✅ **Containerization** - Dockerfile basics and cloud builds
- ✅ **Azure Container Apps** - Serverless container hosting
- ✅ **Deployment workflow** - azd deploy for rapid iterations
- ✅ **Monitoring and troubleshooting** - Logs, metrics, and debugging

---

## 🚀 Next Steps

Ready to dive deeper into AI? Module 4 covers:
- Azure AI Foundry project configuration
- Model deployment and management
- Conversation scoring and evaluation
- Cost optimization strategies

---

## 🔗 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Azure Container Apps Docs](https://learn.microsoft.com/azure/container-apps/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Azure Managed Identity](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

---

<div class="module-navigation">
  <a href="module2-infrastructure.html" class="nav-button prev">← Module 2: Infrastructure</a>
  <a href="module4-ai-foundry.html" class="nav-button next">Module 4: AI Foundry →</a>
</div>
