/**
 * @type {object} создание нового окна браузера
 *
 */
app.browserApi.windows.create = function(model) {
    const createData = this.recordKitToOpen(model);
    let timer;
    return new Promise((resolve, reject) => {
        timer = setTimeout(
            reject,
            this._app.setup.get('browserApi.windows.create.resetQuery')
        );

        window.chrome.windows.create(createData, resolve);
    })
        .then(kitEvent => {
            clearTimeout(timer);

            const view = this.conv(kitEvent);

            if (view && view.tabs) {
                return view;
            } else {
                throw {
                    name: 'Данные окна не прошли валидацию'
                };
            }
        });
};
