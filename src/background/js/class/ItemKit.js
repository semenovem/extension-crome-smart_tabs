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
     *
     * @class app.Store
     * @type {object}
     */
    this.store = store;

    /**
     * получение полей из модели, которые должны быть у экземпляра
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

    // todo тестовая задержка
    //    setTimeout(this.setModify.bind(this, true), 800 + 190 * Math.random());

};



