/**
 * @type {object} cинхронизация состояний окон и сохраненных данных
 */
app.controllerSync = {
    // <debug>
    $className: 'controlleSync',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     *
     */
    init() {
        this._app.binding(this);
    },

    /**
     * Синхронизировать все окна
     * @return {Promise<>}
     */
    all() {
        return this._app.browserApi.getKitAll()
            .then(eKits => eKits.map(eKit => {
                    const collect = this._app.kitCollect;
                    return collect.getById(eKit.id) || collect.createItem(eKit);
                })
            )
            // ожидание готовности окон - когда их состояние станет resolve
            .then(kits => Promise.all(
                kits.map(kit => kit.ready())
                )
            )
            .catch(e => {
                console.warn('controllerSync.openedKits', e);
                console.warn('Не удалось получение текущего состояния открытых окон и вкладок');
            });
    },

    /**
     * Синхронизация окно по id
     * используем в случае, когда событие браузерного api возвращает неизвестный id
     * или перед сохранением
     * @param  {object} kit модель окна @class KitItem
     * @return {Promise.<>}
     */
    kit(kit) {
        return this._app.browserApi.getKit(kit.getId())
            .then(eKit => {
                const kit = this._app.kitCollect.getById(eKit.id) || this._app.kitCollect.createItem(eKit);
                kit.setState(eKit);

                // синхронизация вкладок
                return eKit.tabs.map(eTab => {
                    const tab = this._app.tabCollect.getById(eTab.id) || this._app.tabCollect.createItem(eTab);
                    tab.setState(eTab);  // todo вызвать метод только, если объект уже существует
                    return tab;
                });
            });
    },

    /**
     * Синхронизация вкладки по ее id
     * @param {number} id
     * @return {Promise.<>}
     */
    tab(id) {
        return this._app.browserApi.getTab(id)
            .then(eTab => {
                const kit = this._app.kitCollect.getById(eTab.windowId) ||
                    this._app.kitCollect.createItem({id:eTab.windowId});
                kit.modify();      // todo вызвать метод только, если объект уже существует

                const tab = this._app.tabCollect.getById(eTab.id) || this._app.tabCollect.createItem(eTab);
                tab.setState(eTab); // todo вызвать метод только, если объект уже существует
            });
    },

};
