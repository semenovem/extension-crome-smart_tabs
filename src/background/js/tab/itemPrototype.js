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

    /**
     * Вернуть id записи
     * @return {string}
     */
    getId() {
        return this.id;
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
        if (this.kit !== kit) {
            if (this.kit) {
                this.modify();  // для предыдущего окна информация об изменениях
            }
            this.kit = kit;
            this.modify();
        }
    },
    /**
     * getter
     * @return {object}
     */
    getKit() {
        return this.kit;
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
