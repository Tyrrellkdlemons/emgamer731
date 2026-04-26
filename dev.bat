@echo off
REM Local dev server — opens http://localhost:3000
cd /d "%~dp0"
title EMGamer731 Dev Server

if not exist "node_modules" (
  echo --- Installing dependencies (first time only) ---
  call npm install --legacy-peer-deps --no-fund --no-audit
)

echo.
echo Starting dev server at http://localhost:3000
echo Press Ctrl+C to stop.
echo.
call npm run dev
