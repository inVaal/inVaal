#!/bin/bash

# =========================================================
# InVaal [016] — GitHub Pages Deployment Script
#
# File:
# ./deploy_.sh
#
# Responsibilities:
# - Check Git configuration
# - Commit changes to master
# - Push master to GitHub
# - Create/update gh-pages
# - Deploy the current project to GitHub Pages
# - Return to master after deployment
#
# IMPORTANT:
# The script stops immediately if a command fails.
# =========================================================


# =========================================================
# SAFETY
# =========================================================

# Stop the script when any command fails.
# This prevents false "deployment successful" messages.
set -e


# =========================================================
# CONFIGURATION
# =========================================================

MASTER_BRANCH="master"
PAGES_BRANCH="gh-pages"


# =========================================================
# GIT IDENTITY CHECK
# =========================================================

echo ""
echo "========================================================="
echo " InVaal [016] — Deployment"
echo "========================================================="
echo ""

echo "Checking Git identity..."


GIT_NAME="$(git config user.name || true)"
GIT_EMAIL="$(git config user.email || true)"


if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then

    echo ""
    echo "ERROR: Git identity is not configured."
    echo ""
    echo "Run:"
    echo ""
    echo 'git config --global user.name "Your Name"'
    echo 'git config --global user.email "you@example.com"'
    echo ""

    exit 1

fi


echo "Git user: $GIT_NAME"
echo "Git email: $GIT_EMAIL"
echo ""


# =========================================================
# CURRENT BRANCH
# =========================================================

CURRENT_BRANCH="$(git branch --show-current)"


echo "Current branch: $CURRENT_BRANCH"
echo ""


# =========================================================
# MAKE SURE WE ARE ON MASTER
# =========================================================

if [ "$CURRENT_BRANCH" != "$MASTER_BRANCH" ]; then

    echo "Switching to $MASTER_BRANCH..."

    git switch "$MASTER_BRANCH"

fi


# =========================================================
# CHECK REMOTE
# =========================================================

echo "Checking GitHub remote..."


if ! git remote get-url origin > /dev/null 2>&1; then

    echo ""
    echo "ERROR: GitHub remote 'origin' is not configured."
    echo ""
    echo "Check with:"
    echo ""
    echo "git remote -v"
    echo ""

    exit 1

fi


echo "GitHub remote found."
echo ""


# =========================================================
# CHECK WORKING TREE
# =========================================================

echo "Checking project changes..."
echo ""

git status --short

echo ""


# =========================================================
# COMMIT MESSAGE
# =========================================================

read -r -p "Enter commit message: " COMMIT_MESSAGE


if [ -z "$COMMIT_MESSAGE" ]; then

    echo ""
    echo "ERROR: Commit message cannot be empty."
    exit 1

fi


# =========================================================
# STAGE CHANGES
# =========================================================

echo ""
echo "Staging project changes..."

git add .


# =========================================================
# CHECK WHETHER THERE IS ANYTHING TO COMMIT
# =========================================================

if git diff --cached --quiet; then

    echo ""
    echo "No new changes to commit."

else

    echo ""
    echo "Creating commit..."

    git commit -m "$COMMIT_MESSAGE"

fi


# =========================================================
# PUSH MASTER
# =========================================================

echo ""
echo "Pushing $MASTER_BRANCH to GitHub..."

git push origin "$MASTER_BRANCH"

echo ""
echo "$MASTER_BRANCH pushed successfully."


# =========================================================
# SAVE MASTER COMMIT
# =========================================================

MASTER_COMMIT="$(git rev-parse "$MASTER_BRANCH")"


echo ""
echo "Master commit:"
echo "$MASTER_COMMIT"


# =========================================================
# CHECK FOR GH-PAGES
# =========================================================

echo ""
echo "Checking $PAGES_BRANCH branch..."


if git show-ref --verify --quiet "refs/heads/$PAGES_BRANCH"; then

    echo "$PAGES_BRANCH branch exists."

else

    echo "$PAGES_BRANCH branch does not exist."
    echo "Creating $PAGES_BRANCH..."

    git switch --orphan "$PAGES_BRANCH"

    # Remove tracked project files from the new orphan branch.
    git rm -rf . > /dev/null 2>&1 || true

    git commit --allow-empty -m "Initialize GitHub Pages"

fi


# =========================================================
# SWITCH TO GH-PAGES
# =========================================================

git switch "$PAGES_BRANCH"


# =========================================================
# SYNC DEPLOYMENT FILES
# =========================================================

echo ""
echo "Preparing GitHub Pages deployment..."

# Return to the master version of the project.
git checkout "$MASTER_BRANCH" -- .


# =========================================================
# REMOVE FILES THAT SHOULD NOT BE DEPLOYED
# =========================================================

# The deployment branch contains the website itself.
#
# Keep this section empty unless we later decide that
# specific development-only files should be excluded.


# =========================================================
# CHECK DEPLOYMENT CHANGES
# =========================================================

echo ""
echo "Checking deployment changes..."
echo ""

git status --short


# =========================================================
# COMMIT DEPLOYMENT
# =========================================================

if git diff --quiet && git diff --cached --quiet; then

    echo ""
    echo "No deployment changes detected."

else

    git add .

    git commit -m "Deploy: $COMMIT_MESSAGE"

fi


# =========================================================
# PUSH GH-PAGES
# =========================================================

echo ""
echo "Pushing $PAGES_BRANCH to GitHub..."

git push -u origin "$PAGES_BRANCH"

echo ""
echo "GitHub Pages branch updated successfully."


# =========================================================
# RETURN TO MASTER
# =========================================================

echo ""
echo "Returning to $MASTER_BRANCH..."

git switch "$MASTER_BRANCH"


# =========================================================
# FINAL STATUS
# =========================================================

echo ""
echo "========================================================="
echo " Deployment successful!"
echo "========================================================="
echo ""
echo "Master branch:"
echo "  $MASTER_BRANCH"
echo ""
echo "Pages branch:"
echo "  $PAGES_BRANCH"
echo ""
echo "Website deployment is complete."
echo ""