/**
 * @type {object} контроллер программного открытия окон и вкладок
 */
app.controllerOpen = {
    // <debug>
    $className: 'controlleOpen',

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
     * Подавить события, связанные с открытиями вкладок
     * поскольку при создании окон срабатывает callback,
     * что бы обработчики не гнались за событием
     */
    suppressEvent() {
        this._app.controllerEvent.suppress('onCreatedTab');
    },

    /**
     * Восстановить обработку событий, связанных с открытием вкладок
     */
    resumeEvent() {
        this._app.controllerEvent.resume('onCreatedTab');
    },


    /**
     * Открыть вкладки, сохраненные в storeOpen
     * @return {Promise.<>} массив объектов окон @class KitItem
     */
    saved() {
        return this._app.storeOpen.getSaved()
            .then(records => {
                this.suppressEvent();

                return Promise.all(
                    records.map(this.kit)
                )
                    .then(kits => {
                        this.resumeEvent();
                        return kits;
                    })
            });
    },


    /**
     * Открытие окна
     * Открытие происходит из сохраненных данных объект - @class Record
     * @param {object} record @class Record
     * @return {Promise.<>} объект @class KitItem
     * @private
     */
    kit(record) {
        return this._app.browserApi.createKit(record.recordKit)
            .then(eKit => {
                const collect = this._app.kitCollect;
                const kit = collect.getById(eKit.id) || collect.createItem(eKit);

                kit.conjunction(record.recordKit);
                this._app.storeOpen.heapExclude(record.itemKey);

                kit.setItemKey(record.itemKey);


            });
    },



};
