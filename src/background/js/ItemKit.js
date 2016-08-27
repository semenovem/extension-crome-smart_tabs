app.ItemKit = function() {

    /**
     * @param {object} raw
     * @param {object} store
     * @constructor
     */
    let f = function(raw, store) {
        // <debug>
        this.$className = 'ItemKit';
        // </debug>

        /**
         * @class app.Store
         * @type {object}
         */
        this.store = store;

        this.model.fields
            .filter(field => field.requireForCreate === true || 'default' in field)
            .forEach(field => {
                let name = field.name;
                this[name] = name in raw ? raw[name] : field.default;
            });

        /**
         * Вкладки
         * @type {Array}
         */
        this.tabs = [];
        // todo еще обработать объекты вкладок, они будут передаватся с сохранениями

        /**
         * состояние экземпляра. Промис выпролнится после нахождения / создания записи в store
         * @type {Promise}
         */
        this._stateReady = new Promise((resolve, reject) => {
            this._stateReadyResolve = resolve;
            this._stateReadyReject = reject;
        });

        // todo тестовая задержка
        //    setTimeout(this.setModify.bind(this, true), 800 + 190 * Math.random());

    };

    /**
     * Прототип для класса Kit
     */
    f.prototype = {

        _timeoutSave: 1000,
        /**
         * объекта - добавится на этапе init
         * @type {object}
         */
        model: null,

        /**
         * добавить вкладку
         * @param tab
         */
        addTab(tab) {
            if (!this.hasTabById(tab.id)) {
                this.tabs.push(tab);
                tab.setKit(this);
                this.setModify(true);
            }
            return this;
        },

        /**
         * убрать вкладку из окна
         * @param tab
         */
        removeTab(tab) {
            this.setModify(true);
            console.log('remove tab', tab);
            return this;
        },

        /**
         * проверка наличия вкладки
         * @param tab
         * @returns {boolean}
         */
        hasTab(tab) {
            return this.tabs.indexOf(tab) !== -1;
        },

        /**
         * проверка наличия вкладки
         * @param id
         * @returns {boolean}
         */
        hasTabById(id) {
            return this.tabs.some(tab => tab.id === id);
        },

        /**
         * Произошли изменения в данных, если true - нужно их сохранить
         * @param {boolean} modify
         * @returns {object}
         */
        setModify(modify) {
            this.modifyLastTime = Date.now();
            if (!this.modify && (this.modify = modify)) {
                this._timeoutBeforeSave(this._timeoutSave);
            }
            return this;
        },

        /**
         * запуск таймаута перед сохранением изменений
         * @param {number} timeout
         * @private
         */
        _timeoutBeforeSave(timeout) {
            setTimeout(() => {
                let timeout = this._timeoutSave,
                    diff = Date.now() - this.modifyLastTime;
                diff < timeout ? this._timeoutBeforeSave(timeout - diff) : this.saveModify();
            }, timeout);
        },

        /**
         *
         */
        saveModify() {
            this.modify = false;

            if (this.recordId) {
                this.store.saveRawOpen(this.getRaw(), this.recordId);
            }
            else {
                this.store.mapping(this)
                    .then(recordId => {
                        this.recordId = recordId || (this.setModify(true) && ('kit_open_' + this.id));
                    })
                    .then(() => this._stateReadyResolve())
                    .catch(e => this._stateReadyReject(e))
                    .then(() => {
                        delete this._stateReadyResolve;
                        delete this._stateReadyReject;
                    });
            }
        },

        /**
         * getter
         * @returns {Promise}
         */
        getStateReady() {
            return this._stateReady;
        },

        // #################
        // методы конвертации

        /**
         * Формирует данные для сохранения
         * Готовый объект содержит:
         * - обязательные поля при сериализации
         * - поля, значения которых отличаются от default
         * @returns {object}
         */
        getRaw() {
            let raw = this.model.fields.reduce((raw, field) => {
                let name = field.name;
                if (field.special !== true && field.persist !== false && field.default !== this[name]) {
                    raw[name] = this[name];
                }
                return raw;
            }, Object.create(null));

            raw.tabs = this.tabs.map(tab => tab.getRaw());
            return raw;
        }
    };

    return f;
}();



