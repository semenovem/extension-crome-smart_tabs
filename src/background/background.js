"use strict";
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
     * @file js/controller/sync.js
     */
    controllerSync: null,

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
     * @param {object} obj ообъект, методам которого биндим контекст
     * @param {object} [scope] контекст
     * @private
     */
    binding(obj, scope) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'function') {
                obj[key] = obj[key].bind(scope || obj);
            }
        }
    },

    /**
     * Задержка перед запуском приложения
     * @return {Promise<void>}
     * @private
     */
    _timeout() {
        return new Promise(resolve => {
            setTimeout(resolve, this.setup.getSync('timeout.app.launch'));
        });
    },

    /**
     * Инициализация
     */
    init() {
        this._executionInits()                      // инициализация
            .then(this.compatibility.bind(this))    // поверка совместимости
            .then(this.setup.prep)                  // получение настроек
            .then(this._timeout.bind(this))
            .then(this.controllerEvent.add)
            .then(this.controllerSync.all)
            .then(this.controllerOpen.saved)
            .then(this.controllerMessage.add)

            .then(
                () => {
                    console.log ('\n-----------------------------------\n\n');
                    console.log('(heap):  ', this.storeOpen._heap);
                    console.log('(kits):  ', this.kitCollect._items);
                    console.log('(tabs):  ', this.tabCollect._items);
                    console.log ('\n-----------------------------------\n');
                }
            )

            .catch(e => {
                this.log({
                    e: e,
                    name: 'Не смогли стартовать приложение'
                });
                this.quit();
            });


        this.init = null;
        this.binding = null;
        this._timeout = null;
        this._executionInits = null;
    }
};

setTimeout(app.init.bind(app), 1);
