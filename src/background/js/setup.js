/**
 * Настройки
 */
app.setup = {
    // <debug>
    $className: 'Setup',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Показывает, что данные были изменены и необходимо сохранение
     */
    _isModify: false,

    /**
     * Подготовка настроек. Получить данные из store
     * @return {Promise}
     */
    prep() {
        return this._app.storeSetup.get()
            .then(data => this._data = data);
    },

    /**
     * Получение значения
     * @param {string} propName
     */
    get(propName) {
        let result = this._app.util.getDeepProp(propName, this._data);
        if (result.exist) {
            return result.value;
        }
        result = this._app.util.getDeepProp(propName, this._default);

        if (result.exist) {
            return result.value;
        }
        // todo зафиксировать, что не смогли найти запрошенное свойство
       // return name in this._data ? this._data[name] : this._default[name];
    },

    /**
     * Изменение значения
     * @param {string} name
     * @param {*} value
     */
    set(name, value) {
        // сделать запись во вложенные объекты типа 'prop.ext.one'
        this._data[name] = value;
        this._change.push({
            name: name,
            value: value
        });
        this._isModify = true;
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
    _default: {
        /**
         * ожидания
         */
        timeout: {

            /**
             * @type {object} приложение
             */
            app: {
                /**
                 *  // todo для релиза поставить 1000 - 5000
                 * @type {number} задержка запуска приложения
                 */
                launch: 1000
            },

            /**
             * @type {object} окно
             */
            kit: {
                beforeSave: 1000
            },

            /**
             * @type {object} вкладка
             */
            tab: {
                onCreate: 100
            }
        },







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
        saveError: false,

        global: {

            kit: {
                // закрытые вкладки сохраняются.
                history: true
            },

            tab: {
                // история
                history: true
            }

        },

        kit: {
            track: false,       // отслеживать. есть хоть у одной вкладки есть track:true

            tabHistory: false   // сохранять историю
        },

        tab: {
            track: true,        // отслеживать url
            history: true       // сохранять историю
        }

    }
};


