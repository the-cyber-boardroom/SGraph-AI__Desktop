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
| macOS first | Human's immediate need is macOS; arm64 (Apple Silicon) | v0.12.2 web components brief (Part 4) | 2026-03-07 |
| Remote webviews | Web apps already exist and are actively developed | v0.12.2 web components brief (Part 4) | 2026-03-07 |
| macOS Keychain | More secure than localStorage, survives browser clears | v0.12.2 brief + chrome extension brief | 2026-03-07 |
| Single window, multiple webviews | Simpler UX, webviews preserved in background | Architecture decision | 2026-03-08 |
| Vanilla JS for local shell | Consistent with tools.sgraph.ai pattern | v0.12.2 web components brief (Part 1) | 2026-03-07 |
| Separate repo | Desktop app is a distinct deployment target | v0.12.2 web components brief (Part 4) | 2026-03-07 |
| GitHub Releases for distribution | Standard for open-source, Tauri updater supports it | Architecture decision | 2026-03-08 |
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
| Site manager | Built | `src/lib/site-manager.js` |
| Site registry (JSON) | Built | `src-tauri/sgraph-sites.json` |
| Sites command (Rust) | Built | `src-tauri/src/commands/sites.rs` |
| CSS theme (Aurora dark) | Built | `src/assets/styles/theme.css` |
| macOS menu bar | Built | `src-tauri/src/lib.rs` |

### PROPOSED — Does Not Exist Yet
- Multi-webview switching (Phase 2)
- macOS Keychain integration (Phase 2)
- Window state persistence (Phase 2)
- Settings panel (Phase 2)
- File type associations (Phase 3)
- Auto-update (Phase 4)
- Code signing / notarisation (Phase 4)
- CI/CD pipeline (Phase 4)

---

## 7. Current Briefs

| Brief | Location | Summary |
|-------|----------|---------|
| Web Components Architecture | SG/Send: `team/humans/dinis_cruz/briefs/03/07/v0.12.2__dev-brief__web-components-architecture.md` | Part 4 covers desktop app exploration — primary source brief |
| Desktop Dev Pack | SG/Send: `library/sgraph-send/dev_packs/v0.12.2__desktop-sgraph-ai/` | Full bootstrap pack for this project |

---

## 8. First Task (Next Session)

**Phase 2: Multi-site switching and keychain integration**

1. Implement multi-webview: create webviews for vault, workspace, tools
2. Switch between sites via sidebar (show/hide webviews)
3. Implement macOS keychain commands in Rust (`keychain_set`, `keychain_get`, `keychain_delete`)
4. Create JS keychain bridge (`src/lib/keychain-bridge.js`)
5. Add window state persistence (save/restore position, size, active site)

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

# Build release
cargo tauri build

# Build for Apple Silicon specifically
cargo tauri build --target aarch64-apple-darwin
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
