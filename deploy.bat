@echo off
REM ============================================
REM PhoneStore Deployment Script
REM Auto-copy frontend/project to public + Deploy
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════╗
echo ║  🚀 PhoneStore Deployment Script               ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Check if Firebase CLI is installed
echo 🔍 Checking Firebase CLI...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not installed!
    echo 📌 Install: npm install -g firebase-tools
    pause
    exit /b 1
)
echo ✅ Firebase CLI found
echo.

REM Step 1: Copy frontend/project to public
echo 📁 Copying frontend/project to public...
xcopy "frontend\project" "public" /E /I /Y /Q
if errorlevel 1 (
    echo ❌ Copy failed!
    pause
    exit /b 1
)
echo ✅ Files copied successfully
echo.

REM Step 2: Deploy to Firebase
echo 🚀 Deploying to Firebase Hosting...
firebase deploy --only hosting
if errorlevel 1 (
    echo ❌ Deployment failed!
    echo 📌 Check your Internet connection or Firebase setup
    pause
    exit /b 1
)
echo.

REM Step 3: Success
echo ╔════════════════════════════════════════════════╗
echo ║  ✅ Deployment completed successfully!         ║
echo ║                                                ║
echo ║  🌍 Your website is live at:                   ║
echo ║  https://myteamproject-36c2f.firebaseapp.com   ║
echo ╚════════════════════════════════════════════════╝
echo.

pause
