/**
 * Операции с окнами
 */
app.kitCollect = {
    // <debug>
    $className: 'kitCollect',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Список окон
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
        item = new this._app.KitItem(raw);
        this._items[item.getId()] = item;
        return item;
    },

    /**
     * Удаление объекта (окно браузера) при его закрытии
     * @param {number} id
     * @return {object}
     */
    removeItem(id) {
        const item = this._items[id];
        if (item) {
            delete this._items[id];
        }
        return item || null;
    },

    /**
     * Получить kit по id
     * @param {number} id
     * @return {object|undefined}
     */
    getById(id) {
        return this._items[id];
    }
};
