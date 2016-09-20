/**
 * @type {object} конвертация данных
 */
app.tabConv = {
    // <debug>
    $className: 'tabConv',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Конвертация объекта события "создание вкладки"
     * @param {*} event объект события создания вкладки
     * @return {object|null}
     */
    onCreatedTab(event) {
        let tabRaw;

        if (event && typeof event === 'object') {
            tabRaw = this.validateRaw(
                this.normalize({
                    id: event.id,
                    //active: event.active,
                    //audible: event.audible,
                    favIconUrl: event.favIconUrl,
                    //highlighted: event.highlighted,
                    //incognito: event.incognito,
                    //index: event.index,
                    //pinned: event.pinned,
                    //selected: event.selected,
                    //status: event.status,
                    title: event.title,
                    url: event.url
                })
            );
        }
        return tabRaw || null;
    },



    /**
     * Конвертация объекта события "создание окна"
     * @param {*} event объект события создания вкладки
     * @return {object|null}
     */
    onCreatedKit(event) {
        let tabsRaw;

        if (event && typeof event === 'object' && Array.isArray(event.tabs)) {
            tabsRaw = event.tabs
                .map(this.onCreatedTab)
                .filter(tab => tab);
        }
        return tabsRaw || [];
    },









    // ################################################
    // валидация, экспорт/импорт
    // ################################################

    /**
     * Приведение полей в соответствие с типом
     * @param {object} obj объект, у которого изменяем поля
     */
    normalize(obj) {
        if (obj && typeof obj === 'object') {
            this._app.TabItem.prototype.fields
                .filter(field => field.name in obj && typeof field.normalize === 'function')
                .forEach(field => {
                    const name = field.name;
                    obj[name] = field.normalize(obj[name]);
                });
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
            this._app.TabItem.prototype.fields
                .filter(field => field.requireNew === true)
                .every(field => raw[field.name]);
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
            this._app.TabItem.prototype.fields
                .filter(field => field.requireSaving === true)
                .every(field => raw[field.name]);
        return valid ? raw : null;
    },

    /**
     * Проверка типов полей
     * @param {object} raw
     * @returns {boolean}
     */
    validateTypeFields(raw) {
        return this._app.TabItem.prototype.fields
            .filter(field => 'type' in field && field.name in raw)
            .every(field => field.type === typeof raw[field.name]);
    },




    // объединение (добавление) свойств к объекту
    conjunction(target, source) {
        target = Object.assign(target);
        this._app.TabItem.prototype.fields
            .filter(field => field.conjunction && field.name in source)
            .forEach(field => {
                const name = field.name;
                target[name] = source[name];
            });

        // вкладки


        return target;
    },



};



