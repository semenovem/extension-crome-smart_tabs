/**
 * @type {object} cинхронизация состояний окон и сохраненных данных
 */
app.controllerSynx = {
    // <debug>
    $className: 'controlleSynx',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Синхронизация с открытыми окнами/вкладками и сохраненными данными
     * @return {Promise}
     */
    all() {
        return this._app.browserApi.kitAll()
            .then(kitRawAll => {

                return kitRawAll
                    .map(kitRaw => {
                        const collect = this._app.kitCollect;
                        const kit = collect.getById(kitRaw.id) || collect.createItem(kitRaw);

                        kitRaw.tabs
                            .forEach(tabRaw => {
                                const collect = this._app.tabCollect;
                                (collect.getById(tabRaw.id) || collect.createItem(tabRaw))
                                    .setKit(kit);
                            });
                        return kit;
                    });
            })
            // ожидание готовности
            .then(kits => {
                return Promise.all(
                    kits.map(kit => kit.getCondition())
                );
            })
            .catch(e => {
                console.warn('controllerSynx.openedKits', e);
                console.warn('Не удалось получение текущего состояния открытых окон и вкладок');
            });
    },



    // синхронизация открытого окна по id
    // используем в случае, когда событие браузерного api возвращает неизвестный id
    kit(id) {
        this._app.browserApi.kit(id)
            .then(r => {
                console.log ('ttt', r);
            });



        return new Promise(resolve => {

            resolve();
        })
    },


    // синхронизация вкладки по ее id
    tab(id) {
        return new Promise(resolve => {

            resolve();
        })
    }
};
