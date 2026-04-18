@echo off
REM ============================================
REM PhoneStore Copy Only Script
REM Copy frontend/project to public (NO deploy)
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════╗
echo ║  📁 PhoneStore Copy Script (No Deploy)         ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Step 1: Copy frontend/project to public
echo 📁 Copying frontend/project to public...
xcopy "frontend\project" "public" /E /I /Y /Q
if errorlevel 1 (
    echo ❌ Copy failed!
    pause
    exit /b 1
)
echo.

REM Step 2: Count files
for /f %%A in ('dir public\ /s /b ^| find /c /v ""') do set count=%%A
echo.

REM Step 3: Success
echo ╔════════════════════════════════════════════════╗
echo ║  ✅ Copy completed successfully!               ║
echo ║                                                ║
echo ║  📊 Status:                                    ║
echo ║     Files in public/: %count% items           ║
echo ║                                                ║
echo ║  ⏭️  Next: Review files or run deploy.bat      ║
echo ╚════════════════════════════════════════════════╝
echo.

pause
