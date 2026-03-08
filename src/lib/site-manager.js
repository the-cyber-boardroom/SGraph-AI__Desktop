import { EventBus } from './event-bus.js'

/**
 * Manages site switching and webview iframe lifecycle.
 * Each site gets an iframe that loads the remote *.sgraph.ai URL.
 * Only the active site's iframe is visible.
 */
export class SiteManager {
    constructor() {
        /** @type {Map<string, HTMLIFrameElement>} */
        this._iframes = new Map()
        /** @type {string|null} */
        this._activeSite = null
        /** @type {HTMLElement|null} */
        this._container = null
    }

    /**
     * Set the container element where iframes are placed
     * @param {HTMLElement} container
     */
    setContainer(container) {
        this._container = container
    }

    /**
     * Activate a site — create iframe if needed, show it, hide others
     * @param {string} siteId - The site ID (e.g., 'send')
     * @param {string} url - The site URL
     */
    activate(siteId, url) {
        if (!this._container) return

        // Create iframe if it doesn't exist yet
        if (!this._iframes.has(siteId)) {
            const iframe = document.createElement('iframe')
            iframe.className = 'site-webview'
            iframe.setAttribute('data-site', siteId)
            iframe.src = url
            iframe.allow = 'clipboard-read; clipboard-write'
            iframe.style.display = 'none'
            this._container.appendChild(iframe)
            this._iframes.set(siteId, iframe)
        }

        // Hide all iframes, show active one
        for (const [id, frame] of this._iframes) {
            frame.style.display = id === siteId ? 'block' : 'none'
        }

        this._activeSite = siteId
        EventBus.emit('site-activated', { siteId, url })
    }

    /**
     * Get the currently active site ID
     * @returns {string|null}
     */
    getActiveSite() {
        return this._activeSite
    }
}
