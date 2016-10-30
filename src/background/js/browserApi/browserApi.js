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
     * @type {object} состояние активности системы
     */
    idle: null,

    /**
     * @type {object} окна браузера
     */
    windows: null,

    /**
     * @type {object} вкладки
     */
    tabs: null,

    /**
     * @type {object} обмен данными со вкладками
     */
    rintime: null,

    // </debug>

    /**
     *
     */
    init() {
        this._app.executionInits.call(this, this._app);
    }
};
