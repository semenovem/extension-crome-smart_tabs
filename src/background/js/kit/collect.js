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
     * Создание экземпляра
     * @param {object} raw
     * @return {object}
     */
    createItem(raw) {
        let item;

        item = new this._app.KitItem(raw, this._app);
        this._items[raw.id] = item;

        //// если переданы данные вкладок
        //if ('tabs' in raw && Array.isArray(raw.tabs)) {
        //    raw.tabs.forEach(tabRaw => {
        //        const tab = this._app.tabCollect.createItem(tabRaw);
        //        tab && item.addTab(tab);
        //    });
        //}
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
            item.tabs.forEach(tab => this._app.tabCollect.removeItem(tab));
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
