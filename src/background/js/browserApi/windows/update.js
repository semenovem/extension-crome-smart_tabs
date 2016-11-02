/**
 * @param {number} kitId идентификатор окна
 * @param {object} [params] параметры
 * @return {Promise.<object>}
 */
app.browserApi.windows.update = function(kitId, params) {
    let timer;

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
        .then(this.convDtoKitView)
        .catch(e => {
            console.error('--', e);
            throw '--' + e;
        })
};
