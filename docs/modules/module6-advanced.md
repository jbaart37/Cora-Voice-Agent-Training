---
layout: module
title: "Module 6: IT Operations & System Metrics"
module_number: 6
duration: "40 minutes"
description: "Monitor system health, debug issues, and validate AI quality"
---

# Module 6: IT Operations & System Metrics

<div class="celebration-banner">
  🎉 <strong>Final stretch, tech champion!</strong> You've mastered agent performance (Module 5). Now let's make sure your *system* stays healthy, debuggable, and cost-efficient. Time to put on your DevOps hat! 🛠️✨
</div>

<div class="module-intro">
  <p><strong>Duration:</strong> 40 minutes</p>
  <p><strong>Objective:</strong> Learn how to monitor CORA's infrastructure, debug issues with logs and traces, and evaluate AI model quality.</p>
</div>

---

## 🎯 Learning Objectives

By the end of this module, you will:

- [ ] Understand the difference between Module 5 (agent metrics) and Module 6 (system metrics)
- [ ] View application logs in Container Apps CLI
- [ ] Understand OpenTelemetry traces in Application Insights
- [ ] Use AI Foundry evaluation tools to assess model quality
- [ ] Monitor costs and performance
- [ ] **Earn your "Low-Code to Pro-Code Architect Navigator" certificate!** 🏆

---

## 🧭 Module 6 vs Module 5: What's the Difference?

**Reminder from Module 5:**

| Aspect | Module 5: Agent Metrics | Module 6: System Metrics |
|--------|------------------------|--------------------------|
| **Focus** | How well are agents performing? | How healthy is the system? |
| **Who cares** | Training managers, HR, QA | DevOps, IT ops, developers |
| **Metrics** | Professionalism, empathy, scores | Latency, errors, token usage |
| **Storage** | Azure Table Storage | App Insights, Azure Monitor |
| **Tools** | Chart.js dashboard | CLI logs, traces, AI Foundry |

**This module = System health, not agent performance!**

---

**This module = System health, not agent performance!**

---

## 📋 Application Logging with Container Apps CLI

### What Are Application Logs?

**Application logs** are the real-time output from your Python Flask application running in Azure Container Apps:

- ✅ Startup messages ("✓ Azure Monitor OpenTelemetry configured")
- ✅ HTTP request logs (GET /chat, POST /api/analyze)
- ✅ Success confirmations ("✓ Stored score for conversation...")
- ✅ Error messages ("⚠ Failed to initialize Azure Table Storage")
- ✅ Python print() statements from your code
- ✅ Flask routing information

**Think of it as:** The console output you'd see if you ran `python app.py` locally, but captured in the cloud!

---

### Why CLI Logging Matters

When things go wrong in production, you need to know:

**Debugging scenarios:**
- ❌ Website returns 500 error → *Check logs for Python stack trace*
- ❌ Scores not saving → *Look for "Failed to store score" messages*
- ❌ AI not responding → *Check for "OpenAI API connection failed"*
- ❌ Slow performance → *Review request duration logs*

**Success validation:**
- ✅ Deployment worked → *See "✓ Azure Monitor OpenTelemetry configured"*
- ✅ Storage connected → *See "✓ Azure Table 'conversationscores' already exists"*
- ✅ Requests processing → *See "GET /chat 200 OK"*

---

### Viewing Logs in Azure CLI

**Method 1: Stream Live Logs**

```bash
# Get your Container App name (from Module 2)
azd env get-values | grep AZURE_CONTAINER_APP_NAME

# Stream live logs (like tail -f in Linux)
az containerapp logs show \
  --name <your-app-name> \
  --resource-group <your-resource-group> \
  --follow \
  --tail 100
```

**What you'll see:**
```
2025-12-21T15:30:12Z ✓ Azure Monitor OpenTelemetry configured
2025-12-21T15:30:12Z  * Running on http://0.0.0.0:5000/
2025-12-21T15:30:45Z INFO:werkzeug:192.168.1.1 - - [21/Dec/2025 15:30:45] "GET /chat HTTP/1.1" 200 -
2025-12-21T15:31:02Z ✓ Stored score for conversation abc-123 by sarah@company.com
```

---

**Method 2: Query Recent Logs**

```bash
# Get last 50 log entries (not live)
az containerapp logs show \
  --name <your-app-name> \
  --resource-group <your-resource-group> \
  --tail 50
```

