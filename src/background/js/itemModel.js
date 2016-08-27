/**
 *
 * @class app.ItemModel
 */
app.itemModel = {
    // <debug>
    $className: 'itemModel',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     *
     * @param {object} raw
     * @returns {boolean}
     */
    validateToCreate(raw) {
        return raw && typeof raw === 'object'
            && this.validateTypeFields(raw)
            && this.fields
                .filter(field => field.requireForCreate === true)
                .every(field => field.name in raw);
    },

    /**
     * Обязательные поля для исходного объекта, из которого создается экземпляр
     * @param {object} raw
     * @returns {boolean}
     */
    validateAfterRestore(raw) {
        return raw && typeof raw === 'object'
            && this.validateTypeFields(raw)
            && this.fields
                .filter(field => field.requireForRaw === true)
                .every(field => raw[field.name]);
    },


    /**
     * Проверить тип полей
     * @param {object} raw
     * @returns {boolean}
     */
    validateTypeFields(raw) {
        return this.fields
            .filter(field => 'type' in field && field.name in raw)
            .every(field => field.type === typeof raw[field.name]);
    }
};
