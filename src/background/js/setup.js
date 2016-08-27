/**
 * Настройки
 */
app.setup = {
    // <debug>
    $className: 'Setup',
    // </debug>

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,

    /**
     * Показывает, что данные были изменены и необходимо сохранение
     */
    modify: false,

    /**
     * Инициализация объекта
     */
    init() {},

    /**
     * получить данные из store
     * @returns {Promise}
     */
    getData() {
        return this._app.store.readSetup()
            .then(data => this._data = data);
    },

    /**
     * Получение значения
     * @param {string} name
     */
    get(name) {
        return name in this._data ? this._data[name] : this._dataDefault[name];
    },

    /**
     * Изменение значения
     * @param {string} name
     * @param {*} value
     */
    set(name, value) {
        this._data[name] = value;
        this._change.push({
            name: name,
            value: value
        });
        this.modify = true;
    },

    /**
     * Изменные настройки, сохраненные в store
     * @type {object}
     */
    _data: null,

    /**
     * Измененные записи, которые нужно сохранить
     */
    _change: [],

    /**
     * Значения настроек по умолчанию
     * @type {object}
     */
    _dataDefault: {

        /**
         * задержка запуска приложения
         * @type {number}
         */
        timeoutAppLaunch: 1,  // todo для релиза поставить 1000

        /**
         * задержка обработки события создания новой вкладки
         * @type {number}
         */
        timeoutOnTabCreate: 100,

        /**
         * Настройки можно сохранять в localStorage
         * @type{boolean}
         */
        setupUseLocalStorage: true,

        // максимальное кол-во записей в истории

        maxHistoryLength: 20,

        /**
         * Отправлять сообщение о падениях
         * @type {boolean}
         */
        reportCrash: false,

        /**
         * Записывать сообщения об ошибках
         * todo - еще не определился
         * @type {boolean}
         */
        saveError: false

    }
};
