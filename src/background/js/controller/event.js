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
    $_suppressEventsList: {
        createdTab: null,

        // это никак не используется, не входит в сборку
        addListener: null,
        removeListener: null,
        tabs: {
            onRemoved: null,
            onCreated: null,
            onUpdated: null,
            onDetached: null,
            onAttached: null,
            onActivated: null
        }
    },

    // </debug>

    /**
     *
     */
    init() {
        this._app.binding(this);
    },


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
     */
    add() {
        const api = this._app.browserApi;

        api.tabs.onCreated.addListener(this._createdTab);
        api.tabs.onUpdated.addListener(this._updatedTab);
        api.tabs.onRemoved.addListener(this._removedTab);
        api.tabs.onActivated.addListener(this._activatedTab);

        api.windows.onRemoved.addListener(this._removedKit);
    },


    /**
     * Снять обработчики событий
     */
    remove() {
        const api = this._app.browserApi;

        api.tabs.onCreated.removeListener();
        api.tabs.onUpdated.removeListener();
        api.tabs.onRemoved.removeListener();
        api.tabs.onActivated.removeListener();

        api.windows.onRemoved.removeListener();
    },



    /**
     * Событие. Создана новая вкладка
     * @param {object} eTab объект tab
     */
    _createdTab(eTab) {
        // todo перенести заморозку событий в browserApi
        if (this._suppressEvents.onCreatedTab) {
            return;
        }
        console.log ('001, create tab ', eTab);

        const kit = this._app.kitCollect.getById(eTab.kitId) || this._app.kitCollect.createItem({
                id: eTab.kitId
            });

        kit.modify();   // todo вызвать только если объект уже был создан

        const tab = this._app.tabCollect.getById(eTab.id) || this._app.tabCollect.createItem(eTab);
        tab.setState(eTab);
    },

    /**
     * Событие при закрытии вкладки
     * @param {object} info
     */
    _removedTab(info) {
        const tab = this._app.tabCollect.getById(info.tabId);

        if (info.isKitClosing) {
            tab && tab.remove();
        } else {
            tab && tab.close();
            const kit = this._app.kitCollect.getById(info.kitId);
            kit && kit.modify();
        }
    },

    /**
     * Закрытие окна браузера
     * @param {number} id идентификатор окна браузера
     * @private
     */
    _removedKit(id) {
        const kit = this._app.kitCollect.getById(id);
        kit && kit.close();
    },


    /**
     * Обработчик события изменение данных во вкладке
     * @param {object} info
     */
    _updatedTab(info) {
        const kit = this._app.kitCollect.getById(info.kitId);
        kit && kit.modify();
    },


    /**
     * Вкладка получила фокус
     * @param {object} info
     */
    _activatedTab(info) {
        const kit = this._app.kitCollect.getById(info.kitId);
        const tab = this._app.tabCollect.getById(info.tabId);

   //     console.log('tab _onActivated', info, tab);

        //if (kit && tab && kit.tabDiscardCreate) {
        //
        //    tab.active();
        //
        //
        //}



        // получить созданные объекты
        //// если нет tab но есть kit - установить
        //
        //// проверить, принадлежит ли вкладка окну
        //const kit = this._app.kitCollect.getById(kitId);

        //
        //// есть объект окна
        //if (kit) {
        //    kit.modify();
        //}
        //// нет объекта окна
        //else {
        //    // todo создание объекта окна по id  this._app.
        //
        //}
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