/**
 * @type {Array} описание полей @class ItewKit
 *
 * поля объекта kit не содержат информации из view (открытого окна браузера)
 * при сохранении информация о положении окна, открытых вкладках, их истории, выбранной вкладке и т.д.
 * получается из api браузера
 *
 * данные, полученные из api или из сохранений сначала нормализуются, потом валидируются
 *
 */
app.kitFields = [

    {   // id окна браузера в системе
        name        : 'id',
        type        : 'number',
        private     : true,
        // default: 0          // значение по умолчанию
        // где использовать
        view        : true,    // окно браузера
        kit         : true,    // настройки окна
        model       : false,   // сохраненные данные
        // обязательные
        requireView : true,    // обязательное для объекта события
        requireKit  : true,    // обязательное для создания экземпляра
        requireModel: false,   // обязательное для сохраненных данных
        /**
         * Валидация
         * @param {number} val
         * @return {boolean}
         */
        valid(val) {
            return val > 0;
        },

        /**
         * Приводим тип значения к типу поля
         * Нужен только полям, которые получаем из view и/или model
         * @param {*} val
         * @return {number|null}
         */
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
        kit    : true,
        options: [
            'loading',      // у окна с таким статусом не обрабатываем события вкладок onActive, onMoved
            'removed',
            'complete'      // от момента создания
        ],
        valid(val) {
            return typeof val === 'string' ? this.options.indexOf(val) !== -1 : false
        },
        normalize(val) {
            return this.valid(val) ? val : null;
        }
    },

    {   // вкладки
        name        : 'tabs',
        type        : 'array',
        requireModel: true,
        valid(val) {
            return Array.isArray(val) && !!val.length;
        },
        normalize(val) {
            return Array.isArray(val) ? val : null;
        }
    },

    {   // не загружать вкладку, пока она не будет выбрана
        name   : 'tabDiscardCreate',
        type   : 'boolean',
        private: true,
        default: true,
        kit    : true,
        model  : true,
        valid(val) {
            return typeof val === 'boolean';
        },
        normalize(val) {
            return typeof val === 'boolean' ? val : null;
        }
    },

    // выгружать данные из вкладки, когда она не активна
    // варианты не активности: давно не открывалась
    // по прошествии заданного промежутка

    // ### на будущее
    {   // название окна, заданное пользователем
        name   : 'name',
        type   : 'string',
        private: true,
        default: '',
        kit    : true,
        model  : true,
        valid(val) {
            return typeof val === 'string';
        },
        normalize(val) {
            return typeof val === 'string' ? val : null;
        }
    },

    {   // заданное пользователем
        name   : 'title',
        type   : 'string',
        private: true,
        default: '',
        kit    : true,
        model  : true,
        valid(val) {
            return typeof val === 'string';
        },
        normalize(val) {
            return typeof val === 'string' ? val : null;
        }
    },

    {   // заданное пользователем
        name   : 'note',
        type   : 'string',
        private: true,
        default: '',
        kit    : true,
        model  : true,
        valid(val) {
            return typeof val === 'string';
        },
        normalize(val) {
            return typeof val === 'string' ? val : null;
        }
    },

    {   // номер активной вкладки
        name   : 'tabActive',
        type   : 'number',
        default: 0,
        model  : true,
        valid(val) {
            return typeof val === 'number' ? val >= 0 : false;
        },
        normalize(val) {
            const num = +val;
            return isFinite(num) ? num : null;
        }
    },

    {   // сохранять состояние закрытых вкладок
        name   : 'tabClosed',
        type   : 'boolean',
        private: true,
        default: true,
        kit    : true,
        model  : true,
        valid(val) {
            return typeof val === 'boolean';
        },
        normalize(val) {
            return typeof val === 'boolean' ? val : null;
        }
    },

    {   // сохранять историю url
        name   : 'tabHistory',
        type   : 'boolean',
        private: true,
        default: false,
        kit    : true,
        model  : true,
        valid(val) {
            return typeof val === 'boolean';
        },
        normalize(val) {
            return typeof val === 'boolean' ? val : null;
        }
    },

    // ################################################
    // поля view && record
    // ################################################

    // свернутое состояние окна браузера
    // "fullscreen" "minimized" "maximized" "normal"
    {
        name   : 'state',
        type   : 'string',
        default: '',
        view   : true,
        model  : true,
        options: [
            'fullscreen',
            'minimized',
            'maximized',
            'normal'
        ],

        valid(val) {
            return typeof val === 'string' ? this.options.indexOf(val) !== -1 : false
        },
        normalize(val) {
            return typeof val === 'string' && this.valid(val) ? val : null;
        }
    },

    // размеры окна
    {
        name   : 'width',
        type   : 'number',
        default: 0,
        view   : true,
        model  : true,
        valid(val) {
            return typeof val === 'number' ? val >= 0 : false;
        },
        normalize(val) {
            const num = +val;
            return isFinite(num) ? num : null;
        }
    },

    {
        name   : 'height',
        type   : 'number',
        default: 0,
        view   : true,
        model  : true,
        valid(val) {
            return typeof val === 'number' ? val >= 0 : false;
        },
        normalize(val) {
            const num = +val;
            return isFinite(num) ? num : null;
        }
    },

    // позиция на рабочем столе
    {
        name   : 'left',
        type   : 'number',
        default: 0,
        view   : true,
        model  : true,
        valid(val) {
            return typeof val === 'number' ? val >= 0 : false;
        },
        normalize(val) {
            const num = +val;
            return isFinite(num) ? num : null;
        }
    },

    {
        name   : 'top',
        type   : 'number',
        default: 0,
        view   : true,
        model  : true,
        valid(val) {
            return typeof val === 'number' ? val >= 0 : false;
        },
        normalize(val) {
            const num = +val;
            return isFinite(num) ? num : null;
        }
    }

];
