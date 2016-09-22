/**
 * @type {object} прототип @class KitItem
 */
app.KitItem.prototype = {

    /**
     * @type {number|null} задержка перед сохранением состояния
     */
    _TIMEOUT_BEFORE_SAVE: null,


    /**
     * Поля объекта
     * @type {object}
     */
    fields: [
        {   // id окна браузера в системе
            name: 'id',
            type: 'number',
            persist: false,
            requireNew: true,       // обязательно для создания нового экземпляра
            requireSaving: false,   // обязательно для сохраненного состояния
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


        {   // свернутое состояние окна браузера
            name: 'minimized',
            type: 'boolean',
            default: false,
            conjunction: true,
            normalize(val) {
                return typeof val === 'boolean' ? val : Boolean(val);
            }
        },
        // размеры окна
        {
            name: 'width',
            type: 'number',
            default: 0,
            toOpen: true,
            normalize(val) {
                val = +val;
                return isFinite(val) && val >= 0 ? val : 0;
            }
        },
        {
            name: 'height',
            type: 'number',
            default: 0,
            toOpen: true,
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
            toOpen: true,
            normalize(val) {
                val = +val;
                return isFinite(val) && val >= 0 ? val : 0;
            }
        },
        {
            name: 'top',
            type: 'number',
            default: 0,
            toOpen: true,
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
        let raw = this.fields.reduce((raw, field) => {
            let name = field.name;
            if (field.special !== true && field.persist !== false && field.default !== this[name]) {
                raw[name] = this[name];
            }
            return raw;
        }, Object.create(null));
        raw.tabs = this.tabs.map(tab => tab.getRaw());
        return raw;
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
     * запуск таймаута перед сохранением изменений
     * @param {number} timeout
     * @private
     */
    _timeoutBeforeSave(timeout) {
        setTimeout(() => {
            const timeout = this._TIMEOUT_BEFORE_SAVE;
            const diff = Date.now() - this.modifyLastTime;
            diff < timeout && diff > 50 ? this._timeoutBeforeSave(timeout - diff) : this.save();
        }, timeout);
    },

    /**
     * Сохранить изменения
     */
    save() {
        // перед сохранением - синхронизировать вкладки
        //this._app.browserApi.kit(this.id)
        //    .then(re => {
        //        console.log ('log', re);
        //    });

        this._app.controllerSynx.kit(this.id);

        this._app.controllerMapping.record(this);

        this._conditionResolve();

        //if (this._record) {
        //    // провести синхронизацию окна перед сохранением
        //    console.log (2131234)
        //    this._record.save();
        //    this.isModify = false;
        //} else {
        //    this._store.mapping(this)
        //        .then(record => {
        //
        //            this.setRecord(record);
        //            this.isModify = false;
        //        })
        //        .catch(this._stateReject);
        //}
    },



    /**
     * getter
     * @return {Promise} промис готовности - найден или создан объект в store для сохранения
     */
    getCondition() {
        return this._condition;
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
     * @param record
     * @return {object} @class app.KitItem
     */
    setRecord(record) {
        this._record = record;
        this._conditionResolve();
        delete this._conditionResolve;
        delete this._conditionReject;

        record.getKit() !== this && record.set(this);
        return this;
    }
};
