@echo off
REM Push the local project to github.com/Tyrrellkdlemons/emgamer731.
REM Uses Git Credential Manager — a browser dialog opens for first-time auth.
cd /d "%~dp0"
title Push to GitHub - emgamer731
echo.
echo ============================================
echo   Pushing to github.com/Tyrrellkdlemons/emgamer731
echo ============================================
echo.

where git >nul 2>nul || (
  echo [X] git is not installed. Install Git for Windows: https://git-scm.com/downloads
  pause
  exit /b 1
)

REM 0. Clear any stale git lock files that block staging
if exist ".git\index.lock" (
  echo [i] Removing stale .git\index.lock
  del /q /f ".git\index.lock" 2>nul
)
if exist ".git\HEAD.lock" del /q /f ".git\HEAD.lock" 2>nul
if exist ".git\refs\heads\main.lock" del /q /f ".git\refs\heads\main.lock" 2>nul

REM 1. Make sure all current files are committed locally
echo --- Staging local files ---
REM Refresh index in case CRLF normalization is hiding changes
git update-index --refresh >nul 2>nul
REM Force re-evaluation by touching working tree timestamps
git status --porcelain >nul 2>nul
git add -A --renormalize >nul 2>nul
git add -A
REM Check WORKING tree changes (not just cached) to detect missed stages
for /f %%H in ('git status --porcelain ^| find /c /v ""') do set CHANGES=%%H
if "%CHANGES%"=="0" (
  git diff --cached --quiet
  if errorlevel 1 (
    git commit -m "feat: EMGamer731 v1.6.11 — wired admin HLS URL paste through to inline player. Pasting the m3u8 in /admin/live now SHORT-CIRCUITS the scraper: /api/tiktok-live-stream returns the stored URL, TikTokLiveHlsPlayer plays it via HLS.js inside the butter-toast frame. Net: paste once, instant inline TikTok-live playback regardless of TikTok login walls." >nul
    echo [i] Local commit created.
  ) else (
    echo [i] No local changes to commit.
  )
) else (
  REM There are working-tree changes; force-stage and commit
  git add -A
  git commit -m "feat: EMGamer731 v1.6.11 — wired admin HLS URL paste through to inline player. Pasting the m3u8 in /admin/live now SHORT-CIRCUITS the scraper: /api/tiktok-live-stream returns the stored URL, TikTokLiveHlsPlayer plays it via HLS.js inside the butter-toast frame. Net: paste once, instant inline TikTok-live playback regardless of TikTok login walls." >nul 2>nul
  echo [i] Local commit created (forced stage of %CHANGES% files^).
)

REM 2. Initialize repo if needed
if not exist ".git" (
  echo --- Initializing git repo ---
  git init
  git branch -M main
  git add -A
  git commit -m "feat: EMGamer731 v1.6.11b"
)

REM 3. Set the remote
echo.
echo --- Setting remote 'origin' ---
git remote remove origin 2>nul
git remote add origin https://github.com/Tyrrellkdlemons/emgamer731.git
git remote -v

REM 4. Pull GitHub's README commit and merge with our history
echo.
echo --- Merging GitHub's README commit ---
git fetch origin main 2>nul
git merge origin/main --allow-unrelated-histories --no-edit 2>nul
if errorlevel 1 (
  echo [!] Merge had conflicts or no remote yet. Will force-push to overwrite.
  git merge --abort 2>nul
  set FORCE=1
)

REM 5. Push
echo.
echo --- Pushing to origin/main ---
if defined FORCE (
  git push -u --force origin main
) else (
  git push -u origin main
)

if errorlevel 1 (
  echo.
  echo [X] Push failed. If a credential dialog opened, complete the sign-in and run this script again.
  echo     If the repo doesn't exist yet, create it at:
  echo       https://github.com/new   (name: emgamer731, do NOT initialize with README)
  pause
  exit /b 1
)

echo.
echo ============================================
echo   Push complete.
echo   Repo: https://github.com/Tyrrellkdlemons/emgamer731
echo   Netlify will auto-deploy from this push if continuous deploys are enabled.
echo ============================================
pause
REM v1.6.9 force-push trigger 1777270367
