/**
 * @type {object} контроллер для сопоставления открытых вкладок с сохраненными данными
 */
app.controllerMapping = {
    // <debug>
    $className: 'controllerMapping',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,

    // </debug>



    // поиск соответствующей записи в store
    record(kit) {

        const tabs = this._app.tabCollect.getByKit(kit);


        console.log (23423453, tabs)






    }
















};
