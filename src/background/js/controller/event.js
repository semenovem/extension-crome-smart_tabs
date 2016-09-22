/**
 * @type {object} контроллер событий окон и вкладок
 */
app.controllerEvent = {
    // <debug>
    $className: 'controllerEvent',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,

    /**
     * @type {object} содержит названия событий, которые нужно подавить
     */
    _suppressEvents: Object.create(null),

    /**
     * @type {object} список названий событий
     */
    __suppressEventsList: {
        createdTab: null,

        // это никак не используется, не входит в сборку
        addListener: null,
        removeListener: null,
        onRemoved: null,
        onCreated: null,
        onUpdated: null,
        onDetached: null,
        onAttached: null,
        onActivated: null
    },

    // </debug>


    /**
     * Подавить события (просто не обрабатывать их)
     * @param {Array|string} eventName список названий событий, которые нужно подавить
     */
    suppress(eventName) {
        if (Array.isArray(eventName)) {
            eventName.forEach(item => this._suppressEvents[eventName] = true);
        } else {
             this._suppressEvents[eventName] = true;
        }
    },

    /**
     * Восстановить обработку событий
     * @param {Array|string} eventName список событий, обработку которых нужно восстановить
     */
    resume(eventName) {
        if (Array.isArray(eventName)) {
            eventName.forEach(item => delete this._suppressEvents[eventName]);
        } else {
            delete this._suppressEvents[eventName];
        }
    },






    /**
     * Добавление обработчиков событий
     * todo сделать обработку через browserApi
     */
    add() {
        let apiTab = this._app.chromeTabs;

        apiTab.onRemoved.addListener(this._removedTab);
        apiTab.onCreated.addListener(this._createdTab);
        apiTab.onUpdated.addListener(this._updatedTab);
        apiTab.onDetached.addListener(this._deachedTab);
        apiTab.onAttached.addListener(this._attachedTab);
        apiTab.onActivated.addListener(this._activatedTab);

        // tabs.onMoved.addListener(hand.moved);
    },

    /**
     * Снять обработчики событий
     */
    remove() {
        let apiTab = this._app.chromeTabs;
        apiTab.onRemoved.removeListener(this._removedTab);
        apiTab.onCreated.removeListener(this._createdTab);
        apiTab.onUpdated.removeListener(this._updatedTab);
        apiTab.onDetached.removeListener(this._deachedTab);
        apiTab.onAttached.removeListener(this._attachedTab);
        apiTab.onActivated.removeListener(this._activatedTab);
        // tabs.onMoved.removeListener(hand.moved);
    },



    /**
     * Событие. Создана новая вкладка
     * @param {object} eventTab объект tab
     */
    _createdTab(eventTab) {
        if (this._suppressEvents.createdTab) {
            return;
        }
        console.log ('001, create tab ', eventTab);

        const kitRaw = this._app.kitConv.onCreatedTab(eventTab);
        const tabRaw = this._app.tabConv.onCreatedTab(eventTab);

        if (kitRaw && tabRaw) {
            const tabCollect = this._app.tabCollect;
            const kitCollect = this._app.kitCollect;

            const kit = kitCollect.getById(kitRaw.id) || kitCollect.createItem(kitRaw);
            const tab = tabCollect.getById(tabRaw.id) || tabCollect.createItem(tabRaw);

            tab.setKit(kit);
        }
    },

    /**
     * Hahdler for when a tab is closed
     * @param {number} tabId
     * @param {object} info
     */
    _removedTab(tabId, info) {
        const tabCollect = this._app.tabCollect;

        //console.log(info, tabId);

        let tab = tabCollect.removeItem(tabId);
        if (tab) {
            // закрытие окна
            // обработать info перед использованием
            if (info.isWindowClosing) {
                //        tab.kit.record && this._app.collectRecords.removeRecord(tab.kit.record);
            }
            // закрытие вкладки
            else {
                tab.close();
            }
        }
    },

    /**
     * Hahdler for when a tab is updated url
     * @param {number} tabId
     * @param {object} change
     * @param {object} objTab
     */
    _updatedTab(tabId, change, objTab) {
        const tab = this._app.tabCollect.getById(tabId);
     //   console.log ('.. updateTab', change, tabId, !!tab);
        if (tab) {
            tab.modify();
        }
    },

    /**
     * Вкладка получила фокус
     * @param {number} tabId
     * @param {number} windowId
     */
    _activatedTab(tabId, windowId) {
       // console.log('tab _onActivated', tabId, windowId);

        // получить созданные объекты
        // если нет tab но есть kit - установить

        // проверить, принадлежит ли вкладка окну
        const kit = this._app.kitCollect.getById(windowId);
        const tab = this._app.tabCollect.getById(tabId);

        // есть объект окна
        if (kit) {
            kit.modify();
        }
        // нет объекта окна
        else {
            // todo создание объекта окна по id  this._app.

        }
    },

    /**
     *
     * @param info
     */
    moved(info) {
        console.log('tab _onMoved', info);
    },

    /**
     *
     * @param info
     */
    highlighted(info) {
        console.log('tab _onHighlighted', info);
    },

    /**
     * Отделили вкладку от окна
     * @param {number} tabId
     * @param info
     */
    _deachedTab(tabId, info) {
        console.log('tab deachedTab', info);
    },

    /**
     * Отделили вкладку от окна
     * @param {number} tabId
     * @param info
     */
    _attachedTab(tabId, info) {
        console.log('tab attachedTab', tabId, info);
    }
};