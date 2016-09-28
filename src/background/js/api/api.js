/**
 *
 * @class app.Util
 */
app.api = {
    // <debug>
    $className: 'Api',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Инициализация объекта
     */
    init() {
        this._app.binding(this);
    }

};



