/**
 * @type {object} прототип @class TabItem
 */
app.tabFields = [

    {
        name       : 'id',
        type       : 'number',
        private    : true,
        view       : true,
        tab        : true,
        requireView: true,
        requireTab : true,
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
        private    : true,
        view       : true,
        requireView: true,
        valid(val) {
            return val > 0;
        },
        normalize(val) {
            const num = +val;
            return isFinite(num) ? num : null;
        }
    },


    // состояние объекта
    {
        name   : 'status',
        type   : 'string',
        default: 'loading',
        tab    : true,
        options: [
            'loading',
            'removed',
            'complete'
        ],
        valid(val) {
            return typeof val === 'string' ? this.options.indexOf(val) !== -1 : false
        },
        normalize(val) {
            return this.valid(val) ? val : null;
        }
    },


    {   // сохранение истории
        name   : 'history',
        type   : 'boolean',
        private: true,
        default: false,
        tab    : true,
        model  : true,
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
        private: true,
        default: false,
        tab    : true
    },

    {   // адрес
        name        : 'url',
        type        : 'string',
        private     : true,
        default     : '',
        view        : true,
        tab         : true,
        model       : true,
        requireView : true,
        requireTab  : true,
        requireStore: true,
        valid(val) {
            return typeof val === 'string';
        },
        normalize(val) {
            return typeof val === 'string' ? val : null;
        }
    },

    {   // оглавление страницы
        name   : 'title',
        type   : 'string',
        private: true,
        default: '',
        view   : true,
        tab    : true,
        model  : true,
        valid(val) {
            return typeof val === 'string';
        },
        normalize(val) {
            return typeof val === 'string' ? val : null;
        }
    },

    {   // фавикон
        name   : 'favIconUrl',
        type   : 'string',
        private: true,
        default: '',
        view   : true,
        tab    : true,
        model  : true,
        valid(val) {
            return typeof val === 'string';
        },
        normalize(val) {
            return typeof val === 'string' ? val : null;
        }
    }
];