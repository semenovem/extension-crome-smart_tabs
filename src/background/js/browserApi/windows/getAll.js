/**
 * @type {object} получение данных всех открытых окон
 *
 * @param {object} [params] параметры
 * @return {Promise.<app.dto.KitView[]>}
 */
app.browserApi.windows.getAll = function(params) {
    let timer;

    // параметры по умолчанию
    const paramsOrig = {
        populate: false
    };

    const queryParams = params ? Object.assign(paramsOrig, params) : paramsOrig;

    return new Promise((resolve, reject) => {
        timer = setTimeout(
            reject,
            this._app.setup.get('browserApi.windows.getAll.resetQuery')
        );

        window.chrome.windows.getAll(queryParams, resolve);
    })
        .then(this.convDtoArrKitView)
        .catch(e => {
            throw 'Данные окон не прошли валидацию' + e;
        })
};
