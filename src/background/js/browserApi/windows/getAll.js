/**
 * @type {object} получение данных всех открытых окон
 *
 * @param {object} [params] параметры
 * @return {Promise.<Array>}
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
        .then(kitsEvent => {
            clearTimeout(timer);

            const views = kitsEvent
                .map(kitsEvent => this.conv(kitsEvent))
                .filter(kitView => kitView);

            if (!views.length) {
                throw {
                    name: 'Данные всех окон не прошли валидацию'
                };
            }
            return views;
        });
};
