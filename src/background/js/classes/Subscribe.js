/**
 * Объект подписки на события
 *
 * @constructor
 */
app.Subscribe = function() {

    /**
     * Список событий
     * название события - ключ объекта
     * @type {object}
     * @private
     */
    this._events = Object.create(null);

    this.on = this.on.bind(this);
    this.un = this.un.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.eventCall = this.eventCall.bind(this);
};

/**
 * @type {object} прототип
 */
app.Subscribe.prototype = {

    /**
     * Подписка на событие
     * @param nameEvent
     * @param callback
     */
    on(nameEvent, callback) {
        const ev = this._events;
        if (nameEvent in ev !== true) {
            ev[nameEvent] = [];
        }
        ev[nameEvent].push(callback);
    },

    /**
     * Отписаться от события
     * @param nameEvent
     * @param callback
     */
    un(nameEvent, callback) {
        const ev = this._events;
        if (nameEvent in ev) {
            ev.reduceRight((notUse, val, ind) => {
                if (callback === val) {
                    ev.splice(ind, 1);
                }
            }, null);
            if (!ev.length) {
                delete this._events[nameEvent];
            }
        }
    },

    /**
     * Удалить событие (всех слушателей этого события)
     * @param {string} nameEvent название события, всех слушателей которого удаляем
     */
    removeEvent(nameEvent) {
        if (nameEvent in this._events) {
            delete this._events[nameEvent];
        }
    },

    /**
     * Удаление всех событий
     */
    removeAll() {
        for (let nameEvent in this._events) {
            delete this._events[nameEvent];
        }
    },

    /**
     * Вызов обработчиков события
     * @param {string} nameEvent
     * @param {Array} args
     */
    eventCall(nameEvent, ...args) {
        if (this._events[nameEvent]) {
            this._events[nameEvent].map(callback => callback.apply(null, args))
        }
    }

};
