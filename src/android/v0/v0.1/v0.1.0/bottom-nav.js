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

/**
 * Android-style bottom navigation for site switching.
 * Material 3 inspired: icon + label, active indicator pill.
 */
class SgBottomNav extends HTMLElement {
    constructor() {
        super()
        this._activeSite = null
    }

    connectedCallback() {
        this.innerHTML = `
            <nav class="bottom-nav">
                ${this._renderItems()}
            </nav>
        `

        this.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-site]')
            if (btn) this._selectSite(btn.dataset.site)
        })

        EventBus.on('select-site', (e) => {
            this._selectSite(e.detail.siteId)
        })
    }

    _renderItems() {
        return Object.entries(SITE_ICONS).map(([id, icon]) => `
            <button class="nav-item" data-site="${id}">
                <span class="nav-icon">${icon}</span>
                <span class="nav-label">${id.charAt(0).toUpperCase() + id.slice(1)}</span>
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

customElements.define('sg-bottom-nav', SgBottomNav)
