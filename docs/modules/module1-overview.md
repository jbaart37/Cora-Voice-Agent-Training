---
layout: module
title: "Module 1: Solution Overview"
module_number: 1
duration: "30 minutes"
description: "Understand the architecture, use cases, and components of the voice agent simulator"
---

# Module 1: Solution Overview

<div class="module-intro">
  <p><strong>Duration:</strong> 30 minutes</p>
  <p><strong>Objective:</strong> Understand what we're building, why it matters, and how all the pieces fit together.</p>
</div>

---

## 🎯 Learning Objectives

By the end of this module, you will:

- [ ] Understand what Azure AI Foundry is and how it differs from Azure OpenAI
- [ ] Explain the architecture of the Cora voice agent simulator
- [ ] Identify the Azure services used and their purposes
- [ ] Recognize real-world use cases for AI-powered voice agents

---

## 📖 Content Coming Soon

This module will cover:

### 1. What is Azure AI Foundry?
- Evolution from Azure OpenAI to AI Foundry
- Key capabilities and features
- Integration with other Azure services

### 2. Solution Architecture
- High-level architecture diagram
- Component overview
- Data flow and interactions

### 3. Speech Technology Implementation
**Important:** This solution uses **browser-based Web Speech API** for voice recognition, NOT Azure Cognitive Services Speech.

**Why Browser Speech API?**
- ✅ Simpler implementation for training purposes
- ✅ No additional Azure costs for speech services
- ✅ Quick prototyping and learning
- ✅ Widely supported in desktop browsers

**Platform Compatibility:**
- 🖥️ **Desktop Browsers:** Full voice + text chat support (Chrome, Edge, Safari)
- 📱 **Mobile Browsers:** Text chat only (voice not supported)

**Production Consideration:** Azure Cognitive Services Speech SDK could be added for:
- Enhanced accuracy and language support
- Custom speech models
- Mobile device support
- Advanced features (speaker recognition, custom vocabularies)
- Enterprise-grade reliability

### 3. Use Cases & Business Value
- Customer service automation
- Training and simulation scenarios
- Performance analytics and insights

### 4. Demo Walkthrough
- Live demo of the completed solution
- Feature highlights
- Q&A session

---

## 🔗 Resources

- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-studio/)
- [Azure Container Apps Overview](https://learn.microsoft.com/azure/container-apps/)
- [Flask Documentation](https://flask.palletsprojects.com/)

---

## 📝 Lab Exercise

**Coming Soon:** Hands-on exploration of the demo environment

---

<div class="module-navigation">
  <a href="../pages/prerequisites.html" class="nav-button prev">← Prerequisites</a>
  <a href="module2-infrastructure.html" class="nav-button next">Module 2: Infrastructure →</a>
</div>
