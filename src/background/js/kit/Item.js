/**
 * Constructor win
 * @param {object} raw
 * @param {object} app
 * @constructor
 */
app.KitItem = function(raw, app) {
    // <debug>
    this.$className = 'KitItem';
    // </debug>

    /**
     * Объект приложения
     * @type {Object}
     * @private
     */
    this._app = app;

    /**
     * todo убрать использование store, можно заменить на collect
     * @class app.Store
     * @type {object}
     */
    this._store = app.storeOpen;

    /**
     * Получение полей, которые должны быть у экземпляра
     *
     */
    this.fields
        .filter(field => field.requireNew === true || 'default' in field)
        .forEach(field => {
            let name = field.name;
            this[name] = name in raw ? raw[name] : field.default;
        });

    /**
     * Вкладки
     * @type {Array}
     */
    this.tabs = [];
    // todo еще обработать объекты вкладок, они будут передаватся с сохранениями

    /**
     * Состояние экземпляра. Промис выполниться после нахождения / создания записи в store
     * @type {Promise}
     */
    this._condition = new Promise((resolve, reject) => {
        this._conditionResolve = resolve;
        this._conditionReject = reject;
    });


};



