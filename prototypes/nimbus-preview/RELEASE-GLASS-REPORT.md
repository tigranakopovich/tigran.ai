# Glass release — preflight

2026-10-04. Owner authorized verification, commit, push and Vercel publication.

## Verified before commit

- Fresh build exit0; static runtime exported to site/ using scripts/export-site.cjs.
- Export12files /882705bytes; JS/CSS byte-identical to Vite dist. No source maps, original avatar, references, reports, environment files or geography source archives.
- npm audit:0known vulnerabilities. Credential-pattern scan29files:0hits (limited pattern scan, not proof against every possible secret).
- Found public SPEC.md and prototype source on old production (HTTP200); changed outputDirectory to site/, runtime-only allowlist. Local production server confirms sensitive workspace paths404.
- CSP/self-only scripts/connections, nosniff, Referrer-Policy, frame protection, restrictive Permissions-Policy configured. Local browser checks executed under these headers; no CSP errors.
- Responsive320/390/430/768/1024/1440: no horizontal overflow, menu/anchors/form/fixed header available. Interactive normal motion1440/390: Hero repeat,15s progress, replay/pause/resume, stable case toggle, keyboard, offscreen GPU stop passed.
- Safe form: empty template and Cyrillic+HTML-like input encoded literally in t.me URL; no injected DOM/external request or actual message send.
- Reduced initial: no Three/scene download on static passes; no-JS direct Telegram/content and WebGL-off fallback passed.
- Console/pageerror/failed requests:0; local browser network requests all same origin. DPR/count/cap/lazy/shared ticker preserved.

## Deployment packaging

Vercel configuration now publishes only site/ with no install/build step. Source changes must be built/exported and committed before push. README documents this workflow.
Old root artifacts are retained in Git as historical material; Vercel no longer serves the root workspace.
Commit selected approved implementation/supporting docs; unrelated local drafts/references/raw materials stay outside the release.

## Evidence

.preview-checks/glass-release/npm-audit.json, checks.json,1440.png,390.png.
Geographic visual review: GLASS-VISUAL-POLISH-REPORT.md and .preview-checks/glass-polish/.
Deployment/remote HTTP results are recorded separately after push; this file is preflight evidence, not a deployment success assertion.

## Limits / OPEN

No physical-device/Safari/FPS/composer verification; browser mobile is emulation. No real messages sent. Original HP photos/permissions still unavailable. Initial reduced checked; full dynamic/lifecycle matrix not claimed. Known package vulnerability audit is time-specific, not a security guarantee.
Old immutable Vercel deployments may retain the previously public workspace; this release restricts the current production output and does not delete historical deployments.
