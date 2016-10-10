/**
 * @type {object} работа со вкладками
 *
 *
 */
app.browserApi.runtime = {
    // <debug>
    $className: 'browserApi.runtime',

    /**
     * @type {object} объект приложения
     */
    _app: null,

    /**
     * Слушать сообщения от вкладок
     */
    onMessage: null,


    // </debug>

    /**
     * Получение настроек
     * Добавить обработчик для события браузера
     */
    init() {
        this._app.executionInits.call(this, this._app);
    },

};
