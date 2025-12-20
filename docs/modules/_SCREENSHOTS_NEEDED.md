# Screenshots Needed for Training Modules

This file tracks where screenshots need to be added to enhance the training content.

## Module 1: Getting Started - Repository & Azure Setup

### Screenshot Locations

1. **GitHub ZIP Download**
   - **Location:** After "Option C: Download as ZIP" section
   - **Content:** GitHub repository page showing Code → Download ZIP button
   - **File to save as:** `docs/assets/images/module1-github-zip-download.png`
   - **Callouts needed:** Highlight the green "Code" button and "Download ZIP" option

2. **VS Code Git Clone Dialog**
   - **Location:** After "Option B: Using Visual Studio Code" section
   - **Content:** VS Code Git Clone command palette with repository URL
   - **File to save as:** `docs/assets/images/module1-vscode-clone.png`
   - **Callouts needed:** Show the URL field and folder selection

2. **VS Code Repository Structure**
   - **Location:** After repository structure tree
   - **Content:** VS Code Explorer showing the cloned folder structure
   - **File to save as:** `docs/assets/images/module1-repo-structure.png`
   - **Callouts needed:** Highlight src/, infra/, azure.yaml

3. **Azure CLI Login Success**
   - **Location:** After `az login` command
   - **Content:** Terminal showing successful Azure CLI login
   - **File to save as:** `docs/assets/images/module1-az-login.png`
   - **Callouts needed:** Show the subscription list or "You have logged in" message

4. **Azure Portal - AI Foundry Endpoint**
   - **Location:** In "Option A: You Already Have a Project" section
   - **Content:** Azure Portal showing AI Foundry project Overview with endpoint highlighted
   - **File to save as:** `docs/assets/images/module1-ai-foundry-endpoint.png`
   - **Callouts needed:** Red box around the endpoint URL

5. **AI Foundry Studio - Deployments**
   - **Location:** In "Option A: You Already Have a Project" section
   - **Content:** AI Foundry Studio Deployments page showing GPT model deployment
   - **File to save as:** `docs/assets/images/module1-model-deployment.png`
   - **Callouts needed:** Highlight the deployment name column

6. **VS Code .env File Example**
   - **Location:** In "Option B: Pre-configure with .env File" section
   - **Content:** VS Code showing .env file with example values (sanitized)
   - **File to save as:** `docs/assets/images/module1-env-file.png`
   - **Callouts needed:** Show the file in root directory

7. **Application Demo (Animated)**
   - **Location:** In "Demo: What You'll Build" section
   - **Content:** Animated GIF or multiple screenshots showing:
     - Landing page
     - Conversation interface
     - Mood selector
     - Analytics dashboard
   - **Files to save as:** 
     - `docs/assets/images/module1-demo-landing.png`
     - `docs/assets/images/module1-demo-conversation.png`
     - `docs/assets/images/module1-demo-analytics.png`
   - **OR:** Single animated GIF: `docs/assets/images/module1-demo.gif`
   - **Note:** We already have `cora-demo.gif` - can reuse!

## Screenshot Creation Tips

### For Azure Portal Screenshots:
1. Use a test/demo tenant if possible (hide real subscription IDs)
2. Zoom browser to 100% for consistency
3. Use browser developer tools to highlight UI elements (F12 → Inspect)
4. Capture with Snipping Tool (Windows) or Screenshot (Mac)

### For Terminal/CLI Screenshots:
1. Use a clean terminal with good contrast
2. Increase font size for readability (14-16pt recommended)
3. Show only relevant output (trim long results)
4. Consider using `asciinema` for animated terminal recordings

### For VS Code Screenshots:
1. Use a popular theme (Dark+ or Light+)
2. Zoom to 120-130% for readability
3. Hide sensitive file paths or tokens
4. Collapse unrelated folders to reduce clutter

### Image Specifications:
- **Format:** PNG for static images, GIF for animations
- **Max width:** 1200px (resize larger images)
- **Compression:** Use TinyPNG or similar to reduce file size
- **Alt text:** Always provide descriptive alt text in Markdown

### Adding Screenshots to Markdown:

```markdown
![Alt text description]({{ site.baseurl }}/assets/images/filename.png)
```

Or with additional styling:

```markdown
<div class="screenshot">
  <img src="{{ site.baseurl }}/assets/images/filename.png" alt="Alt text description">
  <p class="caption">Caption explaining what the screenshot shows</p>
</div>
```

## Screenshot Status Tracker

- [ ] module1-vscode-clone.png
- [ ] module1-repo-structure.png
- [ ] module1-az-login.png
- [ ] module1-ai-foundry-endpoint.png
- [ ] module1-model-deployment.png
- [ ] module1-env-file.png
- [ ] module1-demo-landing.png (or reuse existing cora-demo.gif)
- [ ] module1-demo-conversation.png
- [ ] module1-demo-analytics.png

## Module 2+ Screenshots (To Be Determined)

Will be identified as those modules are enhanced.
