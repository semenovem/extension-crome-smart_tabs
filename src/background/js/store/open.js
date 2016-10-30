/**
 * @type {object} хранение открытых окон/вкладок
 */
app.storeOpen = {
    // <debug>
    $className: 'storeOpen',

    /**
     * @type {app} the application object
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
     * @type {app.dto.Record[]} все сохраненные записи на момент запуска приложения
     */
    _dtoArrRecord: null,

    /**
     * Получить настройки
     * Прочитать все записи view, положить в "кучу" heap для разбора по view
     */
    init() {
        this._app.binding(this);
        this.ready = this._app.Ready();

        this._app.ready()
            .then(() => {
                this._PREFIX = this._app.setup.get('store.open.prefix');
                return this._readItemAll();
            })
            .then(dtoArrRecord => {
                this._dtoArrRecord = dtoArrRecord;
                this.ready.resolve();
            });
    },

    /**
     * "куча" - массив записей, сохраненных в предыдущую сессию работы.
     * При старте приложения нужно найти каждой записи ее открытое окно браузера
     * или открыть новое окно
     *
     * Получить записи, которые нужно разобрать по view
     * @return {app.dto.Record[]}
     */
    getHeap() {
        return this._dtoArrRecord;
    },

    /**
     * Исключить запись из "кучи"
     * @param {string} itemKey
     */
    heapExclude(itemKey) {
        this._dtoArrRecord.reduceRight((notUse, dtoRecord, i) => {
            if (dtoRecord.itemKey === itemKey) {
                this._dtoArrRecord.splice(i, 1);
            }
        }, null);
    },

    /**
     * Получить сохраненные окна которые нужно открыть
     * @return {Promise.<app.dto.Record[]>}
     */
    getSaved() {
        return this.ready().then(() => this._dtoArrRecord);
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
     * @param {app.dto.KitTabModel} dtoKitTabModel
     */
    save(itemKey, dtoKitTabModel) {
        return new Promise((resolve, reject) => {
            const text = this.serialization(dtoKitTabModel);
            if (text) {

                console.log('\n...saveRecordOpen...\n', { d: text }, '\n');

                localStorage.setItem(itemKey, text);
                resolve();
            } else {
                console.error('не удалось записать', itemKey, dtoKitTabModel);
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
            .then(this._app.storeRecent.add);
        //       .then(() => this._removeItem(itemKey))
    },

    // ################################################
    // сереализация / десереализация данных
    // ################################################

    /**
     * Получить данные в виде строки для сохранения
     * @param {app.dto.KitTabModel} dtoKitTabModel
     * @return {string|null}
     */
    serialization(dtoKitTabModel) {
        try {
            return JSON.stringify(dtoKitTabModel);
        }
        catch (e) {
            this._app.log({
                name : 'Не удалось преобразовать в json',
                dtoKitTabModel,
                event: e
            });
            return null;
        }
    },

    /**
     * распаковка сохраненных данных в dto
     * @param {string} data
     * @return {app.dto.KitTabModel|null}
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
            return null;
        }
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
     * @return {Promise.<app.dto.KitTabModel[]>} массив прочитанные записи
     * @private
     */
    _readItemAll() {
        return new Promise(resolve => {
            const regexp = new RegExp('^' + this._PREFIX);
            const dtoArrRecord = [];

            for (let i = 0; i < localStorage.length; i++) {
                const itemKey = localStorage.key(i);
                if (!regexp.test(itemKey)) {
                    continue;
                }

                const dtoKitTabModel = this.unserialization(localStorage.getItem(itemKey));

                if (dtoKitTabModel) {

                    dtoArrRecord.push(
                        this._app.dto.record({
                            dtoKitTabModel,
                            itemKey
                        })
                    );

                } else {
                    // удалить не валидные данные
                    localStorage.removeItem(itemKey);
                }
            }
            resolve(dtoArrRecord);
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