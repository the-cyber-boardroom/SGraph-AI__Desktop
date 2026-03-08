import { EventBus } from './event-bus.js'

/**
 * Manages site switching via native Tauri webviews.
 * Each site gets a dedicated native webview (not an iframe),
 * which avoids X-Frame-Options restrictions.
 */
export class SiteManager {
    constructor() {
        /** @type {string|null} */
        this._activeSite = null
        /** @type {HTMLElement|null} */
        this._container = null
    }

    /**
     * Set the container element (used for welcome screen management)
     * @param {HTMLElement} container
     */
    setContainer(container) {
        this._container = container
    }

    /**
     * Activate a site — creates native webview if needed, shows it, hides others
     * @param {string} siteId - The site ID (e.g., 'send')
     * @param {string} url - The site URL
     */
    async activate(siteId, url) {
        if (!this._container) return

        await window.__TAURI__.core.invoke('activate_site', { siteId, url })

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
