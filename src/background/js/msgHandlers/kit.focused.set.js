/**
 * Установить фокус окну браузера
 * context = app
 *
 * @param {object} params    { kitId: {number}, focused: {boolean} }
 * @return {Promise.<{ focused: {boolean} }>}
 */
app.defineMsgHandler('kit.focused.set', function(params) {
    const kit = this.kitCollect.getById(+params.kitId);
    const focused = Boolean(params.focused);

    if (kit) {
        return app.browserApi.windows.update(
            kit.getId(),
            {
                focused
            }
        )
            .then(kitView => {
                return {
                    focusedNew: kitView.focused
                }
            });
    }
    return Promise.reject();
});
