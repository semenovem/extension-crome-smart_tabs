/**
 * Cохранение измененного названия окна
 * context = app
 *
 * @param {object} params { kitId: {number}, name: {string} }
 * @return {Promise<string>} название окна
 */
app.defineMsgHandler('kit.name.save', function(params) {
    const name = params.name;
    const kit = this.kitCollect.getById(+params.kitId);

    if (kit && typeof name === 'string') {

        return kit.setName(name)
            .save(name)
            .then(() => {
                return {
                    nameOld: name,
                    nameNew: kit.getName()
                }
            })
            .catch(() => {
                throw 'Не удалось сохранить название окна';
            });
    }

    return Promise.reject();
});