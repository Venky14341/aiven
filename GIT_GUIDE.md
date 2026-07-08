# Git Update Guide

Use these commands to keep your project updated in GitHub.

## Initial Setup (If not already done)

```bash
git init
git add .
git commit -m "Initial commit: Aivenky Nova with Auth and UI"
git branch -M main
git remote add origin https://github.com/your-username/aivenky.git
git push -u origin main
```

## Regular Updates

Every time you make changes, run:

```bash
# 1. Stage all changes
git add .

# 2. Commit with a message
git commit -m "Update: Added persistent auth and premium UI"

# 3. Push to GitHub
git push origin main
```

## Update Script

You can create a simple script to automate this.

**Windows (update.bat):**
```batch
@echo off
git add .
set /p msg="Enter commit message: "
git commit -m "%msg%"
git push origin main
echo Done!
```

**Mac/Linux (update.sh):**
```bash
#!/bin/bash
git add .
read -p "Enter commit message: " msg
git commit -m "$msg"
git push origin main
echo "Done!"
```
