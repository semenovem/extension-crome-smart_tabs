/**
 * @type {object} событие браузерного api активация вкладки
 *
 *
 */
app.browserApi.tabs.onActivated = {
    // <debug>
    $className: 'browserApi.tabs.onActivated',

    /**
     * @type {object} объект приложения
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
            window.chrome.tabs.onActivated.addListener(this._onEvent);
        }
        this._callback = callback;
    },

    /**
     * Удалить подписку
     */
    removeListener() {
        if (this._callback) {
            window.chrome.tabs.onActivated.removeListener(this._onEvent);
            delete this._callback;
        }
    },


    // <debug>
    // поля объекта события

    // </debug>



    /**
     * Обработчик
     * @param {object} activeInfo
     * @private
     */
    _onEvent(activeInfo) {
        if (activeInfo && typeof activeInfo === 'object') {
            const tabId = +activeInfo.tabId;
            const windowId = +activeInfo.windowId;

            if (isFinite(tabId) && tabId > 0 && isFinite(windowId) && windowId > 0) {
                this._callback({
                    tabId,
                    kitId: windowId
                })
            }
        }
    }
};
