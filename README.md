# Tigran AI

Source: `prototypes/nimbus-preview/`. Published runtime: `site/`.
Vercel deploys only `site/`, following `vercel.json`; project source, SPEC, references and reports are excluded from HTTP publication.

## Release

After source edits, prepare the export before committing:

```powershell
npm run build --prefix prototypes/nimbus-preview
node scripts/export-site.cjs
```

Commit the source changes, `site/` and relevant release configuration, then push `main`.
The existing GitHub → Vercel integration publishes the committed static export automatically.
Vercel installation/build commands are deliberately empty; no dependency installation is required there.

Local source preview: `npm run preview --prefix prototypes/nimbus-preview` (port4176, no watch).
Security headers are configured in `vercel.json` and must be tested against the production export when changed.
Do not put secrets, original case materials or workspace documents in `site/`.
