/**
 * @type {object} обмен данными с клиентскими скриптами
 */
app.controllerMsg = {
    // <debug>
    $className: 'controllerMsg',

    /**
     * @type {object} the application object
     */
    _app: null,
    // </debug>

    /**
     * Указать контекст для метода
     *
     */
    init() {
        this._onMessage = this._onMessage.bind(this);
    },

    /**
     * Сообщения от вкладок
     */
    enable() {
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

        //console.log ('controllerMsgPopup', request, sender);

        const handler = this._app.getMsgHandler(request.method);

        // <dedug>
        typeof handler === 'function' || console.error('handler может быть только функцией', handler);
        // todo здесь обработать исключение - страница запросила неизвестный метод
        // </debug>

        if (handler) {
            handler.call(
                this._app,
                request.params
            )
                .then(this._success.bind(this, callback))
                .catch(this._error.bind(this, callback));

            return true;
        }

        this._error(callback, 'Нет метода: ' + request.method);
        return false;
    },

    /**
     * Подготовка ответа для клиента
     * @param {function} callback
     * @param {*} body данные
     * @private
     */
    _success(callback, body) {
        callback({
            success: true,
            body
        });
    },

    /**
     * Вернуть ответ ошибки
     * @param {function} callback
     * @param {*} body данные
     */
    _error(callback, body) {
        callback({
            success: false,
            error: body
        });
    }
};
