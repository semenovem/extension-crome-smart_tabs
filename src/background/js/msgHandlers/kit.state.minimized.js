/**
 * Сворачивание окна браузера
 * context = app
 *
 * @param {object} params { kitId: {number} }
 * @return {Promise<{Object}>} kitView
 */
app.defineMsgHandler('kit.state.minimized', function(params) {
    const kit = this.kitCollect.getById(+params.kitId);

    if (kit) {
        // todo добавить проверку - если состояние окна уже свернуто



        return app.browserApi.windows.update(
            kit.getId(),
            {
                state: 'minimized'
            }
        )
            .then(kitView => {
                kit.modify();
                return {
                    stateNew: kitView.state
                }
            });
    }
    return Promise.reject();
});
