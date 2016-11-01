/**
 * Сохранение данных
 */
app.storeSetup = {
    // <debug>
    $className: 'StoreSetup',

    /**
     * @type {object} the application object
     */
    _app: null,
    // </debug>

    init() {
        this._app.binding(this);
    },

    /**
     * Чтение данных
     * @return {Promise} данные
     */
    get() {
        return new Promise((resolve, reject) => {
            var data = Object.create(null);

            // заглушка
            if (data) {
                resolve(data);
            } else {
                reject(false);
            }
        });
    },

    /**
     * Сохранить данные
     * @return {Promise}
     */
    set() {
        return new Promise((resolve, reject) => {
            var data = Object.create(null);

            // заглушка
            if (data) {
                resolve(data);
            } else {
                reject();
            }
        });
    }
};