@echo off
REM Build production bundle + deploy to Netlify.
REM Uses Netlify CLI — opens a browser dialog for first-time auth.
cd /d "%~dp0"
title Netlify Deploy - emgamer731
echo.
echo ============================================
echo   Building + deploying emgamer731 to Netlify
echo ============================================
echo.

where node >nul 2>nul || (
  echo [X] Node.js is not installed. Install from https://nodejs.org
  pause
  exit /b 1
)

where npm >nul 2>nul || (
  echo [X] npm not found
  pause
  exit /b 1
)

REM 1. Install dependencies if needed
if not exist "node_modules" (
  echo --- Installing dependencies ---
  call npm install --legacy-peer-deps --no-fund --no-audit
  if errorlevel 1 (
    echo [X] npm install failed.
    pause
    exit /b 1
  )
)

REM 2. Build
echo.
echo --- Building production bundle ---
call npm run build
if errorlevel 1 (
  echo [X] Build failed. Fix errors and rerun.
  pause
  exit /b 1
)

REM 3. Check Netlify CLI
where netlify >nul 2>nul || (
  echo [i] Netlify CLI not found. Installing globally...
  call npm install -g netlify-cli --no-fund --no-audit
)

REM 4. Deploy
echo.
echo --- Deploying to Netlify ---
echo If this is the first deploy, you'll be prompted to:
echo   1. Sign in (browser opens)
echo   2. Create a new site OR link to existing
echo   3. Confirm publish directory: .next
echo.
call netlify deploy --build --prod

if errorlevel 1 (
  echo.
  echo [X] Deploy failed.
  pause
  exit /b 1
)

echo.
echo ============================================
echo   Deploy complete.
echo   Don't forget to set environment variables in the Netlify dashboard:
echo     - YOUTUBE_API_KEY        (auto-pull videos + Shorts)
echo     - TIKTOK_WEBHOOK_SECRET  (TikTok-live banner trigger)
echo     - ADMIN_LIVE_SECRET      (iPhone-shortcut go-live toggle)
echo     - NEXT_PUBLIC_SITE_URL   (canonical URLs)
echo   See MANUAL-STEPS-v1-2-0.md for the full guide.
echo ============================================
pause
