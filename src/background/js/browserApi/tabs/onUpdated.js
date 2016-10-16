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
     * @param {object} tabEvent данные вкладки
     * @private
     */
    _onEvent(tabId, changeInfo, tabEvent) {
        tabId = +tabId;

        // пропустить только события, которые сообщают об изменении свойств:
        // url, title, favIconUrl

        if ('url' in changeInfo === false && 'title' in changeInfo === false && 'favIconUrl' in changeInfo === false) {
            return;
        }

        //console.log (tabId, changeInfo);

        // большего разбора пока не требуется. Есть данные по вкладке

        if (isFinite(tabId) && tabId > 0 && tabEvent && typeof tabEvent === 'object') {
            const windowId = +tabEvent.windowId;

            if (isFinite(windowId) && windowId > 0) {
                this._callback({
                    tabId,
                    kitId: windowId
                })
            }
        }
    }
};
