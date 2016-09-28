/**
 * Constructor win
 * @param {object} opts
 * @constructor
 */
app.Record = function(opts) {
    // <debug>
    this.$className = 'Record';
    // </debug>

    this._itemKey = opts.itemKey;

    if (opts.kit) {
        this._kit = opts.kit;
    }
    if (opts.storedKit) {
        this._storedKit = opts.storedKit;
    }
};

/**
 * @type {object} прототип @class Record
 */
app.recordPrototypre = app.Record.prototype = {
    // <debug>
    /**
     * @type {object} объект приложения
     */
    _app: null,
    // </debug>

    /**
     * getter
     * Получить сохранные данные окна
     * @return {object}
     */
    getStoredKit() {
        return this._storedKit;
    },

    /**
     * Сохранение
     * @param {Array} tabs массив вкладок окна
     * @return {Promise<>}
     */
    save(tabs) {
        const raw = this.getRaw();
        raw.tabs = tabs.map(tab => tab.getRaw());

        this._kit.clearModify();
        return this._app.storeOpen.save(this._itemKey, raw);
    },

    /**
     * getter
     * @return {object}
     */
    getKit() {
        return this._kit;
    },

    /**
     * Получить объект модели окна для сохранения
     * @return {object}
     */
    getRaw() {
        return this._kit.getRaw();
    },

    /**
     * setter
     * Добавление модели
     * @param {object} kit
     */
    setKit(kit) {
        this._kit = kit;
        if (kit.getRecord() !== this) {
            kit.setRecord(this);
        }
        delete this._storedKit;
    },

    /**
     * Сохранение в последние использованные
     */
    moveToRecent() {
        return this._app.storeOpen.moveToRecent(this._itemKey);
    }


};
