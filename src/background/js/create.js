/**
 * @type {object} создание окон и вкладок
 */
app.create = {
    // <debug>
    $className: 'create',

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
     * Открыть вкладки, сохраненные в storeOpen
     * @return {Promise.<>} массив объектов окон @class KitItem
     */
    saved() {
        return this._app.storeOpen.getSaved()
            .then(records => Promise.all(records.map(this.kit)));
    },


    /**
     * Открытие окна
     * @param {object} record
     * @return {Promise.<>} объект @class KitItem
     * @private
     */
    kit(record) {

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


      //  console.log ('app.create.kit:: record', record.model);

        //console.log (111, this._app.browserApi.windows.recordKitToOpen(record.model))

        //return Promise.resolve();

        return this._app.browserApi.windows.create(record.model)

            .then(view => {
                this._app.storeOpen.heapExclude(record.itemKey);
                const kit = this._app.kitCollect.getByView(view);

                kit.applyMapping({
                    view,
                    relevant: 1,
                    itemKey: record.itemKey,
                    model: record.model
                });

                // активация вкладки (переключение на сохраненную активную)
                if (record.model.tabActive) {
                    const tabView = view.tabs[record.model.tabActive];
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
