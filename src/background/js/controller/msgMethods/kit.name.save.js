/**
 * сохранение измененного названия окна
 * @param {object} params
 * @param {function} callback
 */
app.defineProp('controllerMsg.methods.kit.name.save', function(params, callback) {
    const name = params.name;
    const kit = this._app.kitCollect.getById(+params.kitId);
    let valid;

    if (kit && typeof name === 'string') {

        valid = true;
        kit.setName(name)
            .save(name)
            .then(() => {
                this._success({
                    nameNew: kit.getName()
                }, callback);

            })
            .catch(failure.bind(this));
    }

    if (!valid) {
        failure.call(this, params);
    }

    return valid ? true : false;

    function failure(e) {
        this._failure('Не удалось сохранить название окна', callback);
        this._app.log('Не удалось сохранить название окна', e);
    }
});