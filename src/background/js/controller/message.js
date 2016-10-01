/**
 * @type {object} коммуникация со вкладками
 */
app.controllerMessage = {
    // <debug>
    $className: 'controllerMessage',

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

    /**
     * Сообщения от вкладок
     */
    add() {
        window.chrome.runtime.onMessage.addListener(this._onMessage);
    },

    /**
     * Обработчик события
     * @param request данные, переданные вызывающим скриптом
     * @param sender кто создал сообщение
     * @param sendResponse метод, который нужно вызвать, когда будет готов ответ
     * @return {boolean} тип ответа асинхронный (true) / синхронный (false)
     * @private
     */
    _onMessage(request, sender, sendResponse) {
        let sendType = true;

        console.log(request, sender);

        if (request && typeof request === 'object') {
            const name = request.name;
            const opts = request.opts;

            switch (name) {

                // недавно закрытые окна
                case 'kitRecent':
                    this._kitRecent().then(sendResponse);
                    break;

                default:
                    sendType = false;
                    sendResponse({
                        msg: 'Нет метода, который вызывался'
                    });
            }
        }

        return sendType;
    },

    /**
     * Данные недавно закрытых окон для demo
     * @param [opts]
     * @returns {Promise.<T>}
     * @private
     */
    _kitRecent(opts) {
        return this._app.storeRecent.getRecords()
            .then(records => records.map(record => {
                    record.demoKit = this._app.kitConv.storedToDemo(record.storedKit);
                    delete record.storedKit;
                    return record;
                })
            );
    }

};
