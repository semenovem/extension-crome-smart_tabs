/**
 * Закрытие окна
 * @context app
 *
 * @param {object} params { kitId: {number} }
 * @return {Promise<>}
 */
app.defineMsgHandler('kit.remove', function(params) {
    const kit = this.kitCollect.getById(+params.kitId);

    if (kit) {
        return app.browserApi.windows.remove(kit.getId())
            .catch(() => {
                throw 'Ошибка при закрытии окна';
            });
    }

    return Promise.reject();
});