/**
 * Получение данных по окну
 * @param {object} params
 * @param {function} callback
 */
app.defineProp('controllerMsg.methods.kit.get.recent', function(params, callback) {
    let valid;
    const kit = this._app.kitCollect.getById(+params.kitId);

    if (kit) {
        valid = true;
        kit.getView()
            .then(kit.getModel)
            .then(model => {

                this._success({
                    model: model
                }, callback);

            })
            .catch(failure.bind(this));
    }

    if (!valid) {
        failure.call(this, params);
    }

    return valid ? true : false;

    function failure(e) {
        this._failure('Не удалось получить данные окна', callback);
        this._app.log('Не удалось получить данные окна', e);
    }
});

//
///*
//
// /**
// * Данные недавно закрытых окон для demo
// * @param [params]
// * @returns {Promise.<T>}
// * @private
// */
//_kitRecent(params) {
//    return this._app.storeRecent.getRecords()
//        .then(records => records.map(record => {
//                record.demoKit = this._app.kitConv.storedToDemo(record.storedKit);
//                delete record.storedKit;
//                return record;
//            })
//        );
//}
// */
