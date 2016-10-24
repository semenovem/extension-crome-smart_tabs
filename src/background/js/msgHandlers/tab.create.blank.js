/**
 * Создание пустого окна
 * @param {object} params
 * @param {function} callback
 */
app.defineMsgHandler('tab.create.blank', function(params, callback) {
    let valid = true;

    window.chrome.tabs.create(
        {
            url: 'chrome-extension://ekekhdhcpbbhfldpaoelpcpebkcmnkjh/blank.html',
            active: false
        }
    );

    this._success({}, callback);

    return valid ? true : false;

    function failure(e) {
        this._failure('Не удалось получить данные окна', callback);
        this._app.log('Не удалось получить данные окна', e);
    }
});
