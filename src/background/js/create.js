/**
 * @type {app.create} создание окон и вкладок
 */
app.create = {
    // <debug>
    $className: 'create',

    /**
     * @type {object} the application object
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
     * Открыть вкладки, сохраненные в storeOpen
     * @return {Promise.<app.Kit[]>}
     */
    saved() {
        return this._app.storeOpen.getSaved()
            .then(dtoArrRecord => Promise.all(dtoArrRecord.map(this.kit)));
    },


    /**
     * Открытие окна
     * @param {app.dto.Record} dtoRecord
     * @return {Promise.<app.Kit>}
     * @private
     */
    kit(dtoRecord) {
        // несколько вариантов открытия / создания нового окна
        // - с пустыми страницами, которые загрузятся после получения фокуса
        // - с пустыми страницами, которые будут одна за другой загружаться, по мере освобождения канала

        //const tabs = model.model;

        //model.model.tabs = [
        //    {
        //        url: 'chrome-extension://ekekhdhcpbbhfldpaoelpcpebkcmnkjh/blank.html'
        //    },
        //    {
        //        url: 'chrome-extension://ekekhdhcpbbhfldpaoelpcpebkcmnkjh/blank.html'
        //    },
        //    {
        //        url: 'chrome-extension://ekekhdhcpbbhfldpaoelpcpebkcmnkjh/blank.html'
        //    }
        //];

        /*
          проверить состояние вкладки:
          если вкладка discarded
          поставить адрес пустой страницы

          ----
          при записи - не записывать url пустой страницы, сохраняя тот, который был до подмены
         */

        return this._app.browserApi.windows.create(dtoRecord.dtoKitTabModel)
            .then(dtoKitTabView => {

                this._app.storeOpen.heapExclude(dtoRecord.itemKey);
                const kit = this._app.kitCollect.getByView(dtoKitTabView);

                const dtoKitTabModel = dtoRecord.dtoKitTabModel;

                kit.applyMapping({
                    dtoKitTabView,
                    relevant: 1,
                    itemKey: dtoRecord.itemKey,
                    dtoKitTabModel
                });

                // активация вкладки (переключение на сохраненную активную)
                if (dtoKitTabModel.tabActive) {
                    const tabView = dtoKitTabView.tabs[dtoKitTabModel.tabActive];
                    if (tabView) {
                        const tab = this._app.tabCollect.getById(tabView.id);
                        tab && tab.active();
                    }
                }

                return kit;
            })
            .then(kit => {
                kit.setStatus('complete');
            })
    }
};
