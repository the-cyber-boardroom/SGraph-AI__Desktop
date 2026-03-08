import { EventBus } from '/lib/event-bus.js'

/**
 * Status bar component showing current site URL and connection status.
 */
class SgStatusBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="status-bar">
                <span class="status-site" id="status-site">No site selected</span>
                <span class="status-spacer"></span>
                <span class="status-indicator" id="status-indicator">Ready</span>
            </footer>
        `

        EventBus.on('site-activated', (e) => {
            const el = this.querySelector('#status-site')
            if (el) el.textContent = `${e.detail.url} — Active`
        })
    }
}

customElements.define('sg-status-bar', SgStatusBar)
