# CLAUDE.md — testdawcore

## Project purpose
Sandbox and onboarding demo for `@dawcore/components`, a framework-agnostic Web Components DAW library.
The goal is to help new developers quickly understand what the library can do and how to use it.

## Stack
- `@dawcore/components` (Web Components via Lit — no React)
- `@waveform-playlist/recording` and `@waveform-playlist/worklets` (audio processing)
- Vite for dev/build

## Conventions
- **No React** in this project. `react` and `react-dom` are in `package.json` due to an upstream config issue — treat them as unwanted and do not add any React code.
- Prefer the declarative HTML approach (custom elements in markup) over imperative JS where possible.
- `<daw-keyboard-shortcuts>` belongs inside `<daw-editor>`, not outside it.
- Keep demos simple and self-contained in `index.html` (or small standalone HTML files for each feature showcase).

## Key reference
Full component spec and API:
https://github.com/naomiaro/waveform-playlist/blob/main/docs/specs/web-components-migration.md

Dawcore source (also has its own CLAUDE.md):
https://github.com/naomiaro/waveform-playlist/tree/main/packages/dawcore

## Known issues
- `react`/`react-dom` appear as transitive deps — upstream issue being reported to naomiaro.
- Peer deps `@waveform-playlist/engine`, `@waveform-playlist/core`, `@dawcore/transport` are not yet explicitly installed.

## GitHub Pages
Live demo is deployed via GitHub Actions to `gh-pages` branch.
Base path in `vite.config.js` is set to `/testdawcore/`.
