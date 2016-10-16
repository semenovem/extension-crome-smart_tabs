/**
 * @type {object} работа со вкладками
 *
 *
 */
app.browserApi.runtime = {
    // <debug>
    $className: 'browserApi.runtime',

    /**
     * @type {object} объект приложения
     */
    _app: null,

    /**
     * Слушать сообщения от вкладок
     */
    onMessage: null,


    // </debug>

    /**
     * Получение настроек
     * Добавить обработчик для события браузера
     */
    init() {
        this._app.executionInits.call(this, this._app);
    },






    // ################################################
    // конвертация для передачи вкладкам
    // ################################################

    /**
     * Конвертирование данных в вид для frontend
     * @param {object} obj
     * @return {object}
     */

    // todo переделать фомирование данных для фронтенда

    storedToDemo(obj) {
        const newObj = Object.create(null);
        this._app.kitFields
            .filter(field => field.name in obj && field.demo)
            .forEach(field => {
                const name = field.name;
                newObj[name] = obj[name];
            });
        // вкладки
        newObj.tabs = obj.tabs.map(tab => tab);
        return newObj;
    }

};
