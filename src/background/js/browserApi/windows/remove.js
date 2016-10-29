/**
 * Закрытие окна браузера
 * @param {number} kitId
 */
app.browserApi.windows.remove = function(kitId) {
    let timer;

    return new Promise((resolve, reject) => {
        timer = setTimeout(
            reject,
            this._app.setup.get('browserApi.windows.remove.resetQuery')
        );

        window.chrome.windows.remove(kitId, resolve);
    })
        .then(() => clearTimeout(timer));
};
