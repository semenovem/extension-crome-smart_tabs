/**
 * @type {object} прототип @class KitItem
 */
app.kitItemPrototype = app.KitItem.prototype = {
    // <debug>
    /**
     * @type {object} объект приложения
     */
    _app: null,

    /**
     * @type {number} задержка перед сохранением состояния
     */
    _TIMEOUT_BEFORE_SAVE: 0,

    /**
     * @type {number} задержка перед поиском соответствия в store
     */
    _TIMEOUT_BEFORE_MAPPING: 0,

    /**
     * Произошли изменения в данных
     * Метод добавляется к экземпляру класса Modify при создании
     * @method modify
     * @type {function}
     */
    // </debug>

    /**
     * Поля объекта
     * @type {object}
     */
    fields: [
        {   // id окна браузера в системе
            name: 'id',
            type: 'number',
            persist: false,
            requireEvent: true,     // обязательное для объекта события
            requireStored: false,   // обязательное для сохраненных данных
            requireCreate: true,    // обязательное для создания экземпляра
            normalize(val) {
                val = +val;
                return isFinite(val) && val > 0 ? val : 0;
            }
        },

        {   // есть ли необходимость сохранить данные
            name: 'isModify',
            type: 'boolean',
            persist: false,
            default: false,
            normalize(val) {
                return typeof val === 'boolean' ? val : Boolean(val);
            }
        },

        {   // время последнего изменения в объекте
            name: 'modifyLastTime',
            type: 'number',
            persist: false,
            default: 0,
            normalize(val) {
                val = +val;
                return isFinite(val) && val >= 0 ? val : 0;
            }
        },

        // свернутое состояние окна браузера
        // "fullscreen" "minimized" "maximized" "normal"
        {
            name: 'state',
            type: 'string',
            default: 'normal',
            state: true,
            options: [
                'fullscreen',
                'minimized',
                'maximized',
                'normal'
            ],
            normalize(val) {
                return typeof val === 'string' && this.options.indexOf(val) !== -1 ? val : this.default;
            }
        },
        // размеры окна
        {
            name: 'width',
            type: 'number',
            default: 0,
            state: true,
            normalize(val) {
                val = +val;
                return isFinite(val) && val >= 0 ? val : 0;
            }
        },
        {
            name: 'height',
            type: 'number',
            default: 0,
            state: true,
            normalize(val) {
                val = +val;
                return isFinite(val) && val >= 0 ? val : 0;
            }
        },

        // позиция на рабочем столе
        {
            name: 'left',
            type: 'number',
            default: 0,
            state: true,
            normalize(val) {
                val = +val;
                return isFinite(val) && val >= 0 ? val : 0;
            }
        },
        {
            name: 'top',
            type: 'number',
            default: 0,
            state: true,
            normalize(val) {
                val = +val;
                return isFinite(val) && val >= 0 ? val : 0;
            }
        },

        // ### на будущее
        {   // название окна, заданное пользователем
            name: 'customName',
            type: 'string',
            persist: false,
            conjunction: true,
            demo: true,
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        },
        {   // описание окна, заданное пользователем
            name: 'customTitle',
            type: 'string',
            persist: false,
            conjunction: true,
            demo: true,
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        },

        {   // номер активной вкладки
            name: 'tabActive',
            type: 'number',
            default: 0,
            conjunction: true,
            demo: true,
            normalize(val) {
                val = +val;
                return isFinite(val) && val >= 0 ? val : 0;
            }
        },

        {   // сохранять состояние закрытых вкладок
            name: 'tabClosed',
            type: 'boolean',
            default: true,
            conjunction: true,
            demo: true,
            normalize(val) {
                return typeof val === 'boolean' ? val : Boolean(val);
            }
        },
        {   // сохранять историю url
            name: 'tabHistory',
            type: 'boolean',
            default: false,
            conjunction: true,
            demo: true,
            normalize(val) {
                return typeof val === 'boolean' ? val : Boolean(val);
            }
        }
    ],

    /**
     * Доставить настройки
     */
    init() {
        this._app.setup.get('timeout.kit.beforeSave').then(value => this._TIMEOUT_BEFORE_SAVE = value);
        this._app.setup.get('timeout.kit.beforeMapping').then(value => this._TIMEOUT_BEFORE_MAPPING = value);
    },

    /**
     * Начало работы объекта модели окна
     */
    prep() {
        this._timerBeforeMapping = setTimeout(() => {
            if (this.ready.is) {
                return;
            }
            if (Date.now() - this.modify.timeCall > this._TIMEOUT_BEFORE_MAPPING) {
                this._app.controllerMapping.record(this);
            } else {
                this.prep();
            }
        }, this._TIMEOUT_BEFORE_MAPPING);
    },

    /**
     * Вернуть id записи
     * @return {string}
     */
    getId() {
        return this.id;
    },

    // ################################################
    // экспорт/импорт
    // ################################################

    /**
     * Формирует данные для сохранения
     * Готовый объект содержит:
     * - обязательные поля при сериализации
     * - поля, значения которых отличаются от default
     * @return {object}
     */
    getRaw() {
        return this.fields.reduce((raw, field) => {
            let name = field.name;
            if (field.persist !== false && field.default !== this[name]) {
                raw[name] = this[name];
            }
            return raw;
        }, Object.create(null));
    },

    // ################################################
    // модификация объекта
    // ################################################

    /**
     * Сохранить
     * @return {Promise<> | boolean}
     */
    _savePrep() {
        return this.ready()
            .then(d => { console.log (666,this); return d; })
            .then(this._app.controllerSync.kit)
            .then(this.save.bind(this))
            .catch(e => console.warn ('Не удалось сохранить данные окна') && console.log (e) );
    },

    /**
     * Сохранение
     * @param {Array} tabs массив вкладок окна
     * @return {Promise<>}
     */
    save(tabs) {
        const raw = this.getRaw();
        raw.tabs = tabs.map(tab => tab.getRaw());
        this.modify.clear();
        return this._app.storeOpen.save(this._itemKey, raw);
    },



    /**
     * setter
     * @param {string} itemKey
     */
    setItemKey(itemKey) {
        this._itemKey = itemKey;
        this.ready.resolve(this);
    },

    /**
     * Обновление состояния модели
     * @param {object} state
     * @return {boolean} произошли ли изменения в данных
     */
    setState(state) {
        let change = false;
        this.fields
            .filter(field => field.state && field.name in state)
            .forEach(field => {
                const name = field.name;
                if (this[name] !== state[name]) {
                    change = true;
                    this[name] = state[name];
                }
            });
        return change;
    },

    /**
     * Добавление в объект сохраненных данных
     * @param {object} source
     */
    conjunction(source) {
        this.fields
            .filter(field => field.conjunction && field.name in source)
            .forEach(field => {
                const name = field.name;
                this[name] = source[name];
            });
    },

    /**
     * Закрытие окна браузера
     */
    close() {
        console.log('event close window');
        this.modify.destroy();

        clearTimeout(this._timerBeforeMapping);

        this._app.kitCollect.removeItem(this.id);
        if (this._itemKey) {
            this._app.storeOpen.moveToRecent(this._itemKey);
        }
    }

};
