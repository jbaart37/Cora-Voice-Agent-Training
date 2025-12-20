---
layout: default
title: Cora Voice Agent Workshop
description: Building an AI-Powered Voice Agent Simulator with Azure AI Foundry
---

<div class="hero-section">
  <h1 class="hero-title">🎓 Build Your Own AI-Powered Voice Agent</h1>
  <p class="hero-subtitle">A hands-on, <strong>LOW-CODE</strong> workshop using Azure AI Foundry & Container Apps</p>
</div>

## 🤔 Why Azure AI Foundry?

<div class="context-section">
  <p class="context-intro">
    <strong>Copilot Studio</strong> and <strong>Power Platform</strong> are excellent low-code tools for building agents quickly. 
    But sometimes you need more flexibility, customization, and control over your AI solutions.
  </p>
  
  <div class="comparison-grid">
    <div class="comparison-card copilot">
      <h3>🤖 Copilot Studio</h3>
      <p class="best-for">Best for:</p>
      <ul>
        <li>Quick chatbot deployment</li>
        <li>Standard conversation flows</li>
        <li>Pre-built connectors</li>
        <li>Citizen developers</li>
      </ul>
    </div>
    
    <div class="comparison-card foundry">
      <h3>🚀 Azure AI Foundry</h3>
      <p class="best-for">Best for:</p>
      <ul>
        <li>Custom AI workflows</li>
        <li>Advanced model fine-tuning</li>
        <li>Full code control</li>
        <li>Enterprise-grade solutions</li>
      </ul>
    </div>
  </div>
  
  <p class="context-summary">
    <strong>This workshop teaches you:</strong> When to use Copilot Studio vs Azure AI Foundry, how to leverage the power of Azure AI services, and how to build production-ready AI agents with full customization and control.
  </p>
</div>

## 🎉 See What You'll Build!

<div class="cora-intro">
  <h3><img src="assets/images/cora-logo.png" alt="CORA" class="cora-logo-inline"> Meet CORA: The AI That Makes Humans More... Human</h3>
  
  <p class="intro-hook">
    Look, we get it. <strong>Autonomous AI agents are everywhere</strong> these days - ordering your pizza, booking your flights, probably planning world domination. But here's the thing: <em>humans still like talking to humans</em>. 🗣️
  </p>
  
  <p class="intro-twist">
    <strong>Enter CORA</strong> - your secret weapon for making human customer service agents sound like they've been doing this for years! Think of it as a real-time performance coach that whispers "you're doing great!" (or occasionally "maybe try empathy?") while analyzing every conversation.
  </p>
  
  <p class="intro-mission">
    🎯 <strong>The Mission:</strong> Use AI to help <em>real humans</em> deliver better customer experiences. It's like having a tiny AI cheerleader in your pocket, but way more useful and less noisy.
  </p>
</div>

<div class="demo-showcase">
  <div class="demo-link" onclick="openImageModal('assets/images/cora-demo.gif')" style="cursor: zoom-in;">
    <img src="assets/images/cora-demo.gif" alt="Cora Voice Agent Simulator Demo" class="demo-image">
  </div>
  <p class="demo-caption">
    <strong>See CORA in Action:</strong> A fully functional AI-powered customer service training platform with real-time conversation analysis, performance tracking, and intelligent feedback!
  </p>
  <p class="demo-note">
    🎬 <em>Watch the live demo above - click to enlarge and see a real customer service conversation being scored in real-time!</em>
  </p>
  <p class="demo-tech-note">
    🎤 <strong>Speech Technology:</strong> Uses browser Web Speech API (desktop browsers). Text chat works on all devices, voice requires desktop Chrome/Edge/Safari.
  </p>
</div>

## 💡 Don't Be Nervous - This is LOW-CODE!

