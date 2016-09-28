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

        {   // ссылка на объект, отвечающий за сохранение
            name: '_record',
            type: 'object',
            persist: false
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
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        },
        {   // описание окна, заданное пользователем
            name: 'customTitle',
            type: 'string',
            persist: false,
            conjunction: true,
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        },

        {   // номер активной вкладки
            name: 'tabActive',
            type: 'number',
            default: 0,
            conjunction: true,
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
            normalize(val) {
                return typeof val === 'boolean' ? val : Boolean(val);
            }
        },
        {   // сохранять историю url
            name: 'tabHistory',
            type: 'boolean',
            default: false,
            conjunction: true,
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
            // состояние уже было установлено (установили record)
            if (this._record) {
                return;
            }

            if (Date.now() - this.modifyLastTime > this._TIMEOUT_BEFORE_MAPPING) {
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
     * Произошли изменения в данных, если true - нужно их сохранить
     * @return {object}
     */
    modify() {
        this.modifyLastTime = Date.now();
        if (!this.isModify) {
            this.isModify = true;
            this._timeoutBeforeSave(this._TIMEOUT_BEFORE_SAVE);
        }
        return this;
    },

    /**
     * Сбросить флага изменения
     */
    clearModify() {
        if (this.isModify) {
            this.isModify = false;
            clearTimeout(this._timerBeforeSave);
        }
    },

    /**
     * Запуск таймаута перед сохранением изменений
     * @param {number} timeout
     * @private
     */
    _timeoutBeforeSave(timeout) {
        this._timerBeforeSave = setTimeout(() => {
            const timeout = this._TIMEOUT_BEFORE_SAVE;
            const diff = Date.now() - this.modifyLastTime;
            diff < timeout && diff > 50 ? this._timeoutBeforeSave(timeout - diff) : this.save();
        }, timeout);
    },

    /**
     * Сохранить
     * @return {Promise<> | boolean}
     */
    save() {
        // todo подумать что бы биндить методы при создании экземпляра
        return this._condition.get()
                .then(this.synx.bind(this))
                .then(this._record.save.bind(this._record));
    },

    /**
     * Синхронизация объекта с открытыми окнами
     * @return {Promise<tabs>} промис возвращает массив вкладок этого окна
     */
    synx() {
        return this._app.controllerSynx.kit(this);
    },

    /**
     * getter
     * @return {Promise} промис готовности - найден или создан объект в store для сохранения
     */
    getCondition() {
        return this._condition.get();
    },

    /**
     * getter
     * @return {object|void}
     */
    getRecord() {
        return this._record;
    },

    /**
     * setter
     * @param {object} record @class Record
     * @return {object} @class app.KitItem
     */
    setRecord(record) {
        this._record = record;

        this.conjunction(record.getStoredKit());

        if (record.getKit() !== this) {
            record.setKit(this);
        }
        this._condition.resolve();
        return this;
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
     * @return {object}
     */
    conjunction(source) {
        this.fields
            .filter(field => field.conjunction && field.name in source)
            .forEach(field => {
                const name = field.name;
                this[name] = source[name];
            });
        return this;
    },

    /**
     * Закрытие окна браузера
     */
    close() {
        console.log('event close window');

        clearTimeout(this._timerBeforeSave);
        clearTimeout(this._timerBeforeMapping);

        this._app.kitCollect.removeItem(this.id);
        if (this._record) {
            this._record.moveToRecent();
        }
    }

};
