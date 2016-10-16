/**
 * @type {object} обмен данными с клиентскими скриптами
 */
app.controllerMsg = {
    // <debug>
    $className: 'controllerMsg',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Вызываемые методы
     * все методы имеют this === этот объект
     *
     */
    methods: {},

    /**
     *  Биндинг методов объекта
     *  Биндинг методов на всех уровнях вложенности methods
     *
     */
    init() {
        this._app.binding(this);
        this._app.recursiveBinding(this.methods, this);
    },

    /**
     * Сообщения от вкладок
     */
    add() {
        this._app.browserApi.runtime.onMessage.addListener(this._onMessage);
    },

    /**
     * Обработчик события
     * @param request данные, переданные вызывающим скриптом
     * @param sender кто создал сообщение
     * @param callback метод, который нужно вызвать, когда будет готов ответ
     * @return {boolean} тип ответа асинхронный (true) / синхронный (false)
     * @private
     */
    _onMessage(request, sender, callback) {
        const { exist, value } = this._app.util.getDeepProp(request.method, this.methods);

     //   console.log ('controllerMsgPopup', request, sender);

        if (exist && typeof value === 'function') {
            return value(request.params, callback);
        }

        callback({
            error: 'Нет метода: ' + request.method
        });
        return false;
    },

    /**
     * Подготовка ответа для клиента
     * @param {*} body данные
     * @param {function} callback
     * @private
     */
    _success(body, callback) {
        callback({
            success: true,
            body
        });
    },

    /**
     * Вернуть ответ ошибки
     * @param {string} error текст сообщения
     * @param {function} callback
     */
    _failure(error, callback) {
        callback({
            success: false,
            error
        });
    }
};
