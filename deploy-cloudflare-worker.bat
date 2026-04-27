@echo off
REM Deploy the EMGamer731 TikTok scraper to Cloudflare Workers.
REM v1.7.4 — handles npm install, wrangler login, wrangler deploy.
REM
REM First-time use:
REM   - npm + node must be installed (you already have these for the site)
REM   - Wrangler login opens Chrome to sign into your free Cloudflare account
REM Subsequent runs:
REM   - Just runs `wrangler deploy` to push code changes; no re-auth needed.

cd /d "%~dp0\cloudflare-worker"
title Deploy EMGamer731 TikTok Worker
echo.
echo ============================================
echo   EMGamer731 - Cloudflare Worker Deploy
echo ============================================
echo.

where npm >nul 2>nul || (
  echo [X] npm not found. Install Node.js: https://nodejs.org/
  pause
  exit /b 1
)

REM 1. Install wrangler if not already global
where wrangler >nul 2>nul
if errorlevel 1 (
  echo --- Installing wrangler globally ---
  call npm install -g wrangler
  if errorlevel 1 (
    echo [X] wrangler install failed. Try: npm install -g wrangler
    pause
    exit /b 1
  )
)

REM 2. Check auth state. If not authed, kick login (opens browser).
echo.
echo --- Checking Cloudflare auth ---
call wrangler whoami >nul 2>nul
if errorlevel 1 (
  echo [i] Not signed into Cloudflare. Opening browser for OAuth...
  call wrangler login
  if errorlevel 1 (
    echo [X] Cloudflare login failed.
    pause
    exit /b 1
  )
)

REM 3. Deploy
echo.
echo --- Deploying to Cloudflare Workers ---
call wrangler deploy
if errorlevel 1 (
  echo [X] Deploy failed. See output above.
  pause
  exit /b 1
)

echo.
echo ============================================
echo   Deploy complete.
echo.
echo   COPY the worker URL printed above (looks like
echo   https://emgamer731-tiktok-scraper.YOUR-NAME.workers.dev)
echo.
echo   Then on Netlify:
echo     1. Sites - emgamer731 - Site settings - Environment variables
echo     2. Add: TIKTOK_SCRAPER_WORKER_URL = ^<that URL^>
echo     3. Trigger redeploy.
echo ============================================
pause
