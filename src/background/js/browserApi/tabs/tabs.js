/**
 * @type {object} работа со вкладками
 *
 *
 */
app.browserApi.tabs = {
    // <debug>
    $className: 'browserApi.tabs',

    /**
     * @type {object} the application object
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
        this._app.binding(this);
    },

    // ################################################
    // конвертация данных, полученных от api
    // ################################################

    /**
     * Определить индекс активной вкладки в массиве вкладок
     * @param {Array} tabs
     * @return {number}
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
                tabId     : +tabEvent.id,
                active    : tabEvent.active,
                audible   : tabEvent.audible,
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
     *
     * @param {*} tabEvent
     * @return {app.dto.TabView}
     */
    convDtoTabView(tabEvent) {
        try {
            return this._app.dto.tabView(
                this.normalize(tabEvent)
            );
        }
        catch (e) {
            throw 'Не удалось' + e;
        }
    }
};
