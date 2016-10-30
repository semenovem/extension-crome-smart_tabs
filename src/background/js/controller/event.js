/**
 * @type {object} контроллер событий окон и вкладок
 */
app.controllerEvent = {
    // <debug>
    $className: 'controllerEvent',

    /**
     * @type {app} the application object
     */
    _app: null,

    /**
     * @type {object} содержит названия событий, которые нужно подавить
     */
    _suspendEvents: Object.create(null),

    /**
     * @type {object} список названий событий
     */
    $_suppressEventsList: {
        onCreatedTab: null,

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
    suspend(eventName) {
        if (Array.isArray(eventName)) {
            eventName.forEach(item => this._suspendEvents[eventName] = true);
        } else {
             this._suspendEvents[eventName] = true;
        }
    },

    /**
     * Восстановить обработку событий
     * @param {Array|string} eventName список событий, обработку которых нужно восстановить
     */
    resume(eventName) {
        if (Array.isArray(eventName)) {
            eventName.forEach(item => delete this._suspendEvents[eventName]);
        } else {
            delete this._suspendEvents[eventName];
        }
    },




    /**
     * Добавление обработчиков событий
     */
    enable() {
        const api = this._app.browserApi;

        api.tabs.onCreated.addListener(this._createdTab);
        api.tabs.onUpdated.addListener(this._updatedTab);
        api.tabs.onRemoved.addListener(this._removedTab);
        api.tabs.onActivated.addListener(this._activatedTab);
        api.tabs.onMoved.addListener(this._movedTab);


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
        api.tabs.onMoved.removeListener();

        api.windows.onRemoved.removeListener();
    },



    /**
     * Событие. Создана новая вкладка
     * @param {object} tabView объект tab
     */
    _createdTab(tabView) {
        if (this._suspendEvents.onCreatedTab) {
            return;
        }

        const kit = this._app.kitCollect.getById(tabView.kitId) || this._app.kitCollect.createItem({
                kitId: tabView.kitId
            });
        kit.modify();

        //console.log ('001, create tab ', tabView);

        const tab = this._app.tabCollect.getByView(tabView);
    },

    /**
     * Событие при закрытии вкладки
     * @param {object} info
     */
    _removedTab(info) {
        const tab = this._app.tabCollect.getById(info.tabId);

        if (info.isKitClosing) {
            tab && tab.kitWasClosed();
        } else {
            tab && tab.removed();
            const kit = this._app.kitCollect.getById(info.kitId);
            kit && kit.modify();
        }
    },

    /**
     * Закрытие окна браузера
     * @param {number} kitId идентификатор окна браузера
     * @private
     */
    _removedKit(kitId) {
        const kit = this._app.kitCollect.getById(kitId);
        kit && kit.removed();
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
     * Обрабатывать окна только со статусом "complete"
     * @param {object} info
     */
    _activatedTab(info) {
        const kit = this._app.kitCollect.getById(info.kitId);

        // есть объект окна
        if (kit) {
            if (kit.getStatus() !== 'complete') {
                return;
            }
            kit.modify();
        }
        const tab = this._app.tabCollect.getById(info.tabId);
    //    console.log('tab _onActivated', kit.getStatus(),  info);

        if (tab) {
            tab.activated();
        }


    },

    /**
     * Перемещение вкладки внутри окна (изменение позиции)
     * @param info
     */
    _movedTab(info) {
        //console.log('tab _onMoved', info);
        const kit = this._app.kitCollect.getById(info.kitId);
        if (kit) {
            if (kit.getStatus() !== 'complete') {
                return;
            }
            kit.modify();
        }
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