/**
 * @type {object}
 */
const app = {

    /**
     * @type {string} режим работы
     */
    _mode: 'main',

    /**
     * @type {Object} Компонент навигации nav
     */
    _cmpNav: null,

    /**
     * @type {Object} Компонент режима "основной" mode-main
     */
    _cmpModeMain: null,

    /**
     * @type {Object} Компонент режима настроек mode-setup
     */
    _cmpModeSetup: null,

    /**
     *
     */
    _kitId: 0,

    /**
     * Получить id окна
     * @return {number}
     */
    getKitId() {
        return this._kitId;
    },

    /**
     * @type {object} модель текущего окна (это данные: название окна, нужно ли сохранять историю вкладок и т.д.)
     * Эти данные передает расширение (страница background)
     */
    _model: null,

    /**
     * точка старта
     * создание компонента навигации
     * получение kitId для текущего окна
     *
     * создание компонетов на странице
     *
     *
     */
    init() {
        this.msg = Message('popup');
        this.binding(this, this);       // указать контекст функциям из списка

        this.browserApi.windows.getCurrent()
            .then(info => {
                this._kitId = info.id;

                // навигация
                this._cmpNav = this.createCmp('nav', {
                    setMode: this.setMode,
                    getMode: this.getMode
                });

                // основной режим
                this._cmpModeMain = this.createCmp('mode-main', {
                    elRoot: document.querySelector('body')
                });

            })
            .catch(e => console.warn(e, 'popup init error. Не прошла инициализация'));
    },

    /**
     * Установлен новый режим
     * @param {string} mode
     */
    setMode(mode) {
        if (this._mode === mode) {
            return;
        }

        // скрыть текущий
        switch (this._mode) {
            case 'main':
                this._cmpModeMain.hide();
                break;
            case 'setup':

                break;
        }

        // показать новый
        switch (mode) {
            case 'main':
                this._cmpModeMain.show();
                break;
            case 'setup':

                break;
        }

        this._mode = mode;
    },

    /**
     * Получить режим
     * @return {string}
     */
    getMode() {
        return this._mode;
    },

    /**
     * Биндинг методов объекта
     * @param {object} obj объект, методам которого биндим контекст
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
     * Обмен данными с page background
     * @type {object}
     */
    msg: null,

    /**
     * helpers
     * @type {object}
     */
    util: null,

    /**
     * @type {object} список компонентов
     */
    _cmps: {},

    /**
     * Добавление компонента
     * @param {string} name название компонента
     * @param {object} cmp
     * @return {undefined}
     */
    addCmp(name, cmp) {
        // <debug>
        cmp['$cmpName'] = name;
        // </debug>
        this._cmps[name] = cmp;
        cmp._app = this;
    },

    /**
     * Создание компонента
     * @param {String} name название
     * @param {*} args аргументы, передаваемые компоненту
     * @return {Object}
     */
    createCmp(name, ...args) {
        const cmp = this._cmps[name];
        return cmp.createInstance.apply(cmp, args);
    }

};

window.addEventListener('DOMContentLoaded', app.init.bind(app));
