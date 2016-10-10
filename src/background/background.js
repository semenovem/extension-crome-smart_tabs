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

    // <debug>

    /**
     * @type {function} @class Ready состояние готовности
     */
    ready: null,

    /**
     * Проверка совместимости
     * @type {function}
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
     * @file js/sync.js
     */
    sync: null,

    /**
     * @type {object} создание окон и вкладок
     * @file js/create.js
     */
    create: null,

    /**
     * @type {object} сопоставление вкладок сохраненного окна с реально открытым
     * @file js/mapping.js
     */
    mapping: null,

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
     * Cостояние активности системы
     * @file js/systemIdle.js
     */
    systemIdle: null,

    // </debug>



    /**
     * Дочерним объектам устанавливаем ссылку на объект приложения
     * Если есть метод init - синхронно выполняем
     * После выполнения удаляем init
     *
     * @param {object} app объект, устанавливаемый в качестве объекта приложения
     * @private
     */
    executionInits(app) {
        let key, obj;
        for (key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            obj = this[key];

            if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
                continue;
            }

            //
            if (key === '_app') {
                continue;
            }

            obj._app = app;

            if (typeof obj.init === 'function') {
                obj.init.call(obj);
                delete obj.init;
            }
        }
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
            setTimeout(resolve, this.setup.get('app.launch.timeout'));
        });
    },

    /**
     * Инициализация
     */
    init() {
        // поверка совместимости
        if (!this.compatibility()) {
            return;
        }

        this.ready = this.Ready();
        this.executionInits(this);                  // инициализация

        Promise.resolve()
            .then(this.setup.prep)                  // получение настроек
            .then(this._timeout.bind(this))
            .then(this.ready.resolve)
            .then(() => {
                this.controllerEvent.add();
                this.controllerMessageBlank.add();
                this.controllerMessagePopup.add();
            })
            .then(this.sync.all)
            .then(this.create.saved)

            .then(
                () => {
                    console.log('\n-----------------------------------\n\n');
                    console.log('(heap):  ', this.storeOpen._heap);
                    console.log('(kits):  ', this.kitCollect._items);
                    console.log('(tabs):  ', this.tabCollect._items);
                    console.log('\n-----------------------------------\n');
                }
            )
            .then(() => {

                //       this.init = null;
                //       this.binding = null;
                //       this._timeout = null;
                //       this.executionInits = null;

                //function randomInteger(min, max) {
                //    var rand = min - 0.5 + Math.random() * (max - min + 1)
                //    rand = Math.round(rand);
                //    return rand;
                //}

                //window.chrome.tabs.query({}, tabs => {
                //
                //    let num = 0;
                //    const length = tabs.length - 1;
                //
                //    setInterval(() => {
                //
                //        window.chrome.tabs.update(
                //            tabs[randomInteger(0, length)].id,
                //            {
                //                active: true
                //            }
                //        )
                //    }, 500);
                //})

            })

            .catch(e => {
                this.log({
                    e: e,
                    name: 'Не смогли стартовать приложение'
                });
                //       this.quit();
            });
    }
};

setTimeout(app.init.bind(app), 1);
