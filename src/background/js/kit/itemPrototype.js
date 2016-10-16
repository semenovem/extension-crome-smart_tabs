/**
 * @type {object} прототип @class KitItem
 */
app.KitItemPrototype = app.KitItem.prototype = {
    // <debug>
    /**
     * @type {object} объект приложения
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

    /**
     * Произошли изменения в данных
     * Метод добавляется к экземпляру класса Modify при создании
     * @method modify
     * @type {function}
     */
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

            result.model && this.joinModel(result.model);
            this._itemKey = result.itemKey;

            this.modify.clear();

            return (result.relevant === 1 ? Promise.resolve() : this._save(this.getModel(result.view)))
                .then(this.ready.resolve);
        }
        catch (e) {
            this._app.log({
                e: e
            });
        }
    },


    /**
     * Вернуть id записи
     * @return {string}
     */
    getId() {
        return this.id;
    },

    // ################################################
    // модификация объекта
    // ################################################

    /**
     * Сохранение объекта
     * @return {Promise.<T>}
     */
    save() {
        return this.getView()
            .then(this.getModel)
            .then(this._save);
    },

    /**
     * Сохранение
     * @param {object} model
     * @return {Promise<>}
     */
    _save(model) {
        this.modify.is && this.modify.clear();
        return this._app.storeOpen.save(this._itemKey, model);
    },

    /**
     * Получение view окна браузера
     * @return {Promise.<T>}
     */
    getView() {
        return app.browserApi.windows.get(this.id);
    },

    /**
     * Получить модель
     * @param view
     * @return {object}
     */
    getModel(view) {
        const model = {};
        const tmp = this._app.util.objectMerge(
            this._getDataToModel(),
            view
        );

        this._app.kitFields
            .filter(field => field.model && field.name in tmp)
            .filter(field => 'default' in field === false || field.default !== tmp[field.name])
            .forEach(field => model[field.name] = tmp[field.name]);

        // данные вкладок
        model.tabs = view.tabs.map(tabView => this._app.tabCollect
            .getByView(tabView)
            .getModel(tabView)
        );

        return model;
    },

    /**
     * Добавление в объект сохраненных данных
     * @param {object} model
     */
    joinModel(model) {
        this._app.kitFields
            .filter(field => field.kit && model[field.name])
            .forEach(field => {
                const name = field.name;
                if (this[name] !== model[name]) {
                    this[name] = model[name];
                }
            });
    },

    /**
     * Формирует данные для сохранения
     * @return {object}
     */
    _getDataToModel() {
        const model = {};
        this._app.kitFields
            .filter(field => field.model && field.name in this)
            .forEach(field => model[field.name] = this[field.name]);
        return model;
    },

    // ################################################
    //
    // ################################################

    /**
     * Окно закрыто
     */
    closed() {

        console.log('event close window', this.id);
        this.modify.destroy();

        this._app.kitCollect.removeItem(this.id);
        if (this._itemKey) {
            this._app.storeOpen.moveToRecent(this._itemKey);
        }
    },

    /**
     * setter Установить имя окна
     * @param {string} name
     * @returns {object}
     */
    setName(name) {
        if (name !== this.name) {
            this.name = name;
            this.modify();
        }
        return this;
    },

    /**
     * getter название окна
     * @return {string}
     */
    getName() {
        return this.name;
    }

};
