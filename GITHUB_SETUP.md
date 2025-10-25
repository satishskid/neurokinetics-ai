# 🚀 GitHub Pages Setup Guide for NeuroKinetics AI

## 📋 Step-by-Step Instructions

### 1. **Create GitHub Repository**

1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it: `neurokinetics-ai` (or your preferred name)
3. Make it **Public** (required for free GitHub Pages hosting)
4. **DO NOT** initialize with README (we'll push existing code)

### 2. **Push Your Code to GitHub**

```bash
# Navigate to your project directory
cd /Users/spr/NEUROKINEAI/neurokinetics-ai

# Initialize git repository
git init

# Add all files
git add .

# Commit initial files
git commit -m "Initial commit: NeuroKinetics AI clinic presentation and demo platform"

# Add remote repository (replace with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/neurokinetics-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. **Enable GitHub Pages**

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Select **main** branch and **/ (root)** folder
6. Click **Save**

### 4. **Configure Repository Settings**

#### General Settings:
- **Repository name**: `neurokinetics-ai`
- **Description**: "AI-powered autism screening platform for pediatric clinics - FDA-grade, HIPAA-compliant"
- **Topics**: `autism-screening`, `pediatric-clinic`, `ai-healthcare`, `medical-device`

#### Pages Settings:
- **Custom domain** (optional): You can set up `demo.neurokinetics.ai` if you own the domain
- **Enforce HTTPS**: ✅ Enable this for security

#### Actions Settings:
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

### 5. **Update URLs in Documentation**

After GitHub Pages is deployed, update these files with your actual GitHub Pages URL:

#### Files to Update:
1. `index.html` - Update demo button links
2. `presentation.html` - Update demo section URLs
3. `CLINIC_SALES_PRESENTATION.md` - Replace localhost URLs
4. `USER_MANUAL_CLINIC.md` - Update demo access instructions

#### Replace these placeholders:
- `https://your-username.github.io` → Your actual GitHub Pages URL
- `YOUR_USERNAME` → Your GitHub username
- `demo.neurokinetics.ai` → Your custom domain (if using)

### 6. **Git Configuration for Team Collaboration**

#### Set up branch protection:
1. Go to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ **Require pull request reviews before merging**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**

#### Add collaborators:
1. Go to **Settings** → **Manage access**
2. Click **Invite a collaborator**
3. Add team members with appropriate roles:
   - **Admin**: Full repository access
   - **Write**: Can push code and create PRs
   - **Read**: Can view and clone repository

### 7. **Deployment Verification**

After pushing your code:

1. **Check Actions tab** - Verify workflow runs successfully
2. **Check Pages section** - Confirm deployment status
3. **Test the URL** - Visit `https://YOUR_USERNAME.github.io/neurokinetics-ai`
4. **Verify all links** - Test presentation and documentation links

### 8. **Custom Domain Setup (Optional)**

If you want to use a custom domain like `demo.neurokinetics.ai`:

1. **In GitHub Pages settings**:
   - Enter custom domain: `demo.neurokinetics.ai`
   - Save and wait for SSL certificate generation

2. **In your DNS provider**:
   ```
   Type: CNAME
   Name: demo
   Value: YOUR_USERNAME.github.io
   TTL: 3600
   ```

3. **Wait for DNS propagation** (usually 15 minutes to 24 hours)

### 9. **Repository Maintenance**

#### Regular Updates:
- Keep documentation current
- Update demo URLs if infrastructure changes
- Monitor GitHub Actions for failures
- Update dependencies and security patches

#### Branch Strategy:
- **main**: Production-ready code
- **develop**: Integration branch for new features
- **feature/***: Individual feature branches
- **hotfix/***: Emergency fixes

### 10. **Security Best Practices**

#### Secrets Management:
- Never commit API keys or sensitive data
- Use GitHub Secrets for environment variables
- Set up Dependabot for security updates

#### Code Review Process:
1. Create feature branch
2. Make changes and commit
3. Push and create pull request
4. Require review from team member
5. Merge after approval and tests pass

---

## 🎯 Expected URLs After Setup

### GitHub Pages URLs:
- **Main site**: `https://YOUR_USERNAME.github.io/neurokinetics-ai/`
- **Presentation**: `https://YOUR_USERNAME.github.io/neurokinetics-ai/presentation.html`
- **Documentation**: `https://YOUR_USERNAME.github.io/neurokinetics-ai/CLINIC_SALES_PRESENTATION.md`

### Custom Domain URLs (if configured):
- **Main site**: `https://demo.neurokinetics.ai/`
- **Presentation**: `https://demo.neurokinetics.ai/presentation.html`

---

## 🆘 Troubleshooting

### Common Issues:

1. **Pages not deploying**:
   - Check Actions tab for errors
   - Verify branch settings in Pages configuration
   - Ensure repository is public

2. **404 errors**:
   - Verify file names and paths are correct
   - Check case sensitivity (GitHub Pages is case-sensitive)
   - Ensure index.html exists in root

3. **Demo not working**:
   - Backend services must be running separately
   - Demo uses external API endpoints
   - Check CORS settings if using custom domains

4. **SSL certificate issues**:
   - Wait for DNS propagation
   - Verify CNAME record is correct
   - Check custom domain settings in GitHub

### Support Contacts:
- **GitHub Support**: support.github.com
- **Repository Issues**: Create issue in your repository
- **Documentation**: docs.github.com/en/pages

---

## 🎉 Success Metrics

After successful deployment, you should have:

✅ **Live GitHub Pages site** with clinic presentation  
✅ **Interactive demo** accessible via web browser  
✅ **Complete documentation** for clinic implementation  
✅ **Professional sales materials** for pediatric practices  
✅ **Custom domain** (optional) for branded access  

**Ready to showcase NeuroKinetics AI to potential clinic clients!** 🚀