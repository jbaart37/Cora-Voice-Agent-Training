# Instructor Guide

## Workshop Overview

This guide provides instructors with detailed information for delivering the Cora Voice Agent Workshop in a classroom or virtual setting.

## Target Audience

- Azure developers and solution architects
- 10-20 participants per session
- Intermediate level: Basic Azure and Python knowledge required

## Workshop Delivery Options

### Option 1: Full-Day Workshop (8 hours)
**Schedule:**
- 09:00 - 09:30: Welcome & Setup verification
- 09:30 - 10:00: Module 1 - Solution Overview
- 10:00 - 11:00: Module 2 - Infrastructure (hands-on)
- 11:00 - 11:15: Break
- 11:15 - 12:30: Module 3 - Application Deployment (hands-on)
- 12:30 - 13:30: Lunch
- 13:30 - 14:30: Module 4 - AI Foundry Integration (hands-on)
- 14:30 - 14:45: Break
- 14:45 - 15:45: Module 5 - Analytics Dashboard (hands-on)
- 15:45 - 16:30: Module 6 - Advanced Topics (optional)
- 16:30 - 17:00: Q&A, Cleanup, Wrap-up

### Option 2: Half-Day Workshop (4 hours)
Skip Module 6 (Advanced Topics) and reduce hands-on time

## Pre-Workshop Checklist

### 1 Week Before
- [ ] Send pre-requisites email to participants
- [ ] Verify all participants have Azure subscriptions
- [ ] Test all labs in clean environment
- [ ] Prepare backup demo environment

### 1 Day Before
- [ ] Test all demo URLs and resources
- [ ] Verify GitHub repository access
- [ ] Prepare presentation slides
- [ ] Set up virtual meeting room (if online)
- [ ] Test screen sharing and recording

### Day Of
- [ ] Arrive 30 minutes early
- [ ] Test all equipment and connectivity
- [ ] Have backup laptop ready
- [ ] Open all necessary browser tabs
- [ ] Start recording (if applicable)

## Module-by-Module Guidance

### Module 1: Solution Overview (30 mins)
**Instructor Notes:**
- **Objective**: Set context and excitement for the workshop
- **Format**: Presentation with live demo
- **Key Points**:
  - Show the final working application FIRST
  - Highlight real-world use cases (call center training)
  - Explain AI Foundry's role clearly
  - Walk through architecture diagram slowly

**Demo Checklist:**
- [ ] Show live voice agent simulation
- [ ] Demonstrate conversation analysis
- [ ] Show analytics dashboard
- [ ] Highlight Entra authentication

**Common Questions:**
- Q: "Can this work with other languages?"
  - A: Yes, OpenAI models support multiple languages
- Q: "What's the cost at scale?"
  - A: Discuss token pricing and container app scaling costs

**Troubleshooting:**
- If demo app is down, use screenshots/video backup
- Have architecture diagram printed as backup

---

### Module 2: Infrastructure Setup (45 mins)
**Instructor Notes:**
- **Objective**: Get everyone's infrastructure deployed successfully
- **Format**: Live demo followed by hands-on lab
- **Key Points**:
  - Explain AZD benefits over manual deployment
  - Show resource group organization
  - Emphasize managed identity security

**Live Demo Steps:**
1. Show clean Azure portal (no existing resources)
2. Run `azd init` command
3. Explain each prompted input
4. Run `azd up` and narrate what's happening
5. Show created resources in portal

**Hands-On Lab:**
- Give participants 20 minutes to deploy
- Walk around (or use breakout rooms) to help
- Common issues below

**Common Issues:**
- Subscription permissions: Need Contributor or Owner
- Naming conflicts: Add unique suffix
- Region availability: Use East US or West US 2

**Success Criteria:**
- [ ] Resource group created
- [ ] Container Apps environment running
- [ ] Storage account accessible
- [ ] No deployment errors

---

### Module 3: Application Deployment (60 mins)
**Instructor Notes:**
- **Objective**: Understand application structure and deploy successfully
- **Format**: Code walkthrough + hands-on deployment
- **Key Points**:
  - Explain Flask app structure clearly
  - Highlight WebSocket usage for real-time
  - Show how frontend connects to backend

**Code Walkthrough (15 mins):**
1. `app.py` - Flask routes and SocketIO
2. `agent.py` - AI Foundry integration
3. `storage_service.py` - Table Storage
4. Frontend files (templates/static)
5. `Dockerfile` - Containerization

**Hands-On Lab (35 mins):**
- Modify code locally
- Test with `python app.py`
- Deploy with `azd deploy`
- Verify in browser

**Common Issues:**
- Port 5000 already in use: Kill other Flask apps
- Environment variables missing: Check .env file
- Container build fails: Review Dockerfile syntax

**Success Criteria:**
- [ ] App runs locally
- [ ] Container deploys successfully
- [ ] Can access app via URL
- [ ] Landing page loads correctly

---

### Module 4: AI Foundry Integration (45 mins)
**Instructor Notes:**
- **Objective**: Connect OpenAI and test agent conversations
- **Format**: AI Foundry portal demo + integration lab
- **Key Points**:
  - Show AI Foundry portal thoroughly
  - Explain model selection (why GPT-4)
  - Demonstrate prompt engineering impact