---

**Method 3: Azure Portal**

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your **Container App** (search by name)
3. Click **"Monitoring"** → **"Log stream"** (left sidebar)
4. View live logs in browser (no CLI needed!)

> 📸 **Screenshot placeholder**: Container Apps log stream in Azure Portal

<div class="screenshot-container" onclick="openImageModal('{{ site.baseurl }}/assets/images/module6-log-stream.png')" style="cursor: zoom-in;">
  <img src="{{ site.baseurl }}/assets/images/module6-log-stream.png" alt="Container Apps Log Stream" class="screenshot-image">
  <p class="zoom-hint"><i class="fas fa-search-plus"></i> Click to enlarge</p>
</div>

---

### Common Log Messages Decoded

**✅ Success Messages:**

| Log Message | What It Means |
|-------------|---------------|
| `✓ Azure Monitor OpenTelemetry configured` | App Insights telemetry working |
| `✓ Using Azure Storage connection string` | Storage accessible (local dev mode) |
| `✓ Using managed identity for storage` | Managed Identity auth working (production) |
| `✓ Azure Table 'conversationscores' already exists` | Table Storage ready |
| `✓ Stored score for conversation...` | Score saved successfully |
| `200 -` in HTTP logs | Request succeeded |

**⚠️ Warning Messages:**

| Log Message | What It Means | How to Fix |
|-------------|---------------|------------|
| `⚠ APPLICATIONINSIGHTS_CONNECTION_STRING not set` | App Insights not configured | Check Module 1 setup, verify connection string |
| `⚠ No storage account configured` | Storage not accessible | Verify `azd env get-values | grep STORAGE` |
| `⚠ Failed to store score in Azure Table` | Write permission issue | Check Managed Identity role (Storage Table Data Contributor) |
| `404 -` in HTTP logs | Page/route not found | Check URL, verify Flask routes in app.py |
| `500 -` in HTTP logs | Server error | Check Python stack trace in logs |

**❌ Error Messages:**

| Log Message | What It Means | How to Fix |
|-------------|---------------|------------|
| `Failed to initialize Azure Table Storage` | Can't connect to Storage | Check firewall rules, Managed Identity, connection string |
| `OpenAI API connection failed` | Can't reach AI Foundry | Verify `AZURE_OPENAI_ENDPOINT` in env variables |
| `Azure AD token refresh failed` | Authentication expired | Run `az login` again, check token expiration |
| Python stack traces (Traceback...) | Code error | Review the specific error message and file/line number |

---

### Testing Log Scenarios

**Test Scenario 1: View Startup Logs**

**Objective:** Verify application started successfully

**Steps:**
1. Open terminal/command prompt
2. Run: `az containerapp logs show --name <your-app-name> --resource-group <your-rg> --tail 100`
3. Look for startup sequence:
   - Flask initialization
   - OpenTelemetry configuration
   - Storage connection
   - "Running on http://0.0.0.0:5000/"

**Expected result:**
- All ✓ checkmarks visible
- No ❌ errors in startup sequence
- Flask server running

---

**Test Scenario 2: Monitor Live Requests**

**Objective:** See HTTP requests in real-time

**Steps:**
1. Run: `az containerapp logs show --name <your-app-name> --resource-group <your-rg> --follow`
2. Open CORA in browser
3. Start a new conversation
4. Send a message to the AI
5. Watch logs update in terminal

**Expected result:**
- See `GET /` when page loads
- See `POST /chat` when you send message
- See `200` status codes (success)
- See "✓ Stored score..." after analyzing conversation

---

**Test Scenario 3: Diagnose an Error**

**Objective:** Use logs to troubleshoot a 500 error

**Steps:**
1. Intentionally break something (e.g., remove AI endpoint from config)
2. Try to send a message in CORA
3. See 500 error in browser
4. Check logs: `az containerapp logs show --name <your-app-name> --resource-group <your-rg> --tail 50`
5. Look for Python Traceback or error messages

**Expected result:**
- Logs reveal the specific error (e.g., "OpenAI endpoint not configured")
- Stack trace shows which file and line number caused the issue
- You can fix the configuration and verify success in logs

---

## 📡 OpenTelemetry Traces in Application Insights

### What Are Traces?

**Traces** show the complete journey of a request through your application:

```
User clicks "Send Message"
  ↓
Flask receives POST /chat
  ↓
agent.process_message() called
  ↓
Azure OpenAI API call (GPT-4o)
  ↓
Token usage tracked
  ↓
Response returned to user
```

