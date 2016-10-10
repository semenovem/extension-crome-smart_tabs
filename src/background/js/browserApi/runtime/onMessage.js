/**
 * @type {object} обмен данными со вкладками
 *
 * addListener() пописаться
 * removeListener()  удалить обработчик
 *
 * из одного события делаем раздельную подписку на события на разных страницах
 *
 */
app.browserApi.runtime.onMessage = {
    // <debug>
    $className: 'browserApi.runtime.onMessage',

    /**
     * @type {object} объект приложения
     */
    _app: null,
    // </debug>

    /**
     * @type {object}
     */
    _pages: {
        _list: {},

        /**
         * Получаем обработчик для запрошенной страницы
         * @param {string} name название страницы
         */
        get(name) {
            return this._list[name];
        },
        /**
         * Добавить метод для страницы
         * @param {string} name название страницы, для которой сохраним функцию
         * @param {function} fn
         */
        set(name, fn) {
            this._list[name] = fn;
        },

        /**
         * Удалить функцию для указанной страницы
         * @param name
         */
        remove(name) {
            delete this._list[name];
        },

        /**
         * Удалить все
         */
        removeAll() {
            this._list = {};
        },

        /**
         * Есть ли указаная страница
         * @param name
         */
        has(name) {
            return name in this._list;
        },

        /**
         * Пустой список - нет подписанных на события страниц
         * @return {boolean}
         */
        isEmpty() {
            return !Object.keys(this._list).length;
        }
    },

    /**
     * Получение настроек
     * Добавить обработчик для события браузера
     */
    init() {
        this._app.binding(this);
    },

    /**
     * Подписка на событие
     * @param {string} pageName название страницы, с которой будет проходить коммуникация
     * @param {function} callback
     */
    addListener(pageName, callback) {
        if (this._pages.isEmpty()) {
            window.chrome.runtime.onMessage.addListener(this._onEvent);
        }
        this._pages.set(pageName, callback);
    },

    /**
     * Удалить подписку
     * @param {string} [page] название страницы
     */
    removeListener(page) {
        page ? this._pages.remove(page) : this._pages.removeAll();

        if (this._pages.isEmpty()) {
            window.chrome.runtime.onMessage.removeListener(this._onEvent);
        }
    },

    /**
     * Обработчик
     * @param {string} request содержание запрос
     * @param {string} sender информация о вкладке, которая создала запрос
     * @param {function} [sendResponse] функция callback
     * @private
     */
    _onEvent(request, sender, sendResponse) {
        let valid = typeof sendResponse === 'function';

        valid = valid && request && typeof request === 'object';
        valid = valid && typeof request.page === 'string';
        valid = valid && typeof request.method === 'string';

        if (valid) {
            if (!request.params || typeof request.params !== 'object') {
                request.params = {};
            }
        }

        if (valid && this._pages.has(request.page)) {
            return this._pages.get(request.page)(request, sender, sendResponse);
        }

        return false;
    }
};
