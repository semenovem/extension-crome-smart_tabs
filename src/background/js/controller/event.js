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
     * todo сделать обработку через browserApi
     */
    add() {
        const apiTab = window.chrome.tabs;

        apiTab.onRemoved.addListener(this._removedTab);
        //apiTab.onCreated.addListener(this._createdTab);
        apiTab.onUpdated.addListener(this._updatedTab);
        //apiTab.onDetached.addListener(this._deachedTab);
        //apiTab.onAttached.addListener(this._attachedTab);
        //apiTab.onActivated.addListener(this._activatedTab);

        // tabs.onMoved.addListener(hand.moved);

        const api = this._app.browserEvent.tabs;
        api.onCreated(this._createdTab);
        //api.onUpdated(this._updatedTab);

        //this._app.browserEvent.kit.onRemoved(this._removedKit);


        // api.tabs.un.created()


    },


    /**
     * Снять обработчики событий
     */
    remove() {
        const apiTab = window.chrome.tabs;
        apiTab.onRemoved.removeListener(this._removedTab);
        //apiTab.onCreated.removeListener(this._createdTab);
        apiTab.onUpdated.removeListener(this._updatedTab);
        //apiTab.onDetached.removeListener(this._deachedTab);
        //apiTab.onAttached.removeListener(this._attachedTab);
        //apiTab.onActivated.removeListener(this._activatedTab);
        // tabs.onMoved.removeListener(hand.moved);

        const api = this._app.browserEvent.tabs;
        api.onCreated(null);
        //api.onRemoved(null);

        //this._app.browserEvent.kit.onRemoved(null);

        //api.onUpdated(null);
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

        const kit = this._app.kitCollect.getById(eTab.windowId) || this._app.kitCollect.createItem({
                id: eTab.windowId
            });

        kit.modify();   // todo вызвать только если объект уже был создан

        const tab = this._app.tabCollect.getById(eTab.id) || this._app.tabCollect.createItem(eTab);
        tab.setState(eTab);
    },

    /**
     * Hahdler for when a tab is closed
     * @param {number} tabId
     * @param {object} info
     */
    _removedTab(tabId, info) {
        const windowId = info.windowId;
        const isWindowClosing = info.isWindowClosing;

        const kit = this._app.kitCollect.getById(windowId);
        const tab = this._app.tabCollect.getById(tabId);

        // закрытие окна
        if (isWindowClosing) {
            kit && kit.close();
            tab && tab.remove();

        // закрывается одна вкладка
        } else {
            tab && tab.close();
            kit && kit.modify();   // todo если  модели окна нет - создать
        }
    },

    ///**
    // * Закрытие окна браузера
    // * @param {number} id идентификатор окна браузера
    // * @private
    // */
    //_removedKit(id) {
    //    const kit = this._app.kitCollect.getById(Id);
    //    kit && kit.close();
    //},

    /**
     * Обработчик события изменение данных во вкладке
     * @param {number} tabId
     * @param {object} change
     * @param {object} eDataTab
     */
    _updatedTab(tabId, change, eDataTab) {
        // todo обработать данные от api

        const kit = this._app.kitCollect.getById(eDataTab.windowId);
        kit && kit.modify();

        // это возможно не потребуется
        //const tab = this._app.tabCollect.getById(tabId);
        //if (tab) {
        //    tab.modify();
        //} else {
        //    this._app.controllerSync.tab(tabId);
        //}
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