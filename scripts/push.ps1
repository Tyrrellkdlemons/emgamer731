#requires -Version 5.0
<#
.SYNOPSIS
    EMGamer731 — one-shot push to GitHub.

.DESCRIPTION
    Validates the build, makes the initial commit, creates the GitHub repo via
    GitHub CLI, and pushes to main. Run from project root.

.EXAMPLE
    .\scripts\push.ps1
    .\scripts\push.ps1 -RepoName emgamer731 -Visibility public
#>

param(
    [string]$RepoName = "emgamer731",
    [ValidateSet("public", "private")]
    [string]$Visibility = "public",
    [string]$CommitMessage = "feat: EMGamer731 v1.2.0 — real assets, video integration, YouTube auto-pull, /eats, mobile polish"
)

$ErrorActionPreference = "Stop"

function Step($n, $msg) { Write-Host "`n[$n] $msg" -ForegroundColor Cyan }
function OK($msg)       { Write-Host "  OK $msg"  -ForegroundColor Green }
function Fail($msg)     { Write-Host "  X  $msg"  -ForegroundColor Red; exit 1 }

# 1. Verify dependencies
Step 1 "Checking required tools"
foreach ($tool in @("git", "node", "npm")) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { Fail "$tool not found in PATH" }
    OK "$tool found"
}
$ghAvailable = [bool](Get-Command "gh" -ErrorAction SilentlyContinue)
if ($ghAvailable) { OK "GitHub CLI found (will use for repo creation)" }
else { Write-Host "  !  GitHub CLI not found — falling back to manual remote add" -ForegroundColor Yellow }

# 2. Install + build
Step 2 "Installing dependencies (npm install --legacy-peer-deps)"
npm install --legacy-peer-deps --no-fund --no-audit
if ($LASTEXITCODE -ne 0) { Fail "npm install failed" }
OK "Dependencies installed"

Step 3 "Type-checking"
npm run typecheck
if ($LASTEXITCODE -ne 0) { Fail "Type check failed — fix errors before pushing" }
OK "TypeScript clean"

Step 4 "Building production bundle"
npm run build
if ($LASTEXITCODE -ne 0) { Fail "Build failed" }
OK "Build succeeded"

# 5. Git init + commit
Step 5 "Initializing git repo"
if (-not (Test-Path ".git")) { git init | Out-Null; OK "git init done" } else { OK "Already a git repo" }

git add .
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "  !  Nothing to commit" -ForegroundColor Yellow
} else {
    git commit -m $CommitMessage | Out-Null
    OK "Commit created: $CommitMessage"
}

git branch -M main 2>$null
OK "Branch is main"

# 6. Push
Step 6 "Pushing to GitHub"
if ($ghAvailable) {
    Write-Host "  Creating $Visibility repo $RepoName via GitHub CLI..." -ForegroundColor Gray
    gh repo create $RepoName "--$Visibility" --source=. --remote=origin --push
    if ($LASTEXITCODE -ne 0) { Fail "gh repo create failed (already exists? try a different -RepoName)" }
    OK "Repo created + initial push complete"
} else {
    Write-Host @"

  GitHub CLI not installed. Manual steps:

  1. Open https://github.com/new
  2. Name: $RepoName  (visibility: $Visibility)  — DO NOT initialize with README
  3. Run:
       git remote add origin https://github.com/<your-username>/$RepoName.git
       git push -u origin main

"@ -ForegroundColor Yellow
    exit 0
}

# 7. Next steps
Step 7 "Done — next: Netlify"
Write-Host @"

  Repo: https://github.com/<your-username>/$RepoName

  Deploy on Netlify in 2 clicks:
    1. https://app.netlify.com/start
    2. Click "Import from GitHub" → pick "$RepoName"
    3. Confirm build command (npm run build) + publish dir (.next) — already in netlify.toml
    4. Click Deploy

  Don't forget environment variables (see DEPLOY.md):
    - YOUTUBE_API_KEY (for video auto-pull)
    - TIKTOK_WEBHOOK_SECRET + ADMIN_LIVE_SECRET (for live triggers)
    - NEXT_PUBLIC_SITE_URL (your final domain)

"@ -ForegroundColor Green
