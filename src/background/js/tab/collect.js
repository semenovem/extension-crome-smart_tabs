/**
 * Операции со вкладками
 */
app.tabCollect = {
    // <debug>
    $className: 'tabCollect',

    /**
     * @type {object} the application object
     */
    _app: null,
    // </debug>

    /**
     * Список tabs
     * @type {app.Tab[]}
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
     * @param {app.dto.TabView} view
     * @return {app.Tab}
     */
    createItem(view) {
        let item;
        item = new this._app.Tab(view);
        this._items[item.getId()] = item;
        return item;
    },

    /**
     * Получить или создать запись
     * @param {app.dto.TabView} view
     * @return {app.Tab}
     */
    getByView(view) {
        return this.getById(view.tabId) || this.createItem(view);
    },

    /**
     * Удаление объекта вкладки
     * @param {number} tabId
     * @return {app.Tab|null}
     */
    removeItem(tabId) {
        const item = this._items[tabId];
        if (item) {
            delete this._items[tabId];
        }
        return item || null;
    },

    /**
     * Получить tab
     * @param {number} tabId
     * @return {app.Tab|undefined}
     */
    getById(tabId) {
        return this._items[tabId];
    }
};
