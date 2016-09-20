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
    openedKits() {
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
    }








};
