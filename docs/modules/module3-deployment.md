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

## 📖 Content Coming Soon

This module will cover:

### 1. Application Code Walkthrough
- `app.py`: Flask routes and web server setup
- `agent.py`: AI agent integration logic
- `storage_service.py`: Azure Table Storage operations
- `config.py`: Environment and configuration management

### 2. Frontend Implementation
- `templates/index.html`: Main UI structure
- `static/css/style.css`: Styling and themes
- `static/js/app.js`: Interactive features and Chart.js analytics

### 2.5. Speech Implementation (Browser-Based)
**Key Detail:** This solution uses the **Web Speech API** (browser native), not Azure Cognitive Services.

**Implementation in `app.js`:**
- `SpeechRecognition`: Browser's built-in speech-to-text
- `SpeechSynthesis`: Browser's text-to-speech
- Real-time transcription in desktop browsers
- Graceful fallback to text-only mode on mobile

**Why not Azure Speech Services?**
For this training, we're keeping it simple! Azure Cognitive Services Speech SDK is powerful but adds complexity and cost. The browser API is perfect for learning and prototyping.

**Platform Support:**
- ✅ Desktop Chrome/Edge: Full support
- ✅ Desktop Safari: Full support  
- ⚠️ Mobile browsers: Text chat only (voice recognition not available)

### 3. Containerization with azd
- Understanding the Dockerfile (no manual building needed!)
- How azd performs cloud-based container builds
- Azure Container Registry integration
- Why you don't need Docker Desktop

### 4. Deployment & Testing
- Running `azd deploy`
- Viewing deployment logs
- Accessing the deployed application
- Testing authentication and features

---

## 🔗 Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Azure Container Apps Deployment](https://learn.microsoft.com/azure/container-apps/deploy-artifact)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

## 📝 Lab Exercise

**Coming Soon:** Code exploration and deployment practice

**Estimated Time:** 45 minutes

---

<div class="module-navigation">
  <a href="module2-infrastructure.html" class="nav-button prev">← Module 2: Infrastructure</a>
  <a href="module4-ai-foundry.html" class="nav-button next">Module 4: AI Foundry →</a>
</div>
