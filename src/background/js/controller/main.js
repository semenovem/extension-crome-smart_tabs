/**
 * Контроллер для окон, вкладок
 */
app.controller = {
    // <debug>
    $className: 'СollectController',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * На какие события подписатся
     */
    _events: {
        /**
         * проверить, оформлена ли подписка на событие
         * @param {string} fireName название события
         */
        is(fireName) {
            return this[fireName] && true;
        },
        create: {
            on: true,   // оформить подписку
            is: false   //
        },
        remove: true,
        updated: true,
        activate: true,
        move: true
    },

    /**
     * Инициализация объекта
     * Подготовка методов - сохранение у них контекста
     */
    init() {
        this.createdTab = this.createdTab.bind(this);
        this.removedTab = this.removedTab.bind(this);
        this.updatedTab = this.updatedTab.bind(this);
        this.deachedTab = this.deachedTab.bind(this);
        this.attachedTab = this.attachedTab.bind(this);
    },

    /**
     * Синхронизация с открытыми окнами и вкладками
     * @returns {Promise}
     */
    synxCurrentOpenKits() {
        return new Promise((resolve, reject) => {
            this._app.chromeTabs.query(
                {},
                tabs => {
                    // todo возможно стоит убрать try, поскольку в нативной реализации и при ошибке, исключение перейдет в catch
                    try {
                        tabs.forEach(item => this.createdTab(item));

                        // перебрать все объекты
                        Promise.all(this._app.collectKits.getItemsInArray().map(item => item.getStateReady()))
                            .then(() => resolve(true));
                    }
                    catch (e) {
                        reject(e);
                    }
                }
            );
        })
            .catch(e => {
                this._app.log.error({
                    // <debug>
                    name: 'Получение текущего состояния открытых окон и вкладок',
                    note: '',
                    $className: this.$className,
                    // </debug>
                    code: 0,
                    event: e
                });
                throw(false);
            });
    },

    // открытие ранее сохраненных окон браузера
    openSavedKits() {
        return new Promise((resolve, reject) => {

            let a = this._app.store._fewRawOpen;

            console.log(56556, a);

            resolve();

        });
    },

    // открытие окна с вкладками
    createNewKit(kit) {

        let kitId = 0;

    },

    /**
     *
     */
    subscribe() {
        let tabs = this._app.chromeTabs;

        tabs.onCreated.addListener(this.createdTab);
        tabs.onRemoved.addListener(this.removedTab);
        tabs.onUpdated.addListener(this.updatedTab);
        tabs.onDetached.addListener(this.deachedTab);
        tabs.onAttached.addListener(this.attachedTab);
        // tabs.onActivated.addListener(hand.activated);
        // tabs.onMoved.addListener(hand.moved);
    },

    /**
     * отписаться
     */
    unsubscribe() {
        console.log('unsubscribe');
    },

    /**
     * добавить обработчик
     */
    addHandler() {},

    /**
     * Удалить обработчик
     */
    removeHandler() {},

    /**
     * Событие. Создана новая вкладка
     * @param {object} item
     */
    createdTab(item) {
        let collectTabs = this._app.collectTabs;
        let collectKits = this._app.collectKits;
        const kitId = +item.windowId;

        let w = Math.abs(parseInt(item.width));
        let h = Math.abs(parseInt(item.height));

        let kit = collectKits.getById(kitId) || collectKits.createItem({
                id: kitId,
                active: !!item.active,
                width: isFinite(w) ? w : 0,
                height: isFinite(h) ? h : 0
            });

        let tab = collectTabs.getById(item.id) || collectTabs.createItem({
                id: +item.id,
                title: typeof item.title === 'string' ? item.title : '',
                favIconUrl: typeof item.favIconUrl === 'string' ? item.favIconUrl : '',
                url: item.url

                // todo сохранить сырые данные для отладки
                ,
                _$raw: item
            });
        kit.addTab(tab);
        return tab;
    },

    /**
     * Hahdler for when a tab is closed
     * @param {number} tabId
     * @param {object} info
     */
    removedTab(tabId, info) {
        let collectTabs = this._app.collectTabs;

        console.log(info, tabId);

        let tab = collectTabs.removeItem(tabId);
        if (tab) {
            // закрытие окна
            if (info.isWindowClosing) {
                tab.kit.record && this._app.collectRecords.removeRecord(tab.kit.record);
            }
            // закрытие вкладки
            else {
                tab.setClosed(true);
            }
        }
    },

    /**
     * Hahdler for when a tab is updated url
     * @param {number} tabId
     * @param {object} info
     * @param {object} objTab
     */
    updatedTab(tabId, info, objTab) {

        //console.log('tab updated', tabId, data);
        if ('url' in info) {
            let tab = this._app.collectTabs.getById(tabId);
            tab && tab.url !== info.url && tab.changedUrl(info.url);
        }
    },

    /**
     *
     * @param info
     */
    activated(info) {
        console.log('tab _onActivated', info);
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
    deachedTab(tabId, info) {
        console.log('tab deachedTab', info);
    },

    /**
     * Отделили вкладку от окна
     * @param {number} tabId
     * @param info
     */
    attachedTab(tabId, info) {
        console.log('tab attachedTab', tabId, info);
    }

};
