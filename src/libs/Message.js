/**
 * Объект сообщений для передачи / получения данных с фоновой страницей расширения
 *
 * @return {function}
 */
function Message(page) {
    /**
     * Выполнение запроса к фоновой странице
     * @param {string} method какой метод вызывается
     * @param {object} [params] объект с параметрами
     * @return {Promise.<*>}
     *
     *
     */
    function msg(method, params) {
        return new Promise((resolve, reject) => {
            const callback = prepResponse.bind(null, resolve, reject);
            setTimeout(callback, 2000);
            chrome.runtime.sendMessage(
                prepProps(method, params),
                callback
            );
        });
    }


    // ################################################
    // статические методы
    // ################################################

    // пока нет

    return msg;


    // ################################################
    // приватные методы
    // ################################################

    /**
     * Подготовка параметров для запроса
     * @param {string} method
     * @param {object} [params]
     * @return {object}
     */
    function prepProps(method, params) {
        const result = {
            page,
            method
        };
        if (params) {
            result.params = params;
        }
        return result;
    }


    /**
     * Валидация / обработка ответа
     * @param {function} resolve успешное выполнение промиса
     * @param {function} reject  промис с ошибкой
     * @param {*} [data] данные от расширения
     * @private
     */
    function prepResponse(resolve, reject, data) {
        if (data && typeof data === 'object' && Array.isArray(data) === false && data.success) {

            resolve(data.body);
        } else {

            reject(data);
        }
    }
}
