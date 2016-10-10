/**
 * @type {object} получение данных всех открытых окон
 *
 * @return {Promise.<Array>}
 */
app.browserApi.windows.getAll = function() {
    let timer;

    const queryParams = {
        populate: false
    };

    return new Promise((resolve, reject) => {
        timer = setTimeout(
            reject,
            this._app.setup.get('browserApi.windows.getAll.resetQuery')
        );

        window.chrome.windows.getAll(queryParams, resolve);
    })
        .then(kitsEvent => {
            clearTimeout(timer);

            const kitsView = kitsEvent
                .map(kitsEvent =>  this.conv(kitsEvent))
                .filter(eKit => eKit);

            if (!kitsView.length) {
                throw {
                    name: 'Данные всех окон не прошли валидацию'
                };
            }
            return kitsView;
        });
};
