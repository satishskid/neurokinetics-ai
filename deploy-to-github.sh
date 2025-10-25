#!/bin/bash

# 🚀 NeuroKinetics AI GitHub Pages Deployment Script
# This script automates the deployment of your presentation to GitHub Pages

set -e  # Exit on any error

echo "🚀 NeuroKinetics AI - GitHub Pages Deployment"
echo "=============================================="

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Get GitHub username
echo "📋 GitHub Repository Setup"
echo "----------------------------"
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name (default: neurokinetics-ai): " REPO_NAME
REPO_NAME=${REPO_NAME:-neurokinetics-ai}

# Create GitHub repository URL
REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo ""
echo "📁 Preparing files..."
echo "----------------------"

# Update URLs with actual GitHub username
echo "📝 Updating URLs with your GitHub username..."
sed -i.bak "s/your-username/${GITHUB_USERNAME}/g" index.html demo.html presentation.html
rm -f *.bak

echo "✅ URLs updated successfully!"

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git config user.name "${GITHUB_USERNAME}"
    git config user.email "${GITHUB_USERNAME}@users.noreply.github.com"
else
    echo "📦 Git repository already exists"
fi

# Add all files
echo "📂 Adding files to git..."
git add .

# Commit changes
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "Deploy NeuroKinetics AI presentation and demo to GitHub Pages
    
    - Added interactive sales presentation
    - Created demo landing page
    - Updated URLs for GitHub Pages deployment
    - Included implementation guides and user manuals"
fi

# Check if remote exists
if git remote get-url origin &> /dev/null; then
    echo "🔗 Remote origin already exists"
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "   Current remote: ${CURRENT_REMOTE}"
    
    read -p "Do you want to update the remote URL? (y/N): " UPDATE_REMOTE
    if [[ $UPDATE_REMOTE =~ ^[Yy]$ ]]; then
        git remote set-url origin ${REPO_URL}
        echo "✅ Remote updated to: ${REPO_URL}"
    fi
else
    echo "🔗 Adding remote repository..."
    git remote add origin ${REPO_URL}
fi

# Push to GitHub
echo ""
echo "☁️  Pushing to GitHub..."
echo "-------------------------"

# Create main branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/main; then
    git checkout -b main
fi

echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "🌐 GitHub Pages Setup Instructions"
echo "====================================="
echo ""
echo "1. Go to: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings"
echo "2. Scroll down to 'Pages' in the left sidebar"
echo "3. Under 'Source', select 'Deploy from a branch'"
echo "4. Select 'main' branch and '/ (root)' folder"
echo "5. Click 'Save'"
echo ""
echo "⏱️  Your site will be live in 2-5 minutes at:"
echo "   https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo ""
echo "📱 Individual pages:"
echo "   Main: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo "   Presentation: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/presentation.html"
echo "   Demo: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/demo.html"
echo ""
echo "✅ Deployment complete!"

# Optional: Open browser to GitHub settings
read -p "Would you like to open GitHub settings now? (y/N): " OPEN_BROWSER
if [[ $OPEN_BROWSER =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings"
    else
        echo "Please open: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings"
    fi
fi

echo ""
echo "🎉 Thank you for using NeuroKinetics AI!"
echo "For support, visit: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/issues"