/**
 * @type {object} обмен данными с пустой страницей
 * такую страницу загружаем, подменяя настоящую вкладку, когда открывается новое окно
 * что бы не загружать данные до момента, пока вкладка не получит фокус (не будет открыта пользователем)
 */
app.controllerMessageBlank = {
    // <debug>
    $className: 'controllerMessageBlank',

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
        this._app.browserApi.runtime.onMessage.addListener('blank', this._onMessage);
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

        const tabId = +this._app.util.getDeepProp('tab.id', sender).value;


        if (!tabId || typeof tabId !== 'number' || !isFinite(tabId) || tabId < 0) {
            sendResponse({
                msg: 'ошибка в аргументах'
            });
            return false;
        }


        console.log (tabId, sender);

        switch (request.method) {

            // данные вкладки title & favicon
            case 'getConfig':
                this._getConfig(tabId).then(sendResponse);
                break;

            //
            //case 'blank':
            //
            //
            //    break;



            default:
                sendType = false;
                sendResponse({
                    msg: 'Нет метода: ' + request.method
                });
        }

        return sendType;
    },

    /**
     * Получение данных по вкладке
     * @param {number} tabId
     * @private
     */
    _getConfig(tabId) {

        return new Promise(resolve => {

            const tab = this._app.tabCollect.getById(tabId);

            console.log ('!! tab ', tab);

            resolve({
                title: 'title',
                favicon: 'favicon'
            });
        });

    },









    /**
     * Данные недавно закрытых окон для demo
     * @param [params]
     * @returns {Promise.<T>}
     * @private
     */
    _kitRecent(params) {
        return this._app.storeRecent.getRecords()
            .then(records => records.map(record => {
                    record.demoKit = this._app.kitConv.storedToDemo(record.storedKit);
                    delete record.storedKit;
                    return record;
                })
            );
    }

};
