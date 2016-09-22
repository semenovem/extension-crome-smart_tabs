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
     * @returns {object|null}
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
     * @returns {object|undefined}
     */
    getById(id) {
        return this._items[id];
    },

    /**
     * проверить существование tab по id
     * @param {number} id
     * @returns {boolean}
     */
    isById(id) {
        return id in this._items;
    },

    /**
     * Получить вкладки, принадлежащие окну
     * @param {object} kit объект окна браузера
     */
    getByKit(kit) {
        const items = this._items;
        const tabs = [];
        for (let id in items) {
            if (items[id].getKit() === kit) {
                tabs.push(items[id]);
            }
        }
        return tabs;
    }





};