**Each step is a "span"** with duration, status, and custom attributes.

---

### Viewing Traces in Application Insights

**Prerequisites:**
- Application Insights must be configured (done in Module 1!)
- `APPLICATIONINSIGHTS_CONNECTION_STRING` set in environment

**Method 1: Azure Portal**

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your **Application Insights** resource
3. Click **"Transaction search"** (left sidebar)
4. Filter by:
   - Time range (last hour, last 24 hours)
   - Event type (Requests, Dependencies, Traces)
   - Result code (200, 500, etc.)

> 📸 **Screenshot placeholder**: Application Insights transaction search

<div class="screenshot-container" onclick="openImageModal('{{ site.baseurl }}/assets/images/module6-app-insights-traces.png')" style="cursor: zoom-in;">
  <img src="{{ site.baseurl }}/assets/images/module6-app-insights-traces.png" alt="Application Insights Traces" class="screenshot-image">
  <p class="zoom-hint"><i class="fas fa-search-plus"></i> Click to enlarge</p>
</div>

---

**Method 2: Performance Tab**

1. In Application Insights, click **"Performance"** (left sidebar)
2. View:
   - Average response times
   - Slowest operations
   - Failed requests
   - Dependency calls (Azure OpenAI, Storage)

> 📸 **Screenshot placeholder**: Application Insights performance dashboard

<div class="screenshot-container" onclick="openImageModal('{{ site.baseurl }}/assets/images/module6-performance.png')" style="cursor: zoom-in;">
  <img src="{{ site.baseurl }}/assets/images/module6-performance.png" alt="Performance Dashboard" class="screenshot-image">
  <p class="zoom-hint"><i class="fas fa-search-plus"></i> Click to enlarge</p>
</div>

---

### Custom Attributes in CORA

CORA's agent.py adds **custom span attributes** for business context:

| Attribute | What It Tracks | Why It Matters |
|-----------|----------------|----------------|
| `cora.mood` | Customer emotion | Correlate mood with errors/latency |
| `cora.message_length` | Input size (characters) | Identify long messages causing issues |
| `cora.model` | Model used (gpt-4o) | Compare performance across models |
| `cora.prompt_tokens` | Input tokens | Track cost drivers |
| `cora.completion_tokens` | Output tokens | Optimize response length |
| `cora.total_tokens` | Combined tokens | Calculate per-conversation cost |
| `cora.response_length` | Output size (characters) | Measure verbosity |

**Example trace view:**
```
Span: cora.process_message
Duration: 1,247ms
Status: Success ✅

Custom Attributes:
├─ cora.mood: frustrated
├─ cora.message_length: 87
├─ cora.model: gpt-4o
├─ cora.prompt_tokens: 245
├─ cora.completion_tokens: 189
├─ cora.total_tokens: 434
└─ cora.response_length: 312
```

**Use cases:**
- "Which mood causes the most errors?" → Filter by `cora.mood`
- "Are long messages slower?" → Correlate `cora.message_length` with duration
- "What's our daily token usage?" → Aggregate `cora.total_tokens`

---

## 🧪 AI Foundry Evaluation Tools

### What Is AI Evaluation?

**AI evaluation** assesses the quality of your model's responses against objective criteria:

| Metric | What It Measures | Why It Matters |
|--------|------------------|----------------|
| **Groundedness** | Factual accuracy (no hallucinations) | Prevents making up information |
| **Relevance** | On-topic responses | Stays focused on customer issue |
| **Coherence** | Logical flow, well-structured | Easy to understand |
| **Fluency** | Grammar, natural language | Sounds professional |

**Think of it as:** Automated quality assurance for AI responses (like spell-check for intelligence)

---

### Accessing AI Foundry Evaluation

**Where to find it:**