<div class="reassurance-section">
  <h3>✨ You don't need to be a coding expert!</h3>
  
  <div class="benefits-grid">
    <div class="benefit-card">
      <div class="benefit-icon">📦</div>
      <h4>All Code Provided</h4>
      <p>Complete, working application code ready to deploy</p>
    </div>
    
    <div class="benefit-card">
      <div class="benefit-icon">🔧</div>
      <h4>Pre-configured SDKs</h4>
      <p>Python packages and Azure SDKs already set up</p>
    </div>
    
    <div class="benefit-card">
      <div class="benefit-icon">🏗️</div>
      <h4>Infrastructure Templates</h4>
      <p>Bicep templates deploy everything with one command</p>
    </div>
    
    <div class="benefit-card">
      <div class="benefit-icon">📚</div>
      <h4>Step-by-Step Guides</h4>
      <p>Detailed explanations for every command and concept</p>
    </div>
  </div>
  
  <p class="reassurance-text">
    <strong>Your role:</strong> Follow the instructions, run the commands, and understand how the pieces fit together. 
    <br>We provide the code - you provide the curiosity! 🚀
  </p>
</div>

## 📚 Workshop Modules

<div class="modules-grid">
  <div class="module-card">
    <div class="module-header">
      <span class="module-badge">Module 1</span>
      <span class="module-duration"><i class="fas fa-clock"></i> 30 min</span>
    </div>
    <h3><i class="fas fa-lightbulb"></i> Solution Overview</h3>
    <p>Understand the architecture, use cases, and components of the voice agent simulator. Learn how Azure AI Foundry integrates with other Azure services.</p>
    <ul class="module-topics">
      <li>What is Azure AI Foundry?</li>
      <li>Architecture overview</li>
      <li>Use cases & business value</li>
    </ul>
    <a href="./modules/module1-overview.html" class="module-btn">Start Module 1 →</a>
  </div>

  <div class="module-card">
    <div class="module-header">
      <span class="module-badge">Module 2</span>
      <span class="module-duration"><i class="fas fa-clock"></i> 45 min</span>
    </div>
    <h3><i class="fas fa-cloud"></i> Infrastructure Setup</h3>
    <p>Deploy Azure infrastructure using Azure Developer CLI (azd). Set up Container Apps, Storage Account, and authentication with a single command.</p>
    <ul class="module-topics">
      <li>Azure Developer CLI (azd)</li>
      <li>Container Apps environment</li>
      <li>Storage Account setup</li>
    </ul>
    <a href="./modules/module2-infrastructure.html" class="module-btn">Start Module 2 →</a>
  </div>

  <div class="module-card">
    <div class="module-header">
      <span class="module-badge">Module 3</span>
      <span class="module-duration"><i class="fas fa-clock"></i> 60 min</span>
    </div>
    <h3><i class="fas fa-rocket"></i> Application Deployment</h3>
    <p>Deploy the Flask application to Azure Container Apps. Understand the code structure, frontend design, and Docker containerization process.</p>
    <ul class="module-topics">
      <li>Flask application walkthrough</li>
      <li>Docker containerization</li>
      <li>Deploy to Container Apps</li>
    </ul>
    <a href="./modules/module3-deployment.html" class="module-btn">Start Module 3 →</a>
  </div>

  <div class="module-card">
    <div class="module-header">
      <span class="module-badge">Module 4</span>
      <span class="module-duration"><i class="fas fa-clock"></i> 45 min</span>
    </div>
    <h3><i class="fas fa-brain"></i> Azure OpenAI & AI Foundry</h3>
    <p>Configure AI Foundry project, deploy GPT-4 model, and implement intelligent conversation analysis with scoring capabilities.</p>
    <ul class="module-topics">
      <li>AI Foundry project setup</li>
      <li>GPT-4 deployment</li>
      <li>Conversation scoring</li>
    </ul>
    <a href="./modules/module4-ai-foundry.html" class="module-btn">Start Module 4 →</a>
  </div>

  <div class="module-card">
    <div class="module-header">
      <span class="module-badge">Module 5</span>
      <span class="module-duration"><i class="fas fa-clock"></i> 45 min</span>
    </div>
    <h3><i class="fas fa-chart-line"></i> Analytics Dashboard</h3>
    <p>Implement performance tracking with Chart.js visualizations and Azure Table Storage integration for historical data analysis.</p>
    <ul class="module-topics">
      <li>Chart.js implementation</li>
      <li>Table Storage integration</li>
      <li>Performance metrics</li>
    </ul>
    <a href="./modules/module5-analytics.html" class="module-btn">Start Module 5 →</a>
  </div>

  <div class="module-card optional">
    <div class="module-header">
      <span class="module-badge">Module 6</span>
      <span class="module-duration"><i class="fas fa-clock"></i> 45 min</span>
    </div>
    <h3><i class="fas fa-graduation-cap"></i> Advanced Topics <span class="optional-badge">Optional</span></h3>
    <p>Explore application monitoring, AI Foundry evaluation tools, and production optimization strategies for enterprise deployments.</p>
    <ul class="module-topics">
      <li>Application Insights</li>
      <li>AI evaluation tools</li>
      <li>Production best practices</li>
    </ul>
    <a href="./modules/module6-advanced.html" class="module-btn">Start Module 6 →</a>
  </div>
