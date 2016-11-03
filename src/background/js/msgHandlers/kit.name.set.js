/**
 * Cохранение измененного названия окна
 * валидация:
 * проверить превышение максимальной длинны строки
 * @context app
 * @param {object} params { kitId: {number}, name: {string} }
 * @return {Promise<string>} название окна
 */
app.defineMsgHandler('kit.name.set', function(params) {
    const name = params.name;
    const kit = this.kitCollect.getById(+params.kitId);

    if (kit && typeof name === 'string') {

        // validation
        if (name.length > this.setup.get('kit.name.maxLength')) {
            return Promise.reject('Превышена максимальная длинна строки');
        }

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