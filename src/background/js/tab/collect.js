/**
 * Операции со вкладками
 */
app.tabCollect = {
    // <debug>
    $className: 'tabCollect',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Список tabs
     * @type {object}
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
     * @param {object} raw
     * @return {object}
     */
    createItem(raw) {
        let item;
        item = new this._app.TabItem(raw);
        this._items[item.id] = item;
        return item;
    },

    /**
     * Удаление объекта вкладки
     * @param {number} id
     * @return {object|null}
     */
    removeItem(id) {
        const item = this._items[id];
        if (item) {
            delete this._items[id];
        }
        return item || null;
    },

    /**
     * Получить tab по id
     * @param {number} id
     * @return {object|undefined}
     */
    getById(id) {
        return this._items[id];
    }
};
