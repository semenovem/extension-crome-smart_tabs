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

    // проверить, если свойство в prototype _TIMEOUT_BEFORE_SAVE не задано - задать
    if (!app.KitItem._TIMEOUT_BEFORE_SAVE) {
        app.KitItem._TIMEOUT_BEFORE_SAVE = app.setup.get('timeout.kit.beforeSave');
    }

    /**
     * Объект приложения
     * @type {Object}
     * @private
     */
    this._app = app;

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
     * Состояние экземпляра. Промис выполниться после нахождения / создания записи в store
     * @type {Promise}
     */
    this._condition = new Promise((resolve, reject) => {
        this._conditionResolve = resolve;
        this._conditionReject = reject;
    });
};
