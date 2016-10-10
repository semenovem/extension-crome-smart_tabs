/**
 * @type {object} событие браузерного api создание новой вкладки
 *
 *
 */
app.browserApi.tabs.onCreated = {
    // <debug>
    $className: 'browserApi.tabs.onCreated',

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

    // <debug>
    // поля объекта события
    __i: {
        active     : true,
        audible    : false,
        height     : 0,
        highlighted: false,
        id         : 3106,
        incognito  : false,
        index      : 3,
        mutedInfo  : {},
        openerTabId: 3100,
        pinned     : false,
        selected   : true,
        status     : "loading",
        title      : "New Tab",
        url        : "chrome://newtab/",
        width      : 0,
        windowId   : 2905
    },
    // </debug>

    /**
     * Обработчик
     * @param {object} eDataTab
     * @private
     */
    _onEvent(eDataTab) {
        if (eDataTab && typeof eDataTab === 'object' && typeof this._callback !== 'function') {
            return;
        }

        const eTab = this._app.browserApi.tabs.conv(eDataTab);
        eTab && this._callback(eTab);
    }
};
