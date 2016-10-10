/**
 * @type {object} прототип @class TabItem
 */
app.tabFields = [

    {
        name        : 'id',
        type        : 'number',
        view        : true,
        model       : true,
        requireView : true,
        requireModel: true,

        valid(val) {
            return val > 0;
        },
        normalize(val) {
            const num = +val;
            return isFinite(num) ? num : null;
        }
    },
    {   // id окна, которому принадлежит вкладка
        name       : 'kitId',
        type       : 'number',
        view       : true,
        model      : true,
        requireView: true,
        valid(val) {
            return val > 0;
        },
        normalize(val) {
            const num = +val;
            return isFinite(num) ? num : null;
        }
    },

    {   // вкладка закрыта
        name   : 'closed',
        type   : 'boolean',
        default: false,
        model  : true,
        store  : true,
        valid(val) {
            return typeof val === 'boolean';
        },
        normalize(val) {
            return typeof val === 'boolean' ? val : null;
        }
    },

    {   // сохранение истории
        name   : 'history',
        type   : 'boolean',
        default: false,
        model  : true,
        store  : true,
        valid(val) {
            return typeof val === 'boolean';
        },
        normalize(val) {
            return typeof val === 'boolean' ? val : null;
        }
    },

    {   // состояние вкладки - может быть выгружена из памяти
        name   : 'discarded',
        type   : 'boolean',
        default: false,
        model  : true
    },

    {   // адрес
        name        : 'url',
        type        : 'string',
        default     : '',
        view        : true,
        store       : true,
        requireView : true,
        requireStore: true,
        valid(val) {
            return typeof val === 'string';
        },
        normalize(val) {
            return typeof val === 'string' ? val : null;
        }
    },

    {   //
        name        : 'title',
        type        : 'string',
        default     : '',
        view        : true,
        store       : true,
        valid(val) {
            return typeof val === 'string';
        },
        normalize(val) {
            return typeof val === 'string' ? val : null;
        }
    },

    {   // фавикон
        name        : 'favIconUrl',
        type        : 'string',
        default     : '',
        view        : true,
        store       : true,
        valid(val) {
            return typeof val === 'string';
        },
        normalize(val) {
            return typeof val === 'string' ? val : null;
        }
    }
];