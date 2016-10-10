/**
 * @type {object} прототип @class TabItem
 */
app.tabItemPrototype = app.TabItem.prototype = {
    // <debug>
    /**
     * @type {object} объект приложения
     */
    _app: null,
    // </debug>

    /**
     * поля объекта
     * @type {object}
     */
    fields: [

        {
            name: 'id',
            type: 'number',
            persist: false,
            requireCreate: true,
            requireEvent: true,
            normalize(val) {
                val = +val;
                return isFinite(val) && val > 0 ? val : 0;
            }
        },
        {   // id окна, которому принадлежит вкладка
            name: 'kitId',
            type: 'number',
            persist: false,
            requireEvent: true,
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
            demo: true,
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

        {   // состояние вкладки - может быть выгружена из памяти
            name: 'discarded',
            type: 'boolean',
            persist: false,
            default: false,
            conjunction: true,
            normalize(val) {
                return typeof val === 'boolean' ? val : Boolean(val);
            }
        },



        {   // адрес
            name: 'url',
            type: 'string',
            requireCreate: true,
            requireEvent: true,
            requireStored: true,
            state: true,
            demo: true,
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        },
        {   //
            name: 'title',
            type: 'string',
            default: '',
            //     persist: false,
            state: true,
            demo: true,
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        },
        {   // фавикон
            name: 'favIconUrl',
            type: 'string',
            default: '',
            //     persist: false,
            state: true,
            demo: true,
            normalize(val) {
                return typeof val === 'string' ? val : '';
            }
        }
    ],

    /**
     * Доставить настройки
     */
    init() {},

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
            if (field.persist !== false && field.default !== this[name]) {
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
     * Вкладка закрыта
     */
    close() {
        if (!this.closed) {
            this.closed = true;
            this.remove();
        }
    },

    /**
     * Удаление модели вкладки
     */
    remove() {
        this._app.tabCollect.removeItem(this.id);
    },

    /**
     * Обновление состояния
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
     * Активация вкладки (была выбрана в своем окне)
     */
    active() {



    }

};
