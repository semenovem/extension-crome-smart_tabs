/**
 * @type {object} прототип @class KitItem
 */
app.KitPrototype = app.Kit.prototype = {
    // <debug>
    /**
     * @type {object} the application object
     */
    _app: null,

    /**
     * @type {number} задержка перед сохранением состояния
     */
    _TIMEOUT_BEFORE_SAVE: 0,

    /**
     * @type {number} задержка перед поиском соответствия в store
     */
    _TIMEOUT_BEFORE_MAPPING: 0,
    // </debug>

    /**
     * Доставить настройки
     */
    init() {
        this._app.ready()
            .then(() => {
                this._TIMEOUT_BEFORE_SAVE = this._app.setup.get('kit.save.timeout');
                this._TIMEOUT_BEFORE_MAPPING = this._app.setup.get('kit.mappingModel.timeout');
            });
    },

    /**
     * Искать соответствие с сохраненной записью
     * установить новые параметры для
     * @async
     * @private
     */
    _mappingModel() {
        this.modify.suspend();

        this._app.mapping.model(this)
            .then(this.applyMapping.bind(this))
            .then(this.modify.resume)
            .catch(e => console.warn.bind(console, 'itemProtottype merge'));
    },

    /**
     * Установить модель для объекта окна
     * если нет сто процентного совпадения - нужно сохранить
     * @async
     * @param {object} result
     *
     * result:
     * {
     *      view {object}
     *      relevant {number}
     *      itemKey {string}
     *      [model] {object}
     *  }
     */
    applyMapping(result) {
        try {
            this.modify.setDelay(this._TIMEOUT_BEFORE_SAVE);
            this.modify.setCallback(this.save);

            result.dtoKitTabModel && this.joinModel(result.dtoKitTabModel);
            this._itemKey = result.itemKey;

            this.modify.clear();

            return (result.relevant === 1 ? Promise.resolve() : this._save(this.getModelUsingView(result.view)))
                .then(this.ready.resolve);
        }
        catch (e) {
            this._app.log({
                e: e
            });
        }
    },

    /**
     * Вернуть kitId записи
     * @sync
     * @return {string}
     */
    getId() {
        return this._kitId;
    },

    // ################################################
    // модификация объекта
    // ################################################

    /**
     * Сохранение объекта
     * @async
     * @return {Promise.<T>}
     */
    save() {
        return this.getModel()
            .then(this._save);
    },

    /**
     * Сохранение
     * @async
     * @param {object} model
     * @return {Promise<>}
     */
    _save(model) {
        this.modify.is && this.modify.clear();
        return this._app.storeOpen.save(this._itemKey, model)

            // todo убрать = для тестов
            .then(() => console.log ('kit: ', this._kitId))
    },

    /**
     * Получение view окна браузера
     * @async
     * @return {Promise.<app.dto.kitTabView>}
     */
    getView() {
        return app.browserApi.windows.get(this._kitId);
    },

    /**
     * Получить модель
     * @async
     * @return {Promise.<app.dto.KitTabModel>}
     */
    getModel() {
        return this.getView().then(this.getModelUsingView);
    },

    /**
     * Получить модель с использованием данных view
     * @sync
     * @param {app.dto.KitTabView} view
     * @return {app.dto.KitTabModel}
     */
    getModelUsingView(view) {
        /**
         * @type Object to create the model
         */
        const raw = {
            name     : this._name,
            note     : this._note,
            tabActive: this._tabActive,
            state    : this._state,
            setTab   : this._setTab
        };

        const data = Object.assign(raw, view);
        data.tabs = view.tabs.map(view => this._app.tabCollect.getByView(view).getModelUsingView(view));

        return this._app.dto.kitTabModel(data);
    },


    /**
     * Объект данных объекта
     * @async
     * @returm app.dto.KitTabData
     */
    getData() {
        return this.getView().then(this.getDataUsingView);
    },

    /**
     * Объект dto с существующим view
     * @sync
     * @param {app.dto.KitTabView} view
     * @return app.dto.KitTabData
     */
    getDataUsingView(view) {
        /**
         * @type object the data object
         */
        const raw = {
            name     : this._name,
            note     : this._note,
            tabActive: this._tabActive,
            state    : this._state,
            setTab   : this._setTab
        };

        const data = Object.assign(raw, view);
        data.tabs = view.tabs.map(view => this._app.tabCollect.getByView(view).getDataUsingView(view));

        return this._app.dto.kitTabData(data);
    },


    /**
     * Добавление в объект данных из модели
     * @sync
     * @param {app.dto.KitTabModel} model
     */
    joinModel(model) {
        if ('name' in model) {
            this._name = model.name;
        }

        if ('note' in model) {
            this._note = model.note;
        }

        if ('tabActive' in model) {
            this._tabActive = model.tabActive;
        }

        // setting tabs
        try {
            if ('discardCreate' in model.setTab) {
                this._setTab.discardCreate = model.setTab.discardCreate;
            }

            if ('closed' in model.setTab) {
                this._setTab.closed = model.setTab.closed;
            }

            if ('history' in model.setTab) {
                this._setTab.history = model.setTab.history;
            }
        }
        catch (e) {}
    },



    // ################################################
    //
    // ################################################

    /**
     * Событие удаление окна
     * @sync
     */
    removed() {
        console.log('event onRemoved window', this._kitId);

        if (this._status !== 'removed') {
            this._status = 'removed';

            this.modify.destroy();

            this._app.kitCollect.removeItem(this._kitId);
            if (this._itemKey) {
                this._app.storeOpen.moveToRecent(this._itemKey);
            }
        }
    },

    /**
     * setter имя окна
     * @sync
     * @param {string} name
     * @return {app.Kit}
     */
    setName(name) {
        if (name !== this._name) {
            this._name = name;
            this.modify();
        }
        return this;
    },

    /**
     * getter имя окна
     * @sync
     * @return {string}
     */
    getName() {
        return this._name;
    },

    /**
     * setter статус
     * @sync
     * @param {String} status
     * @return {app.Kit}
     */
    setStatus(status) {
        if (this._status !== status) {
            this._status = status;
        }
        return this;
    },

    /**
     * getter статуса
     * @sync
     * @return {String}
     */
    getStatus() {
        return this._status;
    }

};
