/**
 * @type {app.browserApi.runtime} работа со вкладками
 *
 *
 */
app.browserApi.runtime = {
    // <debug>
    $className: 'browserApi.runtime',

    /**
     * @type {object} the application object
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
        // this._app.binding(this);  todo проверить работу с биндингом и без него
    }
};
