/**
 *
 *
 * @type {object} событие браузерного api создание новой вкладки
 *
 *
 */
app.browserApi.tabs.onCreated = {
    // <debug>
    $className: 'browserApi.tabs.onCreated',

    /**
     * @type {object} the application object
     */
    _app: null,

    /**
     * обработчик события
     */
    _callback: null,
    // </debug>

    /**
     * Получение настроек
     * Добавить обработчик для события браузера
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
            window.chrome.tabs.onCreated.addListener(this._onEvent);
        }
        this._callback = callback;
    },

    /**
     * Удалить подписку
     */
    removeListener() {
        if (this._callback) {
            window.chrome.tabs.onCreated.removeListener(this._onEvent);
            delete this._callback;
        }
    },

    /**
     * Обработчик события создание новой вкладки
     * @param {*} tabEvent
     * @private
     */
    _onEvent(tabEvent) {
        if (typeof this._callback !== 'function') {
            return;
        }
        try {
            this._callback(this._app.browserApi.tabs.convDtoTabView(tabEvent));
        }
        catch (e) {
            console.error('--', e);
        }
    }
};
