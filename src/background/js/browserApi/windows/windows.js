/**
 * @type {object} работа с окнами
 *
 *
 */
app.browserApi.windows = {
    // <debug>
    $className: 'browserApi.windows',

    /**
     * @type {object} the application object
     */
    _app: null,

    /**
     * @type {object} событие создание нового окна
     */
    onCreated: null,

    /**
     * @type {object} событие закрытие окна браузера
     */
    onRemoved: null,

    /**
     * @type {function} создание нового окна
     */
    create: null,

    /**
     * @type {function} получение данных одного открытого окна
     */
    get: null,

    /**
     * @type {function} получение данных всех открытых окон
     */
    getAll: null,

    // </debug>

    _STATE: {
        'fullscreen': 'fullscreen',
        'minimized' : 'minimized',
        'maximized' : 'maximized',
        'normal'    : 'normal'
    },

    /**
     * Инициализация дочерних объектов
     * Биндинг контекста всех методов
     */
    init() {
        this._app.executionInits.call(this, this._app);
        this._app.binding(this);
    },

    // ################################################
    // конвертация данных для api
    // ################################################

    /**
     * Подготовка параметров для открытия окна браузера
     * @param {object} model
     * @return {object}
     * @private
     *
     * todo разобраться  со входными данными
     */
    recordKitToOpen(model) {
        const params = {
            url: model.tabs.map(tab => tab.url)
        };
        switch (model.state) {
            case 'minimized':
            case 'maximized':
            case 'fullscreen':
                params.state = model.state;
                break;
            default:
                'left' in model && (params.left = model.left);
                'top' in model && (params.top = model.top);
                'width' in model && (params.width = model.width);
                'height' in model && (params.height = model.height);
                break
        }
        return params;
    },

    // ################################################
    // конвертация данных, полученных от api
    // ################################################

    /**
     *
     * @param arrKitEvent
     * @return {app.dto.KitView[]}
     */
    convDtoArrKitView(arrKitEvent) {
        try {
            return arrKitEvent.map(this.convDtoKitView);
        }
        catch (e) {
            throw 'Не удалось' + e;
        }
    },

    /**
     *
     * @param {*} kitEvent
     * @return {app.dto.KitView}
     */
    convDtoKitView(kitEvent) {
        try {
            return this._app.dto.kitView({
                kitId : +kitEvent.id,
                //     focused    : kitEvent.focused,
                left  : +kitEvent.left,
                top   : +kitEvent.top,
                width : +kitEvent.width,
                height: +kitEvent.height,
                state : this._STATE[kitEvent.state]
                //    type       : kitEvent.type,
                //     alwaysOnTop: kitEvent.alwaysOnTop
            });
        }
        catch (e) {
            throw 'Не удалось' + e;
        }
    },

    /**
     *
     * @param {*} arrKitEvent
     * @return {app.dto.KitTabView[]}
     */
    convDtoArrKitTabView(arrKitEvent) {
        try {
            return arrKitEvent.map(this.convDtoKitTabView);
        }
        catch (e) {
            throw 'Не удалось' + e;
        }
    },

    /**
     *
     * @param {*} kitTabEvent
     * @return {app.dto.KitTabView}
     */
    convDtoKitTabView(kitTabEvent) {
        try {
            const raw = {
                id    : +kitTabEvent.id,   // todo удалить после полной замены
                kitId : +kitTabEvent.id,
                //     focused    : kitTabEvent.focused,
                left  : +kitTabEvent.left,
                top   : +kitTabEvent.top,
                width : +kitTabEvent.width,
                height: +kitTabEvent.height,
                state : this._STATE[kitTabEvent.state]
                //    type       : kitTabEvent.type,
                //     alwaysOnTop: kitTabEvent.alwaysOnTop
            };

            raw.tabs = this._app.browserApi.tabs.normalizeArr(kitTabEvent.tabs);
            // определение активной вкладки
            raw.tabActive = this._app.browserApi.tabs.getIndexActive(raw.tabs);

            return this._app.dto.kitTabView(raw);
        }
        catch (e) {
            throw 'Не удалось' + e;
        }
    }

};
