/**
 * @type {object} хранение открытых окон/вкладок
 */
app.store.open = {
    // <debug>
    $className: 'Store.Open',

    /**
     * @type {object} объект приложения
     */
    _app: null,

    /**
     * @type {object} ссылка на родительский объект
     */
    _store: null,
    // </debug>

    /**
     * @type {string}  префик для названия ключа - при сохранении записи в localStorage
     */
    _PREFIX: 'kit_open_',

    /**
     * @type {Array} список записей (открытых окон)
     */
    _records: [],

    /**
     * Данные прочитаны из localStore
     */
    _isReaded: false,

    /**
     * @param {object} app ссылка объект приложения
     * @param {object} store ссылка на родительский объект
     */
    init(app, store) {
        this._app = app;
        this._store = store;
        delete this.init;
    },

    /**
     * Прочитать все сохраненные записи
     * @return {Promise} прочитанные записи
     * @private
     */
    _readAll() {
        return new Promise((resolve, reject) => {
            const regexp = new RegExp('^' + this._PREFIX);
            let raw;

            for (let i = 0; i < localStorage.length; i++) {
                const itemKey = localStorage.key(i);
                if (regexp.test(itemKey)) {
                    raw = this._store.unserialization(localStorage.getItem(itemKey));
                    if (raw) {
                        this.record(itemKey, raw);
                    }
                }
            }
            this._isReaded = true;
            resolve(this._records);
        });
    },

    /**
     * Создание объекта записи
     * @param {string} itemKey
     * @param {object} raw
     * @return {Object}
     * @private
     */
    record(itemKey, raw) {
        const record = Object.create(this);
        this._records.push(record);     // здесь добавляем коллекцию записей

        record.itemKey = itemKey;
        if (raw) {
            record.raw = raw;
        }

        // получить объект для сохранения
        record.getRaw = function() {
            return this._kit.getRaw();
        };

        // todo переделать метод

        // сохранить запись
        record.save = function() {
            return this.__proto__.save(
                this.itemKey,
                this.getRaw()
            )
        };
        return record;
    },



    /**
     * Получить записи, которые еще не были сопоставленны с объектом открытого окна kit
     * @return {*}
     * @private
     */
    _getUncertain() {
        if (this._isReaded) {
            return Promise.resolve(this._records.filter(item => item.raw));
        } else {
            return this._readAll();
        }
    },


    /**
     * Запись одного элемента - открытого окна
     * @param {string} itemKey ключ, по которому записать в localStorage
     * @param {object} raw
     */
    save(itemKey, raw) {
        return new Promise((resolve, reject) => {
            let text = this._store.serialization(raw);
            if (text) {

                console.log('saveRecordOpen', { d: text }, '\n\n\n');

                localStorage.setItem(itemKey, text);
                resolve(true);
            }
            else {
                console.error('не удалось записать', itemKey, raw);
                reject({
                    name: 'не удалось записать'
                });
            }
        });
    },



    /**
     * Сопоставление сохраненного объекта окна с объектом из коллекции collectKit
     * @param {object} kit объект открытого окна
     * @return {Promise.<T>}
     */
    mapping(kit) {
        return this._getUncertain()
            .then(record => {
                let recordOrigin = null;
                record.some((record, index, records) => {
                    if (this._app.util.compareTabs(kit.tabs, record.raw.tabs).match) {
                        recordOrigin = record;

                        //
                        this.join(recordOrigin, kit);
                        records.splice(index, 1);
                    }
                    return recordOrigin
                });
                return recordOrigin;
            });
    },

    /**
     * Объединение записей record + kit
     * @param record
     * @param kit
     * @return {*}
     */
    join(record, kit) {
        record._kit = kit;
        delete record.raw;
        return record;
    },


    /**
     * Создание новой записи
     * @param kit
     */
    create(kit) {
        const record = this.record(
            this.getItemKey(kit),
            null
        );
        this.join(record, kit);
        record.save();
        return record;
    },





    /**
     * Ключ, под которым сохранить в localStorage
     * @param kit
     * @returns {string}
     */
    getItemKey(kit) {
        return this._PREFIX + kit.id;
    }



};