/**
 * @type {object} прототип @class ItemTab
 */
app.ItemTab.prototype = {


    /**
     * поля объекта
     * @type {object}
     */
    fields: [

        {
            name: 'id',
            type: 'number',
            persist: false,
            requireForCreate: true
        },

        {   // вкладка закрыта
            name: 'closed',
            type: 'boolean',
            default: false
        },


        {   // сохранение истории
            name: 'history',
            type: 'boolean',
            default: false
        },


        {   // адрес
            name: 'url',
            type: 'string',
            requireForCreate: true,
            requireForRaw: true
        },
        {   //
            name: 'title',
            type: 'string',
            persist: false,
            requireForCreate: true
        },
        {   // фавикон
            name: 'favIconUrl',
            type: 'string',
            persist: false,
            requireForCreate: true
        },


        {   // история адресов, если ведется
            name: 'urlHistory',
            isArray: true,
            special: true
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

        if (Array.isArray(this.urlHistory) && this.urlHistory.length) {
            // todo здесть вставить ограничение по кол-ву записей
            raw.urlHistory = this.urlHistory.slice(0, 100);
            //
        }
        return raw;
    },





    // ################################################
    // операции с данными
    // ################################################


    /**
     * Присвоили окно
     * @param kit
     */
    setKit(kit) {
        this.kit = kit;
    },

    /**
     * Изменение состояния вкладки
     * обратно открыться она может если открывается тот же адрес в новой вкладке
     * или открывается из истории
     * @param {boolean} closed
     */
    setClosed(closed) {
        if (this.closed !== closed) {
            this.modify();
        }
        this.closed = closed;
    },

    /**
     * Произошло изменение объекта
     */
    modify() {
        this.kit && this.kit.modify();
    },

    /**
     * изменение url
     * @param url
     */
    changedUrl(url) {
        this.url = url;
        this.modify();
    }
};