1. Go to [ai.azure.com](https://ai.azure.com) or [oai.azure.com](https://oai.azure.com)
2. Navigate to your **AI Foundry project** (created in Module 1)
3. Click **"Evaluation"** (left sidebar)

> 📸 **Screenshot placeholder**: AI Foundry evaluation page

<div class="screenshot-container" onclick="openImageModal('{{ site.baseurl }}/assets/images/module6-evaluation.png')" style="cursor: zoom-in;">
  <img src="{{ site.baseurl }}/assets/images/module6-evaluation.png" alt="AI Foundry Evaluation" class="screenshot-image">
  <p class="zoom-hint"><i class="fas fa-search-plus"></i> Click to enlarge</p>
</div>

---

### Manual Evaluation in Playground

**Quick test in Playground:**

1. Go to **"Playground"** → **"Chat"**
2. Send test prompts with different moods:
   - "I'm so frustrated! My order is late!" (frustrated)
   - "Can you help me understand how this works?" (confused)
   - "This is urgent! I need help now!" (impatient)
3. Review responses for:
   - ✅ Appropriate empathy for mood
   - ✅ Clear, actionable solutions
   - ✅ Professional tone
   - ✅ No hallucinations or made-up facts

**Red flags:**
- ❌ Generic responses (not mood-aware)
- ❌ Overly verbose or rambling
- ❌ Making promises CORA can't keep ("I'll refund you $100")
- ❌ Inappropriate tone (too casual or too robotic)

---

### Automated Evaluation (Advanced)

**For production use:** Set up automated evaluation pipelines

**What you need:**
- Test dataset (CSV/JSON with sample customer messages)
- Expected outputs (ideal responses)
- Evaluation metrics (groundedness, relevance, etc.)

**How it works:**
1. Upload test dataset to AI Foundry
2. Run evaluation job (compares actual vs expected)
3. Review scores and identify issues
4. Iterate on system prompts to improve quality

**Example test dataset:**
```csv
mood,input,expected_output
frustrated,"My order is late!","I understand your frustration..."
confused,"How does this work?","Let me explain step-by-step..."
happy,"This is great!","I'm so glad to hear that!"
```

**Not required for this workshop** - but good to know for production!

---

## 💰 Monitoring Costs & Performance

### Token Usage & Cost Tracking

**How CORA tracks costs:**

Every conversation logs:
- Prompt tokens (input to GPT-4o)
- Completion tokens (output from GPT-4o)
- Total tokens (prompt + completion)

**Cost calculation:**

| Model | Input Cost | Output Cost | Avg Conversation |
|-------|------------|-------------|------------------|
| GPT-4o | $2.50 per 1M tokens | $10 per 1M tokens | ~$0.006 per conversation |
| GPT-5 | $30 per 1M tokens | $60 per 1M tokens | ~$0.035 per conversation |

**CORA average conversation:**
- Prompt: ~250 tokens ($0.000625)
- Completion: ~200 tokens ($0.002)
- **Total: ~$0.0026 per conversation**

**1,000 conversations = ~$2.60** 💰

---

### Viewing Token Usage

**Method 1: Application Insights**

1. Go to Application Insights → **"Logs"**
2. Run this query:

```kql
traces
| where customDimensions.cora_total_tokens > 0
| summarize 
    TotalConversations = count(),
    TotalTokens = sum(tolong(customDimensions.cora_total_tokens)),
    AvgTokens = avg(tolong(customDimensions.cora_total_tokens))
| project TotalConversations, TotalTokens, AvgTokens
```

**Expected result:**
```
TotalConversations: 42
TotalTokens: 18,900
AvgTokens: 450
```

---

**Method 2: AI Foundry Portal**

1. Go to AI Foundry → your project
2. Click **"Metrics"** (left sidebar)
3. View:
   - Total requests (conversations)
   - Token usage over time
   - Estimated costs

> 📸 **Screenshot placeholder**: AI Foundry metrics dashboard

<div class="screenshot-container" onclick="openImageModal('{{ site.baseurl }}/assets/images/module6-metrics.png')" style="cursor: zoom-in;">
  <img src="{{ site.baseurl }}/assets/images/module6-metrics.png" alt="AI Foundry Metrics" class="screenshot-image">
  <p class="zoom-hint"><i class="fas fa-search-plus"></i> Click to enlarge</p>
</div>

---

### Cost Optimization Tips

**1. Shorten System Prompts**
- Current: ~150 tokens per conversation
- Optimized: ~80 tokens (cut fluff, keep clarity)
- Savings: ~$0.0002 per conversation

**2. Limit Conversation History**
- CORA tracks full conversation in context
- For long conversations (10+ messages), trim older messages
- Keep only last 5 messages in context

**3. Set Max Tokens**
- Prevent runaway responses
- `max_tokens=500` (reasonable for customer service)
- Avoids $10 surprise bills from verbose AI

**4. Use GPT-4o-mini for Simple Tasks**
- 60% cheaper than GPT-4o
- Good for simple Q&A, classification
- CORA uses GPT-4o for quality, but consider mini for high-volume production

---

## 🎓 Key Takeaways

### What You Learned

✅ **Application Logging** = Real-time app output in Container Apps CLI
   - View startup messages, HTTP requests, errors
   - Debug 500 errors with stack traces
   - Monitor live activity with `--follow`

✅ **OpenTelemetry Traces** = Request journey through your system
   - View in Application Insights (Transaction search, Performance)
   - Custom attributes track mood, tokens, duration
   - Correlate business metrics (mood) with technical metrics (latency)

✅ **AI Foundry Evaluation** = Automated quality assurance for AI
   - Metrics: Groundedness, relevance, coherence, fluency
   - Manual testing in Playground
   - Automated pipelines for production

✅ **Cost Monitoring** = Track token usage and optimize spending
   - Application Insights logs show token counts
   - AI Foundry metrics dashboard shows usage trends
   - Optimization: Shorten prompts, limit history, set max_tokens

---

## 🏆 Congratulations! Claim Your Certificate

You've completed all 6 modules of the CORA Voice Agent Workshop! It's time to celebrate your achievement!

<div style="text-align: center; margin: 3rem 0;">
  <button id="claim-certificate-btn" class="btn btn-primary" style="font-size: 1.25rem; padding: 1rem 2rem; background: linear-gradient(135deg, #0078d4, #50b7f5); border: none; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
    🎉 Claim Your Certificate! 🏆
  </button>
</div>

<script>
document.getElementById('claim-certificate-btn').addEventListener('click', function() {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'certificate-modal';
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s;';
  
  // Create certificate content
  const certificateContent = document.createElement('div');
  certificateContent.style.cssText = 'background: linear-gradient(135deg, #ffffff, #f0f9ff); padding: 3rem; border-radius: 16px; max-width: 800px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); position: relative; animation: slideIn 0.5s;';
  
  certificateContent.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .certificate-border {
        border: 8px solid #0078d4;
        border-image: linear-gradient(45deg, #0078d4, #50b7f5, #0078d4) 1;
        padding: 2rem;
        background: white;
        border-radius: 8px;
      }
      .certificate-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .certificate-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #0078d4;
        margin-bottom: 0.5rem;
        font-family: 'Georgia', serif;
      }
      .certificate-subtitle {
        font-size: 1.2rem;
        color: #605e5c;
        font-style: italic;
      }
      .certificate-body {
        text-align: center;
        margin: 2rem 0;
      }
      .certificate-recipient {
        font-size: 1.1rem;
        color: #323130;
        margin-bottom: 1rem;
      }
      .certificate-name {
        font-size: 2rem;
        font-weight: 700;
        color: #0078d4;
        margin: 1rem 0;
        font-family: 'Georgia', serif;
        text-decoration: underline;
        text-decoration-color: #50b7f5;
      }
      .certificate-achievement {
        font-size: 1.1rem;
        color: #323130;
        line-height: 1.8;
        margin: 1.5rem 0;
      }
      .certificate-skills {
        background: #f0f9ff;
        padding: 1.5rem;
        border-radius: 8px;
        margin: 2rem 0;
        text-align: left;
      }
      .certificate-skills h4 {
        color: #0078d4;
        margin-bottom: 1rem;
        text-align: center;
      }
      .certificate-skills ul {
        columns: 2;
        column-gap: 2rem;
        list-style: none;
        padding: 0;
      }
      .certificate-skills li {
        padding: 0.5rem 0;
        padding-left: 1.5rem;
        position: relative;
      }
      .certificate-skills li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #107c10;
        font-weight: 700;
      }
      .certificate-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #edebe9;
      }
      .certificate-date {
        text-align: left;
      }
      .certificate-signature {
        text-align: right;
      }
      .certificate-date-label,
      .certificate-signature-label {
        font-size: 0.9rem;
        color: #605e5c;
      }
      .certificate-date-value,
      .certificate-signature-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: #323130;
        margin-top: 0.25rem;
      }
      .certificate-close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #d13438;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .certificate-close-btn:hover {
        background: #a4282c;
      }
      @media (max-width: 768px) {
        .certificate-title { font-size: 1.8rem; }
        .certificate-name { font-size: 1.5rem; }
        .certificate-skills ul { columns: 1; }
      }
    </style>
    
    <button class="certificate-close-btn" onclick="document.getElementById('certificate-modal').remove()">×</button>
    
    <div class="certificate-border">
      <div class="certificate-header">
        <div class="certificate-title">🎓 Certificate of Completion 🏆</div>
        <div class="certificate-subtitle">CORA Voice Agent Workshop</div>
      </div>
      
      <div class="certificate-body">
        <div class="certificate-recipient">This certifies that</div>
        <div class="certificate-name" id="cert-user-name">Workshop Participant</div>
        <div class="certificate-achievement">
          Has successfully completed the <strong>CORA Voice Agent Workshop</strong> and demonstrated proficiency in building AI-powered customer service training applications using Azure AI Foundry, Container Apps, and modern cloud architecture.
        </div>
        
        <div class="certificate-skills">
          <h4>🌟 Skills Acquired</h4>
          <ul>
            <li>Azure AI Foundry project setup</li>
            <li>GPT-4o model deployment & configuration</li>
            <li>Azure Container Apps deployment</li>
            <li>Infrastructure as Code (Bicep)</li>
            <li>Azure Developer CLI (azd)</li>
            <li>Flask web application development</li>
            <li>OpenTelemetry integration</li>
            <li>Azure Table Storage implementation</li>
            <li>Chart.js analytics dashboards</li>
            <li>Managed Identity authentication</li>
            <li>Application Insights monitoring</li>
            <li>Low-Code to Pro-Code architecture</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 2rem 0; padding: 1rem; background: #fff4e6; border-radius: 8px; border-left: 4px solid #ffaa44;">
          <strong style="font-size: 1.3rem; color: #d83b01;">🚀 Title Earned:</strong><br>
          <span style="font-size: 1.5rem; font-weight: 700; color: #0078d4; font-family: 'Georgia', serif;">Low-Code to Pro-Code Architect Navigator</span>
        </div>
      </div>
      
      <div class="certificate-footer">
        <div class="certificate-date">
          <div class="certificate-date-label">Date of Completion</div>
          <div class="certificate-date-value" id="cert-date"></div>
        </div>
        <div class="certificate-signature">
          <div class="certificate-signature-label">Authorized By</div>
          <div class="certificate-signature-value">CORA Training Team</div>
        </div>
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 2rem;">
      <button onclick="window.print()" style="background: #107c10; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 1rem; cursor: pointer; margin-right: 1rem;">
        🖨️ Print Certificate
      </button>
      <button onclick="document.getElementById('certificate-modal').remove()" style="background: #605e5c; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 1rem; cursor: pointer;">
        Close
      </button>
    </div>
  `;
  
  modal.appendChild(certificateContent);
  document.body.appendChild(modal);
  
  // Set current date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('cert-date').textContent = dateStr;
  
  // Try to get user name from identity element if available
  const identityElement = document.getElementById('identity-text');
  if (identityElement && identityElement.textContent && !identityElement.textContent.includes('Loading')) {
    document.getElementById('cert-user-name').textContent = identityElement.textContent;
  } else {
    document.getElementById('cert-user-name').textContent = 'Workshop Champion';
  }
  
  // Close modal on overlay click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
});
</script>

---

### Next Steps Beyond This Workshop

**🎯 Customize CORA for your needs:**
- Modify system prompts for your industry
- Add more customer moods
- Integrate with real CRM systems
- Deploy to production

**📚 Learn more about Azure AI:**
- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-studio/)
- [Azure OpenAI Service](https://learn.microsoft.com/azure/ai-services/openai/)
- [Container Apps Best Practices](https://learn.microsoft.com/azure/container-apps/best-practices)
- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/)

**🤝 Share your success:**
- Show CORA to your team
- Present at internal tech talks
- Contribute improvements to the GitHub repo
- Help others learn Azure AI!

---

## 🔗 Resources

- [Application Insights Documentation](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview)
- [Azure AI Foundry Evaluation](https://learn.microsoft.com/azure/ai-studio/how-to/evaluate-sdk)
- [Container Apps Logging](https://learn.microsoft.com/azure/container-apps/logging)
- [OpenTelemetry Python](https://opentelemetry.io/docs/languages/python/)

---

<div class="module-navigation">
  <a href="module5-analytics.html" class="nav-button prev">← Module 5: Analytics</a>
  <a href="../index.html" class="nav-button next">Back to Home →</a>
</div>
