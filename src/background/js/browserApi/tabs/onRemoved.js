/**
 * @type {object} событие браузерного api удаление вкладки
 *
 * обеспечивает разделение одного браузерного события на 2-а разных поведения
 * : закрытие вкладки
 * : закрытие окна      - ничего не делаем
 *
 *
 */
app.browserApi.tabs.onRemoved = {
    // <debug>
    $className: 'browserApi.tabs.onRemoved',

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
            window.chrome.tabs.onRemoved.addListener(this._onEvent);
        }
        this._callback = callback;
    },

    /**
     * Удалить подписку
     */
    removeListener() {
        if (this._callback) {
            window.chrome.tabs.onRemoved.removeListener(this._onEvent);
            delete this._callback;
        }
    },


    // <debug>
    // поля объекта события
    __tabId: 2134213,
    __indo: {
        isWindowClosing: false,
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
            const isWindowClosing = Boolean(info.isWindowClosing);

            if (isFinite(windowId) && windowId > 0) {
                this._callback({
                    tabId,
                    kitId: windowId,
                    isKitClosing: isWindowClosing
                });
            }
        }
    }
};
