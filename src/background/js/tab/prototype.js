/**
 * @type {object} прототип @class Tab
 */
app.TabPrototype = app.Tab.prototype = {
    // <debug>
    /**
     * @type {object} the application object
     */
    _app: null,
    // </debug>

    /**
     * Доставить настройки
     */
    init() {},

    /**
     * getter tabId
     * @return {Number}
     */
    getId() {
        return this._tabId;
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

        //console.log (model)

        return model;
    },

    /**
     *
     * @param {app.dto.TabView} view
     * @return {*}
     */
    prepDtoModel(view) {
        return Object.assign(
            {},
            view)
    },

    /**
     * Получить модель с использованием данных view
     * @param {app.dto.TabView} view
     * @return {app.dto.TabModel}
     */
    getModelUsingView(view) {
        return this._app.dto.TabModel(
            Object.assign(this._getDataToModel(), view)
        );
    },


    /**
     * Формирует данные для сохранения
     * @return {object}
     */
    _getDataToModel() {
        return {
            // пока никаких данных
        };
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
        if (this._status !== 'removed') {
            this._app.tabCollect.removeItem(this._tabId);
            this._status = 'removed';

        }
    },

    /**
     * Активация вкладки (была выбрана в своем окне)
     */
    active() {
        return this._app.browserApi.tabs.update(this._tabId, { active: true })
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
        if (!this._discarded) {
            this._discarded = true;
        }
    },

    /**
     * setter установить статус
     * @param {String} status
     * @return {object}
     */
    setStatus(status) {
        if (this._status !== status) {
            this._status = status;
        }
        return this;
    },

    /**
     * getter статуса
     * @return {String}
     */
    getStatus() {
        return this._status;
    }

};
