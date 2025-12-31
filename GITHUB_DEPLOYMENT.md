# 🚀 GitHub Pages Deployment Guide

This guide walks you through deploying the Cora Voice Agent Training workshop to GitHub Pages.

## ✅ Prerequisites

- GitHub account
- Git installed locally (already configured)
- Repository initialized (✓ Done!)

## 📝 Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Configure your repository:
   - **Repository name**: `Cora-Voice-Agent-Training` (or your preferred name)
   - **Description**: "AI-Powered Voice Agent Training Workshop with Azure AI Foundry"
   - **Visibility**: 
     - Choose **Public** for public workshops
     - Choose **Private** if you want to control access
   - **Do NOT initialize** with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### 2. Push to GitHub

After creating the repository, run these commands in your terminal:

```bash
cd "C:\Local Dev\Cora-Voice-Agent-Training"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Cora-Voice-Agent-Training.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Build and deployment"**:
   - **Source**: Select "GitHub Actions"
   - The workflow file we created will automatically handle deployment
5. Click **"Save"**

### 4. Wait for Deployment

1. Go to the **"Actions"** tab in your repository
2. You should see the "Deploy Jekyll site to GitHub Pages" workflow running
3. Wait for it to complete (usually 1-2 minutes)
4. Once complete, your site will be live!

### 5. Access Your Site

Your workshop will be available at:
```
https://YOUR_USERNAME.github.io/Cora-Voice-Agent-Training/
```

For example, if your username is `johndoe`:
```
https://johndoe.github.io/Cora-Voice-Agent-Training/
```

## 🔧 Configuration Options

### Custom Domain (Optional)

If you want to use a custom domain:

1. In repository Settings → Pages
2. Add your custom domain under "Custom domain"
3. Follow GitHub's instructions to configure DNS

### Private Repository Access

If your repository is private:

1. Only users with repository access can view the site
2. Go to Settings → Collaborators to add team members
3. Or create a GitHub Organization for team-wide access

## 🔄 Updating the Site

After making changes locally:

```bash
cd "C:\Local Dev\Cora-Voice-Agent-Training"

# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Update module content"

# Push to GitHub
git push
```

The GitHub Actions workflow will automatically rebuild and deploy your site within 1-2 minutes.

## 📋 What Gets Deployed

The following structure is deployed to GitHub Pages:

```
docs/
├── _config.yml              # Jekyll configuration
├── _layouts/                # Page templates
├── assets/                  # CSS, JS, images
├── modules/                 # Module content pages
├── pages/                   # Prerequisites and other pages
└── index.md                 # Homepage
```

## 🐛 Troubleshooting

### Workflow Fails

1. Check the Actions tab for error messages
2. Ensure Gemfile and _config.yml are valid
3. Verify all file paths are correct

### Site Not Loading

1. Check that GitHub Pages is enabled in Settings
2. Verify the workflow completed successfully
3. Try accessing the site in incognito mode (cache issue)
4. Check that baseurl is configured correctly in _config.yml

### Theme Not Appearing

1. Ensure all CSS files are in `docs/assets/css/`
2. Check that _config.yml references the correct theme
3. Clear browser cache

### Deployment Error: Subnet Delegation Conflict

**Error**: `ManagedEnvironmentSubnetIsDelegated` - subnet cannot be used as it's already delegated

**Cause**: Occurs when redeploying to a resource group that has a failed Container Apps Environment from a previous deployment.

**Solution**: Delete the resource group and redeploy:
```bash
az group delete --name rg-dev --yes
# Wait for deletion to complete, then run the workflow again
```

Alternatively, use a different environment name in the workflow to create a fresh resource group.

## 🎯 Next Steps

After deployment:

1. ✅ Test all navigation links
2. ✅ Verify images and GIFs load correctly
3. ✅ Test progress tracking functionality
4. ✅ Check responsive design on mobile
5. ✅ Update README.md with your GitHub Pages URL
6. ✅ Share the link with your workshop attendees!

## 📞 Need Help?

- Check GitHub's [Pages documentation](https://docs.github.com/en/pages)
- Review Jekyll's [deployment guide](https://jekyllrb.com/docs/github-pages/)
- Ask your CSA team for assistance

---

**Ready to deploy?** Follow the steps above and your training site will be live in minutes! 🚀
