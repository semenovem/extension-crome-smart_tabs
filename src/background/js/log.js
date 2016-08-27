/**
 * logs, processing errors
 * @class app.Log
 */
app.log = {
    // <debug>
    $className: 'Log',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Инициализация объекта
     */
    init() {},

    /**
     * Регистрация ошибки
     * @param data
     * @returns {*}
     */
    error(data) {

        console.log('log.error: ', data);

        return data;
    },

    /**
     * сообщение
     * @param data
     */
    msg(data) {
        console.log('log.msg: ', data);
    }
};



