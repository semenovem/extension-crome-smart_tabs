/**
 * Сохранение данных
 */
app.store = {
    // <debug>
    $className: 'Store',

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
        this.open.init(this._app, this);
    },


    // ################################################
    // Настройки
    // ################################################

    /**
     * чтение настроек
     */
    readSetup() {
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
     *
     * @return {Promise}
     */
    saveSetup() {
        let allow = this._app.setup.get('setupUseLocalStorage');

        return new Promise((resolve, reject) => {
            var data = Object.create(null);

            // заглушка
            if (data) {
                resolve(data);
            } else {
                reject(allow);
            }
        });
    },



    // ################################################
    // Конвертация данных
    // ################################################


    /**
     * Получить данные в виде строки для сохранения
     * @returns {string|null}
     */
    serialization(raw) {
        let text;
        try {
            text = JSON.stringify(raw);
        }
        catch (e) {
            text = null;
            this._app.log.error({
                name: 'Не удалось преобразовать в json',
                code: 0,
                event: e
            });
        }
        return text;
    },

    /**
     * Получить данные в виде строки для сохранения
     * @returns {string|null}
     */
    unserialization(text) {
        let raw;
        try {
            raw = JSON.parse(text);
            if (!this._app.ItemKit.prototype.validateAfterRestore(raw)) {
                throw 'объект не проходит валидацию';
            }
        }
        catch (e) {
            this._app.log.error({
                name: '',
                code: 0,
                event: e,
                deb: raw
            });
            raw = null;
        }
        return raw;
    },





    // ################################################
    // Поиск / создание record + kit
    // ################################################

    /**
     * Поиск в сохраненных данных набора вкладок - как у объекта окна kit
     * @param {object} kit
     * @returns {Promise<number|null>}
     */
    mapping(kit) {
        return this.open.mapping(kit)
            .then(record => {
                return record || this.open.create(kit);
            })
    },




};