**AI Foundry Portal Tour (15 mins):**
1. Create AI Foundry project
2. Deploy GPT-4 model
3. Show playground for testing
4. Explain token usage and billing

**Agent Configuration (10 mins):**
- Walk through agent.py code
- Explain system prompt importance
- Show conversation analysis logic

**Hands-On Lab (20 mins):**
- Connect app to AI Foundry endpoint
- Test conversation flow
- Analyze AI feedback
- Experiment with different scenarios

**Common Issues:**
- Model not deployed: Wait 2-3 minutes
- API key errors: Verify environment variables
- Rate limiting: Explain quotas and solutions

**Success Criteria:**
- [ ] AI Foundry project created
- [ ] GPT-4 model deployed
- [ ] App successfully calls OpenAI
- [ ] Conversation analysis working

---

### Module 5: Analytics Dashboard (45 mins)
**Instructor Notes:**
- **Objective**: Implement and view performance analytics
- **Format**: Chart.js demo + storage integration lab
- **Key Points**:
  - Show Chart.js visualization impact
  - Explain Table Storage data model
  - Highlight managed identity security

**Analytics Demo (10 mins):**
- Show completed analytics dashboard
- Explain each metric (professionalism, empathy, etc.)
- Show how trends appear over time

**Implementation Walkthrough (15 mins):**
1. `storage_service.py` - Data persistence
2. Frontend JS - API calls
3. Chart.js configuration
4. CSS styling

**Hands-On Lab (20 mins):**
- Seed demo data
- Implement analytics button
- View performance charts
- Customize visualizations

**Common Issues:**
- Table Storage connection: Verify managed identity
- No data showing: Check case-sensitivity of user IDs
- Chart not rendering: Verify Chart.js CDN loaded

**Success Criteria:**
- [ ] Analytics data saving to Table Storage
- [ ] Chart displays on frontend
- [ ] Multiple metrics visible
- [ ] Data updates after new conversations

---

### Module 6: Advanced Topics (45 mins - Optional)
**Instructor Notes:**
- **Objective**: Production optimization and monitoring
- **Format**: Discussion + optional hands-on
- **Key Points**:
  - Focus on most relevant topics for audience
  - Can skip if time constrained
  - Good for Q&A and exploration

**Topics to Cover:**
- Application Insights integration (10 mins)
- AI Foundry evaluation tools (10 mins)
- Prompt optimization strategies (10 mins)
- Production checklist (5 mins)
- Open Q&A (10 mins)

**Optional Hands-On:**
- Configure Application Insights
- Review trace logs
- Test prompt variations

**Success Criteria:**
- [ ] Understand monitoring options
- [ ] Know how to optimize prompts
- [ ] Production readiness awareness

---

## Common Workshop Issues

### Technical Issues

**Issue: Participant Azure subscription problems**
- Solution: Have spare test subscriptions ready
- Prevention: Verify access 1 week before

**Issue: Slow internet affecting deployments**
- Solution: Pre-download Docker images
- Have USB drives with cached resources

**Issue: Zoom/Teams connectivity problems**
- Solution: Have phone dial-in ready
- Record session for participants to review later

### Timing Issues

**Running Behind Schedule:**
- Skip Module 6 (Advanced)
- Reduce hands-on time, show more demos
- Focus on Modules 1-4 as core content

**Running Ahead of Schedule:**
- Deep dive into Module 6
- Extended Q&A sessions
- Live troubleshooting of participant issues
- Explore custom modifications

### Engagement Issues

**Participants not following along:**
- Take polls: "Raise hand when deployment completes"
- Use breakout rooms for troubleshooting
- Pair programming approach

**Questions derailing workshop:**
- "Great question! Let's discuss in Q&A"
- Create "parking lot" for later topics
- Use chat for async answers

## Post-Workshop

### Immediate (Same Day)
- [ ] Share recording link
- [ ] Send resource cleanup instructions
- [ ] Share feedback survey
- [ ] Answer any follow-up questions

### Follow-Up (Within 1 Week)
- [ ] Send additional resources
- [ ] Share common Q&A document
- [ ] Connect participants on LinkedIn/Teams
- [ ] Gather testimonials

### Long-Term
- [ ] Update workshop based on feedback
- [ ] Create video versions of modules
- [ ] Build community around workshop graduates

## Resources for Instructors

### Required Access
- Workshop GitHub repository (admin)
- Azure subscription for demos
- AI Foundry project pre-configured
- Backup demo environment

### Helpful Materials
- PowerPoint slides (in /docs/assets/)
- Printed architecture diagrams
- Cheat sheet of common commands
- Solution code for all labs

### Emergency Contacts
- Azure support: [support link]
- Workshop creator: [contact info]
- Technical SME: [backup contact]

## Feedback and Improvement

After each workshop:
1. Review feedback survey results
2. Note timing adjustments needed
3. Update troubleshooting sections
4. Share learnings with other instructors

## Questions?

Contact the workshop team:
- Email: [email]
- Teams: [teams channel]
- GitHub Issues: [repo issues]

---

**Good luck with your workshop! 🚀**
