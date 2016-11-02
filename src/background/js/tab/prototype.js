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
     * getter tabId
     * @return {Number}
     */
    getId() {
        return this._tabId;
    },

    /**
     * Получить модель с использованием данных view
     * @param {app.dto.TabView} view
     * @return {app.dto.TabModel}
     */
    getModelUsingView(view) {
        const raw = {
            // пока никаких данных
        };
        const data = Object.assign(raw, view);

        return this._app.dto.tabModel(data);
    },

    /**
     * Добавление в объект сохраненных данных
     * @param {Object} model
     * @return Boolean
     */
    joinModel(model) {

        if ('history' in model) {
            this._name = model.name;
        }

        return true;
    },



    getDataUsingView() {

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
