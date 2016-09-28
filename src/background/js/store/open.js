/**
 * @type {object} хранение открытых окон/вкладок
 */
app.storeOpen = {
    // <debug>
    $className: 'storeOpen',

    /**
     * @type {object} объект приложения
     */
    _app: null,

    /**
     * @type {object} @class Condition состояние готовности
     */
    _condition: null,

    /**
     * @type {string}  префик для названия ключа - при сохранении записи в localStorage
     */
    _PREFIX: '',
    // </debug>

    /**
     * @type {Array} список записей (открытых окон)
     */
    _records: [],

    /**
     *
     */
    init() {
        this._app.binding(this);
        this._condition = new this._app.Condition;
        this._app.setup.get('store.open.prefix')
            .then(prefix => {
                this._PREFIX = prefix;
                return this._readAll();
            })
            .then(this._condition.resolve);
    },

    /**
     * Получить объект состояния
     * @return {Promise}
     */
    getCondition() {
        return this._condition.get();
    },


    /**
     * Сохранения, которые не имеют определенного view - открытого окна браузера
     * @return {Promise<>}
     */
    getVacant() {
        return this._condition.get()
            .then(this.getVacantSync);
    },

    /**
     * Синхронное получение записей без view
     * @return {Array}
     */
    getVacantSync() {
        return this._records.filter(rec => !rec._kit);
    },

    /**
     * Получить сохраненные окна которые нужно открыть
     * @return {Promise} массив записей (сохраненные окна) которые нужно открыть
     */
    getSaved() {
        return this.getVacant();
    },

    /**
     * Прочитать все сохраненные записи
     * @return {Promise} прочитанные записи
     * @private
     */
    _readAll() {
        return new Promise(resolve => {
            const regexp = new RegExp('^' + this._PREFIX);
            let storedKit;

            for (let i = 0; i < localStorage.length; i++) {
                const itemKey = localStorage.key(i);
                if (regexp.test(itemKey)) {
                    storedKit = this._app.kitConv.unserialization(localStorage.getItem(itemKey));

                    if (storedKit) {
                        this._factoryRecord(itemKey, storedKit);
                    } else {
                        // удалить не валидные данные
                        localStorage.removeItem(itemKey);
                    }
                }
            }
            resolve();
        });
    },


    /**
     * Фабрика создания записей
     * @param {string} itemKey
     * @param {object} storedKit сохраненные данные
     */
    _factoryRecord(itemKey, storedKit) {
        const record = new this._app.Record({
            itemKey,
            storedKit
        });
        this._records.push(record);
        return record;
    },

    /**
     * Создание новой записи
     * @param kit
     */
    createRecord(kit) {
        return this._factoryRecord(
            this.getItemKey(kit),
            null
        );
    },

    /**
     * Ключ, под которым сохранить в localStorage
     * @param kit
     * @returns {string}
     */
    getItemKey(kit) {
        return this._PREFIX + kit.id;
    },

    /**
     * Сохранение записи
     * @param {string} itemKey ключ, по которому записать в localStorage
     * @param {object} raw
     */
    save(itemKey, raw) {
        return new Promise((resolve, reject) => {
            const text = this._app.kitConv.serialization(raw);
            if (text) {

                console.log('\n...saveRecordOpen...\n', { d: text }, '\n');

                localStorage.setItem(itemKey, text);
                resolve();
            } else {
                console.error('не удалось записать', itemKey, raw);
                reject({
                    name: 'не удалось записать'
                });
            }
        });
    },

    /**
     * Перенос записи в store для хранения недавно закрытых окон
     * @param {string} itemKey ключ записи
     * @return {Promise.<T>}
     */
    moveToRecent(itemKey) {
        return this.readItem(itemKey)
            .then(this._app.storeRecent.add)
            //       .then(() => this.removeItem(itemKey))
    },


    /**
     * Прочитать элемент
     * @param {string} itemKey ключ записи
     */
    readItem(itemKey) {
        return Promise.resolve(localStorage.getItem(itemKey));
    },


    /**
     * Удалить элемент
     * @param {string} itemKey ключ записи
     */
    removeItem(itemKey) {
        return Promise.resolve(localStorage.removeItem(itemKey));
    }


};