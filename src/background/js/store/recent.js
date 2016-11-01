/**
 * @type {object} хранение недавно закрытых окон/вкладок
 */
app.storeRecent = {
    // <debug>
    $className: 'storeOpen',

    /**
     * @type {object} the application object
     */
    _app: null,

    /**
     * @type {function} @class Ready состояние готовности
     */
    ready: null,

    /**
     * @type {string} префикс для названия ключа - при сохранении записи в localStorage
     */
    _PREFIX: '',
    // </debug>

    /**
     * @type {app.dto.Record[]} список записей
     */
    _dtoArrRecord: null,

    /**
     * актуальность данных
     */
    isActual: false,    // todo придумать название для смысла "готовность (актуальность) имеющихся records

    /**
     *
     */
    init() {
        this._app.binding(this);
        this.ready = this._app.Ready();

        this._app.ready()
            .then(() => {
                this._PREFIX = this._app.setup.get('store.recent.prefix');
                this._readRecordAll()
                    .then(this.ready.resolve);
            });
    },


    //// перемещение записи в storeOpen
    //moveToOpen(itemKey) {
    //
    //},

    /**
     * Добавление данных на хранение
     * @param {string} data данные окна в виде стороки
     * @return {Promise.<>}
     */
    add(data) {
   //     console.log('storeRecent storedKit', data);

        this.isActual = false;

        return new Promise((resolve, reject) => {
            const key = this._getItemKey();

            if (key && data) {
                localStorage.setItem(key, data);
                resolve();
            } else {
                reject();
            }
        });
    },

    /**
     * Получение записей. Вернуть копию данных
     * @param {object} [opts]
     * @return {Promise.<app.dto.Record[]>}
     */
    getRecords(opts) {
        return this.ready()
            .then(() => {
                return this.isActual ? true : this._readRecordAll();
            })
            // todo получить копию данных
            .then(() => JSON.parse(JSON.stringify(this._dtoArrRecord)));
    },



    /**
     * Прочитать все записи
     * @private
     */
    _readRecordAll() {
        return this._readItemAll()
            .then(dtoArrRecord => {
                this._dtoArrRecord = dtoArrRecord;
                this.isActual = true;
            });
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
     * @return {Promise.<app.dto.KitTabModel[]>} прочитанные записи
     * @private
     */
    _readItemAll() {
        return new Promise(resolve => {
            const regexp = new RegExp('^' + this._PREFIX);

            const unserialization = this._app.storeOpen.unserialization;    // todo пока пользуемся им, потомперенести на общий слой абстракции
            const dtoArrRecord = [];

            for (let i = 0; i < localStorage.length; i++) {
                const itemKey = localStorage.key(i);

                if (!regexp.test(itemKey)) {
                    continue;
                }
                const dtoKitTabModel = unserialization(localStorage.getItem(itemKey));

                if (dtoKitTabModel) {
                    dtoArrRecord.push(
                        this._app.dto.record({
                            model: dtoKitTabModel,
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
     *
     */
    _readItem(itemKey) {
        return Promise.resolve(localStorage.getItem(itemKey));
    }

    ///**
    // *
    // * @param itemKey
    // * @param data
    // * @returns {Promise.<T>}
    // */
    //_saveItem(itemKey, data) {
    //    localStorage.setItem(itemKey, data);
    //    return Promise.resolve();
    //},
    //
    ///**
    // * Удалить элемент
    // * @param {string} itemKey ключ записи
    // */
    //_removeItem(itemKey) {
    //    localStorage.removeItem(itemKey);
    //    return Promise.resolve();
    //}

};