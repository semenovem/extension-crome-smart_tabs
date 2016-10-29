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
     * @type {function} @class Ready состояние готовности
     */
    ready: null,

    /**
     * @type {string}  префик для названия ключа - при сохранении записи в localStorage
     */
    _PREFIX: '',
    // </debug>

    /**
     * @type {Array} все сохраненные записи на момент запуска приложения. данные формата: kitModel
     */
    _heap: [],

    /**
     * Получить настройки
     * Прочитать все записи view, положить в "кучу" heap для разбора по view
     *
     */
    init() {
        this._app.binding(this);
        this.ready = this._app.Ready();

        this._app.ready()
            .then(() => {
                this._PREFIX = this._app.setup.get('store.open.prefix');
                return this._readItemAll();
            })
            .then(records => {
                this._heap = records;
                this.ready.resolve();
            });
    },

    /**
     * "куча" - массив записей, сохраненных в предыдущую сессию работы.
     * При старте приложения нужно найти каждой записи ее открытое окно браузера
     * или открыть новое окно
     *
     * Получить записи, которые нужно разобрать по view
     * @return {Array}
     */
    getHeap() {
        return this._heap;
    },

    /**
     * Исключить запись из "кучи"
     * @param {string} itemKey
     */
    heapExclude(itemKey) {
        this._heap.reduceRight((notUse, record, i) => {
            if (record.itemKey === itemKey) {
                this._heap.splice(i, 1);
            }
        }, null);
    },

    /**
     * Получить сохраненные окна которые нужно открыть
     * @return {Promise} массив записей (сохраненные окна) которые нужно открыть
     */
    getSaved() {
        return this.ready().then(() => this._heap);
    },

    /**
     * Создание новой записи
     */
    createModel() {
        return this._getItemKey();
    },

    /**
     * Сохранение записи
     * @param {string} itemKey ключ, по которому записать в localStorage
     * @param {object} raw
     */
    save(itemKey, raw) {
        return new Promise((resolve, reject) => {
            const text = this.serialization(raw);
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
        return this._readItem(itemKey)
            .then(this._app.storeRecent.add)
        //       .then(() => this._removeItem(itemKey))
    },

    // ################################################
    // сереализация / десереализация данных
    // ################################################

    /**
     * Получить данные в виде строки для сохранения
     * @returns {string|null}
     */
    serialization(model) {
        let data;
        try {
            data = JSON.stringify(model);
        }
        catch (e) {
            data = null;
            this._app.log({
                name : 'Не удалось преобразовать в json',
                model,
                event: e
            });
        }
        return data;
    },

    /**
     *
     * @return {dto.kitTabModel|null}
     */
    unserialization(data) {
        try {
            return this._app.dto.kitTabModel(JSON.parse(data));
        }
        catch (e) {
            this._app.log({
                e,
                data
            });
        }
        return null;
    },

    // ################################################
    // низко-уровневые операции чтения / изменения данных
    // ################################################

    /**
     * Ключ, под которым сохранить в localStorage
     * @return {string}
     */
    _getItemKey() {
        let key;
        do {
            key = this._PREFIX + Date.now() + Math.random().toString()[3];
        } while (localStorage.getItem(key));
        return key;
    },

    /**
     * Прочитать все сохраненные записи
     * @return {Promise} прочитанные записи
     * @private
     */
    _readItemAll() {
        return new Promise(resolve => {
            const regexp = new RegExp('^' + this._PREFIX);
            const records = [];

            for (let i = 0; i < localStorage.length; i++) {
                const itemKey = localStorage.key(i);
                if (!regexp.test(itemKey)) {
                    continue;
                }

                let model = this.unserialization(localStorage.getItem(itemKey));

                if (model) {
                    records.push({
                        model,
                        itemKey
                    });

                } else {
                    // удалить не валидные данные
                    localStorage.removeItem(itemKey);
                }
            }
            resolve(records);
        });
    },

    /**
     * Прочитать элемент
     * @param {string} itemKey ключ записи
     */
    _readItem(itemKey) {
        return Promise.resolve(localStorage.getItem(itemKey));
    },

    /**
     *
     * @param itemKey
     * @param data
     * @returns {Promise.<T>}
     */
    _saveItem(itemKey, data) {
        localStorage.setItem(itemKey, data);
        return Promise.resolve();
    },

    /**
     * Удалить элемент
     * @param {string} itemKey ключ записи
     */
    _removeItem(itemKey) {
        localStorage.removeItem(itemKey);
        return Promise.resolve();
    }

};