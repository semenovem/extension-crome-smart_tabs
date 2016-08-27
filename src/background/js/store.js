/**
 * Сохранение данных
 */
app.store = {
    // <debug>
    $className: 'Store',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    // кеш для временного хранения данных
    _cache: null,

    // список открытых окон
    _fewRawOpen: null,

    // недавно закрытые окна
    _fewRawRecent: null,

    // давно закрытые окна
    _fewRawOld: null,

    /**
     * Инициализация объекта
     */
    init() {
        this._cache = Object.create(null);
        //this._fewRawOpen = [];
        //this._fewRawRecent = [];
        //this._fewRawOld = [];

        // todo подготовим ключи в localStorage для примера
        //localStorage.setItem('kits_oldest', '');
        //localStorage.setItem('kits_recent', '');
        //localStorage.setItem('kits_open', '');
        //localStorage.setItem('kits_open', JSON.stringify([1, 2]));
    },

    // ######################
    // ######################
    // ######################

    /**
     * чтение настроек
     */
    readSetup() {
        return new Promise((resolve, reject) => {
            var data = Object.create(null);

            // заглушка
            if (data) {
                resolve(data);
            } else {
                reject(false);
            }

        });
    },

    /**
     *
     * @return {Promise}
     */
    saveSetup() {
        let allow = this._app.setup.get('setupUseLocalStorage');

        return new Promise((resolve, reject) => {
            var data = Object.create(null);

            // заглушка
            if (data) {
                resolve(data);
            } else {
                reject(allow);
            }
        });
    },

    // ######################
    // ######################
    // ######################

    /**
     * Чтение всех сохраненных данных открытых окон браузера
     * @return {Promise<{Array}>}
     */
    readFewRawOpen() {
        return this._fewRawOpen ? Promise.resolve(this._fewRawOpen) :
            new Promise(resolve => {
                let regexp = new RegExp('^kit_open_'),
                    fewRaw = [];

                for (let i = 0; i < localStorage.length; i++) {
                    let itemKey = localStorage.key(i);
                    if (regexp.test(itemKey)) {
                        let raw = this.unserialization(localStorage.getItem(itemKey));
                        raw && fewRaw.push({
                            raw,
                            id: itemKey
                        });
                    }
                }
                this._fewRawOpen = fewRaw;
                resolve(fewRaw);
            });
    },

    /**
     * Запись одного элемента - открытого окна
     * @param {object} raw
     * @param {string} recordId ключ, по которому записать в localStorage todo нужно делать случайный id
     */
    saveRawOpen(raw, recordId) {
        return new Promise((resolve, reject) => {
            let text = this.serialization(raw);
            if (text) {

                console.log('saveRecordOpen', { d: text }, '\n\n\n');

                localStorage.setItem(recordId, text);
                resolve(true);
            }
            else {
                reject({
                    name: 'не удалось записать'
                });
            }
        });
    },

    /**
     * Удаление элемента
     * @param {object} kit
     * @returns {Promise}
     */
    removeRecordOpen(kit) {
        return new Promise((resolve) => {
            // todo дописать проверку на удаление
            // и наличие записи перед удалением
            localStorage.removeItem('kit_open_' + kit.id);
            resolve(true);
        });
    },

    //updateOpen(recordId, raw) {
    //
    //},

    // ######################
    // ######################
    // ######################

    /**
     * Чтение сохраненных данных недавно закрытых окон браузера
     * @returns {Promise}
     */
    readFewRawRecent() {
        return new Promise((resolve) => {
            let items;  // {Array} сохраненные данные окон браузера

            // данные есть в кеше
            if (this._cache['kits_recent']) {

                items = this._cache['kits_recent'];
            }
            // данных нет в кеше
            else {
                let data = localStorage.getItem('kits_recent');
                let arr;
                try {
                    if (data) {
                        arr = JSON.parse(data);
                    }
                    if (Array.isArray(arr)) {
                        //items = arr.map(str => this._app.itemKitModel.getRaw(str))
                        //    .filter(item => item);

                        // сохранили в кеш
                        if (items.length) {
                            this._cache.kits_recent = items;
                        }
                    }
                }
                catch (e) {
                    this._app.log.msg({
                        name: 'Получение сохраненных данных недавно закрытых окон браузера',
                        msg: 'Запись в localStorage не валидна'
                    });
                }
                finally {
                    if (!items) {
                        items = [];
                    }
                }
            }

            resolve(items);
        });
    },

    /**
     * @param {object} kit
     */
    saveRecent(kit) {
        this.readFewRawRecent()
            .then(items => {
                return items;
            });

        return new Promise((resolve, reject) => {
            let data = kit.serialization();
            if (data) {

                console.log('saveRecent', { d: data }, '\n\n\n');
                localStorage.setItem('kit_open_' + kit.id, data);
                resolve(true);
            }
            else {
                reject({
                    name: 'не удалось записать'
                });
            }
        });

    },

    /**
     * Чтение сохраненных данных давно закрытых окон браузера
     */
    readRecordsOld() {
        //return this.readKits('old');
    },

    /**
     * Получить данные в виде строки для сохранения
     * @returns {string|null}
     */
    serialization(raw) {
        let text;
        try {
            text = JSON.stringify(raw);
        }
        catch (e) {
            text = null;
            this._app.log.error({
                name: '',
                code: 0,
                event: e
            });
        }
        return text;
    },

    /**
     * Получить данные в виде строки для сохранения
     * @returns {string|null}
     */
    unserialization(text) {
        let raw;
        try {
            raw = JSON.parse(text);
            if (!this._app.itemKitModel.validateAfterRestore(raw)) {
                throw 'объект не проходит валидацию';
            }
        }
        catch (e) {
            this._app.log.error({
                name: '',
                code: 0,
                event: e,
                deb: raw
            });
            raw = null;
        }
        return raw;
    },

    // ######################
    // ######################
    // ######################

    /**
     * Поиск в сохраненных данных набора вкладок - как у объекта окна kit
     * @param {object} kit
     * @returns {Promise<number|null>}
     */
    mapping(kit) {
        return this.findKitInOpen(kit)
            .then(recordId => recordId || this.findRawInRecent(kit));
    },

    /**
     * для окна браузера поиск соответствующей записи в store
     * @param {object} kit
     * @returns {Promise<{number}>}
     */
    findKitInOpen(kit) {
        return this.readFewRawOpen()
            .then(fewRaw => {
                let recordId;
                fewRaw.some((record, ind, arr) => {
                    if (this._app.util.compareTabs(kit.tabs, record.raw.tabs).match) {
                        recordId = record.id;
                        arr.splice(ind, 1);
                    }
                    return recordId;
                });
                return recordId;
            });
    },

    /**
     * для окна браузера поиск соответствующей записи в store
     * @param {object} kit
     * @returns {number|Promise<{number}>}
     */
    findRawInRecent(kit) {

        return this.readFewRawRecent()
            .then(fewRaw => {
                let recordId;
                fewRaw.some((record, ind, arr) => {
                    if (this._app.util.compareTabs(kit.tabs, record.raw.tabs).match) {
                        recordId = record.id;
                        arr.splice(ind, 1);
                    }
                    return recordId;
                });
                return recordId;
            });
    }

};