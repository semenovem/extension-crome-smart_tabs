/**
 * Получить информацию по окну
 *
 * @param {number} kitId идентификатор окна
 * @param {object} [params] параметры
 * @return {Promise.<app.dto.KitView|app.dto.KitTabView>}
 */
app.browserApi.windows.get = function(kitId, params) {
    let timer;

    // параметры по умолчанию
    const paramsOrig = {
        populate: true
    };

    const queryParams = params ? Object.assign(paramsOrig, params) : paramsOrig;

    return new Promise((resolve, reject) => {
        timer = setTimeout(
            reject,
            this._app.setup.get('browserApi.windows.get.resetQuery')
        );

        window.chrome.windows.get(kitId, queryParams, resolve);
    })
        .then(kitEvent => {
            clearTimeout(timer);
            return queryParams.populate ? this.convDtoKitTabView(kitEvent) : this.convDtoKitView(kitEvent);
        })
        .catch(e => {
            console.error('--', e);
            throw '--' + e;
        })
};
