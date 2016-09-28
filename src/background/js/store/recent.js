/**
 * @type {object} хранение недавно закрытых окон/вкладок
 */
app.storeRecent = {
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
     * @type {Array} список записей. данные формата: storedKit
     */
    _records: [],

    /**
     *
     */
    init() {
        this._app.binding(this);
        this._condition = new this._app.Condition;
        this._app.setup.get('store.recent.prefix')
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
                        this._records.push(storedKit);
                    } else {
                        // удалить не валидные данные
                        localStorage.removeItem(itemKey);
                    }
                }
            }
            resolve();
        });
    },




    moveToOpen(itemKey) {

    },



    /**
     * Добавление данных на хранение
     * @param {string} data данные окна в виде стороки
     * @returns {Promise}
     */
    add(data) {
        console.log ('storeRecent storedKit', data);

        return new Promise((resolve, reject) => {
            const key = this.getItemKey();

            if (key && data) {
                localStorage.setItem(key, data);
                resolve();
            } else {
                reject();
            }
        });
    },






    /**
     * Ключ, под которым сохранить в localStorage
     * @returns {string}
     */
    getItemKey() {
        let key;
        do {
            key = this._PREFIX + Date.now();
        } while(localStorage.getItem(key));

        return key;
    }








};