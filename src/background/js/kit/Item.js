/**
 * Конструктор модель окна
 * @param {app.dto.KitView|app.dto.KitTabView} view
 * @constructor
 */
app.Kit = function(view) {
    // <debug>
    this.$className = 'app.Kit';
    // </debug>

    //
    this._kitId = view.kitId;
    this._setTab = {};
    this._name = '';
    this._note = '';
    this._status = '';

    // <debug>
    this._itemKey = null;       // ключ в store
    // </debug>

    /**
     * Состояние экземпляра. Промис выполнится после нахождения / создания записи в store
     * @type {app.Ready}
     */
    this.ready = this._app.Ready();

    // сохранить методы с контекстом в экземпляр
    this.save = this.save.bind(this);
    this._save = this._save.bind(this);
    this.getView = this.getView.bind(this);
    this.getModel = this.getModel.bind(this);
    this._getModel = this._getModel.bind(this);

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
};
