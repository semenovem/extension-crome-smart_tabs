/**
 *
 * @class app.ItemKitModel
 */
app.itemKitModel = {
    // <debug>
    $className: 'itemKitModel',

    /**
     * Объект приложения
     * @type {object}
     */
    _app: null,
    // </debug>

    /**
     * Инициализация объекта
     *
     */
    init() {
        this._app.ItemKit.prototype.model = this;

        // позаимствовать методы @app.ItemModel
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
        {   // id окна браузера в системе
            name: 'id',
            type: 'number',
            persist: false,
            requireForCreate: true  // обязательность при создании новой записи
            // requireForRaw: true  // обязательность при создании объекта для сохранения
        },

        {   // ссылка на объект, отвечающий за сохранение
            name: 'recordId',
            type: 'string',
            persist: false
        },

        {   // номер активной вкладки
            name: 'tabActiv',
            type: 'number',
            default: 0
        },

        {   // есть ли необходимость сохранить данные
            name: 'modify',
            type: 'boolean',
            persist: false,
            default: false
        },

        {   // время последнего изменения в объекте
            name: 'modifyLastTime',
            type: 'number',
            persist: false,
            default: 0
        },


        {   // окно активно
            name: 'active',
            type: 'boolean',
            default: false
        },

        {   // свернутое состояние окна браузера
            name: 'minimized',
            type: 'boolean',
            default: false
        },
        // размеры окна
        {
            name: 'width',
            type: 'number',
            default: 0
        },
        {
            name: 'height',
            type: 'number',
            default: 0
        },

        // позиция на рабочем столе
        {
            name: 'posX',
            type: 'number',
            default: 0
        },
        {
            name: 'posY',
            type: 'number',
            default: 0
        },


        // ### на будущее
        {   // название окна, заданное пользователем
            name: 'customName',
            type: 'string',
            persist: false
        },
        {   // описание окна, заданное пользователем
            name: 'customTitle',
            type: 'string',
            persist: false
        },


        // ### Вкладки
        {   // список
            name: 'tabs',
            isArray: true,
            special: true
        },
        {   // сохранять состояние закрытых вкладок
            name: 'tabClosed',
            type: 'boolean',
            default: true
        },
        {   // сохранять историю url
            name: 'tabHistory',
            type: 'boolean',
            default: false
        }
    ]
};
