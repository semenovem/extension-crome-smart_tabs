/**
 * @type {object}
 */
const app = {

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
     */
    init() {
        this.msg = Message('popup');
        this.binding(this, this);

        this.browserApi.windows.getCurrent()
            .then(info => {
                this._kitId = info.id;

                // todo для отладки
                document.querySelector('#status').innerHTML = 'info ID: ' + info.id;

                // получение информации по окну
                return this.msg('kit.model.get', {
                    kitId: this._kitId
                });
            })
            .then(model => {
                this._model = model;
            })
            .then(this.executionInits)
            .catch(e => console.warn(e, 'popup init error. Не прошла инициализация'));
    },

    /**
     * Дочерним объектам устанавливаем ссылку на объект приложения
     * Если есть метод init - синхронно выполняем
     * После выполнения удаляем init
     *
     * @param {object} [app] объект, устанавливаемый в качестве объекта приложения
     * @private
     */
    executionInits(app) {
        let key, obj;
        if (!app) {
            app = this;
        }
        for (key in this._cmp) {
            obj = this._cmp[key];
            if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
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
     * Объект для обмена данными с backend
     * @type {object}
     */
    msg: null,

    /**
     * @type {object} список компонентов
     */
    _cmp: Object.create(null),

    /**
     * Добавление компонента
     * @param {string} name название
     * @param {object} obj
     * @return {undefined}
     */
    addCmp(name, obj) {
        // <debug>
        obj['$className'] = name;
        // </debug>
        this._cmp[name] = obj;
    },

    /**
     * Получить данные по модели окна
     * @param {string} prop поле, по которому вернуть содержимое
     * @return {*}
     */
    getPropModel(prop) {
        return this._model[prop];
    },

    /**
     * Установить значение свойству модели
     * @param {string} prop название свойства
     * @param {*} val новое значение
     * @return {object}
     */
    setPropModel(prop, val) {
        this._model[prop] = val;
        return this;
    }

};

window.addEventListener('DOMContentLoaded', app.init.bind(app));
