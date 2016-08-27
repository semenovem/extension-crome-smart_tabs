/**
 * the data object
 * @param opts
 * @constructor
 */
app.ItemTab = function() {

    let f = function(raw) {
        // <debug>
        this.$className = 'ItemTab';
        // </debug>

        this.model.fields
            .filter(field => field.requireForCreate === true || 'default' in field)
            .forEach(field => {
                let name = field.name;
                this[name] = name in raw ? raw[name] : field.default;
            });
    };

    // прототипные методы
    f.prototype = {
        /**
         * объекта - добавится на этапе init
         * @type {object}
         */
        model: null,

        /**
         * Присвоили окно
         * @param kit
         */
        setKit(kit) {
            this.kit = kit;
        },

        /**
         * Изменение состояния вкладки
         * обратно открыться она может если открывается тот же адрес в новой вкладке
         * или открывается из истории
         * @param closed
         */
        setClosed(closed) {
            if (this.closed ^ closed) {
                this.setModify(true);
            }
            this.closed = closed;
        },

        /**
         * @param modify
         */
        setModify(modify) {
            modify && this.kit && this.kit.setModify(true);
        },

        /**
         * изменение url
         * @param url
         */
        changedUrl(url) {
            this.url = url;
            this.setModify(true);
        },

        // #################
        // методы конвертации, валидации данных

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

            if (Array.isArray(this.urlHistory) && this.urlHistory.length) {
                // todo здесть вставить ограничение по кол-ву записей
                raw.urlHistory = this.urlHistory.slice(0, 100);
                //
            }
            return raw;
        }

    };

    return f;
}();