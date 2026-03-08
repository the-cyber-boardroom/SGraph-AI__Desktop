import '/ios/v0/v0.1/v0.1.0/tab-bar.js'
import { SiteManager } from '/core/lib/site-manager.js'
import { EventBus }    from '/core/lib/event-bus.js'

/** Site URL map */
const SITE_URLS = {
    send:      'https://send.sgraph.ai',
    vault:     'https://vault.sgraph.ai',
    workspace: 'https://workspace.sgraph.ai',
    tools:     'https://dev.tools.sgraph.ai',
}

/**
 * iOS app shell component.
 * Full-width content area with bottom tab bar navigation.
 */
class SgAppShellIos extends HTMLElement {
    constructor() {
        super()
        this._siteManager = new SiteManager()
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="app-shell-ios">
                <main class="app-content-ios" id="webview-container">
                    <div class="welcome-screen-ios" id="welcome-screen">
                        <div class="welcome-content">
                            <div class="welcome-logo">
                                <span class="welcome-sg">SG</span><span class="welcome-slash">/</span><span class="welcome-product">Mobile</span>
                            </div>
                            <p class="welcome-text">Select a site to get started.</p>
                        </div>
                    </div>
                </main>
                <sg-tab-bar></sg-tab-bar>
            </div>
        `

        const container = this.querySelector('#webview-container')
        this._siteManager.setContainer(container)

        EventBus.on('site-selected', (e) => this._onSiteSelected(e.detail))

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
}

customElements.define('sg-app-shell-ios', SgAppShellIos)
