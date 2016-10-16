/**
 * @type {object} прототип @class TabItem
 */
app.TabItemPrototype = app.TabItem.prototype = {
    // <debug>
    /**
     * @type {object} объект приложения
     */
    _app: null,
    // </debug>


    /**
     * Доставить настройки
     */
    init() {},

    /**
     * Вернуть id записи
     * @return {string}
     */
    getId() {
        return this.id;
    },

    /**
     * Формирует данные для сохранения
     * Готовый объект содержит:
     * - поля для сохранения, у которых значение отличаются от значений по умолчанию
     * @param view
     * @return {object}
     */
    getModel(view) {
        const model = {};
        const tmp = this._app.util.objectMerge(
            this._getDataToModel(),
            view
        );

        this._app.tabFields
            .filter(field => field.model && field.name in tmp)
            .filter(field => 'default' in field === false || field.default !== tmp[field.name])
            .forEach(field => model[field.name] = tmp[field.name]);

        return model;
    },

    /**
     * Формирует данные для сохранения
     * @return {object}
     */
    _getDataToModel() {
        const model = {};
        this._app.tabFields
            .filter(field => field.model && field.name in this)
            .forEach(field => model[field.name] = this[field.name]);
        return model;
    },

    /**
     * Добавление в объект сохраненных данных
     * @param {object} model
     */
    joinModel(model) {
        this._app.tabFields
            .filter(field => field.tab && model[field.name])
            .forEach(field => {
                const name = field.name;
                if (this[name] !== model[name]) {
                    this[name] = model[name];
                }
            });
    },

    // ################################################
    // операции с данными
    // ################################################

    /**
     * Вкладка закрыта
     */
    closed() {
        if (!this.isClosed) {
            this.isClosed = true;
            this.remove();
        }
    },



    /**
     * Удаление модели вкладки
     */
    remove() {
        this._app.tabCollect.removeItem(this.id);
    },


    /**
     * Активация вкладки (была выбрана в своем окне)
     */
    active() {
        return this._app.browserApi.tabs.update(this.id, { active: true })
            // <debug>
            .then(tabView => console.log ('tab was activated ', tabView));
        // </debug>
    },

};
