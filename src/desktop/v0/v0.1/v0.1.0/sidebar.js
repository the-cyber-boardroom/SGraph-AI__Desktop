import { EventBus } from '/core/lib/event-bus.js'

const SITE_ICONS = {
    send: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/>
    </svg>`,
    vault: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <circle cx="12" cy="16" r="1"/>
    </svg>`,
    workspace: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>`,
    tools: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>`,
}

const SETTINGS_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
</svg>`

/**
 * Sidebar component for site navigation.
 * Displays site icons vertically with active state highlighting.
 */
class SgSidebar extends HTMLElement {
    constructor() {
        super()
        this._activeSite = null
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="sidebar">
                <div class="sidebar-sites">
                    ${this._renderSites()}
                </div>
                <div class="sidebar-bottom">
                    <button class="sidebar-btn" data-action="settings" title="Settings">
                        ${SETTINGS_ICON}
                    </button>
                </div>
            </nav>
        `

        this.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-site]')
            if (btn) {
                this._selectSite(btn.dataset.site)
                return
            }
            const action = e.target.closest('[data-action]')
            if (action) {
                EventBus.emit('action', { action: action.dataset.action })
            }
        })

        // Listen for external site selection
        EventBus.on('select-site', (e) => {
            this._selectSite(e.detail.siteId)
        })
    }

    _renderSites() {
        return Object.entries(SITE_ICONS).map(([id, icon]) => `
            <button class="sidebar-btn" data-site="${id}" title="${id.charAt(0).toUpperCase() + id.slice(1)}">
                ${icon}
            </button>
        `).join('')
    }

    _selectSite(siteId) {
        this._activeSite = siteId
        this.querySelectorAll('[data-site]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.site === siteId)
        })
        EventBus.emit('site-selected', { siteId })
    }
}

customElements.define('sg-sidebar', SgSidebar)
