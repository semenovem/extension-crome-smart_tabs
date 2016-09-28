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
     *
     */
    init() {
        this._app.binding(this);
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
    validateEvent(raw) {
        const valid = raw && typeof raw === 'object' &&
            this._validateTypeFields(raw) &&
            this._app.TabItem.prototype.fields
                .filter(field => field.requireEvent === true)
                .every(field => raw[field.name]);
        return valid ? raw : null;
    },

    /**
     * Валидация сохраненных данных
     * @param {object} raw
     * @return {object|null}
     */
    validateStored(raw) {
        const valid = raw && typeof raw === 'object' &&
            this._validateTypeFields(raw) &&
            this._app.TabItem.prototype.fields
                .filter(field => field.requireStored === true)
                .every(field => raw[field.name]);
        return valid ? raw : null;
    },

    /**
     * Проверка типов полей
     * @param {object} raw
     * @returns {boolean}
     */
    _validateTypeFields(raw) {
        return this._app.TabItem.prototype.fields
            .filter(field => 'type' in field && field.name in raw)
            .every(field => field.type === typeof raw[field.name]);
    },

};



