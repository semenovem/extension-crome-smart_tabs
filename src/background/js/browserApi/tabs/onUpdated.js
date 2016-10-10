/**
 * @type {object} событие браузерного api обновление данных во вкладке
 *
 *
 */
app.browserApi.tabs.onUpdated = {
    // <debug>
    $className: 'browserApi.tabs.onUpdated',

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
            window.chrome.tabs.onUpdated.addListener(this._onEvent);
        }
        this._callback = callback;
    },

    /**
     * Удалить подписку
     */
    removeListener() {
        if (this._callback) {
            window.chrome.tabs.onUpdated.removeListener(this._onEvent);
            delete this._callback;
        }
    },


    // <debug>
    // поля объекта события
    // tabId, changeInfo, eDataTab
    // </debug>



    /**
     * Обработчик
     * @param {number} tabId
     * @param {object} changeInfo изменения
     * @param {object} eDataTab данные вкладки
     * @private
     */
    _onEvent(tabId, changeInfo, eDataTab) {
        tabId = +tabId;

        //console.log (tabId, changeInfo)

        // большего разбора пока не требуется. Есть данные по вкладке

        if (isFinite(tabId) && tabId > 0 && eDataTab && typeof eDataTab === 'object') {
            const windowId = +eDataTab.windowId;

            if (isFinite(windowId) && windowId > 0) {

                this._callback({
                    tabId,
                    kitId: windowId
                })
            }
        }
    }
};
