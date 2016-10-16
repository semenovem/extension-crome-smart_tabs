/**
 * @type {object} событие браузерного api
 * перемещение вкладки (изменение порядкового номера) внутри окна
 *
 *
 */
app.browserApi.tabs.onMoved = {
    // <debug>
    $className: 'browserApi.tabs.onMoved',

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
     *
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
            window.chrome.tabs.onMoved.addListener(this._onEvent);
        }
        this._callback = callback;
    },

    /**
     * Удалить подписку
     */
    removeListener() {
        if (this._callback) {
            window.chrome.tabs.onMoved.removeListener(this._onEvent);
            delete this._callback;
        }
    },


    // <debug>
    // поля объекта события
    __tabId: 2134213,
    __indo: {
        fromIndex: 5,
        toIndex: 2,
        windowId: 1648
    },
    // </debug>


    /**
     * Обработчик
     * @param {number} tabId
     * @param {object} info
     * @private
     */
    _onEvent(tabId, info) {
        tabId = +tabId;
        if (info && typeof info === 'object' && isFinite(tabId) && tabId > 0) {
            const windowId = +info.windowId;

            if (isFinite(windowId) && windowId > 0) {
                this._callback({
                    tabId,
                    kitId: windowId
                });
            }
        }
    }
};
