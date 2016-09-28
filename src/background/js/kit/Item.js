/**
 * Конструктор модель окна
 * @param {object} raw
 * @constructor
 */
app.KitItem = function(raw) {
    // <debug>
    this.$className = 'KitItem';
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
    this._condition = new this._app.Condition;


    this._timerBeforeSave = null;
    this._timerBeforeMapping = null;


    // Сюда попадут закрытые вкладки
    this.tabsClosed = [];


    this.prep();
};
