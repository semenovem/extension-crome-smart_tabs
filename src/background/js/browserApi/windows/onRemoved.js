/**
 * @type {object} событие закрытие окна браузера
 *
 */
app.browserApi.windows.onRemoved = {
    // <debug>
    $className: 'browserApi.windows.onRemoved',

    /**
     * @type {app} the application object
     */
    _app: null,

    /**
     * обработчик события
     */
    _callback: null,
    // </debug>

    /**
     * Явно указать контекст всем методам
     */
    init() {
        this._app.binding(this);
    },

    /**
     * Подписка на событие
     * @param {function} callback
     */
    addListener(callback) {
        if (!this._callback) {
            window.chrome.windows.onRemoved.addListener(this._onEvent);
        }
        this._callback = callback;
    },

    /**
     * Удалить подписку
     */
    removeListener() {
        if (this._callback) {
            window.chrome.windows.onRemoved.removeListener(this._onEvent);
            delete this._callback;
        }
    },

    /**
     * Обработчик
     * @param {number} windowId
     * @private
     */
    _onEvent(windowId) {
        const id = +windowId;

        if (!isFinite(id) || id < 0 || typeof this._callback !== 'function') {
            return;
        }
        this._callback(id);
    }
};
