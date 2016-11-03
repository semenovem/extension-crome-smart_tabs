/**
 * @type {object}
 */
const app = {

    /**
     * @type Function Обмен данными с page background
     */
    msg: null,

    /**
     * helpers
     * @type {object}
     */
    util: null,



    /**
     * @type Object
     */
    cmp: {},

    /**
     * @type {string} режим работы
     */
    _mode: 'main',

    /**
     * @type app.cmp.Nav компонент навигации
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

    // данные ткущего окна
    _data: null,



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
        this.cmp._app = this;

        this.browserApi.windows.getCurrent()
            .then(info => {
                this._kitId = info.id;

                // навигация
                this._cmpNav = new this.cmp.Nav({
                    setMode: this.setMode,
                    getMode: this.getMode
                });

                this._cmpModeMain = new this.cmp.ModeMain({
                    elRoot: document.querySelector('body')
                }, this);

                // режим настроек

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
     * @param {Object} obj объект, методам которого биндим контекст
     * @param {Object} [scope] контекст
     * @private
     */
    binding(obj, scope) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'function') {
                obj[key] = obj[key].bind(scope || obj);
            }
        }
    },




    // todo перенести в data
    /**
     *
     */
    _kitId: 0,

    /**
     * Получить kitId
     * @return {number}
     */
    getKitId() {
        return this._kitId;
    },

    /**
     * @type Object модель текущего окна (это данные: название окна, нужно ли сохранять историю вкладок и т.д.)
     * Эти данные передает расширение (страница background)
     */
    _model: null,





    // todo удалить после переноса компонентов
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