</div>

## ⏱️ Workshop Format

<div class="format-cards">
  <div class="format-card">
    <h3><i class="fas fa-user"></i> Self-Paced</h3>
    <p>Complete modules at your own pace</p>
    <strong>4-6 hours total</strong>
  </div>
  
  <div class="format-card">
    <h3><i class="fas fa-users"></i> Instructor-Led</h3>
    <p>Follow along with live guidance</p>
    <strong>6 1-hour sessions led by the CSA team</strong>
  </div>
</div>

## 📋 Prerequisites

<div class="prerequisites-summary">
  <h3>✅ What You'll Need Before Starting:</h3>
  <ul class="prereq-list">
    <li><i class="fas fa-cloud"></i> <strong>Azure demo/development tenant</strong> with active subscription</li>
    <li><i class="fas fa-key"></i> <strong>Contributor role</strong> on Azure subscription/resource group</li>
    <li><i class="fas fa-code"></i> <strong>VS Code</strong> (or preferred IDE)</li>
    <li><i class="fas fa-terminal"></i> <strong>Azure CLI & Azure Developer CLI (azd)</strong> - Required!</li>
    <li><i class="fas fa-python"></i> <strong>Python 3.9+</strong> installed</li>
  </ul>
  
  <h3>🚀 What We'll Deploy Together in the Workshop:</h3>
  <ul class="prereq-list deployed">
    <li><i class="fas fa-robot"></i> <strong>Azure OpenAI</strong> with GPT-4/GPT-4o model</li>
    <li><i class="fas fa-box"></i> <strong>Azure Container Apps</strong> for hosting</li>
    <li><i class="fas fa-database"></i> <strong>Azure Storage Account</strong> for analytics</li>
    <li><i class="fas fa-brain"></i> <strong>Azure AI Foundry</strong> project</li>
    <li><i class="fas fa-shield-alt"></i> <strong>Managed identities</strong> and authentication</li>
  </ul>
  
  <p class="prereq-note">
    <strong>💻 No coding experience required!</strong> This is a guided, low-code workshop where all code is provided. All Azure resources are deployed automatically with a single <code>azd up</code> command!
  </p>
  
  <a href="pages/prerequisites.html" class="button-primary">📋 View Detailed Prerequisites →</a>
</div>

## 🚀 Getting Started

<div class="getting-started">
  <h3>Choose Your Download Method:</h3>
  
  <div class="download-options">
    <div class="download-option">
      <div class="option-icon">
        <i class="fab fa-git-alt"></i>
      </div>
      <h4>Option 1: Git Clone</h4>
      <p><strong>Recommended for Git users</strong></p>
      <div class="code-block">
        <pre><code>git clone https://github.com/yourusername/cora-voice-agent-training.git
