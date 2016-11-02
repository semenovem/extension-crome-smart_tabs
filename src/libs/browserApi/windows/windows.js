/**
 * @type {object} работа с окнами
 *
 *
 */
app.browserApi.windows = {
    // <debug>
    $className: 'browserApi.windows',

    /**
     * @type {app} the application object
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
     *
     * @param {object} kitEvent
     * @return {object|null}
     * @private
     */
    conv(kitEvent) {
        if (!kitEvent || typeof kitEvent !== 'object') {
            return null;
        }
        const raw = {
            kitId: +kitEvent.id
        };

        const valid = true;

        return valid ? raw : null;
    }
};
