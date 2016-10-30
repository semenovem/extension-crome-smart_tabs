/**
 * @type {object} cинхронизация состояний окон и сохраненных данных
 */
app.sync = {
    // <debug>
    $className: 'sync',

    /**
     * @type {app} the application object
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
     *
     * @return {Promise<>}
     */
    all() {
        return this._app.browserApi.windows.getAll()
            .then(dtoArrKitView => dtoArrKitView.map(this._app.kitCollect.getByView))

            // ожидание готовности окон - когда их состояние станет resolve
            .then(kits => Promise.all(kits.map(kit => {
                kit.setStatus('complete');
                return kit.ready();
            })))
            .catch(e => {
                console.warn('sync.openedKits', e);
                console.warn('Не удалось получение текущего состояния открытых окон и вкладок');
            });
    },


    kit(kitId) {

    },


    // синхронизировать вкладки
    // убрать лишние объекты
    tabs() {

    }
};
