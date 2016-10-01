/**
 * Сохранение данных
 */
app.storeSetup = {
    // <debug>
    $className: 'StoreSetup',

    /**
     * Объект приложения
     * @type {object}
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
        let allow = this._app.setup.getSync('setupUseLocalStorage');
        return new Promise((resolve, reject) => {
            var data = Object.create(null);

            // заглушка
            if (data) {
                resolve(data);
            } else {
                reject(allow);
            }
        });
    }
};