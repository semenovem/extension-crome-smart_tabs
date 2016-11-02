/**
 *
 * @context app.browserApi.windows
 *
 * @type {app.dto.kitTabModel} создание нового окна браузера
 * @return {Promise.<app.dto.KitTabView>}
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
        .then(this.convDtoKitTabView)
        .catch(e => {
            console.error('--', e);
            throw 'error' + e;
        })
};
