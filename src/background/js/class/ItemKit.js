/**
 * Constructor win
 * @param {object} raw
 * @param {object} store
 * @constructor
 */
app.ItemKit = function(raw, store) {
    // <debug>
    this.$className = 'ItemKit';
    // </debug>

    /**
     * todo убрать использование store, можно заменить на collect
     * @class app.Store
     * @type {object}
     */
    this.store = store;

    /**
     * получение полей, которые должны быть у экземпляра
     *
     */
    this.fields
        .filter(field => field.requireForCreate === true || 'default' in field)
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
     * состояние экземпляра. Промис выпролнится после нахождения / создания записи в store
     * @type {Promise}
     */
    this._stateReady = new Promise((resolve, reject) => {
        this._stateReadyResolve = resolve;
        this._stateReadyReject = reject;
    });


};



