/**
 * @type {object} cинхронизация состояний окон и сохраненных данных
 */
app.sync = {
    // <debug>
    $className: 'sync',

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
     *
     * объекты kit, tab
     * view kit, tab
     *
     * @return {Promise<>}
     */
    all() {
        return this._app.browserApi.windows.getAll()
            .then(views => views.map(this._app.kitCollect.getByView))

            // ожидание готовности окон - когда их состояние станет resolve
            .then(kits => Promise.all(kits.map(kit => kit.ready())))
            .catch(e => {
                console.warn('sync.openedKits', e);
                console.warn('Не удалось получение текущего состояния открытых окон и вкладок');
            });
    },



    kit(id) {

    },


    // синхронизировать вкладки
    // убрать лишние объекты
    tabs() {

    }
};
