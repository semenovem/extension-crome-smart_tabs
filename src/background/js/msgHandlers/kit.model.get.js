/**
 * Получение данных по окну
 * @context app
 *
 * @param {object} params { kitId: {number} }
 * @return {Promise.<app.dto.kitTabModel>} модель окна
 */
app.defineMsgHandler('kit.model.get', function(params) {
    const kit = this.kitCollect.getById(+params.kitId);

    if (kit) {
        return kit.getModel();
    }

    return Promise.reject();
});
