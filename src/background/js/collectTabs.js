/**
 * Операции со вкладками
 */
app.collectTabs = {
    // <debug>
    $className: 'CollectTabs',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,

    /**
     * Список tabs
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
     * @returns {object|null}
     */
    createItem(raw) {
        let item;
        if (this._app.itemTabModel.validateToCreate(raw)) {
            item = new this._app.ItemTab(raw);
            this._items[item.id] = item;
        }
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
     * Открытие вкладки браузера
     * @param opts
     * @returns {Promise}
     */
    create(opts) {
        return new Promise((resolve, reject) => {
            let item = this.createItem(opts);

            if (item) {
                resolve(item);
            } else {
                reject(false);
            }
        });
    },

    remove() {

    }

};
