/**
 * @type {object} работа со вкладками
 *
 *
 */
app.browserApi.tabs = {
    // <debug>
    $className: 'browserApi.tabs',

    /**
     * @type {app} the application object
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
     * Определить индекс активной вкладки в массиве вкладок
     * @param {Array} tabs
     * @returns {number}
     */
    getIndexActive(tabs) {
        return tabs.reduce((index, tab, indexInArr) => {
            return tab.active ? indexInArr : index;
        }, 0);
    },



    /**
     *
     */
    normalizeArr(tabs) {
        try {
            return tabs.map(this.normalize);
        }
        catch (e) {
            console.error('--', e);
            throw '--' + e;
        }
    },

    /**
     *
     */
    normalize(tabEvent) {
        try {
            return {
                id        : +tabEvent.id,
                tabId        : +tabEvent.id,
                active: tabEvent.active,
                audible: tabEvent.audible,
                favIconUrl: tabEvent.favIconUrl,
                //highlighted: tabEvent.highlighted,
                //incognito: tabEvent.incognito,
                //index: tabEvent.index,
                //pinned: tabEvent.pinned,
                //selected: tabEvent.selected,
                //status: tabEvent.status,
                title     : tabEvent.title,
                url       : tabEvent.url,
                kitId     : +tabEvent.windowId
            }
        }
        catch (e) {
            console.error('--', e);
            throw '--' + e;
        }
    },









    /**
     * Конвертация массива вкладок
     * @param {Array} tabsEvent
     * @return {Array}
     * @private
     */
    convAll(tabsEvent) {
        return tabsEvent
            .map(tabsEvent => this.conv(tabsEvent)).filter(tabView => tabView);
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
     * @param {object} tabEvent
     * @return {object|null}
     * @private
     */
    conv(tabEvent) {
        if (!tabEvent || typeof tabEvent !== 'object') {
            return null;
        }
        const tabView = {};
        const tabRaw = {
            id        : tabEvent.id,
            //active: tabEvent.active,
            //audible: tabEvent.audible,
            favIconUrl: tabEvent.favIconUrl,
            //highlighted: tabEvent.highlighted,
            //incognito: tabEvent.incognito,
            //index: tabEvent.index,
            //pinned: tabEvent.pinned,
            //selected: tabEvent.selected,
            //status: tabEvent.status,
            title     : tabEvent.title,
            url       : tabEvent.url,
            kitId     : tabEvent.windowId       // todo проверить, используется ли где либо это
        };

        this._app.tabFields
            .filter(field => field.view && field.name in tabRaw)
            .forEach(field => {
                const name = field.name;
                const value = field.normalize(tabRaw[name]);
                if (field.valid(value)) {
                    tabView[name] = value;
                }
            });

        // валидация обязательных значений
        let valid = this._app.tabFields
            .filter(field => field.requireView)
            .every(field => tabView[field.name]);

        return valid ? tabView : null;
        
        // todo сделать логгирование ошибок валидации
    }
};
