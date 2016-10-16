/**
 * @type {object} работа с окнами
 *
 *
 */
app.browserApi.windows = {
    // <debug>
    $className: 'browserApi.windows',

    /**
     * @type {object} объект приложения
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

    /**
     * Инициализация дочерних объектов
     * Биндинг контекста всех методов
     * Получение настроек
     */
    init() {
        this._app.executionInits.call(this, this._app);
        this._app.binding(this);
    },



    // ################################################
    // конвертация данных, полученных от api
    // ################################################

    /**
     * Конвертация объекта, возвращенного событием браузерного api в программный
     * который будет использоватся дальше
     * {
     *      id:             {number}    id окна
     *      width:          {number}
     *      height:         {number}
     *      left:           {number}
     *      top:            {number}
     *      alwaysOnTop:    {boolean}
     *      focused:        {boolean}
     *      type:           {string}
     *      [tabs]          {Array}   если данные будут в объекте события
     * }
     *
     * Если ни одна вкладка не пройдет валидацию, весь объект окна не пройдет валидацию
     *
     *
     *
     * @param {object} kitEvent
     * @return {object|null}
     * @private
     */
    conv(kitEvent) {
        if (!kitEvent || typeof kitEvent !== 'object') {
            return null;
        }
        const kitView = {};
        const raw = {
            id         : +kitEvent.id,
       //     focused    : kitEvent.focused,
       //     left       : kitEvent.left,
       //     top        : kitEvent.top,
       //     width      : kitEvent.width,
       //     height     : kitEvent.height,
       //     state      : kitEvent.state    // "fullscreen" "minimized" "maximized" "normal"
        //    type       : kitEvent.type,
       //     alwaysOnTop: kitEvent.alwaysOnTop
        };

        const valid = true;



        //this._app.kitFields
        //    .filter(field => field.view && raw[field.name])
        //    .forEach(field => {
        //        const name = field.name;
        //        const value = field.normalize(raw[name]);
        //        if (field.valid(value)) {
        //            kitView[name] = value;
        //        }
        //    });
        //
        //let valid = this._app.kitFields
        //    .filter(field => field.requireView)
        //    .every(field => kitView[field.name]);
        //
        //// валидация вкладок, если есть в объекте события
        //if (valid && Array.isArray(kitEvent.tabs)) {
        //    kitView.tabs = this._app.browserApi.tabs.convAll(kitEvent.tabs);
        //
        //    // определение активной вкладки
        //    kitEvent.tabs.some((tabView, index) => tabView.active && (kitView.tabActive = index));
        //
        //    // объект окна без вкладок не может существовать
        //    if (!kitView.tabs.length) {
        //        valid = false;
        //    }
        //}

        return valid ? raw : null;
    }
};
