# SGraph-AI__Desktop — BRIEF_PACK

**Version:** v0.1.0
**Last updated:** 2026-03-08
**Maintained by:** Librarian (Explorer team)

---

## 1. Project Overview

SGraph-AI__Desktop is a lightweight Tauri-based macOS desktop application providing native access to the SGraph ecosystem websites (`*.sgraph.ai`). It wraps send.sgraph.ai, vault.sgraph.ai, workspace.sgraph.ai, and tools.sgraph.ai in native webviews with macOS integration (Keychain, Dock, menu bar, file associations).

**Architecture:** Tauri v2 — Rust backend for native OS operations + vanilla JS frontend for the app shell + WebKit webviews loading remote `*.sgraph.ai` URLs.

**Key principle:** The desktop app does NOT bundle the web apps. It loads them in native webviews.

---

## 2. Architecture Decisions

| Decision | Rationale | Source | Date |
|----------|-----------|--------|------|
| Tauri v2 | ~10MB binary, native WebKit, Rust backend, scoped API access | v0.12.2 web components brief (Part 4) | 2026-03-07 |
| macOS first | Human's immediate need is macOS; arm64 (Apple Silicon) + x86_64 (Intel) | v0.12.2 web components brief (Part 4) | 2026-03-07 |
| Remote webviews | Web apps already exist and are actively developed | v0.12.2 web components brief (Part 4) | 2026-03-07 |
| macOS Keychain | More secure than localStorage, survives browser clears | v0.12.2 brief + chrome extension brief | 2026-03-07 |
| Single window, multiple webviews | Simpler UX, webviews preserved in background | Architecture decision | 2026-03-08 |
| Vanilla JS for local shell | Consistent with tools.sgraph.ai pattern | v0.12.2 web components brief (Part 1) | 2026-03-07 |
| Separate repo | Desktop app is a distinct deployment target | v0.12.2 web components brief (Part 4) | 2026-03-07 |
| GitHub Releases for distribution | Standard for open-source, Tauri updater supports it | Architecture decision | 2026-03-08 |
| Dual-architecture builds | Both Apple Silicon (aarch64) and Intel (x86_64) supported via CI matrix | DevOps decision | 2026-03-08 |
| No telemetry | Privacy-first, consistent with SG/Send zero-tracking | Project principle | 2026-03-08 |

---

## 3. Team Roles

| Role | Responsibility | Location |
|------|---------------|----------|
| **Architect** | Tauri architecture, IPC design, webview management | `team/explorer/architect/` |
| **Dev** | Rust commands, JS components, Tauri integration | `team/explorer/dev/` |
| **Designer** | App shell UX, sidebar design, macOS aesthetics | `team/explorer/designer/` |
| **DevOps** | macOS builds, code signing, CI/CD, distribution | `team/explorer/devops/` |
| **Librarian** | BRIEF_PACK.md, reality document, feature registry | `team/explorer/librarian/` |
| **Historian** | Decision log, session history, cross-references | `team/explorer/historian/` |

---

## 4. Coding Conventions

### Rust Backend (src-tauri/)
- Tauri v2 command API: `#[tauri::command]` macro, async commands
- Error handling: return `Result<T, String>` from commands
- File naming: snake_case (`keychain.rs`, `app_state.rs`)
- Security: never expose filesystem root, scope file access, validate paths

### JS Frontend (src/)
- Vanilla JavaScript — no frameworks, no build step
- Web Components: all UI elements are `HTMLElement` subclasses
- ES modules: `import`/`export` everywhere
- Named exports only — no default exports
- JSDoc on every exported function
- File naming: kebab-case (`app-shell.js`, `keychain-bridge.js`)
- Components: versioned folders (`app-shell/v0.1.0/app-shell.js`)

### IPC Pattern
```javascript
// CORRECT
const result = await window.__TAURI__.core.invoke('command_name', { param1, param2 })
// WRONG — never use fetch() or postMessage() for IPC
```

---

## 5. Repo Structure

```
SGraph-AI__Desktop/
  .claude/
    CLAUDE.md                    Main agent guidance
    explorer/CLAUDE.md           Explorer team instructions
  src-tauri/                     RUST BACKEND (Tauri core)
    src/
      main.rs                    Entry point
      lib.rs                     Library root, command registration
      commands/
        mod.rs                   Module declarations
        sites.rs                 Site registry management
        webviews.rs              Webview activation, devtools
    sgraph-sites.json            Site registry (URL, icon, label)
    tauri.conf.json              Tauri configuration
    Cargo.toml                   Rust dependencies
    icons/                       macOS app icon
    capabilities/
      default.json               Tauri v2 capability permissions
  src/                           FRONTEND (vanilla JS)
    index.html                   Main window HTML
    app-shell/v0.1.0/            Shell component
    sidebar/v0.1.0/              Sidebar component
    status-bar/v0.1.0/           Status bar component
    lib/                         JS bridge modules
    assets/styles/               CSS theme
    website/                     desktop.sgraph.ai website
  .github/workflows/             CI/CD PIPELINES
    ci-pipeline.yml              Base pipeline (matrix: aarch64 + x86_64)
    ci-pipeline__dev.yml         Dev branch pipeline (7-day retention)
    ci-pipeline__main.yml        Main branch pipeline (90-day retention)
    release.yml                  Release workflow (GitHub Release + DMGs)
  briefs/
    BRIEF_PACK.md                This file
  team/
    explorer/                    6 role directories
    humans/dinis_cruz/           Human stakeholder (read-only)
  version                        Contains: v0.1.0
```

