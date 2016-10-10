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
                    .map(this._app.tabConv.normalize)
                    .filter(tab => tab);
            }
            return obj
        }
        return null;
    },

    /**
     * Валидация объекта события браузерного api
     * @param {object} raw
     * @return {object|null}
     */
    validateEvent(raw) {
        const valid = raw &&
            typeof raw === 'object' &&
            this._app.KitItem.prototype.fields
                .filter(field => field.requireEvent === true)
                .every(field => raw[field.name]) &&
                // вкладки
            (!Array.isArray(raw.tabs) || raw.tabs.every(this._app.tabConv.validateEvent));
        return valid ? raw : null;
    },

    /**
     * Валидация сохраненных данных
     * @param {object} raw
     * @return {object|null}
     */
    validateStored(raw) {
        const valid = raw &&
            typeof raw === 'object' &&
            this._validateTypeFields(raw) &&
            this._app.KitItem.prototype.fields
                .filter(field => field.requireStored === true)
                .every(field => raw[field.name]) &&
                // вкладки обязательны при сохранениях
            Array.isArray(raw.tabs) &&
            raw.tabs.every(tab => this._app.tabConv.validateStored(tab)) &&
            raw.tabs.length;
        return valid ? raw : null;
    },

    /**
     * Проверка типов полей
     * @param {object} raw
     * @return {boolean}
     */
    _validateTypeFields(raw) {
        return this._app.KitItem.prototype.fields
            .filter(field => 'type' in field && field.name in raw)
            .every(field => field.type === typeof raw[field.name]);
    },

    // ################################################
    // Конвертация данных для/после сохранения
    // ################################################

    /**
     * Получить данные в виде строки для сохранения
     * @returns {string|null}
     */
    serialization(raw) {
        let text;
        try {
            text = JSON.stringify(raw);
        }
        catch (e) {
            text = null;
            this._app.log({
                name: 'Не удалось преобразовать в json',
                event: e
            });
        }
        return text;
    },

    /**
     * Достаем данные из сохранения
     * @return {string|null}
     */
    unserialization(text) {
        let storedKit;
        try {
            storedKit = this._app.kitConv.validateStored(
                this._app.kitConv.normalize(
                    JSON.parse(text)
                )
            );
            if (!storedKit) {
                throw 'объект не проходит валидацию!';
            }
        }
        catch (e) {
            this._app.log({
                name: '',
                event: e,
                deb: storedKit
            });
            storedKit = null;
        }
        return storedKit;
    },

    // ################################################
    // конвертация для передачи вкладкам
    // ################################################

    /**
     * Конвертирование данных в вид для frontend
     * @param {object} obj
     * @returns {object}
     */
    storedToDemo(obj) {
        const newObj = Object.create(null);
        this._app.KitItem.prototype.fields
            .filter(field => field.name in obj && field.demo)
            .forEach(field => {
                const name = field.name;
                newObj[name] = obj[name];
            });
        // вкладки
        newObj.tabs = obj.tabs.map(this._app.tabConv.storedToDemo);
        return newObj;
    }

};



