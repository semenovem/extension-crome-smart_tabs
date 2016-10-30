/**
 * браузерные API
 */
app.browserApi = {
    // <debug>
    $className: 'browserApi',

    /**
     * @type {app} the application object
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
