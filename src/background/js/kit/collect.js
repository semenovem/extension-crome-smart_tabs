/**
 * Операции с окнами
 */
app.kitCollect = {
    // <debug>
    $className: 'kitCollect',

    /**
     * @type {object} the application object
     */
    _app: null,
    // </debug>

    /**
     * Список окон
     * @type {app.Kit[]}
     */
    _items: Object.create(null),

    /**
     *
     */
    init() {
        this._app.binding(this);
    },

    /**
     * Создание экземпляра
     * @param {app.dto.KitView|app.dto.KitTabView} view
     * @return {app.Kit}
     */
    createItem(view) {
        let item;
        item = new this._app.Kit(view);
        this._items[item.getId()] = item;
        return item;
    },

    /**
     * Получить или создать запись
     * @param {app.dto.KitView|app.dto.KitTabView} view
     * @return {app.Kit}
     */
    getByView(view) {
        return this.getById(view.kitId) || this.createItem(view);
    },

    /**
     * Удаление объекта (окно браузера) при его закрытии
     * @param {number} kitId
     * @return {app.Kit|null}
     */
    removeItem(kitId) {
        const item = this._items[kitId];
        if (item) {
            delete this._items[kitId];
        }
        return item || null;
    },

    /**
     * Получить kit
     * @param {number} kitId
     * @return {app.Kit|undefined}
     */
    getById(kitId) {
        return this._items[kitId];
    }
};
