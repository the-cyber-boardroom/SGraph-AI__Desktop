import '/sidebar/v0.1.0/sidebar.js'
import '/status-bar/v0.1.0/status-bar.js'
import { SiteManager } from '/lib/site-manager.js'
import { EventBus }    from '/lib/event-bus.js'

/** Site URL map */
const SITE_URLS = {
    send:      'https://send.sgraph.ai',
    vault:     'https://vault.sgraph.ai',
    workspace: 'https://workspace.sgraph.ai',
    tools:     'https://tools.sgraph.ai',
}

/**
 * Main app shell component.
 * Provides sidebar navigation + native webview content area.
 */
class SgAppShell extends HTMLElement {
    constructor() {
        super()
        this._siteManager = new SiteManager()
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="app-shell">
                <sg-sidebar></sg-sidebar>
                <main class="app-content" id="webview-container">
                    <div class="welcome-screen" id="welcome-screen">
                        <div class="welcome-content">
                            <div class="welcome-logo">
                                <span class="welcome-sg">SG</span><span class="welcome-slash">/</span><span class="welcome-product">Desktop</span>
                            </div>
                            <p class="welcome-text">Select a site from the sidebar to get started.</p>
                            <div class="welcome-sites">
                                <button class="welcome-site-btn" data-site="send">
                                    <span class="welcome-site-name">Send</span>
                                    <span class="welcome-site-desc">Encrypted file sharing</span>
                                </button>
                                <button class="welcome-site-btn" data-site="vault">
                                    <span class="welcome-site-name">Vault</span>
                                    <span class="welcome-site-desc">Personal vault</span>
                                </button>
                                <button class="welcome-site-btn" data-site="workspace">
                                    <span class="welcome-site-name">Workspace</span>
                                    <span class="welcome-site-desc">Document transformation</span>
                                </button>
                                <button class="welcome-site-btn" data-site="tools">
                                    <span class="welcome-site-name">Tools</span>
                                    <span class="welcome-site-desc">Browser utilities</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <sg-status-bar></sg-status-bar>
            </div>
        `

        const container = this.querySelector('#webview-container')
        this._siteManager.setContainer(container)

        EventBus.on('site-selected', (e) => this._onSiteSelected(e.detail))

        // Welcome screen site buttons
        this.querySelector('.welcome-sites')?.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-site]')
            if (btn) {
                EventBus.emit('select-site', { siteId: btn.dataset.site })
                this._onSiteSelected({ siteId: btn.dataset.site })
            }
        })

        // Settings button → toggle DevTools on active site webview
        EventBus.on('action', (e) => {
            if (e.detail.action === 'settings') {
                this._toggleDevTools()
            }
        })

        // Cmd+Option+I → toggle DevTools on active site webview
        document.addEventListener('keydown', (e) => {
            if (e.metaKey && e.altKey && e.key === 'i') {
                e.preventDefault()
                this._toggleDevTools()
            }
        })

        // Auto-load send.sgraph.ai on startup
        setTimeout(() => {
            EventBus.emit('select-site', { siteId: 'send' })
            this._onSiteSelected({ siteId: 'send' })
        }, 100)
    }

    async _onSiteSelected(detail) {
        const welcome = this.querySelector('#welcome-screen')
        if (welcome) welcome.style.display = 'none'

        const url = SITE_URLS[detail.siteId]
        if (url) {
            await this._siteManager.activate(detail.siteId, url)
        }
    }

    async _toggleDevTools() {
        const activeSite = this._siteManager.getActiveSite()
        if (activeSite) {
            await window.__TAURI__.core.invoke('toggle_devtools', { siteId: activeSite })
        }
    }
}

customElements.define('sg-app-shell', SgAppShell)
