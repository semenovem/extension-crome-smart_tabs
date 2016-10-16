/**
 * @type {object} создание новой вкладки
 *
 * todo не готов метод, не использовать
 */
app.browserApi.tabs.create = function(model) {
    const createData = this.recordKitToOpen(model);



    let timer;
    return new Promise((resolve, reject) => {
        timer = setTimeout(
            reject,
            this._app.setup.get('browserApi.tab.create.resetQuery')
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
