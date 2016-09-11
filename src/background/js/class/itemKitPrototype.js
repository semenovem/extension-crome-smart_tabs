/**
 * @type {object} прототип @class ItemKit
 */
app.ItemKit.prototype = {

    /**
     * задержка перед сохранением состояния
     */
    _timeoutSave: 1000,


    /**
     * Поля объекта
     * @type {object}
     */
    fields: [
        {   // id окна браузера в системе
            name: 'id',
            type: 'number',
            persist: false,
            requireForCreate: true  // обязательность при создании новой записи
            // requireForRaw: true  // обязательность при создании объекта для сохранения
        },

        {   // ссылка на объект, отвечающий за сохранение
            name: 'recordId',
            type: 'string',
            persist: false
        },

        {   // номер активной вкладки
            name: 'tabActiv',
            type: 'number',
            default: 0
        },

        {   // есть ли необходимость сохранить данные
            name: 'modify',
            type: 'boolean',
            persist: false,
            default: false
        },

        {   // время последнего изменения в объекте
            name: 'modifyLastTime',
            type: 'number',
            persist: false,
            default: 0
        },


        {   // окно активно
            name: 'active',
            type: 'boolean',
            default: false
        },

        {   // свернутое состояние окна браузера
            name: 'minimized',
            type: 'boolean',
            default: false
        },
        // размеры окна
        {
            name: 'width',
            type: 'number',
            default: 0
        },
        {
            name: 'height',
            type: 'number',
            default: 0
        },

        // позиция на рабочем столе
        {
            name: 'posX',
            type: 'number',
            default: 0
        },
        {
            name: 'posY',
            type: 'number',
            default: 0
        },


        // ### на будущее
        {   // название окна, заданное пользователем
            name: 'customName',
            type: 'string',
            persist: false
        },
        {   // описание окна, заданное пользователем
            name: 'customTitle',
            type: 'string',
            persist: false
        },


        // ### Вкладки
        {   // список
            name: 'tabs',
            isArray: true,
            special: true
        },
        {   // сохранять состояние закрытых вкладок
            name: 'tabClosed',
            type: 'boolean',
            default: true
        },
        {   // сохранять историю url
            name: 'tabHistory',
            type: 'boolean',
            default: false
        }
    ],


    // ################################################
    // валидация, экспорт/импорт
    // ################################################

    /**
     * Валидация при создании
     * @param {object} raw
     * @returns {boolean}
     */
    validateToCreate(raw) {
        return raw && typeof raw === 'object'
            && this.validateTypeFields(raw)
            && this.fields
                .filter(field => field.requireForCreate === true)
                .every(field => field.name in raw);
    },

    /**
     * Обязательные поля для исходного объекта, из которого создается экземпляр
     * Восстановление из сохраненного состояния
     * @param {object} raw
     * @returns {boolean}
     */
    validateAfterRestore(raw) {
        return raw && typeof raw === 'object'
            && this.validateTypeFields(raw)
            && this.fields
                .filter(field => field.requireForRaw === true)
                .every(field => raw[field.name]);
    },

    /**
     * Проверка типов полей
     * @param {object} raw
     * @returns {boolean}
     */
    validateTypeFields(raw) {
        return this.fields
            .filter(field => 'type' in field && field.name in raw)
            .every(field => field.type === typeof raw[field.name]);
    },

    /**
     * Формирует данные для сохранения
     * Готовый объект содержит:
     * - обязательные поля при сериализации
     * - поля, значения которых отличаются от default
     * @returns {object}
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
    // операции с данными
    // ################################################

    /**
     * добавить вкладку
     * @param tab
     */
    addTab(tab) {
        if (!this.hasTabById(tab.id)) {
            this.tabs.push(tab);
            tab.setKit(this);
            this.setModify(true);
        }
        return this;
    },

    /**
     * убрать вкладку из окна
     * @param tab
     */
    removeTab(tab) {
        this.setModify(true);
        console.log('remove tab', tab);
        return this;
    },

    /**
     * проверка наличия вкладки
     * @param {object} tab объект вкладки - экземпляр @class ItemKit
     * @returns {boolean}
     */
    hasTab(tab) {
        return this.tabs.indexOf(tab) !== -1;
    },

    /**
     * проверка наличия вкладки
     * @param id
     * @returns {boolean}
     */
    hasTabById(id) {
        return this.tabs.some(tab => tab.id === id);
    },



    // ################################################
    // модификация объекта
    // ################################################

    /**
     * Произошли изменения в данных, если true - нужно их сохранить
     * @param {boolean} modify
     * @returns {object}
     */
    setModify(modify) {
        this.modifyLastTime = Date.now();
        if (!this.modify && (this.modify = modify)) {
            this._timeoutBeforeSave(this._timeoutSave);
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
            let timeout = this._timeoutSave,
                diff = Date.now() - this.modifyLastTime;
            diff < timeout ? this._timeoutBeforeSave(timeout - diff) : this.saveModify();
        }, timeout);
    },

    /**
     * Сохранить изменения
     */
    saveModify() {
        this.modify = false;

        if (this.recordId) {
            this.store.saveRawOpen(this.getRaw(), this.recordId);
        }
        else {
            this.store.mapping(this)
                .then(recordId => {
                    this.recordId = recordId || (this.setModify(true) && ('kit_open_' + this.id));
                })
                .then(() => this._stateReadyResolve())
                .catch(e => this._stateReadyReject(e))
                .then(() => {
                    delete this._stateReadyResolve;
                    delete this._stateReadyReject;
                });
        }
    },

    /**
     * getter
     * @return {Promise} промис готовности - найден или создан объект в store для сохранения
     */
    getStateReady() {
        return this._stateReady;
    }


};
