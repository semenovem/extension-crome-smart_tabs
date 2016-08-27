/**
 *
 * @class app.ItemTabModel
 */
app.itemTabModel = {
    // <debug>
    $className: 'itemTabModel',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Инициализация объекта
     */
    init() {
        this._app.ItemTab.prototype.model = this;
        // позаимствовать методы у @app.ItemModel
        let model = this._app.itemModel;
        this.validateToCreate = model.validateToCreate;
        this.validateAfterRestore = model.validateAfterRestore;
        this.validateTypeFields = model.validateTypeFields;
    },




    /**
     * поля объекта
     * @type {object}
     */
    fields: [

        {
            name: 'id',
            type: 'number',
            persist: false,
            requireForCreate: true
        },

        {   // вкладка закрыта
            name: 'closed',
            type: 'boolean',
            default: false
        },


        {   // сохранение истории
            name: 'history',
            type: 'boolean',
            default: false
        },


        {   // адрес
            name: 'url',
            type: 'string',
            requireForCreate: true,
            requireForRaw: true
        },
        {   //
            name: 'title',
            type: 'string',
            persist: false,
            requireForCreate: true
        },
        {   // фавикон
            name: 'favIconUrl',
            type: 'string',
            persist: false,
            requireForCreate: true
        },


        {   // история адресов, если ведется
            name: 'urlHistory',
            isArray: true,
            special: true
        }
    ]
};