cd cora-voice-agent-training</code></pre>
      </div>
    </div>
    
    <div class="download-option highlighted">
      <div class="option-icon">
        <i class="fas fa-download"></i>
      </div>
      <h4>Option 2: Download ZIP</h4>
      <p><strong>No Git required!</strong> Perfect if you're not familiar with Git.</p>
      <a href="https://github.com/yourusername/cora-voice-agent-training/archive/refs/heads/main.zip" class="download-btn">
        <i class="fas fa-file-archive"></i> Download Workshop Files (ZIP)
      </a>
      <ol class="setup-steps">
        <li>Download the ZIP file</li>
        <li>Extract to your local machine (e.g., <code>C:\Workshops\Cora</code>)</li>
        <li>Open the folder in VS Code</li>
      </ol>
    </div>
  </div>
  
  <h3>Once You Have the Files:</h3>
  <div class="next-steps">
    <div class="step">
      <span class="step-number">1</span>
      <p><strong>Review prerequisites</strong> - Make sure you have everything ready</p>
    </div>
    <div class="step">
      <span class="step-number">2</span>
      <p><strong>Choose your path</strong> - Self-paced or instructor-led</p>
    </div>
    <div class="step">
      <span class="step-number">3</span>
      <p><strong>Start Module 1</strong> - Begin your AI learning journey!</p>
    </div>
  </div>
</div>

## 💰 Cost Estimate

<div class="cost-estimate">
  <p>Running this workshop costs approximately <strong>$5-10 total</strong>:</p>
  <ul>
    <li>Container Apps: ~$0.50-2.00/day</li>
    <li>Azure OpenAI: ~$0.03-0.10 per conversation</li>
    <li>Storage: <$0.10/day</li>
  </ul>
  <p class="warning-text">
    ⚠️ <strong>Remember to clean up resources after completion!</strong>
  </p>
</div>

## 📖 Additional Resources

<div class="resources-grid">
  <a href="https://learn.microsoft.com/azure/ai-foundry/" class="resource-link" target="_blank">
    <i class="fas fa-book"></i> Azure AI Foundry Docs
  </a>
  <a href="https://learn.microsoft.com/azure/container-apps/" class="resource-link" target="_blank">
    <i class="fas fa-book"></i> Container Apps Docs
  </a>
  <a href="https://learn.microsoft.com/azure/ai-services/openai/" class="resource-link" target="_blank">
    <i class="fas fa-book"></i> Azure OpenAI Docs
  </a>
  <a href="https://github.com/yourusername/cora-voice-agent-training/issues" class="resource-link" target="_blank">
    <i class="fab fa-github"></i> GitHub Issues
  </a>
</div>

## 🆘 Need Help?

<div class="help-section">
  <div class="help-option">
    <h4><i class="fab fa-github"></i> GitHub Issues</h4>
    <p>Report bugs or ask questions on our repository</p>
  </div>
  <div class="help-option">
    <h4><i class="fas fa-chalkboard-teacher"></i> Instructor Support</h4>
    <p>Available during live training sessions</p>
  </div>
  <div class="help-option">
    <h4><i class="fas fa-comments"></i> Community Forums</h4>
    <p>Connect with other learners in Azure community</p>
  </div>
</div>

---

<div class="cta-section">
  <h2>Ready to Build Your AI-Powered Voice Agent?</h2>
  <p>Start your journey into AI-powered customer service solutions!</p>
  <a href="./modules/module1-overview.html" class="button-cta">🚀 Start Module 1 Now!</a>
</div>

---

<p style="text-align: center; color: #605e5c; font-size: 0.9rem; margin-top: 3rem;">
  <em>Last Updated: December 2025 | Version 1.0</em>
</p>
