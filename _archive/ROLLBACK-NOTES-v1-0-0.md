# Rollback Notes — EMGamer731

How to safely revert the site if a deploy goes sideways.

## Fastest rollback (Netlify)

1. Netlify dashboard → **Deploys**.
2. Find the last green deploy.
3. Click → **Publish deploy**.

Production reverts in ~5 seconds. No git history needed.

## Git-level rollback

```bash
git log --oneline -10                # find the bad commit
git revert <commit-sha>              # safe — preserves history
git push origin main                 # Netlify auto-builds
```

If the bad commit is the latest and nothing else has been committed:

```bash
git reset --hard HEAD~1
git push --force-with-lease origin main
```

## Restore from a tag

We tag every deploy as `release-YYYYMMDD-HHMM`:

```bash
git checkout release-20260425-2200
git checkout -b hotfix/from-20260425
# fix and re-deploy
```

## Image / content rollback

Static images and JSON manifests live in the repo, so all rollbacks above also restore them. The image-pipeline output is regenerable — `node scripts/generate-image-manifest.mjs` re-creates the manifest deterministically.

## Live-status outage

If YouTube API quota is exhausted or returns errors:

- Set `MANUAL_LIVE_OVERRIDE=` (empty) in Netlify env vars.
- Trigger a redeploy.
- The adapter falls back to "offline — see schedule" gracefully.
- Polling resumes when the YouTube key is restored.

## Domain rollback

If DNS for `emgamer731.com` is misconfigured:

- The Netlify-assigned `*.netlify.app` URL stays live and is always accessible.
- Revert the DNS records at your registrar; propagation typically completes in 1–4 hours.

## Disaster recovery (full project loss)

Everything required to rebuild lives in this repo:

- `package.json` → installable
- `src/` → the app
- `public/` → static assets
- `content/` + `shop/` → catalogs, manifests
- `brand/` → brand system
- `docs/` → all operational docs

A clean clone + `npm install --legacy-peer-deps` + `npm run build` reproduces the site exactly.