---

## 6. Existing Features

| Feature | Status | Location |
|---------|--------|----------|
| Tauri v2 project structure | Built | `src-tauri/` |
| App shell (sidebar + webview) | Built | `src/app-shell/v0.1.0/` |
| Sidebar with site icons | Built | `src/sidebar/v0.1.0/` |
| Status bar | Built | `src/status-bar/v0.1.0/` |
| EventBus | Built | `src/lib/event-bus.js` |
| SiteManager | Built | `src/lib/site-manager.js` |
| Site registry (JSON) | Built | `src-tauri/sgraph-sites.json` |
| Sites command (Rust) | Built | `src-tauri/src/commands/sites.rs` |
| Webview commands (Rust) | Built | `src-tauri/src/commands/webviews.rs` |
| CSS theme (Aurora dark) | Built | `src/assets/styles/theme.css` |
| macOS menu bar | Built | `src-tauri/src/lib.rs` |
| Multi-site webview switching | Built | All 4 sites load and switch via sidebar |
| Drag-and-drop in webviews | Built | `.disable_drag_drop_handler()` on WebviewBuilder |
| Code signing (CI) | Built | Apple Developer ID in GitHub Actions |
| Notarisation (CI) | Built | `xcrun notarytool` + `xcrun stapler` |
| CI/CD: dual-arch builds | Built | Matrix strategy: aarch64 (macos-14) + x86_64 (macos-13) |
| Release workflow | Built | GitHub Release with both architecture DMGs |
| DMG distribution | Built | Signed DMGs attached to GitHub Releases |
| desktop.sgraph.ai website | Built | `src/website/desktop-sgraph-ai/index.html` |

### PROPOSED — Does Not Exist Yet
- macOS Keychain integration (planned Phase 2)
- Window state persistence (planned Phase 2)
- Settings panel (planned Phase 2)
- File type associations (planned Phase 3)
- Auto-update (planned Phase 4)
- Mobile app (iOS/Android via Tauri 2.0 — explored in v0.13.1 brief)

---

## 7. Current Briefs

| Brief | Location | Summary |
|-------|----------|---------|
| Web Components Architecture | SG/Send: `team/humans/dinis_cruz/briefs/03/07/v0.12.2__dev-brief__web-components-architecture.md` | Part 4 covers desktop app exploration — primary source brief |
| Desktop Dev Pack | SG/Send: `library/sgraph-send/dev_packs/v0.12.2__desktop-sgraph-ai/` | Full bootstrap pack for this project |
| Repo Setup BRIEF_PACK | `team/humans/dinis_cruz/briefs/03/07/v0.1.0__repo-setup__BRIEF_PACK.md` | Original BRIEF_PACK (relocated from briefs/) |
| Desktop Milestone + Mobile Path | `team/humans/dinis_cruz/briefs/03/08/v0.13.1__brief__desktop-milestone-mobile-path.md` | Desktop shipped milestone, mobile app exploration via Tauri 2.0 |

---

## 8. Next Steps

**Phase 2: Multi-site switching refinements and keychain integration**

1. Implement macOS keychain commands in Rust (`keychain_set`, `keychain_get`, `keychain_delete`)
2. Create JS keychain bridge (`src/lib/keychain-bridge.js`)
3. Add window state persistence (save/restore position, size, active site)
4. Settings panel

**Mobile exploration (from v0.13.1 brief):**

1. `tauri ios init` / `tauri android init` — scaffold mobile targets
2. Test in iOS simulator and Android emulator
3. Responsive UI adaptations for mobile form factor

---

## 9. Build Instructions

```bash
# Prerequisites
# - Rust toolchain (rustup)
# - Xcode Command Line Tools (macOS)
# - Node.js (optional, for Tauri CLI)

# Install Tauri CLI
cargo install tauri-cli

# Dev mode (opens app with hot-reload)
cargo tauri dev

# Build release (Apple Silicon)
cargo tauri build --target aarch64-apple-darwin

# Build release (Intel)
cargo tauri build --target x86_64-apple-darwin
```

---

## 10. Bootstrap Script

```bash
# Clone the repo
git clone https://github.com/the-cyber-boardroom/SGraph-AI__Desktop.git
cd SGraph-AI__Desktop

# Install Rust if needed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Tauri CLI
cargo install tauri-cli

# Run in dev mode
cargo tauri dev
```
