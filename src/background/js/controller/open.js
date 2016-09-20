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
     * Подавить события, связанные с открытиями вкладок
     * поскольку при создании окон срабатывает callback,
     * что бы обработчики не гнались за событием
     */
    suppressEvent() {
        this._app.controllerEvent.suppress('createdTab');
    },

    /**
     * Восстановить обработку событий, связанных с открытием вкладок
     */
    resumeEvent() {
        this._app.controllerEvent.resume('createdTab');
    },


    /**
     * Открыть вкладки, сохраненные в storeOpen
     * @return {Promise.<T>} массив объектов окон @class KitItem
     */
    savedKits() {
        return this._app.storeOpen.getOpenSaved()
            .then(this.kits);
    },



    /**
     * Открытие нескольких окон со всеми вкладками
     * @param {object|Array} records объект или массив объектов окон @class Record todo создается в storeOpen
     * @return {Promise.<T>} массив открытых окон
     */
    kits(records) {
        this.suppressEvent();
        let promises;

        if (Array.isArray(records)) {
            promises = records.map(record => this._kit(record));
        } else {
            promises = [
                this._kit(records)
            ]
        }
        // todo потом оптимизировать - в большинстве случаев будет одно окно all - в редких случаях
        return Promise.all(promises)
            .then(kits => {
                this.resumeEvent();
                return kits;
            })
    },

    /**
     * Открытие окна и первой вкладки
     * Открытие происходит из сохраненных данных объект - @class Record
     * @param {object} record @class Record
     * @return {Promise.<T>} объект @class KitItem
     * @private
     */
    _kit(record) {
        const kitProps = this._app.kitConv.toOpen(record.getRawSaving());

        return new Promise(resolve => {
            this._app.chromeWindows.create(
                kitProps,
                (event) => {
                    let kit;
                    const kitRaw = this._app.kitConv.onCreatedKit(event);

                    if (kitRaw) {

                        kit = this._app.kitCollect.createItem(
                            this._app.kitConv.conjunction(
                                kitRaw,
                                record.getRawSaving()
                            )
                        );

                        // создание объектов вкладок

                        this._mergeTabs(kitRaw.tabs, record.getRawSaving().tabs);


                       // console.log ('...', kitRaw, kit, record.getRawSaving());

                        record.setKit(kit);
                    }
                    resolve(kit);
                }
            )
        });
    },


    _mergeTabs(tabs0, tabs1) {

        console.log (tabs0, tabs1);

    }



};
