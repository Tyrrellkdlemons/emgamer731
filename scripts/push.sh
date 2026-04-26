#!/usr/bin/env bash
# EMGamer731 — one-shot push (macOS / Linux / Git Bash).
# Run from project root: bash scripts/push.sh

set -euo pipefail

REPO_NAME="${REPO_NAME:-emgamer731}"
VISIBILITY="${VISIBILITY:-public}"
COMMIT_MSG="${COMMIT_MSG:-feat: EMGamer731 v1.2.0 — real assets, video integration, YouTube auto-pull, /eats, mobile polish}"

step() { printf "\n\033[36m[%s] %s\033[0m\n" "$1" "$2"; }
ok()   { printf "  \033[32mOK\033[0m %s\n" "$1"; }
fail() { printf "  \033[31mX\033[0m %s\n" "$1"; exit 1; }

step 1 "Checking required tools"
for t in git node npm; do command -v "$t" >/dev/null 2>&1 || fail "$t not found in PATH"; ok "$t found"; done
HAS_GH=0; command -v gh >/dev/null 2>&1 && { HAS_GH=1; ok "GitHub CLI found"; } || echo "  !  GitHub CLI not found — falling back to manual remote add"

step 2 "Installing dependencies"
npm install --legacy-peer-deps --no-fund --no-audit
ok "Dependencies installed"

step 3 "Type-checking"
npm run typecheck
ok "TypeScript clean"

step 4 "Building production bundle"
npm run build
ok "Build succeeded"

step 5 "Initializing git repo"
[ -d .git ] || { git init >/dev/null; ok "git init done"; }
git add .
if [ -z "$(git status --porcelain)" ]; then
  echo "  !  Nothing to commit"
else
  git commit -m "$COMMIT_MSG" >/dev/null
  ok "Commit created"
fi
git branch -M main 2>/dev/null || true
ok "Branch is main"

step 6 "Pushing to GitHub"
if [ "$HAS_GH" -eq 1 ]; then
  gh repo create "$REPO_NAME" "--$VISIBILITY" --source=. --remote=origin --push
  ok "Repo created + pushed"
else
  cat <<EOF

  GitHub CLI not installed. Manual:
    1. https://github.com/new — name: $REPO_NAME — DO NOT init README
    2. git remote add origin https://github.com/<your-username>/$REPO_NAME.git
    3. git push -u origin main

EOF
  exit 0
fi

step 7 "Done — next: Netlify"
cat <<EOF

  Deploy on Netlify in 2 clicks:
    1. https://app.netlify.com/start
    2. Click "Import from GitHub" → pick "$REPO_NAME"
    3. Click Deploy (netlify.toml handles the rest)

  Env vars to add (see DEPLOY.md):
    - YOUTUBE_API_KEY
    - TIKTOK_WEBHOOK_SECRET, ADMIN_LIVE_SECRET
    - NEXT_PUBLIC_SITE_URL

EOF
