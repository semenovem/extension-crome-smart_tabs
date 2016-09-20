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
     * Сохранение записи
     * @param {string} itemKey ключ, по которому записать в localStorage
     * @param {object} raw
     */
    save(itemKey, raw) {
        return new Promise((resolve, reject) => {
            const text = this.serialization(raw);
            if (text) {

                console.log('\n...saveRecordOpen...\n', { d: text }, '\n');

              //  localStorage.setItem(itemKey, text);
                resolve(true);
            } else {
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
                let recordOrig = null;

                // процесс поиска соответствий:
                // ищем до 1 (полное соответствие)
                // если полное соответствие не найдено - ищем максимальное соответствие
                //

                record.some((record, index, records) => {
                    if (this._app.matchTab.compare(kit.tabs, record._rawSaving.tabs) > 0.8) {

                        recordOrig = record;
                        recordOrig.setKit(kit);
                        records.splice(index, 1);
                    }
                    return recordOrig
                });
                return recordOrig;
            })

            // todo перед созданием нового объекта, можно поискать в storeRecent
            .then(record => {
                return record || this.create(kit);
            });
    },

    /**
     * Получить сохраненные окна которые нужно открыть
     * @return {Promise} массив записей (сохраненные окна) которые нужно открыть
     */
    getOpenSaved() {
        return this._getUncertain();
    },








    /**
     * Прочитать все сохраненные записи
     * @return {Promise} прочитанные записи
     * @private
     */
    _readAll() {
        return new Promise(resolve => {
            const regexp = new RegExp('^' + this._PREFIX);
            let rawSaving;

            for (let i = 0; i < localStorage.length; i++) {
                const itemKey = localStorage.key(i);
                if (regexp.test(itemKey)) {
                    rawSaving = this.unserialization(localStorage.getItem(itemKey));
                    rawSaving && this.factoryRecord(itemKey, rawSaving);
                }
            }
            this._isReaded = true;
            resolve(this._records);
        });
    },

    /**
     * Фабрика создания записей
     * @param {string} itemKey
     * @param {object} rawSaving сохраненные данные
     */
    factoryRecord(itemKey, rawSaving) {
        const record = new this._app.Record({
            store: this,
            itemKey,
            rawSaving
        });
        this._records.push(record);
        return record;
    },





    /**
     * Получить записи, которые еще не были сопоставленны с объектом открытого окна kit
     * @return {*}
     * @private
     */
    _getUncertain() {
        if (this._isReaded) {
            return Promise.resolve(this._records.filter(item => !item._kit));
        } else {
            return this._readAll();
        }
    },

    /**
     * Создание новой записи
     * @param kit
     */
    create(kit) {
        const record = this.factoryRecord(
            this.getItemKey(kit),
            null
        );
        record.setKit(kit);
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
    },





    // ################################################
    // Конвертация данных
    // ################################################


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
                name: 'Не удалось преобразовать в json',
                code: 0,
                event: e
            });
        }
        return text;
    },


    /**
     * Достаем данные из сохранения
     * @return {string|null}
     */
    unserialization(text) {
        let rawSaving;
        try {
            rawSaving = this._app.kitConv.validateSaving(
                this._app.kitConv.normalize(
                    JSON.parse(text)
                )
            );

            if (!rawSaving) {
                throw 'объект не проходит валидацию!';
            }
        }
        catch (e) {
            this._app.log.error({
                name: '',
                code: 0,
                event: e,
                deb: rawSaving
            });
            rawSaving = null;
        }
        return rawSaving;
    },




};