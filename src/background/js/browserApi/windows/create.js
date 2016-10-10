/**
 * @type {object} создание нового окна браузера
 *
 */
app.browserApi.windows.create = function(recordKit) {
    const createData = this.recordKitToOpen(recordKit);
    let timer;
    return new Promise((resolve, reject) => {
        timer = setTimeout(
            reject,
            this._app.setup.get('browserApi.windows.create.resetQuery')
        );

        window.chrome.windows.create(createData, resolve);
    })
        .then(eDataKit => {
            clearTimeout(timer);

            const eKit = this.conv(eDataKit);
            if (eKit && Array.isArray(eDataKit.tabs)) {
                eKit.tabs = this._app.browserApi.tabs.convAll(eDataKit.tabs);
            }

            if (eKit && eKit.tabs.length) {
                return eKit;
            } else {
                throw {
                    name: 'Данные окна не прошли валидацию'
                };
            }
        });
};
