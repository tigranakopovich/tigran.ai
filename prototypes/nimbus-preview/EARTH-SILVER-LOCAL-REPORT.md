# Silver point Earth — local correction

2026-10-04. Current assignment: references/HERO-EARTH-STYLE-HANDOFF.md and earth-silver-pointcloud-reference-v1.png. Supersedes the previous local color-surface experiment.

## Changes

- Replaced continuous NASA-colored surface with one silver THREE.Points object. No satellite diffuse texture is referenced or requested by the current runtime.
- Natural Earth mask is lazy-imported with the scene and used only to allocate geographic points. Budget restored to approved19000desktop/7000mobile;30% coast,65% land,5% very dim ocean. Seeded arrays created once; no per-frame geographic lookup or reallocations.
- Fine silver land points, brighter coastal points, dark oceans and strongly attenuated rear hemisphere. Directional light keeps upper area lighter than lower/opposite side. Points behind both glass cards are attenuated; data readability preserved.
- Thin cold edge and weak separate static halo. No bloom, postprocessing, cloud layers or extra animation loop.
- Existing bounded diameter/position, orthographic projection,18E/12S starting view and slow .018rad/s rotation retained from the immediately preceding local version. Lazy load, shared ticker, DPR caps, mobile scheduling, offscreen stop and cleanup retained.
- Fallback generated from the same mask/allocation/seed, with silver points rather than colored surface. Original source maps and the unused color experiment assets are preserved locally; those assets are not loaded.
- Demonstrations, previous local arrow animation, copy, form, fixed header, other sections and controllers were not changed in this pass. SPEC/site/production unchanged; no commit/push or installation.

## Changed files in this pass

- src/webgl/scene.js
- src/webgl/shaders.js
- src/styles/sections.css (Earth material/glow only; size/position values retained)
- public/earth/earth-fallback.webp
- scripts/geography/prepare-silver-fallback.py
- EARTH-SILVER-LOCAL-REPORT.md

## Verification

- Fresh Vite build exit0; diff whitespace check passed.
- Target1440×900: live Earth without UI and full Hero with completed first example. Diagnostic centers Earth only in the screenshot and disables card attenuation only in the test browser. Actual Hero has unchanged placement.
- Short390×844 pass:7000points, no overflow or console/page errors. Live Earth offscreen frame count stops.
- WebGL-off fallback and initial reduced motion checked. No NASA/earth-surface requests in any pass. DPR1 in emulation; configured caps unchanged.
- Evidence: .preview-checks/earth-silver/checks.json; earth-alone.png; hero.png; mobile.png; fallback.png; reduced.png.

## Remaining differences / OPEN

- Real Natural Earth geography and the retained18E/12S view differ from the generated reference's reconstructed Atlantic-facing geography. No invented countries/shorelines copied from that image.
- Particle density remains limited by the approved budget; the rendered surface is less dense than parts of the generated reference. No count increase to chase its detail.
- Physical-device/Safari performance and visual owner approval remain OPEN. This was the limited assigned check, not a repeated site audit.

Local preview: http://127.0.0.1:4176/?v=earth-silver
