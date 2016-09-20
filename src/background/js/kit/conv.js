/**
 * @type {object} конвертация данных
 */
app.kitConv = {
    // <debug>
    $className: 'kitConv',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Создать объект для открытия браузером нового окна
     * @param {object} raw
     * @return {object}
     */
    toOpen(raw) {
        const prop = Object.create(null);
        this._app.KitItem.prototype.fields
            .filter(field => field.toOpen && field.name in raw)
            .forEach(field => {
                const name = field.name;
                prop[name] = raw[name];
            });

        // массив строк с адресами вкладок url
        prop.url = raw.tabs
            .filter(tab => !tab.closed)
            .map(tab => tab.url);
        return prop;
    },


    /**
     * Конвертация объекта события "создание вкладки"
     * @param {*} event объект события создания вкладки
     * @return {object|null}
     */
    onCreatedTab(event) {
        return event && typeof event === 'object' &&
            this.validateRaw(
                this.normalize({
                    id: event.windowId,
                    left: event.left,
                    top: event.top,
                    width: event.width,
                    height: event.height
                })
            ) || null;
    },

    /**
     * Конвертация объекта события "создание окна"
     * @param {*} event объект события создания вкладки
     * @return {object|null}
     */
    onCreatedKit(event) {
        return event && typeof event === 'object' &&
            this.validateRaw(
                this.normalize({
                    id: event.id,
                    //   focused: event.focused,
                    left: event.left,
                    top: event.top,
                    width: event.width,
                    height: event.height,
                    //state: event.state,
                    //type: event.type,

                    tabs: this._app.tabConv.onCreatedKit(event)
                })
            ) || null;
    },











    // ################################################
    // валидация, экспорт/импорт
    // ################################################

    /**
     * Приведение полей в соответствие с типом
     * @param {object} obj объект, у которого изменяем поля
     * @return {*}
     */
    normalize(obj) {
        if (obj && typeof obj === 'object') {
            this._app.KitItem.prototype.fields
                .filter(field => field.name in obj && typeof field.normalize === 'function')
                .forEach(field => {
                    const name = field.name;
                    obj[name] = field.normalize(obj[name]);
                });
            // вкладки
            if (Array.isArray(obj.tabs)) {
                obj.tabs = obj.tabs
                    .map(tab => this._app.tabConv.normalize(tab))
                    .filter(tab => tab);
            }
        }
        return obj || null;
    },

    /**
     * Валидация данных, из которых впоследствии будет создаваться экземпляр класса KitItem
     * @param {object} raw
     * @return {object|null}
     */
    validateRaw(raw) {
        const valid = raw && typeof raw === 'object' &&
            this.validateTypeFields(raw) &&
            this._app.KitItem.prototype.fields
                .filter(field => field.requireNew === true)
                .every(field => raw[field.name]) &&
                // вкладки
            (!Array.isArray(raw.tab) || raw.tabs.every(tab => this._app.tabConv.validateRaw(tab)));
        return valid ? raw : null;
    },

    /**
     * Валидация данных, сохраненных ранее
     * @param {object} raw
     * @return {object|null}
     */
    validateSaving(raw) {
        const valid = raw && typeof raw === 'object' &&
            this.validateTypeFields(raw) &&
            this._app.KitItem.prototype.fields
                .filter(field => field.requireSaving === true)
                .every(field => raw[field.name]) &&
                // вкладки обязательны при сохранениях
                raw.tabs.every(tab => this._app.tabConv.validateSaving(tab));
        return valid ? raw : null;
    },




    /**
     * Проверка типов полей
     * @param {object} raw
     * @return {boolean}
     */
    validateTypeFields(raw) {
        return this._app.KitItem.prototype.fields
            .filter(field => 'type' in field && field.name in raw)
            .every(field => field.type === typeof raw[field.name]);
    },




    // объединение (добавление) свойств к объекту
    conjunction(target, source) {
        target = Object.assign(target);
        this._app.KitItem.prototype.fields
            .filter(field => field.conjunction && field.name in source)
            .forEach(field => {
                const name = field.name;
                target[name] = source[name];
            });
        //
        //// вкладки
        //if (Array.isArray(source.tabs)) {
        //    target.tabs
        //}


        return target;
    },





};



