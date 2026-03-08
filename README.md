# SGraph-AI__Desktop

A lightweight Tauri-based macOS desktop application providing native access to the SGraph ecosystem websites.

## What It Does

SGraph Desktop wraps `*.sgraph.ai` websites in native macOS webviews, providing:

- **App shell** — sidebar + webview container wrapping SGraph sites
- **Multi-site launcher** — switch between Send, Vault, Workspace, Tools in a single native app
- **Native macOS integration** — Dock icon, menu bar, keyboard shortcuts

## Sites

| Site | URL | Description |
|------|-----|-------------|
| Send | send.sgraph.ai | Zero-knowledge file sharing |
| Vault | vault.sgraph.ai | Encrypted personal vault |
| Workspace | workspace.sgraph.ai | Document transformation studio |
| Tools | tools.sgraph.ai | Browser-based utilities |

## Development

```bash
# Prerequisites: Rust toolchain, Xcode Command Line Tools

# Install Tauri CLI
cargo install tauri-cli

# Run in dev mode
cargo tauri dev

# Build release
cargo tauri build
```

## Architecture

```
SGraph Desktop.app (Tauri v2)
  src-tauri/     <- Rust backend (native OS operations)
  src/           <- Vanilla JS frontend (app shell, sidebar)

  Webviews load remote *.sgraph.ai URLs (not bundled).
```

## Stack

- **Tauri v2** — ~10MB binary, native WebKit webview
- **Rust** — backend for macOS integration
- **Vanilla JS** — frontend app shell (no frameworks)
- **macOS first** — Apple Silicon (arm64)

## License

See [LICENSE](LICENSE) for details.
