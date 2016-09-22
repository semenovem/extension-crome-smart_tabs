/**
 * Constructor win
 * @param {object} opts
 * @constructor
 */
app.Record = function(opts) {
    // <debug>
    this.$className = 'Record';
    // </debug>

    this._store = opts.store;
    this._itemKey = opts.itemKey;
    this._kit = opts.kit ? opts.kit : null;

    if (opts.rawSaving) {
        this._rawSaving = opts.rawSaving;
    }
};


/**
 * @type {object} прототип @class Record
 */
app.Record.prototype = {

    // получить объект для сохранения
    getRaw() {
        return this._kit.getRaw();
    },


    // получить сохраненный объект
    getRawSaving() {
        return this._rawSaving;
    },





    // сохранение
    save() {
        // todo сделать нормальную обработку ошибки
        this._kit || console.error('пытаемся сохранить запись, которая не имеет открытого окна');

        return this._store.save(
            this._itemKey,
            this.getRaw()
        )
    },

    getKit() {
        return this._kit;
    },

    /**
     * Добавление объекта открытого окна
     * @param kit
     */
    setKit(kit) {
        this._kit = kit;
        delete this._rawSaving;
        kit.getRecord() !== this && kit.setRecord(this);
    }


};




