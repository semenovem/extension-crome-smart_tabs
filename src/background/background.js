/**
 * Объект приложения
 */
var app = {
    // <debug>
    $className: 'App',
    // </debug>

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
     * @file js/class/ItemTab.js
     * @constructor
     */
    ItemTab: null,

    /**
     * Constructor win
     * @file js/class/ItemKit.js
     * @constructor
     */
    ItemKit: null,



    /**
     * Коллекция вкладок
     * @type {object}
     * @file js/collect/collectTabs.js
     */
    collectTabs: null,

    /**
     * Коллекция окон
     * @type {object}
     * @file js/collect/collectKits.js
     */
    collectKits: null,

    /**
     * @type {object} контроллер
     * @file js/controller/main.js
     */
    controller: null,


    /**
     * Хранение данных
     * @type {object}
     * @file js/store.js
     */
    store: null,

    /**
     * Ведение логов, регистрация ошибок
     * @file js/log.js
     */
    log: null,

    // ссылки на глобальные объекты
    // значения в них устанавливаются при проверке на совместимость "compatibility"

    /**
     * api browser chrome
     * creates this property "compatibility"
     */
    chrome: null,

    /**
     * api browser chrome. Manage tabs
     * creates this property "compatibility"
     */
    chromeTabs: null,

    /**
     * Выполенение инициализации (вызов методов init) для всех классов
     * @private
     */
    _executionInit() {
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
    },

    /**
     * Инициализация
     * дочерние объекты:
     * получают свойство _app = this
     * у методов init контекст привязан bind, а после исполнения, его можно удалить
     */
    init() {
        this._executionInit();

        // все init выполнены до этой строчки и удалены из объектов
        this.compatibility.check()
            .then(this.setup.getData.bind(this.setup))
            .then(() => new Promise(resolve => setTimeout(resolve, this.setup.get('timeoutAppLaunch'))))

            .then(this.controller.synxCurrentOpenKits.bind(this.controller))
            .then(this.controller.openSavedKits.bind(this.controller))

            .then(
                () => {
                    console.log('this', this.collectKits._items);
                }
            )
            // подписка на события вкладок
            .then(this.controller.subscribe.bind(this.controller))

            .catch(e => {
                this.log.error({
                    // <debug>
                    name: 'Запуск приложения',
                    note: 'Не смогли стартовать приложение',
                    $className: this.$className,
                    // </debug>
                    code: 0,
                    event: e
                });
                this.closing({
                    type: 'crash'
                });
            });
    }
};

setTimeout(app.init.bind(app), 1);
