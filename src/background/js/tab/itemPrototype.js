/**
 * @type {object} прототип @class TabItem
 */
app.TabItemPrototype = app.TabItem.prototype = {
    // <debug>
    /**
     * @type {app} the application object
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
     * Вкладка закрыта из-за закрытия окна браузера
     */
    kitWasClosed() {
        this.destroy();
    },

    /**
     * Вкладка закрыта
     */
    removed() {
        this.destroy();
    },

    /**
     * Удаление объекта
     */
    destroy() {
        if (this.status !== 'removed') {
            this._app.tabCollect.removeItem(this.id);
            this.status = 'removed';

        }
    },

    /**
     * Активация вкладки (была выбрана в своем окне)
     */
    active() {
        return this._app.browserApi.tabs.update(this.id, { active: true })
        // <debug>
        //    .then(tabView => console.log ('tab was activated ', tabView));
        // </debug>
    },

    /**
     * Вкладка была активирована
     */
    activated() {
        console.log('tab activated');
        if (this.discarded) {

        }
    },

    /**
     * Выгрузить вкладку
     */
    discard() {
        if (!this.discarded) {
            this.discarded = true;
        }
    },

    /**
     * setter установить статус
     * @param status
     * @return {object}
     */
    setStatus(status) {
        if (this.status !== status) {
            this.status = status;
        }
        return this;
    },

    /**
     * getter получение статуса
     * @return {object}
     */
    getStatus() {
        return this.status;
    }

};
