/**
 * @type {object} прототип @class TabItem
 */
app.TabItem.prototype = {


    /**
     * поля объекта
     * @type {object}
     */
    fields: [

        {
            name: 'id',
            type: 'number',
            persist: false,
            requireNew: true,
            normalize(val) {
                val = +val;
                return isFinite(val) && val > 0 ? val : 0;
            }
        },

        {   // вкладка закрыта
            name: 'closed',
            type: 'boolean',
            default: false,
            conjunction: true,
            normalize(val) {
                return typeof val === 'boolean' ? val : Boolean(val);
            }
        },


        {   // сохранение истории
            name: 'history',
            type: 'boolean',
            default: false,
            conjunction: true,
            normalize(val) {
                return typeof val === 'boolean' ? val : Boolean(val);
            }
        },


        {   // адрес
            name: 'url',
            type: 'string',
            requireNew: true,
            requireSaving: true,
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        },
        {   //
            name: 'title',
            type: 'string',
            default: '',
            persist: false,
            conjunction: true,
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        },
        {   // фавикон
            name: 'favIconUrl',
            type: 'string',
            default: '',
            persist: false,
            conjunction: true,
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        }
    ],




    // ################################################
    // валидация, экспорт/импорт
    // ################################################

    ///**
    // * Валидация при создании
    // * @param {object} raw
    // * @returns {boolean}
    // */
    //validateToCreate(raw) {
    //    return raw && typeof raw === 'object'
    //        && this.validateTypeFields(raw)
    //        && this.fields
    //            .filter(field => field.requireForCreate === true)
    //            .every(field => field.name in raw);
    //},
    //
    //
    ///**
    // * Проверка типов полей
    // * @param {object} raw
    // * @returns {boolean}
    // */
    //validateTypeFields(raw) {
    //    return this.fields
    //        .filter(field => 'type' in field && field.name in raw)
    //        .every(field => field.type === typeof raw[field.name]);
    //},
    //
    ///**
    // * Приведение полей в соответствие с типом
    // * @param {object} obj объект, у которого изменяем поля
    // */
    //normalize(obj) {
    //    obj && typeof obj === 'object' && this.fields
    //        .filter(field => field.name in obj && typeof field.normalize === 'function')
    //        .forEach(field => {
    //            const name = field.name;
    //            obj[name] = field.normalize(obj[name]);
    //        });
    //    return obj;
    //},

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


    // объединение (добавление) свойств к объекту
    conjunction(target, source) {
        target = Object.assign(target);
        this.fields
            .filter(field => field.conjunction && field.name in source)
            .forEach(field => {
                const name = field.name;
                target[name] = source[name];
            });
        return target;
    },




    // ################################################
    // операции с данными
    // ################################################


    /**
     * Присвоили окно
     * @param kit
     */
    setKit(kit) {
        if (this.kit !== kit) {
            if (this.kit) {
                this.modify();  // для предыдущего окна информация об изменениях
            }
            this.kit = kit;
            this.modify();
        }
    },

    /**
     * Вкладка закрыта
     */
    close() {
        if (!this.closed) {
            this.closed = true;
            this.modify();
        }
    },

    /**
     * Произошло изменение объекта
     */
    modify() {
        this.kit.modify();
    }




};
