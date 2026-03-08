/**
 * Simple event bus for cross-component communication.
 * Same pattern as the SG/Send workspace EventBus.
 */
export const EventBus = {
    _target: new EventTarget(),

    /**
     * Emit an event
     * @param {string} type - Event name
     * @param {*} detail - Event payload
     */
    emit(type, detail) {
        this._target.dispatchEvent(new CustomEvent(type, { detail }))
    },

    /**
     * Listen for an event
     * @param {string} type - Event name
     * @param {function} handler - Event handler
     */
    on(type, handler) {
        this._target.addEventListener(type, handler)
    },

    /**
     * Remove an event listener
     * @param {string} type - Event name
     * @param {function} handler - Event handler to remove
     */
    off(type, handler) {
        this._target.removeEventListener(type, handler)
    }
}
