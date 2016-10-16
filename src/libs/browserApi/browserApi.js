/**
 * браузерные API
 */
app.browserApi = {
    // <debug>
    $className: 'browserApi',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,

    /**
     * @type {object} окна браузера
     */
    windows: null,
    // </debug>

    /**
     *
     */
    init() {
        this._app.executionInits.call(this, this._app);
    }
};
