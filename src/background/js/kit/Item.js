/**
 * Конструктор модель окна
 * @param {object} raw
 * @constructor
 */
app.KitItem = function(raw) {
    // <debug>
    this.$className = 'modelKit';
    // </debug>

    /**
     * Получение полей, которые должны быть у экземпляра
     */
    this.fields
        .filter(field => field.requireCreate === true || 'default' in field)
        .forEach(field => {
            let name = field.name;
            this[name] = name in raw ? raw[name] : field.default;
        });

    /**
     * Состояние экземпляра. Промис выполнится после нахождения / создания записи в store
     * @type {object}
     */
    this.ready = this._app.Ready();

    // таймеры
    this._timerBeforeMapping = null;

    // ключ в store
    this._itemKey = null;

    this.modify = this._app.Modify({
        delay: this._TIMEOUT_BEFORE_SAVE,       // '_TIMEOUT_BEFORE_SAVE'
        callback: this._savePrep.bind(this)     // '_savePrep'
    });



    // Сюда попадут закрытые вкладки
    this.tabsClosed = [];


    this.prep();
};
