import '/android/v0/v0.1/v0.1.0/bottom-nav.js'
import { EventBus } from '/core/lib/event-bus.js'

/** Site URL map */
const SITE_URLS = {
    send:      'https://send.sgraph.ai',
    vault:     'https://vault.sgraph.ai',
    workspace: 'https://workspace.sgraph.ai',
    tools:     'https://dev.tools.sgraph.ai',
}

/**
 * Android app shell component.
 * Full-width content area with Material-style bottom navigation.
 * On mobile, sites load in iframes (no native multi-webview support).
 */
class SgAppShellAndroid extends HTMLElement {
    constructor() {
        super()
        /** @type {Map<string, HTMLIFrameElement>} */
        this._iframes = new Map()
        this._activeSite = null
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="app-shell-android">
                <main class="app-content-android" id="webview-container">
                    <div class="welcome-screen-android" id="welcome-screen">
                        <div class="welcome-content">
                            <div class="welcome-logo">
                                <span class="welcome-sg">SG</span><span class="welcome-slash">/</span><span class="welcome-product">Mobile</span>
                            </div>
                            <p class="welcome-text">Select a site to get started.</p>
                        </div>
                    </div>
                </main>
                <sg-bottom-nav></sg-bottom-nav>
            </div>
        `

        EventBus.on('site-selected', (e) => this._onSiteSelected(e.detail))

        // Auto-load send.sgraph.ai on startup
        setTimeout(() => {
            EventBus.emit('select-site', { siteId: 'send' })
            this._onSiteSelected({ siteId: 'send' })
        }, 100)
    }

    /**
     * Load a site by creating or showing its iframe.
     * @param {{ siteId: string }} detail
     */
    _onSiteSelected(detail) {
        const welcome = this.querySelector('#welcome-screen')
        if (welcome) welcome.style.display = 'none'

        const url = SITE_URLS[detail.siteId]
        if (!url) return

        // Hide current iframe
        if (this._activeSite && this._iframes.has(this._activeSite)) {
            this._iframes.get(this._activeSite).style.display = 'none'
        }

        // Create or show target iframe
        if (!this._iframes.has(detail.siteId)) {
            const iframe = document.createElement('iframe')
            iframe.className = 'site-frame'
            iframe.src = url
            iframe.setAttribute('allow', 'clipboard-read; clipboard-write')
            this.querySelector('#webview-container').appendChild(iframe)
            this._iframes.set(detail.siteId, iframe)
        } else {
            this._iframes.get(detail.siteId).style.display = 'block'
        }

        this._activeSite = detail.siteId
        EventBus.emit('site-activated', { siteId: detail.siteId, url })
    }
}

customElements.define('sg-app-shell-android', SgAppShellAndroid)
