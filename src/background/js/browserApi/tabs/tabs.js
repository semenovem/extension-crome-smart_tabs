/**
 * @type {object} работа со вкладками
 *
 *
 */
app.browserApi.tabs = {
    // <debug>
    $className: 'browserApi.tabs',

    /**
     * @type {object} объект приложения
     */
    _app: null,

    /**
     * Событие создание новой вкладки
     */
    onCreated: null,

    /**
     * Событие закрытие вкладки
     */
    onRemoved: null,

    /**
     * Событие активации вкладки (пользователь переключился на вкладку)
     */
    onActivated: null,

    // </debug>

    /**
     * Получение настроек
     * Добавить обработчик для события браузера
     */
    init() {
        this._app.executionInits.call(this, this._app);
    },

    // ################################################
    // конвертация данных, полученных от api
    // ################################################

    /**
     * Конвертация массива вкладок
     * @param {Array} eDataTabs
     * @return {Array}
     * @private
     */
    convAll(eDataTabs) {
        return eDataTabs
            .map(eDataTab => eDataTab && typeof eDataTab === 'object' && this.conv(eDataTab)).filter(t=>t);
    },

    /**
     * Конвертация данных вкладки
     *  {
     *      active:
     *      url:
     *      title:
     *      favIconUrl:
     *  }
     *
     * @param {object} eDataTab
     * @return {object|null}
     * @private
     */
    conv(eDataTab) {
        return eDataTab && typeof eDataTab === 'object' &&
            this._app.tabConv.validateEvent(
                this._app.tabConv.normalize({
                    id: eDataTab.id,
                    //active: eDataTab.active,
                    //audible: eDataTab.audible,
                    favIconUrl: eDataTab.favIconUrl,
                    //highlighted: eDataTab.highlighted,
                    //incognito: eDataTab.incognito,
                    //index: eDataTab.index,
                    //pinned: eDataTab.pinned,
                    //selected: eDataTab.selected,
                    //status: eDataTab.status,
                    title: eDataTab.title,
                    url: eDataTab.url,
                    windowId: eDataTab.windowId
                })
            ) || null;
        // todo сделать логирование ошибок валидации
    }

};
