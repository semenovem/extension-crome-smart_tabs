/**
 * объект сообщений для передачи / получения данных с фоновой страницей расширения
 *
 *
 * @public
 * get
 *
 *
 *
 * @type {object}
 */
function Message(pageName) {

    this._page = pageName;

    // проверка доступности объекта


    // chrome.runtime.sendMessage
}

/**
 *
 * @type {object}
 */
Message.prototype = {

    /**
     * публичный метод для выполнения запроса к фоновой странице
     * @param {string} method какой метод вызывается
     * @param {object} params объект с параметрами
     * @return {Promise.<T>}
     */
    msg(method, params) {

        return this._request(
            {
                page: this._page,
                method: method,
                params: params
            }
        );
    },

    /**
     *
     * @param request
     * @returns {Promise}
     * @private
     */
    _request(request) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(request, resolve);

            //
        })
            .then(this._response);
    },

    /**
     * Валидация / обработка ответа
     * @param {*} data
     * @private
     */
    _response(data) {
        console.log ('обработка ответа от backend', data);

        return data;
    }



};
