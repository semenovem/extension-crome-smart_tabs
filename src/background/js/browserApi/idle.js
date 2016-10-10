/**
 * @type {object} состояние активности системы
 *
 * один обработчик
 *
 * addListener() пописаться
 * removeListener()  удалить обработчик
 *
 *
 */
app.browserApi.idle = {
    // <debug>
    $className: 'browserApi.idle',

    /**
     * @type {object} объект приложения
     */
    _app: null,

    /**
     * обработчик события
     */
    _callback: null,

    // </debug>

    /**
     * состяния
     */
    _state: {
        ACTIVE: {
            api: 'active',      // название события в api браузера
            app: 'ACTIVE'       // в приложении
        },
        IDLE: {
            api: 'idle',
            app: 'IDLE'
        },
        LOCKED: {
            api: 'locked',
            app: 'LOCKED'
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
     * @param {function} callback
     */
    addListener(callback) {
        if (!this._callback) {
            window.chrome.idle.onStateChanged.addListener(this._onEvent);
        }
        this._callback = callback;
    },

    /**
     * Удалить подписку
     */
    removeListener() {
        if (this._callback) {
            window.chrome.idle.onStateChanged.removeListener(this._onEvent);
            delete this._callback;
        }
    },

    /**
     * Обработчик
     * @param {string} newState новое состояние системы
     * @private
     */
    _onEvent(newState) {
        if (typeof this._callback !== 'function') {
            return;
        }

        switch (newState) {

            // компьютер заблокирован
            case this._state.LOCKED.api:
                this._callback(this._state.LOCKED.app);
                break;

            // простаивает
            case this._state.IDLE.api:
                this._callback(this._state.IDLE.app);
                break;

            // активен
            default:
                this._callback(this._state.ACTIVE.app);
        }
    }
};
