/**
 * Операции с окнами
 */
app.collectKits = {
    // <debug>
    $className: 'CollectKits',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,

    /**
     * Список окон
     * @type {object}
     */
    _items: null,
    // </debug>

    /**
     * Инициализация объекта
     */
    init() {
        this._items = Object.create(null);
    },

    /**
     * Создание экземпляра
     * @param {object} raw
     * @returns {object}
     */
    createItem(raw) {
        let item;
        if (this._app.ItemKit.prototype.validateToCreate(raw)) {
            item = new this._app.ItemKit(raw, this._app.store);
            this._items[raw.id] = item;
        }
        return item;
    },

    /**
     * Удаление объекта (окно браузера) при его закрытии
     * @param {number} id
     * @returns {object}
     */
    removeItem(id) {
        const item = this._items[id];
        if (item) {
            delete this._items[id];
            item.tabs.forEach(tab => this._app.collectTabs.removeItem(tab));
        }
        return item || null;
    },

    /**
     * Получить kit по id
     * @param {number} id
     * @returns {object|undefined}
     */
    getById(id) {
        return this._items[id];
    },

    /**
     * проверить существование kit по id
     * @param id
     * @returns {boolean}
     */
    isById(id) {
        return id in this._items;
    },

    /**
     * получить все окна
     * @returns {Array}
     */
    getItemsInArray() {
        return Object.keys(this._items).map(key => this._items[key]);
    }



    // открытие окон браузера, сохраненные в предыдущую сессию
    // это запускается после того, как все

};
