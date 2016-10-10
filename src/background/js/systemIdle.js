/**
 * @type {object} состояние активности системы
 *
 * Внешние интерфейсы
 *
 * methods:
 * on, un
 *
 * events:
 * onIdle, onLocked, onActive
 *
 */
app.systemIdle = {
    // <debug>
    $className: 'systemIdle',

    /**
     * @type {object} объект приложения
     */
    _app: null,

    /**
     * Настройки
     */
    _setup: null,

    /**
     * @type {object} объект подписки на события
     */
    _subscribe: null,
    // </debug>

    /**
     * Получение настроек
     * Добавить обработчик для события браузера
     */
    init() {
        this._subscribe = new this._app.Subscribe;
        this._app.binding(this);

        // ожидание готовности приложения
        this._app.ready()
            .then(() => {
                this._setup = this._app.setup.get('systemIdle');
                this._app.browserApi.idle.addListener(this._onStateChanged);
            });
    },

    /**
     * Удаление объекта
     */
    destroy() {
        this._app.browserApi.idle.removeListener();
        this._subscribe.removeAll();
    },

    /**
     * Подписаться на событие измнения состояния использования системы
     * @param {string} nameEvent
     * @param {function} callback
     * @return {object}
     */
    on(nameEvent, callback) {
        return this._subscribe.on(nameEvent, callback);
    },

    /**
     * Отписаться
     * @param {string} nameEvent
     * @param {function} callback
     * @return {object}
     */
    un(nameEvent, callback) {
        return this._subscribe.un(nameEvent, callback);
    },

    /**
     * получить текущий статус
     * @return {Promise}
     */
    getState() {},



    /**
     * Обработчик изменения состояния
     * @param newState
     * @private
     */
    _onStateChanged(newState) {

        console.log ('Изменилось состояние idle', new Date, newState);

        switch (newState) {
            // компьютер заблокирован
            case 'LOCKED':
                this._subscribe.eventCall('onLocked');
                break;

            // простаивает
            case 'IDLE':
                this._subscribe.eventCall('onIdle');
                break;

            // активен
            default:
                this._subscribe.eventCall('onActive');
        }
    },



    // при переходе в режим блокировки системы

    // при отсутствии активности пользователя - можно выполнять синхронизацию и запускать сохранение

    // при активности пользователя, можно увеличивать интервал сохранения данных
    // отключать какие то очень нужные части приложения




};
