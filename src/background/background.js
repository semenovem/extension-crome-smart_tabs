/**
 * Объект приложения
 */
var app = {
    /**
     * название в глобальной области видимости
     * @type {string}
     */
    globalName: 'app',

    /**
     * Проверка совместимости
     * @type {object}
     * @file js/compatibility.js
     */
    compatibility: null,

    /**
     * Настройки
     * @type {object}
     * @file js/setup.js
     */
    setup: null,

    /**
     * Constructor for tab
     * @file js/tab/Item.js
     * @constructor
     */
    TabItem: null,

    /**
     * Constructor win
     * @file js/kit/Item.js
     * @constructor
     */
    KitItem: null,

    /**
     * Коллекция вкладок
     * @type {object}
     * @file js/tab/collect.js
     */
    tabCollect: null,

    /**
     * Коллекция окон
     * @type {object}
     * @file js/kit/collect.js
     */
    kitCollect: null,




    /**
     * @type {object} контроллер событий окон и вкладок
     * @file js/controller/event.js
     */
    controllerEvent: null,

    /**
     * @type {object} cинхронизация состояний окон и сохраненных данных
     * @file js/controller/synx.js
     */
    controllerSynx: null,

    /**
     * @type {object} контроллер программного открытия окон и вкладок
     * @file js/controller/open.js
     */
    controllerOpen: null,

    /**
     * @type {object} контроллер программного открытия окон и вкладок
     * @file js/controller/open.js
     */
    controllerMapping: null,




    /**
     * Хранение настроек приложения
     * @type {object}
     * @file js/store/setup.js
     */
    storeSetup: null,

    /**
     * Хранение данных открытых окон
     * @type {object}
     * @file js/store/open.js
     */
    storeOpen: null,

    /**
     * Хранение данных о недавно закрытых окнах
     * @type {object}
     * @file js/store/open.js
     */
    storeRecent: null,

    /**
     * Ведение логов, регистрация ошибок
     * @file js/log.js
     */
    log: null,

    /**
     * Конвертация данных. todo изменить название - привязать к событиям
     * @file js/log.js
     */
    convert: null,
    // </debug>

    /**
     * Выполенение инициализации (вызов методов init) для всех классов
     * После выполнения - удаляем init
     *
     * у дочерних объектов методы имеют контекст своего объекта
     * @private
     */
    _executionInits() {
        return new Promise(resolve => {
            for (let k in this) {
                if (!this.hasOwnProperty(k) || Array.isArray(this[k])) {
                    continue;
                }
                let obj = this[k];
                if (obj && typeof obj === 'object') {
                    obj._app = this;

                    this._binding(obj);

                    if (typeof obj.init === 'function') {
                        obj.init.call(obj);
                        delete obj.init;
                    }
                }
            }
            resolve();
        });
    },

    /**
     * Биндинг методов объекта
     * @param {object} obj
     * @private
     */
    _binding(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'function') {
                obj[key] = obj[key].bind(obj);
            }
        }
    },

    /**
     * Задержка перед запуском приложения
     * @return {Promise} void
     * @private
     */
    _timeout() {
        return new Promise(resolve => {
            setTimeout(resolve, this.setup.get('timeout.app.launch'));
        });
    },

    /**
     * Инициализация
     */
    init() {
        this._executionInits()
            .then(this.compatibility.check)
            .then(this.setup.prep)
            .then(this._timeout.bind(this))
            .then(this.controllerEvent.add)
            .then(this.controllerSynx.all)
         //   .then(this.controllerOpen.savedKits)

            .then(
                () => {
                    console.log('\n\nthis', this.kitCollect._items);
                }
            )

            .catch(e => {
                this.log({
                    name: 'Не смогли стартовать приложение'
                });
                this.quit();
            });

        delete this.init;
        delete this._binding;
        delete this._timeout;
        delete this._executionInits;
    }
};

setTimeout(app.init.bind(app), 1);
