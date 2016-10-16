/**
 * Конструктор модель окна
 * @param {object} view
 * @constructor
 */
app.KitItem = function(view) {
    // <debug>
    this.$className = 'modelKit';
    // </debug>

    /**
     * Получение полей, которые должны быть у экземпляра
     */
    this._app.kitFields
        .filter(field => field.requireKit || field.kit)
        .forEach(field => {
            let name = field.name;
            this[name] = name in view ? view[name] : field.default;
        });

    /**
     * Состояние экземпляра. Промис выполнится после нахождения / создания записи в store
     * @type {object}
     */
    this.ready = this._app.Ready();

    // сохранить часто используемые методы с контекстом в экземпляр
    this.save = this.save.bind(this);
    this._save = this._save.bind(this);
    this.getView = this.getView.bind(this);
    this.getModel = this.getModel.bind(this);

    /**
     * Поиск соответствия с моделью
     * после нахождения модели - параметры (delay, callback) изменяются для отслеживания модификации view
     * @type {Function}
     */
    this.modify = this._app.Modify({
        delay: this._TIMEOUT_BEFORE_MAPPING,
        callback: this._mappingModel.bind(this)
    });

    this.modify();

    // ключ в store
    // <debug>
    this._itemKey = null;
    // </debug>
};
