/**
 * браузерные события
 * может быть только один подписчик на одно событие. Если подписывается второй обработчик - первый снимается
 */
app.browserEvent = {
    // <debug>
    $className: 'browserEvent',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Подписчики на события
     */
    _handlers: Object.create(null),

    /**
     * @type {object} список событий браузерного api
     */
    _events: {
        tabs: {
            'onCreated': 'onCreated'
        }
    },


    /**
     *
     */
    init() {
        this._app.binding(this);
        this._app.binding(this.tabs, this);
    },

    /**
     *
     */
    prep() {},


    /**
     * @type {object} api вкладок
     */
    tabs: {


        // объект события
        __i: {
            active: true,
            audible: false,
            height: 0,
            highlighted:false,
            id:3106,
            incognito:false,
            index:3,
            mutedInfo: {},
            openerTabId:3100,
            pinned:false,
            selected:true,
            status:"loading",
            title:"New Tab",
            url:"chrome://newtab/",
            width:0,
            windowId:2905
        },


        /**
         * Событие создание новой вкладки
         * @param {function|null} callback
         */
        onCreated(callback) {
            if (!this._handlers.tabOnCreate) {
                window.chrome.tabs.onCreated.addListener(this.tabs._onCreatedHandler);
            }
            this._handlers.tabOnCreate = callback;
        },

        _onCreatedHandler(eDataTab) {
            if (eDataTab && typeof eDataTab === 'object' && this._handlers.tabOnCreate) {
                const eTab = this._app.browserApi._tabConv(eDataTab);

                if (eTab) {
                    const windowId = parseInt(eDataTab.windowId);
                    if (isFinite(windowId) && windowId >= 0) {
                        eTab.windowId = windowId;
                        this._handlers.tabOnCreate(eTab);
                    }
                }
            }
        },



        /**
         * Изменение данных вкладки
         * @param callback
         */
        onUpdated(callback) {

        },

        _onUpdateHandler(eDataTab) {

            // todo контроль объекта события - что ожидаем и в какое значение конвертируем
            if (eDataTab && typeof eDataTab === 'object' && this._handlers.tabOnCreate) {
                const eTab = this._app.browserApi._tabConv(eDataTab);

                if (eTab && eDataTab.windowId && isFinite(eDataTab.windowId)) {
                    const windowId = parseInt(eDataTab.windowId);
                    if (isFinite(windowId) && windowId >= 0) {
                        eTab.windowId = windowId;
                        this._handlers.tabOnCreate(eTab);
                    }
                }
            }
        },












    },


    kit: {

        /**
         * Закрытие окна
         * @param callback
         */
        onRemoved(callback) {
            this._handlers.kitOnRemoved = callback;
        }




    }










};
