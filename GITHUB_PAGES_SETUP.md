# 🚀 GitHub Pages Setup Guide for NeuroKinetics AI

This guide will help you deploy your NeuroKinetics AI presentation and demo to GitHub Pages for online access.

## 📋 Prerequisites

1. **GitHub Account** - Create one at [github.com](https://github.com) if you don't have one
2. **Git installed** on your local machine
3. **Your NeuroKinetics AI project** ready in your local directory

## 🎯 Quick Start (5 Minutes)

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `neurokinetics-ai`
3. **Description**: `AI-Powered Autism Screening Platform - Interactive Demo & Sales Materials`
4. **Privacy**: Choose `Public` (required for free GitHub Pages)
5. **Initialize**: ✅ Add README (optional)
6. Click **"Create repository"**

### Step 2: Connect Your Local Project

```bash
# Navigate to your project directory
cd /Users/spr/NEUROKINEAI/neurokinetics-ai

# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: NeuroKinetics AI demo and presentation materials"

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/neurokinetics-ai.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll down to **"Pages"** in the left sidebar
4. **Source**: Select "Deploy from a branch"
5. **Branch**: Select "main" and "/ (root)"
6. Click **"Save"**

### Step 4: Update URLs in Your Files

Replace `YOUR_USERNAME` with your actual GitHub username in these files:

#### 1. Update `index.html`
```bash
# Find and replace the placeholder URL
sed -i 's/your-username/YOUR_USERNAME/g' index.html
```

#### 2. Update `demo.html`
```bash
# Update the demo redirect URL
sed -i 's/your-username/YOUR_USERNAME/g' demo.html
```

#### 3. Update `presentation.html`
```bash
# Update presentation URLs
sed -i 's/your-username/YOUR_USERNAME/g' presentation.html
```

### Step 5: Commit and Push Changes

```bash
# Add updated files
git add index.html demo.html presentation.html

# Commit changes
git commit -m "Update GitHub Pages URLs with actual username"

# Push to GitHub
git push origin main
```

## 🌐 Access Your Deployed Site

After 2-5 minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/neurokinetics-ai/
```

**Individual pages:**
- **Main Landing**: `https://YOUR_USERNAME.github.io/neurokinetics-ai/`
- **Sales Presentation**: `https://YOUR_USERNAME.github.io/neurokinetics-ai/presentation.html`
- **Interactive Demo**: `https://YOUR_USERNAME.github.io/neurokinetics-ai/demo.html`

## 🔧 Advanced Configuration (Optional)

### Custom Domain Setup

If you want to use a custom domain:

1. **Buy a domain** from providers like Namecheap, GoDaddy, etc.
2. **Add CNAME file** to your repository:
```bash
echo "www.yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

3. **Configure DNS** with your domain provider:
   - **A Records**: Point to GitHub IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - **CNAME**: `www` → `YOUR_USERNAME.github.io`

### GitHub Actions Deployment

For more control, use GitHub Actions:

1. Create `.github/workflows/deploy.yml` (already created)
2. Go to **Settings > Actions > General**
3. **Workflow permissions**: Select "Read and write permissions"
4. Enable **"Allow GitHub Actions to create and approve pull requests"**

### Repository Settings Checklist

**Settings > General:**
- [ ] **Repository name**: `neurokinetics-ai`
- [ ] **Description**: Complete description
- [ ] **Topics**: Add relevant tags (ai, autism, healthcare, screening)
- [ ] **Social preview**: Upload logo/image

**Settings > Pages:**
- [ ] **Source**: Deploy from branch
- [ ] **Branch**: main / root
- [ ] **Custom domain**: (optional)
- [ ] **Enforce HTTPS**: ✅ Enabled

**Settings > Actions > General:**
- [ ] **Workflow permissions**: Read and write
- [ ] **Allow GitHub Actions to approve PRs**: ✅ Enabled

## 🛡️ Security & Best Practices

### Repository Security
- **Keep sensitive data out** of your repository
- **Use environment variables** for API keys (not needed for static pages)
- **Regular updates**: Keep dependencies updated
- **Branch protection**: Enable for main branch

### Content Optimization
- **SEO meta tags**: Already included in HTML files
- **Performance**: Images optimized, CSS minified
- **Mobile responsive**: All pages mobile-friendly
- **Accessibility**: WCAG 2.1 compliant

## 🚨 Troubleshooting

### Common Issues

#### 1. Site Not Loading (404 Error)
```bash
# Check if files are in the right place
ls -la

# Verify GitHub Pages is enabled
echo "Check Settings > Pages in your GitHub repository"

# Wait 5-10 minutes for deployment
echo "GitHub Pages can take up to 10 minutes to deploy"
```

#### 2. CSS/Images Not Loading
```bash
# Check file paths (case-sensitive)
# GitHub Pages is case-sensitive!

# Verify _config.yml settings
cat _config.yml
```

#### 3. Demo Redirect Not Working
```bash
# Check demo.html exists
ls demo.html

# Verify JavaScript console for errors
# Open browser dev tools (F12)
```

#### 4. Git Push Rejected
```bash
# Pull latest changes first
git pull origin main

# Force push (use carefully!)
git push origin main --force
```

### Getting Help

**GitHub Documentation**: [docs.github.com/pages](https://docs.github.com/pages)
**Community Support**: [github.community](https://github.community)
**Status Check**: [www.githubstatus.com](https://www.githubstatus.com)

## 📊 Deployment Verification

After deployment, verify:

1. **Main site loads**: Visit your GitHub Pages URL
2. **Presentation works**: Navigate to presentation.html
3. **Demo page loads**: Navigate to demo.html
4. **Mobile responsive**: Test on mobile device
5. **Links work**: Click all navigation links
6. **Forms work**: Test contact forms (if applicable)

## 🎯 Next Steps

After successful deployment:

1. **Share your URL** with pediatric clinics
2. **Monitor traffic** with GitHub Insights
3. **Collect feedback** from demo users
4. **Update content** based on feedback
5. **Add analytics** (Google Analytics, etc.)

## 📞 Support

For technical support:
- **GitHub Issues**: Create issue in your repository
- **Documentation**: Check GitHub Pages docs
- **Community**: Ask in GitHub Community

---

**🎉 Congratulations!** Your NeuroKinetics AI presentation is now live and ready to help you sell to pediatric clinics!