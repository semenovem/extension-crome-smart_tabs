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

    /**
     * @type {object} @class Condition состояние готовности
     */
    _condition: null,

    // </debug>

    /**
     * Показывает, что данные были изменены и необходимо сохранение
     */
    _isModify: false,

    /**
     *
     */
    init() {
        this._app.binding(this);
    },

    /**
     * Подготовка настроек. Получить данные из store
     * @return {Promise}
     */
    prep() {
        return this._app.storeSetup.get()
            .then(data => {
                this._data = data;
                this._getCondition().resolve();
            })
    },

    /**
     * Получение объекта состояния готовновности
     * Поскольку к настройкам обращаются другие объекты,
     * только так можем гарантированно создать объект состояния до первого его использования
     * @return {object}
     * @private
     */
    _getCondition() {
        return this._condition || (this._condition = new this._app.Condition);
    },

    /**
     * Получение значения. Синхронно
     * @param {string} propName
     * @return {*}
     */
    getSynx(propName) {
        let result = this._app.util.getDeepProp(propName, this._data);
        if (result.exist) {
            return result.value;
        }
        result = this._app.util.getDeepProp(propName, this._default);

        if (result.exist) {
            return result.value;
        }
        this._app.log({
            e: new Error,
            name: 'не смогли найти запрошенное свойство: ' + propName
        });
    },

    /**
     * Получение значения. Асинхронно
     * @param {string} propName
     * @return {Promise|*}
     */
    get(propName) {
        return this._getCondition().get().then(() => this.getSynx(propName));
    },


    /**
     * Изменение значения. Асинхронно
     * @param {string} name
     * @param {*} value
     */
    set(name, value) {
        // сделать запись во вложенные объекты типа 'prop.ext.one'
        // todo сделать асинхронную запись
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
                launch: 1
            },

            /**
             * @type {object} окно
             */
            kit: {
                beforeSave: 2000,

                /**
                 * Через сколько начать искать соответствие в store
                 */
                beforeMapping: 200
            },

            /**
             * @type {object} вкладка
             */
            tab: {
                onCreate: 100
            },

            /**
             * @type {object} браузерное api
             */
            browserApi: {
                /**
                 * @type {number} таймаут, после которого запрос к api браузера считается зависшим
                 */
                hung: 3000

            }
        },


        // todo описать данные
        store: {
            /**
             * Хранение открытых окон
             */
            open: {
                // префикс при сохранениях в localStorage
                prefix: 'kit_open_'
            },
            /**
             * @type {object} хранение недавно закрытых окон
             */
            recent: {
                // префикс при сохранениях в localStorage
                prefix: 'kit_recent_'
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

            // максимальное длинна истории

        }

    }
};


