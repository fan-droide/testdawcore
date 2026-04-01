# testdawcore

A sandbox and onboarding guide for [`@dawcore/components`](https://github.com/naomiaro/waveform-playlist/tree/main/packages/dawcore) — a framework-agnostic Web Components library for building Digital Audio Workstation (DAW) interfaces in the browser.

This repository is designed to give new developers a complete, working picture of the library's possibilities and a clean starting point for their own projects.

> **Live demo:** [https://fan-droide.github.io/testdawcore](https://fan-droide.github.io/testdawcore) *(GitHub Pages — see [Deploy](#deploy-to-github-pages))*

---

## Table of Contents

- [What Is `@dawcore/components`?](#what-is-dawcorecomponents)
- [What's in This Repo](#whats-in-this-repo)
- [Getting Started](#getting-started)
- [The Demo](#the-demo-indexhtml)
- [Component Reference](#component-reference)
- [JavaScript API](#javascript-api)
- [Events](#events)
- [Theming](#theming)
- [Framework Integration](#framework-integration)
- [Known Issues](#known-issues)
- [Deploy to GitHub Pages](#deploy-to-github-pages)
- [Collaborating with Claude Code](#collaborating-with-claude-code)
- [Resources](#resources)

---

## What Is `@dawcore/components`?

`@dawcore/components` is the Web Components migration of [waveform-playlist](https://github.com/naomiaro/waveform-playlist). It replaces the previous React + styled-components architecture with native browser [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry), built on [Lit](https://lit.dev/) (~6 KB).

**Key properties:**
- No framework required — works with vanilla JS, React 19+, Vue 3, Svelte, Angular, or any environment that supports Custom Elements
- Declarative HTML-first API: define your DAW layout in markup, control it with JavaScript
- Built on the Web Audio API via `@waveform-playlist/engine`
- Canvas-based waveform rendering with virtual scrolling
- CSS custom properties for full theming without Shadow DOM hacks

---

## What's in This Repo

```
testdawcore/
├── index.html                          # Main demo — a working DAW in ~20 lines of HTML
├── public/
│   └── audio/
│       └── RATP.mp3                    # Sample audio file pre-loaded into the demo track
├── vite.config.js                      # Sets base path for GitHub Pages
├── CLAUDE.md                           # AI collaboration conventions (read by Claude Code)
├── .github/workflows/deploy.yml        # Automated GitHub Pages deployment
└── package.json
```

The entire demo lives in `index.html`. No framework, no build config, no boilerplate.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build     # Production build → dist/
npm run preview   # Preview the production build locally
```

---

## The Demo (`index.html`)

```html
<script type="module">
  import '@dawcore/components';
</script>

<daw-editor id="editor" clip-headers interactive-clips timescale file-drop>
  <daw-track name="Vocals">
    <daw-clip src="/audio/RATP.mp3"></daw-clip>
  </daw-track>
  <daw-keyboard-shortcuts playback splitting undo></daw-keyboard-shortcuts>
</daw-editor>

<daw-transport for="editor">
  <daw-play-button></daw-play-button>
  <daw-pause-button></daw-pause-button>
  <daw-stop-button></daw-stop-button>
</daw-transport>
```

That's it. A fully functional DAW editor with playback, undo/redo, clip interactions, file drag-and-drop, and keyboard shortcuts — all in ~20 lines of HTML.

---

## Component Reference

### `<daw-editor>` — Root Element

Manages AudioContext, tracks, clips, undo/redo, and playback state.

| Attribute | Effect |
|-----------|--------|
| `timescale` | Renders a time ruler |
| `clip-headers` | Shows clip name labels inside waveform regions |
| `interactive-clips` | Enables drag, trim, and split interactions |
| `file-drop` | Drop audio/MIDI files onto the editor to create tracks |
| `samples-per-pixel` | Zoom level (default: 1024) |
| `wave-height` | Track height in pixels |
| `mono` | Render waveforms in mono |
| `automatic-scroll` | Auto-scroll the timeline during playback |

### `<daw-track>` — Individual Track

```html
<daw-track name="Guitar" volume="0.8" pan="0.2" muted record-armed input-device="abc123">
  <daw-clip src="/audio/guitar.mp3"></daw-clip>
</daw-track>
```

Shorthand: set `src` directly on `<daw-track>` to create an implicit clip:
```html
<daw-track name="Guitar" src="/audio/guitar.mp3"></daw-track>
```

Render modes: `render-mode="waveform"` (default), `render-mode="spectrogram"`, `render-mode="piano-roll"`, `render-mode="split"`

### `<daw-clip>` — Audio Segment

```html
<daw-clip
  src="/audio/vocals.mp3"
  start="4.0"
  duration="8.0"
  offset="1.0"
  gain="0.9"
  name="Verse 1"
  fade-in="0.5"
  fade-out="0.3"
></daw-clip>
```

### `<daw-transport>` — Playback Controls

Linked to an editor or player via the `for` attribute (matches editor `id`):

```html
<daw-transport for="editor">
  <daw-play-button></daw-play-button>
  <daw-pause-button></daw-pause-button>
  <daw-stop-button></daw-stop-button>
  <daw-record-button></daw-record-button>
  <daw-rewind-button></daw-rewind-button>
  <daw-loop-button></daw-loop-button>
  <daw-volume-slider></daw-volume-slider>
  <daw-time-display></daw-time-display>
  <daw-zoom-in></daw-zoom-in>
  <daw-zoom-out></daw-zoom-out>
</daw-transport>
```

### `<daw-keyboard-shortcuts>` — Keyboard Presets

Place inside `<daw-editor>`. Enable presets with attributes:

| Attribute | Shortcuts enabled |
|-----------|-------------------|
| `playback` | `Space` play/pause, `Escape` stop, `0` rewind |
| `splitting` | `S` split clip at playhead |
| `undo` | `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z` redo |

Custom remapping:
```javascript
const shortcuts = document.querySelector('daw-keyboard-shortcuts');
shortcuts.playbackShortcuts = { playPause: {key: 'p'}, stop: {key: 'q'} };
shortcuts.customShortcuts = [
  {key: 'e', action: () => editor.exportAudio(), description: 'Export'},
];
```

---

## JavaScript API

```javascript
const editor = document.querySelector('daw-editor');

// Playback
editor.play();
editor.pause();
editor.stop();
editor.seekTo(10);              // seconds
editor.setSelection(2, 8);

// Tracks
const track = editor.addTrack({ name: 'Bass' });
editor.removeTrack(track.id);

// Zoom
editor.zoomIn();
editor.zoomOut();

// Tempo
editor.setBpm(120);
editor.setTimeSignature(4, 4);

// Undo / Redo
editor.undo();
editor.redo();
console.log(editor.canUndo, editor.canRedo);

// Export
const buffer = await editor.exportAudio({ sampleRate: 44100 });

// Load files programmatically
const { trackIds } = await editor.loadFiles(fileList);

// Load MIDI
const { trackIds, bpm } = await editor.loadMidi('/song.mid');
```

---

## Events

```javascript
const editor = document.querySelector('daw-editor');

editor.addEventListener('daw-play', () => console.log('playing'));
editor.addEventListener('daw-pause', () => console.log('paused'));
editor.addEventListener('daw-stop', () => console.log('stopped'));
editor.addEventListener('daw-timeupdate', (e) => console.log(e.detail));
editor.addEventListener('daw-tracks-change', (e) => console.log(e.detail.tracks));
editor.addEventListener('daw-record', (e) => console.log('recording', e.detail.trackIds));
editor.addEventListener('daw-undo-state', (e) => console.log(e.detail));
```

---

## Theming

All visual aspects are controlled via CSS custom properties on `<daw-editor>`:

```css
daw-editor {
  --daw-wave-color: #c49a6c;
  --daw-progress-color: #63C75F;
  --daw-background: #1a1a2e;
  --daw-track-background: #16213e;
  --daw-playhead-color: #d08070;
  --daw-ruler-color: #c49a6c;
  --daw-ruler-background: #0f0f1a;
  --daw-controls-background: #1a1a2e;
  --daw-controls-text: #e0d4c8;
  --daw-selection-color: rgba(99, 199, 95, 0.3);
  /* Grid */
  --daw-grid-odd: rgba(255, 255, 255, 0.03);
  --daw-grid-even: rgba(255, 255, 255, 0.06);
  --daw-grid-line-color: rgba(255, 255, 255, 0.1);
}
```

Access internals with `::part()`:
```css
daw-editor::part(timescale) { font-family: 'Courier New'; }
daw-track::part(controls) { width: 200px; }
```

---

## Framework Integration

### Vue 3

Configure Vite to recognize `daw-*` tags:

```typescript
// vite.config.ts
import vue from '@vitejs/plugin-vue';
export default {
  plugins: [vue({
    template: {
      compilerOptions: { isCustomElement: (tag) => tag.startsWith('daw-') }
    }
  })]
};
```

```vue
<daw-editor timescale @daw-ready="onReady">
  <daw-track src="/audio/vocals.mp3" name="Vocals" />
</daw-editor>
```

### React 19+

> React 19+ has native Custom Elements support. React 18 is not supported for direct use.

```tsx
import '@dawcore/components';

<daw-editor ref={editorRef} timescale onDawReady={() => console.log('ready')}>
  <daw-track src="/audio/vocals.mp3" name="Vocals" />
</daw-editor>
```

### Svelte / Angular

See the [full spec](https://github.com/naomiaro/waveform-playlist/blob/main/docs/specs/web-components-migration.md#framework-integration) for framework-specific setup.

---

## Known Issues

### React dependency (upstream)

`react` and `react-dom` appear as dependencies in this project's `package.json`. They are **not required** by `@dawcore/components` (which only depends on `lit` ~6 KB). This is a configuration issue in the `@dawcore` package that causes npm to resolve React transitively.

**Status:** Reported upstream — see [naomiaro/waveform-playlist/issues/373](https://github.com/naomiaro/waveform-playlist/issues/373)

Until fixed, React can safely be removed from `package.json` if you are not using it in your own code:
```bash
npm uninstall react react-dom
```

---

## Deploy to GitHub Pages

Deployment is automated via GitHub Actions. Every push to `main` triggers a build and deploys the result to GitHub Pages.

### How it works

- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs `npm ci && npm run build` on every push to `main`
- The `dist/` output is published using the official `actions/deploy-pages` action
- [`vite.config.js`](vite.config.js) sets `base: '/testdawcore/'` so all asset paths resolve correctly on Pages

### One-time setup (already done for this repo)

If you fork this repo and want to deploy your own version:

1. Go to **Settings → Pages → Source** and select **GitHub Actions**
2. Push to `main` — the workflow handles everything else

The live demo deploys to: `https://<your-username>.github.io/testdawcore/`

---

## Collaborating with Claude Code

This repository uses [Claude Code](https://claude.ai/code) as an AI pair programmer. Claude Code is Anthropic's CLI that integrates directly into your editor and terminal.

### Tips for effective collaboration

**Give Claude project context up front.** The more Claude knows about what you're building and why, the better its suggestions. Start a session by describing your goal, not just the task.

**Use `CLAUDE.md` for persistent instructions.** Create a `CLAUDE.md` file at the root of your repo with project conventions, architecture notes, and things Claude should always keep in mind. Claude reads it automatically at the start of every session.

```markdown
# CLAUDE.md
This project demos @dawcore/components. No React. Vanilla JS only.
Always check the spec: https://github.com/naomiaro/waveform-playlist/blob/main/docs/specs/web-components-migration.md
```

**Use slash commands.** Claude Code has built-in commands:
- `/commit` — generate a commit message and commit
- `/review-pr` — review a pull request
- `/help` — list all commands

**Parallel tool use.** Claude can read multiple files, fetch docs, and run searches simultaneously — ask it to investigate before making changes and it will gather context efficiently.

**Memory persists.** Claude remembers project context, your preferences, and past decisions across sessions — no need to re-explain the same background each time.

---

## Resources

- [`@dawcore/components` source](https://github.com/naomiaro/waveform-playlist/tree/main/packages/dawcore)
- [Web Components migration spec](https://github.com/naomiaro/waveform-playlist/blob/main/docs/specs/web-components-migration.md)
- [waveform-playlist repository](https://github.com/naomiaro/waveform-playlist)
- [Lit documentation](https://lit.dev/)
- [Claude Code](https://claude.ai/code)
