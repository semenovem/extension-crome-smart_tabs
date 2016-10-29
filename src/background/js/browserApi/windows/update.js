/**
 * @param {number} kitId идентификатор окна
 * @param {object} [params] параметры
 * @return {Promise.<object>}
 */
app.browserApi.windows.update = function(kitId, params) {
    let timer;

    // todo сделать нормальное преобразование входных данных в формат браузерного api

    const dataUpdate = {};

    if ('state' in params) {
        dataUpdate.state = params.state;
    }

    if ('focused' in params) {
        dataUpdate.focused = params.focused;
    }
    // далее добавлять параментры запроса к browser api


    return new Promise((resolve, reject) => {
        timer = setTimeout(
            reject,
            this._app.setup.get('browserApi.windows.update.resetQuery')
        );

        window.chrome.windows.update(kitId, dataUpdate, resolve);
    })
        .then(kitEvent => {
            clearTimeout(timer);

            const kitView = this.conv(kitEvent);
            if (kitView) {
                return kitView;
            } else {
                throw {
                    name: 'Данные окна не прошли валидацию'
                };
            }
        });
};
