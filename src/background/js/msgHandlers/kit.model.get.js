/**
 * Получение данных по окну
 * context = app
 *
 * @param {object} params { kitId: {number} }
 * @return {Promise<object>} модель окна
 */
app.defineMsgHandler('kit.model.get', function(params) {
    const kit = this.kitCollect.getById(+params.kitId);

    if (kit) {
        return kit.getView().then(kit.getModel);
    }

    return Promise.reject();
});
